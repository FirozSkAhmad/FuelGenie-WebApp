import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import { Edit, Delete, ExpandMore } from "@mui/icons-material";
import { toast } from "react-toastify";
import RoleModal from "../../../components/admin/RoleModal";
import api from "../../../utils/api";
import { useTheme } from "@mui/system";
import { usePermissions } from "../../../utils/permissionssHelper";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";
const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [mode, setMode] = useState("add");
  const permissions = usePermissions();
  const theme = useTheme();
  // Fetch roles from the API
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/roles/all-roles");
      if (response.status === 200) {
        setRoles(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Error fetching roles!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Open modal to add a new role
  const handleAddRole = () => {
    setMode("add");
    setSelectedRole(null);
    setModalOpen(true);
  };

  // Open modal to edit an existing role
  const handleEditRole = (role) => {
    setMode("edit");
    setSelectedRole(role);
    setModalOpen(true);
  };

  // Open delete confirmation dialog
  const handleDeleteDialogOpen = (role) => {
    setSelectedRole(role);
    setDeleteDialogOpen(true);
  };

  // Close delete confirmation dialog
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedRole(null);
  };

  // Delete a role
  const handleDeleteRole = async () => {
    try {
      await api.delete(`/admin/roles/delete-role/${selectedRole.roleId}`);
      toast.success("Role deleted successfully!");
      fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Error deleting role!");
    } finally {
      handleDeleteDialogClose();
    }
  };

  // Close the modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRole(null);
  };

  // Refresh roles list
  const handleUpdate = () => {
    fetchRoles();
  };

  // Helper function to display active permissions in a better UI
  const getActivePermissions = (sections) => {
    return sections.map((section) => {
      const activeSubModules = section.subModules.filter((subModule) =>
        Object.values(subModule.permissions).some((value) => value)
      );

      if (activeSubModules.length === 0) return null;

      return (
        <Accordion key={section.moduleName} elevation={1} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1" fontWeight="bold">
              {section.moduleName}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {activeSubModules.map((subModule) => (
              <Box key={subModule.subModuleName} mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  {subModule.subModuleName}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {Object.entries(subModule.permissions)
                    .filter(([_, value]) => value)
                    .map(([perm]) => {
                      // Assigning a color based on permission type
                      let chipColor;
                      switch (perm) {
                        case "create":
                          chipColor = theme.palette.success.main; // Direct theme reference
                          break;
                        case "read":
                          chipColor = theme.palette.primary.main;
                          break;
                        case "update":
                          chipColor = theme.palette.warning.main;
                          break;
                        case "delete":
                          chipColor = theme.palette.error.main;
                          break;
                        default:
                          chipColor = theme.palette.grey[500]; // Direct theme reference
                      }

                      return (
                        <Chip
                          key={perm}
                          label={perm}
                          size="small"
                          variant="outlined"
                          sx={{
                            margin: 0.5,
                            borderColor: chipColor,
                            color: chipColor,
                          }}
                          title={perm} // Tooltip to show permission on hover
                        />
                      );
                    })}
                </Stack>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      );
    });
  };

  return (
    <Box>
      {/* Header */}
      <BreadcrumbNavigation />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Roles Management</Typography>
        <Tooltip
          title={
            permissions.create
              ? "Add a new role"
              : "You don't have permission to add roles"
          }
          arrow
        >
          <span>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddRole}
              disabled={!permissions.create}
            >
              Add Role
            </Button>
          </span>
        </Tooltip>
      </Box>

      {/* Loading spinner */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Role Name</TableCell>
                <TableCell align="center">Permissions</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role._id}>
                  <TableCell>{role.roleName}</TableCell>
                  <TableCell align="center">
                    {getActivePermissions(role.sections)}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip
                      title={
                        permissions.update
                          ? "Edit Role"
                          : "You don't have permission to edit this role"
                      }
                      arrow
                    >
                      <span>
                        <IconButton
                          onClick={() => handleEditRole(role)}
                          disabled={!permissions.update}
                        >
                          <Edit />
                        </IconButton>
                      </span>
                    </Tooltip>

                    <Tooltip
                      title={
                        loading
                          ? "Action in progress..."
                          : permissions.delete
                          ? "Delete Role"
                          : "You don't have permission to delete this role"
                      }
                      arrow
                    >
                      <span>
                        <IconButton
                          onClick={() => handleDeleteDialogOpen(role)}
                          disabled={!permissions.delete || loading}
                        >
                          <Delete />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Role Modal */}
      <RoleModal
        open={modalOpen}
        onClose={handleCloseModal}
        onUpdate={handleUpdate}
        role={selectedRole}
        mode={mode}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-role-dialog-title"
        aria-describedby="delete-role-dialog-description"
      >
        <DialogTitle id="delete-role-dialog-title">Delete Role</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-role-dialog-description">
            Are you sure you want to delete the role "{selectedRole?.roleName}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteRole}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Roles;
