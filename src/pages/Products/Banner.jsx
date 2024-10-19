import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";

// Sample banner data
const initialBanners = [
  {
    id: 1,
    image:
      "https://img.freepik.com/free-psd/fashion-sale-banner-template_23-2148935598.jpg?w=1380&t=st=1729344805~exp=1729345405~hmac=a8c9817a61e78083ffc621b10cdb68e39195dc55e585d2a41764170575ac2486",
    label: "Own a business, Get Credit Upto 1 Crore",
    redirectLink: "https://example.com",
  },
  {
    id: 2,
    image:
      "https://img.freepik.com/free-psd/modern-sales-banner-template_23-2148995446.jpg?w=1380&t=st=1729344879~exp=1729345479~hmac=1ffc9feea8342305f98ea34d2a90552d0092dd6eff846279a8186a83a1a018fd",
    label: "Own a business, Get Credit Upto 1 Crore",
    redirectLink: "https://example.com",
  },
  {
    id: 3,
    image:
      "https://img.freepik.com/free-psd/modern-sales-banner-template_23-2148995445.jpg?w=1380&t=st=1729344949~exp=1729345549~hmac=ff3a9dc39374c51c8f2c61f446dfdb4c483964e7c90ece8530216b115159e112",
    label: "Own a business, Get Credit Upto 1 Crore",
    redirectLink: "https://example.com",
  },
];

const Banner = () => {
  const [banners, setBanners] = useState(initialBanners);
  const [openUpload, setOpenUpload] = useState(false); // State to control upload modal
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State to control delete confirmation dialog
  const [bannerToDelete, setBannerToDelete] = useState(null); // Store the banner selected for deletion
  const [newBanner, setNewBanner] = useState({
    image: "",
    label: "",
    redirectLink: "",
  });

  // Handle banner deletion
  const handleDelete = () => {
    const updatedBanners = banners.filter(
      (banner) => banner.id !== bannerToDelete
    );
    setBanners(updatedBanners);
    setOpenDeleteDialog(false); // Close the delete confirmation dialog
  };

  // Open the delete confirmation dialog
  const confirmDelete = (id) => {
    setBannerToDelete(id);
    setOpenDeleteDialog(true);
  };

  // Handle input changes in the modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBanner((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    setBanners([...banners, { ...newBanner, id: banners.length + 1 }]);
    setOpenUpload(false);
    setNewBanner({
      image: "",
      label: "",
      redirectLink: "",
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Title */}
      <Typography variant="h4" gutterBottom>
        Banners
      </Typography>
      <Typography variant="h6" gutterBottom>
        Banner's Uploader
      </Typography>

      {/* Upload Banner Button */}
      <Button
        variant="outlined"
        startIcon={<CloudUploadIcon />}
        sx={{ mb: 3 }}
        onClick={() => setOpenUpload(true)} // Open the upload modal
      >
        Upload Banner
      </Button>

      {/* Banner List */}
      <Grid container spacing={3}>
        {banners.map((banner) => (
          <Grid item xs={12} key={banner.id}>
            <Card sx={{ display: "flex", alignItems: "center" }}>
              {/* Banner Image */}
              <CardMedia
                component="img"
                sx={{ width: 250 }}
                image={banner.image} // Assuming you have the image locally or from a URL
                alt={banner.label}
              />

              {/* Banner Info */}
              <Box
                sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
              >
                <CardContent>
                  <Typography variant="h6">{banner.label}</Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 1 }}
                    onClick={() => window.open(banner.redirectLink, "_blank")}
                  >
                    Go to Link
                  </Button>
                </CardContent>
              </Box>

              {/* Delete Button */}
              <IconButton onClick={() => confirmDelete(banner.id)}>
                <DeleteIcon />
              </IconButton>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Upload Modal */}
      <Dialog open={openUpload} onClose={() => setOpenUpload(false)}>
        <DialogTitle>Upload Banner</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="label"
            label="Title"
            fullWidth
            variant="outlined"
            value={newBanner.label}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="image"
            label="Image URL"
            fullWidth
            variant="outlined"
            value={newBanner.image}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="redirectLink"
            label="Redirect Link"
            fullWidth
            variant="outlined"
            value={newBanner.redirectLink}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpload(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            startIcon={<AddIcon />}
          >
            Add Banner
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this banner?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="secondary"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Banner;
