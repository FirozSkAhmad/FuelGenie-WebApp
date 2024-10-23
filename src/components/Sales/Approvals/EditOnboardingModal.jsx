import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
  Typography,
} from "@mui/material";

const EditOnboardingModal = ({
  open,
  onClose,
  customerData,
  salesPeople,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    customerName: "",
    contactNumber: "",
    emailId: "",
    businessOrgName: "",
    businessType: "",
    firmType: "",
    secondaryContactNumber: "",
    secondaryEmailId: "",
    panNumber: "",
    gstNumber: "",
    salespersonId: "",
  });

  useEffect(() => {
    if (customerData) {
      // Populate form with existing customer data when modal opens
      setFormData({
        customerName: customerData.customerName,
        contactNumber: customerData.contactNumber,
        emailId: customerData.emailId,
        businessOrgName: customerData.businessOrgName,
        businessType: customerData.businessType,
        firmType: customerData.firmType,
        secondaryContactNumber: customerData.secondaryContactNumber,
        secondaryEmailId: customerData.secondaryEmailId,
        panNumber: customerData.panNumber,
        gstNumber: customerData.gstNumber,
        salespersonId: customerData.salespersonId,
      });
    }
  }, [customerData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Customer Onboarding Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Customer Name"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email ID"
              name="emailId"
              value={formData.emailId}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Business Organization Name"
              name="businessOrgName"
              value={formData.businessOrgName}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Business Type"
              name="businessType"
              value={formData.businessType}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Firm Type"
              name="firmType"
              value={formData.firmType}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Secondary Contact Number"
              name="secondaryContactNumber"
              value={formData.secondaryContactNumber}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Secondary Email ID"
              name="secondaryEmailId"
              value={formData.secondaryEmailId}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="PAN Number"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="GST Number"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Salesperson"
              name="salespersonId"
              value={formData.salespersonId}
              onChange={handleInputChange}
              variant="outlined"
            >
              {salesPeople.map((salesperson) => (
                <MenuItem key={salesperson.id} value={salesperson.id}>
                  {salesperson.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditOnboardingModal;
