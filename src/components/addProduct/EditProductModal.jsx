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
  const [gst, setGst] = useState(product.gstPercentage || "");
  const [mediaFiles, setMediaFiles] = useState(product.media || []);

  useEffect(() => {
    // Initialize with current product data
    if (product) {
      setProductName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setUnits(product.units);
      setGst(product.gst);
      setMediaFiles(product.media || []);
    }
  }, [product]);

  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files);
    const newMediaFiles = files.map((file) => ({
      preview: URL.createObjectURL(file),
      file,
    }));
    setMediaFiles([...mediaFiles, ...newMediaFiles]);
  };

  const handleRemoveMedia = (index) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const userName = localStorage.getItem("userName");
    const roleId = localStorage.getItem("roleId");

    const updatedProduct = {
      ...product,
      name: productName,
      description,
      price,
      units,
      gst,
      media: mediaFiles,
      userId: userName,
      userRole: roleId,
    };

    try {
      // Call your API to update the product
      await api.patch(
        `/products/edit-product/${product.zoneId}/${product.productId}`,
        updatedProduct
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
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Price"
              fullWidth
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Units"
              fullWidth
              value={units}
              onChange={(e) => setUnits(e.target.value)}
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
                    src={media} // Use media.preview for image preview
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
              onChange={(e) => setGst(e.target.value)}
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
