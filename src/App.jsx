import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./components/Sidebar";
import Routes from "./routes/Routes";
import { useLocation } from "react-router-dom"; // Import useLocation hook

function App() {
  const [open, setOpen] = useState(true); // Sidebar is open by default
  const location = useLocation(); // Get current location

  const handleDrawerToggle = () => {
    setOpen(!open); // Toggle sidebar open/close
  };

  // Check if the current route is the login route
  const isLoginRoute = location.pathname === "/";

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* Top AppBar */}
      {!isLoginRoute && ( // Hide AppBar when on the login route
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            {/* Hamburger Menu */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              FuelGenie
            </Typography>
          </Toolbar>
        </AppBar>
      )}
      {/* Sidebar */}
      {!isLoginRoute && (
        <Sidebar open={open} toggleDrawer={handleDrawerToggle} />
      )}{" "}
      {/* Hide sidebar for login route */}
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {!isLoginRoute && <Toolbar />}{" "}
        {/* Add padding for the AppBar only if it's not login */}
        <Routes /> {/* Routes handles rendering the login page */}
      </Box>
    </Box>
  );
}

export default App;
