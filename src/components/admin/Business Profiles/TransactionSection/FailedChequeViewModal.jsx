import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const FailedChequeViewModal = ({ open, onClose, imageUrl }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          outline: "none",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Cheque Image
        </Typography>
        <Box
          component="img"
          src={imageUrl}
          alt="Cheque"
          sx={{ width: "100%", height: "auto", mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default FailedChequeViewModal;
