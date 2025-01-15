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
import AssignmentIcon from "@mui/icons-material/Assignment"; // Icon for assigned orders
import PersonIcon from "@mui/icons-material/Person"; // Icon for driver name
import BadgeIcon from "@mui/icons-material/Badge"; // Icon for driver ID
import PhoneIcon from "@mui/icons-material/Phone"; // Icon for contact
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation"; // Icon for capacity
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"; // Icon for RC number
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Icon for shift
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClearIcon from "@mui/icons-material/Clear";
import { usePermissions } from "../../../utils/permissionssHelper";

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
  const permissions = usePermissions();
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
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <CircularProgress />
              </Box>
            ) : drivers.length === 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Typography variant="body1" color="textSecondary">
                  No Drivers Available
                </Typography>
              </Box>
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
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <PersonIcon fontSize="small" />{" "}
                              {/* Icon for driver name */}
                              <Typography variant="body1">
                                {driver.driverName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <BadgeIcon fontSize="small" />{" "}
                              {/* Icon for driver ID */}
                              <Typography variant="body1">
                                {driver.driverId}
                              </Typography>
                            </Box>
                          </TableCell>
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
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Assigned Drivers
            </Typography>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <CircularProgress />
              </Box>
            ) : assignedDrivers.length === 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Typography variant="body1" color="textSecondary">
                  No Assigned Drivers
                </Typography>
              </Box>
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
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <PersonIcon fontSize="small" />{" "}
                                {/* Icon for driver name */}
                                <Typography variant="body1">
                                  {driver.driverName}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <BadgeIcon fontSize="small" />{" "}
                                {/* Icon for driver ID */}
                                <Typography variant="body1">
                                  {driver.driverId}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <LocalGasStationIcon fontSize="small" />{" "}
                                {/* Icon for bowser */}
                                <Typography variant="body1">
                                  {driver.bowserNo}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <AccessTimeIcon fontSize="small" />{" "}
                                {/* Icon for shift */}
                                <Typography variant="body1">
                                  {formatShift(driver.shift)}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <AssignmentIcon fontSize="small" />{" "}
                                {/* Icon for assigned orders */}
                                <Typography variant="body1">
                                  {driver.orders}
                                </Typography>
                              </Box>
                            </TableCell>
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
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {/* Name */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonIcon fontSize="small" /> {/* Icon for name */}
                <Typography>Name: {driverDetails.driverName}</Typography>
              </Box>

              {/* Contact */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon fontSize="small" /> {/* Icon for contact */}
                <Typography>Contact: {driverDetails.contactDetails}</Typography>
              </Box>

              {/* Bowser and Shift (if assigned) */}
              {isAssignedDriver && (
                <>
                  {/* Bowser */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocalGasStationIcon fontSize="small" />{" "}
                    {/* Icon for bowser */}
                    <Typography>
                      Bowser:{" "}
                      {
                        assignedDrivers.find(
                          (driver) => driver.driverId === selectedDriver
                        ).bowserNo
                      }
                    </Typography>
                  </Box>

                  {/* Shift */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccessTimeIcon fontSize="small" /> {/* Icon for shift */}
                    <Typography>
                      Shift:{" "}
                      {(() => {
                        const shift = assignedDrivers.find(
                          (driver) => driver.driverId === selectedDriver
                        ).shift;

                        if (!shift) return "No Shift Assigned"; // Handle empty shift

                        // Split the shift into start and end hours
                        const [startHour, endHour] = shift
                          .split("-")
                          .map(Number);

                        // Convert hours to AM/PM format
                        const formatTime = (hour) => {
                          const period = hour < 12 ? "AM" : "PM"; // Determine AM or PM
                          const formattedHour =
                            hour % 12 === 0 ? 12 : hour % 12; // Convert to 12-hour format
                          return `${formattedHour} ${period}`; // Return formatted time
                        };

                        // Return formatted shift
                        return `${formatTime(startHour)} - ${formatTime(
                          endHour
                        )}`;
                      })()}
                    </Typography>
                  </Box>

                  {/* Unassign Button */}
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleUnassignBowser}
                    disabled={loading || !permissions.update}
                    sx={{ marginTop: 2 }}
                  >
                    Unassign Bowser
                  </Button>
                </>
              )}
            </Box>
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
                  renderValue={(selected) => {
                    if (!selected) return "Select a Bowser";
                    const selectedBowserData = unassignedBowsers.find(
                      (bowser) => bowser.bowserId === selected
                    );
                    return (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <DirectionsCarIcon fontSize="small" />
                        <Typography variant="body1">
                          RC: {selectedBowserData.rcNumber}
                        </Typography>
                        <LocalGasStationIcon fontSize="small" />
                        <Typography variant="body1">
                          (Capacity: {selectedBowserData.currentCapacity}/
                          {selectedBowserData.bowserLimit})
                        </Typography>
                      </Box>
                    );
                  }}
                >
                  {unassignedBowsers.length === 0 ? (
                    <MenuItem disabled>
                      <Typography variant="body2" color="textSecondary">
                        No Unassigned Bowsers Available
                      </Typography>
                    </MenuItem>
                  ) : (
                    unassignedBowsers.map((bowser) => (
                      <MenuItem key={bowser.bowserId} value={bowser.bowserId}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <DirectionsCarIcon fontSize="small" />
                          <Typography variant="body1" sx={{ flexGrow: 1 }}>
                            RC: {bowser.rcNumber}
                          </Typography>
                          <LocalGasStationIcon fontSize="small" />
                          <Typography variant="body1">
                            {bowser.currentCapacity}/{bowser.bowserLimit}
                          </Typography>
                        </Box>
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
                  renderValue={(selected) => {
                    if (!selected) return "Select a Shift";
                    return (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <AccessTimeIcon fontSize="small" />{" "}
                        {/* Icon for shift */}
                        <Typography variant="body1">
                          {selected === "9-21" ? "9 AM - 9 PM" : "9 PM - 9 AM"}
                        </Typography>
                      </Box>
                    );
                  }}
                >
                  <MenuItem value="">
                    <Typography variant="body2" color="textSecondary">
                      Select a Shift
                    </Typography>
                  </MenuItem>
                  <MenuItem value="9-21">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTimeIcon fontSize="small" />
                      <Typography variant="body1">9 AM - 9 PM</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="21-9">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTimeIcon fontSize="small" />
                      <Typography variant="body1">9 PM - 9 AM</Typography>
                    </Box>
                  </MenuItem>
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
            isAssignedDriver ||
            !permissions.update
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
            !isAssignedDriver ||
            !permissions.update
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
