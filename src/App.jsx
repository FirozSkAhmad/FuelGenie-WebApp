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

function App() {
  const [open, setOpen] = useState(true); // Sidebar is open by default

  const handleDrawerToggle = () => {
    setOpen(!open); // Toggle sidebar open/close
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* Top AppBar */}
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

      {/* Sidebar */}
      <Sidebar open={open} toggleDrawer={handleDrawerToggle} />

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Routes />
      </Box>
    </Box>
  );
}

export default App;
