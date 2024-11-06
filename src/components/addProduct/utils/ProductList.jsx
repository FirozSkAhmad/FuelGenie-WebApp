import React, { useState, useEffect } from "react";
import { Grid, CircularProgress, Typography, Box, Button } from "@mui/material";
import ProductCard from "../ProductCard";
import AddProductModal from "../AddProductModal";
import api from "../../../utils/api";
import { useParams } from "react-router-dom";
const ProductList = ({
  products,
  loading,
  error,
  onAddProduct,
  fetchProducts,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { zoneID } = useParams();
  const handleAddProductClick = () => {
    setIsModalOpen(true);
  };
  const handleRefreshProducts = () => {
    fetchProducts();
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveProduct = async (productData) => {
    console.log("Product Data: ", productData);

    try {
      const formData = new FormData();
      formData.append("zoneId", zoneID);
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("units", productData.units);
      formData.append("gstPercentage", productData.gstPercentage);

      // Append each file in the media array to FormData
      productData.media.forEach((file) => {
        formData.append("media", file);
      });

      // Fetch userName and roleId from local storage
      const userName = localStorage.getItem("userName");
      const roleId = localStorage.getItem("roleId");

      formData.append("addedBy", userName || "defaultUserName");
      formData.append("roleId", roleId || "defaultRoleId");

      const response = await api.post(
        "/products/zone-prod-mgr/add-product-to-zone",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("Product saved successfully:", response.data);
        onAddProduct(response.data); // Call to update the parent component's product list
        fetchProducts(); // Fetch the updated list of products
        handleCloseModal(); // Close the modal
      } else {
        console.error("Failed to save product:", response);
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : products.length === 0 ? (
        <Typography>No products available</Typography>
      ) : (
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.productId}>
              <ProductCard product={product} onUpdate={handleRefreshProducts} />
            </Grid>
          ))}
        </Grid>
      )}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button variant="contained" onClick={handleAddProductClick}>
          Add Product
        </Button>
      </Box>
      <AddProductModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        handleSave={handleSaveProduct}
      />
    </>
  );
};

export default ProductList;
