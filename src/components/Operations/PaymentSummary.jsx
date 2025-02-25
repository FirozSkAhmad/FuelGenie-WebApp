import React from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const PaymentSummary = ({
  selectedProducts,
  paymentMethod,
  setPaymentMethod,
}) => {
  const totalAmount = selectedProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  return (
    <Box>
      <Typography variant="h6">Payment Summary</Typography>
      <Typography>Total Amount: ₹{totalAmount}</Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Payment Method</InputLabel>
        <Select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <MenuItem value="creditOnly">Credit Only</MenuItem>
          <MenuItem value="walletAndCredit">Wallet and Credit</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default PaymentSummary;
