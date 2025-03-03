import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import CustomerDetails from "./CustomerDetails";
import DeliveryDetails from "./DeliveryDetails";
import ProductSelection from "./ProductSelection";
import PaymentSummary from "./PaymentSummary";
import api from "../../utils/api";
import AssetsSelection from "./AssetsSelection";

const CreateOrderModal = ({ open, handleClose, fetchOrders }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [approvedCustomers, setApprovedCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [customerDetails, setCustomerDetails] = useState({
    customerName: "",
    emailID: "",
    phoneNumber: "",
    cid: "",
  });
  const [products, setProducts] = useState([]);
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [billingAddresses, setBillingAddresses] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState("");
  const [selectedBillingAddress, setSelectedBillingAddress] = useState("");
  const [sameBillingAddress, setSameBillingAddress] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedAssets, setSelectedAssets] = useState([]);

  // Fetch approved customers when the modal opens
  useEffect(() => {
    if (open) {
      fetchApprovedCustomers();
    }
  }, [open]);

  // Fetch approved customers
  const fetchApprovedCustomers = async () => {
    try {
      const response = await api.get(
        "/operations/orders/get-approved-customers"
      );
      setApprovedCustomers(response.data.data);
    } catch (error) {
      console.error("Error fetching approved customers:", error);
    }
  };

  // Update customer details when a customer is selected
  useEffect(() => {
    if (selectedCustomer) {
      const customer = approvedCustomers.find(
        (cust) => cust.cid === selectedCustomer
      );
      if (customer) {
        setCustomerDetails({
          customerName: customer.customerName,
          emailID: customer.emailID,
          phoneNumber: customer.phoneNumber,
          cid: customer.cid,
        });
      }
    }
  }, [selectedCustomer, approvedCustomers]);

  // Fetch products, shipping addresses, and time slots when a customer is selected
  useEffect(() => {
    if (selectedCustomer) {
      fetchProducts(selectedCustomer);
      fetchShippingAddresses(selectedCustomer);
      fetchBillingAddresses(selectedCustomer);
      fetchTimeSlots();
    }
  }, [selectedCustomer]);

  const fetchProducts = async (cid) => {
    try {
      const response = await api.get(`/operations/orders/get-products/${cid}`);
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchShippingAddresses = async (cid) => {
    try {
      const response = await api.get(
        `/operations/orders/get-shipping-addresses/${cid}`
      );
      setShippingAddresses(response.data.data);
    } catch (error) {
      console.error("Error fetching shipping addresses:", error);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      const response = await api.get(
        "/operations/orders/time-slots/next-7-days"
      );
      setTimeSlots(response.data.data);
    } catch (error) {
      console.error("Error fetching time slots:", error);
    }
  };

  // Add billing address fetch function
  const fetchBillingAddresses = async (cid) => {
    try {
      const response = await api.get(
        `/operations/orders/get-billing-address/${cid}`
      );
      setBillingAddresses(response.data.data);
    } catch (error) {
      console.error("Error fetching billing addresses:", error);
    }
  };

  const handleSubmit = async () => {
    const orderData = {
      assetIds: selectedAssets,
      paymentMethod,
      productId: selectedProducts[0]?.productId,
      quantity: selectedProducts[0]?.quantity,
      shippingAddressId: selectedShippingAddress,
      billingAddressId: sameBillingAddress
        ? selectedShippingAddress
        : selectedBillingAddress,
      slotId: selectedTimeSlot,
    };

    try {
      const response = await api.post(
        `/operations/orders/create-order/${selectedCustomer}`,
        orderData
      );
      console.log("Order created:", response.data);

      // Call fetchOrders to refresh the orders list in the parent component

      handleClose(); // Close the modal
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Order</DialogTitle>
      <Tabs
        value={activeTab}
        onChange={(e, newTab) => setActiveTab(newTab)}
        centered
      >
        <Tab label="Customer" />
        <Tab label="Delivery" />
        <Tab label="Products" />
        <Tab label="Assets" />
        <Tab label="Payment" />
      </Tabs>
      <DialogContent>
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Customer
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Customer</InputLabel>
              <Select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                label="Select Customer"
              >
                <MenuItem value="">Select a customer</MenuItem>
                {approvedCustomers.map((customer) => (
                  <MenuItem key={customer.cid} value={customer.cid}>
                    {customer.customerName} ({customer.emailID})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedCustomer && (
              <CustomerDetails
                customerDetails={customerDetails}
                setCustomerDetails={setCustomerDetails}
              />
            )}
          </Box>
        )}
        {activeTab === 1 && (
          <DeliveryDetails
            shippingAddresses={shippingAddresses}
            selectedShippingAddress={selectedShippingAddress}
            setSelectedShippingAddress={setSelectedShippingAddress}
            timeSlots={timeSlots}
            selectedTimeSlot={selectedTimeSlot}
            setSelectedTimeSlot={setSelectedTimeSlot}
            customerId={selectedCustomer.cid}
            customerDetails={customerDetails}
            fetchShippingAddresses={fetchShippingAddresses}
            billingAddresses={billingAddresses}
            selectedBillingAddress={selectedBillingAddress}
            setSelectedBillingAddress={setSelectedBillingAddress}
            sameBillingAddress={sameBillingAddress}
            setSameBillingAddress={setSameBillingAddress}
            fetchBillingAddresses={fetchBillingAddresses}
          />
        )}
        {activeTab === 2 && (
          <ProductSelection
            products={products}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
          />
        )}
        {activeTab === 3 && (
          <AssetsSelection
            customerId={selectedCustomer}
            selectedAssets={selectedAssets}
            setSelectedAssets={setSelectedAssets}
          />
        )}
        {activeTab === 4 && (
          <PaymentSummary
            selectedProducts={selectedProducts}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button
          disabled={activeTab === 0}
          onClick={() => setActiveTab(activeTab - 1)}
        >
          Back
        </Button>
        {activeTab === 4 ? (
          <Button onClick={handleSubmit} variant="contained">
            Make an Order
          </Button>
        ) : (
          <Button
            onClick={() => setActiveTab(activeTab + 1)}
            variant="contained"
            disabled={activeTab === 4 || !selectedCustomer}
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
