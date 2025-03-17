import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Typography,
  InputAdornment,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import { ArrowUpward, ArrowDownward, Close } from "@mui/icons-material";
import api from "../../../utils/api";

const UpdatePriceModal = ({ open, onClose, onSuccess, onError }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/management/pumps/get-instant-products");
      const filteredProducts = response.data.data.filter((product) =>
        ["petroleum", "gas"].includes(product.productType)
      );
      setProducts(filteredProducts.map((p) => ({ ...p, inc: "", dec: "" })));
      setError(null);
    } catch (err) {
      setError("Failed to fetch products");
      onError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchProducts();
  }, [open]);

  const handleSubmit = async () => {
    try {
      const updates = products
        .map((product) => ({
          instantProductId: product.instantProductId,
          ...(product.inc !== "" && { inc: Number(product.inc) }),
          ...(product.dec !== "" && { dec: Number(product.dec) }),
        }))
        .filter((update) => {
          const hasValidInc = update.inc > 0;
          const hasValidDec = update.dec > 0;
          return hasValidInc || hasValidDec;
        });

      if (updates.length === 0) {
        onError(
          "Please enter valid price adjustments for at least one fuel type"
        );
        return;
      }

      await api.put("/management/pumps/update-price", updates);
      onSuccess();
      onClose();
    } catch (err) {
      onError(err.response?.data?.message || "Failed to update prices");
    }
  };

  const handleValueChange = (index, field, value) => {
    let numericValue;
    if (value === "") {
      numericValue = "";
    } else {
      const parsed = Number(value);
      numericValue = isNaN(parsed) ? "" : Math.max(0, parsed);
    }

    const newProducts = [...products];
    newProducts[index] = {
      ...newProducts[index],
      [field]: numericValue,
      ...(field === "inc" && { dec: "" }),
      ...(field === "dec" && { inc: "" }),
    };
    setProducts(newProducts);
  };

  const handleReset = (index) => {
    const newProducts = [...products];
    newProducts[index] = {
      ...newProducts[index],
      inc: "",
      dec: "",
    };
    setProducts(newProducts);
  };

  const PriceInput = ({ label, value, onChange, isActive, variant }) => (
    <TextField
      fullWidth
      label={label}
      type="number"
      value={value}
      onChange={onChange}
      disabled={!isActive}
      inputProps={{
        min: 0,
        step: 0.5,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            {variant === "inc" ? (
              <ArrowUpward color="success" />
            ) : (
              <ArrowDownward color="error" />
            )}
          </InputAdornment>
        ),
      }}
      sx={{
        "& .MuiInputBase-root": {
          backgroundColor: isActive
            ? variant === "inc"
              ? "#e8f5e9"
              : "#ffebee"
            : "inherit",
          borderColor: isActive
            ? variant === "inc"
              ? "#4caf50"
              : "#f44336"
            : "inherit",
        },
      }}
    />
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ bgcolor: "#f5f5f5", borderBottom: 1 }}>
        <Box display="flex" alignItems="center">
          <Typography variant="h6">Update Fuel Prices</Typography>
          <Chip label="₹ Per Liter" color="info" sx={{ ml: 2 }} />
        </Box>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {products.map((product, index) => (
              <Grid item xs={12} key={product.instantProductId}>
                <Box
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 2,
                    bgcolor: "#fafafa",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      {product.name}
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ ml: 1 }}
                      >
                        (Current Price:{" "}
                        {product.price ? `₹${product.price}` : "N/A"})
                      </Typography>
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleReset(index)}
                      disabled={!products[index].inc && !products[index].dec}
                      sx={{
                        visibility:
                          products[index].inc || products[index].dec
                            ? "visible"
                            : "hidden",
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={5}>
                      <PriceInput
                        label="Price Increase"
                        value={products[index].inc}
                        onChange={(e) =>
                          handleValueChange(index, "inc", e.target.value)
                        }
                        isActive={!products[index].dec}
                        variant="inc"
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <PriceInput
                        label="Price Decrease"
                        value={products[index].dec}
                        onChange={(e) =>
                          handleValueChange(index, "dec", e.target.value)
                        }
                        isActive={!products[index].inc}
                        variant="dec"
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        variant="outlined"
                        color="inherit"
                        onClick={() => handleReset(index)}
                        fullWidth
                        sx={{ height: 56 }}
                      >
                        Reset
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: "divider" }}>
        <Button onClick={onClose} variant="outlined" sx={{ minWidth: 120 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ minWidth: 140 }}
        >
          Confirm Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdatePriceModal;
