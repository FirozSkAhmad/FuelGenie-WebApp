import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
} from "@mui/material";
import {
  Person,
  LocalGasStation,
  Receipt,
  Payment,
  LocationOn,
  ConfirmationNumber,
} from "@mui/icons-material";
import { format } from "date-fns";
import api from "../../../utils/api";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";

const InstantOrderDetails = () => {
  const theme = useTheme();
  const { instantOrderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/management/instant-products/get-instant-orderDetails/${instantOrderId}`
        );
        setOrderDetails(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [instantOrderId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: theme.palette.background.default }}>
      <BreadcrumbNavigation />
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Order #{instantOrderId}
      </Typography>

      <Grid container spacing={3}>
        {/* Customer & Pump Details */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: theme.palette.background.paper }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Person sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6">Customer Details</Typography>
              </Box>
              <DetailItem
                label="Name"
                value={orderDetails.customerDetails.customerName}
              />
              <DetailItem
                label="Contact"
                value={orderDetails.customerDetails.contactNumber}
              />
              <DetailItem
                label="Email"
                value={orderDetails.customerDetails.email}
              />
              <DetailItem
                label="Segment"
                value={orderDetails.customerDetails.segment}
              />
            </CardContent>
          </Card>

          <Card sx={{ mt: 3, bgcolor: theme.palette.background.paper }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LocalGasStation
                  sx={{ mr: 1, color: theme.palette.secondary.main }}
                />
                <Typography variant="h6">Pump Details</Typography>
              </Box>
              <DetailItem
                label="Pump ID"
                value={orderDetails.pumpDetails.pumpId}
              />
              <DetailItem
                label="Contact"
                value={orderDetails.pumpDetails.contactNumber}
              />
              <DetailItem
                label="Address"
                value={orderDetails.pumpDetails.address}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Order & Payment Status */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: theme.palette.background.paper }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Receipt sx={{ mr: 1, color: theme.palette.info.main }} />
                <Typography variant="h6">Order Summary</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <DetailItem
                    label="Order Date"
                    value={format(
                      new Date(orderDetails.orderDetails.orderDate),
                      "dd MMM yyyy HH:mm"
                    )}
                  />
                  <DetailItem
                    label="Status"
                    value={
                      <Chip
                        label={orderDetails.orderDetails.orderStatus}
                        color={
                          orderDetails.orderDetails.orderStatus === "PENDING"
                            ? "warning"
                            : "success"
                        }
                        size="small"
                      />
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <DetailItem
                    label="Payment Status"
                    value={
                      <Chip
                        label={orderDetails.orderDetails.paymentStatus}
                        color={
                          orderDetails.orderDetails.paymentStatus === "PENDING"
                            ? "error"
                            : "success"
                        }
                        size="small"
                      />
                    }
                  />
                  <DetailItem
                    label="Delivery OTP"
                    value={orderDetails.orderDetails.deliveryOTP}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3, bgcolor: theme.palette.background.paper }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LocationOn sx={{ mr: 1, color: theme.palette.success.main }} />
                <Typography variant="h6">Delivery Location</Typography>
              </Box>
              <DetailItem
                label="Address"
                value={orderDetails.orderDetails.deliveryLocation.address}
              />
              <DetailItem
                label="Coordinates"
                value={
                  <Link
                    href={`https://maps.google.com/?q=${orderDetails.orderDetails.deliveryLocation.coordinates.latitude},${orderDetails.orderDetails.deliveryLocation.coordinates.longitude}`}
                    target="_blank"
                    rel="noopener"
                  >
                    View on Map
                  </Link>
                }
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Products Table */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: theme.palette.background.paper }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Products Ordered
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price/Unit</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderDetails.productDetails.map((product) => (
                      <TableRow key={product.productId}>
                        <TableCell>{product.productName}</TableCell>
                        <TableCell>
                          <Chip
                            label={product.productType}
                            color="primary"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {product.quantity} {product.unit}
                        </TableCell>
                        <TableCell align="right">
                          ₹{product.pricePerUnit}
                        </TableCell>
                        <TableCell align="right">
                          ₹{product.totalPrice}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Payment Details */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: theme.palette.background.paper }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Payment sx={{ mr: 1, color: theme.palette.warning.main }} />
                <Typography variant="h6">Payment Breakdown</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <DetailItem
                    label="Item Total"
                    value={`₹${orderDetails.orderDetails.itemTotal}`}
                  />
                  <DetailItem
                    label="Delivery Fee"
                    value={`₹${orderDetails.orderDetails.deliveryFee}`}
                  />
                  <DetailItem
                    label="Grand Total"
                    value={`₹${orderDetails.orderDetails.grandTotal}`}
                    bold
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailItem
                    label="Payment Mode"
                    value={orderDetails.paymentDetails.paymentMode}
                  />
                  <DetailItem
                    label="Razorpay Order ID"
                    value={orderDetails.paymentDetails.razorpayOrderId}
                  />
                  {orderDetails.paymentDetails.transactionDetails && (
                    <>
                      <DetailItem
                        label="Transaction ID"
                        value={
                          orderDetails.paymentDetails.transactionDetails
                            .transactionId
                        }
                      />
                      <DetailItem
                        label="Amount Paid"
                        value={`₹${orderDetails.paymentDetails.transactionDetails.amountPaid}`}
                      />
                    </>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const DetailItem = ({ label, value, bold = false }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
    <Typography variant="body2" color="textSecondary">
      {label}:
    </Typography>
    <Typography variant="body1" sx={{ fontWeight: bold ? 600 : 400 }}>
      {value}
    </Typography>
  </Box>
);

export default InstantOrderDetails;
