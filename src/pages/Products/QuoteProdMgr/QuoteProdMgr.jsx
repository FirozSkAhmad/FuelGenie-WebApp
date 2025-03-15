import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  FiberManualRecord as BulletPointIcon,
  Add as AddProductIcon,
} from "@mui/icons-material";
import CreateQuoteProductModal from "../../../components/addProduct/quoteprodmgr/CreateQuoteProductModal";

// Import Slick Carousel
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { usePermissions } from "../../../utils/permissionssHelper";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";
const QuoteProdMgr = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false); // State for modal visibility
  const permissions = usePermissions();
  // Fetch products using Axios
  const fetchProducts = async () => {
    try {
      const response = await api.get(
        "/products/quote-prod-mgr/get-quote-products"
      );
      if (response.data && response.data.data) {
        setProducts(response.data.data);
      } else {
        throw new Error("No data found");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle modal open/close
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  // Handle product creation success
  const handleProductCreated = () => {
    fetchProducts(); // Refresh the product list
    setSnackbarMessage("Product created successfully!");
    setSnackbarOpen(true);
    handleModalClose();
  };

  // Slick Carousel settings
  const carouselSettings = {
    dots: false, // Show dots for navigation
    infinite: true, // Infinite looping
    speed: 500, // Transition speed
    slidesToShow: 1, // Number of slides to show at a time
    slidesToScroll: 1, // Number of slides to scroll
    autoplay: true, // Autoplay the carousel
    autoplaySpeed: 3000, // Autoplay interval
    arrows: false, // Show navigation arrows
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center" mt={4}>
        Error: {error}
      </Typography>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <BreadcrumbNavigation />
      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddProductIcon />}
          onClick={handleModalOpen}
          disabled={!permissions?.create}
        >
          Create Product
        </Button>
      </Box>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product.quoteProductId} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              {/* Media Section with Slick Carousel */}
              {product.media?.length > 0 && (
                <Box sx={{ p: 1, borderBottom: "1px solid #e0e0e0" }}>
                  <Slider {...carouselSettings}>
                    {product.media.map((mediaUrl, index) => (
                      <Box key={index} sx={{ textAlign: "center" }}>
                        <img
                          src={mediaUrl}
                          alt={`${product.name} - Media ${index + 1}`}
                          style={{
                            height: "150px",
                            width: "auto",
                            maxWidth: "100%",
                            borderRadius: "4px",
                            margin: "0 auto",
                          }}
                        />
                      </Box>
                    ))}
                  </Slider>
                </Box>
              )}

              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Chip label={product.category} color="primary" size="small" />
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {product.description.paragraph}
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Key Features:
                </Typography>
                <List dense sx={{ py: 0 }}>
                  {product.description.keyFeatures.map((feature, index) => (
                    <ListItem key={index} sx={{ py: 0 }}>
                      <ListItemIcon sx={{ minWidth: 24 }}>
                        <BulletPointIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>

                <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                  Specifications:
                </Typography>
                <List dense sx={{ py: 0 }}>
                  {product.specifications.map((spec, index) => (
                    <ListItem key={index} sx={{ py: 0 }}>
                      <ListItemIcon sx={{ minWidth: 24 }}>
                        <BulletPointIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={spec} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Product Modal */}
      <CreateQuoteProductModal
        open={modalOpen}
        onClose={handleModalClose}
        onProductCreated={handleProductCreated}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default QuoteProdMgr;
