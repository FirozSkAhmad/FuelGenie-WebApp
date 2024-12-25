import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Modal,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useParams, useLocation } from "react-router-dom";
import api from "../../../utils/api";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import { usePermissions } from "../../../utils/permissionssHelper";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";
const TeamDetail = () => {
  const { teamId } = useParams();
  const { state } = useLocation();
  const { teamName } = state;
  const permissions = usePermissions();
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignedRoles, setAssignedRoles] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState({ open: false, type: "" });
  const theme = useTheme();

  // Fetch Data
  const fetchData = async () => {
    try {
      const [rolesRes, usersRes, assignedRolesRes, assignedUsersRes] =
        await Promise.all([
          api.get("/admin/teams/all-roles"),
          api.get("/admin/teams/approved-users"),
          api.get(`/admin/teams/roles-in-team/${teamId}`),
          api.get(`/admin/teams/users-in-team/${teamId}`),
        ]);

      setRoles(rolesRes.data.data);
      setUsers(usersRes.data.data);
      setAssignedRoles(assignedRolesRes.data.data);
      setAssignedUsers(assignedUsersRes.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [teamId]);

  // Assign Items
  const handleAssignItems = async () => {
    const endpoint =
      isModalOpen.type === "Roles"
        ? "/admin/teams/assign-roles-to-team"
        : "/admin/teams/assign-users-to-team";

    const payload = {
      teamId,
      [isModalOpen.type === "Roles" ? "roleIds" : "uids"]: selectedItems,
    };

    try {
      const response = await api.post(endpoint, payload);

      // Handle both success statuses
      if (
        (isModalOpen.type === "Roles" && response.status === 201) ||
        (isModalOpen.type !== "Roles" && response.status === 200)
      ) {
        toast.success(`${isModalOpen.type} assigned successfully!`);
        fetchData();
        // Clear payload by resetting selectedItems
        setSelectedItems([]);
        setIsModalOpen({ open: false, type: "" });
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error(
        `Error assigning ${isModalOpen.type.toLowerCase()}:`,
        error
      );
      toast.error(`Failed to assign ${isModalOpen.type.toLowerCase()}.`);
    }
  };

  // Delete Apis
  const handleDelete = async (id, type) => {
    const endpoint =
      type === "Roles"
        ? "/admin/teams/remove-role-from-team"
        : "/admin/teams/remove-user-from-team";

    // Build query parameters
    const queryParams = new URLSearchParams({
      [type === "Roles" ? "roleId" : "uid"]: id,
      teamId,
    }).toString();

    try {
      const response = await api.delete(`${endpoint}?${queryParams}`);
      if (response.status === 200) {
        toast.success(`${type} removed successfully!`);
        fetchData(); // Refetch data to update the UI
      } else {
        console.error("Unexpected response:", response);
        alert(`Failed to remove ${type.toLowerCase()}.`);
      }
    } catch (error) {
      console.error(`Error removing ${type.toLowerCase()}:`, error);
      toast.error(`Failed to remove ${type.toLowerCase()}.`);
    }
  };

  const renderModal = () => {
    const items = isModalOpen.type === "Roles" ? roles : users;
    const assignedItems =
      isModalOpen.type === "Roles" ? assignedRoles : assignedUsers;

    return (
      <Modal
        open={isModalOpen.open}
        onClose={() => setIsModalOpen({ open: false, type: "" })}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.mode === "dark" ? "#333" : "#fff",
            color: theme.palette.mode === "dark" ? "#fff" : "#000",
            padding: "2rem",
            margin: "auto",
            marginTop: "10%",
            width: "50%",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Assign {isModalOpen.type}
          </Typography>
          <List>
            {items.map((item) => {
              const isAssigned = assignedItems.some((assigned) =>
                isModalOpen.type === "Roles"
                  ? assigned.roleId === item.roleId
                  : assigned.uid === item.uid
              );
              return (
                <ListItem key={item.roleId || item.uid} disabled={isAssigned}>
                  <ListItemIcon>
                    <Checkbox
                      checked={selectedItems.includes(item.roleId || item.uid)}
                      onChange={(e) => {
                        const value = e.target.checked
                          ? [...selectedItems, item.roleId || item.uid]
                          : selectedItems.filter(
                              (id) => id !== (item.roleId || item.uid)
                            );
                        setSelectedItems(value);
                      }}
                      disabled={isAssigned}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.roleName || `${item.name} (${item.email})`}
                  />
                </ListItem>
              );
            })}
          </List>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAssignItems}
            disabled={!permissions.update}
          >
            Assign {isModalOpen.type}
          </Button>
        </Box>
      </Modal>
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const renderAssignedList = (items, type) => (
    <List>
      {items.map((item) => (
        <ListItem key={item.roleId || item.uid}>
          <ListItemText
            primary={
              type === "Roles" ? item.roleName : `${item.name} (${item.email})`
            }
          />
          <IconButton
            onClick={() => handleDelete(item.roleId || item.uid, type)}
            disabled={!permissions.delete}
          >
            <Delete />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box sx={{ padding: "2rem" }}>
      <BreadcrumbNavigation />
      <Typography variant="h4" gutterBottom>
        {teamName} - Team Management
      </Typography>

      {/* Assigned Roles */}
      <Box sx={{ marginBottom: "2rem" }}>
        <Typography variant="h6" gutterBottom>
          Assigned Roles
        </Typography>
        {renderAssignedList(assignedRoles, "Roles")}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsModalOpen({ open: true, type: "Roles" })}
          disabled={!permissions.update}
        >
          Assign Roles
        </Button>
      </Box>

      {/* Assigned Users */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Assigned Users
        </Typography>
        {renderAssignedList(assignedUsers, "Users")}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsModalOpen({ open: true, type: "Users" })}
          disabled={!permissions.update}
        >
          Assign Users
        </Button>
      </Box>

      {renderModal()}
    </Box>
  );
};

export default TeamDetail;
