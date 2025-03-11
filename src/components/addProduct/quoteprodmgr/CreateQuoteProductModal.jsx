import React, { useState } from "react";
import api from "../../../utils/api";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Close as CloseIcon, Delete as DeleteIcon } from "@mui/icons-material";

const CreateQuoteProductModal = ({ open, onClose, onProductCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: { paragraph: "", keyFeatures: [] },
    feature: [],
    specifications: [],
    media: [],
    quotationScreen: false, // Added quotationScreen
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle media file upload
  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.media.length > 2) {
      setError("You can only upload up to 2 images.");
      return;
    }
    setFormData((prev) => ({ ...prev, media: [...prev.media, ...files] }));
  };

  // Handle image removal
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("description", JSON.stringify(formData.description));
    formPayload.append("feature", JSON.stringify(formData.feature));
    formPayload.append(
      "specifications",
      JSON.stringify(formData.specifications)
    );
    formPayload.append("quotationScreen", formData.quotationScreen);
    formPayload.append("category", formData.category);
    formData.media.forEach((file) => formPayload.append("media", file));

    try {
      const response = await api.post(
        "/products/quote-prod-mgr/create-quote-product",
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data) {
        setSnackbarMessage("Product created successfully!");
        setSnackbarOpen(true);
        onProductCreated();
      }
    } catch (err) {
      setError(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Create New Product</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description.paragraph}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: { ...prev.description, paragraph: e.target.value },
              }))
            }
            margin="normal"
            multiline
            rows={4}
            required
          />
          <TextField
            fullWidth
            label="Key Features (comma-separated)"
            name="keyFeatures"
            value={formData.description.keyFeatures.join(",")}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: {
                  ...prev.description,
                  keyFeatures: e.target.value.split(","),
                },
              }))
            }
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Features (comma-separated)"
            name="feature"
            value={formData.feature.join(",")}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                feature: e.target.value.split(","),
              }))
            }
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Specifications (comma-separated)"
            name="specifications"
            value={formData.specifications.join(",")}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                specifications: e.target.value.split(","),
              }))
            }
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <MenuItem value="storage">Storage</MenuItem>
              <MenuItem value="lubricant">Lubricant</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          {/* Quotation Screen Toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={formData.quotationScreen}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    quotationScreen: e.target.checked,
                  }))
                }
                name="quotationScreen"
                color="primary"
              />
            }
            label="Quotation Screen"
            sx={{ mt: 2 }}
          />

          {/* Media Upload Section */}
          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>
              Upload Images (Max 2)
            </Typography>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleMediaUpload}
              style={{ display: "none" }}
              id="media-upload"
              disabled={formData.media.length >= 2}
            />
            <label htmlFor="media-upload">
              <Button
                variant="outlined"
                component="span"
                disabled={formData.media.length >= 2}
              >
                Upload Images
              </Button>
            </label>
          </Box>

          {/* Image Previews */}
          {formData.media.length > 0 && (
            <Grid container spacing={2} mt={2}>
              {formData.media.map((file, index) => (
                <Grid item key={index} xs={6}>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "100px",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                      }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Submit Button */}
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Create Product"}
            </Button>
          </Box>
        </form>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* Success Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert severity="success">{snackbarMessage}</Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
};

export default CreateQuoteProductModal;
