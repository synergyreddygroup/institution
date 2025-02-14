import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoutes from "./utlis/ProtectedRoutes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route element={<ProtectedRoutes/>}>
            <Route path="/dashboard" element={<Dashboard/>} />
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;
