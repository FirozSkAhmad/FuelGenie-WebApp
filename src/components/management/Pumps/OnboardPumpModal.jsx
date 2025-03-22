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
import AddIcon from "@mui/icons-material/Add";
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
    // license: "",
    // ITC: "",
    // licenseFileName: "",
    // licenseFile: null,
    // ITCFileName: "",
    // ITCFile: null,
    productDetails: [],
    documents: [
      { name: "License", file: null },
      { name: "ITC", file: null },
    ],
  });
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(
          "/management/pumps/get-all-instant-products"
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

  // Document management functions
  const addDocument = () => {
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, { name: "", file: null }],
    }));
  };

  const removeDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };
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
    // // Validate license fields
    // if (!formData.licenseFileName) errors.licenseFileName = "Name required";
    // if (!formData.licenseFile) errors.licenseFile = "File required";

    // // Validate ITC fields
    // if (!formData.ITCFileName) errors.ITCFileName = "Name required";
    // if (!formData.ITCFile) errors.ITCFile = "File required";

    // Validate documents
    formData.documents.forEach((doc, index) => {
      if (!doc.name.trim()) {
        errors[`document-${index}-name`] = "Document name is required";
      }
      if (!doc.file) {
        errors[`document-${index}-file`] = "Document file is required";
      }
    });
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
  // const handleFileUpload = (field, e) => {
  //   const file = e.target.files[0];
  //   if (file && file.type === "application/pdf") {
  //     setFormData((prev) => ({
  //       ...prev,
  //       [field]: file,
  //     }));
  //   }
  // };
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
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

      const formPayload = new FormData();

      // First append documents
      formData.documents.forEach((doc) => {
        if (doc.file && doc.name) {
          formPayload.append(doc.name, doc.file, `${doc.name}.pdf`);
        }
      });

      // Destructure documents out of the other fields
      const { documents, ...otherFields } = formData;

      // Then append other fields
      Object.entries(otherFields).forEach(([key, value]) => {
        if (key === "productDetails") {
          formPayload.append(key, JSON.stringify(formattedDetails));
        } else {
          formPayload.append(key, value);
        }
      });

      await api.post("/management/pumps/onboard-pump", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
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
                Legal Documents
              </Typography>

              {formData.documents.map((doc, index) => (
                <Box key={index} sx={{ mt: index > 0 ? 3 : 0 }}>
                  <TextField
                    fullWidth
                    label={`Document Name`}
                    value={doc.name}
                    onChange={(e) => {
                      const updatedDocs = [...formData.documents];
                      updatedDocs[index].name = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        documents: updatedDocs,
                      }));
                      setFormErrors((prev) => ({
                        ...prev,
                        [`document-${index}-name`]: undefined,
                        [`document-${index}-file`]: undefined,
                      }));
                    }}
                    error={!!formErrors[`document-${index}-name`]}
                    helperText={formErrors[`document-${index}-name`]}
                    required
                  />

                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{
                      mt: 1,
                      borderColor: formErrors[`document-${index}-file`]
                        ? "error.main"
                        : "",
                      textTransform: "none",
                    }}
                  >
                    Upload PDF
                    <input
                      type="file"
                      hidden
                      accept="application/pdf"
                      onChange={(e) => {
                        const updatedDocs = [...formData.documents];
                        updatedDocs[index].file = e.target.files[0];
                        setFormData((prev) => ({
                          ...prev,
                          documents: updatedDocs,
                        }));
                        setFormErrors((prev) => ({
                          ...prev,
                          [`document-${index}-file`]: undefined,
                        }));
                      }}
                    />
                  </Button>

                  {formErrors[`document-${index}-file`] && (
                    <FormHelperText error>
                      {formErrors[`document-${index}-file`]}
                    </FormHelperText>
                  )}

                  {doc.file && (
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mt: 0.5 }}
                    >
                      Selected file: {doc.file.name}
                    </Typography>
                  )}

                  {index >= 2 && ( // Only show remove for added documents beyond initial 2
                    <Button
                      onClick={() => removeDocument(index)}
                      color="error"
                      size="small"
                      sx={{ mt: 1 }}
                    >
                      Remove Document
                    </Button>
                  )}
                </Box>
              ))}

              <Button
                onClick={addDocument}
                variant="outlined"
                sx={{ mt: 2 }}
                startIcon={<AddIcon />}
              >
                Add Another Document
              </Button>
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
