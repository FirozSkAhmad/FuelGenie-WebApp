import React, { useState } from "react";
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
  FormControl,
  FormLabel,
  Checkbox,
} from "@mui/material";
import api from "../../../utils/api";

const DeliveryDetails = ({
  shippingAddresses,
  selectedShippingAddress,
  setSelectedShippingAddress,
  timeSlots,
  selectedTimeSlot,
  setSelectedTimeSlot,
  customerId,
  customerDetails,
  fetchShippingAddresses,
  billingAddresses,
  selectedBillingAddress,
  setSelectedBillingAddress,
  sameBillingAddress,
  setSameBillingAddress,
  fetchBillingAddresses,
}) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [openAddAddressDialog, setOpenAddAddressDialog] = useState(false);
  const [newAddress, setNewAddress] = useState({
    coordinates: { latitude: 0, longitude: 0 },
    flatOrHouseNo: "",
    area: "",
    landmark: "",
    savedAs: "OTHER",
    customName: "",
    receiverName: "",
    receiverContact: "",
    completeAddress: "",
    state: "",
    city: "",
    pincode: "",
    country: "India",
  });
  const [openAddBillingDialog, setOpenAddBillingDialog] = useState(false);
  const [newBillingAddress, setNewBillingAddress] = useState({
    flatOrHouseNo: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const cid = customerDetails.cid;

  // Filter slots for the selected date
  const filteredSlots =
    timeSlots.find((slot) => slot.date === selectedDate)?.slots || [];

  // Handle adding a new shipping address
  const handleAddAddress = async () => {
    try {
      const response = await api.post(
        `/operations/orders/add-shipping-address/${cid}`,
        newAddress
      );
      console.log("Address added successfully:", response.data);

      // Fetch the updated list of shipping addresses
      fetchShippingAddresses(cid);
      // Close the dialog
      setOpenAddAddressDialog(false);
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };
  const handleAddBillingAddress = async () => {
    try {
      await api.post(
        `/operations/orders/add-billing-address/${cid}`,
        newBillingAddress
      );
      fetchBillingAddresses(cid);
      setOpenAddBillingDialog(false);
    } catch (error) {
      console.error("Error adding billing address:", error);
    }
  };
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Delivery Details
      </Typography>

      {/* Shipping Address Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend">Shipping Address</FormLabel>
          <RadioGroup
            value={selectedShippingAddress}
            onChange={(e) => setSelectedShippingAddress(e.target.value)}
          >
            {shippingAddresses.map((address) => (
              <FormControlLabel
                key={address.addressId}
                value={address.addressId}
                control={<Radio />}
                label={`${address.completeAddress} (${address.savedAs})`}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAddAddressDialog(true)}
          sx={{ mt: 2 }}
        >
          Add New Address
        </Button>
      </Paper>

      {/* Billing Address Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={sameBillingAddress}
              onChange={(e) => {
                setSameBillingAddress(e.target.checked);
                if (e.target.checked) {
                  setSelectedBillingAddress(selectedShippingAddress);
                }
              }}
            />
          }
          label="Use same address for billing"
        />

        {!sameBillingAddress && (
          <>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Billing Address</FormLabel>
              <RadioGroup
                value={selectedBillingAddress}
                onChange={(e) => setSelectedBillingAddress(e.target.value)}
              >
                {billingAddresses.map((address) => (
                  <FormControlLabel
                    key={address.bid} // Use bid as the unique key
                    value={address.bid} // Use bid as the value
                    control={<Radio />}
                    label={`${address.flatOrHouseNo}, ${address.area}, ${address.city}, ${address.state}, ${address.pincode}, ${address.country}`}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenAddBillingDialog(true)}
              sx={{ mt: 2 }}
            >
              Add New Billing Address
            </Button>
          </>
        )}
      </Paper>

      {/* Delivery Time Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          margin="normal"
          type="date"
          label="Delivery Date"
          InputLabelProps={{ shrink: true }}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        {selectedDate && (
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">Time Slot</FormLabel>
            <RadioGroup
              value={selectedTimeSlot}
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
            >
              {filteredSlots.map((slot) => (
                <FormControlLabel
                  key={slot.slotId}
                  value={slot.slotId}
                  control={<Radio />}
                  label={`${slot.fromTime} - ${slot.toTime}`}
                  disabled={!slot.isAvailable}
                />
              ))}
            </RadioGroup>
          </FormControl>
        )}
      </Paper>

      {/* Dialog for adding a new shipping address */}
      <Dialog
        open={openAddAddressDialog}
        onClose={() => setOpenAddAddressDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Shipping Address</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Flat/House No"
                value={newAddress.flatOrHouseNo}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    flatOrHouseNo: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Area"
                value={newAddress.area}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, area: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Landmark"
                value={newAddress.landmark}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, landmark: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Custom Name"
                value={newAddress.customName}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, customName: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Receiver Name"
                value={newAddress.receiverName}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, receiverName: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Receiver Contact"
                value={newAddress.receiverContact}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    receiverContact: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Complete Address"
                value={newAddress.completeAddress}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    completeAddress: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="State"
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, state: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="City"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Pincode"
                value={newAddress.pincode}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, pincode: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Country"
                value={newAddress.country}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, country: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={sameBillingAddress}
                onChange={(e) => {
                  setSameBillingAddress(e.target.checked);
                  if (e.target.checked) {
                    setSelectedBillingAddress(selectedShippingAddress);
                  }
                }}
              />
            }
            label="Use same address for billing"
          />

          {!sameBillingAddress && (
            <>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Billing Address</FormLabel>
                <RadioGroup
                  value={selectedBillingAddress}
                  onChange={(e) => setSelectedBillingAddress(e.target.value)}
                >
                  {billingAddresses.map((address) => (
                    <FormControlLabel
                      key={address.addressId}
                      value={address.addressId}
                      control={<Radio />}
                      label={address.completeAddress}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenAddBillingDialog(true)}
                sx={{ mt: 2 }}
              >
                Add New Billing Address
              </Button>
            </>
          )}
        </Paper>

        <DialogActions>
          <Button onClick={() => setOpenAddAddressDialog(false)}>Cancel</Button>
          <Button onClick={handleAddAddress} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* Billing Address Dialog */}
      <Dialog
        open={openAddBillingDialog}
        onClose={() => setOpenAddBillingDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Billing Address</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Flat/House No"
                value={newBillingAddress.flatOrHouseNo}
                onChange={(e) =>
                  setNewBillingAddress({
                    ...newBillingAddress,
                    flatOrHouseNo: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Area"
                value={newBillingAddress.area}
                onChange={(e) =>
                  setNewBillingAddress({
                    ...newBillingAddress,
                    area: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Landmark"
                value={newBillingAddress.landmark}
                onChange={(e) =>
                  setNewBillingAddress({
                    ...newBillingAddress,
                    landmark: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="City"
                value={newBillingAddress.city}
                onChange={(e) =>
                  setNewBillingAddress({
                    ...newBillingAddress,
                    city: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="State"
                value={newBillingAddress.state}
                onChange={(e) =>
                  setNewBillingAddress({
                    ...newBillingAddress,
                    state: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Pincode"
                value={newBillingAddress.pincode}
                onChange={(e) =>
                  setNewBillingAddress({
                    ...newBillingAddress,
                    pincode: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Country"
                value={newBillingAddress.country}
                onChange={(e) =>
                  setNewBillingAddress({
                    ...newBillingAddress,
                    country: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddBillingDialog(false)}>Cancel</Button>
          <Button onClick={handleAddBillingAddress} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeliveryDetails;
