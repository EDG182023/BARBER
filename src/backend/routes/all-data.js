const express = require("express");
const Sale = require("../models/Sale");
const Advance = require("../models/Advance");
const FixedExpense = require("../models/Fixedexpense");

const router = express.Router();

router.get("/", async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "startDate y endDate son requeridos." });
  }

  try {
    // Filtrar las ventas por rango de fechas
    const sales = await Sale.find({
      timestamp: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });

    // Filtrar los avances por rango de fechas
    const advances = await Advance.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).populate("barberId");

    // Filtrar los gastos fijos por rango de fechas
    const fixedExpenses = await FixedExpense.find({
      startDate: { $lte: new Date(endDate) },
      endDate: { $gte: new Date(startDate) },
    });

    // Enviar los datos combinados
    res.status(200).json({
      sales,
      advances,
      fixedExpenses,
    });
  } catch (error) {
    console.error("Error al obtener los datos combinados:", error);
    res.status(500).json({ error: "Error al obtener los datos combinados" });
  }
});

module.exports = router;
