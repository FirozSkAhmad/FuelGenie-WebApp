import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Switch,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./components/UI/Sidebar";
import Routes from "./routes/Routes";
import { useLocation } from "react-router-dom";
import { Brightness4, Brightness7 } from "@mui/icons-material"; // Icons for light/dark mode
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthContext from "./context/AuthContext";

function App() {
  const [open, setOpen] = useState(true); // Sidebar is open by default
  const [darkMode, setDarkMode] = useState(null); // Dark mode state, initially null
  const location = useLocation(); // Get current location
  const { isAuthenticated } = useContext(AuthContext);

  // Load the dark mode setting from localStorage (default to false if not set)
  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");
    if (storedMode !== null) {
      setDarkMode(JSON.parse(storedMode)); // Parse the string value to boolean
    } else {
      setDarkMode(false); // Default to false if no mode is stored
    }
  }, []);

  // Store the dark mode setting in localStorage whenever it changes
  useEffect(() => {
    if (darkMode !== null) {
      localStorage.setItem("darkMode", JSON.stringify(darkMode)); // Save as string
    }
  }, [darkMode]);

  // Toggle sidebar
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Toggle between light and dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Create light and dark themes
  const lightTheme = createTheme({
    palette: {
      mode: "light",
      primary: { main: "#1976d2" },
      success: { main: "#2e7d32" },
      warning: { main: "#ed6c02" },
      error: { main: "#d32f2f" },
      grey: {
        500: "#9e9e9e", // Ensure grey shades are available
        600: "#757575", // Optional: Add more shades if needed
        700: "#616161", // Optional: Add more shades if needed
      },
    },
    typography: {
      fontFamily: "'Proza Libre', sans-serif", // Set Proza Libre font for light theme
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: { main: "#1976d2" },
      success: { main: "#2e7d32" },
      warning: { main: "#ed6c02" },
      error: { main: "#d32f2f" },
      grey: {
        500: "#9e9e9e", // Same for dark theme
        600: "#757575", // Optional: Add more shades if needed
        700: "#616161", // Optional: Add more shades if needed
      },
    },
    typography: {
      fontFamily: "'Proza Libre', sans-serif", // Set Proza Libre font for dark theme
    },
  });

  // Check if the current route is the login route
  const isLoginRoute = location.pathname === "/";

  // If darkMode is null (still loading from localStorage), render nothing to avoid UI flicker
  if (darkMode === null) {
    return null; // You could render a loading spinner here if needed
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        {/* Top AppBar */}
        {!isLoginRoute && isAuthenticated && (
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
              <Box sx={{ flexGrow: 1 }} />
              {/* Light/Dark Mode Toggle */}
              <IconButton
                sx={{ ml: 1 }}
                onClick={toggleDarkMode}
                color="inherit"
              >
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
              <Switch checked={darkMode} onChange={toggleDarkMode} />
            </Toolbar>
          </AppBar>
        )}
        {/* Sidebar */}
        {!isLoginRoute && isAuthenticated && (
          <Sidebar open={open} toggleDrawer={handleDrawerToggle} />
        )}

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {isAuthenticated && <Toolbar />}
          <Routes />
        </Box>
      </Box>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
