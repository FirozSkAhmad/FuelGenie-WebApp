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

  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files);
    const newMediaFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setMediaFiles([...mediaFiles, ...newMediaFiles]);
  };

  const handleRemoveMedia = (index) => {
    const updatedMediaFiles = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(updatedMediaFiles);
  };

  const handleSubmit = () => {
    // Basic validation
    if (!productName || !price) {
      alert("Please fill in required fields: Product Name and Price.");
      return;
    }

    const productData = {
      name: productName,
      description,
      price,
      units,
      gstPercentage: gst,
      media: mediaFiles.map((media) => media.file),
    };

    handleSave(productData);

    // Reset form fields
    setProductName("");
    setDescription("");
    setPrice("");
    setUnits("");
    setGst("");
    setMediaFiles([]);
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
          <Grid item xs={12}>
            <TextField
              label="Product Name"
              fullWidth
              required
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
              required
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Units"
              fullWidth
              type="text"
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
              Upload Media
              <input type="file" multiple hidden onChange={handleMediaUpload} />
            </Button>
            <Grid container spacing={2} style={{ marginTop: "1rem" }}>
              {mediaFiles.map((media, index) => (
                <Grid item xs={3} key={index} style={{ position: "relative" }}>
                  <img
                    src={media.preview}
                    alt="preview"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "5px",
                    }}
                  />
                  <IconButton
                    onClick={() => handleRemoveMedia(index)}
                    style={{
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
              type="text"
              value={gst}
              onChange={(e) => setGst(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid container justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductModal;
