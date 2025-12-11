// src/routes/PrivateRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { CurrentUser } from "../API/api";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsChecking(false);
        return;
      }

      try {
        const response = await CurrentUser(token);
        // console.log("private route response", response)
        // If success
        // localStorage.setItem("user", JSON.stringify(response.user));
        setIsValid(true);
      } catch (error) {
        // Token invalid or expired
        localStorage.removeItem("token");

        setIsValid(false);
      }

      setIsChecking(false);
    };

    validateToken();
  }, [token]);

  // Show loader while checking token
  if (isChecking) {
    return <div style={{ padding: "50px", textAlign: "center" }}>Validating session...</div>;
  }

  // Token missing OR invalid
  if (!isValid) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default PrivateRoute;
