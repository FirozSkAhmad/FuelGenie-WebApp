import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Tabs,
  Tab,
  Paper,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import { useTheme } from "@mui/material/styles"; // Import useTheme hook
// Sample data for customers and products
const customers = [
  {
    name: "Varun",
    email: "varun@example.com",
    phone: "1234567890",
    addresses: ["123 Main St", "456 Elm St"],
  },
  {
    name: "Firoz",
    email: "firoz@example.com",
    phone: "9876543210",
    addresses: ["789 Oak St"],
  },
];

const productsList = [
  { name: "Diesel", price: 100 },
  { name: "MTO", price: 200 },
  { name: "Fuel Oil", price: 150 },
];
const timeSlots = [
  "9:00 AM - 12:00 PM",
  "12:00 PM - 3:00 PM",
  "3:00 PM - 6:00 PM",
  "6:00 PM - 9:00 PM",
  "9:00 PM - 9:00 AM",
];
const CreateOrderModal = ({ open, handleClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [showAddressInput, setShowAddressInput] = useState(false);

  const [newAddress, setNewAddress] = useState("");
  useEffect(() => {
    calculateTotal();
  }, [selectedProducts]);

  const handleTabChange = (event, newTab) => {
    setActiveTab(newTab);
  };
  const handleAddLocationClick = () => {
    setShowAddressInput(!showAddressInput); // Show the address input field when button is clicked
    setDeliveryAddress("");
  };
  const handleAddProduct = (product) => {
    const existingProduct = selectedProducts.find(
      (p) => p.name === product.name
    );
    const newSelectedProducts = [...selectedProducts];

    if (existingProduct) {
      existingProduct.quantity += 1; // Increase quantity by 1
    } else {
      newSelectedProducts.push({ ...product, quantity: 1 }); // Add new product with quantity 1
    }

    setSelectedProducts(newSelectedProducts);
    setTotalAmount((prevAmount) => prevAmount + product.price); // Update total amount
  };

  const handleRemoveProduct = (product) => {
    const existingProduct = selectedProducts.find(
      (p) => p.name === product.name
    );
    const newSelectedProducts = selectedProducts.filter(
      (p) => p.name !== product.name
    );

    if (existingProduct) {
      existingProduct.quantity -= 1; // Decrease quantity by 1
      if (existingProduct.quantity > 0) {
        newSelectedProducts.push(existingProduct); // Keep it in the list if quantity is still > 0
      }
      setTotalAmount((prevAmount) => prevAmount - product.price); // Update total amount
    }

    setSelectedProducts(newSelectedProducts);
  };

  const handleQuantityChange = (product, newQuantity) => {
    const existingProduct = selectedProducts.find(
      (p) => p.name === product.name
    );
    const previousQuantity = existingProduct ? existingProduct.quantity : 0;

    if (existingProduct) {
      existingProduct.quantity = newQuantity; // Update the quantity of the existing product
    } else {
      // If the product does not exist, create a new entry
      selectedProducts.push({ ...product, quantity: newQuantity });
    }

    // Update the total amount
    setTotalAmount(
      (prevAmount) =>
        prevAmount + (newQuantity - previousQuantity) * product.price
    );

    // Update the state to trigger a re-render
    setSelectedProducts([...selectedProducts]);
  };

  const calculateTotal = () => {
    const total = selectedProducts.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    setTotalAmount(total);
  };

  const handleCustomerChange = (field, value) => {
    setCustomerDetails((prev) => ({ ...prev, [field]: value }));
  };

  const renderCustomerDetails = () => (
    <Box>
      <h4>Customer Details</h4>
      <FormControl fullWidth>
        <Select
          fullWidth
          value={customerDetails.name || ""}
          onChange={(e) => {
            const selectedCustomer = customers.find(
              (cust) => cust.name === e.target.value
            );
            if (selectedCustomer) {
              setCustomerDetails({
                name: selectedCustomer.name,
                email: selectedCustomer.email,
                phone: selectedCustomer.phone,
                addresses: selectedCustomer.addresses || [],
              });
            }
          }}
          displayEmpty
        >
          <MenuItem value="">Search for an existing customer</MenuItem>
          {customers.map((customer) => (
            <MenuItem key={customer.name} value={customer.name}>
              {customer.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button onClick={() => setIsNewCustomer(true)} sx={{ mt: 2 }}>
        Add New Customer
      </Button>

      {isNewCustomer && (
        <Box mt={2}>
          {["name", "email", "phone"].map((field, idx) => (
            <TextField
              key={idx}
              label={`Customer ${
                field.charAt(0).toUpperCase() + field.slice(1)
              }`}
              fullWidth
              value={customerDetails[field]}
              onChange={(e) => handleCustomerChange(field, e.target.value)}
              disabled={!isNewCustomer && !!customerDetails.name}
              sx={{ mt: idx ? 2 : 0 }}
            />
          ))}
        </Box>
      )}
    </Box>
  );

  const renderDeliveryDetails = () => (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Delivery Location
      </Typography>
      {/* Conditionally render saved addresses if available */}
      {customerDetails.addresses &&
        customerDetails.addresses.length > 0 &&
        !showAddressInput && (
          <>
            <RadioGroup
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            >
              {customerDetails.addresses.map((address, index) => (
                <FormControlLabel
                  key={index}
                  value={address}
                  control={<Radio />}
                  label={address}
                />
              ))}
            </RadioGroup>
          </>
        )}

      {/* Button to add new address */}
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleAddLocationClick}
      >
        {!showAddressInput ? "Add New Location" : "Existing Address "}
      </Button>

      {/* Conditionally render the address input field */}
      {showAddressInput && (
        <TextField
          fullWidth
          label="Enter Address"
          variant="outlined"
          sx={{ mt: 2 }}
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
        />
      )}

      <Typography variant="h6" mt={3}>
        Delivery Slot
      </Typography>

      <Box display="flex" gap={2} mt={2}>
        <TextField
          label="Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          InputProps={{ startAdornment: <CalendarTodayIcon /> }}
        />
        <Select
          fullWidth
          value={selectedSlot || ""}
          onChange={(e) => setSelectedSlot(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">Select a delivery time slot</MenuItem>
          {timeSlots.map((slot, index) => (
            <MenuItem key={index} value={slot}>
              {slot}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );

  const renderProducts = () => {
    const theme = useTheme(); // Get current theme (light/dark)

    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Products
        </Typography>

        {/* Product List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {productsList.map((product) => {
            const selectedProduct = selectedProducts.find(
              (p) => p.name === product.name
            );
            const quantity = selectedProduct ? selectedProduct.quantity : 0;

            return (
              <Box
                key={product.name}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  border: `1px solid ${theme.palette.divider}`, // Dynamic border color
                  borderRadius: "4px",
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#424242" : "#f9f9f9", // Dark/Light mode background
                }}
              >
                <Box>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ₹{product.price}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    onClick={() => handleRemoveProduct(product)}
                    color="secondary"
                    disabled={quantity === 0} // Disable if quantity is 0
                  >
                    <RemoveIcon />
                  </IconButton>

                  {/* Displaying Quantity with Input Field */}
                  <TextField
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const newQuantity = Math.max(0, Number(e.target.value)); // Ensure quantity is not negative
                      handleQuantityChange(product, newQuantity);
                    }}
                    sx={{
                      width: "100px",
                      textAlign: "end",
                      mx: 1,
                      "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                        {
                          display: "none", // Hide arrows for Chrome/Safari
                        },
                      "& input[type=number]": {
                        MozAppearance: "textfield", // Hide arrows for Firefox
                      },
                    }} // Add some margin for styling
                    inputProps={{ min: 0 }} // Prevent negative input
                  />

                  <IconButton
                    onClick={() => handleAddProduct(product)}
                    color="primary"
                  >
                    <AddIcon />
                  </IconButton>

                  <Typography variant="body2" sx={{ mx: 2 }}>
                    Total: ₹{quantity * product.price}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Overall Total Amount */}
        <Box mt={3}>
          <Typography variant="h5">
            Total Amount for Selected Products:
          </Typography>
          <Typography variant="h6" mt={1}>
            ₹ {totalAmount}
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderPayment = () => {
    const deliveryFee = 1220; // Fixed delivery fee
    const discount = 0; // Assuming no discount
    const gst = (totalAmount * 18) / 100; // Calculate GST (18%)
    const grandTotal = totalAmount + deliveryFee + gst - discount;
    const customerWalletBalance = 1040563; // Example wallet balance

    return (
      <Box mt={4}>
        {/* Payment Section Header */}
        <Typography variant="h4" gutterBottom>
          Payment Summary
        </Typography>

        {/* Product Details Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Product Details
          </Typography>
          {selectedProducts.length > 0 ? (
            selectedProducts.map((product) => (
              <Box
                key={product.name}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body1">
                  {product.name} (x{product.quantity})
                </Typography>
                <Typography variant="body1">
                  ₹{(product.quantity * product.price).toLocaleString()}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No products selected
            </Typography>
          )}
        </Paper>

        {/* Pricing Breakdown */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Billing Details
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body1">Items Total</Typography>
            <Typography variant="body1">
              ₹{totalAmount.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body1">Delivery Fee</Typography>
            <Typography variant="body1">
              ₹{deliveryFee.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body1">Discount</Typography>
            <Typography variant="body1">
              ₹{discount.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body1">GST (18%)</Typography>
            <Typography variant="body1">₹{gst.toLocaleString()}</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
              mb: 1,
            }}
          >
            <Typography variant="h6">Grand Total</Typography>
            <Typography variant="h6">₹{grandTotal.toLocaleString()}</Typography>
          </Box>
        </Paper>

        {/* Wallet Balance */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body1" fontWeight="bold">
              Customer Wallet Balance
            </Typography>
            <Typography variant="body1" fontWeight="bold" color="primary">
              ₹{customerWalletBalance.toLocaleString()}
            </Typography>
          </Box>
        </Paper>

        {/* Payment Type Dropdown */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <FormControl fullWidth margin="normal">
            <Typography variant="h6" gutterBottom>
              Select Payment Type
            </Typography>
            <Select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              variant="outlined"
              fullWidth
            >
              <MenuItem value="COD">COD (Cash on Delivery)</MenuItem>
              <MenuItem value="Online">Online Payment</MenuItem>
              <MenuItem value="UPI">UPI</MenuItem>
              <MenuItem value="Card">Card</MenuItem>
              <MenuItem value="Wallet">Wallet</MenuItem>
            </Select>
          </FormControl>
        </Paper>
      </Box>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return renderCustomerDetails();
      case 1:
        return renderDeliveryDetails();
      case 2:
        return renderProducts();
      case 3:
        return renderPayment();
      default:
        return null;
    }
  };

  const handleSubmit = () => {
    const orderDetails = {
      customerDetails,
      deliveryAddress: newAddress || deliveryAddress, // Use newAddress if it exists, otherwise fall back to deliveryAddress
      selectedProducts,
      totalAmount,
      paymentStatus,
      deliveryDate,
      selectedSlot,
    };
    // Validation check
    const isValid = Object.values(orderDetails).every((value) => value);
    if (!isValid) {
      // Display an error message
      alert("Please fill in all required fields."); // You can replace this with a toast or other UI feedback
      return; // Prevent submission
    }
    console.log(orderDetails, "Created Order");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Order</DialogTitle>
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="Customer" />
        <Tab label="Delivery" />
        <Tab label="Products" />
        <Tab label="Payment" />
      </Tabs>
      <DialogContent>{renderTabContent()}</DialogContent>
      <DialogActions>
        <Button
          disabled={activeTab === 0}
          onClick={() => setActiveTab(activeTab - 1)}
        >
          Back
        </Button>
        {activeTab === 3 ? (
          <Button onClick={handleSubmit} variant="contained">
            Make an Order
          </Button>
        ) : (
          <Button
            onClick={() => setActiveTab(activeTab + 1)}
            variant="contained"
          >
            Next
          </Button>
        )}
        <Button onClick={handleClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateOrderModal;
