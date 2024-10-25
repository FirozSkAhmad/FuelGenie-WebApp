import React, { useState } from "react";
import Slider from "react-slick";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { toast } from "react-toastify"; // Import Toastify
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api from "../../utils/api";

const ProductCard = ({ product, onDeleteSuccess }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  const handleDelete = async () => {
    setLoading(true); // Set loading state to true
    try {
      await api.delete(`/products/delete-product/${product.productId}`);
      toast.success("Product deleted successfully!"); // Show success alert

      if (onDeleteSuccess) {
        onDeleteSuccess(); // Call the function to refresh the product list
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product."); // Show error alert
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: 2,
        boxShadow: theme.shadows[2],
        transition: "transform 0.3s",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    >
      {/* Media Carousel */}
      <Box sx={{ position: "relative", height: "200px" }}>
        <Slider {...settings}>
          {product.media.map((url, index) => (
            <div key={index}>
              <CardMedia
                component="img"
                src={url}
                alt={`${product.name} - Image ${index + 1}`}
                sx={{
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </Slider>
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          {product.name}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Zone ID: {product.zoneId}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Product ID: {product.productId}
          </Typography>
          <Typography
            variant="h6"
            color="primary"
            sx={{ mt: 1, fontWeight: 600 }}
          >
            ₹{product.price}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: "auto",
          }}
        >
          <Box>
            <IconButton
              size="small"
              onClick={() => console.log("Edit product:", product)}
              sx={{ mr: 1 }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleDelete} disabled={loading}>
              <DeleteIcon fontSize="small" />
              {loading && <span style={{ marginLeft: 4 }}>Loading...</span>}
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
