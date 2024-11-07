import React, { useState, useContext } from "react";
import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Collapse,
  ListItemButton,
  Tooltip,
} from "@mui/material";
import {
  AccessTime,
  Person,
  Settings,
  ChevronLeft,
  ChevronRight,
  Build,
  Group,
  AdminPanelSettings,
  BusinessCenter,
  ExitToApp,
  VerifiedUser,
  ReceiptLong,
  Tune,
  StoreMallDirectory,
  PointOfSale,
  Dashboard,
  Map,
  SwapHoriz,
  Inventory,
  LocalShipping,
  VpnKey,
  ErrorOutline,
  LocalGasStation,
  AssignmentTurnedIn,
  HowToReg,
  AccountBalance,
  Receipt,
  MonetizationOn,
  AccessAlarm,
  NotificationsActive,
  Category,
  Timeline,
  Wallpaper,
} from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

// Constants for drawer width and styles
const drawerWidth = 280;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
  backgroundColor: theme.palette.background.paper,
}));

// Main Sidebar component
function Sidebar({ open, toggleDrawer }) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [openSections, setOpenSections] = useState({
    products: false,
    sales: false,
    admin: false,
    operation: false,
  });

  const handleSectionToggle = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getActiveBackground = (path) =>
    location.pathname.startsWith(path)
      ? theme.palette.action.selected
      : "transparent";

  const sidebarItems = [
    {
      label: "Dashboard",
      icon: <Dashboard />,
      path: "/dashboard",
    },
    {
      label: "Products",
      icon: <StoreMallDirectory />,
      items: [
        {
          label: "Zone Prod Mgr",
          icon: <Category />,
          path: "/products/zone-prod-mgr",
        },
        {
          label: "Price History",
          icon: <Timeline />,
          path: "/products/price-history",
        },
        {
          label: "Banner",
          icon: <Wallpaper />,
          path: "/products/banner",
        },
        {
          label: "TimeSlots",
          icon: <AccessTime />,
          path: "/products/time-slots",
        },
      ],
      toggle: "products",
    },
    {
      label: "Sales",
      icon: <PointOfSale />,
      items: [
        {
          label: "Orders",
          icon: <AssignmentTurnedIn />,
          path: "/sales/orders",
        },
        {
          label: "OnBoarding Approval",
          icon: <HowToReg />,
          path: "/sales/onboarding-approval",
        },
        {
          label: "Business Profile",
          icon: <AccountBalance />,
          path: "/sales/business-profile",
        },
        {
          label: "Transactions",
          icon: <Receipt />,
          path: "/sales/transactions",
        },
        {
          label: "Get a Quote",
          icon: <MonetizationOn />,
          path: "/sales/get-a-quote",
        },
        { label: "Overdue", icon: <AccessAlarm />, path: "/sales/overdue" },
        {
          label: "Notify Me",
          icon: <NotificationsActive />,
          path: "/sales/notify",
        },
      ],
      toggle: "sales",
    },
    {
      label: "Operations",
      icon: <Build />,
      items: [
        { label: "Map", icon: <Map />, path: "/operations/map" },
        {
          label: "Order Swapping",
          icon: <SwapHoriz />,
          path: "/operations/order-swapping",
        },
        {
          label: "Operation Orders",
          icon: <Inventory />,
          path: "/operations/operation-orders",
        },
        {
          label: "Bowser Deliveries",
          icon: <LocalShipping />,
          path: "/operations/bowser-deliveries",
        },
        {
          label: "Driver Login",
          icon: <VpnKey />,
          path: "/operations/driver-login",
        },
        {
          label: "Totalizer Errors",
          icon: <ErrorOutline />,
          path: "/operations/totalizer-error",
        },
        {
          label: "Refill",
          icon: <LocalGasStation />,
          path: "/operations/refill",
        },
      ],
      toggle: "operation",
    },
    {
      label: "Admin",
      icon: <AdminPanelSettings />,
      items: [
        { label: "Roles", icon: <VerifiedUser />, path: "/admin/roles" },
        { label: "Team", icon: <Group />, path: "/admin/team" },
        {
          label: "Activity Logs",
          icon: <ReceiptLong />,
          path: "/admin/activity-logs",
        },
        { label: "Settings", icon: <Tune />, path: "/admin/settings" },
      ],
      toggle: "admin",
    },
    {
      label: "Management",
      icon: <BusinessCenter />,
      path: "/management",
    },
    {
      label: "Profile",
      icon: <Person />,
      path: "/profile",
    },
    {
      label: "Settings",
      icon: <Settings />,
      path: "/settings",
    },
    {
      label: "Logout",
      icon: <ExitToApp />,
      onClick: handleLogout,
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : theme.spacing(7),
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: open ? drawerWidth : theme.spacing(7),
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          boxShadow: open ? "0 4px 12px rgba(0, 0, 0, 0.2)" : "none",
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          overflowX: "hidden",
        },
        // Prevent horizontal scroll in collapsible sections
        [`& .MuiCollapse-root`]: {
          overflowX: "hidden", // Prevent horizontal scrolling in the collapsed section
        },
      }}
    >
      <DrawerHeader>
        <IconButton onClick={toggleDrawer}>
          {open ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {sidebarItems.map(({ label, icon, path, items, toggle, onClick }) =>
          items ? (
            <SidebarDropdown
              key={label}
              label={label}
              icon={icon}
              items={items}
              open={open}
              isExpanded={openSections[toggle]}
              toggleOpen={() => handleSectionToggle(toggle)}
              currentPath={location.pathname}
              getActiveBackground={getActiveBackground}
            />
          ) : (
            <SidebarItem
              key={label}
              label={label}
              icon={icon}
              path={path}
              open={open}
              onClick={onClick}
            />
          )
        )}
      </List>
    </Drawer>
  );
}

// SidebarItem Component (Icon + Label)
const SidebarItem = ({ icon, label, path, open, onClick }) => {
  const location = useLocation();
  const theme = useTheme();
  const isActive = location.pathname === path;

  return (
    <ListItemButton
      component={Link}
      to={path}
      onClick={onClick}
      sx={{
        color: isActive ? theme.palette.primary.main : "inherit",
        backgroundColor: isActive
          ? theme.palette.action.selected
          : "transparent",
        "&:hover": { backgroundColor: theme.palette.action.hover },
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Conditionally wrap icon in Tooltip when sidebar is collapsed */}
      {open ? (
        <ListItemIcon
          sx={{ color: isActive ? theme.palette.primary.main : "inherit" }}
        >
          {icon}
        </ListItemIcon>
      ) : (
        <Tooltip title={label} arrow>
          <ListItemIcon
            sx={{ color: isActive ? theme.palette.primary.main : "inherit" }}
          >
            {icon}
          </ListItemIcon>
        </Tooltip>
      )}

      {/* Show label text only when sidebar is expanded */}
      <ListItemText
        primary={label}
        sx={{
          display: open ? "block" : "none", // Always show text if open
          transition: "all 0.3s",
        }}
      />
    </ListItemButton>
  );
};

// SidebarDropdown Component (Expandable Items)
const SidebarDropdown = ({
  label,
  icon,
  items,
  open,
  toggleOpen,
  isExpanded,
  currentPath,
  getActiveBackground,
}) => {
  const theme = useTheme();

  return (
    <>
      <ListItemButton
        onClick={toggleOpen}
        sx={{
          backgroundColor: isExpanded
            ? theme.palette.action.hover
            : "transparent",
          "&:hover": { backgroundColor: theme.palette.action.hover },
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        {open && (
          <ListItemText
            primary={label}
            primaryTypographyProps={{
              fontWeight: "bold",
              color: isExpanded ? theme.palette.primary.main : "inherit",
            }}
          />
        )}
      </ListItemButton>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items.map(({ icon, label, path }) => (
            <SidebarItem
              key={label}
              icon={icon}
              label={label}
              path={path}
              open={open}
              sx={{
                pl: 4,
                color: theme.palette.text.secondary,
                backgroundColor: getActiveBackground(path),
              }}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default Sidebar;
