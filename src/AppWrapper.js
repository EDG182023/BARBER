import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Detalles from "./Detalles";
import NavigationBar from "./NavigationBar";
import Maestros from "./Maestros";


const AppWrapper = () => {
  const [user, setUser] = useState(null); // Define el estado del usuario

  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} /> {/* Pasa setUser como prop */}
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/detalles" element={<Detalles />} />
        <Route path="/maestros" element={<Maestros/>} />
         
      </Routes>
    </>
  );
};

export default AppWrapper;
