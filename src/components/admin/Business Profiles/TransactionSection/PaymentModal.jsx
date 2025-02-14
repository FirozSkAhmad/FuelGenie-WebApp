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
} from "@mui/material";
import api from "../../../../utils/api";

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
      const response = await api.put(
        "/admin/business-profiles/pay-a-creditTransactionAmount",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        onPaymentSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Payment error:", error);
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
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          Pay Credit Transaction Amount
        </Typography>
        <FormControl fullWidth sx={{ mt: 2 }}>
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
          <>
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
              sx={{ mt: 2 }}
            />
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
              sx={{ mt: 2 }}
            />
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
              sx={{ mt: 2 }}
            />
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
              sx={{ mt: 2 }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setChequeImage(e.target.files[0])}
              style={{ marginTop: 16 }}
            />
          </>
        )}

        {paymentMethod === "ACCOUNT_TRANSFER" && (
          <>
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
              sx={{ mt: 2 }}
            />
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
              sx={{ mt: 2 }}
            />
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
              sx={{ mt: 2 }}
            />
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
              sx={{ mt: 2 }}
            />
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
              sx={{ mt: 2 }}
            />
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
              sx={{ mt: 2 }}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
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
            <FormControl fullWidth sx={{ mt: 2 }}>
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
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Transaction Status</InputLabel>
              <Select
                value={transferDetails.TransactionStatus}
                onChange={(e) =>
                  setTransferDetails({
                    ...transferDetails,
                    TransactionStatus: e.target.value,
                  })
                }
                label="Transaction Status "
              >
                <MenuItem value="Success">Success</MenuItem>
                <MenuItem value="Failed">Failed</MenuItem>
              </Select>
            </FormControl>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setTransferReceipt(e.target.files[0])}
              style={{ marginTop: 16 }}
            />
          </>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button onClick={onClose} color="secondary" sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handlePayment}>
            Pay
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PaymentModal;
