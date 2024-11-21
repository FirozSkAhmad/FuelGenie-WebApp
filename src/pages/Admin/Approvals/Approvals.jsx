import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import api from "../../../utils/api";

const Approvals = () => {
  const [activeTab, setActiveTab] = useState(0); // 0: Pending, 1: Approved
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async (isApproved) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/admin/approvals/users?isApproved=${isApproved}`
      );
      if (response.status === 200) {
        setUsers(response.data.data);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (uid) => {
    try {
      const response = await api.post(`/admin/approvals/approve-user/${uid}`);
      if (response.status === 200) {
        alert("User approved successfully!");
        fetchUsers(false); // Refresh pending approvals
      } else {
        alert("Failed to approve user.");
      }
    } catch (error) {
      console.error("Error approving user:", error);
      alert("An error occurred.");
    }
  };

  const handleDelete = async (uid) => {
    try {
      const response = await api.delete(`/admin/team/delete-user/${uid}`);
      if (response.status === 200) {
        alert("User deleted successfully!");
        fetchUsers(true); // Refresh approved users
      } else {
        alert("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred.");
    }
  };

  useEffect(() => {
    fetchUsers(activeTab === 0 ? false : true); // Load initial tab data
  }, [activeTab]);

  const renderActions = (user) => {
    if (activeTab === 0) {
      // Pending Tab: Approve/Reject Actions
      return (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleApprove(user.uid)}
            sx={{ marginRight: "1rem" }}
          >
            Approve
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDelete(user.uid)}
          >
            Reject
          </Button>
        </>
      );
    } else {
      // Approved Tab: Delete Action
      return (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDelete(user.uid)}
        >
          Delete
        </Button>
      );
    }
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

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        User Approvals
      </Typography>
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ marginBottom: "1rem" }}
      >
        <Tab label="Pending Approvals" />
        <Tab label="Approved Users" />
      </Tabs>
      {users.length === 0 ? (
        <Typography variant="body1">
          {activeTab === 0
            ? "No users pending approval."
            : "No approved users available."}
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{renderActions(user)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Approvals;
