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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import SearchIcon from "@mui/icons-material/Search";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";
import Quotes from "./Quote-Requests/Quotes";
import CreateOrder from "../../../components/Operations/CreateOrder";

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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Customer Number</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Zone</TableCell>
              <TableCell>Order Status</TableCell>
              <TableCell>Delivery Slot</TableCell>
              <TableCell>Payment Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow
                key={order.orderId}
                hover
                onClick={() => handleRowClick(order.orderId)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{order.orderId}</TableCell>
                <TableCell>
                  {new Date(order.orderDateTime).toLocaleString()}
                </TableCell>
                <TableCell>{order.customerName || "NA"}</TableCell>
                <TableCell>{order.customerNumber || "NA"}</TableCell>
                <TableCell>{order.productName}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{order.zone}</TableCell>
                <TableCell>{order.orderStatus}</TableCell>
                <TableCell>{order.deliverySlot}</TableCell>
                <TableCell>{order.paymentStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" marginTop={3}>
        <Pagination
          count={Math.ceil(filteredOrders.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
      <Quotes />
    </Box>
  );
};

export default Orders;
