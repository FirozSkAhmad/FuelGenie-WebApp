import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  Backdrop,
  Fade,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from "@mui/material";

const PaymentImageModal = ({ open, onClose, transaction, onChequeVerify }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const isCheque = transaction?.paymentMethod === "CHEQUE";
  const isAccountTransfer = transaction?.paymentMethod === "ACCOUNT_TRANSFER";
  const details = transaction?.paymentDetails;

  // State for verification dialog popup
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [failureReason, setFailureReason] = useState("Insufficient funds");

  const handleVerifyButtonClick = () => {
    setVerifyDialogOpen(true);
  };

  const handleDialogClose = () => {
    setVerifyDialogOpen(false);
    setSelectedStatus("");
    setFailureReason("Insufficient funds");
  };

  const handleConfirmVerification = () => {
    // If "FAILED" is selected, pass the failureReason; otherwise "PAID".
    if (selectedStatus === "FAILED") {
      onChequeVerify(transaction.transactionId, "FAILED", failureReason);
    } else {
      onChequeVerify(transaction.transactionId, "PAID");
    }
    setVerifyDialogOpen(false);
    setSelectedStatus("");
    setFailureReason("Insufficient funds");
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              width: isSmallScreen ? "90%" : "auto",
              maxWidth: 600,
              minHeight: 400,
              overflowY: "auto",
            }}
          >
            {details && (
              <>
                {isCheque && (
                  <>
                    <Typography variant="h6" gutterBottom align="center">
                      Transaction Cheque Details
                    </Typography>
                    {details.chequeImageUrl && (
                      <Box sx={{ mb: 3, textAlign: "center" }}>
                        <img
                          src={details.chequeImageUrl}
                          alt="Cheque"
                          style={{
                            width: "80%",
                            maxWidth: 500,
                            borderRadius: 8,
                            marginBottom: 16,
                            border: "1px solid #ddd",
                          }}
                        />
                      </Box>
                    )}

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={500}>
                        Cheque Number
                      </Typography>
                      <Typography variant="body2">
                        {details.chequeNumber}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={500}>
                        Bank Name
                      </Typography>
                      <Typography variant="body2">
                        {details.bankName}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={500}>
                        Cheque Issued Date
                      </Typography>
                      <Typography variant="body2">
                        {details.chequeIssuedDate}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={500}>
                        Cheque Received Date
                      </Typography>
                      <Typography variant="body2">
                        {details.chequeReceivedDate}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={500}>
                        Cheque Amount
                      </Typography>
                      <Typography variant="body2">
                        ₹{details.chequeAmount?.toLocaleString("en-IN")}
                      </Typography>
                    </Box>

                    {transaction.status === "PROCESSING" && (
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={{
                          mt: 2,
                          textTransform: "none",
                          borderRadius: 2,
                          width: "100%",
                        }}
                        onClick={handleVerifyButtonClick}
                      >
                        Verify Cheque
                      </Button>
                    )}
                    {transaction.status === "PAID" && (
                      <Button
                        variant="contained"
                        sx={{
                          mt: 2,
                          textTransform: "none",
                          borderRadius: 3,
                          width: "100%",
                          background:
                            "linear-gradient(135deg, #1B5E20, #4CAF50)", // Gradient effect
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: "1rem",
                          boxShadow: "0px 6px 12px rgba(0, 128, 0, 0.3)", // Stronger shadow
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #166534, #43A047)", // Darker hover effect
                            transform: "scale(1.05)", // Slight zoom on hover
                          },
                          "&:disabled": {
                            background: "#66BB6A", // More vibrant disabled state
                            color: "#fff",
                            opacity: 0.9,
                            boxShadow: "none",
                          },
                        }}
                        disabled
                      >
                        ✅ Verified
                      </Button>
                    )}
                  </>
                )}

                {isAccountTransfer && (
                  <>
                    <Typography variant="h6" gutterBottom align="center">
                      Account Transfer Details
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={500}>
                        UTR
                      </Typography>
                      <Typography variant="body2">{details.UTR}</Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={500}>
                        Reference ID
                      </Typography>
                      <Typography variant="body2">
                        {details.ReferenceID}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={500}>
                        From Account
                      </Typography>
                      <Typography variant="body2">
                        {details.FromAccount}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={500}>
                        Payment Date
                      </Typography>
                      <Typography variant="body2">
                        {details.PaymentDate}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={500}>
                        Network
                      </Typography>
                      <Typography variant="body2">{details.Network}</Typography>
                    </Box>

                    {details.transferReceiptUrl && (
                      <Box sx={{ mt: 2, textAlign: "center" }}>
                        <img
                          src={details.transferReceiptUrl}
                          alt="Transfer Receipt"
                          style={{
                            width: "80%",
                            maxWidth: 500,
                            borderRadius: 8,
                            border: "1px solid #ddd",
                          }}
                        />
                      </Box>
                    )}
                  </>
                )}
              </>
            )}
          </Box>
        </Fade>
      </Modal>

      {/* Verification Dialog Popup */}
      <Dialog open={verifyDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Verify Cheque</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <FormLabel component="legend">Select Cheque Status</FormLabel>
            <RadioGroup
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <FormControlLabel value="PAID" control={<Radio />} label="Paid" />
              <FormControlLabel
                value="FAILED"
                control={<Radio />}
                label="Failed"
              />
            </RadioGroup>
          </FormControl>
          {selectedStatus === "FAILED" && (
            <TextField
              autoFocus
              margin="dense"
              label="Failure Reason"
              type="text"
              fullWidth
              variant="outlined"
              value={failureReason}
              onChange={(e) => setFailureReason(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmVerification}
            color="primary"
            disabled={!selectedStatus}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PaymentImageModal;
