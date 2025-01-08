import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import {
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Grid,
  Divider,
  Alert,
  Chip,
} from "@mui/material";
import {
  Person as PersonIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Home as HomeIcon,
  Assignment as OrderIcon,
  Inventory as AssetIcon,
} from "@mui/icons-material";
import BreadcrumbNavigation from "../../components/addProduct/utils/BreadcrumbNavigation";

const OrdersDetails = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { orderId } = useParams();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await api.get(
          `/operations/orders/orderDetails/${orderId}`
        );
        if (response.data.status === 200) {
          setOrderDetails(response.data.data);
        } else {
          setError("Failed to fetch order details.");
        }
      } catch (err) {
        setError("An error occurred while fetching order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!orderDetails) {
    return (
      <Container>
        <Alert severity="info">No order details found.</Alert>
      </Container>
    );
  }

  const {
    customerDetails,
    productDetails,
    orderDetails: orderInfo,
    billingAddress,
    shippingAddress,
    paymentDetails,
  } = orderDetails;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <BreadcrumbNavigation />
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 4 }}>
        Order Details
      </Typography>

      {/* Customer Details */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <PersonIcon />
            </Avatar>
          }
          title="Customer Details"
          titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Customer Name"
                    secondary={customerDetails.customerName}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Contact Number"
                    secondary={customerDetails.contactNumber}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Email"
                    secondary={customerDetails.mailId}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Customer ID"
                    secondary={customerDetails.customerId}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Segment"
                    secondary={customerDetails.segment}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="PAN Card Number"
                    secondary={customerDetails.panCardNumber}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* Address Details */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "info.main" }}>
              <HomeIcon />
            </Avatar>
          }
          title="Address Details"
          titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Billing Address
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {billingAddress}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Shipping Address
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {shippingAddress}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* Product Details */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              <ShippingIcon />
            </Avatar>
          }
          title="Product Details"
          titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Product Name"
                    secondary={productDetails.productName}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Product ID"
                    secondary={productDetails.productId}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Quantity"
                    secondary={productDetails.quantity}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Date of Order"
                    secondary={productDetails.dateOfOrder}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Price at Order"
                    secondary={productDetails.priceAtOrder}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Total Quantity Price"
                    secondary={productDetails.totalQuantityPrice || "N/A"}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Order Details */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "success.main" }}>
              <OrderIcon />
            </Avatar>
          }
          title="Order Information"
          titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Order ID"
                    secondary={orderInfo.orderId}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Date of Order"
                    secondary={orderInfo.dateOfOrder}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Date and Slot"
                    secondary={orderInfo.dateAndSlot}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Delivery Location"
                    secondary={orderInfo.deliveryLocation}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Order Status"
                    secondary={
                      <Chip
                        label={orderInfo.orderStatus}
                        color={
                          orderInfo.orderStatus === "PENDING"
                            ? "warning"
                            : orderInfo.orderStatus === "COMPLETED"
                            ? "success"
                            : "error"
                        }
                      />
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Payment Status"
                    secondary={
                      <Chip
                        label={orderInfo.paymentStatus}
                        color={
                          orderInfo.paymentStatus === "PAID"
                            ? "success"
                            : "error"
                        }
                      />
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Product Name"
                    secondary={orderInfo.productName}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Price at Order"
                    secondary={orderInfo.priceAtOrder}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Assets Details */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "info.main" }}>
              <AssetIcon />
            </Avatar>
          }
          title="Assets Details"
          titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
        />
        <CardContent>
          <Grid container spacing={3}>
            {orderInfo.assets.map((asset, index) => (
              <Grid item xs={12} md={6} key={index}>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Asset Name"
                      secondary={asset.assetName}
                      secondaryTypographyProps={{ color: "text.secondary" }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Asset Capacity"
                      secondary={asset.assetCapacity}
                      secondaryTypographyProps={{ color: "text.secondary" }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Identification Number"
                      secondary={asset.identificationNo}
                      secondaryTypographyProps={{ color: "text.secondary" }}
                    />
                  </ListItem>
                </List>
                {index < orderInfo.assets.length - 1 && <Divider />}
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "warning.main" }}>
              <PaymentIcon />
            </Avatar>
          }
          title="Payment Details"
          titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Payment Mode"
                    secondary={paymentDetails.paymentMode}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Payment Status"
                    secondary={
                      <Chip
                        label={paymentDetails.paymentStatus}
                        color={
                          paymentDetails.paymentStatus === "PAID"
                            ? "success"
                            : "error"
                        }
                      />
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Transaction ID"
                    secondary={
                      paymentDetails.razorpayTransaction?.transactionId || "N/A"
                    }
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Razorpay Order ID"
                    secondary={
                      paymentDetails.razorpayTransaction?.razorpayOrderId ||
                      "N/A"
                    }
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Razorpay Payment ID"
                    secondary={
                      paymentDetails.razorpayTransaction?.razorpayPaymentId ||
                      "N/A"
                    }
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Amount Paid"
                    secondary={`₹${paymentDetails.razorpayTransaction?.amountPaid}`}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Total Amount"
                    secondary={`₹${paymentDetails.totalAmount}`}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Coupon Code"
                    secondary={paymentDetails.couponCode || "N/A"}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Discount Applied"
                    secondary={`₹${paymentDetails.discountApplied}`}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Delivery Fee"
                    secondary={`₹${paymentDetails.deliveryFee}`}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Final Amount"
                    secondary={`₹${paymentDetails.finalAmount}`}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default OrdersDetails;
