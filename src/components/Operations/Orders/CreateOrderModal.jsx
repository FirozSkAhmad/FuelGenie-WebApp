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
  CircularProgress,
} from "@mui/material";
import CustomerDetails from "./CustomerDetails";
import DeliveryDetails from "./DeliveryDetails";
import ProductSelection from "./ProductSelection";
import PaymentSummary from "./PaymentSummary";
import api from "../../../utils/api";
import AssetsSelection from "./AssetsSelection";
import VerifyPaymentModal from "./VerificationModal";

const CreateOrderModal = ({ open, handleClose, fetchOrder }) => {
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
  const [isFetchingCustomers, setIsFetchingCustomers] = useState(false);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [isFetchingShippingAddresses, setIsFetchingShippingAddresses] =
    useState(false);
  const [isFetchingBillingAddresses, setIsFetchingBillingAddresses] =
    useState(false);
  const [isFetchingTimeSlots, setIsFetchingTimeSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [createdOrderData, setCreatedOrderData] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      fetchApprovedCustomers();
    }
  }, [open]);

  const fetchApprovedCustomers = async () => {
    try {
      setIsFetchingCustomers(true);
      const response = await api.get(
        "/operations/orders/get-approved-customers"
      );
      setApprovedCustomers(response.data.data);
    } catch (error) {
      console.error("Error fetching approved customers:", error);
      setError("Failed to fetch customers");
    } finally {
      setIsFetchingCustomers(false);
    }
  };

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
      setIsFetchingProducts(true);
      const response = await api.get(`/operations/orders/get-products/${cid}`);
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsFetchingProducts(false);
    }
  };

  const fetchShippingAddresses = async (cid) => {
    try {
      setIsFetchingShippingAddresses(true);
      const response = await api.get(
        `/operations/orders/get-shipping-addresses/${cid}`
      );
      setShippingAddresses(response.data.data);
    } catch (error) {
      console.error("Error fetching shipping addresses:", error);
    } finally {
      setIsFetchingShippingAddresses(false);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      setIsFetchingTimeSlots(true);
      const response = await api.get(
        "/operations/orders/time-slots/next-7-days"
      );
      setTimeSlots(response.data.data);
    } catch (error) {
      console.error("Error fetching time slots:", error);
    } finally {
      setIsFetchingTimeSlots(false);
    }
  };

  const fetchBillingAddresses = async (cid) => {
    try {
      setIsFetchingBillingAddresses(true);
      const response = await api.get(
        `/operations/orders/get-billing-address/${cid}`
      );
      setBillingAddresses(response.data.data);
    } catch (error) {
      console.error("Error fetching billing addresses:", error);
    } finally {
      setIsFetchingBillingAddresses(false);
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
      setIsSubmitting(true);
      const response = await api.post(
        `/operations/orders/create-order/${selectedCustomer}`,
        orderData
      );
      console.log("Order created:", response.data);
      setCreatedOrderData(response.data.data);
      handleClose();
      setVerifyModalOpen(true);
    } catch (error) {
      console.error("Error creating order:", error);
      setError("Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
              {isFetchingCustomers ? (
                <CircularProgress />
              ) : (
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
              )}
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
              isFetchingShippingAddresses={isFetchingShippingAddresses}
              isFetchingBillingAddresses={isFetchingBillingAddresses}
              isFetchingTimeSlots={isFetchingTimeSlots}
            />
          )}
          {activeTab === 2 && (
            <ProductSelection
              products={products}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              isFetchingProducts={isFetchingProducts}
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
              selectedAssets={selectedAssets}
              selectedShippingAddress={selectedShippingAddress}
              selectedTimeSlot={selectedTimeSlot}
              selectedBillingAddress={selectedBillingAddress}
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
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Make an Order"}
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
      <VerifyPaymentModal
        open={verifyModalOpen}
        handleClose={() => setVerifyModalOpen(false)}
        OrderData={createdOrderData}
        onVerificationSuccess={fetchOrder}
      />
    </>
  );
};

export default CreateOrderModal;
