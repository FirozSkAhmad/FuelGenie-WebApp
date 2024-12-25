import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  CircularProgress,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from "@mui/material";
import api from "../../../utils/api";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";

const WalletDetails = () => {
  const { customerId } = useParams();
  const [walletDetails, setWalletDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ type: "", status: "" });

  useEffect(() => {
    const fetchWalletDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(
          `/admin/wallets/get-wallet-details/${customerId}`
        );
        if (response.status === 200) {
          setWalletDetails(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch wallet details.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "An error occurred. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchWalletDetails();
  }, [customerId]);
  const formatDate = (dateString) => {
    if (!dateString) {
      return "Invalid Date"; // Return a fallback value if the date is undefined or empty
    }

    // Replace space with 'T' for ISO format, only if the date is not empty
    const formattedDate = dateString.replace(" ", "T");

    const parsedDate = new Date(formattedDate);

    if (isNaN(parsedDate)) {
      return "Invalid Date"; // Return a fallback value if the date is invalid
    }

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(parsedDate);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const filteredTransactions = walletDetails?.transactions.filter(
    (transaction) =>
      (!filters.type || transaction.type === filters.type) &&
      (!filters.status || transaction.status === filters.status)
  );

  return (
    <Card style={{ padding: "16px", marginTop: "16px" }}>
      <BreadcrumbNavigation />
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : (
        walletDetails && (
          <div>
            <CardContent>
              <Typography
                variant="h5"
                gutterBottom
                align="center"
                style={{ fontWeight: 600 }}
              >
                Wallet Details for Customer {customerId}
              </Typography>

              <Grid container spacing={3}>
                {/* Customer Information */}
                <Grid item xs={12} sm={6}>
                  <Card
                    variant="outlined"
                    style={{ padding: "16px", borderRadius: "8px" }}
                  >
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      style={{ fontWeight: 500 }}
                    >
                      <strong>Name:</strong>
                    </Typography>
                    <Typography variant="h6" style={{ fontWeight: 500 }}>
                      {walletDetails.customerName || "N/A"}
                    </Typography>

                    <Typography
                      variant="body1"
                      color="textSecondary"
                      style={{ fontWeight: 500 }}
                    >
                      <strong>Contact Number:</strong>
                    </Typography>
                    <Typography variant="h6" style={{ fontWeight: 500 }}>
                      {walletDetails.contactNumber}
                    </Typography>

                    <Typography
                      variant="body1"
                      color="textSecondary"
                      style={{ fontWeight: 500 }}
                    >
                      <strong>Email:</strong>
                    </Typography>
                    <Typography variant="h6" style={{ fontWeight: 500 }}>
                      {walletDetails.mailId}
                    </Typography>
                  </Card>
                </Grid>

                {/* Wallet and PAN Details */}
                <Grid item xs={12} sm={6}>
                  <Card
                    variant="outlined"
                    style={{ padding: "16px", borderRadius: "8px" }}
                  >
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      style={{ fontWeight: 500 }}
                    >
                      <strong>Customer Type:</strong>
                    </Typography>
                    <Typography variant="h6" style={{ fontWeight: 500 }}>
                      {walletDetails.customerType}
                    </Typography>

                    <Typography
                      variant="body1"
                      color="textSecondary"
                      style={{ fontWeight: 500 }}
                    >
                      <strong>PAN Card:</strong>
                    </Typography>
                    <Typography variant="h6" style={{ fontWeight: 500 }}>
                      {walletDetails.panCardNumber}
                    </Typography>

                    <Typography
                      variant="body1"
                      color="textSecondary"
                      style={{ fontWeight: 500 }}
                    >
                      <strong>Wallet Balance:</strong>
                    </Typography>
                    <Typography
                      variant="h6"
                      style={{ fontWeight: 500, color: "#4caf50" }}
                    >
                      ₹{walletDetails.walletBalance}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>

            <Card style={{ marginTop: "16px", padding: "16px" }}>
              <Typography variant="h6" gutterBottom>
                Transactions
              </Typography>

              {/* Filters */}
              <Box display="flex" gap={2} marginBottom="16px">
                <TextField
                  label="Filter by Type"
                  select
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                  fullWidth
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="CREDIT">Credit</MenuItem>
                  <MenuItem value="DEBIT">Debit</MenuItem>
                </TextField>
                <TextField
                  label="Filter by Status"
                  select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  fullWidth
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="captured">Success</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                </TextField>
              </Box>

              {/* Transactions Table */}
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Transaction ID</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTransactions?.length > 0 ? (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.transactionId}>
                          <TableCell>{transaction.transactionId}</TableCell>
                          <TableCell>
                            {formatDate(transaction.transactionDate)}
                          </TableCell>
                          <TableCell>₹{transaction.amount}</TableCell>
                          <TableCell>{transaction.type}</TableCell>
                          <TableCell>{transaction.status}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No transactions available.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </div>
        )
      )}
    </Card>
  );
};

export default WalletDetails;
