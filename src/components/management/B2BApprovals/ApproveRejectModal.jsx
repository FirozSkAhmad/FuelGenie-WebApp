import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const ApproveRejectModal = ({ open, onClose, onConfirm, isApproval }) => {
  const [remarks, setRemarks] = useState("");

  const handleConfirm = () => {
    onConfirm(remarks); // Pass the remarks back to the parent
    onClose(); // Close the modal
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isApproval ? "Approve Customer" : "Reject Customer"}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Management Remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          fullWidth
          multiline
          rows={4}
          margin="normal"
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color="primary"
          disabled={!remarks.trim()}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApproveRejectModal;
