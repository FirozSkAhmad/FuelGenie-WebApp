import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";

const RemarkDialog = ({ isOpen, onClose, onSubmit }) => {
  const [remarks, setRemark] = useState("");

  const handleSubmit = () => {
    onSubmit(remarks);
    setRemark(""); // Clear the remark after submission
  };

  // Disable the submit button if remarks is empty
  const isSubmitDisabled = remarks.trim() === "";

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: "#1976d2",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1.25rem",
        }}
      >
        Enter Remark
      </DialogTitle>
      <DialogContent sx={{ padding: "20px" }}>
        <TextField
          autoFocus
          margin="dense"
          label="Remark"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={remarks}
          onChange={(e) => setRemark(e.target.value)}
          sx={{
            marginTop: "10px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ padding: "16px", borderTop: "1px solid #e0e0e0" }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: "#1976d2",
            borderColor: "#1976d2",
            borderRadius: "8px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#1976d2",
              color: "#fff",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitDisabled} // Disable if remarks is empty
          sx={{
            backgroundColor: "#1976d2",
            color: "#fff",
            borderRadius: "8px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
            "&:disabled": {
              backgroundColor: "#e0e0e0", // Style for disabled state
              color: "#a0a0a0",
            },
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemarkDialog;
