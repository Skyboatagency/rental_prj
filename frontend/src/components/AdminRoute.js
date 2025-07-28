import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const userStr = localStorage.getItem("user");
  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch {}
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default AdminRoute; 