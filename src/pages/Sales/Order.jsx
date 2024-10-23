import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Breadcrumbs,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Link, useNavigate } from "react-router-dom";
import CreateOrderModal from "../../components/Sales/CreateOrderModal";

// Sample Order Data
const ordersData = [
  {
    dateTime: "05-07-2024 7:00",
    orderId: "11223345",
    productName: "Diesel",
    customerName: "Varun",
    quantity: "2500 Ltrs",
    zone: "Hyd E1",
    status: "Pending",
    edSlot: "05-07-2024 S1",
    paymentStatus: "Paid",
  },
  {
    dateTime: "05-07-2024 7:00",
    orderId: "11223345",
    productName: "MTO",
    customerName: "Firoz",
    quantity: "1500 Ltrs",
    zone: "Hyd E1",
    status: "Cancelled",
    edSlot: "05-07-2024 S5",
    paymentStatus: "Paid",
  },
  {
    dateTime: "05-07-2024 7:00",
    orderId: "11223345",
    productName: "Fuel Oil",
    customerName: "Sarik",
    quantity: "2500 Ltrs",
    zone: "Hyd E1",
    status: "Pending",
    edSlot: "05-07-2024 S5",
    paymentStatus: "UnPaid",
  },
  // Add more sample data here...
];

// Order component
const Order = () => {
  const [orders, setOrders] = useState(ordersData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    date: "",
    orderId: "",
    status: "",
  });
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  // Handle row click
  const handleRowClick = (orderId) => {
    navigate(`/sales/orders/${orderId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" to="/">
              Home
            </Link>
            <Typography color="text.primary">Orders</Typography>
          </Breadcrumbs>
        </Box>
        <Button variant="contained" onClick={handleOpenModal}>
          Create Order
        </Button>
      </Box>
      {/* Filters Section */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="O.D & T"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          sx={{ minWidth: 180 }}
        />
        <TextField
          label="Order ID"
          variant="outlined"
          name="orderId"
          value={filters.orderId}
          onChange={handleFilterChange}
          sx={{ minWidth: 180 }}
        />
        <FormControl variant="outlined" sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
            <MenuItem value="Rescheduled">Rescheduled</MenuItem>
            <MenuItem value="Truck Allocated">Truck Allocated</MenuItem>
          </Select>
        </FormControl>
        <IconButton sx={{ alignSelf: "center" }}>
          <FilterListIcon />
        </IconButton>
      </Box>

      {/* Orders Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>O.D & T</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Zone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>E.D/Slot</TableCell>
              <TableCell>Payment Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order, index) => (
                <TableRow
                  key={index}
                  onClick={() => handleRowClick(order.orderId)}
                  hover
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{order.dateTime}</TableCell>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.productName}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.zone}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.edSlot}</TableCell>
                  <TableCell>{order.paymentStatus}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={orders.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Create Order Modal */}
      <CreateOrderModal open={modalOpen} handleClose={handleCloseModal} />
    </Box>
  );
};

export default Order;
