import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import {
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
} from "@mui/material";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClearIcon from "@mui/icons-material/Clear";

const AssignBowsers = () => {
  const [drivers, setDrivers] = useState([]);
  const [assignedDrivers, setAssignedDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [driverDetails, setDriverDetails] = useState(null);
  const [unassignedBowsers, setUnassignedBowsers] = useState([]);
  const [selectedBowser, setSelectedBowser] = useState("");
  const [shift, setShift] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch unassigned and assigned drivers on component mount
  useEffect(() => {
    fetchUnassignedDrivers();
    fetchAssignedDrivers();
  }, []);

  const fetchUnassignedDrivers = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        "/operations/assign-bowsers/get-drivers?type=unassigned"
      );
      setDrivers(response.data.data);
      setError(null);
    } catch (error) {
      setError("Error fetching unassigned drivers. Please try again.");
      toast.error("Error fetching unassigned drivers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedDrivers = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        "/operations/assign-bowsers/get-drivers?type=assigned"
      );
      setAssignedDrivers(response.data.data);
      setError(null);
    } catch (error) {
      setError("Error fetching assigned drivers. Please try again.");
      toast.error("Error fetching assigned drivers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDriverDetails = async (driverId) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/operations/assign-bowsers/get-driver-details/${driverId}`
      );
      setDriverDetails(response.data.data);
      setError(null);
    } catch (error) {
      setError("Error fetching driver details. Please try again.");
      toast.error("Error fetching driver details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnassignedBowsers = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        "/operations/assign-bowsers/get-unassigned-bowsers"
      );
      setUnassignedBowsers(response.data.data);
      setError(null);
    } catch (error) {
      setError("Error fetching unassigned bowsers. Please try again.");
      toast.error("Error fetching unassigned bowsers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignBowser = async () => {
    setLoading(true);
    try {
      await api.post("/operations/assign-bowsers/assign-bowser", {
        driverId: selectedDriver,
        bowserId: selectedBowser,
        shift: shift,
      });
      setSuccess("Bowser assigned successfully!");
      toast.success("Bowser assigned successfully!");
      fetchUnassignedDrivers();
      fetchAssignedDrivers();
      fetchUnassignedBowsers();
      clearSelection();
    } catch (error) {
      setError("Error assigning bowser. Please try again.");
      toast.error("Error assigning bowser. Please try again.");
    } finally {
      setSuccess(null);
      setLoading(false);
    }
  };

  const handleReassignBowser = async () => {
    setLoading(true);
    try {
      await api.post("/operations/assign-bowsers/reassign-bowser", {
        driverId: selectedDriver,
        bowserId: selectedBowser,
        shift: shift,
      });
      setSuccess("Bowser reassigned successfully!");
      toast.success("Bowser reassigned successfully!");
      fetchUnassignedDrivers();
      fetchAssignedDrivers();
      fetchUnassignedBowsers();
      clearSelection();
    } catch (error) {
      setError("Error reassigning bowser. Please try again.");
      toast.error("Error reassigning bowser. Please try again.");
    } finally {
      setSuccess(null);
      setLoading(false);
    }
  };

  const handleUnassignBowser = async () => {
    setLoading(true);
    try {
      await api.post("/operations/assign-bowsers/unassign-bowser", {
        driverId: selectedDriver,
      });
      setSuccess("Bowser unassigned successfully!");
      toast.success("Bowser unassigned successfully!");
      fetchUnassignedDrivers();
      fetchAssignedDrivers();
      fetchUnassignedBowsers();
      clearSelection();
    } catch (error) {
      setError("Error unassigning bowser. Please try again.");
      toast.error("Error unassigning bowser. Please try again.");
    } finally {
      setSuccess(null);
      setLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedDriver(null);
    setSelectedBowser("");
    setShift("");
    setDriverDetails(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Check if the selected driver is assigned
  const isAssignedDriver = selectedDriver
    ? assignedDrivers.some((driver) => driver.driverId === selectedDriver)
    : false;

  return (
    <Box sx={{ padding: 3 }}>
      <BreadcrumbNavigation />
      <Typography variant="h4" gutterBottom>
        Assign Bowsers
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Grid container spacing={3}>
        {/* Unassigned Drivers Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Unassigned Drivers
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Driver Name</TableCell>
                      <TableCell>Driver ID</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {drivers
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((driver) => (
                        <TableRow
                          key={driver.driverId}
                          hover
                          onClick={() => {
                            setSelectedDriver(driver.driverId);
                            fetchDriverDetails(driver.driverId);
                            fetchUnassignedBowsers();
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <TableCell>{driver.driverName}</TableCell>
                          <TableCell>{driver.driverId}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={drivers.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            )}
          </Paper>
        </Grid>

        {/* Assigned Drivers Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Assigned Drivers
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Driver Name</TableCell>
                      <TableCell>Driver ID</TableCell>
                      <TableCell>Bowser</TableCell>
                      <TableCell>Shift</TableCell>
                      <TableCell>Assigned Orders</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignedDrivers
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((driver) => {
                        // Format shift function
                        const formatShift = (shift) => {
                          const [startHour, endHour] = shift
                            .split("-")
                            .map(Number);
                          const formatTime = (hour) => {
                            const period = hour < 12 ? "A.M" : "P.M";
                            const formattedHour =
                              hour % 12 === 0 ? 12 : hour % 12;
                            return `${formattedHour} ${period}`;
                          };
                          return `${formatTime(startHour)} - ${formatTime(
                            endHour
                          )}`;
                        };

                        return (
                          <TableRow
                            key={driver.driverId}
                            hover
                            onClick={() => {
                              setSelectedDriver(driver.driverId);
                              fetchDriverDetails(driver.driverId);
                              fetchUnassignedBowsers();
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <TableCell>{driver.driverName}</TableCell>
                            <TableCell>{driver.driverId}</TableCell>
                            <TableCell>{driver.bowserNo}</TableCell>
                            {/* Render formatted shift */}
                            <TableCell>{formatShift(driver.shift)}</TableCell>
                            <TableCell>{driver.orders}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={assignedDrivers.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Driver Details Section */}
      {driverDetails && (
        <Box sx={{ marginTop: 3 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Driver Details
              </Typography>
              <IconButton onClick={clearSelection} color="error">
                <ClearIcon />
              </IconButton>
            </Box>
            <Typography>Name: {driverDetails.driverName}</Typography>
            <Typography>Contact: {driverDetails.contactDetails}</Typography>
            {isAssignedDriver && (
              <>
                <Typography>
                  Bowser:{" "}
                  {
                    assignedDrivers.find(
                      (driver) => driver.driverId === selectedDriver
                    ).bowserNo
                  }
                </Typography>
                <Typography>
                  Shift:{" "}
                  {
                    assignedDrivers.find(
                      (driver) => driver.driverId === selectedDriver
                    ).shift
                  }
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleUnassignBowser}
                  disabled={loading}
                  sx={{ marginTop: 2 }}
                >
                  Unassign Bowser
                </Button>
              </>
            )}
          </Paper>
        </Box>
      )}

      {/* Bowser and Shift Selection Section */}
      <Box sx={{ marginTop: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Select a Bowser</InputLabel>
                <Select
                  value={selectedBowser}
                  onChange={(e) => setSelectedBowser(e.target.value)}
                  label="Select a Bowser"
                  disabled={!selectedDriver || unassignedBowsers.length === 0}
                >
                  {unassignedBowsers.length === 0 ? (
                    <MenuItem disabled>No Unassigned Bowsers</MenuItem>
                  ) : (
                    unassignedBowsers.map((bowser) => (
                      <MenuItem key={bowser.bowserId} value={bowser.bowserId}>
                        {bowser.bowserId} (Capacity: {bowser.currentCapacity}/
                        {bowser.bowserLimit})
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Select a Shift</InputLabel>
                <Select
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  label="Select a Shift"
                  disabled={!selectedDriver}
                >
                  <MenuItem value="">Select a Shift</MenuItem>
                  <MenuItem value="9-21">9 AM - 9 PM</MenuItem>
                  <MenuItem value="21-9">9 PM - 9 AM</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Action Buttons Section */}
      <Box sx={{ marginTop: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAssignBowser}
          disabled={
            !selectedDriver ||
            !selectedBowser ||
            !shift ||
            loading ||
            isAssignedDriver
          }
          sx={{ marginRight: 2 }}
        >
          Assign Bowser
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleReassignBowser}
          disabled={
            !selectedDriver ||
            !selectedBowser ||
            !shift ||
            loading ||
            !isAssignedDriver
          }
          sx={{ marginRight: 2 }}
        >
          Reassign Bowser
        </Button>
      </Box>
    </Box>
  );
};

export default AssignBowsers;
