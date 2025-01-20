import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const BreadcrumbNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Split the location pathname into parts
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Function to handle navigation
  const handleNavigation = (to) => {
    // Check if the route exists (you can replace this with your own logic)
    const isValidRoute = true; // Replace with actual route validation logic
    if (isValidRoute) {
      navigate(to);
    } else {
      // If the route is invalid, stay on the same page
      console.warn("Invalid route. Staying on the same page.");
    }
  };

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<ChevronRightIcon fontSize="small" />}
      sx={{ mb: 3, alignItems: "center" }}
    >
      {/* Home link with icon */}
      <Link
        underline="hover"
        color="inherit"
        onClick={() => handleNavigation("/")}
        sx={{ display: "flex", alignItems: "center" }}
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        Home
      </Link>

      {/* Render breadcrumbs dynamically */}
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isClickable = index === 1;

        return isClickable ? (
          <Link
            key={to}
            underline="hover"
            color="text.primary"
            onClick={() => handleNavigation(to)}
            sx={{ display: "flex", alignItems: "center" }}
          >
            {value.replace("-", " ").toUpperCase()}
          </Link>
        ) : (
          <Typography
            key={to}
            color="inherit"
            sx={{ display: "flex", alignItems: "center" }}
          >
            {value.replace("-", " ").toUpperCase()}
          </Typography>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbNavigation;
