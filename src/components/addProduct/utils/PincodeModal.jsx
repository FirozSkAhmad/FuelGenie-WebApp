import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const PincodeModal = ({ isOpen, onClose, onSave, pincode, setPincode }) => (
  <Dialog open={isOpen} onClose={onClose}>
    <DialogTitle>Add Pincode</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        label="Pincode"
        type="text"
        fullWidth
        variant="outlined"
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onSave}>Save</Button>
    </DialogActions>
  </Dialog>
);

export default PincodeModal;
