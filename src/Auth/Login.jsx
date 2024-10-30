import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Typography,
  Grid,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email"; // Email icon
import LockIcon from "@mui/icons-material/Lock"; // Lock icon
import Visibility from "@mui/icons-material/Visibility"; // Eye icon for showing password
import VisibilityOff from "@mui/icons-material/VisibilityOff"; // Eye icon for hiding password
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

// Define styled components using the styled API
const LeftPanel = styled(Grid)(({ theme }) => ({
  background: "url('/LeftSection.webp') no-repeat center center",
  backgroundSize: "cover",
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

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Function to toggle password visibility
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    setLoading(true); // Start loading spinner

    try {
      // Use the login function from AuthContext
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error("Login failed:", err);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Left panel with branding */}
      <LeftPanel item xs={12} md={6}>
        <Typography variant="h3" gutterBottom>
          Fuel Genie
        </Typography>
        <Typography variant="h6" gutterBottom>
          Control Center
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
          <form noValidate onSubmit={handleLogin}>
            {/* Email Address Input Field with Icon */}
            <TextField
              variant="outlined"
              label="Email Address"
              fullWidth
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              variant="outlined"
              label="Password"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

            {error && (
              <Typography color="error" align="center" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </FormContainer>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
