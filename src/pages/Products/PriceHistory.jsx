import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Pagination,
  Grid,
  Box,
  MenuItem,
  Select,
} from "@mui/material";
import AddProductModal from "../../components/addProduct/AddProductModal";
const PriceHistory = () => {
  const [addProductOpen, setAddProductOpen] = useState(false);
  // Sample data, replace this with real data
  const rows = [
    {
      date: "05-07-2024 9:00Am",
      productId: "#11223345",
      productName: "Diesel",
      zone: "Hyd-e1",
      price: "₹ 98.98",
      unit: "1 Ltr",
      updatedBy: "Ramana Rao",
      roleId: "#11223345",
    },
    {
      date: "05-07-2024",
      productId: "#11223345",
      productName: "Diesel",
      zone: "Hyd-e1",
      price: "₹ 98.98",
      unit: "1 Ltr",
      updatedBy: "Akshith",
      roleId: "#11223345",
    },
    // ... other rows
  ];

  const [page, setPage] = useState(1);
  const rowsPerPage = 10; // Number of rows per page

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  // Handle saving product
  const handleSaveProduct = (productData) => {
    console.log("Product Data: ", productData);
    setProducts([...products, productData]);
    // You can now make an API call to save the product
  };
  return (
    <Box sx={{ p: 2 }}>
      {/* Title */}
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

      {/* Filters */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="subtitle1">Home / Products</Typography>
        <Button variant="contained" onClick={() => setAddProductOpen(true)}>
          Add Product
        </Button>
      </Box>

      <Grid container spacing={2} mb={2}>
        <Grid item>
          <Select displayEmpty defaultValue="">
            <MenuItem value="">Date</MenuItem>
            {/* Other filter options */}
          </Select>
        </Grid>
        <Grid item>
          <Select displayEmpty defaultValue="">
            <MenuItem value="">Product</MenuItem>
            {/* Other filter options */}
          </Select>
        </Grid>
        {/* More filters: State, City, Zone */}
      </Grid>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table aria-label="Price History Table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Product ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Zone</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Updated By</TableCell>
              <TableCell>Role ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice((page - 1) * rowsPerPage, page * rowsPerPage)
              .map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.productId}</TableCell>
                  <TableCell>{row.productName}</TableCell>
                  <TableCell>{row.zone}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.updatedBy}</TableCell>
                  <TableCell>{row.roleId}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.ceil(rows.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
        />
      </Box>
      {/* Add Product Modal */}
      <AddProductModal
        open={addProductOpen}
        handleClose={() => setAddProductOpen(false)}
        handleSave={handleSaveProduct}
      />
    </Box>
  );
};

export default PriceHistory;
