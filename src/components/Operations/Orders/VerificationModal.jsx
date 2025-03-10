import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  CircularProgress,
  Box,
  Alert,
  Typography,
  IconButton,
} from "@mui/material";
import { CheckCircle, Close, Lock } from "@mui/icons-material";
import { motion } from "framer-motion";
import api from "../../../utils/api";

const VerifyPaymentModal = ({
  open,
  handleClose,
  OrderData,
  onVerificationSuccess,
}) => {
  // // Guard clause to handle undefined orderData
  // if (!OrderData) {
  //   return null; // or return a loading spinner or placeholder
  // }

  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const { orderId, phoneNumber } = OrderData;

  const handleVerify = async () => {
    if (!otp || otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    try {
      setIsVerifying(true);
      await api.post("/operations/orders/verify-placement-otp", {
        orderId,
        placementOtp: otp,
      });

      // Success Animation
      setVerified(true);
      setTimeout(() => {
        onVerificationSuccess();
        handleClose();
        setVerified(false);
        setOtp("");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={!isVerifying && !verified ? handleClose : null}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Verify Payment OTP
        {!isVerifying && !verified && (
          <IconButton onClick={handleClose} disabled={isVerifying}>
            <Close />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent>
        {verified ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle color="success" sx={{ fontSize: 80 }} />
            </motion.div>
            <Typography
              variant="h6"
              sx={{ mt: 2, fontWeight: "bold", color: "success.main" }}
            >
              Verified Successfully!
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Enter the OTP sent to
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "primary.main" }}
              >
                {phoneNumber}
              </Typography>
            </Box>

            <TextField
              label="Enter OTP"
              variant="outlined"
              fullWidth
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              inputProps={{
                maxLength: 4,
                style: {
                  textAlign: "center",
                  fontSize: "1.2rem",
                  letterSpacing: "4px",
                },
              }}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <Lock sx={{ color: "gray", mr: 1 }} />,
              }}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2, textAlign: "center" }}>
                {error}
              </Alert>
            )}
          </>
        )}
      </DialogContent>

      {!verified && (
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={handleClose}
            disabled={isVerifying}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleVerify}
            variant="contained"
            disabled={isVerifying}
            sx={{ minWidth: 100 }}
          >
            {isVerifying ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Verify"
            )}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default VerifyPaymentModal;
