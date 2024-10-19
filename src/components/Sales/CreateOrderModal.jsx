import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Tabs,
  Tab,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

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

const CreateOrderModal = ({ open, handleClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false); // For toggling new/existing customer
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    calculateTotal();
  }, [selectedProducts]);

  // Handle tab navigation
  const handleNext = () => setActiveTab((prev) => prev + 1);
  const handleBack = () => setActiveTab((prev) => prev - 1);

  // Customer search & selection logic
  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setCustomerDetails(customer);
    if (customer.addresses.length > 0) {
      setDeliveryAddress(customer.addresses[0]);
    }
  };

  const handleAddProduct = (product) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.name === product.name);
      if (exists) {
        return prev.map((p) =>
          p.name === product.name ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveProduct = (product) => {
    setSelectedProducts((prev) =>
      prev
        .map((p) =>
          p.name === product.name && p.quantity > 1
            ? { ...p, quantity: p.quantity - 1 }
            : p
        )
        .filter((p) => p.quantity > 0)
    );
  };

  const calculateTotal = () => {
    const total = selectedProducts.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    setTotalAmount(total);
  };

  // Handle tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Box>
            <h4>Customer Details</h4>
            <FormControl fullWidth>
              <InputLabel>Choose Customer</InputLabel>
              <Select
                fullWidth
                value={selectedCustomer?.name || ""}
                onChange={(e) => {
                  const customer = customers.find(
                    (cust) => cust.name === e.target.value
                  );
                  handleCustomerSelect(customer);
                  setIsNewCustomer(false);
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
            <Button
              onClick={() => {
                setCustomerDetails({
                  name: "",
                  email: "",
                  phone: "",
                });
                setSelectedCustomer(null);
                setIsNewCustomer(true);
              }}
              sx={{ mt: 2 }}
            >
              Add New Customer
            </Button>

            <Box mt={2}>
              <TextField
                label="Customer Name"
                fullWidth
                value={customerDetails.name}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    name: e.target.value,
                  })
                }
                disabled={!isNewCustomer && !!selectedCustomer}
              />
              <TextField
                label="Email"
                fullWidth
                value={customerDetails.email}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    email: e.target.value,
                  })
                }
                disabled={!isNewCustomer && !!selectedCustomer}
                sx={{ mt: 2 }}
              />
              <TextField
                label="Phone"
                fullWidth
                value={customerDetails.phone}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    phone: e.target.value,
                  })
                }
                disabled={!isNewCustomer && !!selectedCustomer}
                sx={{ mt: 2 }}
              />
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box>
            <h4>Delivery Location</h4>
            {selectedCustomer && selectedCustomer.addresses.length > 0 ? (
              <FormControl fullWidth>
                <InputLabel>Select Address</InputLabel>
                <Select
                  fullWidth
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                >
                  {selectedCustomer.addresses.map((address) => (
                    <MenuItem key={address} value={address}>
                      {address}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                label="New Address"
                fullWidth
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
            )}
            <Button onClick={() => setNewAddress("")} sx={{ mt: 2 }}>
              Add New Address
            </Button>
          </Box>
        );
      case 2:
        return (
          <Box>
            <h4>Products</h4>
            {productsList.map((product) => (
              <Box
                key={product.name}
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <Button
                  variant="outlined"
                  sx={{ flex: 1 }}
                  onClick={() => handleAddProduct(product)}
                >
                  {product.name} (${product.price})
                </Button>
                <IconButton
                  onClick={() => handleRemoveProduct(product)}
                  disabled={
                    !selectedProducts.find((p) => p.name === product.name)
                  }
                >
                  <RemoveIcon />
                </IconButton>
                <IconButton onClick={() => handleAddProduct(product)}>
                  <AddIcon />
                </IconButton>
              </Box>
            ))}
            <Box mt={2}>
              <h5>Selected Products:</h5>
              {selectedProducts.map((product) => (
                <Box key={product.name}>
                  {product.name} - {product.quantity}x = $
                  {product.price * product.quantity}
                </Box>
              ))}
              <h4>Total Amount: ${totalAmount}</h4>
            </Box>
          </Box>
        );
      case 3:
        return (
          <Box>
            <h4>Payment</h4>
            <h5>Total Amount: ${totalAmount}</h5>
            <FormControl fullWidth>
              <InputLabel>Payment Status</InputLabel>
              <Select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
              >
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Unpaid">Unpaid</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );
      default:
        return null;
    }
  };

  const handleSubmit = () => {
    // Handle order submission here
    console.log(
      {
        customerDetails,
        deliveryAddress,
        selectedProducts,
        totalAmount,
        paymentStatus,
      },
      "Created Order"
    );
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Order</DialogTitle>
      <DialogContent>{renderTabContent()}</DialogContent>
      <DialogActions>
        <Button onClick={handleBack} disabled={activeTab === 0}>
          Back
        </Button>
        {activeTab < 3 ? (
          <Button onClick={handleNext} color="primary">
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreateOrderModal;
