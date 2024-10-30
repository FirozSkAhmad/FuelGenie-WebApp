import React, { useEffect, useState } from "react";
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
  Box,
  Pagination,
  Alert,
} from "@mui/material";
import { useParams } from "react-router-dom";
import api from "../../../utils/api";

const PriceHistoryByProduct = () => {
  const [priceHistory, setPriceHistory] = useState([]);
  const [productName, setProductName] = useState("");
  const [currentPrice, setCurrentPrice] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { zoneId, productId } = useParams();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        const response = await api.get(
          `/products/price-history-by-zone-product/${zoneId}/${productId}`
        );
        const data = response.data.data;
        setPriceHistory(data);

        // Set product name and current price if data is available
        if (data.length > 0) {
          setProductName(data[0].productName);
          setCurrentPrice(data[0].updatedPrice);
          setCurrentDate(data[0].updatedAt);
        }
      } catch (err) {
        setError("Failed to fetch price history");
      } finally {
        setLoading(false);
      }
    };

    fetchPriceHistory();
  }, [zoneId, productId]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Determine the current records for pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = priceHistory.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(priceHistory.length / recordsPerPage);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );

  return (
    <TableContainer
      component={Paper}
      sx={{ marginTop: 2, boxShadow: 3, borderRadius: 2 }}
    >
      <Box padding={2} textAlign="center">
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Price History for Product: {productName}
        </Typography>
        {currentPrice !== null ? (
          <>
            <Typography variant="subtitle1" color="text.secondary">
              <strong>Current Price:</strong> ₹ {currentPrice}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Last Updated On:{" "}
              {new Date(currentDate).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </Typography>
          </>
        ) : (
          <Alert severity="info" sx={{ marginTop: 2 }}>
            No price update for product.
          </Alert>
        )}
      </Box>
      {priceHistory.length > 0 ? (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Previous Price</strong>
                </TableCell>
                <TableCell>
                  <strong>Updated Price</strong>
                </TableCell>
                <TableCell>
                  <strong>Updated By</strong>
                </TableCell>
                <TableCell>
                  <strong>Role</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentRecords.map((record) => (
                <TableRow key={record._id}>
                  <TableCell>
                    {new Date(record.updatedAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    ₹ {`${record.previousPrice} per ${record.previousUnit}`}
                  </TableCell>
                  <TableCell>
                    ₹ {`${record.updatedPrice} per ${record.updatedUnit}`}
                  </TableCell>
                  <TableCell>{record.updatedBy}</TableCell>
                  <TableCell>{record.roleType}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box display="flex" justifyContent="center" padding={2}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      ) : (
        <Alert severity="info" sx={{ margin: 2 }}>
          No price update for product.
        </Alert>
      )}
    </TableContainer>
  );
};

export default PriceHistoryByProduct;
