import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
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
  TablePagination,
  Snackbar,
  Alert,
  Chip,
  Box,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import api from "../../../utils/api";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";

const B2BApprovals = () => {
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState("PENDING"); // Status filter
  const [firmTypeFilter, setFirmTypeFilter] = useState("ALL"); // Firm type filter
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, [filter]); // Fetch data when filter changes

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `/management/b2b-approvals/get-b2b-registered-customers?filter=${filter}`
      );
      setCustomers(response.data.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError("Failed to fetch customers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (cid) => {
    navigate(`/management/b2b-approvals/${cid}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when changing rows per page
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  const handleClearFilters = () => {
    setFilter("PENDING");
    setFirmTypeFilter("ALL");
  };

  // Client-side filtering based on firmType
  const filteredCustomers = customers.filter((customer) => {
    const matchesFirmType =
      firmTypeFilter === "ALL" || customer.firmType === firmTypeFilter;

    return matchesFirmType;
  });

  // Calculate the customers to display for the current page
  const paginatedCustomers = filteredCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div style={{ padding: "20px" }}>
      <BreadcrumbNavigation />
      <Typography variant="h4" gutterBottom>
        B2B Approvals
      </Typography>

      {/* Filters Section */}
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <Button
          variant={filter === "PENDING" ? "contained" : "outlined"}
          onClick={() => setFilter("PENDING")}
        >
          Pending
        </Button>
        <Button
          variant={filter === "ACCEPTED" ? "contained" : "outlined"}
          onClick={() => setFilter("ACCEPTED")}
        >
          Accepted
        </Button>
        <Button
          variant={filter === "REJECTED" ? "contained" : "outlined"}
          onClick={() => setFilter("REJECTED")}
        >
          Rejected
        </Button>

        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <Select
            value={firmTypeFilter}
            onChange={(e) => setFirmTypeFilter(e.target.value)}
          >
            <MenuItem value="ALL">All Firm Types</MenuItem>
            <MenuItem value="PROPRIETORSHIP">Proprietorship</MenuItem>
            <MenuItem value="PARTNERSHIP">Partnership</MenuItem>
            <MenuItem value="PRIVATE LTD / LTD.">Private Limited</MenuItem>
            {/* Add more firm types as needed */}
          </Select>
        </FormControl>

        <Button variant="outlined" onClick={handleClearFilters}>
          Clear Filters
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Business Name</TableCell>
                  <TableCell>Firm Type</TableCell>
                  <TableCell>Business Type</TableCell>
                  <TableCell>Contact Number</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>PAN Number</TableCell>
                  <TableCell>GST Number</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCustomers.length > 0 ? (
                  paginatedCustomers.map((customer) => (
                    <TableRow
                      key={customer.customerId}
                      hover
                      onClick={() => handleRowClick(customer.customerId)}
                      style={{ cursor: "pointer" }}
                    >
                      <TableCell>{customer.businessName}</TableCell>
                      <TableCell>{customer.firmType}</TableCell>
                      <TableCell>{customer.businessType}</TableCell>
                      <TableCell>{customer.businessContactNumber}</TableCell>
                      <TableCell>{customer.businessEmail}</TableCell>
                      <TableCell>{customer.fullName}</TableCell>
                      <TableCell>{customer.panNumber}</TableCell>
                      <TableCell>{customer.gstNumber}</TableCell>
                      <TableCell>
                        <Chip
                          label={filter}
                          color={
                            filter === "PENDING"
                              ? "warning"
                              : filter === "ACCEPTED"
                              ? "success"
                              : "error"
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredCustomers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default B2BApprovals;
