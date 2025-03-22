import { useState } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import api from "../../../utils/api";
const SetPriceModal = ({
  open,
  onClose,
  products,
  pumpId,
  fetchPumpDetails,
}) => {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const payload = products
        .filter((product) => prices[product.instantProductId] !== undefined)
        .map((product) => ({
          instantProductId: product.instantProductId,
          newPrice: parseFloat(prices[product.instantProductId]),
        }));

      const response = await api.put(
        `/management/pumps/set-price/${pumpId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        onClose(true);
        fetchPumpDetails();
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to update prices"
      );
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
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Set Prices for Petroleum/Gas Products
        </Typography>

        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}

        <List>
          {products.map((product) => (
            <ListItem key={product.instantProductId}>
              <ListItemText
                primary={product.name}
                secondary={`Unit: ${product.unit}`}
              />
              <TextField
                size="small"
                type="number"
                label="Price"
                inputProps={{ min: 0, step: "0.01" }}
                onChange={(e) =>
                  setPrices((prev) => ({
                    ...prev,
                    [product.instantProductId]: e.target.value,
                  }))
                }
                sx={{ width: 120 }}
              />
            </ListItem>
          ))}
        </List>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}
        >
          <Button onClick={() => onClose(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || Object.keys(prices).length === 0}
          >
            {loading ? <CircularProgress size={24} /> : "Update Prices"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
export default SetPriceModal;
