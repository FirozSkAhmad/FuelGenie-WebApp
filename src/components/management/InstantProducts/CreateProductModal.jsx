import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Stack,
  Button,
  Alert,
  Chip,
  IconButton,
  Avatar,
  Grid,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  LocalGasStation,
  OilBarrel,
  Inventory,
  Close,
} from "@mui/icons-material";
import api from "../../../utils/api";

const productTypeOptions = [
  { value: "gas", label: "Gas", icon: <LocalGasStation /> },
  { value: "petroleum", label: "Petroleum", icon: <OilBarrel /> },
  { value: "item", label: "Item", icon: <Inventory /> },
];

const CreateProductModal = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    productType: "",
    price: "",
    maxDeliveryQuantity: "",
  });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const newPreviews = mediaFiles.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      id: Math.random().toString(36).substr(2, 9),
    }));
    setImagePreviews(newPreviews);

    return () => {
      newPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [mediaFiles]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.productType)
      newErrors.productType = "Product type is required";

    if (formData.productType === "item") {
      if (!formData.price) newErrors.price = "Price is required for items";
      if (isNaN(formData.price)) newErrors.price = "Invalid price format";
    }

    if (["gas", "petroleum"].includes(formData.productType)) {
      if (!formData.maxDeliveryQuantity) {
        newErrors.maxDeliveryQuantity = "Max delivery quantity is required";
      }
      if (isNaN(formData.maxDeliveryQuantity)) {
        newErrors.maxDeliveryQuantity = "Invalid quantity format";
      }
    }

    if (mediaFiles.length === 0)
      newErrors.media = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDeleteImage = (id) => {
    setMediaFiles((prev) =>
      prev.filter((_, index) => imagePreviews[index].id !== id)
    );
    setImagePreviews((prev) => prev.filter((preview) => preview.id !== id));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const formPayload = new FormData();

    try {
      formPayload.append("name", formData.name);
      formPayload.append("productType", formData.productType);

      if (formData.productType === "item") {
        formPayload.append("price", formData.price);
      } else {
        formPayload.append("maxDeliveryQuantity", formData.maxDeliveryQuantity);
      }

      mediaFiles.forEach((file) => {
        formPayload.append("media", file);
      });

      await api.post(
        "/management/instant-products/create-an-instant-product",
        formPayload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Creation error:", error);
      setErrors({
        submit: error.response?.data?.message || "Failed to create product",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setMediaFiles((prev) => [...prev, ...files]);
    setErrors((prev) => ({ ...prev, media: null }));
  };

  const handleClose = () => {
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    setImagePreviews([]);
    setMediaFiles([]);
    setFormData({
      name: "",
      productType: "",
      price: "",
      maxDeliveryQuantity: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Create New Instant Product
        <Chip
          label="All fields are required"
          color="info"
          size="small"
          sx={{ ml: 2 }}
        />
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />

          <FormControl fullWidth error={!!errors.productType}>
            <InputLabel>Product Type</InputLabel>
            <Select
              name="productType"
              value={formData.productType}
              label="Product Type"
              onChange={handleChange}
              renderValue={(selected) => (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {
                    productTypeOptions.find((opt) => opt.value === selected)
                      ?.icon
                  }
                  {
                    productTypeOptions.find((opt) => opt.value === selected)
                      ?.label
                  }
                </div>
              )}
            >
              {productTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    {option.icon}
                    {option.label}
                  </Stack>
                </MenuItem>
              ))}
            </Select>
            {errors.productType && (
              <FormHelperText>{errors.productType}</FormHelperText>
            )}
          </FormControl>

          {formData.productType === "item" && (
            <TextField
              label="Price (₹)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price}
              InputProps={{ inputProps: { min: 0 } }}
              fullWidth
            />
          )}

          {["gas", "petroleum"].includes(formData.productType) && (
            <TextField
              label="Max Delivery Quantity"
              name="maxDeliveryQuantity"
              type="number"
              value={formData.maxDeliveryQuantity}
              onChange={handleChange}
              error={!!errors.maxDeliveryQuantity}
              helperText={errors.maxDeliveryQuantity}
              InputProps={{ inputProps: { min: 0 } }}
              fullWidth
            />
          )}

          <FormControl fullWidth error={!!errors.media}>
            <input
              accept="image/*"
              id="media-upload"
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label htmlFor="media-upload">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                sx={{ py: 1.5 }}
              >
                Upload Product Images ({mediaFiles.length} selected)
              </Button>
            </label>
            {errors.media && (
              <FormHelperText sx={{ ml: 1 }}>{errors.media}</FormHelperText>
            )}
          </FormControl>

          <Grid container spacing={2}>
            {imagePreviews.map((preview, index) => (
              <Grid item xs={4} key={preview.id}>
                <div style={{ position: "relative" }}>
                  <Avatar
                    variant="rounded"
                    src={preview.url}
                    sx={{
                      width: 100,
                      height: 100,
                      m: "0 auto",
                      border: "1px solid #ddd",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteImage(preview.id)}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                    }}
                  >
                    <Close fontSize="small" sx={{ color: "white" }} />
                  </IconButton>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      textAlign: "center",
                      mt: 0.5,
                      maxWidth: 100,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {preview.name}
                  </Typography>
                </div>
              </Grid>
            ))}
          </Grid>

          {errors.submit && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errors.submit}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <LoadingButton
          onClick={handleSubmit}
          loading={loading}
          variant="contained"
          loadingIndicator="Creating..."
        >
          Create Product
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProductModal;
