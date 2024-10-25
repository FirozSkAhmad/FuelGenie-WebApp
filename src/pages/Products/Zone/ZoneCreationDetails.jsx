import React, { useState, useEffect } from "react";
import {
  Box,
  Breadcrumbs,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Link,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  useTheme,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress, // Import CircularProgress for the spinner
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../utils/api";
import AddProductModal from "../../../components/addProduct/AddProductModal";
import ProductCard from "../../../components/addProduct/ProductCard";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const ZoneCreationDetails = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPincode, setNewPincode] = useState("");
  const { zoneID } = useParams();
  const [pincodes, setPincodes] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingPincodes, setLoadingPincodes] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const [addProductOpen, setAddProductOpen] = useState(false);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddPincode = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewPincode("");
  };

  const handleSavePincode = () => {
    if (newPincode) {
      setPincodes([...pincodes, newPincode]);
      handleCloseModal();
    }
  };
  const handleSaveProduct = async (productData) => {
    console.log("Product Data: ", productData);

    try {
      // Initialize FormData
      const formData = new FormData();
      formData.append("zoneId", zoneID);
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("units", productData.units);
      formData.append("gstPercentage", productData.gstPercentage);

      // Append each file in the media array to FormData
      productData.media.forEach((file, index) => {
        formData.append("media", file); // Adjust the key if the backend expects something else
      });

      // Make the API request with FormData
      const response = await api.post(
        "/products/add-product-to-zone",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("Product saved successfully:", response.data);

        // Update products state with new product
        setProducts([...products, productData]);
        fetchProducts();
        // Optionally, reset the form or show a success message here
      } else {
        console.error("Failed to save product:", response);
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEdit = (pincode) => {
    console.log("Edit pincode:", pincode);
  };

  const handleDelete = (pincode) => {
    setPincodes(pincodes.filter((p) => p !== pincode));
  };
  // Fetch pincodes on component mount or when zoneID changes
  useEffect(() => {
    const fetchPincodes = async () => {
      try {
        setLoadingPincodes(true);
        const response = await api.get(`/products/all-pincodes/${zoneID}`);

        // Check if response is ok
        if (response.status !== 200) {
          throw new Error(response.message || "Failed to fetch pincodes");
        }

        // Directly set the array of pincodes from the response
        setPincodes(response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingPincodes(false);
      }
    };

    fetchPincodes();
  }, [zoneID]);

  // Fetch products
  const fetchProducts = async () => {
    if (activeTab === 1) {
      try {
        setLoadingProducts(true);
        const response = await api.get(`/products/products-by-zone/${zoneID}`);

        // Check if the response is successful and contains a products array
        if (response.status === 200 && Array.isArray(response.data.products)) {
          setProducts(response.data.products); // Set products if valid
        } else {
          setProducts([]); // Ensure products is an empty array if not valid
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingProducts(false);
      }
    }
  };

  const handleRefreshProducts = () => {
    fetchProducts();
    console.log("refectch"); // Call fetchProducts when refreshing
  };

  // Fetch products on component mount or when activeTab or zoneID changes
  useEffect(() => {
    fetchProducts();
  }, [activeTab, zoneID]);

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 4, bgcolor: theme.palette.background.default }}
    >
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link
          underline="hover"
          color="inherit"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          Home
        </Link>
        <Link
          underline="hover"
          color="inherit"
          onClick={(e) => {
            e.preventDefault();
            navigate("/products");
          }}
        >
          Products
        </Link>
        <Link
          underline="hover"
          color="inherit"
          onClick={(e) => {
            e.preventDefault();
            navigate("/location-product-list");
          }}
        >
          Location Product List
        </Link>
        <Link
          underline="hover"
          color="inherit"
          onClick={(e) => {
            e.preventDefault();
            navigate("/view-pincodes");
          }}
        >
          View Pincodes
        </Link>
        <Typography color="text.primary">Product List</Typography>
      </Breadcrumbs>

      {/* Title */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      ></Box>

      {/* Tabs */}
      <Paper sx={{ width: "100%", mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="zone creation tabs"
          >
            <Tab label="Pincodes" />
            <Tab label="Products" />
          </Tabs>
        </Box>

        {/* Pincodes Tab */}
        <TabPanel value={activeTab} index={0}>
          {loadingPincodes ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress /> {/* Spinner for loading state */}
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : pincodes.length === 0 ? ( // Check if no data is available
            <Typography>No pincodes available</Typography>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="pincodes table">
                <TableHead>
                  <TableRow
                    sx={{ backgroundColor: theme.palette.background.default }}
                  >
                    <TableCell>Pincodes</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pincodes.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:hover": {
                          backgroundColor: theme.palette.background.default,
                        },
                      }}
                    >
                      <TableCell>{row}</TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "center",
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(row)}
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(row)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleAddPincode}
              sx={{
                borderRadius: "20px",
                textTransform: "none",
                backgroundColor: "#1976d2",
              }}
            >
              Add Pincode
            </Button>
          </Box>
        </TabPanel>

        {/* Products Tab */}
        <TabPanel value={activeTab} index={1}>
          {loadingProducts ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress /> {/* Spinner for loading state */}
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : products.length === 0 ? ( // Check if no data is available
            <Typography>No products available</Typography>
          ) : (
            <Grid container spacing={2}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.productId}>
                  <ProductCard
                    product={product}
                    onDeleteSuccess={handleRefreshProducts}
                  />
                </Grid>
              ))}
            </Grid>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => setAddProductOpen(true)}
              sx={{
                borderRadius: "20px",
                textTransform: "none",
                backgroundColor: "#1976d2",
              }}
            >
              Add Product
            </Button>
          </Box>
        </TabPanel>
      </Paper>
      {/* Add Product Modal */}
      <AddProductModal
        open={addProductOpen}
        handleClose={() => setAddProductOpen(false)}
        handleSave={handleSaveProduct}
      />
      {/* Modal for adding a new pincode */}
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Add Pincode</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Pincode"
            type="text"
            fullWidth
            variant="outlined"
            value={newPincode}
            onChange={(e) => setNewPincode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSavePincode}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ZoneCreationDetails;
