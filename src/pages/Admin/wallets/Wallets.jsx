import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  CircularProgress,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";

const Wallets = () => {
  const [customers, setCustomers] = useState([]);
  const [customerType, setCustomerType] = useState("INDIVIDUAL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch customers based on type
  const fetchCustomers = async (type) => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/admin/wallets/get-customers`, {
        params: { type },
      });
      if (response.status === 200) {
        setCustomers(response.data.data); // Accessing the `data` field from the response
      } else {
        setError(response.data.message || "Error fetching customers.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(customerType);
  }, [customerType]);

  const handleTabChange = (event, newValue) => {
    setCustomerType(newValue);
  };

  const handleRowClick = (customerId) => {
    navigate(`/admin/wallets/wallet-details/${customerId}`); // Redirect to wallet details page with customer ID
  };

  return (
    <Card style={{ padding: "16px", marginTop: "16px" }}>
      <BreadcrumbNavigation />
      <Typography variant="h5" gutterBottom>
        Wallet Customers
      </Typography>

      {/* Tabs for customer type */}
      <Tabs
        value={customerType}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        style={{ marginBottom: "16px" }}
      >
        <Tab value="INDIVIDUAL" label="Individual" />
        <Tab value="BUSINESS" label="Business" />
      </Tabs>

      {/* Loader */}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ height: "200px" }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : customers.length === 0 ? (
        <Typography align="center" style={{ marginTop: "20px" }}>
          No data available.
        </Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer ID</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Contact Number</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Customer Type</TableCell>
                <TableCell>PAN Card</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow
                  key={customer.customerId}
                  onClick={() => handleRowClick(customer.customerId)} // Attach click event
                  style={{ cursor: "pointer" }} // Add pointer cursor for better UX
                >
                  <TableCell>{customer.customerId}</TableCell>
                  <TableCell>{customer.customerName || "N/A"}</TableCell>
                  <TableCell>{customer.contactNumber}</TableCell>
                  <TableCell>{customer.mailId}</TableCell>
                  <TableCell>{customer.customerType}</TableCell>
                  <TableCell>{customer.panCardNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Card>
  );
};

export default Wallets;
