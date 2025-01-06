import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Button,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import api from "../../../utils/api";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import RemoveIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify"; // Import toast for notifications
import { usePermissions } from "../../../utils/permissionssHelper";
const BowserCreationDetail = () => {
  const { bowserId } = useParams();
  const [bowserDetails, setBowserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedFields, setUpdatedFields] = useState({
    brand: "",
    model: "",
    capacity: "",
  });
  const [removedDocs, setRemovedDocs] = useState([]);
  const [newDocument, setNewDocument] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const permissions = usePermissions(); // Get permissions
  // Fetch Bowser Details
  useEffect(() => {
    setLoading(true);
    api
      .get(`/admin/bowser-creation/get-bowserInf/${bowserId}`)
      .then((response) => {
        setBowserDetails(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bowser details:", error);
        setLoading(false);
      });
  }, [bowserId]);

  // Handle Edit Button Click
  const handleEditClick = () => {
    setEditMode(true);
    setUpdatedFields({
      brand: bowserDetails.brand,
      model: bowserDetails.vehicleModel,
      rcNumber: bowserDetails.rcNumber,
      capacity: bowserDetails.capacity,
    });
  };

  // Handle Form Field Changes
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setUpdatedFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  // Handle Submit Edit Form
  const handleSubmitEdit = () => {
    const data = {
      updatedFields,
      removedDocs,
    };

    setLoading(true); // Show loading while saving
    api
      .patch(`/admin/bowser-creation/edit-bowserDetails/${bowserId}`, data)
      .then(() => {
        setEditMode(false);
        // Optionally, fetch new data after update
        setBowserDetails({
          ...bowserDetails,
          ...updatedFields,
        });
        toast.success("Bowser details updated successfully!"); // Show success toast
      })
      .catch((error) => {
        console.error("Error updating bowser details:", error);
        toast.error("Failed to update bowser details."); // Show error toast
      })
      .finally(() => setLoading(false)); // Hide loading after API call
  };

  // Handle Cancel Edit
  const handleCancelEdit = () => {
    setEditMode(false);
    setUpdatedFields({
      brand: bowserDetails.brand,
      model: bowserDetails.vehicleModel,
      capacity: bowserDetails.capacity,
    });
  };

  // Handle Remove Document
  const handleRemoveDoc = (docId) => {
    // Remove document from the Documents array
    setBowserDetails((prevDetails) => ({
      ...prevDetails,
      Documents: prevDetails.Documents.filter(
        (doc) => doc.documentId !== docId
      ),
    }));
    setRemovedDocs((prevDocs) => [...prevDocs, docId]);
  };

  // Handle Add Document
  const handleAddDocument = () => {
    const formData = new FormData();
    formData.append("document", newDocument);

    setLoading(true); // Show loading while adding document
    api
      .patch(`/admin/bowser-creation/add-documents/${bowserId}`, formData)
      .then(() => {
        setOpenDialog(false);
        toast.success("Document added successfully!"); // Success toast
      })
      .catch((error) => {
        console.error("Error adding document:", error);
        toast.error("Failed to add document."); // Error toast
      })
      .finally(() => setLoading(false)); // Hide loading after API call
  };

  // Loading State
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!bowserDetails) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          Failed to fetch bowser details.
        </Typography>
      </Box>
    );
  }

  const { brand, vehicleModel, rcNumber, capacity, Documents } = bowserDetails;

  return (
    <Box sx={{ p: 3 }}>
      <BreadcrumbNavigation />
      <Typography variant="h4" gutterBottom>
        Bowser Details
      </Typography>

      {/* Display Bowser Details */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
          boxShadow: 3,
          border: "1px solid #E0E0E0",
        }}
      >
        <CardContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, padding: 3 }}
        >
          {/* Details Section */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
              <strong>Brand:</strong> {brand}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
              <strong>Vehicle Model:</strong> {vehicleModel}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
              <strong>RC Number:</strong> {rcNumber}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
              <strong>Capacity:</strong> {capacity} Liters
            </Typography>
          </Box>

          {/* Divider between details and action */}
          <Divider sx={{ my: 2 }} />

          {/* Edit Button Section */}
          {!editMode && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <IconButton
                color="primary"
                onClick={handleEditClick}
                sx={{
                  borderRadius: "8px",
                  backgroundColor: "#1976D2",
                  color: "white",
                  padding: "8px",
                  "&:hover": {
                    backgroundColor: "#1565C0",
                  },
                }}
                disabled={!permissions.update}
                size="large"
              >
                <EditIcon />
              </IconButton>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Edit Form */}
      {editMode && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6">Edit Bowser Details</Typography>
            <TextField
              label="Brand"
              variant="outlined"
              fullWidth
              margin="normal"
              name="brand"
              value={updatedFields.brand}
              onChange={handleFieldChange}
            />
            <TextField
              label="Model"
              variant="outlined"
              fullWidth
              margin="normal"
              name="model"
              value={updatedFields.model}
              onChange={handleFieldChange}
            />
            <TextField
              label="RC Number"
              variant="outlined"
              fullWidth
              margin="normal"
              name="rcNumber"
              value={updatedFields.rcNumber}
              onChange={handleFieldChange}
            />
            <TextField
              label="Capacity"
              variant="outlined"
              fullWidth
              margin="normal"
              name="capacity"
              value={updatedFields.capacity}
              onChange={handleFieldChange}
            />
          </CardContent>
        </Card>
      )}

      {/* Documents List */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Documents
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
          sx={{ mt: 2 }}
          disabled={!permissions.update}
        >
          Add Document
        </Button>
      </Box>
      <Box>
        {Documents.map((doc) => (
          <Card key={doc.documentId} sx={{ mb: 2 }}>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body1">{doc.documentName}</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {/* View Button */}
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    padding: "10px 20px",
                    borderRadius: 2,
                    fontWeight: "600",
                    "&:hover": {
                      backgroundColor: "#1976D2",
                    },
                  }}
                  onClick={() => setSelectedDoc(doc.filePath)}
                >
                  View
                </Button>

                {/* Download Button */}
                <Button
                  variant="outlined"
                  color="primary"
                  component="a"
                  href={doc.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    padding: "10px 20px",
                    borderRadius: 2,
                    fontWeight: "600",
                    borderColor: "#1976D2",
                    "&:hover": {
                      borderColor: "#1565C0",
                      backgroundColor: "#E3F2FD",
                    },
                  }}
                >
                  Download
                </Button>

                {/* Remove Button - Only visible in edit mode */}
                {editMode && (
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{
                      padding: "10px 16px",
                      borderRadius: 2,
                      fontWeight: "600",
                      "&:hover": {
                        backgroundColor: "#F44336",
                        borderColor: "#D32F2F",
                      },
                    }}
                    onClick={() => handleRemoveDoc(doc.documentId)}
                  >
                    <RemoveIcon sx={{ fontSize: "20px" }} />
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
        {/* Save Changes and Cancel Buttons */}
        {editMode && (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSubmitEdit}
              sx={{ mt: 2 }}
            >
              Save Changes
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancelEdit}
              sx={{ mt: 2 }}
            >
              Cancel
            </Button>
          </Box>
        )}
      </Box>

      {/* Modal for Document Preview */}
      <Modal
        open={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "80%",
            height: "80%",
            backgroundColor: "white",
            boxShadow: 24,
            p: 2,
          }}
        >
          <iframe
            src={selectedDoc}
            title="Document Preview"
            style={{ width: "100%", height: "100%" }}
          ></iframe>
        </Box>
      </Modal>

      {/* Add Document Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Document</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Document</InputLabel>
            <Select
              value={newDocument}
              onChange={(e) => setNewDocument(e.target.value)}
            >
              {/* Optionally, list file types */}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddDocument}
          >
            Add Document
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BowserCreationDetail;
