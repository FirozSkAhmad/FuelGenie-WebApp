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
import { useTheme } from "@mui/material/styles";
import { ArrowUpward, ArrowDownward, Close } from "@mui/icons-material";
import api from "../../../utils/api";

const UpdatePriceModal = ({ open, onClose, onSuccess, onError }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
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

  const PriceInput = ({ label, value, onChange, isActive, variant }) => {
    const backgroundColor = isActive
      ? variant === "inc"
        ? theme.palette.success.main +
          (theme.palette.mode === "dark" ? "22" : "11")
        : theme.palette.error.main +
          (theme.palette.mode === "dark" ? "22" : "11")
      : "inherit";

    return (
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
          sx: {
            color: theme.palette.text.primary,
            backgroundColor,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: isActive
                ? variant === "inc"
                  ? theme.palette.success.main
                  : theme.palette.error.main
                : theme.palette.divider,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: isActive
                ? variant === "inc"
                  ? theme.palette.success.main
                  : theme.palette.error.main
                : theme.palette.divider,
            },
          },
        }}
      />
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
        }}
      >
        <Box display="flex" alignItems="center">
          <Typography variant="h6">Update Fuel Prices</Typography>
          <Chip
            label="₹ Per Liter"
            sx={{
              ml: 2,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.info.dark
                  : theme.palette.info.light,
              color: theme.palette.getContrastText(
                theme.palette.mode === "dark"
                  ? theme.palette.info.dark
                  : theme.palette.info.light
              ),
            }}
          />
        </Box>
      </DialogTitle>

      <DialogContent sx={{ bgcolor: theme.palette.background.default }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert
            severity="error"
            sx={{ bgcolor: theme.palette.error.dark + "22" }}
          >
            {error}
          </Alert>
        ) : (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {products.map((product, index) => (
              <Grid item xs={12} key={product.instantProductId}>
                <Box
                  sx={{
                    p: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    bgcolor: theme.palette.background.paper,
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
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ color: theme.palette.text.primary }}
                    >
                      {product.name}
                      {/* <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ ml: 1 }}
                      >
                        (Current Price:{" "}
                        {product.price ? `₹${product.price}` : "N/A"})
                      </Typography> */}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleReset(index)}
                      disabled={!products[index].inc && !products[index].dec}
                      sx={{
                        color: theme.palette.text.secondary,
                        visibility:
                          products[index].inc || products[index].dec
                            ? "visible"
                            : "hidden",
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>

                  <Divider
                    sx={{
                      my: 2,
                      borderColor: theme.palette.divider,
                    }}
                  />

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
                        sx={{
                          height: 56,
                          color: theme.palette.text.secondary,
                          borderColor: theme.palette.divider,
                          "&:hover": {
                            borderColor: theme.palette.action.active,
                          },
                        }}
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

      <DialogActions
        sx={{
          p: 3,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            minWidth: 120,
            borderColor: theme.palette.divider,
            color: theme.palette.text.primary,
            "&:hover": {
              borderColor: theme.palette.action.active,
            },
          }}
        >
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
