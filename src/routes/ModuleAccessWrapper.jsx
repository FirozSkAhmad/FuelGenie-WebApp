// ModuleAccessWrapper.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { checkAccess } from "../utils/checkAccess"; // Ensure this is imported from your utils

const ModuleAccessWrapper = ({
  element,
  requiredModule,
  requiredSubModule,
}) => {
  const { isAuthenticated } = useContext(AuthContext); // Destructuring from AuthContext
  // Retrieve user data from localStorage
  const userData = JSON.parse(localStorage.getItem("user"));

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Allow access to /profile, /dashboard, and /settings without access check
  if (
    window.location.pathname === "/profile" ||
    window.location.pathname === "/dashboard" ||
    window.location.pathname === "/settings"
  ) {
    return element; // These routes are always allowed, no access check required
  }

  // Check for module/submodule access
  if (!checkAccess(userData, requiredModule, requiredSubModule)) {
    return <Navigate to="/restricted" replace />; // If no access, redirect to restricted page
  }

  // Render the passed element if authenticated and has access
  return element;
};

export default ModuleAccessWrapper;
