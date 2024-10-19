import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

const AddProductModal = ({ open, handleClose, handleSave }) => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [units, setUnits] = useState("");
  const [gst, setGst] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);

  // Handle media file uploads (for multiple media files)
  const handleMediaUpload = (event) => {
    const files = event.target.files;
    setMediaFiles([...mediaFiles, ...files]);
  };

  // Handle form submission (saving the product)
  const handleSubmit = () => {
    const productData = {
      productName,
      description,
      price,
      units,
      gst,
      mediaFiles,
    };
    handleSave(productData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>Add Product</Grid>
          <Grid item>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Product Name */}
          <Grid item xs={12}>
            <TextField
              label="Product name"
              fullWidth
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Grid>

          {/* Description */}
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

          {/* Price and Units */}
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

          {/* Media Upload */}
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
          </Grid>

          {/* GST % */}
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
        <Grid container justifyContent="space-between">
          {/* Delete Button */}
          <Grid item>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => {
                // Add delete logic here
              }}
            >
              Delete
            </Button>
          </Grid>

          {/* Save Button */}
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Save
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductModal;
