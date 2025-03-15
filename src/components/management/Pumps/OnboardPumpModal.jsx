import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Grid,
  Divider,
  FormHelperText,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Box,
  Card,
  CardContent,
} from "@mui/material";

const OnboardPumpModal = ({ open, onClose, onSuccess, onError }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [formData, setFormData] = useState({
    pumpName: "",
    ownerName: "",
    contactNo: "",
    emailId: "",
    addressLine: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    latitude: "",
    longitude: "",
    license: "",
    ITC: "",
    licenseFileName: "",
    licenseFile: null,
    ITCFileName: "",
    ITCFile: null,
    productDetails: [],
  });
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(
          "/management/pumps/get-instant-products"
        );
        setProducts(response.data.data);
        const initialProductDetails = response.data.data.map((product) => ({
          instantProductId: product.instantProductId,
          price: "",
          maxDeliveryQuantity: "",
        }));
        setFormData((prev) => ({
          ...prev,
          productDetails: initialProductDetails,
        }));
      } catch (err) {
        onError("Failed to load products. Please try again.");
      } finally {
        setLoadingProducts(false);
      }
    };

    if (open) fetchProducts();
  }, [open, onError]);

  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      "pumpName",
      "ownerName",
      "contactNo",
      "emailId",
      "addressLine",
      "country",
      "state",
      "city",
      "pincode",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field].trim()) errors[field] = "This field is required";
    });

    if (!/^\d{10}$/.test(formData.contactNo))
      errors.contactNo = "Invalid phone number";
    if (
      !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.emailId)
    ) {
      errors.emailId = "Invalid email address";
    }

    // Validate product details
    formData.productDetails.forEach((detail, index) => {
      const product = products[index];
      if (
        (product.productType === "petroleum" ||
          product.productType === "gas") &&
        !detail.price
      ) {
        errors[`product-${index}`] = "Price is required";
      }
      if (product.productType === "item" && !detail.maxDeliveryQuantity) {
        errors[`product-${index}`] = "Max quantity is required";
      }
    });
    // Validate license fields
    if (!formData.licenseFileName) errors.licenseFileName = "Name required";
    if (!formData.licenseFile) errors.licenseFile = "File required";

    // Validate ITC fields
    if (!formData.ITCFileName) errors.ITCFileName = "Name required";
    if (!formData.ITCFile) errors.ITCFile = "File required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleProductChange = (index, field, value) => {
    const updatedDetails = [...formData.productDetails];
    updatedDetails[index][field] = value;
    setFormData((prev) => ({ ...prev, productDetails: updatedDetails }));
    if (formErrors[`product-${index}`])
      setFormErrors((prev) => ({ ...prev, [`product-${index}`]: "" }));
  };
  const handleFileUpload = (field, e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setFormData((prev) => ({
        ...prev,
        [field]: file,
      }));
    }
  };
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // Format product details (existing logic)
      const formattedDetails = formData.productDetails.map((detail, index) => {
        const product = products[index];
        return {
          instantProductId: detail.instantProductId,
          price: ["petroleum", "gas"].includes(product.productType)
            ? Number(detail.price)
            : null,
          maxDeliveryQuantity:
            product.productType === "item"
              ? Number(detail.maxDeliveryQuantity)
              : null,
        };
      });

      // Create FormData for file uploads
      const formPayload = new FormData();

      // Append all non-file fields
      const {
        licenseFile,
        licenseFileName,
        ITCFile,
        ITCFileName,
        ...otherFields
      } = formData;
      Object.entries(otherFields).forEach(([key, value]) => {
        if (key === "productDetails") {
          formPayload.append(key, JSON.stringify(formattedDetails)); // Use formattedDetails
        } else {
          formPayload.append(key, value);
        }
      });

      // Append files with custom names
      if (licenseFile) {
        formPayload.append("license", licenseFile, `${licenseFileName}.pdf`);
      }
      if (ITCFile) {
        formPayload.append("ITC", ITCFile, `${ITCFileName}.pdf`);
      }

      // Send the request with multipart/form-data headers
      await api.post("/management/pumps/onboard-pump", formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onSuccess();
      onClose();
    } catch (err) {
      onError(
        err.response?.data?.message || "Onboarding failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle sx={{ py: 2 }}>
        <Typography variant="h6">Onboard New Pump</Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {loadingProducts ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {/* Basic Information */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: "text.secondary" }}
              >
                Basic Information
              </Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Pump Name"
                name="pumpName"
                value={formData.pumpName}
                onChange={handleInputChange}
                error={!!formErrors.pumpName}
                helperText={formErrors.pumpName}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Owner Name"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                error={!!formErrors.ownerName}
                helperText={formErrors.ownerName}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Contact Number"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleInputChange}
                error={!!formErrors.contactNo}
                helperText={formErrors.contactNo}
                required
                inputProps={{ maxLength: 10 }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="emailId"
                value={formData.emailId}
                onChange={handleInputChange}
                error={!!formErrors.emailId}
                helperText={formErrors.emailId}
                required
              />
            </Grid>

            {/* Address Information */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: "text.secondary" }}
              >
                Address Information
              </Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Address Line"
                name="addressLine"
                value={formData.addressLine}
                onChange={handleInputChange}
                error={!!formErrors.addressLine}
                helperText={formErrors.addressLine}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                error={!!formErrors.country}
                helperText={formErrors.country}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="State"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                error={!!formErrors.state}
                helperText={formErrors.state}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                error={!!formErrors.city}
                helperText={formErrors.city}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Location Information */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: "text.secondary" }}
              >
                Location Details
              </Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                error={!!formErrors.pincode}
                helperText={formErrors.pincode}
                required
                inputProps={{ maxLength: 6 }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">°N</InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">°E</InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Legal Information */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: "text.secondary" }}
              >
                Legal Information
              </Typography>

              {/* License Section */}
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="License Name"
                  value={formData.licenseFileName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      licenseFileName: e.target.value,
                    }))
                  }
                  error={!!formErrors.licenseFileName}
                  helperText={formErrors.licenseFileName}
                  required
                />
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{
                    mt: 1,
                    borderColor: formErrors.licenseFile ? "error.main" : "",
                    textTransform: "none",
                  }}
                >
                  Upload License PDF
                  <input
                    type="file"
                    hidden
                    accept="application/pdf"
                    onChange={(e) => handleFileUpload("licenseFile", e)}
                  />
                </Button>
                {formErrors.licenseFile && (
                  <FormHelperText error>
                    {formErrors.licenseFile}
                  </FormHelperText>
                )}
                {formData.licenseFile && (
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    Selected file: {formData.licenseFile.name}
                  </Typography>
                )}
              </Box>

              {/* ITC Section */}
              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="ITC Certificate Name"
                  value={formData.ITCFileName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ITCFileName: e.target.value,
                    }))
                  }
                  error={!!formErrors.ITCFileName}
                  helperText={formErrors.ITCFileName}
                  required
                />
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{
                    mt: 1,
                    borderColor: formErrors.ITCFile ? "error.main" : "",
                    textTransform: "none",
                  }}
                >
                  Upload ITC Certificate PDF
                  <input
                    type="file"
                    hidden
                    accept="application/pdf"
                    onChange={(e) => handleFileUpload("ITCFile", e)}
                  />
                </Button>
                {formErrors.ITCFile && (
                  <FormHelperText error>{formErrors.ITCFile}</FormHelperText>
                )}
                {formData.ITCFile && (
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    Selected file: {formData.ITCFile.name}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Product Details */}
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ mb: 3, color: "text.secondary" }}
              >
                Product Pricing & Quantities
              </Typography>
              <Grid container spacing={2}>
                {products.map((product, index) => (
                  <Grid item xs={12} key={product.instantProductId}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                          {product.name} ({product.productType})
                        </Typography>

                        <Grid container spacing={2}>
                          {["petroleum", "gas"].includes(
                            product.productType
                          ) && (
                            <Grid item xs={12} sm={6} md={4}>
                              <TextField
                                fullWidth
                                label={`Price per ${product.unit}`}
                                type="number"
                                value={
                                  formData.productDetails[index]?.price || ""
                                }
                                onChange={(e) =>
                                  handleProductChange(
                                    index,
                                    "price",
                                    e.target.value
                                  )
                                }
                                error={!!formErrors[`product-${index}`]}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      ₹
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                          )}

                          {product.productType === "item" && (
                            <Grid item xs={12} sm={6} md={4}>
                              <TextField
                                fullWidth
                                label="Max Delivery Quantity"
                                type="number"
                                value={
                                  formData.productDetails[index]
                                    ?.maxDeliveryQuantity || ""
                                }
                                onChange={(e) =>
                                  handleProductChange(
                                    index,
                                    "maxDeliveryQuantity",
                                    e.target.value
                                  )
                                }
                                error={!!formErrors[`product-${index}`]}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      {product.unit}
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                          )}
                        </Grid>

                        {formErrors[`product-${index}`] && (
                          <FormHelperText error sx={{ mt: 1 }}>
                            {formErrors[`product-${index}`]}
                          </FormHelperText>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={loadingProducts || submitting}
        >
          {submitting ? <CircularProgress size={24} /> : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OnboardPumpModal;
