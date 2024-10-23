import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Divider,
  useTheme,
  TextField,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PaymentIcon from "@mui/icons-material/Payment";
import HistoryIcon from "@mui/icons-material/History";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { useParams } from "react-router-dom";
import CreditCardIcon from "@mui/icons-material/CreditCard";

import StarRateIcon from "@mui/icons-material/StarRate";
const OrderDetailsPage = () => {
  const theme = useTheme(); // Access the current theme (light or dark mode)
  const { orderId } = useParams();
  // Temporary data for display purposes
  const customerDetails = {
    customerId: "#11223345",
    customerName: "Varun Kumar",
    contactNumber: "99999-99999",
    email: "varun@example.com",
    segment: "Individual",
    panCardNumber: "ASDF-987C",
  };

  const productDetails = {
    productName: "Diesel",
    productId: "#25045",
    quantity: "2500 Ltrs",
    orderPrice: "₹ 65,031",
    totalPrice: "₹ 6,07,500",
  };

  const orderDetails = {
    orderId: `${orderId}`,
    status: "Pending",
    paymentStatus: "Paid",
    orderType: "Customer App",
    dateOfOrder: "10-10-2024",
    dispatchDate: "15-10-2024",
  };

  const addressDetails = {
    billing: {
      address: "High Apartments 5-B, 5th floor, Hyderabad, India",
      postalCode: "500045",
    },
    shipping: {
      address: "High Apartments 5-B, 5th floor, Hyderabad, India",
      postalCode: "500045",
    },
  };

  const paymentDetails = {
    paymentType: "Card",
    transactionId: "#22456",
    price: "₹ 6,07,500",
    couponCode: "FIRST100",
    discount: "₹ 100",
    finalPrice: "₹ 6,07,400",
  };

  const orderHistory = [
    {
      date: "10-10-2024",
      event: "Order placed by customer",
    },
    {
      date: "12-10-2024",
      event: "Payment confirmed",
    },
    {
      date: "15-10-2024",
      event: "Order dispatched",
    },
  ];
  const productReview = {
    rating: 4,
    comment: "Great quality, exactly as described.",
    customerName: "Varun Kumar",
  };

  const deliveryReview = {
    rating: 5,
    comment: "Delivered on time and in perfect condition!",
    customerName: "Varun Kumar",
  };

  // Function to handle review submission
  const handleReviewSubmit = (event) => {
    event.preventDefault();
    // Handle review submission logic here
  };

  // Function to handle order cancellation
  const handleCancelOrder = () => {
    // Handle order cancellation logic here
    alert("Order has been canceled.");
  };

  return (
    <Box sx={{ padding: 4 }}>
      {/* Title and Buttons */}
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Order Details - {orderId}
        </Typography>
        <Box>
          <Button variant="contained" sx={{ mr: 2 }}>
            Download Invoice
          </Button>
          <Button variant="contained" startIcon={<EmailIcon />}>
            Email Invoice
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelOrder}
            sx={{ ml: 2 }}
          >
            Cancel Order
          </Button>
        </Box>
      </Box>

      {/* Main Grid Layout */}
      <Grid container spacing={3}>
        {/* Customer Details */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.background.paper
                  : "#f9f9f9",
              color: theme.palette.text.primary,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              <AccountCircleIcon sx={{ mr: 1 }} /> Customer Details
            </Typography>
            <Typography>Customer ID: {customerDetails.customerId}</Typography>
            <Typography>Name: {customerDetails.customerName}</Typography>
            <Typography>Contact: {customerDetails.contactNumber}</Typography>
            <Typography>Email: {customerDetails.email}</Typography>
            <Typography>Segment: {customerDetails.segment}</Typography>
            <Typography>
              PanCard Number: {customerDetails.panCardNumber}
            </Typography>
          </Paper>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.background.paper
                  : "#f9f9f9",
              color: theme.palette.text.primary,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              <LocalShippingIcon sx={{ mr: 1 }} /> Product Details
            </Typography>
            <Typography>Product Name: {productDetails.productName}</Typography>
            <Typography>Product ID: {productDetails.productId}</Typography>
            <Typography>Quantity: {productDetails.quantity}</Typography>
            <Typography>Order Price: {productDetails.orderPrice}</Typography>
            <Typography>Total Price: {productDetails.totalPrice}</Typography>
          </Paper>
        </Grid>

        {/* Order Details */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.background.paper
                  : "#f9f9f9",
              color: theme.palette.text.primary,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              <HistoryIcon sx={{ mr: 1 }} /> Order Details
            </Typography>
            <Typography>Order ID: {orderDetails.orderId}</Typography>
            <Typography>Status: {orderDetails.status}</Typography>
            <Typography>
              Payment Status: {orderDetails.paymentStatus}
            </Typography>
            <Typography>Order Type: {orderDetails.orderType}</Typography>
            <Typography>Date of Order: {orderDetails.dateOfOrder}</Typography>
            <Typography>Dispatch Date: {orderDetails.dispatchDate}</Typography>
          </Paper>
        </Grid>

        {/* Billing and Shipping Details */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.background.paper
                  : "#f9f9f9",
              color: theme.palette.text.primary,
            }}
          >
            {" "}
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              <CreditCardIcon sx={{ marginRight: 1 }} /> Billing Address
            </Typography>
            <Typography>Address: {addressDetails.billing.address}</Typography>
            <Typography>
              Postal Code: {addressDetails.billing.postalCode}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.background.paper
                  : "#f9f9f9",
              color: theme.palette.text.primary,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              <LocalShippingIcon sx={{ marginRight: 1 }} />
              Shipping Address
            </Typography>
            <Typography>Address: {addressDetails.shipping.address}</Typography>
            <Typography>
              Postal Code: {addressDetails.shipping.postalCode}
            </Typography>
          </Paper>
        </Grid>

        {/* Payment Details */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.background.paper
                  : "#f9f9f9",
              color: theme.palette.text.primary,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              <PaymentIcon sx={{ mr: 1 }} /> Payment Details
            </Typography>
            <Typography>Payment Type: {paymentDetails.paymentType}</Typography>
            <Typography>
              Transaction ID: {paymentDetails.transactionId}
            </Typography>
            <Typography>Price: {paymentDetails.price}</Typography>
            <Typography>Coupon Code: {paymentDetails.couponCode}</Typography>
            <Typography>Discount: {paymentDetails.discount}</Typography>
            <Typography>Final Price: {paymentDetails.finalPrice}</Typography>
          </Paper>
        </Grid>

        {/* Order History */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.background.paper
                  : "#f9f9f9",
              color: theme.palette.text.primary,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              <HistoryIcon sx={{ marginRight: 1 }} /> Order History
            </Typography>
            {orderHistory.map((event, index) => (
              <Typography key={index}>
                {event.date}: {event.event}
              </Typography>
            ))}
          </Paper>
        </Grid>

        {/* Support Information */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.background.paper
                  : "#f9f9f9",
              color: theme.palette.text.primary,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              <SupportAgentIcon sx={{ mr: 1 }} /> Support Information
            </Typography>
            <Typography>For any queries, contact us at:</Typography>
            <Typography>Email: support@example.com</Typography>
            <Typography>Phone: +1 234 567 890</Typography>
          </Paper>
        </Grid>

        {/* Review Section */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.background.paper
                  : "#f9f9f9",
              color: theme.palette.text.primary,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              <StarRateIcon sx={{ marginRight: 1 }} /> Customer Reviews
            </Typography>

            {/* Product Review */}
            <Box
              sx={{ mb: 4, border: "1px solid #ddd", borderRadius: 2, p: 2 }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Product Review
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                {/* Display stars for product */}
                {[...Array(5)].map((_, starIndex) => (
                  <span
                    key={starIndex}
                    style={{
                      color:
                        starIndex < productReview.rating ? "#FFD700" : "#ccc",
                      fontSize: "1.5rem",
                    }}
                  >
                    ★
                  </span>
                ))}
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {`(${productReview.rating}/5)`}
                </Typography>
              </Box>
              <Typography variant="body1">{productReview.comment}</Typography>
              <Typography variant="caption" sx={{ color: "gray" }}>
                - {productReview.customerName}
              </Typography>
            </Box>

            {/* Delivery Partner Review */}
            <Box sx={{ border: "1px solid #ddd", borderRadius: 2, p: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Delivery Partner Review
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                {/* Display stars for delivery partner */}
                {[...Array(5)].map((_, starIndex) => (
                  <span
                    key={starIndex}
                    style={{
                      color:
                        starIndex < deliveryReview.rating ? "#FFD700" : "#ccc",
                      fontSize: "1.5rem",
                    }}
                  >
                    ★
                  </span>
                ))}
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {`(${deliveryReview.rating}/5)`}
                </Typography>
              </Box>
              <Typography variant="body1">{deliveryReview.comment}</Typography>
              <Typography variant="caption" sx={{ color: "gray" }}>
                - {deliveryReview.customerName}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetailsPage;
