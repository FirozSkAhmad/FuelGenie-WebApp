import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles"; // Import useTheme hook

const NotFoundPage = () => {
  const navigate = useNavigate();
  const theme = useTheme(); // Access the current theme

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.background.default
            : "#f5f5f5", // Adjust based on theme mode
        padding: 2,
      }}
    >
      <Typography
        variant="h1"
        component="h1"
        gutterBottom
        sx={{ color: theme.palette.text.primary }} // Dynamic text color
      >
        404
      </Typography>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ color: theme.palette.text.secondary }} // Dynamic text color
      >
        Oops! Page Not Found.
      </Typography>
      <Typography variant="body1" gutterBottom>
        The page you're looking for doesn't exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/dashboard")}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
