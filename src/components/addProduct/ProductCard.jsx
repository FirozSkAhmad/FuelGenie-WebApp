import React, { useState } from "react";
import Slider from "react-slick";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Chip,
  Stack,
  Paper,
  Tooltip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api from "../../utils/api";
import EditProductModal from "./EditProductModal";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../../utils/permissionssHelper";
const ProductCard = ({ product, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const permissions = usePermissions();
  const navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    adaptiveHeight: true,
    centerMode: true,
    fade: true,
    autoplay: true, // Autoplay the carousel
    autoplaySpeed: 3000, // Autoplay interval
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const deletedBy = localStorage.getItem("userName");
      const roleId = localStorage.getItem("roleId");

      await api.delete(
        `/products/zone-prod-mgr/delete-product/${product.productId}/${product.zoneId}`,
        {
          data: { deletedBy, roleId },
        }
      );

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false);
    }
  };
  const moveToDetailPage = () => {
    navigate(
      `/products/zone-prod-mgr/price-history-by-zone-product/${product.zoneId}/${product.productId}`
    );
  };
  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 8,
        },
      }}
    >
      {/* Image Slider Section */}
      <Box
        sx={{
          position: "relative",
          height: 240,
          overflow: "hidden",
          "& .slick-slider, & .slick-list, & .slick-track": {
            height: "100%",
          },
          "& .slick-slide > div": {
            height: "100%",
          },
          "& .slick-dots": {
            bottom: 8,
            "& li button:before": {
              color: "#fff",
            },
            "& li.slick-active button:before": {
              color: "#fff",
            },
          },
        }}
        onClick={moveToDetailPage}
      >
        <Slider {...settings}>
          {product.media.map((url, index) => (
            <Box
              key={index}
              sx={{
                height: "100%",
                position: "relative",
              }}
            >
              <CardMedia
                component="img"
                image={url}
                alt={`${product.name} - Image ${index + 1}`}
                sx={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          ))}
        </Slider>
      </Box>

      {/* Content Section */}
      <CardContent
        sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Stack spacing={2} sx={{ height: "100%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 600,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                flex: 1,
                mr: 1,
              }}
            >
              {product.name}
            </Typography>
            <Typography
              variant="h6"
              color="primary"
              sx={{
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              ₹{product.price.toLocaleString()}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Chip
              label={`Zone: ${product.zoneId}`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`ID: ${product.productId}`}
              size="small"
              variant="outlined"
            />
          </Stack>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              mt: "auto",
            }}
          >
            <Tooltip
              title={
                permissions.update
                  ? "Edit"
                  : "You don't have permission to edit"
              }
              arrow
            >
              <span>
                <IconButton
                  size="small"
                  onClick={() => setOpenEditModal(true)}
                  disabled={!permissions.update}
                  sx={{
                    "&:hover": {
                      color: "primary.main",
                      bgcolor: "primary.lighter",
                    },
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip
              title={
                loading
                  ? "Action in progress..."
                  : permissions.delete
                  ? "Delete"
                  : "You don't have permission to delete"
              }
              arrow
            >
              <span>
                <IconButton
                  size="small"
                  onClick={() => setOpenDeleteDialog(true)}
                  disabled={loading || !permissions.delete}
                  sx={{
                    "&:hover": {
                      color: "error.main",
                      bgcolor: "error.lighter",
                    },
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Stack>
      </CardContent>

      {/* Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          elevation: 8,
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle
          sx={{
            pb: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Button onClick={() => setOpenDeleteDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <EditProductModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        product={product}
        onSave={onUpdate}
      />
    </Card>
  );
};

export default ProductCard;
