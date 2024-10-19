import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const rows = [
  {
    name: "Ramesh",
    product: "Diesel",
    quantity: "250 Ltrs",
    total: "₹245,489",
    fee: "₹130.992",
  },
  {
    name: "Somith",
    product: "MTO",
    quantity: "250 Ltrs",
    total: "₹245,489",
    fee: "₹130.992",
  },
  {
    name: "Firoz",
    product: "LTO",
    quantity: "250 Ltrs",
    total: "₹245,489",
    fee: "₹130.992",
  },
  {
    name: "Vishal",
    product: "Diesel",
    quantity: "250 Ltrs",
    total: "₹245,489",
    fee: "₹130.992",
  },
  {
    name: "Rahul",
    product: "Diesel",
    quantity: "250 Ltrs",
    total: "₹245,489",
    fee: "₹130.992",
  },
];

const OrdersTable = () => {
  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Last 5 Placed Orders
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Customer Name</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Delivery Fee</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.product}</TableCell>
              <TableCell>{row.quantity}</TableCell>
              <TableCell>{row.total}</TableCell>
              <TableCell>{row.fee}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrdersTable;
