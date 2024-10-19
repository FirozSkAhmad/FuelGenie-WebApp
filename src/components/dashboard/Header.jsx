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

const Header = () => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ backgroundColor: "white", color: "black" }}
    >
      <Toolbar>
        {/* Breadcrumb */}
        <Box sx={{ flexGrow: 1 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">Home</Link>
            <Typography sx={{ color: "#2F45F3" }}>Dashboard</Typography>
          </Breadcrumbs>
        </Box>

        {/* Search bar */}
        <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
          <SearchIcon />
          <InputBase placeholder="Search here" sx={{ ml: 1, flex: 1 }} />
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
