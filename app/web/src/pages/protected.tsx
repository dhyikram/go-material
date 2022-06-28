import React from "react";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Homepage from "./Homepage";

function ProtectedRoutes() {
  const isAuthenticated = localStorage.getItem("jwt");
  if (!isAuthenticated) {
    return <Navigate to="login" />;
  }
  const location = useLocation();
  if (location.pathname === "/") {
    return <Navigate to="items" />;
  }
  return (
    <Homepage>
      <Outlet />
    </Homepage>
  );
}

export default ProtectedRoutes;
