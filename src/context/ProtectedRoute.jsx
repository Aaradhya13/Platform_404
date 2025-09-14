// src/context/ProtectedRoute.jsx
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // Detect back button navigation
  useEffect(() => {
    const handlePopState = () => {
      // Clear token when user navigates back
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("department");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

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
