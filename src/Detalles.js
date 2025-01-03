import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Button, Box } from "@mui/material";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

import API from "./api/axios";





const Detalles = () => {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const importSales = async () => {
    try {
      const response = await API.post("/sales/import");
      console.log("Datos importados:", response.data);
    } catch (error) {
      console.error("Error al importar datos:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const url =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vT4SAIvGtTDG_V-38Euuv9pFyfdmjl-GL08vA8aiym3JSzF-injRam6NzLY7YCK1cJhhRmWqWNI0xeo/pub?gid=2064678619&single=true&output=csv";
      try {
        const response = await fetch(url);
        const text = await response.text();

        // Convertir CSV a JSON
        const rowsData = text.split("\n").map((row) => row.split(","));
        const headers = rowsData[0];
        const data = rowsData.slice(1).map((row, index) =>
          Object.fromEntries(headers.map((key, i) => [key, row[i]]))
        );

        // Configurar columnas y filas para DataGrid
        setColumns(
          headers.map((header) => ({
            field: header,
            headerName: header,
            flex: 1,
          }))
        );
        setRows(
          data.map((row, index) => ({
            id: index, // Necesario para DataGrid
            ...row,
          }))
        );
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "data.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Datos Exportados", 20, 10);
    doc.autoTable({
      head: [columns.map((col) => col.headerName)],
      body: rows.map((row) => columns.map((col) => row[col.field] || "")),
    });
    doc.save("data.pdf");
  };

  return (
    <>
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Button variant="contained" color="primary" onClick={downloadExcel}>
            Descargar Excel
          </Button>
          <Button variant="contained" color="secondary" onClick={downloadPDF}>
            Descargar PDF
          </Button>
        </Box>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelection
            disableSelectionOnClick
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </div>
      </Box>
    </>
  );
};

export default Detalles;
