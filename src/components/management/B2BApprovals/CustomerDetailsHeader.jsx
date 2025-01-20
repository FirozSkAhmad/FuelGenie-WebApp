import React from "react";
import { Typography } from "@mui/material";
import { Description } from "@mui/icons-material";

const CustomerDetailsHeader = () => {
  return (
    <Typography variant="h4" gutterBottom>
      <Description
        fontSize="small"
        style={{ marginRight: "10px", verticalAlign: "middle" }}
      />
      Customer Details
    </Typography>
  );
};

export default CustomerDetailsHeader;
