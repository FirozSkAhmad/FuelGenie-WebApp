import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Pagination,
  TextField,
  Box,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import SearchIcon from "@mui/icons-material/Search";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";
import Quotes from "./Quote-Requests/Quotes";
import CreateOrder from "../../../components/Operations/Orders/CreateOrder";
import VerifyPaymentModal from "../../../components/Operations/Orders/VerificationModal";
import StatusUpdateModal from "../../../components/Operations/Orders/StatusUpdateModal";
import { set } from "date-fns";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import EditIcon from "@mui/icons-material/Edit";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5); // Number of rows per page
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("ALL");
  const [orderStatusFilter, setOrderStatusFilter] = useState("ALL");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({
    orderId: "",
    phoneNumber: "",
  });
  const [statusUpdateModalOpen, setStatusUpdateModalOpen] = useState(false);
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState(null);
  const navigate = useNavigate();

  // Fetch orders from the API
  const fetchOrders = async () => {
    try {
      const response = await api.get("/operations/orders/get-orders");
      setOrders(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenStatusUpdateModal = (order) => {
    setSelectedOrderForStatus(order);
    setStatusUpdateModalOpen(true);
  };

  const handleCloseStatusUpdateModal = () => {
    setStatusUpdateModalOpen(false);
    setSelectedOrderForStatus(null);
  };
  const handleUpdateStatus = async (orderId, formData) => {
    try {
      const response = await api.patch(
        `/operations/orders/update-status/${orderId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle non-200 status codes
      if (response.status !== 200) {
        throw new Error(response.data.message || "Failed to update status");
      }

      console.log("Status updated successfully:", response.data);
      return response.data;
    } catch (error) {
      // Enhance error message with server response if available
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update status";

      // Create new error object to maintain stack trace
      const enhancedError = new Error(errorMessage);
      enhancedError.response = error.response;

      console.error("Error updating status:", enhancedError);
      throw enhancedError; // Re-throw to be caught by modal
    }
  };
  const handleRowClick = (orderId) => {
    // Navigate to the order details page with the orderId
    navigate(`/operations/orders/${orderId}`);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to the first page when searching
  };

  const handlePaymentStatusFilterChange = (event) => {
    setPaymentStatusFilter(event.target.value);
    setPage(1); // Reset to the first page when filtering
  };

  const handleOrderStatusFilterChange = (event) => {
    setOrderStatusFilter(event.target.value);
    setPage(1); // Reset to the first page when filtering
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setPage(1); // Reset to the first page when filtering
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setPage(1); // Reset to the first page when filtering
  };

  const handleVerifyClick = (order) => {
    console.log("Verify button clicked", order);
    setSelectedOrder({
      orderId: order.orderId,
      phoneNumber: order.customerNumber,
    });
    setModalOpen(true);
    console.log("modalOpen state:", modalOpen);
  };

  const handleVerificationSuccess = () => {
    fetchOrders(); // Refresh the orders list after successful verification
  };

  // Filter orders based on search term, payment status, order status, and date range
  const filteredOrders = orders.filter((order) => {
    const matchesSearchTerm = order.orderId
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPaymentStatus =
      paymentStatusFilter === "ALL" ||
      order.paymentStatus === paymentStatusFilter;
    const matchesOrderStatus =
      orderStatusFilter === "ALL" || order.orderStatus === orderStatusFilter;

    // Date range filtering
    const orderDate = new Date(order.orderDateTime).setHours(0, 0, 0, 0); // Remove time portion
    const filterStartDate = startDate
      ? new Date(startDate).setHours(0, 0, 0, 0)
      : null;
    const filterEndDate = endDate
      ? new Date(endDate).setHours(0, 0, 0, 0)
      : null;

    const matchesStartDate = filterStartDate
      ? orderDate >= filterStartDate
      : true;
    const matchesEndDate = filterEndDate ? orderDate <= filterEndDate : true;

    return (
      matchesSearchTerm &&
      matchesPaymentStatus &&
      matchesOrderStatus &&
      matchesStartDate &&
      matchesEndDate
    );
  });

  // Paginate orders
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Typography variant="h6" align="center" style={{ marginTop: "20px" }}>
        No orders found.
      </Typography>
    );
  }
  // Determine if the Action column should be visible
  const showActionColumn = filteredOrders.some(
    (order) => order.paymentStatus === "OTP_PENDING"
  );

  return (
    <Box sx={{ padding: 3 }}>
      <BreadcrumbNavigation />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4" gutterBottom>
          Orders
        </Typography>
        <CreateOrder fetchOrder={fetchOrders} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        {/* Search Filter */}
        <TextField
          fullWidth
          placeholder="Search by Order ID"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ marginBottom: 3 }}
        />

        {/* Payment Status Filter */}
        <FormControl fullWidth sx={{ marginBottom: 3 }}>
          <InputLabel>Payment Status</InputLabel>
          <Select
            value={paymentStatusFilter}
            onChange={handlePaymentStatusFilterChange}
            label="Payment Status"
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="PAID">Paid</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="OTP_PENDING">OTP Pending</MenuItem>
          </Select>
        </FormControl>

        {/* Order Status Filter */}
        <FormControl fullWidth sx={{ marginBottom: 3 }}>
          <InputLabel>Order Status</InputLabel>
          <Select
            value={orderStatusFilter}
            onChange={handleOrderStatusFilterChange}
            label="Order Status"
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            {/* <MenuItem value="OTP_PENDING">OTP Pending</MenuItem> */}
            <MenuItem value="COMPLETED">Completed</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Date Range Filter */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box display="flex" gap={2} sx={{ marginBottom: 3 }}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={handleStartDateChange}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={handleEndDateChange}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Box>
      </LocalizationProvider>
      {/* Orders Table */}
      <TableContainer component={Paper}>
        <Table
          sx={{
            minWidth: 1500, // Wider table for better spacing
            "& .MuiTableCell-root": {
              padding: "16px 24px", // More horizontal padding
              fontSize: "0.875rem",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Qty</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Zone</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Delivery Slot</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Payment</TableCell>
              {showActionColumn && (
                <TableCell sx={{ fontWeight: 600 }}>
                  Payment Verification
                </TableCell>
              )}
              <TableCell sx={{ fontWeight: 600 }}>Delivery Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow
                key={order.orderId}
                hover
                onClick={() => handleRowClick(order.orderId)}
                sx={{
                  cursor: "pointer",
                  "&:last-child td": { borderBottom: 0 },
                  "&:hover": { backgroundColor: "#fafafa" },
                }}
              >
                {/* Order ID */}
                <TableCell sx={{ color: "#1976d2", fontWeight: 500 }}>
                  #{order.orderId}
                </TableCell>

                {/* Date */}
                <TableCell>
                  <Box display="flex" flexDirection="column">
                    <span>
                      {new Date(order.orderDateTime).toLocaleDateString()}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "#666" }}>
                      {new Date(order.orderDateTime).toLocaleTimeString()}
                    </span>
                  </Box>
                </TableCell>

                {/* Customer */}
                <TableCell>
                  <Box display="flex" flexDirection="column">
                    <span>{order.customerName || "Unnamed Customer"}</span>
                    <span style={{ fontSize: "0.75rem", color: "#666" }}>
                      {order.customerNumber || "No contact"}
                    </span>
                  </Box>
                </TableCell>

                {/* Product */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <span>{order.productName}</span>
                  </Box>
                </TableCell>

                {/* Quantity */}
                <TableCell>{order.quantity}x</TableCell>

                {/* Zone */}
                <TableCell>
                  <Chip
                    label={order.zone}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Chip
                    label={order.orderStatus}
                    color={
                      order.orderStatus === "CANCELLED"
                        ? "error"
                        : order.orderStatus === "DELIVERED" ||
                          order.orderStatus === "COMPLETED"
                        ? "success"
                        : order.orderStatus === "PROCESSING"
                        ? "info"
                        : order.orderStatus === "OUT_FOR_DELIVERY"
                        ? "secondary"
                        : "warning"
                    }
                    size="small"
                    sx={{
                      fontWeight: 500,
                      textTransform: "capitalize",
                      borderRadius: "4px",
                    }}
                  />
                </TableCell>

                {/* Delivery Slot */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <AccessTimeIcon fontSize="small" />
                    <span>{order.deliverySlot}</span>
                  </Box>
                </TableCell>

                {/* Payment */}
                <TableCell>
                  <Chip
                    label={order.paymentStatus}
                    color={
                      order.paymentStatus === "PAID"
                        ? "success"
                        : order.paymentStatus === "OTP_PENDING"
                        ? "warning"
                        : "error"
                    }
                    variant="outlined"
                    size="small"
                  />
                </TableCell>

                {/* Payment Verification */}
                {showActionColumn && (
                  <TableCell>
                    {order.paymentStatus === "OTP_PENDING" ? (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<VerifiedUserIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerifyClick(order);
                        }}
                        sx={{
                          textTransform: "none",
                          boxShadow: "none",
                          "&:hover": { boxShadow: "none" },
                        }}
                      >
                        Verify Payment
                      </Button>
                    ) : (
                      <Chip
                        label="Verified"
                        color="success"
                        size="small"
                        icon={<CheckCircleIcon />}
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    )}
                  </TableCell>
                )}

                {/* Delivery Status */}
                <TableCell>
                  {order.orderStatus === "DELIVERED" ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label="Delivered"
                        icon={<LocalShippingIcon fontSize="small" />}
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenStatusUpdateModal(order);
                      }}
                      disabled={order.orderStatus === "CANCELLED"}
                      sx={{
                        textTransform: "none",
                        borderWidth: "1px",
                        "&:hover": { borderWidth: "1px" },
                        "&.Mui-disabled": { borderWidth: "1px" },
                      }}
                    >
                      {order.orderStatus === "CANCELLED"
                        ? "Order Cancelled"
                        : "Update Status"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <StatusUpdateModal
        fetchOrder={fetchOrders}
        key={selectedOrderForStatus?.orderId}
        open={statusUpdateModalOpen}
        handleClose={handleCloseStatusUpdateModal}
        order={selectedOrderForStatus}
        handleUpdateStatus={handleUpdateStatus}
      />
      {/* Pagination */}
      <Box display="flex" justifyContent="center" marginTop={3}>
        <Pagination
          count={Math.ceil(filteredOrders.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
      <VerifyPaymentModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        OrderData={selectedOrder}
        onVerificationSuccess={handleVerificationSuccess}
      />
      <Quotes />
    </Box>
  );
};

export default Orders;
