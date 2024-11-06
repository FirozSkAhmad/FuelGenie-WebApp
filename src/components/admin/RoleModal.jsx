import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  IconButton,
  Checkbox,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  useMediaQuery,
  CircularProgress, // Importing the loading spinner
} from "@mui/material";
import { Close, ExpandLess, ExpandMore } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import api from "../../utils/api";
import { toast } from "react-toastify";
const RoleModal = ({ open, onClose, onUpdate }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? "90%" : 500,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: isSmallScreen ? 2 : 4,
    borderRadius: 2,
  };

  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [openSections, setOpenSections] = useState({});
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for API call

  // Fetch modules from the API
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await api.get("/module/all-modules");
        if (response.status === 200) {
          setModules(response.data.data);
          // Initialize selectedPermissions and openSections for the fetched modules
          const initialPermissions = {};
          const initialOpenSections = {};
          response.data.data.forEach((module) => {
            initialPermissions[module.moduleName] = {};
            initialOpenSections[module.moduleName] = false;
            module.subModules.forEach((submodule) => {
              initialPermissions[module.moduleName][submodule] = {
                create: false,
                read: false,
                update: false,
                delete: false,
              };
            });
          });
          setSelectedPermissions(initialPermissions);
          setOpenSections(initialOpenSections);
        }
      } catch (error) {
        console.error("Error fetching modules:", error);
        toast.error("Error fetching modules:", error); // Show error message
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchModules();
    }
  }, [open]);

  const handleSectionToggle = (moduleName) => {
    setOpenSections((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
  };

  const handlePermissionChange = (moduleName, submodule, action) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [moduleName]: {
        ...prev[moduleName],
        [submodule]: {
          ...prev[moduleName][submodule],
          [action]: !prev[moduleName][submodule][action],
        },
      },
    }));
  };

  const handleContinue = async () => {
    // Construct API payload
    const sections = Object.entries(selectedPermissions).map(
      ([moduleName, submodules]) => ({
        moduleName,
        subModules: Object.entries(submodules).map(
          ([submoduleName, permissions]) => ({
            subModuleName: submoduleName,
            permissions: {
              create: permissions.create || false,
              read: permissions.read || false,
              update: permissions.update || false,
              delete: permissions.delete || false,
            },
          })
        ),
      })
    );

    const payload = {
      roleName,
      sections,
    };

    try {
      const response = await api.post("/role/create-role", payload);
      console.log("Role created:", response.data);
      toast.success("Role successfully created!"); // Show success message
      onClose();
      onUpdate();
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("Error creating role!"); // Show error message
    }
  };

  const getSelectedCount = () => {
    return Object.values(selectedPermissions).reduce((total, submodules) => {
      return (
        total +
        Object.values(submodules).reduce(
          (subTotal, permissions) =>
            subTotal + Object.values(permissions).filter(Boolean).length,
          0
        )
      );
    }, 0);
  };
  const handleReset = () => {
    // Clear the role name and selected permissions state
    setRoleName("");
    setSelectedPermissions({});
    setOpenSections({});

    // Use toast only once after resetting the state
    if (!roleName && Object.keys(selectedPermissions).length === 0) {
      toast.success("Selection Reset !");
    }
  };
  const isContinueDisabled = !roleName || getSelectedCount() === 0;
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-role-modal">
      <Box sx={style}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography id="add-role-modal" variant="h6" component="h2">
            Add Role
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <TextField
          fullWidth
          label="Role Name"
          margin="normal"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />

        <Typography variant="subtitle1" mt={2} mb={1}>
          Select permissions
        </Typography>

        <List
          sx={{
            width: "100%",
            maxHeight: isSmallScreen ? 300 : 500,
            overflowY: "auto",
            border: "1px solid #ddd",
            borderRadius: 1,
          }}
          component="nav"
          subheader={
            <ListSubheader>{getSelectedCount()} selected</ListSubheader>
          }
        >
          {loading ? ( // Show loading spinner if data is still loading
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress />
            </Box>
          ) : (
            modules.map((module) => (
              <React.Fragment key={module._id}>
                <ListItem
                  button
                  onClick={() => handleSectionToggle(module.moduleName)}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={Object.values(
                        selectedPermissions[module.moduleName] || {}
                      ).some((permission) =>
                        Object.values(permission).some(Boolean)
                      )}
                    />
                  </ListItemIcon>
                  <ListItemText primary={module.moduleName} />
                  {openSections[module.moduleName] ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </ListItem>
                <Collapse
                  in={openSections[module.moduleName]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {module.subModules.map((submodule) => (
                      <React.Fragment key={submodule}>
                        <ListItem
                          button
                          onClick={() =>
                            setOpenSections((prev) => ({
                              ...prev,
                              [module.moduleName]: !prev[module.moduleName],
                            }))
                          }
                          sx={{ pl: 4 }}
                        >
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={Object.values(
                                selectedPermissions[module.moduleName]?.[
                                  submodule
                                ] || {}
                              ).some(Boolean)}
                            />
                          </ListItemIcon>
                          <ListItemText primary={submodule} />
                          {openSections[module.moduleName] ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )}
                        </ListItem>
                        <Collapse
                          in={openSections[module.moduleName]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ display: "flex", pl: 6 }}>
                            {["read", "create", "update", "delete"].map(
                              (action) => (
                                <Box
                                  key={action}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mr: 2,
                                  }}
                                >
                                  <Checkbox
                                    edge="start"
                                    checked={
                                      !!selectedPermissions[
                                        module.moduleName
                                      ]?.[submodule]?.[action]
                                    }
                                    onChange={() =>
                                      handlePermissionChange(
                                        module.moduleName,
                                        submodule,
                                        action
                                      )
                                    }
                                  />
                                  <ListItemText
                                    primary={
                                      action.charAt(0).toUpperCase() +
                                      action.slice(1)
                                    }
                                  />
                                </Box>
                              )
                            )}
                          </Box>
                        </Collapse>
                      </React.Fragment>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ))
          )}
        </List>

        <Box display="flex" justifyContent="center" mt={3} gap={2}>
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: "20px", width: "40%" }}
            onClick={handleContinue}
            disabled={isContinueDisabled || loading}
          >
            Continue
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ borderRadius: "20px", width: "40%" }}
            onClick={handleReset}
          >
            Reset
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default RoleModal;
