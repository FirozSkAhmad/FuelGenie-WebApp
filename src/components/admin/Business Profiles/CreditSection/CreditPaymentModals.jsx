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
    paymentDetails: "",
    amount: creditInfo.creditAmount - creditInfo.currentCreditAmount,
    description: "",
    chequeImage: null,
    transferReceipt: null,
    creditAmount: creditInfo.creditAmount,
    creditPeriod: creditInfo.creditPeriod,
    interestRate: creditInfo.interestRate,
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
    data.append("paymentDetails", formData.paymentDetails);

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
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{type}</DialogTitle>
      <DialogContent>
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
        <TextField
          fullWidth
          margin="dense"
          label="Payment Details"
          name="paymentDetails"
          value={formData.paymentDetails}
          onChange={handleChange}
        />
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

        {formData.paymentMethod === "CHEQUE" && (
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
        )}

        {formData.paymentMethod === "ACCOUNT_TRANSFER" && (
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
