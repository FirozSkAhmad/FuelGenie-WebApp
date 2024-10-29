import React, { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  Button,
  TextField,
  Pagination,
} from "@mui/material";
import CreateZoneModal from "../../components/zonecreation/CreateZoneModal";
import AddProductModal from "../../components/addProduct/AddProductModal";
const initialProducts = [
  { productName: "Diesel", price: "₹ 98.67" },
  { productName: "LDO", price: "₹ 98.67" },
  { productName: "MTO", price: "₹ 98.67" },
  { productName: "Fuel Oil", price: "₹ 98.67" },
  { productName: "Furnace Oil", price: "₹ 98.67" },
  { productName: "IBC Tank", price: "₹ 98.67" },
  { productName: "Static Tank", price: "₹ 98.67" },
  { productName: "Glass Flask", price: "₹ 98.67" },
  { productName: "Plastic Flask", price: "₹ 98.67" },
  { productName: "Jerry Cans 20ltrs", price: "₹ 98.67" },
  { productName: "Measuring Devices", price: "₹ 98.67" },
  { productName: "Density Kit", price: "₹ 98.67" },
  { productName: "Lubricants", price: "₹ 98.67" },
];

const ProductList = () => {
  const [products, setProducts] = useState(initialProducts);
  const [editMode, setEditMode] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [createZoneOpen, setCreateZoneOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ productName: "", price: "" });

  const handleEdit = () => {
    setEditMode(!editMode);
  };
  // Cancels edit mode and reverts changes
  const handleCancel = () => {
    setEditMode(false); // Exits edit mode
    // Optionally: Reset the form or revert unsaved changes
    // resetForm();
  };
  const handleInputChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  const handleAddProduct = () => {
    setProducts([...products, newProduct]);
    setNewProduct({ productName: "", price: "" });
    setAddProductOpen(false);
  };
  // Handle saving product
  const handleSaveProduct = (productData) => {
    console.log("Product Data: ", productData);
    setProducts([...products, productData]);
    // You can now make an API call to save the product
  };
  // Handle creating zone (you can send this data to an API or store it somewhere)
  const handleCreateZone = (zoneData) => {
    console.log("Zone Data: ", zoneData);
    // API call to create the zone can go here
  };
  return (
    <Container>
      {/* Filters */}
      <Grid container spacing={2} marginBottom={4}>
        <Grid item xs={4}>
          <Select fullWidth displayEmpty>
            <MenuItem value="">Enter State</MenuItem>
            <MenuItem value="state1">Telangana</MenuItem>
            <MenuItem value="state2">Andra Pradesh(A.P)</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={4}>
          <Select fullWidth displayEmpty>
            <MenuItem value="">Enter City</MenuItem>
            <MenuItem value="city1">City 1</MenuItem>
            <MenuItem value="city2">City 2</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={4}>
          <Select fullWidth displayEmpty>
            <MenuItem value="">Enter Zone</MenuItem>
            <MenuItem value="zone1">Zone 1</MenuItem>
            <MenuItem value="zone2">Zone 2</MenuItem>
          </Select>
        </Grid>
      </Grid>

      {/* Product Grid */}
      <Grid container spacing={2}>
        {products.map((product, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Card>
              <CardContent>
                <div style={{ backgroundColor: "#E0E0E0", height: 150 }} />
                {editMode ? (
                  <>
                    <TextField
                      fullWidth
                      label="Product Name"
                      value={product.productName}
                      onChange={(e) =>
                        handleInputChange(index, "productName", e.target.value)
                      }
                    />
                    <TextField
                      fullWidth
                      label="Price"
                      value={product.price}
                      onChange={(e) =>
                        handleInputChange(index, "price", e.target.value)
                      }
                      style={{ marginTop: 8 }}
                    />
                  </>
                ) : (
                  <>
                    <Typography variant="h6" style={{ marginTop: 8 }}>
                      {product.productName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {product.price}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Action Buttons */}
      <Grid container justifyContent="flex-end" spacing={2} marginTop={4}>
        {/* Edit/Save Button */}
        <Grid item>
          <Button variant="outlined" onClick={handleEdit}>
            {editMode ? "Save" : "Edit"}
          </Button>
        </Grid>

        {/* Create Zone and Add Product Buttons */}
        {!editMode && (
          <>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => setCreateZoneOpen(true)}
              >
                Create Zone
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => setAddProductOpen(true)}
              >
                Add Product
              </Button>
            </Grid>
          </>
        )}

        {/* Cancel Button */}
        {editMode && (
          <Grid item>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </Grid>
        )}
      </Grid>

      {/* Pagination */}
      <Grid container justifyContent="center" marginTop={4}>
        <Pagination count={10} color="primary" />
      </Grid>

      {/* Create Zone Modal */}
      <CreateZoneModal
        open={createZoneOpen}
        handleClose={() => setCreateZoneOpen(false)}
        handleCreateZone={handleCreateZone}
      />
    </Container>
  );
};

export default ProductList;
