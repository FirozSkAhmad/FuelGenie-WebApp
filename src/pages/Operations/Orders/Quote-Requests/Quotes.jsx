import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CircularProgress,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Avatar,
  Tooltip,
  Button,
  useTheme,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  LocalGasStation as FuelIcon,
  WaterDrop as LiquidIcon,
  Storage as TankIcon,
  Science as ChemicalIcon,
  ShoppingBasket as OtherIcon,
  LocalDrink as BeverageIcon,
  Build as ToolIcon,
  Agriculture as AgricultureIcon,
  Fastfood as FoodIcon,
  LocalShipping as ShippingIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import api from "../../../../utils/api";

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const theme = useTheme();

  // Filter states
  const [customerNameFilter, setCustomerNameFilter] = useState("");
  const [productNameFilter, setProductNameFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);

  const fetchQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/operations/orders/quote-requests");
      if (
        response.data.message ===
        "Quote requests with customer details fetched successfully"
      ) {
        setQuotes(response.data.data);
      } else {
        throw new Error("Invalid response from the server");
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
      setError("Failed to fetch quotes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // Filter quotes based on filters
  const filteredQuotes = quotes.filter((quote) => {
    const customerName = `${quote.cid.fName} ${quote.cid.lName}`.toLowerCase();
    const productName = quote.productName.toLowerCase();
    const createdAt = new Date(quote.createdAt);
    const createdAtDateOnly = new Date(
      createdAt.getFullYear(),
      createdAt.getMonth(),
      createdAt.getDate()
    );

    const startDate = startDateFilter
      ? new Date(
          startDateFilter.getFullYear(),
          startDateFilter.getMonth(),
          startDateFilter.getDate()
        )
      : null;
    const endDate = endDateFilter
      ? new Date(
          endDateFilter.getFullYear(),
          endDateFilter.getMonth(),
          endDateFilter.getDate()
        )
      : null;

    return (
      customerName.includes(customerNameFilter.toLowerCase()) &&
      productName.includes(productNameFilter.toLowerCase()) &&
      (!startDate || createdAtDateOnly >= startDate) &&
      (!endDate || createdAtDateOnly <= endDate)
    );
  });

  // Pagination logic
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuotes = filteredQuotes.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Get icon based on product type
  const getProductIcon = (productName) => {
    switch (productName.toLowerCase()) {
      case "jerry cane":
      case "genie can":
        return <FuelIcon fontSize="small" />;
      case "static tank":
        return <TankIcon fontSize="small" />;
      case "glass flask":
        return <LiquidIcon fontSize="small" />;
      case "mineral turpentine oil (mto)":
        return <ChemicalIcon fontSize="small" />;
      case "beverage container":
        return <BeverageIcon fontSize="small" />;
      case "agricultural sprayer":
        return <AgricultureIcon fontSize="small" />;
      case "food packaging":
        return <FoodIcon fontSize="small" />;
      case "shipping crate":
        return <ShippingIcon fontSize="small" />;
      case "tool kit":
        return <ToolIcon fontSize="small" />;
      default:
        return <OtherIcon fontSize="small" />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" color="primary" onClick={fetchQuotes}>
          Retry
        </Button>
      </Box>
    );
  }

  if (quotes.length === 0) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography variant="h6">No quote requests found.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Title */}
      <Typography variant="h4" component="h1" gutterBottom>
        Quote Requests
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 4, alignItems: "center" }}>
        {/* Search Customer */}
        <TextField
          label="Search Customer"
          variant="outlined"
          size="large"
          value={customerNameFilter}
          onChange={(e) => setCustomerNameFilter(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Search Product */}
        <TextField
          label="Search Product"
          variant="outlined"
          size="large"
          value={productNameFilter}
          onChange={(e) => setProductNameFilter(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Start Date Filter */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={startDateFilter}
            onChange={(newValue) => setStartDateFilter(newValue)}
            renderInput={(params) => <TextField {...params} size="large" />}
          />
        </LocalizationProvider>

        {/* End Date Filter */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="End Date"
            value={endDateFilter}
            onChange={(newValue) => setEndDateFilter(newValue)}
            renderInput={(params) => <TextField {...params} size="large" />}
          />
        </LocalizationProvider>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Profile</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Business Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentQuotes.map((quote) => (
              <TableRow
                key={quote._id}
                sx={{
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <TableCell>
                  <Tooltip title={`${quote.cid.fName} ${quote.cid.lName}`}>
                    <Avatar
                      alt={`${quote.cid.fName} ${quote.cid.lName}`}
                      src={quote.cid.profileImage}
                    >
                      {!quote.cid.profileImage &&
                        `${quote.cid.fName[0]}${quote.cid.lName[0]}`}
                    </Avatar>
                  </Tooltip>
                </TableCell>
                <TableCell>{getProductIcon(quote.productName)}</TableCell>
                <TableCell>{quote.productName}</TableCell>
                <TableCell>
                  {quote.cid.fName} {quote.cid.lName}
                </TableCell>
                <TableCell>{quote.cid.businessName}</TableCell>
                <TableCell>{quote.cid.phoneNumber}</TableCell>
                <TableCell>{quote.cid.email}</TableCell>
                <TableCell>
                  {quote.cid.businessAddress.addressLine},{" "}
                  {quote.cid.businessAddress.city},{" "}
                  {quote.cid.businessAddress.state},{" "}
                  {quote.cid.businessAddress.pincode},{" "}
                  {quote.cid.businessAddress.country}
                </TableCell>
                <TableCell>
                  {new Date(quote.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={Math.ceil(filteredQuotes.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default Quotes;
