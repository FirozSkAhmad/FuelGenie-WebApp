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
  TablePagination,
} from "@mui/material";
import api from "../../../utils/api";
import { toast } from "react-toastify";

const Approvals = () => {
  const [activeTab, setActiveTab] = useState(0); // 0: Pending, 1: Approved, 2: Rejected
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page

  const fetchUsers = async (tabIndex) => {
    try {
      setLoading(true);
      let response;
      if (tabIndex === 0) {
        // Fetch pending users
        response = await api.get(`/admin/approvals/users?isApproved=false`);
      } else if (tabIndex === 1) {
        // Fetch approved users
        response = await api.get(`/admin/approvals/users?isApproved=true`);
      } else if (tabIndex === 2) {
        // Fetch rejected users
        response = await api.get(`/admin/approvals/rejected-users`);
      }

      if (response.status === 200) {
        setUsers(response.data.data); // Store all users
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
        toast.success("User approved successfully!");
        fetchUsers(activeTab); // Refresh current tab data
      } else {
        alert("Failed to approve user.");
      }
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error("An error occurred.");
    }
  };

  const handleReject = async (uid) => {
    try {
      const response = await api.post(`/admin/approvals/reject-user/${uid}`);
      if (response.status === 200) {
        toast.success("User rejected successfully!");
        fetchUsers(activeTab); // Refresh current tab data
      } else {
        alert("Failed to reject user.");
      }
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast.error("An error occurred.");
    }
  };

  const handleDelete = async (uid) => {
    try {
      const response = await api.delete(`/admin/approvals/delete-user/${uid}`);
      if (response.status === 200) {
        toast.success("User deleted successfully!");
        fetchUsers(activeTab); // Refresh current tab data
      } else {
        alert("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred.");
    }
  };

  useEffect(() => {
    fetchUsers(activeTab); // Load data for the active tab
  }, [activeTab]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

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
            onClick={() => handleReject(user.uid)}
          >
            Reject
          </Button>
        </>
      );
    } else if (activeTab === 1) {
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
    } else {
      // Rejected Tab: No actions
      return null;
    }
  };

  // Calculate paginated users
  const paginatedUsers = users.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
        onChange={(e, newValue) => {
          setActiveTab(newValue);
          setPage(0); // Reset to the first page when switching tabs
        }}
        sx={{ marginBottom: "1rem" }}
      >
        <Tab label="Pending Approvals" />
        <Tab label="Approved Users" />
        <Tab label="Rejected Users" />
      </Tabs>
      {users.length === 0 ? (
        <Typography variant="body1">
          {activeTab === 0
            ? "No users pending approval."
            : activeTab === 1
            ? "No approved users available."
            : "No rejected users available."}
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Gender</TableCell>
                  {activeTab !== 2 && <TableCell>Actions</TableCell>}{" "}
                  {/* Hide Actions column for Rejected tab */}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phoneNumber}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    {activeTab !== 2 && (
                      <TableCell>{renderActions(user)}</TableCell>
                    )}{" "}
                    {/* Hide Actions column for Rejected tab */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.length} // Total number of rows
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Box>
  );
};

export default Approvals;
