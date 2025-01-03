import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Grid,
  Button,
  TextField,
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import API from "./api/axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Dashboard = () => {
  const [sales, setSales] = useState([]);
  const [advances, setAdvances] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [totals, setTotals] = useState({
    totalServices: 0,
    totalSales: 0,
    totalAdvances: 0,
    totalEmployeeExpenses: 0,
    totalFixedExpenses: 0,
    totalCompanyEarnings: 0,
  });
  const [monthlyClosure, setMonthlyClosure] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await API.get(
          `/alldata?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
        );
        const { sales = [], advances = [], expenses = [] } = response.data || {};

        setSales(sales);
        setAdvances(advances);
        setExpenses(expenses);

        const totalServices = sales.length;
        const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
        const totalAdvances = advances.reduce((sum, advance) => sum + advance.amount, 0);
        const totalEmployeeExpenses = sales.reduce(
          (sum, sale) => sum + (sale.barberEarnings || 0),
          0
        )-totalAdvances;
        const totalFixedExpenses = expenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );
        const totalCompanyEarnings = totalSales - totalEmployeeExpenses - totalFixedExpenses + totalAdvances;
        
        setTotals({
          totalServices,
          totalSales,
          totalAdvances,
          totalEmployeeExpenses,
          totalFixedExpenses,
          totalCompanyEarnings,
        });
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  useEffect(() => {
    const fetchMonthlyClosure = async () => {
      try {
        const response = await API.get(`/monthlyclosure?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
        setMonthlyClosure(response.data || []);
      } catch (error) {
        console.error("Error al obtener cierre mensual:", error);
      }
    };

    fetchMonthlyClosure();
  }, [dateRange]);

  const exportToExcel = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${filename}.xlsx`);
  };

  return (
    <Box padding="20px">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Filtro de Fechas */}
      <Box marginBottom={4} display="flex" gap={2}>
        <TextField
          label="Desde"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dateRange.startDate}
          onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
        />
        <TextField
          label="Hasta"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dateRange.endDate}
          onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
        />
      </Box>

      {/* Contadores */}
      <Grid container spacing={2} marginBottom={4}>
        {[
          { label: "Servicios Totales", value: totals.totalServices, color: "#43C9E0" },
          { label: "Ventas Totales", value: totals.totalSales, color: "#4365E0" },
          { label: "Adelantos Totales", value: totals.totalAdvances, color: "#4397E0" },
          { label: "Gastos de Empleados", value: totals.totalEmployeeExpenses, color: "#43E0C5" },
          { label: "Gastos Fijos", value: totals.totalFixedExpenses, color: "#5343E0" },
          { label: "Ganancias de la Empresa", value: totals.totalCompanyEarnings, color: "#278DE6" },
        ].map((item, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Box
              sx={{
                backgroundColor: item.color,
                color: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                textAlign: "center",
              }}
            >
              <Typography variant="h6">{item.label}</Typography>
              <Typography variant="h5">${item.value.toFixed(2)}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Tabla de Cierre de Mes */}
      <Typography variant="h6" gutterBottom>
        Cierre de Mes
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => exportToExcel(monthlyClosure, "Cierre_Mensual")}
        >
          Descargar Cierre de Mes
        </Button>
      </Box>
      <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mes</TableCell>
              <TableCell>Servicios Totales</TableCell>
              <TableCell>Ventas Totales</TableCell>
              <TableCell>Adelantos Totales</TableCell>
              <TableCell>Gastos de Empleados</TableCell>
              <TableCell>Gastos Fijos</TableCell>
              <TableCell>Ganancias de la Empresa</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {monthlyClosure.map((month, index) => (
              <TableRow key={index}>
                <TableCell>{month.month}</TableCell>
                <TableCell>{month.totalServices}</TableCell>
                <TableCell>${month.totalSales.toFixed(2)}</TableCell>
                <TableCell>${month.totalAdvances.toFixed(2)}</TableCell>
                <TableCell>${month.totalEmployeeExpenses.toFixed(2)}</TableCell>
                <TableCell>${month.totalFixedExpenses.toFixed(2)}</TableCell>
                <TableCell>${month.totalCompanyEarnings.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Dashboard;
