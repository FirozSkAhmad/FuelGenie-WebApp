import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Switch,
  useTheme,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./components/Sidebar";
import Routes from "./routes/Routes";
import { useLocation } from "react-router-dom";
import { Brightness4, Brightness7 } from "@mui/icons-material"; // Icons for light/dark mode
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const [open, setOpen] = useState(true); // Sidebar is open by default
  const [darkMode, setDarkMode] = useState(false); // Dark mode state
  const location = useLocation(); // Get current location

  // Toggle sidebar
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Toggle between light and dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Create light and dark themes
  const lightTheme = createTheme({
    palette: {
      mode: "light",
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  // Check if the current route is the login route
  const isLoginRoute = location.pathname === "/";

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        {/* Top AppBar */}
        {!isLoginRoute && (
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
        {!isLoginRoute && (
          <Sidebar open={open} toggleDrawer={handleDrawerToggle} />
        )}

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {!isLoginRoute && <Toolbar />}
          <Routes /> {/* Routes handles rendering the login page */}
        </Box>
      </Box>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
