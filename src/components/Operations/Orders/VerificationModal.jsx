import { useState, useEffect, useRef } from "react";
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
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [resendCooldown, setResendCooldown] = useState(0);
  const resendIntervalRef = useRef();
  const { orderId, phoneNumber } = OrderData;

  useEffect(() => {
    if (open && resendCooldown > 0) {
      resendIntervalRef.current = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(resendIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (resendIntervalRef.current) {
        clearInterval(resendIntervalRef.current);
      }
    };
  }, [open]);

  const handleCloseAndReset = () => {
    // Reset all states
    setOtp("");
    setIsVerifying(false);
    setVerified(false);
    setMessage({ text: "", type: "" });
    // Clear the cooldown and interval when closing
    setResendCooldown(0);
    if (resendIntervalRef.current) {
      clearInterval(resendIntervalRef.current);
    }
    // Call parent's close handler
    handleClose();
  };

  const handleVerify = async () => {
    if (!otp || otp.length !== 4) {
      setMessage({ text: "Please enter a valid 4-digit OTP", type: "error" });
      return;
    }

    try {
      setIsVerifying(true);
      await api.post("/operations/orders/verify-placement-otp", {
        orderId,
        placementOtp: otp,
      });

      setVerified(true);
      setTimeout(() => {
        onVerificationSuccess();
        handleClose();
        setVerified(false);
        setOtp("");
      }, 2000);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Verification failed",
        type: "error",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await api.post("/operations/orders/resend-placement-otp", { orderId });
      setMessage({ text: "OTP resent successfully!", type: "success" });

      // Start cooldown timer
      setResendCooldown(30);
      if (resendIntervalRef.current) {
        clearInterval(resendIntervalRef.current);
      }

      resendIntervalRef.current = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(resendIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to resend OTP",
        type: "error",
      });
    }
  };
  // Update the display format to show minutes:seconds
  const formatCooldown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog
      open={open}
      onClose={!isVerifying && !verified ? handleCloseAndReset : null}
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
          <IconButton onClick={handleCloseAndReset} disabled={isVerifying}>
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
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Didn't receive OTP?{" "}
                <Button
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || isVerifying}
                  color="primary"
                  size="small"
                >
                  {resendCooldown > 0
                    ? `Resend in ${formatCooldown(resendCooldown)}`
                    : "Resend OTP"}
                </Button>
              </Typography>
            </Box>
            {message.text && (
              <Alert
                severity={message.type}
                sx={{ mt: 2, textAlign: "center" }}
              >
                {message.text}
              </Alert>
            )}
          </>
        )}
      </DialogContent>

      {!verified && (
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={handleCloseAndReset}
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
