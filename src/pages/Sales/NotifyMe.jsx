import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Breadcrumbs,
  Link,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  CloudDownload as CloudDownloadIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";

const NotifyMe = () => {
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for date filter menu
  const [dateAnchorEl, setDateAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);

  // Sample data
  const salesData = [
    {
      date: "05-07-2024 7:00",
      customerId: "#11223",
      customerName: "Varun",
      contactNo: "9999999999",
      emailId: "test@gmail.com",
      productName: "MTO",
      productId: "#22222222",
    },
    // Add more sample data here
  ];

  // Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDateClick = (event) => {
    setDateAnchorEl(event.currentTarget);
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setDateAnchorEl(null);
    setSortAnchorEl(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 3 }}
      >
        <Link color="inherit" href="/" underline="hover">
          Home
        </Link>
        <Link color="inherit" href="/sales" underline="hover">
          Sales
        </Link>
        <Typography color="primary">Notify Me</Typography>
      </Breadcrumbs>

      <Paper sx={{ width: "100%", mb: 2 }}>
        {/* Controls */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Button
            variant="outlined"
            endIcon={<KeyboardArrowDownIcon />}
            onClick={handleDateClick}
          >
            Date
          </Button>

          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton>
              <CloudDownloadIcon />
            </IconButton>
            <Button
              variant="outlined"
              endIcon={<KeyboardArrowDownIcon />}
              onClick={handleSortClick}
            >
              Newest first
            </Button>
          </Box>
        </Box>

        {/* Date Menu */}
        <Menu
          anchorEl={dateAnchorEl}
          open={Boolean(dateAnchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Last 7 days</MenuItem>
          <MenuItem onClick={handleMenuClose}>Last 30 days</MenuItem>
          <MenuItem onClick={handleMenuClose}>Custom range</MenuItem>
        </Menu>

        {/* Sort Menu */}
        <Menu
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Newest first</MenuItem>
          <MenuItem onClick={handleMenuClose}>Oldest first</MenuItem>
        </Menu>

        {/* Table */}
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "common.white",
                  }}
                >
                  Date & Time
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "common.white",
                  }}
                >
                  Customer ID
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "common.white",
                  }}
                >
                  Customer Name
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "common.white",
                  }}
                >
                  Contact No
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "common.white",
                  }}
                >
                  Email ID
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "common.white",
                  }}
                >
                  Product Name
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "common.white",
                  }}
                >
                  Product ID
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow
                    key={index}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.customerId}</TableCell>
                    <TableCell>{row.customerName}</TableCell>
                    <TableCell>{row.contactNo}</TableCell>
                    <TableCell>{row.emailId}</TableCell>
                    <TableCell>{row.productName}</TableCell>
                    <TableCell>{row.productId}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={salesData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default NotifyMe;
