import React from "react";
import { Typography, Box } from "@mui/material";
import { Business } from "@mui/icons-material";

const FirmTypeSection = ({ firmType }) => {
  return (
    <Box style={{ marginLeft: "20px" }}>
      <Typography variant="h6" gutterBottom>
        <Business
          fontSize="small"
          style={{ marginRight: "10px", verticalAlign: "middle" }}
        />
        <strong>Firm Type</strong>
      </Typography>
      <Typography
        variant="body1"
        style={{
          marginLeft: "28px",
          color:
            firmType === "PROPRIETORSHIP"
              ? "#00E326"
              : firmType === "PARTNERSHIP"
              ? "#D72727"
              : "#CDBA0A",
          fontWeight: "bold",
        }}
      >
        {firmType}
      </Typography>
    </Box>
  );
};

export default FirmTypeSection;
