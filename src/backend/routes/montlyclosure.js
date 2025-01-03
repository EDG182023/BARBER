const express = require("express");
const Sale = require("../models/Sale");
const Advance = require("../models/Advance");
const FixedExpense = require("../models/Fixedexpense");
const Percentage = require("../models/Percentage"); // Importar el modelo de porcentajes

const router = express.Router();

// Función para obtener el porcentaje del barbero para un mes específico
async function getBarberPercentageForMonth(monthKey) {
  const startOfMonth = new Date(monthKey);
  const endOfMonth = new Date(new Date(monthKey).setMonth(startOfMonth.getMonth() + 1) - 1);

  const percentage = await Percentage.findOne({
    startDate: { $lte: startOfMonth },
    endDate: { $gte: endOfMonth },
  });

  return percentage ? percentage.value : 0; // Retorna el valor del porcentaje o 0 si no se encuentra
}

/// Ruta para calcular y obtener el cierre de mes
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find();
    const advances = await Advance.find();
    const fixedExpenses = await FixedExpense.find();

    const monthlyData = {};

    // Procesar ventas
    sales.forEach((sale) => {
      const monthKey = new Date(sale.timestamp).toISOString().slice(0, 7); // Año-Mes
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          totalSales: 0,
          totalServices: 0,
          totalAdvances: 0,
          totalEmployeeExpenses: 0,
          totalFixedExpenses: 0,
          totalCompanyEarnings: 0,
          barberSalary: 0,
        };
      }
      monthlyData[monthKey].totalSales += sale.amount;
      monthlyData[monthKey].totalServices += 1; // Asumimos 1 servicio por venta
      monthlyData[monthKey].totalCompanyEarnings += sale.shopEarnings || 0;
    });

    // Procesar avances (como valores negativos)
    advances.forEach((advance) => {
      const monthKey = new Date(advance.date).toISOString().slice(0, 7);
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          totalSales: 0,
          totalServices: 0,
          totalAdvances: 0,
          totalEmployeeExpenses: 0,
          totalFixedExpenses: 0,
          totalCompanyEarnings: 0,
          barberSalary: 0,
        };
      }
      monthlyData[monthKey].totalAdvances += advance.amount; // Sumar avances como positivo
    });

    // Procesar gastos fijos
    fixedExpenses.forEach((expense) => {
      const monthKey = new Date(expense.endDate).toISOString().slice(0, 7);
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          totalSales: 0,
          totalServices: 0,
          totalAdvances: 0,
          totalEmployeeExpenses: 0,
          totalFixedExpenses: 0,
          totalCompanyEarnings: 0,
          barberSalary: 0,
        };
      }
      monthlyData[monthKey].totalFixedExpenses += expense.amount;
    });

    // Calcular datos mensuales
    for (const monthKey of Object.keys(monthlyData)) {
      const barberPercentage = await getBarberPercentageForMonth(monthKey);

      // Calcular el salario del barbero (porcentaje de las ventas)
      const barberSalary = monthlyData[monthKey].totalSales * (barberPercentage / 100);

      // Ajustar el salario del barbero restando los avances ya dados
      monthlyData[monthKey].barberSalary = Math.max(barberSalary - monthlyData[monthKey].totalAdvances, 0);

      // Calcular los gastos de empleados (solo el salario del barbero)
      monthlyData[monthKey].totalEmployeeExpenses = monthlyData[monthKey].barberSalary;

      // Calcular las ganancias netas de la barbería
      monthlyData[monthKey].netEarnings =
        monthlyData[monthKey].totalSales -
        monthlyData[monthKey].totalFixedExpenses -
        monthlyData[monthKey].barberSalary; // Aquí ya se ha restado el salario del barbero (que incluye los avances)
    }

    res.status(200).json(Object.entries(monthlyData).map(([month, data]) => ({ month, ...data })));
  } catch (error) {
    console.error("Error al calcular el cierre de mes:", error);
    res.status(500).json({ error: "Error al calcular el cierre de mes" });
  }
});

module.exports = router;
