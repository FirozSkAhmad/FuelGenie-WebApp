import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import api from "../../../utils/api";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
const PincodeModal = ({
  isOpen,
  onClose,
  zoneId,
  existingPincodes = [],
  onUpdatePincodes,
}) => {
  const [newPincodes, setNewPincodes] = useState([""]);
  const [pincodesToRemove, setPincodesToRemove] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { zoneID } = useParams();
  const theme = useTheme();
  useEffect(() => {
    setNewPincodes([""]);
    setPincodesToRemove([]);
  }, [existingPincodes]);

  const handleAddNewPincodeField = () => {
    setNewPincodes([...newPincodes, ""]);
  };

  const handleNewPincodeChange = (index, value) => {
    const updatedPincodes = [...newPincodes];
    updatedPincodes[index] = value;
    setNewPincodes(updatedPincodes);
  };

  const handleRemoveNewPincodeField = (index) => {
    const updatedPincodes = newPincodes.filter((_, i) => i !== index);
    setNewPincodes(updatedPincodes);
  };

  const handleRemoveExistingPincode = (pincode) => {
    setPincodesToRemove((prev) => [...prev, pincode]);
  };

  const handleSave = async () => {
    const pincodesToAdd = newPincodes.filter((pincode) => pincode);

    const data = {
      pincodesToAdd,
      pincodesToRemove,
    };

    try {
      const response = await api.patch(
        `/products/add-or-remove-pincodes/${zoneID}`,
        data
      );

      if (response && response.status === 200) {
        setSuccessMessage("Pincodes saved successfully!");
        setErrorMessage("");
        onClose();
        onUpdatePincodes();
      } else {
        throw new Error(
          response.message || "Unexpected response from the server."
        );
      }
    } catch (error) {
      console.error("Failed to save pincodes:", error);
      setErrorMessage("Failed to save pincodes. Please try again.");
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Manage Pincodes</DialogTitle>
      <DialogContent>
        {/* New Pincodes Section */}
        <Typography variant="subtitle1" gutterBottom>
          Add New Pincodes:
        </Typography>
        <Grid container spacing={2}>
          {newPincodes.map((pincode, index) => (
            <Grid
              item
              xs={12}
              key={index}
              container
              spacing={1}
              alignItems="center"
            >
              <Grid item xs={9}>
                <TextField
                  label={`New Pincode ${index + 1}`}
                  fullWidth
                  value={pincode}
                  onChange={(e) =>
                    handleNewPincodeChange(index, e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={3} container justifyContent="flex-end">
                {index > 0 && (
                  <IconButton
                    onClick={() => handleRemoveNewPincodeField(index)}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                )}
                {index === newPincodes.length - 1 && (
                  <IconButton onClick={handleAddNewPincodeField}>
                    <AddIcon color="primary" />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}
        </Grid>

        {/* Existing Pincodes Section */}
        <Typography variant="subtitle1" sx={{ mt: 3 }}>
          Existing Pincodes:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper
              elevation={1}
              style={{
                padding: "10px",
                backgroundColor: theme.palette.background.paper,
                borderRadius: "8px",
              }}
            >
              <List>
                {existingPincodes.map((pincode, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        onClick={() => handleRemoveExistingPincode(pincode)}
                        edge="end"
                        aria-label="delete"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={`${pincode}`}
                      primaryTypographyProps={{
                        style: {
                          wordBreak: "break-word",
                          color: theme.palette.text.primary,
                        },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
      <Snackbar
        open={!!successMessage || !!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={successMessage ? "success" : "error"}
        >
          {successMessage || errorMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default PincodeModal;
