import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Collapse,
} from "@mui/material";
import {
  Home,
  Person,
  Settings,
  ChevronLeft,
  ChevronRight,
  Store,
  Build,
  Group,
  AdminPanelSettings,
  BusinessCenter,
  ExitToApp,
  ListAlt, // Icon for Product List
  Comment, // Icon for Quote Product List
  History, // Icon for Price History
  Photo, // Icon for Banner
} from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const handleLogout = () => {
  // Perform logout logic here (e.g., clear tokens, update state, etc.)
};

function Sidebar({ open, toggleDrawer }) {
  const theme = useTheme();
  const location = useLocation(); // Get the current location

  const isActive = (path) => location.pathname === path; // Function to check if the current path is active
  const [openProducts, setOpenProducts] = useState(false); // State for dropdown

  const handleProductsToggle = () => {
    setOpenProducts(!openProducts); // Toggle the dropdown
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : theme.spacing(7), // Sidebar width when open/collapsed
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: open ? drawerWidth : theme.spacing(7),
          overflowX: "hidden",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <DrawerHeader>
        {/* Collapse Sidebar Button */}
        <IconButton onClick={toggleDrawer}>
          {open ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {/* Sidebar Items */}
        <ListItem
          button
          component={Link}
          to="/dashboard"
          sx={{
            backgroundColor: isActive("/dashboard")
              ? theme.palette.action.selected
              : "transparent",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          {open && <ListItemText primary="Dashboard" />}
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/profile"
          sx={{
            backgroundColor: isActive("/profile")
              ? theme.palette.action.selected
              : "transparent",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          {open && <ListItemText primary="Profile" />}
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/settings"
          sx={{
            backgroundColor: isActive("/settings")
              ? theme.palette.action.selected
              : "transparent",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          {open && <ListItemText primary="Settings" />}
        </ListItem>

        {/* Products Dropdown */}
        <ListItem button onClick={handleProductsToggle}>
          <ListItemIcon>
            <Store />
          </ListItemIcon>
          {open && <ListItemText primary="Products" />}
        </ListItem>
        <Collapse in={openProducts} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              component={Link}
              to="/products/product-list"
              sx={{
                pl: 4, // Indent sub-items
                backgroundColor: isActive("/products/product-list")
                  ? theme.palette.action.selected
                  : "transparent",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon>
                <ListAlt /> {/* Icon for Product List */}
              </ListItemIcon>
              {open && <ListItemText primary="Product List" />}
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/products/quote-list"
              sx={{
                pl: 4,
                backgroundColor: isActive("/products/quote-list")
                  ? theme.palette.action.selected
                  : "transparent",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon>
                <Comment /> {/* Icon for Quote Product List */}
              </ListItemIcon>
              {open && <ListItemText primary="Quote Product List" />}
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/products/price-history"
              sx={{
                pl: 4,
                backgroundColor: isActive("/products/price-history")
                  ? theme.palette.action.selected
                  : "transparent",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon>
                <History /> {/* Icon for Price History */}
              </ListItemIcon>
              {open && <ListItemText primary="Price History" />}
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/products/banner"
              sx={{
                pl: 4,
                backgroundColor: isActive("/products/banner")
                  ? theme.palette.action.selected
                  : "transparent",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon>
                <Photo /> {/* Icon for Banner */}
              </ListItemIcon>
              {open && <ListItemText primary="Banner" />}
            </ListItem>
          </List>
        </Collapse>

        <ListItem
          button
          component={Link}
          to="/operations"
          sx={{
            backgroundColor: isActive("/operations")
              ? theme.palette.action.selected
              : "transparent",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <ListItemIcon>
            <Build />
          </ListItemIcon>
          {open && <ListItemText primary="Operations" />}
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/vendor-management"
          sx={{
            backgroundColor: isActive("/vendor-management")
              ? theme.palette.action.selected
              : "transparent",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <ListItemIcon>
            <Group />
          </ListItemIcon>
          {open && <ListItemText primary="Vendor Management" />}
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/admin"
          sx={{
            backgroundColor: isActive("/admin")
              ? theme.palette.action.selected
              : "transparent",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <ListItemIcon>
            <AdminPanelSettings />
          </ListItemIcon>
          {open && <ListItemText primary="Admin" />}
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/management"
          sx={{
            backgroundColor: isActive("/management")
              ? theme.palette.action.selected
              : "transparent",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <ListItemIcon>
            <BusinessCenter />
          </ListItemIcon>
          {open && <ListItemText primary="Management" />}
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          {open && <ListItemText primary="Logout" />}
        </ListItem>
      </List>
    </Drawer>
  );
}

export default Sidebar;
