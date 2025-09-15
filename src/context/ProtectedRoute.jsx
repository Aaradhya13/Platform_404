// src/context/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // If user is logged in
  if (token) {
    if (location.pathname === "/" || location.pathname === "/login") {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  }

  // If user is NOT logged in
  if (!token) {
    if (location.pathname === "/" || location.pathname === "/login") {
      return children;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
