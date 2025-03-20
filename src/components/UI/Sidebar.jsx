import React, { useState, useContext, useEffect } from "react";
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
  Box,
} from "@mui/material";
import {
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
  AccessTime,
  Approval,
  Person,
  Settings,
  Wallet,
  CardGiftcard,
  DriveEta,
  History,
} from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { path } from "framer-motion/client";

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

function Sidebar({ open, toggleDrawer }) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [openSections, setOpenSections] = useState({});
  const [filteredSidebarItems, setFilteredSidebarItems] = useState([]);

  useEffect(() => {
    // Retrieve user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user")) || {
      sections: [],
      teamAndRole: [],
    };

    // Check if the user has the ADMIN role
    const isAdmin = userData.teamAndRole?.some((team) =>
      team.roles.some((role) => role.roleName === "ADMIN")
    );

    // Filter sidebar items based on user permissions or grant access to all if ADMIN
    const filteredData = sidebarItems
      .map((module) => {
        if (["/dashboard", "/profile", "/settings"].includes(module.path)) {
          // Always include Dashboard, Profile, and Settings
          return module;
        }
        if (isAdmin) {
          // ADMIN gets access to all modules and submodules
          return module;
        }

        // Non-admin users: Filter modules and submodules based on permissions
        const userModule = userData.sections.find(
          (userSection) => userSection.moduleName === module.toggle
        );

        if (userModule) {
          // Filter submodules
          const accessibleSubModules = module.items?.filter((item) =>
            userModule.subModules.some(
              (subModule) =>
                subModule.subModuleName === item.path.split("/").pop() &&
                subModule.permissions.read
            )
          );

          return {
            ...module,
            items: accessibleSubModules || [],
          };
        }

        return null; // Exclude the module if the user doesn't have access
      })
      .filter(Boolean); // Remove null values

    setFilteredSidebarItems(filteredData);
  }, []);

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
        {
          label: "Quote Prod Mgr",
          icon: <Category />,
          path: "/products/quote-prod-mgr",
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
          label: " Orders",
          icon: <Inventory />,
          path: "/operations/orders",
        },
        {
          label: " Assign Bowsers",
          icon: <LocalShipping />,
          path: "/operations/assign-bowsers",
        },
        {
          label: "Bowser & Driver Assignment",
          icon: <History />,
          path: "/operations/bd-assignment-history",
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
      toggle: "operations",
    },
    {
      label: "Admin",
      icon: <AdminPanelSettings />,
      items: [
        { label: "Roles", icon: <VerifiedUser />, path: "/admin/roles" },
        { label: "Teams", icon: <Group />, path: "/admin/teams" },
        { label: "Wallets", icon: <Wallet />, path: "/admin/wallets" },
        {
          label: "Approvals",
          icon: <Approval />,
          path: "/admin/approvals",
        },
        {
          label: "Bowser Creation",
          icon: <LocalShipping />,
          path: "/admin/bowser-creation",
        },
        {
          label: "Driver Creation",
          icon: <DriveEta />,
          path: "/admin/driver-creation",
        },
        {
          label: "Business Profiles",
          icon: <AccountBalance />,
          path: "/admin/business-profiles",
        },
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
      items: [
        {
          label: "Coupons",
          icon: <CardGiftcard />,
          path: "/management/coupons",
        },
        {
          label: "B2B Approvals",
          icon: <AssignmentTurnedIn />,
          path: "/management/b2b-approvals",
        },
        {
          label: "Pumps",
          icon: <LocalGasStation />,
          path: "/management/pumps",
        },
        {
          label: "Instant Products",
          icon: <Inventory />,
          path: "/management/instant-products",
        },
      ],
      toggle: "management",
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
          color: theme.palette.text.primary,
          overflowX: "hidden",
        },
        // Prevent horizontal scroll in collapsible sections
        [`& .MuiCollapse-root`]: {
          overflowX: "hidden", // Prevent horizontal scrolling in the collapsed section
          backgroundColor: theme.palette.drawerBack.default, // Background color for the collapsible sections
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
        {filteredSidebarItems.map((item) => {
          const { label, icon, items, toggle, path } = item;

          if (items?.length) {
            return (
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
            );
          }

          if (path) {
            return (
              <SidebarItem
                key={label}
                label={label}
                icon={icon}
                path={path}
                open={open}
              />
            );
          }

          return null;
        })}
      </List>
      {/* Logout Button */}
      <Box sx={{ marginTop: "auto" }}>
        <SidebarItem
          label="Logout"
          icon={<ExitToApp />}
          open={open}
          onClick={handleLogout} // Ensure this function is defined to handle logout
        />
      </Box>
    </Drawer>
  );
}

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
          {items.map(({ label, icon, path }) => (
            <SidebarItem
              key={label}
              icon={icon}
              label={label}
              path={path}
              open={open}
              getActiveBackground={getActiveBackground}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
};

const SidebarItem = ({
  icon,
  label,
  path,
  open,
  getActiveBackground,
  onClick,
}) => {
  const theme = useTheme();
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <ListItemButton
      onClick={onClick}
      component={Link}
      to={path}
      sx={{
        color: isActive ? theme.palette.primary.main : "inherit",
        backgroundColor: isActive
          ? theme.palette.action.selected
          : "transparent",
        "&:hover": { backgroundColor: theme.palette.action.hover },
      }}
    >
      <Tooltip title={!open ? label : ""} arrow>
        <ListItemIcon>{icon}</ListItemIcon>
      </Tooltip>
      {open && <ListItemText primary={label} />}
    </ListItemButton>
  );
};

export default Sidebar;
