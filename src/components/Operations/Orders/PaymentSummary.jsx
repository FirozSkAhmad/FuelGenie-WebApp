import React from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from "@mui/material";

const PaymentSummary = ({
  selectedProducts,
  paymentMethod,
  setPaymentMethod,
  selectedAssets,
  selectedShippingAddress,
  selectedTimeSlot,
  selectedBillingAddress,
}) => {
  // Filter out products with quantity 0
  const filteredProducts = selectedProducts.filter(
    (product) => product.quantity > 0
  );

  // Calculate the total amount and GST for each product
  const productDetails = filteredProducts.map((product) => {
    const totalPrice = product.price * product.quantity;
    const gstAmount = (totalPrice * product.gstPercentage) / 100;
    return {
      ...product,
      totalPrice,
      gstAmount,
    };
  });

  // Calculate the grand total (including GST)
  const grandTotal = productDetails.reduce(
    (sum, product) => sum + product.totalPrice + product.gstAmount,
    0
  );

  // // Log selected products and payment method for debugging
  // console.log(selectedProducts);
  // console.log(paymentMethod);
  // console.log(selectedAssets);
  // console.log(selectedShippingAddress);
  // console.log(selectedTimeSlot);
  // console.log(selectedBillingAddress);

  return (
    <Box>
      <Typography variant="h6">Payment Summary</Typography>

      {/* Display selected products */}
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Selected Products:
      </Typography>
      <List>
        {productDetails.map((product, index) => (
          <React.Fragment key={product._id}>
            <ListItem>
              {/* Product Image */}
              <ListItemAvatar>
                <Avatar
                  src={product.media[0]} // Display the first image in the media array
                  alt={product.name}
                  variant="square"
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
              </ListItemAvatar>

              {/* Product Details */}
              <ListItemText
                primary={product.name}
                secondary={
                  <>
                    <Typography variant="body2" component="span">
                      Quantity: {product.quantity} {product.units}
                    </Typography>
                    <br />
                    <Typography variant="body2" component="span">
                      Price: ₹{product.price} per {product.units}
                    </Typography>
                    <br />
                    <Typography variant="body2" component="span">
                      GST ({product.gstPercentage}%): ₹
                      {product.gstAmount.toFixed(2)}
                    </Typography>
                  </>
                }
              />

              {/* Total Price for the Product */}
              <Typography variant="body2">
                ₹{(product.totalPrice + product.gstAmount).toFixed(2)}
              </Typography>
            </ListItem>
            {index < productDetails.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      {/* Display Grand Total */}
      <Typography variant="h6" sx={{ mt: 2 }}>
        Grand Total: ₹{grandTotal.toFixed(2)}
      </Typography>

      {/* Payment method dropdown */}
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
