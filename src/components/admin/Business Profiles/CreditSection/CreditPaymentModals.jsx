import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import api from "../../../../utils/api";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const paymentMethods = ["CASH", "CHEQUE", "ACCOUNT_TRANSFER"];

const PaymentModal = ({
  open,
  onClose,
  creditInfo,
  type,
  fetchCredit,
  setSnackbar,
  cid,
}) => {
  const [formData, setFormData] = useState({
    paymentMethod: "",
    amount: "",
    description: "",
    chequeImage: null,
    transferReceipt: null,
    creditAmount: creditInfo.creditAmount,
    creditPeriod: creditInfo.creditPeriod,
    interestRate: creditInfo.interestRate,
    // Fields for CHEQUE
    chequeNumber: "",
    bankName: "",
    chequeIssuedDate: "",
    chequeReceivedDate: "",
    // Fields for ACCOUNT_TRANSFER
    UTR: "",
    ReferenceID: "",
    ToAccount: "",
    FromAccount: "",
    PaymentDate: "",
    Remarks: "",
    Network: "NEFT", // Default value
    ManualReleaseRequired: "No", // Default value
    TransactionStatus: "Success", // Default value
  });

  const isSettleCredit = type === "Settle Credit";
  const isPartialPayment = type === "Partial Payment";
  const isTotalPayment = type === "Pay Total Amount";

  const apiEndpoints = {
    "Settle Credit": "/admin/business-profiles/settle-credit",
    "Partial Payment": "/admin/business-profiles/partial-payment",
    "Pay Total Amount": "/admin/business-profiles/pay-totalAmountNeedToPay",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append("cid", cid);
    data.append("paymentMethod", formData.paymentMethod);

    // Prepare paymentDetails based on payment method
    let paymentDetails = {};
    if (formData.paymentMethod === "CHEQUE") {
      paymentDetails = {
        chequeNumber: formData.chequeNumber,
        bankName: formData.bankName,
        chequeIssuedDate: formData.chequeIssuedDate,
        chequeReceivedDate: formData.chequeReceivedDate,
        chequeAmount: formData.amount,
      };
    } else if (formData.paymentMethod === "ACCOUNT_TRANSFER") {
      paymentDetails = {
        UTR: formData.UTR,
        ReferenceID: formData.ReferenceID,
        ToAccount: formData.ToAccount,
        FromAccount: formData.FromAccount,
        Amount: formData.amount,
        PaymentDate: formData.PaymentDate,
        Remarks: formData.Remarks,
        Network: formData.Network,
        ManualReleaseRequired: formData.ManualReleaseRequired,
        TransactionStatus: formData.TransactionStatus,
      };
    }

    // Append paymentDetails as a JSON string
    data.append("paymentDetails", JSON.stringify(paymentDetails));

    if (isSettleCredit) {
      data.append("settledAmount", formData.amount);
      data.append("description", formData.description);
      data.append("upgradedCreditAmount", formData.creditAmount);
      data.append("upgradedCreditPeriod", formData.creditPeriod);
      data.append("upgradedInterestRate", formData.interestRate);
    } else if (isPartialPayment || isTotalPayment) {
      data.append(
        isPartialPayment ? "partialAmount" : "amount",
        formData.amount
      );
    }

    if (formData.paymentMethod === "CHEQUE" && formData.chequeImage) {
      data.append("chequeImage", formData.chequeImage);
    }
    if (
      formData.paymentMethod === "ACCOUNT_TRANSFER" &&
      formData.transferReceipt
    ) {
      data.append("transferReceipt", formData.transferReceipt);
    }

    try {
      await api.put(apiEndpoints[type], data);
      setSnackbar({
        open: true,
        message: `${type} successful`,
        severity: "success",
      });
      fetchCredit();
      onClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to process ${type}`,
        severity: "error",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{type}</DialogTitle>
      <DialogContent>
        {/* Credit Information Section */}
        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Credit Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Credit ID:</strong> {creditInfo.creditId}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Credit Amount:</strong> {creditInfo.creditAmount}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Current Credit Amount:</strong>{" "}
                {creditInfo.currentCreditAmount}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Credit Period:</strong> {creditInfo.creditPeriod} months
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Interest Rate:</strong> {creditInfo.interestRate}%
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Outstanding Amount:</strong>{" "}
                {creditInfo.outstandingAmount}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Total Interest Amount:</strong>{" "}
                {creditInfo.totalInterestAmount}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Total Amount to Pay:</strong>{" "}
                {creditInfo.totalAmountNeedToPay}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Payment Method Selection */}
        <TextField
          select
          fullWidth
          margin="dense"
          label="Payment Method"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
        >
          {paymentMethods.map((method) => (
            <MenuItem key={method} value={method}>
              {method}
            </MenuItem>
          ))}
        </TextField>

        {/* Amount Field */}
        {!isTotalPayment && (
          <TextField
            fullWidth
            margin="dense"
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
          />
        )}

        {/* CHEQUE Fields */}
        {formData.paymentMethod === "CHEQUE" && (
          <>
            <TextField
              fullWidth
              margin="dense"
              label="Cheque Number"
              name="chequeNumber"
              value={formData.chequeNumber}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Bank Name"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Cheque Issued Date"
              name="chequeIssuedDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.chequeIssuedDate}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Cheque Received Date"
              name="chequeReceivedDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.chequeReceivedDate}
              onChange={handleChange}
            />
            <div style={{ marginTop: "10px" }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Upload Cheque Image
              </Typography>
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadFileIcon />}
                sx={{ mt: 1 }}
              >
                Choose File
                <input
                  type="file"
                  name="chequeImage"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              {formData.chequeImage && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected: {formData.chequeImage.name}
                </Typography>
              )}
            </div>
          </>
        )}

        {/* ACCOUNT_TRANSFER Fields */}
        {formData.paymentMethod === "ACCOUNT_TRANSFER" && (
          <>
            <TextField
              fullWidth
              margin="dense"
              label="UTR"
              name="UTR"
              value={formData.UTR}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Reference ID"
              name="ReferenceID"
              value={formData.ReferenceID}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="dense"
              label="To Account"
              name="ToAccount"
              value={formData.ToAccount}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="dense"
              label="From Account"
              name="FromAccount"
              value={formData.FromAccount}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Payment Date"
              name="PaymentDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.PaymentDate}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Remarks"
              name="Remarks"
              value={formData.Remarks}
              onChange={handleChange}
            />
            <TextField
              select
              fullWidth
              margin="dense"
              label="Network"
              name="Network"
              value={formData.Network}
              onChange={handleChange}
            >
              {["NEFT", "RTGS", "IMPS", "UPI"].map((network) => (
                <MenuItem key={network} value={network}>
                  {network}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              margin="dense"
              label="Manual Release Required"
              name="ManualReleaseRequired"
              value={formData.ManualReleaseRequired}
              onChange={handleChange}
            >
              {["Yes", "No"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              margin="dense"
              label="Transaction Status"
              name="TransactionStatus"
              value={formData.TransactionStatus}
              onChange={handleChange}
            >
              {["Success", "Failed", "Pending"].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
            <div style={{ marginTop: "10px" }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Upload Transfer Receipt
              </Typography>
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadFileIcon />}
                sx={{ mt: 1 }}
              >
                Choose File
                <input
                  type="file"
                  name="transferReceipt"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              {formData.transferReceipt && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected: {formData.transferReceipt.name}
                </Typography>
              )}
            </div>
          </>
        )}

        {/* Settle Credit Fields */}
        {isSettleCredit && (
          <>
            <TextField
              fullWidth
              margin="dense"
              label="Credit Amount"
              name="creditAmount"
              type="number"
              value={formData.creditAmount}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Credit Period"
              name="creditPeriod"
              type="number"
              value={formData.creditPeriod}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Interest Rate (%)"
              name="interestRate"
              type="number"
              value={formData.interestRate}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!formData.paymentMethod || !formData.amount}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;
