import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Pagination,
  Divider,
  Chip,
} from "@mui/material";
import { Add, CheckCircle, Cancel } from "@mui/icons-material";
import api from "../../utils/api";
import RoleModal from "../../components/admin/RoleModal";
import { CircularProgress } from "@mui/material";
function Roles() {
  const [openModal, setOpenModal] = useState(false);
  const [rolesData, setRolesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const fetchRoles = async () => {
    try {
      const response = await api.get("/role/all-roles");
      if (response.status === 200) {
        setRolesData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRoles();
  }, []);

  // Helper function to display permissions in a structured way
  const renderPermissions = (sections) =>
    sections.map((section, idx) => (
      <Box key={idx} sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" color="primary">
          {section.moduleName}
        </Typography>
        {section.subModules.map((subModule, subIdx) => (
          <Box key={subIdx} sx={{ pl: 2, mt: 1 }}>
            <Typography variant="body2" fontWeight="bold">
              {subModule.subModuleName}
            </Typography>
            <Box display="flex" gap={1} mt={0.5}>
              {["create", "read", "update", "delete"].map((action) => (
                <Chip
                  key={action}
                  label={action.charAt(0).toUpperCase() + action.slice(1)}
                  icon={
                    subModule.permissions[action] ? (
                      <CheckCircle color="success" />
                    ) : (
                      <Cancel color="error" />
                    )
                  }
                  color={subModule.permissions[action] ? "success" : "error"}
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1 }}
                />
              ))}
            </Box>
          </Box>
        ))}
        <Divider sx={{ mt: 1, mb: 2 }} />
      </Box>
    ));

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumb */}
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Home &gt; Admin &gt; <strong>Role</strong>
      </Typography>

      {/* Title and Add Role Button */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold">
          Admin
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          sx={{ borderRadius: "20px" }}
          onClick={handleOpenModal}
        >
          Add Role
        </Button>
      </Box>

      {/* Filter Sort Option */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Select defaultValue="Newest first" size="small" sx={{ minWidth: 150 }}>
          <MenuItem value="Newest first">Newest first</MenuItem>
          <MenuItem value="Oldest first">Oldest first</MenuItem>
        </Select>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Role ID
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Role Name
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Permissions
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Created at
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : rolesData.length > 0 ? (
              rolesData.map((role) => (
                <TableRow key={role._id}>
                  <TableCell>{role.roleId}</TableCell>
                  <TableCell>{role.roleName}</TableCell>
                  <TableCell>{renderPermissions(role.sections)}</TableCell>
                  <TableCell>
                    {new Date(role.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No roles available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={10}
          variant="outlined"
          shape="rounded"
          color="primary"
        />
      </Box>

      {/* Role Modal */}
      <RoleModal
        open={openModal}
        onClose={handleCloseModal}
        onUpdate={fetchRoles}
      />
    </Box>
  );
}

export default Roles;
