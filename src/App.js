import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppWrapper from "./AppWrapper";
import Login from "./Login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<AppWrapper />} />
      </Routes>
    </Router>
  );
};

export default App;
