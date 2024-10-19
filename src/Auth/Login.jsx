import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Typography,
  Grid,
  Paper,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email"; // Email icon
import LockIcon from "@mui/icons-material/Lock"; // Lock icon
import Visibility from "@mui/icons-material/Visibility"; // Eye icon for showing password
import VisibilityOff from "@mui/icons-material/VisibilityOff"; // Eye icon for hiding password

// Define styled components using the styled API
const LeftPanel = styled(Grid)(({ theme }) => ({
  background: "linear-gradient(to bottom right, #007FFF, #002BFF)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  flexDirection: "column",
}));

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: "40px",
  maxWidth: "400px",
  borderRadius: "10px",
}));

const InputField = styled(TextField)(({ theme }) => ({
  marginBottom: "20px",
}));

const LoginButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#007FFF",
  color: "white",
  "&:hover": {
    backgroundColor: "#005BB5",
  },
  padding: "10px",
  width: "100%",
}));

const ForgotPassword = styled(Typography)(({ theme }) => ({
  marginTop: "15px",
  color: "#007FFF",
  cursor: "pointer",
  textAlign: "center",
}));

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Function to toggle password visibility
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Left panel with branding */}
      <LeftPanel item xs={12} md={6}>
        <Typography variant="h3" gutterBottom>
          Fuel Genie
        </Typography>
        <Typography variant="h6" gutterBottom>
          Lorem Ipsum
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ backgroundColor: "#ffffff10", color: "white" }}
        >
          Read More
        </Button>
      </LeftPanel>

      {/* Right panel with login form */}
      <Grid
        item
        xs={12}
        md={6}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <FormContainer elevation={6}>
          <Typography variant="h5" gutterBottom>
            Hello Again!
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Welcome Back
          </Typography>

          {/* Login Form */}
          <form noValidate>
            {/* Email Address Input Field with Icon */}
            <TextField
              variant="outlined"
              label="Email Address"
              fullWidth
              placeholder="Email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }} // Add some margin below the field
            />

            {/* Password Input Field with Icon and Eye Toggle */}
            <TextField
              variant="outlined"
              label="Password"
              placeholder="Password"
              type={showPassword ? "text" : "password"} // Toggle between 'text' and 'password'
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* Login Button */}
            <Button type="submit" variant="contained" fullWidth>
              Login
            </Button>

            {/* Forgot Password */}
            <Typography align="center" sx={{ mt: 2 }}>
              <a href="/forgot-password" style={{ textDecoration: "none" }}>
                Forgot Password?
              </a>
            </Typography>
          </form>
        </FormContainer>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
