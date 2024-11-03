import React, { useState, useEffect } from "react";
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
  Snackbar,
  Alert,
  Tooltip,
  useTheme,
  useMediaQuery,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CopyIcon from "@mui/icons-material/ContentCopy";
import api from "../../../utils/api";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [openUpload, setOpenUpload] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [bannerToEdit, setBannerToEdit] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state
  const [newBanner, setNewBanner] = useState({
    title: "",
    bannerImg: null,
    redirectLink: "",
    imageFile: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  const theme = useTheme();
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await api.get("/products/get-banners");
      setBanners(response.data.data || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/products/delete-banner/${bannerToDelete}`);
      setBanners((prev) =>
        prev.filter((banner) => banner.bannerId !== bannerToDelete)
      );
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting banner:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewBanner((prev) => ({ ...prev, imageFile: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", newBanner.title);
    formData.append("redirectLink", newBanner.redirectLink);
    if (newBanner.imageFile) formData.append("bannerImg", newBanner.imageFile);

    try {
      const response = await api.post("/products/create-banner", formData);
      setBanners((prev) => [...prev, response.data.data]);
      resetNewBanner();
      setOpenUpload(false);
    } catch (error) {
      console.error("Error creating banner:", error);
    } finally {
      setLoading(false);
    }
  };

  const openEditBanner = (banner) => {
    setBannerToEdit(banner.bannerId);
    setNewBanner({
      title: banner.title,
      redirectLink: banner.redirectLink,
      imageFile: null, // Keep this null initially for the edit
    });
    setPreviewImage(banner.bannerImg);
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("newTitle", newBanner.title); // Update title
    formData.append("newRedirectLink", newBanner.redirectLink); // Update redirect link
    if (newBanner.imageFile)
      formData.append("newBannerImg", newBanner.imageFile); // Update image if new one is provided

    try {
      await api.patch(`/products/edit-banner/${bannerToEdit}`, formData);
      setOpenEditDialog(false);
      resetNewBanner();
      fetchBanners(); // Fetch the updated banners after editing
    } catch (error) {
      console.error("Error editing banner:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBanner((prev) => ({ ...prev, [name]: value }));
  };

  const resetNewBanner = () => {
    setNewBanner({
      title: "",
      bannerImg: null,
      redirectLink: "",
      imageFile: null,
    });
    setPreviewImage(null);
  };
  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      setSnackbarMessage("Link copied to clipboard!");
      setSnackbarOpen(true);
    });
  };
  // Function to format date
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Banners
      </Typography>
      <Typography variant="h6" gutterBottom>
        Banner's Uploader
      </Typography>

      {banners.length > 0 && (
        <Button
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          sx={{ mb: 3 }}
          onClick={() => setOpenUpload(true)}
        >
          Create Banners
        </Button>
      )}

      <Grid container spacing={3}>
        {banners.length > 0 ? (
          banners.map((banner) => (
            <Grid item xs={12} key={banner.bannerId}>
              <Card sx={{ display: "flex", alignItems: "center" }}>
                <CardMedia
                  component="img"
                  sx={{ width: 250 }}
                  image={banner.bannerImg}
                  alt={banner.title}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <CardContent>
                    <Typography variant="h6">{banner.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Created At: {formatDate(banner.createdAt)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Updated At: {formatDate(banner.updatedAt)}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ mt: 1 }}
                      onClick={() =>
                        window.open(`https://${banner.redirectLink}`, "_blank")
                      }
                    >
                      Go to Link
                    </Button>
                    <Tooltip title="Copy the link" arrow>
                      <IconButton
                        onClick={() => handleCopyLink(banner.redirectLink)}
                      >
                        <CopyIcon />
                      </IconButton>
                    </Tooltip>
                  </CardContent>
                </Box>
                <IconButton onClick={() => openEditBanner(banner)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setBannerToDelete(banner.bannerId);
                    setOpenDeleteDialog(true);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                textAlign: "center",
                mt: 5,
                p: 3,
                border: `1px dashed ${
                  isDarkMode ? theme.palette.grey[700] : "gray"
                }`,
                borderRadius: "8px",
                backgroundColor: isDarkMode
                  ? theme.palette.background.default
                  : "#f9f9f9",
              }}
            >
              <Typography
                variant="h6"
                color={
                  isDarkMode ? theme.palette.text.primary : "text.secondary"
                }
                gutterBottom
              >
                No Banners Available
              </Typography>
              <Typography
                variant="body1"
                color={
                  isDarkMode ? theme.palette.text.secondary : "text.secondary"
                }
              >
                It seems there are no banners to display at the moment.
              </Typography>
              <Typography
                variant="body2"
                color={
                  isDarkMode ? theme.palette.text.secondary : "text.secondary"
                }
                sx={{ mt: 1 }}
              >
                Please add some banners to see them here.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenUpload(true)} // Replace with your function to open the create banner modal
                sx={{ mt: 2 }}
              >
                Create Banner
              </Button>
            </Box>
          </Grid>
        )}

        {/* Snackbar for copy link feedback */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <Backdrop
          open={loading}
          sx={{ color: "#fff", zIndex: theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Grid>

      {/* Upload Modal */}
      <Dialog open={openUpload} onClose={() => setOpenUpload(false)}>
        <DialogTitle>Upload Banner</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="title"
            label="Title"
            fullWidth
            variant="outlined"
            value={newBanner.title}
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
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Upload Image
            <input type="file" hidden onChange={handleImageChange} />
          </Button>
          {previewImage && (
            <Box sx={{ mt: 2, position: "relative" }}>
              <Typography>Image Preview:</Typography>
              <img src={previewImage} alt="Preview" width="100%" />
              <IconButton
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  backgroundColor: "white",
                  color: "red",
                }}
                onClick={() => {
                  resetNewBanner();
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
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

      {/* Edit Modal */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Banner</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="title"
            label="Title"
            fullWidth
            variant="outlined"
            value={newBanner.title}
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
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Upload New Image
            <input type="file" hidden onChange={handleImageChange} />
          </Button>
          {previewImage && (
            <Box sx={{ mt: 2, position: "relative" }}>
              <Typography>Image Preview:</Typography>
              <img src={previewImage} alt="Preview" width="100%" />
              <IconButton
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  backgroundColor: "white",
                  color: "red",
                }}
                onClick={() => {
                  setPreviewImage(null); // Clear preview
                  setNewBanner((prev) => ({ ...prev, imageFile: null })); // Clear image file
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Banner</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this banner?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Banner;
