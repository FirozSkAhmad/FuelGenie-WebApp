import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const BreadcrumbNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Split the location pathname into parts
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
      {/* Home link */}
      <Link underline="hover" color="inherit" onClick={() => navigate("/")}>
        Home
      </Link>

      {/* Render breadcrumbs dynamically */}
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isClickable = index < 2; // Only make the first two steps clickable after "Home"

        return isClickable ? (
          <Link
            key={to}
            underline="hover"
            color="inherit"
            onClick={() => navigate(to)}
          >
            {value.replace("-", " ").toUpperCase()}
          </Link>
        ) : (
          <Typography key={to} color="text.primary">
            {value.replace("-", " ").toUpperCase()}
          </Typography>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbNavigation;
