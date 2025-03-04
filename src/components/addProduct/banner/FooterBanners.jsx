import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Modal,
  Box,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePermissions } from "../../../utils/permissionssHelper";
// Main Component
const FooterBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const permissions = usePermissions();
  // Fetch banners
  const fetchBanners = async () => {
    try {
      const response = await api.get("/products/banner/get-footer-banners");
      setBanners(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle Delete
  const handleDelete = async () => {
    if (!selectedBanner) return;
    try {
      await api.delete(
        `/products/banner/delete-footer-banner/${selectedBanner.footerBannerId}`
      );
      toast.success("Banner deleted successfully");
      fetchBanners();
    } catch (error) {
      toast.error("Failed to delete banner");
    }
    setDeleteDialogOpen(false);
  };

  if (loading) return <CircularProgress />;

  return (
    <div>
      <ToastContainer />
      <Typography variant="h6" gutterBottom>
        Footer Banner's Uploader
      </Typography>
      <Button
        variant="contained"
        startIcon={<CloudUploadIcon />}
        onClick={() => setCreateModalOpen(true)}
        disabled={!permissions.create}
      >
        Create Footer Banners
      </Button>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {banners.map((banner) => (
          <Grid item xs={12} md={4} key={banner._id}>
            <BannerCard
              banner={banner}
              onEdit={() => {
                setSelectedBanner(banner);
                setEditModalOpen(true);
              }}
              onDelete={() => {
                setSelectedBanner(banner);
                setDeleteDialogOpen(true);
              }}
              permissions={permissions}
            />
          </Grid>
        ))}
      </Grid>

      <CreateFooterBannerModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchBanners}
      />

      {selectedBanner && (
        <>
          <EditFooterBannerModal
            open={editModalOpen}
            banner={selectedBanner}
            onClose={() => setEditModalOpen(false)}
            onSuccess={fetchBanners}
          />
          <DeleteConfirmationDialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            onConfirm={handleDelete}
          />
        </>
      )}
    </div>
  );
};

// Banner Card Component
const BannerCard = ({ banner, onEdit, onDelete, permissions }) => (
  <Card>
    <CardMedia
      component="img"
      height="200"
      image={banner.footerBannerImg}
      alt={banner.title}
    />
    <CardContent>
      <Typography variant="h6">{banner.title}</Typography>
      <Typography>Category: {banner.category}</Typography>
      <Typography>Product ID: {banner.productId}</Typography>
      <Box sx={{ mt: 2 }}>
        <Button onClick={onEdit} disabled={!permissions.update}>
          Edit
        </Button>
        <Button color="error" onClick={onDelete} disabled={!permissions.delete}>
          Delete
        </Button>
      </Box>
    </CardContent>
  </Card>
);

// Create Modal Component
const CreateFooterBannerModal = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    footerBannerImg: null,
    category: "",
    productId: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      await api.post("/products/banner/create-footer-banner", data);
      toast.success("Banner created successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to create banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6">Create New Footer Banner</Typography>
        <TextField
          fullWidth
          label="Title"
          margin="normal"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) =>
                setFormData({
                  ...formData,
                  footerBannerImg: e.target.files?.[0] || null,
                })
              }
            />
          </Button>
          <Tooltip
            title={
              formData.footerBannerImg ? formData.footerBannerImg.name : ""
            }
          >
            <Typography
              variant="body1"
              noWrap
              sx={{
                maxWidth: "200px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {formData.footerBannerImg
                ? formData.footerBannerImg.name
                : "No file selected"}
            </Typography>
          </Tooltip>
          {formData.footerBannerImg && (
            <Button
              variant="outlined"
              color="error"
              onClick={() =>
                setFormData({ ...formData, footerBannerImg: null })
              }
            >
              Clear
            </Button>
          )}
        </Box>
        <FormControl fullWidth margin="normal">
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            value={formData.category}
            label="Category"
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <MenuItem value="storage">Storage</MenuItem>
            <MenuItem value="lubricant">Lubricant</MenuItem>
            <MenuItem value="petroleum">Petroleum</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Product ID"
          margin="normal"
          value={formData.productId}
          onChange={(e) =>
            setFormData({ ...formData, productId: e.target.value })
          }
        />
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Create"}
        </Button>
      </Box>
    </Modal>
  );
};

// Edit Modal Component
const EditFooterBannerModal = ({ open, banner, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    newTitle: banner.title,
    newFooterBannerImg: null,
    newCategory: banner.category,
    newProductId: banner.productId,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      await api.patch(
        `/products/banner/edit-footer-banner/${banner.footerBannerId}`,
        data
      );
      toast.success("Banner updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to update banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6">Edit Banner</Typography>
        <TextField
          fullWidth
          label="Title"
          margin="normal"
          value={formData.newTitle}
          onChange={(e) =>
            setFormData({ ...formData, newTitle: e.target.value })
          }
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) =>
                setFormData({
                  ...formData,
                  newFooterBannerImg: e.target.files?.[0] || null,
                })
              }
            />
          </Button>
          <Tooltip
            title={
              formData.newFooterBannerImg
                ? formData.newFooterBannerImg.name
                : ""
            }
          >
            <Typography
              variant="body1"
              noWrap
              sx={{
                maxWidth: "200px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {formData.newFooterBannerImg
                ? formData.newFooterBannerImg.name
                : "No file selected"}
            </Typography>
          </Tooltip>
          {formData.newFooterBannerImg && (
            <Button
              variant="outlined"
              color="error"
              onClick={() =>
                setFormData({ ...formData, newFooterBannerImg: null })
              }
            >
              Clear
            </Button>
          )}
        </Box>
        <FormControl fullWidth margin="normal">
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            value={formData.newCategory}
            label="Category"
            onChange={(e) =>
              setFormData({ ...formData, newCategory: e.target.value })
            }
          >
            <MenuItem value="storage">Storage</MenuItem>
            <MenuItem value="lubricant">Lubricant</MenuItem>
            <MenuItem value="petroleum">Petroleum</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Product ID"
          margin="normal"
          value={formData.newProductId}
          onChange={(e) =>
            setFormData({ ...formData, newProductId: e.target.value })
          }
        />
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Update"}
        </Button>
      </Box>
    </Modal>
  );
};

// Delete Confirmation Dialog
const DeleteConfirmationDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>Are you sure you want to delete this banner?</DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button color="error" onClick={onConfirm}>
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

// Modal Style
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

export default FooterBanners;
