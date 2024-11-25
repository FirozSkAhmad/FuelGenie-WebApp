import React from "react";
import { Container, Typography, Button, Box, useTheme } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useNavigate } from "react-router-dom";

const Restricted = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGoBack = () => {
    navigate("/dashboard"); // Redirect to the home page or dashboard
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        // backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#f5f5f5", // Dynamic background color
        color: theme.palette.text.primary, // Dynamic text color
        transition: "background-color 0.3s, color 0.3s", // Smooth transition for theme change
      }}
    >
      <Box
        sx={{
          bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff", // Dynamic card background
          borderRadius: 2,
          p: 4,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0px 0px 20px 5px #ff0000"
              : "0px 0px 10px 2px rgba(0,0,0,0.1)", // Subtle shadow for light mode
          border: `2px solid ${theme.palette.error.main}`, // Red border
        }}
      >
        <WarningAmberIcon
          sx={{
            fontSize: 80,
            color: theme.palette.error.main, // Dynamic error color
            mb: 2,
          }}
        />
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            color: theme.palette.error.main, // Dynamic error color
            fontWeight: "bold",
          }}
        >
          Access Denied
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 3,
            fontSize: "1.2rem",
            lineHeight: 1.5,
            color: theme.palette.text.secondary, // Dynamic secondary text color
          }}
        >
          <span
            style={{ color: theme.palette.error.light, fontWeight: "bold" }}
          >
            Unauthorized Entry!
          </span>{" "}
          This area is restricted. Turn back now or face the consequences!
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleGoBack}
          sx={{
            backgroundColor: theme.palette.error.main,
            "&:hover": {
              backgroundColor: theme.palette.error.dark, // Darker shade on hover
            },
          }}
        >
          Return to Safety
        </Button>
      </Box>
    </Container>
  );
};

export default Restricted;
