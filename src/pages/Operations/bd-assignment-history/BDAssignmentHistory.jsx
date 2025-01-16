import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Pagination,
  Box,
  MenuItem,
  FormControl,
  TextField,
  InputAdornment,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person"; // Icon for driver name
import BadgeIcon from "@mui/icons-material/Badge"; // Icon for driver ID
import PhoneIcon from "@mui/icons-material/Phone"; // Icon for contact
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation"; // Icon for capacity
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"; // Icon for RC number

import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";

import CategoryIcon from "@mui/icons-material/Category"; // Icon for Type filter
import LocalShippingIcon from "@mui/icons-material/LocalShipping"; // Icon for Bowser ID filter

const BDAssignmentHistory = () => {
  const [history, setHistory] = useState([]); // All data fetched from the API
  const [filteredHistory, setFilteredHistory] = useState([]); // Data after applying filters
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [typeFilter, setTypeFilter] = useState("");
  const [bowserIdFilter, setBowserIdFilter] = useState("");
  const [driverIdFilter, setDriverIdFilter] = useState("");

  // Fetch all data on component mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get(
        "/operations/bd-assignment-history/bowser-driver-history"
      );
      setHistory(response.data.data);
      setFilteredHistory(response.data.data); // Initialize filtered data with all data
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever filter states change
  useEffect(() => {
    applyFilters();
  }, [typeFilter, bowserIdFilter, driverIdFilter, history]);

  const applyFilters = () => {
    let filteredData = history;

    if (typeFilter) {
      filteredData = filteredData.filter((item) => item.action === typeFilter);
    }

    if (bowserIdFilter) {
      filteredData = filteredData.filter(
        (item) => item.bowserId === bowserIdFilter
      );
    }

    if (driverIdFilter) {
      filteredData = filteredData.filter(
        (item) => item.driverId === driverIdFilter
      );
    }

    setFilteredHistory(filteredData);
    setPage(1); // Reset to the first page after applying filters
  };

  // Format shift to A.M./P.M. format
  const formatShift = (shift) => {
    if (!shift) return "N/A"; // Handle undefined or null shift
    const [start, end] = shift.split("-");
    const formatTime = (time) => {
      const hours = parseInt(time, 10);
      const period = hours >= 12 ? "P.M." : "A.M.";
      const formattedHours = hours % 12 || 12; // Convert to 12-hour format
      return `${formattedHours} ${period}`;
    };
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
  };

  const handleBowserIdFilterChange = (event) => {
    setBowserIdFilter(event.target.value);
  };

  const handleDriverIdFilterChange = (event) => {
    setDriverIdFilter(event.target.value);
  };

  const paginatedHistory = filteredHistory.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center">
        Error: {error}
      </Typography>
    );
  }

  return (
    <Box>
      <BreadcrumbNavigation />
      <Typography variant="h5" align="center" mt={2}>
        Bowser & Driver Assignment History{" "}
      </Typography>
      <Box mb={2} display="flex" gap={2}>
        {/* Type Filter */}
        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <TextField
            select
            label="Type"
            value={typeFilter}
            onChange={handleTypeFilterChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CategoryIcon /> {/* Icon for Type filter */}
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="ASSIGNED">Assigned</MenuItem>
            <MenuItem value="REASSIGNED">Reassigned</MenuItem>
            <MenuItem value="UNASSIGNED">Unassigned</MenuItem>
          </TextField>
        </FormControl>

        {/* Bowser ID Filter */}
        <FormControl variant="outlined" size="small" sx={{ minWidth: 250 }}>
          <TextField
            select
            label="Bowser ID"
            value={bowserIdFilter}
            onChange={handleBowserIdFilterChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocalShippingIcon /> {/* Icon for Bowser ID filter */}
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="">All</MenuItem>
            {Array.from(new Set(history.map((item) => item.bowserId))).map(
              (id) => {
                // Find the first item with this bowserId to get rcNumber and capacity
                const item = history.find((item) => item.bowserId === id);
                return (
                  <MenuItem key={id} value={id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <DirectionsCarIcon fontSize="small" />{" "}
                      {/* Icon for RC Number */}
                      <Typography variant="body1">
                        RC: {item.rcNumber}
                      </Typography>
                      <LocalGasStationIcon fontSize="small" />{" "}
                      {/* Icon for Capacity */}
                      <Typography variant="body1">
                        (Capacity: {item.capacity})
                      </Typography>
                    </Box>
                  </MenuItem>
                );
              }
            )}
          </TextField>
        </FormControl>

        {/* Driver ID Filter */}
        <FormControl variant="outlined" size="small" sx={{ minWidth: 250 }}>
          <TextField
            select
            label="Driver ID"
            value={driverIdFilter}
            onChange={handleDriverIdFilterChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon /> {/* Icon for Driver ID filter */}
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="">All</MenuItem>
            {Array.from(new Set(history.map((item) => item.driverId))).map(
              (id) => {
                // Find the first item with this driverId to get driverName and contactNumber
                const item = history.find((item) => item.driverId === id);
                return (
                  <MenuItem key={id} value={id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <BadgeIcon fontSize="small" /> {/* Icon for Driver */}
                      <Typography variant="body1">{item.driverName}</Typography>
                      <PhoneIcon fontSize="small" />{" "}
                      {/* Icon for Phone Number */}
                      <Typography variant="body1">
                        {item.contactNumber}
                      </Typography>
                    </Box>
                  </MenuItem>
                );
              }
            )}
          </TextField>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bowser ID</TableCell>
              <TableCell>Driver ID</TableCell>
              <TableCell>Driver Name</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>RC Number</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Shift</TableCell>
              <TableCell>Updated By</TableCell>

              <TableCell>Action</TableCell>
              <TableCell>Updated Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  <Typography variant="h6">No data found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedHistory.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.bowserId}</TableCell>
                  <TableCell>{item.driverId}</TableCell>
                  <TableCell>{item.driverName}</TableCell>
                  <TableCell>{item.contactNumber}</TableCell>
                  <TableCell>{item.rcNumber}</TableCell>
                  <TableCell>{item.capacity} liters</TableCell>
                  <TableCell>{formatShift(item.shift)}</TableCell>
                  <TableCell>
                    {item.assignedBy || item.unAssignedBy || item.reAssignedBy}
                  </TableCell>

                  <TableCell>{item.action}</TableCell>
                  <TableCell>
                    {new Date(
                      item.assignmentDate ||
                        item.unAssignmentDate ||
                        item.reAssignmentDate
                    ).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredHistory.length > 0 && (
        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(filteredHistory.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default BDAssignmentHistory;
