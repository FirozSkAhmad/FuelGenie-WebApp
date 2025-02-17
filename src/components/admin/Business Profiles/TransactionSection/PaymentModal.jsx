import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material"; // Icon for file upload
import api from "../../../../utils/api";
import { set } from "date-fns";

const PaymentModal = ({
  open,
  onClose,
  transaction,
  cid,
  onPaymentSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [chequeImage, setChequeImage] = useState(null);
  const [transferReceipt, setTransferReceipt] = useState(null);
  const [chequeDetails, setChequeDetails] = useState({
    chequeNumber: "",
    bankName: "",
    chequeIssuedDate: "",
    chequeReceivedDate: "",
  });
  const [transferDetails, setTransferDetails] = useState({
    UTR: "",
    ReferenceID: "",
    ToAccount: "",
    FromAccount: "",
    PaymentDate: "",
    Remarks: "",
    Network: "NEFT",
    ManualReleaseRequired: "No",
    TransactionStatus: "Success",
  });
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!transaction) return;

    const formData = new FormData();
    formData.append("cid", cid);
    formData.append("transactionId", transaction.transactionId);
    formData.append("paymentMethod", paymentMethod);

    let paymentDetails = {};
    if (paymentMethod === "CHEQUE") {
      paymentDetails = {
        chequeNumber: chequeDetails.chequeNumber,
        bankName: chequeDetails.bankName,
        chequeIssuedDate: chequeDetails.chequeIssuedDate,
        chequeReceivedDate: chequeDetails.chequeReceivedDate,
        chequeAmount: transaction.amount,
      };
      if (chequeImage) {
        formData.append("chequeImage", chequeImage);
      }
    } else if (paymentMethod === "ACCOUNT_TRANSFER") {
      paymentDetails = {
        UTR: transferDetails.UTR,
        ReferenceID: transferDetails.ReferenceID,
        ToAccount: transferDetails.ToAccount,
        FromAccount: transferDetails.FromAccount,
        Amount: transaction.amount,
        PaymentDate: transferDetails.PaymentDate,
        Remarks: transferDetails.Remarks,
        Network: transferDetails.Network,
        ManualReleaseRequired: transferDetails.ManualReleaseRequired,
        TransactionStatus: transferDetails.TransactionStatus,
      };
      if (transferReceipt) {
        formData.append("transferReceipt", transferReceipt);
      }
    }

    formData.append("paymentDetails", JSON.stringify(paymentDetails));

    try {
      setLoading(true);
      const response = await api.put(
        "/admin/business-profiles/pay-a-creditTransactionAmount",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        onPaymentSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
          Pay Credit Transaction Amount
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Payment Method</InputLabel>
          <Select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            label="Payment Method"
          >
            <MenuItem value="CASH">Cash</MenuItem>
            <MenuItem value="CHEQUE">Cheque</MenuItem>
            <MenuItem value="ACCOUNT_TRANSFER">Account Transfer</MenuItem>
          </Select>
        </FormControl>

        {paymentMethod === "CHEQUE" && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cheque Number"
                value={chequeDetails.chequeNumber}
                onChange={(e) =>
                  setChequeDetails({
                    ...chequeDetails,
                    chequeNumber: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bank Name"
                value={chequeDetails.bankName}
                onChange={(e) =>
                  setChequeDetails({
                    ...chequeDetails,
                    bankName: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cheque Issued Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={chequeDetails.chequeIssuedDate}
                onChange={(e) =>
                  setChequeDetails({
                    ...chequeDetails,
                    chequeIssuedDate: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cheque Received Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={chequeDetails.chequeReceivedDate}
                onChange={(e) =>
                  setChequeDetails({
                    ...chequeDetails,
                    chequeReceivedDate: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload />}
                sx={{ mt: 2 }}
              >
                Upload Cheque Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setChequeImage(e.target.files[0])}
                />
              </Button>
              {chequeImage && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {chequeImage.name}
                </Typography>
              )}
            </Grid>
          </Grid>
        )}

        {paymentMethod === "ACCOUNT_TRANSFER" && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="UTR"
                value={transferDetails.UTR}
                onChange={(e) =>
                  setTransferDetails({
                    ...transferDetails,
                    UTR: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Reference ID"
                value={transferDetails.ReferenceID}
                onChange={(e) =>
                  setTransferDetails({
                    ...transferDetails,
                    ReferenceID: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="To Account"
                value={transferDetails.ToAccount}
                onChange={(e) =>
                  setTransferDetails({
                    ...transferDetails,
                    ToAccount: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="From Account"
                value={transferDetails.FromAccount}
                onChange={(e) =>
                  setTransferDetails({
                    ...transferDetails,
                    FromAccount: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Payment Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={transferDetails.PaymentDate}
                onChange={(e) =>
                  setTransferDetails({
                    ...transferDetails,
                    PaymentDate: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Remarks"
                value={transferDetails.Remarks}
                onChange={(e) =>
                  setTransferDetails({
                    ...transferDetails,
                    Remarks: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Network</InputLabel>
                <Select
                  value={transferDetails.Network}
                  onChange={(e) =>
                    setTransferDetails({
                      ...transferDetails,
                      Network: e.target.value,
                    })
                  }
                  label="Network"
                >
                  <MenuItem value="NEFT">NEFT</MenuItem>
                  <MenuItem value="RTGS">RTGS</MenuItem>
                  <MenuItem value="IMPS">IMPS</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Manual Release Required</InputLabel>
                <Select
                  value={transferDetails.ManualReleaseRequired}
                  onChange={(e) =>
                    setTransferDetails({
                      ...transferDetails,
                      ManualReleaseRequired: e.target.value,
                    })
                  }
                  label="Manual Release Required"
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Transaction Status</InputLabel>
                <Select
                  value={transferDetails.TransactionStatus}
                  onChange={(e) =>
                    setTransferDetails({
                      ...transferDetails,
                      TransactionStatus: e.target.value,
                    })
                  }
                  label="Transaction Status"
                >
                  <MenuItem value="Success">Success</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload />}
                sx={{ mt: 2 }}
              >
                Upload Transfer Receipt
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setTransferReceipt(e.target.files[0])}
                />
              </Button>
              {transferReceipt && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {transferReceipt.name}
                </Typography>
              )}
            </Grid>
          </Grid>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            onClick={onClose}
            color="secondary"
            sx={{ mr: 2 }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePayment}
            disabled={loading} // Disable button while loading
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Pay
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PaymentModal;
