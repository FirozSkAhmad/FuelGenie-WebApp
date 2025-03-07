import React, { useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Avatar,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const ProductSelection = ({
  products,
  selectedProducts,
  setSelectedProducts,
}) => {
  // Initialize selectedProducts with all products and quantity 0
  useEffect(() => {
    if (products.length > 0 && selectedProducts.length === 0) {
      const initialSelectedProducts = products.map((product) => ({
        ...product,
        quantity: 0,
      }));
      setSelectedProducts(initialSelectedProducts);
    }
  }, [products, selectedProducts, setSelectedProducts]);

  const handleQuantityChange = (product, quantity) => {
    // Ensure quantity is not negative
    const newQuantity = Math.max(0, quantity);

    // Update the selectedProducts array
    const updatedProducts = selectedProducts.map((p) =>
      p._id === product._id ? { ...p, quantity: newQuantity } : p
    );
    setSelectedProducts(updatedProducts);
  };

  // Calculate the total price for a single product (including GST)
  const calculateProductTotal = (product) => {
    const quantity =
      selectedProducts.find((p) => p._id === product._id)?.quantity || 0;
    const price = product.price;
    const gstPercentage = product.gstPercentage;
    const totalBeforeGST = quantity * price;
    const gstAmount = (totalBeforeGST * gstPercentage) / 100;
    return totalBeforeGST + gstAmount;
  };

  // Calculate the grand total for all selected products
  const calculateGrandTotal = () => {
    return selectedProducts.reduce((total, product) => {
      return total + calculateProductTotal(product);
    }, 0);
  };
  // calculate total price without gst
  const calculateTotalBeforeGST = (product) => {
    const quantity =
      selectedProducts.find((p) => p._id === product._id)?.quantity || 0;
    const price = product.price;
    const totalBeforeGST = quantity * price;
    return totalBeforeGST;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Products
      </Typography>
      {products.map((product) => (
        <Box
          key={product._id}
          display="flex"
          alignItems="center"
          gap={2}
          marginBottom={2}
          border={1}
          borderColor="divider"
          borderRadius={2}
          padding={2}
        >
          {/* Product Image */}
          <Grid container spacing={2} alignItems="center">
            {/* Avatar */}
            <Grid item xs={2}>
              <Avatar
                src={product.media[0]} // Use the first image in the media array
                alt={product.name}
                variant="square"
                sx={{ width: 56, height: 56 }}
              />
            </Grid>

            {/* Product Details */}
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold">
                {product.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {product.description}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Price: ₹{product.price} per {product.units}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                GST: {product.gstPercentage}%
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                Total: ₹{calculateProductTotal(product).toFixed(2)}
              </Typography>
            </Grid>

            {/* Quantity Controls */}
            <Grid item xs={4} display="flex" justifyContent="flex-end">
              <Box display="flex" alignItems="center">
                <IconButton
                  onClick={() =>
                    handleQuantityChange(
                      product,
                      (selectedProducts.find((p) => p._id === product._id)
                        ?.quantity || 0) - 1
                    )
                  }
                >
                  <RemoveIcon />
                </IconButton>
                <TextField
                  type="number"
                  value={
                    selectedProducts.find((p) => p._id === product._id)
                      ?.quantity || 0
                  }
                  onChange={(e) =>
                    handleQuantityChange(product, parseInt(e.target.value))
                  }
                  inputProps={{ min: 0 }}
                  sx={{ width: "100px", mx: 3 }} // Add margin for spacing
                />
                <IconButton
                  onClick={() =>
                    handleQuantityChange(
                      product,
                      (selectedProducts.find((p) => p._id === product._id)
                        ?.quantity || 0) + 1
                    )
                  }
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
      ))}

      {/* Grand Total */}
      <Box marginTop={4} padding={2} borderTop={1} borderColor="divider">
        <Typography variant="h6" fontWeight="bold">
          Total: ₹
          {selectedProducts.reduce(
            (sum, product) => sum + calculateTotalBeforeGST(product),
            0
          )}
        </Typography>
        <Typography variant="h6" fontWeight="bold">
          Grand Total: ₹ {calculateGrandTotal().toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProductSelection;
