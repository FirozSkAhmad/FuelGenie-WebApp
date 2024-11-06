import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Pagination,
  Grid,
  Select,
  MenuItem,
} from "@mui/material";
import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";
const PriceHistory = () => {
  const [priceHistoryData, setPriceHistoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Filter states
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const navigate = useNavigate();
  // Fetch all data on initial load
  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        const response = await api.get(
          "/products/price-history/all-price-history"
        );
        if (response.data.status === 200) {
          setPriceHistoryData(response.data.data);
          setFilteredData(response.data.data); // Initially, all data is displayed
        } else {
          console.error("Failed to fetch price history data");
        }
      } catch (error) {
        console.error("Error fetching price history:", error);
      }
    };
    fetchPriceHistory();
  }, []);

  // Apply filters whenever a filter changes
  useEffect(() => {
    const applyFilters = () => {
      let data = [...priceHistoryData];

      if (selectedDate) {
        data = data.filter(
          (item) =>
            new Date(item.updatedAt).toLocaleDateString() === selectedDate
        );
      }
      if (selectedProduct) {
        data = data.filter((item) => item.productName === selectedProduct);
      }
      if (selectedState) {
        data = data.filter((item) => item.state === selectedState);
      }
      if (selectedCity) {
        data = data.filter((item) => item.city === selectedCity);
      }
      if (selectedZone) {
        data = data.filter((item) => item.zone === selectedZone);
      }

      setFilteredData(data);
      setPage(1); // Reset to first page when filters change
    };

    applyFilters();
  }, [
    selectedDate,
    selectedProduct,
    selectedState,
    selectedCity,
    selectedZone,
    priceHistoryData,
  ]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const goToDetailPage = (productId, zoneId) => {
    navigate(`/products/price-history-by-zone-product/${zoneId}/${productId}`);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Title */}
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

      {/* Breadcrumb */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="subtitle1">Home / Products</Typography>
      </Box>

      {/* Filters */}
      <Grid container spacing={2} mb={2}>
        <Grid item>
          <Select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">Date</MenuItem>
            {/* Populate with unique dates from priceHistoryData */}
            {Array.from(
              new Set(
                priceHistoryData.map((item) =>
                  new Date(item.updatedAt).toLocaleDateString()
                )
              )
            ).map((date) => (
              <MenuItem key={date} value={date}>
                {date}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item>
          <Select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">Product</MenuItem>
            {/* Populate with unique products from priceHistoryData */}
            {Array.from(
              new Set(priceHistoryData.map((item) => item.productName))
            ).map((product) => (
              <MenuItem key={product} value={product}>
                {product}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item>
          <Select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">State</MenuItem>
            {Array.from(
              new Set(priceHistoryData.map((item) => item.state))
            ).map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item>
          <Select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">City</MenuItem>
            {Array.from(new Set(priceHistoryData.map((item) => item.city))).map(
              (city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              )
            )}
          </Select>
        </Grid>
        <Grid item>
          <Select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">Zone</MenuItem>
            {Array.from(new Set(priceHistoryData.map((item) => item.zone))).map(
              (zone) => (
                <MenuItem key={zone} value={zone}>
                  {zone}
                </MenuItem>
              )
            )}
          </Select>
        </Grid>
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
              <TableCell>Previous Price</TableCell>
              <TableCell>Updated Price</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Previous GST (%)</TableCell>
              <TableCell>Updated GST (%)</TableCell>
              <TableCell>Updated By</TableCell>
              <TableCell>Role Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice((page - 1) * rowsPerPage, page * rowsPerPage)
              .map((row, index) => (
                <TableRow
                  key={index}
                  onClick={() => goToDetailPage(row.productId, row.zoneId)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>
                    {new Date(row.updatedAt).toLocaleString()}
                  </TableCell>
                  <TableCell>{row.productId}</TableCell>
                  <TableCell>{row.productName}</TableCell>
                  <TableCell>{row.zone}</TableCell>
                  <TableCell>{`₹ ${row.previousPrice}`}</TableCell>
                  <TableCell>{`₹ ${row.updatedPrice}`}</TableCell>
                  <TableCell>{row.updatedUnit || "N/A"}</TableCell>
                  <TableCell>{row.previousGstPercentage}%</TableCell>
                  <TableCell>{row.updatedGstPercentage}%</TableCell>
                  <TableCell>{row.updatedBy}</TableCell>
                  <TableCell>{row.roleType}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.ceil(filteredData.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
        />
      </Box>
    </Box>
  );
};

export default PriceHistory;
