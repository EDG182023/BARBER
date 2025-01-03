const express = require("express");
const Percentage = require("../models/Percentage");

const router = express.Router();

// Crear un porcentaje
router.post("/", async (req, res) => {
  try {
    const newPercentage = new Percentage(req.body);
    const savedPercentage = await newPercentage.save();
    res.status(201).json(savedPercentage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los porcentajes
router.get("/", async (req, res) => {
  const percentages = await Percentage.find().populate("barber");
  res.json(percentages);
});

module.exports = router;
