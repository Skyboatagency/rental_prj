import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PublicOnlyRoute = ({ children }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    let user = null;
    try {
      user = userStr ? JSON.parse(userStr) : null;
    } catch {}
    if (user && user.role === "admin") {
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      // Optionally clear other session data here
      window.location.reload();
    }
  }, [navigate]);
  return children;
};

export default PublicOnlyRoute; 