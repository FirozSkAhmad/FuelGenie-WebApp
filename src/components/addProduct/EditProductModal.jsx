import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Button,
  IconButton,
  Grid,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import api from "../../utils/api"; // Import your API utility
import { toast } from "react-toastify"; // Import toast for notifications

const EditProductModal = ({ open, onClose, product, onSave }) => {
  const [productName, setProductName] = useState(product.name || "");
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(product.price || "");
  const [units, setUnits] = useState(product.units || "");
  const [gst, setGst] = useState(product.gstPercentage || 0); // Default to 0
  const [mediaFiles, setMediaFiles] = useState(product.media || []);
  const [mediaToDelete, setMediaToDelete] = useState([]); // Track media URLs to delete
  const [errors, setErrors] = useState({}); // State for validation errors

  useEffect(() => {
    // Initialize with current product data
    if (product) {
      setProductName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setUnits(product.units);
      setGst(product.gstPercentage || 0); // Default to 0 if undefined
      setMediaFiles(product.media || []);
      setMediaToDelete([]); // Reset mediaToDelete on product change
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};
    if (!productName) newErrors.productName = "Product name is required.";
    if (!description) newErrors.description = "Description is required.";
    if (!price) newErrors.price = "Price is required.";
    if (isNaN(price) || Number(price) < 0) {
      newErrors.price = "Price must be a positive number.";
    }
    if (!units) newErrors.units = "Units are required.";
    if (!units) {
      newErrors.units = "Unit is required";
    }
    if (isNaN(gst) || Number(gst) < 0) {
      newErrors.gst = "GST must be a positive number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files);
    const newMediaFiles = files.map((file) => ({
      preview: URL.createObjectURL(file),
      file,
    }));
    setMediaFiles([...mediaFiles, ...newMediaFiles]);
  };

  const handleRemoveMedia = (index) => {
    const mediaToRemove = mediaFiles[index];
    if (mediaToRemove.file) {
      // It's a new file, just remove it from mediaFiles
      setMediaFiles(mediaFiles.filter((_, i) => i !== index));
    } else {
      // It's an existing file, add it to mediaToDelete
      setMediaToDelete([...mediaToDelete, mediaToRemove]);
      setMediaFiles(mediaFiles.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return; // Validate the form

    const userName = localStorage.getItem("userName");
    const roleId = localStorage.getItem("roleId");

    // Create a FormData object to send the updated product
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("units", units);
    formData.append("gstPercentage", gst);

    // Append media files to the FormData object
    mediaFiles.forEach((media) => {
      if (media.file) {
        formData.append("media", media.file); // Ensure "media" is the correct field name
      }
    });

    // Add userId and userRole to the FormData object
    formData.append("userId", userName);
    formData.append("userRole", roleId);

    // Include media to delete in the request body
    formData.append("mediaToDelete", JSON.stringify(mediaToDelete)); // Convert to JSON string if necessary

    try {
      // Call your API to update the product
      await api.patch(
        `/products/zone-prod-mgr/edit-product/${product.zoneId}/${product.productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Notify the user of success
      toast.success("Product updated successfully!");

      // Call the save handler to update the parent component
      onSave();

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error updating product. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>Edit Product</Grid>
          <Grid item>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Product Name"
              fullWidth
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              error={!!errors.productName}
              helperText={errors.productName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Price"
              fullWidth
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              error={!!errors.price}
              helperText={errors.price}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Units"
              fullWidth
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              error={!!errors.units}
              helperText={errors.units}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Media (Multiple)</Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              fullWidth
            >
              Upload media
              <input type="file" multiple hidden onChange={handleMediaUpload} />
            </Button>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {mediaFiles.map((media, index) => (
                <Grid item xs={3} key={index} sx={{ position: "relative" }}>
                  <img
                    src={media.file ? media.preview : media} // Use preview for new, URL for existing
                    alt="preview"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "5px",
                    }}
                  />
                  <IconButton
                    onClick={() => handleRemoveMedia(index)}
                    sx={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      backgroundColor: "rgba(255,255,255,0.8)",
                    }}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="GST %"
              fullWidth
              value={gst}
              onChange={(e) => setGst(e.target.value || 0)} // Default to 0 if empty
              error={!!errors.gst}
              helperText={errors.gst}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductModal;
