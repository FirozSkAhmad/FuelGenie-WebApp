import React, { useState } from "react";
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
  Alert,
  Stack,
  Chip,
  Typography,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { MonetizationOn, Close } from "@mui/icons-material";
import api from "../../../utils/api";

const UpdatePriceModal = ({ open, onClose, onSuccess, products }) => {
  const [updates, setUpdates] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter items with productType 'item'
  const itemProducts = products.filter(
    (product) => product.productType === "item"
  );

  const handleChange = (productId, field, value) => {
    setUpdates((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const validateUpdates = () => {
    const hasValidUpdates = itemProducts.some((product) => {
      const update = updates[product.instantProductId];
      return update && (update.inc > 0 || update.dec > 0);
    });

    if (!hasValidUpdates) {
      setError("At least one valid price adjustment required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    if (!validateUpdates()) return;

    setLoading(true);
    try {
      const payload = itemProducts
        .map((product) => {
          const update = updates[product.instantProductId];
          if (!update) return null;

          const adjustment = {};
          if (update.inc > 0) adjustment.inc = Number(update.inc);
          if (update.dec > 0) adjustment.dec = Number(update.dec);

          return Object.keys(adjustment).length > 0
            ? {
                instantProductId: product.instantProductId,
                ...adjustment,
              }
            : null;
        })
        .filter(Boolean);

      await api.put("/management/instant-products/update-items-price", payload);
      onSuccess();
      handleClose();
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "Failed to update prices");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUpdates({});
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Update Item Prices
        <Chip
          label="Only for product type: Item"
          color="secondary"
          size="small"
          sx={{ ml: 2 }}
        />
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {itemProducts.map((product) => (
            <div key={product.instantProductId}>
              <Typography variant="subtitle1" gutterBottom>
                {product.name} (Current Price: ₹{product.price})
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <FormControl variant="outlined" sx={{ width: 120 }}>
                  <InputLabel>Adjustment Type</InputLabel>
                  <Select
                    value={updates[product.instantProductId]?.type || ""}
                    onChange={(e) =>
                      handleChange(
                        product.instantProductId,
                        "type",
                        e.target.value
                      )
                    }
                    label="Adjustment Type"
                  >
                    <MenuItem value="inc">Increase</MenuItem>
                    <MenuItem value="dec">Decrease</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label={`Adjustment Amount (₹)`}
                  type="number"
                  value={
                    updates[product.instantProductId]?.[
                      updates[product.instantProductId]?.type
                    ] || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      product.instantProductId,
                      updates[product.instantProductId]?.type,
                      e.target.value
                    )
                  }
                  InputProps={{ inputProps: { min: 0 } }}
                  sx={{ flexGrow: 1 }}
                />
              </Stack>
            </div>
          ))}

          {error && <Alert severity="error">{error}</Alert>}
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
          startIcon={<MonetizationOn />}
          loadingIndicator="Updating..."
        >
          Update Prices
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default UpdatePriceModal;
