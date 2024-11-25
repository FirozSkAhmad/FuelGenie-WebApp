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
  CircularProgress,
} from "@mui/material";
import { Close, ExpandLess, ExpandMore } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import api from "../../utils/api";
import { toast } from "react-toastify";

const RoleModal = ({ open, onClose, onUpdate, mode, role }) => {
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const response = await api.get("/module/all-modules");
        if (response.status === 200) {
          const fetchedModules = response.data.data;
          setModules(fetchedModules);

          // Initialize permissions and sections
          const initialPermissions = {};
          const initialOpenSections = {};
          fetchedModules.forEach((module) => {
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

          // Pre-fill permissions for edit mode
          if (mode === "edit" && role) {
            setRoleName(role.roleName);
            const preFilledPermissions = { ...initialPermissions };

            role.sections.forEach((section) => {
              section.subModules.forEach((subModule) => {
                preFilledPermissions[section.moduleName][
                  subModule.subModuleName
                ] = subModule.permissions;
              });
            });

            setSelectedPermissions(preFilledPermissions);
          }
        }
      } catch (error) {
        console.error("Error fetching modules:", error);
        toast.error("Error fetching modules");
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchModules();
    }
  }, [open, mode, role]);

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
  const handleCreate = async () => {
    // Gather current state of selected permissions for creating a role
    const sections = Object.entries(selectedPermissions).map(
      ([moduleName, submodules]) => ({
        moduleName,
        subModules: Object.entries(submodules).map(
          ([submoduleName, permissions]) => ({
            subModuleName: submoduleName,
            permissions,
          })
        ),
      })
    );

    // Payload for creating the role
    const payload = {
      roleName, // Role name for creating a new role
      sections, // Sections will contain the permissions for each module
    };

    try {
      const response = await api.post("/admin/roles/create-role", payload);
      toast.success("Role created successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("Error creating role!");
    }
  };
  const handleEdit = async () => {
    // Build the `updatePermissions` payload
    const updatePermissions = Object.entries(selectedPermissions).flatMap(
      ([moduleName, submodules]) =>
        Object.entries(submodules).map(([subModuleName, permissions]) => ({
          moduleName: moduleName.toLowerCase(), // Ensure moduleName is lowercase
          subModuleName: subModuleName.replace(/\s+/g, "-").toLowerCase(), // Convert spaces to hyphens and lowercase
          permissions: {
            create: !!permissions.create, // Ensure boolean values
            read: !!permissions.read,
            update: !!permissions.update,
            delete: !!permissions.delete,
          },
        }))
    );

    // Construct the payload
    const payload = {
      updateRoleName: roleName.trim(), // Ensure the role name is unique and trimmed
      updatePermissions,
    };

    // Send the request to update the role
    try {
      const response = await api.put(
        `/admin/roles/edit-role/${role.roleId}`,
        payload
      );
      toast.success("Role updated successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Error updating role!");
    }
  };

  const handleSubmit = async () => {
    if (mode === "edit") {
      // Call the handleEdit function for edit mode
      await handleEdit();
    } else {
      // Call the handleCreate function for create mode
      await handleCreate();
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="role-modal">
      <Box sx={style}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">
            {mode === "edit" ? "Edit Role" : "Add Role"}
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
        >
          {loading ? (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress />
            </Box>
          ) : (
            modules.map((module) => (
              <React.Fragment key={module.moduleName}>
                <ListItem
                  button
                  onClick={() => handleSectionToggle(module.moduleName)}
                >
                  <ListItemIcon>
                    <Checkbox
                      checked={Object.values(
                        selectedPermissions[module.moduleName] || {}
                      ).some((permissions) =>
                        Object.values(permissions).some(Boolean)
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
                  <List sx={{ pl: 4 }}>
                    {module.subModules.map((submodule) => (
                      <ListItem key={submodule} sx={{ display: "block" }}>
                        {/* Submodule Name */}
                        <ListItemText primary={submodule} sx={{ mb: 1 }} />
                        {/* Permissions Checkboxes */}
                        <Box
                          display="flex"
                          flexWrap="wrap"
                          gap={2}
                          sx={{ pl: 2 }}
                        >
                          {["create", "read", "update", "delete"].map(
                            (action) => (
                              <Box
                                key={action}
                                display="flex"
                                alignItems="center"
                              >
                                <Checkbox
                                  checked={
                                    selectedPermissions[module.moduleName]?.[
                                      submodule
                                    ]?.[action]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      module.moduleName,
                                      submodule,
                                      action
                                    )
                                  }
                                />
                                <Typography
                                  variant="body2"
                                  sx={{ textTransform: "capitalize" }}
                                >
                                  {action}
                                </Typography>
                              </Box>
                            )
                          )}
                        </Box>
                      </ListItem>
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
            onClick={handleSubmit}
            disabled={!roleName}
          >
            {mode === "edit" ? "Update Role" : "Add Role"}
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default RoleModal;
