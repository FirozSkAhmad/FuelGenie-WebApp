import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Box,
  IconButton,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles"; // Import useTheme for theme-based styling
import BreadcrumbNavigation from "../addProduct/utils/BreadcrumbNavigation";

const Header = () => {
  const theme = useTheme(); // Get the current theme

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.background.paper
            : "white", // Dynamic background for light/dark mode
        color: theme.palette.text.primary, // Dynamic text color
      }}
    >
      <Toolbar>
        {/* Breadcrumb */}
        <Box sx={{ flexGrow: 1 }}>
          <BreadcrumbNavigation />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
