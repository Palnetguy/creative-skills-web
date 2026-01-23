import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SurveyApp from "./pages/SurveyApp";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SurveyApp />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/facilitator" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
