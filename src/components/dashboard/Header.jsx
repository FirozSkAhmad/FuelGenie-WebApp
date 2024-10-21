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
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/" style={{ color: theme.palette.text.primary }}>
              Home
            </Link>
            <Typography sx={{ color: theme.palette.primary.main }}>
              Dashboard
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* Search bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: theme.palette.action.hover, // Search bar background adapts to theme
            borderRadius: "4px",
            padding: "0 10px",
            mr: 2,
          }}
        >
          <SearchIcon />
          <InputBase
            placeholder="Search here"
            sx={{
              ml: 1,
              flex: 1,
              color: theme.palette.text.primary, // Dynamic text color for search input
            }}
          />
        </Box>

        {/* Profile Link */}
        <Link to="/profile" style={{ textDecoration: "none" }}>
          <IconButton>
            <Avatar alt="User" src="/path-to-avatar.jpg" />
          </IconButton>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
