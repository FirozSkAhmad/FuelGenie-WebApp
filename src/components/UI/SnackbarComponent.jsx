import React from "react";
import { Snackbar, Alert } from "@mui/material";

const SnackbarComponent = ({
  snackbarOpen,
  handleCloseSnackbar,
  snackbarMessage,
}) => {
  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}
    >
      <Alert onClose={handleCloseSnackbar} severity="success">
        {snackbarMessage}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;
