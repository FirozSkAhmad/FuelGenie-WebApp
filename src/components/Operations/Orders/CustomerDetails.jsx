import React from "react";
import { Box, TextField, Typography } from "@mui/material";

const CustomerDetails = ({ customerDetails, setCustomerDetails }) => {
  const handleChange = (field, value) => {
    setCustomerDetails((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Box>
      <Typography variant="h6">Customer Details</Typography>
      <TextField
        label="Name"
        value={customerDetails.customerName || ""}
        onChange={(e) => handleChange("name", e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        value={customerDetails.emailID || ""}
        onChange={(e) => handleChange("email", e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Phone"
        value={customerDetails.phoneNumber || ""}
        onChange={(e) => handleChange("phone", e.target.value)}
        fullWidth
        margin="normal"
      />
    </Box>
  );
};

export default CustomerDetails;
