import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Grid,
  MenuItem,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

import api from "../../utils/api";
const CreateZoneModal = ({ open, handleClose, handleCreateZone }) => {
  const [zoneName, setZoneName] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pincodes, setPincodes] = useState([""]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [customState, setCustomState] = useState(false);
  const [customCity, setCustomCity] = useState(false);

  useEffect(() => {
    if (open) {
      fetchStates();
    }
  }, [open]);

  const fetchStates = async () => {
    try {
      const response = await api.get(`/products/all-states`);
      setStates(response.data.data || []);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchCities = async (stateName) => {
    try {
      const response = await api.get(`/products/all-cities/${stateName}`);
      setCities(response.data.data || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setState(selectedState);
    setCity(""); // Reset city when state changes
    if (!states.includes(selectedState) && selectedState) {
      setStates((prevStates) => [...prevStates, selectedState]);
    }
    fetchCities(selectedState);
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);
    if (!cities.includes(selectedCity) && selectedCity) {
      setCities((prevCities) => [...prevCities, selectedCity]);
    }
  };

  const handleAddPincode = () => {
    setPincodes([...pincodes, ""]);
  };

  const handleRemovePincode = (index) => {
    const updatedPincodes = pincodes.filter((_, i) => i !== index);
    setPincodes(updatedPincodes);
  };

  const handlePincodeChange = (index, value) => {
    const updatedPincodes = pincodes.map((pincode, i) =>
      i === index ? value : pincode
    );
    setPincodes(updatedPincodes);
  };

  const handleSubmit = async () => {
    const zoneData = {
      zone: zoneName,
      state: customState ? state : state,
      city: customCity ? city : city,
      pincodes: pincodes.filter((pincode) => pincode !== ""),
    };

    try {
      await api.post(`/products/create-zone`, zoneData);
      handleCreateZone(zoneData);
      handleClose();
    } catch (error) {
      console.error("Error creating zone:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Zone</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Zone Name"
              fullWidth
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            {!customState ? (
              <>
                <TextField
                  label="State"
                  fullWidth
                  value={state}
                  onChange={handleStateChange}
                  helperText="Type or select state"
                  select
                >
                  {states.map((stateOption, index) => (
                    <MenuItem key={index} value={stateOption}>
                      {stateOption}
                    </MenuItem>
                  ))}
                </TextField>
              </>
            ) : (
              <TextField
                label="Custom State"
                fullWidth
                value={state}
                onChange={(e) => setState(e.target.value)}
                helperText="Enter your custom state"
              />
            )}{" "}
            <Button
              variant="outlined"
              onClick={() => setCustomState(!customState)}
              style={{ marginTop: "8px" }}
            >
              {!customState ? "Add Custom State" : "Select From DropDown"}
            </Button>
          </Grid>

          <Grid item xs={12}>
            {!customCity ? (
              <>
                <TextField
                  label="City"
                  fullWidth
                  value={city}
                  onChange={handleCityChange}
                  helperText="Type or select city"
                  select
                >
                  {cities.map((cityOption, index) => (
                    <MenuItem key={index} value={cityOption}>
                      {cityOption}
                    </MenuItem>
                  ))}
                </TextField>
              </>
            ) : (
              <>
                <TextField
                  label="Custom City"
                  fullWidth
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  helperText="Enter your custom city"
                />
              </>
            )}
            <Button
              variant="outlined"
              onClick={() => setCustomCity(!customCity)}
              style={{ marginTop: "8px" }}
            >
              {!customCity ? "Add Custom City" : "Select From DropDown"}
            </Button>
          </Grid>

          {pincodes.map((pincode, index) => (
            <Grid
              item
              xs={12}
              key={index}
              container
              spacing={1}
              alignItems="center"
            >
              <Grid item xs={10}>
                <TextField
                  label={`Pincode ${index + 1}`}
                  fullWidth
                  value={pincode}
                  onChange={(e) => handlePincodeChange(index, e.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                {index > 0 && (
                  <IconButton onClick={() => handleRemovePincode(index)}>
                    <RemoveCircleIcon color="error" />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}

          <Grid item xs={12}>
            <Button
              startIcon={<AddCircleIcon />}
              onClick={handleAddPincode}
              variant="outlined"
              fullWidth
            >
              Add Another Pincode
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Create Zone
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateZoneModal;
