import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Typography,
  TextField,
  MenuItem,
  IconButton,
  Pagination,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";
import FilterListIcon from "@mui/icons-material/FilterList";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReceiptIcon from "@mui/icons-material/Receipt";

const BusinessProfiles = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("PENDING");
  const [firmTypeFilter, setFirmTypeFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5); // Number of rows per page
  const navigate = useNavigate();

  // Fetch data based on the selected filter
  const fetchData = async (filter) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `/admin/business-profiles/b2b-customers?filter=${filter}`
      );
      if (
        response.data.message ===
        "Filtered B2B customers retrieved successfully."
      ) {
        setData(response.data.data);
      } else {
        setError("Failed to fetch data.");
        toast.error("Failed to fetch data.");
      }
    } catch (err) {
      setError(err.message);
      toast.error("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (event, newValue) => {
    setFilter(newValue);
    fetchData(newValue);
  };

  // Handle firm type filter change
  const handleFirmTypeFilterChange = (event) => {
    setFirmTypeFilter(event.target.value);
    setPage(1); // Reset to the first page when filter changes
  };

  // Handle row click
  const handleRowClick = (cid) => {
    navigate(`/admin/business-profiles/${cid}`);
  };

  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Fetch data on component mount and filter change
  useEffect(() => {
    fetchData(filter);
  }, [filter]);

  // Filter data by firm type
  const filteredData =
    firmTypeFilter === "ALL"
      ? data
      : data.filter((row) => row.firmType === firmTypeFilter);

  // Pagination logic
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // Get unique firm types for the filter dropdown
  const firmTypes = [...new Set(data.map((row) => row.firmType))];

  return (
    <div>
      <BreadcrumbNavigation />
      <Typography variant="h4" gutterBottom>
        Business Profiles
      </Typography>
      <Tabs value={filter} onChange={handleFilterChange}>
        <Tab label="Pending" value="PENDING" />
        <Tab label="Accepted" value="ACCEPTED" />
        <Tab label="Rejected" value="REJECTED" />
      </Tabs>
      <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
        <FilterListIcon sx={{ marginRight: 1 }} />
        <TextField
          select
          label="Filter by Firm Type"
          value={firmTypeFilter}
          onChange={handleFirmTypeFilterChange}
          variant="outlined"
          size="small"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="ALL">All</MenuItem>
          {firmTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : filteredData.length === 0 ? (
        <Typography variant="h6" style={{ marginTop: "20px" }}>
          No data found.
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Firm Type</TableCell>
                  <TableCell>Business Type</TableCell>
                  <TableCell>Customer ID</TableCell>
                  <TableCell>Business Name</TableCell>
                  <TableCell>Contact Number</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>PAN Number</TableCell>
                  <TableCell>GST Number</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow
                    key={row.customerId}
                    hover
                    onClick={() => handleRowClick(row.customerId)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>
                      <BusinessIcon sx={{ marginRight: 1 }} />
                      {row.firmType}
                    </TableCell>
                    <TableCell>{row.businessType}</TableCell>
                    <TableCell>{row.customerId}</TableCell>
                    <TableCell>{row.businessName}</TableCell>
                    <TableCell>
                      <PhoneIcon sx={{ marginRight: 1 }} />
                      {row.businessContactNumber}
                    </TableCell>
                    <TableCell>
                      <EmailIcon sx={{ marginRight: 1 }} />
                      {row.businessEmail}
                    </TableCell>
                    <TableCell>
                      <AssignmentIcon sx={{ marginRight: 1 }} />
                      {row.panNumber}
                    </TableCell>
                    <TableCell>
                      <ReceiptIcon sx={{ marginRight: 1 }} />
                      {row.gstNumber}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
            <Pagination
              count={Math.ceil(filteredData.length / rowsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
    </div>
  );
};

export default BusinessProfiles;
