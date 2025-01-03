const express = require("express");
const Advance = require("../models/Advance");
const FixedExpense = require("../models/Fixedexpense");

const router = express.Router();

// -------------------- Adelantos (Advances) --------------------

// Crear un adelanto
router.post("/advances", async (req, res) => {
  try {
    const { barberId, amount, description, date } = req.body;

    if (!barberId || !amount || !description || !date) {
      return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    const newAdvance = new Advance({ barberId, amount, description, date });
    const savedAdvance = await newAdvance.save();
    res.status(201).json(savedAdvance);
  } catch (error) {
    console.error("Error al registrar adelanto:", error);
    res.status(500).json({ error: "Error al registrar adelanto" });
  }
});

// Listar adelantos por barbero
router.get("/advances/:barberId", async (req, res) => {
  try {
    const advances = await Advance.find({ barberId: req.params.barberId }).populate("barberId");
    res.status(200).json(advances);
  } catch (error) {
    console.error("Error al obtener adelantos:", error);
    res.status(500).json({ error: "Error al obtener adelantos" });
  }
});

// Listar todos los adelantos
router.get("/advances", async (req, res) => {
  try {
    const advances = await Advance.find().populate("barberId");
    res.status(200).json(advances);
  } catch (error) {
    console.error("Error al obtener adelantos:", error);
    res.status(500).json({ error: "Error al obtener adelantos" });
  }
});

// Actualizar un adelanto
router.put("/advances/:id", async (req, res) => {
  try {
    const advance = await Advance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!advance) {
      return res.status(404).json({ error: "Adelanto no encontrado." });
    }
    res.status(200).json({ message: "Adelanto actualizado", advance });
  } catch (error) {
    console.error("Error al actualizar adelanto:", error);
    res.status(500).json({ error: "Error al actualizar adelanto" });
  }
});

// -------------------- Gastos Fijos (Fixed Expenses) --------------------

// Crear un gasto fijo
router.post("/fixed-expenses", async (req, res) => {
  try {
    const { expenseName, amount, description, startDate, endDate } = req.body;

    if (!expenseName || !amount || !description || !startDate || !endDate) {
      return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    const fixedExpense = new FixedExpense({ expenseName, amount, description, startDate, endDate });
    const savedExpense = await fixedExpense.save();
    res.status(201).json({ message: "Gasto fijo registrado exitosamente", savedExpense });
  } catch (error) {
    console.error("Error al registrar gasto fijo:", error);
    res.status(500).json({ error: "Error al registrar gasto fijo" });
  }
});

// Listar todos los gastos fijos
router.get("/fixed-expenses", async (req, res) => {
  try {
    const fixedExpenses = await FixedExpense.find();
    res.status(200).json(fixedExpenses);
  } catch (error) {
    console.error("Error al obtener gastos fijos:", error);
    res.status(500).json({ error: "Error al obtener gastos fijos" });
  }
});

module.exports = router;
