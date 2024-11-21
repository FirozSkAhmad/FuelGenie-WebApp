import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useParams, useLocation } from "react-router-dom";
import api from "../../../utils/api";

const TeamDetail = () => {
  const { teamId } = useParams();
  const { state } = useLocation();
  const { teamName } = state;

  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all roles
  const fetchRoles = async () => {
    try {
      const response = await api.get("/admin/team/all-roles");
      if (response.status === 200) {
        setRoles(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // Fetch approved users
  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/team/approved-users");
      if (response.status === 200) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Assign roles to the team
  const handleAssignRoles = async () => {
    try {
      const response = await api.post("/admin/team/assign-roles-to-team", {
        teamId,
        roleIds: selectedRoles,
      });
      if (response.status === 200) {
        alert("Roles assigned successfully!");
      }
    } catch (error) {
      console.error("Error assigning roles:", error);
      alert("Failed to assign roles.");
    }
  };

  // Assign users to the team
  const handleAssignUsers = async () => {
    try {
      const response = await api.post("/admin/team/assign-users-to-team", {
        teamId,
        uids: selectedUsers,
      });
      if (response.status === 200) {
        alert("Users assigned successfully!");
      }
    } catch (error) {
      console.error("Error assigning users:", error);
      alert("Failed to assign users.");
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchUsers();
    setLoading(false);
  }, []);

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

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        {teamName} - Team Management
      </Typography>

      {/* Assign Roles */}
      <Box sx={{ marginBottom: "2rem" }}>
        <FormControl fullWidth>
          <InputLabel>Roles</InputLabel>
          <Select
            multiple
            value={selectedRoles}
            onChange={(e) => setSelectedRoles(e.target.value)}
          >
            {roles.map((role) => (
              <MenuItem key={role.roleId} value={role.roleId}>
                {role.roleName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAssignRoles}
          sx={{ marginTop: "1rem" }}
        >
          Assign Roles
        </Button>
      </Box>

      {/* Assign Users */}
      <Box>
        <FormControl fullWidth>
          <InputLabel>Users</InputLabel>
          <Select
            multiple
            value={selectedUsers}
            onChange={(e) => setSelectedUsers(e.target.value)}
          >
            {users.map((user) => (
              <MenuItem key={user.uid} value={user.uid}>
                {user.name} ({user.email})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAssignUsers}
          sx={{ marginTop: "1rem" }}
        >
          Assign Users
        </Button>
      </Box>
    </Box>
  );
};

export default TeamDetail;
