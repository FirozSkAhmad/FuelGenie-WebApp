import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  CircularProgress,
  Box,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Alert } from "@mui/material";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const { signup } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "MALE",
    phoneNumber: "",
    password: "",
  });
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // State for the big pop-up
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(5); // Countdown for redirection

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate form fields
  const validateForm = () => {
    const { name, email, phoneNumber, password } = formData;

    if (!name || !email || !phoneNumber || !password) {
      setMessage("All fields are required.");
      setSeverity("error");
      setOpenSnackbar(true);
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Please enter a valid email address.");
      setSeverity("error");
      setOpenSnackbar(true);
      return false;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      setSeverity("error");
      setOpenSnackbar(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop if validation fails
    }

    const { name, email, gender, phoneNumber, password } = formData;

    setLoading(true);
    try {
      // Sign up the user
      await signup(name, email, gender, phoneNumber, password);

      // Show success message and open the big pop-up
      setMessage("Account created successfully! Please wait for verification.");
      setSeverity("success");
      setOpenDialog(true); // Open the big pop-up

      // Start countdown for redirection
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            navigate("/"); // Redirect to home or login page
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setMessage(err.message || "Signup failed. Please try again.");
      setSeverity("error");
      setOpenSnackbar(true); // Show error in Snackbar
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate("/"); // Redirect to home or login page after closing the dialog
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ fontWeight: "bold" }}
      >
        Sign Up
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
          <InputLabel>Gender</InputLabel>
          <Select name="gender" value={formData.gender} onChange={handleChange}>
            <MenuItem value="MALE">Male</MenuItem>
            <MenuItem value="FEMALE">Female</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Phone Number"
          name="phoneNumber"
          fullWidth
          margin="normal"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 2, mb: 2, py: 1.5 }}
        >
          {loading ? <CircularProgress size={24} /> : "Sign Up"}
        </Button>
      </form>

      {/* Snackbar for error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>

      {/* Big Pop-up (Dialog) for success message */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
          🎉 Account Created Successfully!
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: "center" }}>
            Your account has been created successfully. Please wait for
            verification.
          </DialogContentText>
          <DialogContentText sx={{ textAlign: "center", mt: 2 }}>
            You will be redirected to the login page in {countdown} seconds.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseDialog}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="body2">
          Already have an account?{" "}
          <Link href="/" underline="hover" sx={{ fontWeight: "bold" }}>
            Login here
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default SignupPage;
