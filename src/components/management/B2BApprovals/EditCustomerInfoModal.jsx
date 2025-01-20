import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { Person, Home } from "@mui/icons-material";

const EditCustomerInfoModal = ({
  editMode,
  handleCancelEdit,
  updatedCustomer,
  handleInputChange,
  handleSaveCustomerInfo,
}) => {
  return (
    <Dialog open={editMode} onClose={handleCancelEdit} fullWidth maxWidth="md">
      <DialogTitle>Edit Customer Details</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          <Person
            fontSize="small"
            style={{ marginRight: "10px", verticalAlign: "middle" }}
          />
          Basic Information
        </Typography>
        <TextField
          name="fullName"
          label="Full Name"
          value={updatedCustomer.fullName || ""}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          name="email"
          label="Email"
          value={updatedCustomer.email || ""}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          name="phoneNumber"
          label="Phone Number"
          value={updatedCustomer.phoneNumber || ""}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          name="businessName"
          label="Business Name"
          value={updatedCustomer.businessName || ""}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="businessContactNumber"
          label="Business Contact Number"
          value={updatedCustomer.businessContactNumber || ""}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="businessEmail"
          label="Business Email"
          value={updatedCustomer.businessEmail || ""}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Typography variant="h6" gutterBottom style={{ marginTop: "20px" }}>
          <Home
            fontSize="small"
            style={{ marginRight: "10px", verticalAlign: "middle" }}
          />
          Business Address
        </Typography>
        <TextField
          name="businessAddress.addressLine"
          label="Address Line"
          value={updatedCustomer.businessAddress?.addressLine || ""}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="businessAddress.city"
          label="City"
          value={updatedCustomer.businessAddress?.city || ""}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="businessAddress.state"
          label="State"
          value={updatedCustomer.businessAddress?.state || ""}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="businessAddress.pincode"
          label="Pincode"
          value={updatedCustomer.businessAddress?.pincode || ""}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="businessAddress.country"
          label="Country"
          value={updatedCustomer.businessAddress?.country || ""}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelEdit} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSaveCustomerInfo} color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCustomerInfoModal;
