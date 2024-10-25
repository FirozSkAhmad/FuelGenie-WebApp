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
  Business,
  Payment,
  RequestQuote,
  AlarmOn,
  Notifications,
} from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const drawerWidth = 240;
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

function Sidebar({ open, toggleDrawer }) {
  const theme = useTheme();
  const location = useLocation(); // Get the current location
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path; // Function to check if the current path is active
  const [openProducts, setOpenProducts] = useState(false); // State for dropdown
  const [openSales, setOpenSales] = useState(false);
  const handleProductsToggle = () => {
    setOpenProducts(!openProducts); // Toggle the dropdown
  };
  const handleSalesToggle = () => {
    setOpenSales(!openSales);
  };
  const handleLogout = () => {
    // Perform logout logic here (e.g., clear tokens, update state, etc.)
    navigate("/");
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
              to="/products/zone"
              sx={{
                pl: 4,
                backgroundColor: isActive("/products/zone")
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
              {open && <ListItemText primary="Zones" />}
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
        {/* Sales Dropdown */}
        <ListItem button onClick={handleSalesToggle}>
          <ListItemIcon>
            <AttachMoneyIcon /> {/* Icon for Sales */}
          </ListItemIcon>
          {open && <ListItemText primary="Sales" />}
        </ListItem>
        <Collapse in={openSales} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              component={Link}
              to="/sales/orders"
              sx={{
                pl: 4, // Indent sub-items
                backgroundColor: isActive("/sales/orders")
                  ? theme.palette.action.selected
                  : "transparent",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon>
                <ListAlt /> {/* Orders Icon */}
              </ListItemIcon>
              {open && <ListItemText primary="Orders" />}
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/sales/onboarding-approval"
              sx={{
                pl: 4,
                backgroundColor: isActive("/sales/onboarding-approval")
                  ? theme.palette.action.selected
                  : "transparent",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon>
                <Comment /> {/* Approval Icon */}
              </ListItemIcon>
              {open && <ListItemText primary="OnBoarding Approval" />}
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/sales/business-profile"
              sx={{
                pl: 4,
                backgroundColor: isActive("/sales/business-profile")
                  ? theme.palette.action.selected
                  : "transparent",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon>
                <Business /> {/* Business Profile Icon */}
              </ListItemIcon>
              {open && <ListItemText primary="Business Profile" />}
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/sales/transactions"
              sx={{
                pl: 4,
                backgroundColor: isActive("/sales/transactions")
                  ? theme.palette.action.selected
                  : "transparent",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon>
                <Payment /> {/* Transactions Icon */}
              </ListItemIcon>
              {open && <ListItemText primary="Transactions" />}
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/sales/get-a-quote"
              sx={{
                pl: 4,
                backgroundColor: isActive("/sales/get-a-quote")
                  ? theme.palette.action.selected
                  : "transparent",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon>
                <RequestQuote /> {/* Get a Quote Icon */}
              </ListItemIcon>
              {open && <ListItemText primary="Get a Quote" />}
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/sales/overdue"
              sx={{
                pl: 4,
                backgroundColor: isActive("/sales/overdue")
                  ? theme.palette.action.selected
                  : "transparent",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon>
                <AlarmOn /> {/* Overdue Icon */}
              </ListItemIcon>
              {open && <ListItemText primary="Overdue" />}
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/sales/notify"
              sx={{
                pl: 4,
                backgroundColor: isActive("/sales/notify")
                  ? theme.palette.action.selected
                  : "transparent",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon>
                <Notifications /> {/* Notify Icon */}
              </ListItemIcon>
              {open && <ListItemText primary="Notify Me" />}
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
