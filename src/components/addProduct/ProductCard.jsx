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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api from "../../utils/api";
import EditProductModal from "./EditProductModal"; // Import the modal

const ProductCard = ({ product, onUpdate }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for delete dialog

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const deletedBy = localStorage.getItem("userName");
      const roleId = localStorage.getItem("roleId");

      await api.delete(
        `/products/delete-product/${product.productId}/${product.zoneId}`,
        {
          data: { deletedBy, roleId },
        }
      );

      toast.success("Product deleted successfully!");

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product.");
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false); // Close the dialog after deletion
    }
  };

  return (
    <>
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
                onClick={() => setOpenEditModal(true)}
                sx={{ mr: 1 }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setOpenDeleteDialog(true)} // Open delete dialog
                disabled={loading}
              >
                <DeleteIcon fontSize="small" />
                {loading && <span style={{ marginLeft: 4 }}>Loading...</span>}
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* EditProductModal */}
      <EditProductModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        product={product}
        onSave={onUpdate}
      />
    </>
  );
};

export default ProductCard;
