import React from "react";
import { Navigate } from "react-router-dom";

const UserRoute = ({ children }) => {
  const userStr = localStorage.getItem("user");
  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch {}
  if (!user || user.role !== "client") {
    return <Navigate to="/UserLogin" replace />;
  }
  return children;
};

export default UserRoute; 