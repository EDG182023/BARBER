const express = require("express");
const Barber = require("../models/Barber");

const router = express.Router();

// Crear un barbero
router.post("/", async (req, res) => {
  try {
    const newBarber = new Barber(req.body);
    const savedBarber = await newBarber.save();
    res.status(201).json(savedBarber);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los barberos
router.get("/", async (req, res) => {
  const barbers = await Barber.find();
  res.json(barbers);
});

module.exports = router;
