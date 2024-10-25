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
  TextField,
} from "@mui/material";
import {
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CreateZoneModal from "../../../components/zonecreation/CreateZoneModal";

import api from "../../../utils/api";
const ZoneCreation = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zone, setZone] = useState("");
  const [customState, setCustomState] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [createZoneOpen, setCreateZoneOpen] = useState(false);
  const [zones, setZones] = useState([]);
  const [isCustomState, setIsCustomState] = useState(false);
  const [isCustomCity, setIsCustomCity] = useState(false);

  useEffect(() => {
    // Fetch zones from the API
    const fetchZones = async () => {
      try {
        const response = await api.get("/products/all-zones");
        if (response.data.status === 200) {
          setZones(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching zones:", error);
      }
    };

    fetchZones();
  }, []);

  const handleStateChange = (event) => {
    setState(event.target.value);
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleZoneChange = (event) => {
    setZone(event.target.value);
  };

  const handleCreateZone = (zoneData) => {
    console.log("Zone Data: ", zoneData);
    // API call to create the zone can go here
  };

  const handleRowClick = (zone) => {
    navigate(`/products/zone/${zone}`);
  };

  const toggleCustomState = () => {
    setIsCustomState((prev) => !prev);
    setState("");
  };

  const toggleCustomCity = () => {
    setIsCustomCity((prev) => !prev);
    setCity("");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="/products">
          Products
        </Link>
        <Typography color="text.primary">Location Product List</Typography>
      </Breadcrumbs>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="state-select-label">Enter State</InputLabel>
            <Select
              labelId="state-select-label"
              id="state-select"
              value={isCustomState ? "" : state}
              label="Enter State"
              onChange={handleStateChange}
              disabled={isCustomState}
            >
              <MenuItem value="">No State</MenuItem>
              <MenuItem value="telangana">Telangana</MenuItem>
              <MenuItem value="andhra">Andhra Pradesh</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={toggleCustomState}>
            {isCustomState ? "Use Dropdown" : "Add Custom State"}
          </Button>
          {isCustomState && (
            <TextField
              fullWidth
              label="Custom State"
              value={customState}
              onChange={(e) => setCustomState(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="city-select-label">Enter City</InputLabel>
            <Select
              labelId="city-select-label"
              id="city-select"
              value={isCustomCity ? "" : city}
              label="Enter City"
              onChange={handleCityChange}
              disabled={isCustomCity}
            >
              <MenuItem value="">No City</MenuItem>
              <MenuItem value="hyderabad">Hyderabad</MenuItem>
              <MenuItem value="warangal">Warangal</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={toggleCustomCity}>
            {isCustomCity ? "Use Dropdown" : "Add Custom City"}
          </Button>
          {isCustomCity && (
            <TextField
              fullWidth
              label="Custom City"
              value={customCity}
              onChange={(e) => setCustomCity(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="zone-select-label">Enter Zone</InputLabel>
            <Select
              labelId="zone-select-label"
              id="zone-select"
              value={zone}
              label="Enter Zone"
              onChange={handleZoneChange}
            >
              <MenuItem value="">No Zone</MenuItem>
              {zones.map((zone) => (
                <MenuItem key={zone.zoneId} value={zone.zone}>
                  {zone.zone}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button variant="contained" onClick={() => setCreateZoneOpen(true)}>
            Create Zone
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="zone table">
          <TableHead>
            <TableRow>
              <TableCell>State</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Zone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {zones.map((row, index) => (
              <TableRow
                key={index}
                onClick={() => handleRowClick(row.zoneId)}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <TableCell>{row.state}</TableCell>
                <TableCell>{row.city}</TableCell>
                <TableCell>{row.zone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
        <Box sx={{ display: "flex", alignItems: "center", mx: 2 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.main",
              color: "white",
              mr: 1,
            }}
          >
            1
          </Box>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 1,
            }}
          >
            2
          </Box>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            3
          </Box>
        </Box>
        <IconButton>
          <NavigateNextIcon />
        </IconButton>
      </Box>

      <CreateZoneModal
        open={createZoneOpen}
        handleClose={() => setCreateZoneOpen(false)}
        handleCreateZone={handleCreateZone}
      />
    </Container>
  );
};

export default ZoneCreation;
