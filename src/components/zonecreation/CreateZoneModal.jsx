import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Grid,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const CreateZoneModal = ({ open, handleClose, handleCreateZone }) => {
  const [zoneName, setZoneName] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pincodes, setPincodes] = useState([""]);

  // Handle adding new pincode input fields
  const handleAddPincode = () => {
    setPincodes([...pincodes, ""]);
  };

  // Handle removing a specific pincode field
  const handleRemovePincode = (index) => {
    const updatedPincodes = pincodes.filter((_, i) => i !== index);
    setPincodes(updatedPincodes);
  };

  // Handle changing pincode value
  const handlePincodeChange = (index, value) => {
    const updatedPincodes = pincodes.map((pincode, i) =>
      i === index ? value : pincode
    );
    setPincodes(updatedPincodes);
  };

  // Handle form submission
  const handleSubmit = () => {
    const zoneData = {
      zoneName,
      state,
      city,
      pincodes: pincodes.filter((pincode) => pincode !== ""), // filter out any empty pincodes
    };
    handleCreateZone(zoneData); // Send the zone data back to the parent component
    handleClose(); // Close the modal
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Zone</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Zone Name */}
          <Grid item xs={12}>
            <TextField
              label="Zone Name"
              fullWidth
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
            />
          </Grid>
          {/* State */}
          <Grid item xs={12}>
            <TextField
              label="State"
              fullWidth
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </Grid>
          {/* City */}
          <Grid item xs={12}>
            <TextField
              label="City"
              fullWidth
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Grid>
          {/* Pincode List */}
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
          {/* Add Pincode Button */}
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
