import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Link,
  Container,
  Grid,
  Button,
  Tooltip,
  CircularProgress, // Import CircularProgress
} from "@mui/material";
import {
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CreateZoneModal from "../../../components/addProduct/zonecreation/CreateZoneModal";
import api from "../../../utils/api";
import { usePermissions } from "../../../utils/permissionssHelper";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";
import { toast } from "react-toastify";

const ZoneCreation = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zones, setZones] = useState([]);
  const [createZoneOpen, setCreateZoneOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state

  const permissions = usePermissions();

  // Fetch zones from the API
  const fetchZones = async () => {
    setLoading(true); // Start loading
    try {
      const response = await api.get("/products/zone-prod-mgr/all-zones");
      if (response.data.status === 200) {
        setZones(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching zones:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const deleteZone = async (zoneId, zoneName) => {
    setLoading(true); // Start loading
    try {
      // Call API to delete the zone
      await api.delete(`/products/zone-prod-mgr/delete-zone/${zoneId}`);

      // Update state to remove the deleted zone
      setZones((prevZones) =>
        prevZones.filter((zone) => zone.zoneId !== zoneId)
      );

      // Show success toast message
      toast.success(`Zone Deleted: ${zoneName}`);
    } catch (error) {
      console.error("Error deleting zone:", error);
      toast.error("Failed to delete zone.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleStateChange = (event) => {
    setState(event.target.value);
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleCreateZone = (zoneData) => {
    try {
      console.log("Zone Data: ", zoneData);

      toast.success(`New Zone Created: ${zoneData.zone}`);

      fetchZones();
    } catch (error) {
      // If an error occurs, show an error message
      console.error("Error creating zone:", error);
      toast.error("Error creating zone. Please try again.");
    }
  };

  const handleRowClick = (zone) => {
    navigate(`/products/zone-prod-mgr/${zone}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <BreadcrumbNavigation />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="state-select-label">Select State</InputLabel>
            <Select
              labelId="state-select-label"
              id="state-select"
              value={state}
              label="Select State"
              onChange={handleStateChange}
            >
              <MenuItem value="">All States</MenuItem>
              <MenuItem value="telangana">Telangana</MenuItem>
              <MenuItem value="andhra">Andhra Pradesh</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="city-select-label">Select City</InputLabel>
            <Select
              labelId="city-select-label"
              id="city-select"
              value={city}
              label="Select City"
              onChange={handleCityChange}
            >
              <MenuItem value="">All Cities</MenuItem>
              <MenuItem value="hyderabad">Hyderabad</MenuItem>
              <MenuItem value="warangal">Warangal</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Tooltip
            title={
              !permissions?.create
                ? "You don't have permission to create a zone."
                : ""
            }
          >
            <span>
              <Button
                variant="contained"
                onClick={() => setCreateZoneOpen(true)}
                disabled={!permissions?.create}
              >
                Create Zone
              </Button>
            </span>
          </Tooltip>
        </Grid>
      </Grid>

      {loading ? ( // Show loader while loading
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="zone table">
            <TableHead>
              <TableRow>
                <TableCell>State</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {zones.map((row) => (
                <TableRow
                  key={row.zoneId}
                  onClick={() => handleRowClick(row.zoneId)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                  }}
                >
                  <TableCell>{row.state}</TableCell>
                  <TableCell>{row.city}</TableCell>
                  <TableCell>{row.zone}</TableCell>
                  <TableCell align="center">
                    <Tooltip
                      title={
                        !permissions?.delete
                          ? "You don't have permission to delete a zone."
                          : ""
                      }
                    >
                      <span>
                        <IconButton
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteZone(row.zoneId, row.zone);
                          }}
                          disabled={!permissions?.delete}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 3,
        }}
      >
        <IconButton>
          <NavigateBeforeIcon />
        </IconButton>
        <Box sx={{ mx: 2 }}>1</Box>
        <IconButton>
          <NavigateNextIcon />
        </IconButton>
      </Box>

      <CreateZoneModal
        open={createZoneOpen}
        handleClose={() => setCreateZoneOpen(false)}
        handleCreateZone={handleCreateZone}
        onUpdate={fetchZones}
      />
    </Container>
  );
};

export default ZoneCreation;
