const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const barberRoutes = require("./routes/barbers");
const percentageRoutes = require("./routes/percentages");
const saleRoutes = require("./routes/sales");
const advancesExpensesRoutes = require("./routes/advancesExpenses");
const monthlyClosure = require("./routes/montlyclosure")
const alldata = require ("./routes/all-data")

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
const MONGO_URI = "mongodb+srv://Paraman:Paraman17402024@cluster0.enh52.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch((err) => console.error("Error al conectar MongoDB:", err));

// Rutas
app.use("/barbers", barberRoutes);
app.use("/percentages", percentageRoutes);
app.use("/sales", saleRoutes);
app.use("/advances", advancesExpensesRoutes);
app.use("/monthlyclosure", monthlyClosure);
app.use("/alldata", alldata);
// Servidor
const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
