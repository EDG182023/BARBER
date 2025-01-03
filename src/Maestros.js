import React, { useState, useEffect } from "react";
import API from "./api/axios";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const Maestros = () => {
  const [barbers, setBarbers] = useState([]);
  const [percentages, setPercentages] = useState([]);
  const [advances, setAdvances] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [openBarberDialog, setOpenBarberDialog] = useState(false);
  const [openPercentageDialog, setOpenPercentageDialog] = useState(false);
  const [openAdvanceDialog, setOpenAdvanceDialog] = useState(false);
  const [openExpenseDialog, setOpenExpenseDialog] = useState(false);
  const [newBarber, setNewBarber] = useState({ name: "", email: "" });
  const [newPercentage, setNewPercentage] = useState({
    barber: "",
    startDate: "",
    endDate: "",
    percentage: "",
  });
  const [newAdvance, setNewAdvance] = useState({
    barber: "",
    amount: "",
    description: "",
    date: "",
  });
  const [newExpense, setNewExpense] = useState({
    name: "",
    amount: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  // Obtener barberos
  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const response = await API.get("/barbers");
        setBarbers(response.data);
      } catch (error) {
        console.error("Error al obtener barberos:", error);
      }
    };

    fetchBarbers();
  }, []);

  // Crear un nuevo barbero
  const createBarber = async () => {
    try {
      const response = await API.post("/barbers", newBarber);
      setBarbers((prevBarbers) => [...prevBarbers, response.data]);
      setOpenBarberDialog(false);
      setNewBarber({ name: "", email: "" });
    } catch (error) {
      console.error("Error al crear barbero:", error);
    }
  };

  // Obtener porcentajes
  useEffect(() => {
    const fetchPercentages = async () => {
      try {
        const response = await API.get("/percentages");
        setPercentages(response.data);
      } catch (error) {
        console.error("Error al obtener porcentajes:", error);
      }
    };

    fetchPercentages();
  }, []);

  // Crear un nuevo porcentaje
  const createPercentage = async () => {
    try {
      const response = await API.post("/percentages", newPercentage);
      setPercentages((prevPercentages) => [...prevPercentages, response.data]);
      setOpenPercentageDialog(false);
      setNewPercentage({ barber: "", startDate: "", endDate: "", percentage: "" });
    } catch (error) {
      console.error("Error al crear porcentaje:", error);
    }
  };

  // Obtener adelantos
  useEffect(() => {
    const fetchAdvances = async () => {
      try {
        const response = await API.get("/advances/advances");
        setAdvances(response.data);
      } catch (error) {
        console.error("Error al obtener adelantos:", error);
      }
    };

    fetchAdvances();
  }, []);

  // Crear un nuevo adelanto
  const createAdvance = async () => {
    try {
      const response = await API.post("/advances/advances", newAdvance);
      setAdvances((prevAdvances) => [...prevAdvances, response.data]);
      setOpenAdvanceDialog(false);
      setNewAdvance({ barberId: "", amount: "", description: "", date: ""});
    } catch (error) {
      console.error("Error al crear adelanto:", error);
    }
  };

  // Obtener gastos fijos
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await API.get("/advances/fixed-expenses");
        setExpenses(response.data);
      } catch (error) {
        console.error("Error al obtener gastos fijos:", error);
      }
    };

    fetchExpenses();
  }, []);

  // Crear un nuevo gasto fijo
  const createExpense = async () => {
    try {
      const response = await API.post("/advances/fixed-expenses", newExpense);
      setExpenses((prevExpenses) => [...prevExpenses, response.data]);
      setOpenExpenseDialog(false);
      setNewExpense({ expenseName: "", amount: "", description: "", startDate: "", endDate: "" });
    } catch (error) {
      console.error("Error al crear gasto fijo:", error);
    }
  };

    // Exportar datos a Excel
    const exportToExcel = (data, filename) => {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(blob, `${filename}.xlsx`);
    };



  return (
    <div style={{ padding: "20px" }}>
    <h1>Gestión de Maestros</h1>

    <Box marginBottom={4} display="flex" gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenBarberDialog(true)}
        >
          Registrar Barbero
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setOpenPercentageDialog(true)}
        >
          Registrar Porcentaje
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => setOpenAdvanceDialog(true)}
        >
          Registrar Avances
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={() => setOpenExpenseDialog(true)}
        >
          Registrar Gastso fijos
        </Button>
       </Box> 
        
    {/* Tabla de Barberos Registrados */}
    <Box
        sx={{
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          padding: "16px",
          marginBottom: "24px",
        }}
      >
    <h2>Barberos Registrados</h2>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => exportToExcel(barbers, "Barberos_Registrados")}
      >
        Descargar Excel
      </Button>
    </Box>
    <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {barbers.map((barber) => (
            <TableRow key={barber._id}>
              <TableCell>{barber.name}</TableCell>
              <TableCell>{barber.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
    {/* Tabla de Porcentajes Registrados */}
    <Box
        sx={{
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          padding: "16px",
          marginBottom: "24px",
        }}
      >
    <h2>Porcentajes Registrados</h2>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Button
        variant="contained"
        color="secondary"
        onClick={() =>
          exportToExcel(
            percentages.map((percentage) => ({
              Barbero: percentage.barber.name,
              Desde: new Date(percentage.startDate).toLocaleDateString(),
              Hasta: new Date(percentage.endDate).toLocaleDateString(),
              Porcentaje: `${percentage.percentage}%`,
            })),
            "Porcentajes_Registrados"
          )
        }
      >
        Descargar Excel
      </Button>
    </Box>
    <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Barbero</TableCell>
            <TableCell>Desde</TableCell>
            <TableCell>Hasta</TableCell>
            <TableCell>Porcentaje</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {percentages.map((percentage) => (
            <TableRow key={percentage._id}>
              <TableCell>{percentage.barber.name}</TableCell>
              <TableCell>{new Date(percentage.startDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(percentage.endDate).toLocaleDateString()}</TableCell>
              <TableCell>{percentage.percentage}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>

      <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Adelantos y Gastos Fijos
      </Typography>

      {/* Contenedor para tabla de adelantos */}
      <Box
        sx={{
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          padding: "16px",
          marginBottom: "24px",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Adelantos Registrados
        </Typography>
        <Button
          variant="contained"
          color="primary"
          style={{ marginBottom: "16px" }}
          onClick={() => exportToExcel(advances, "Adelantos")}
        >
          Exportar Adelantos a Excel
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Barbero</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {advances.map((advance) => (
                <TableRow key={advance._id}>
                  <TableCell>{advance.barberId?.name || "Desconocido"}</TableCell>
                  <TableCell>${advance.amount}</TableCell>
                  <TableCell>{advance.description}</TableCell>
                  <TableCell>{new Date(advance.date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Contenedor para tabla de gastos fijos */}
      <Box
        sx={{
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          padding: "16px",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Gastos Fijos Registrados
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          style={{ marginBottom: "16px" }}
          onClick={() => exportToExcel(expenses, "Gastos_Fijos")}
        >
          Exportar Gastos Fijos a Excel
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Desde</TableCell>
                <TableCell>Hasta</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense._id}>
                  <TableCell>{expense.name}</TableCell>
                  <TableCell>${expense.amount}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{new Date(expense.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(expense.endDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>

      {/* Dialog para registrar barbero */}
      <Dialog open={openBarberDialog} onClose={() => setOpenBarberDialog(false)}>
        <DialogTitle>Registrar Barbero</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            fullWidth
            margin="dense"
            value={newBarber.name}
            onChange={(e) => setNewBarber({ ...newBarber, name: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={newBarber.email}
            onChange={(e) => setNewBarber({ ...newBarber, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBarberDialog(false)}>Cancelar</Button>
          <Button onClick={createBarber} variant="contained" color="primary">
            Registrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para registrar porcentaje */}
      <Dialog open={openPercentageDialog} onClose={() => setOpenPercentageDialog(false)}>
        <DialogTitle>Registrar Porcentaje</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Barbero"
            fullWidth
            margin="dense"
            value={newPercentage.barber}
            onChange={(e) => setNewPercentage({ ...newPercentage, barber: e.target.value })}
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Seleccione un barbero</option>
            {barbers.map((barber) => (
              <option key={barber._id} value={barber._id}>
                {barber.name}
              </option>
            ))}
          </TextField>
          <TextField
            label="Desde"
            type="date"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={newPercentage.startDate}
            onChange={(e) => setNewPercentage({ ...newPercentage, startDate: e.target.value })}
          />
          <TextField
            label="Hasta"
            type="date"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={newPercentage.endDate}
            onChange={(e) => setNewPercentage({ ...newPercentage, endDate: e.target.value })}
          />
          <TextField
            label="Porcentaje"
            type="number"
            fullWidth
            margin="dense"
            value={newPercentage.percentage}
            onChange={(e) => setNewPercentage({ ...newPercentage, percentage: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPercentageDialog(false)}>Cancelar</Button>
          <Button onClick={createPercentage} variant="contained" color="secondary">
            Registrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para registrar adelanto */}
      <Dialog open={openAdvanceDialog} onClose={() => setOpenAdvanceDialog(false)}>
        <DialogTitle>Registrar Adelanto</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Barbero"
            fullWidth
            margin="dense"
            value={newAdvance.barber}
            onChange={(e) => setNewAdvance({ ...newAdvance, barberId: e.target.value })}
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Seleccione un barbero</option>
            {barbers.map((barber) => (
              <option key={barber._id} value={barber._id}>
                {barber.name}
              </option>
            ))}
          </TextField>
          <TextField
            label="Monto"
            type="number"
            fullWidth
            margin="dense"
            value={newAdvance.amount}
            onChange={(e) => setNewAdvance({ ...newAdvance, amount: e.target.value })}
          />
          <TextField
            label="Descripción"
            fullWidth
            margin="dense"
            value={newAdvance.description}
            onChange={(e) => setNewAdvance({ ...newAdvance, description: e.target.value })}
          />
          <TextField
            label="Fecha"
            type="date"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={newAdvance.date}
            onChange={(e) => setNewAdvance({ ...newAdvance, date: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdvanceDialog(false)}>Cancelar</Button>
          <Button onClick={createAdvance} variant="contained" color="success">
            Registrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para registrar gasto fijo */}
      <Dialog open={openExpenseDialog} onClose={() => setOpenExpenseDialog(false)}>
        <DialogTitle>Registrar Gasto Fijo</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            fullWidth
            margin="dense"
            value={newExpense.expenseName}
            onChange={(e) => setNewExpense({ ...newExpense, expenseName: e.target.value })}
          />
          <TextField
            label="Monto"
            type="number"
            fullWidth
            margin="dense"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
          />
          <TextField
            label="Categoría"
            fullWidth
            margin="dense"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
          />
          <TextField
            label="Desde"
            type="date"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={newExpense.startDate}
            onChange={(e) => setNewExpense({ ...newExpense, startDate: e.target.value })}
          />
          <TextField
            label="Hasta"
            type="date"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={newExpense.endDate}
            onChange={(e) => setNewExpense({ ...newExpense, endDate: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExpenseDialog(false)}>Cancelar</Button>
          <Button onClick={createExpense} variant="contained" color="warning">
            Registrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Maestros;
