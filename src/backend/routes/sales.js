const express = require("express");
const Sale = require("../models/Sale");
const Advance = require("../models/Advance");
const Barber = require("../models/Barber");
const axios = require("axios");
const csv = require("csv-parser");

const router = express.Router();

// Función para convertir fechas al formato ISO 8601
const parseDate = (dateString) => {
  try {
    const [day, month, yearAndTime] = dateString.split("/");
    const [year, time] = yearAndTime.split(" ");
    return new Date(`${year}-${month}-${day}T${time}`);
  } catch {
    return null;
  }
};

router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find();
    res.status(200).json(sales);
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    res.status(500).json({ error: "Error al obtener las ventas" });
  }
});

// Ruta para importar ventas y calcular avances
router.post("/import", async (req, res) => {
  try {
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT4SAIvGtTDG_V-38Euuv9pFyfdmjl-GL08vA8aiym3JSzF-injRam6NzLY7YCK1cJhhRmWqWNI0xeo/pub?gid=2064678619&single=true&output=csv";
    const salesData = [];

    // Leer el CSV
    const response = await axios.get(csvUrl, { responseType: "stream" });
    response.data
      .pipe(csv())
      .on("data", (row) => {
        const parsedDate = parseDate(row["Marca temporal"]);
        if (parsedDate) {
          salesData.push({
            timestamp: parsedDate,
            barber: row["Barbero"],
            service: row["Servicio"],
            paymentMethod: row["Metodo de pago"],
            amount: parseFloat(row["Monto"] || 0),
          });
        }
      })
      .on("end", async () => {
        try {
          // Consultar avances
          const advances = await Advance.find().populate("barberId");

          // Procesar las ventas e incluir avances
          const processedSales = salesData.map((sale) => {
            // Buscar avances del barbero para el día de la venta
            const barberAdvances = advances.filter(
              (advance) =>
                advance.barberId.name === sale.barber &&
                new Date(advance.date).toDateString() === new Date(sale.timestamp).toDateString()
            );

            // Calcular el total de avances del día
            const totalAdvances = barberAdvances.reduce((sum, advance) => sum + advance.amount, 0);

            // Agregar la columna "advances" y calcular el salario neto
            return {
              ...sale,
              advances: -totalAdvances, // Avances en negativo
              netBarberEarnings: sale.amount * 0.5 - totalAdvances, // Ejemplo: 50% del monto menos avances
            };
          });

          // Insertar las ventas procesadas
          await Sale.insertMany(processedSales);

          res.status(201).json({
            message: "Ventas importadas con avances anexados",
            sales: processedSales,
          });
        } catch (error) {
          console.error("Error al procesar las ventas:", error);
          res.status(500).json({ error: "Error al procesar las ventas" });
        }
      });
  } catch (error) {
    console.error("Error al importar ventas:", error);
    res.status(500).json({ error: "Error al importar ventas" });
  }
});

module.exports = router;
