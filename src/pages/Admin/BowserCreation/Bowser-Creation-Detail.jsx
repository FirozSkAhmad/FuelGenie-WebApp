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
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  // Delete as DeleteIcon,
  // Edit as EditIcon,
  // Upload as UploadIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { RemoveCircleOutline, Edit, Save, Delete } from "@mui/icons-material";
import api from "../../../utils/api";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";
import { toast } from "react-toastify";
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
    rcNumber: "",
    capacity: "",
  });
  const [removedDocs, setRemovedDocs] = useState([]);
  const [documents, setDocuments] = useState([{ docName: "", file: null }]);
  const [openDialog, setOpenDialog] = useState(false);
  const permissions = usePermissions();
  const theme = useTheme();
  const fetchBowserDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/admin/bowser-creation/get-bowserInf/${bowserId}`
      );
      setBowserDetails(response.data.data);
    } catch (error) {
      console.error("Error fetching bowser details:", error);
      toast.error("Failed to fetch bowser details.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBowserDetails();
  }, [bowserId]);

  const handleEditClick = () => {
    setEditMode(true);
    setUpdatedFields({
      brand: bowserDetails.brand,
      model: bowserDetails.vehicleModel,
      rcNumber: bowserDetails.rcNumber,
      capacity: bowserDetails.capacity,
    });
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setUpdatedFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleSubmitEdit = async () => {
    setLoading(true);
    try {
      await api.patch(`/admin/bowser-creation/edit-bowserDetails/${bowserId}`, {
        updatedFields,
        removedDocs,
      });
      setBowserDetails((prevDetails) => ({ ...prevDetails, ...updatedFields }));
      setEditMode(false);
      toast.success("Bowser details updated successfully!");
      fetchBowserDetails();
    } catch (error) {
      console.error("Error updating bowser details:", error);
      toast.error("Failed to update bowser details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setUpdatedFields({
      brand: bowserDetails.brand,
      model: bowserDetails.vehicleModel,
      rcNumber: bowserDetails.rcNumber,
      capacity: bowserDetails.capacity,
    });
  };

  const handleRemoveDoc = (docId) => {
    setBowserDetails((prevDetails) => ({
      ...prevDetails,
      Documents: prevDetails.Documents.filter(
        (doc) => doc.documentId !== docId
      ),
    }));
    setRemovedDocs((prevDocs) => [...prevDocs, docId]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index][field] = value;
    setDocuments(updatedDocuments);
  };

  const handleAddNewDocField = () => {
    setDocuments([...documents, { docName: "", file: null }]);
  };

  const handleRemoveDocField = (index) => {
    const newDocuments = documents.filter((_, idx) => idx !== index);
    setDocuments(newDocuments);
  };
  const handleAddDocument = async () => {
    if (documents.length === 0) {
      toast.error("No documents to add.");
      return;
    }

    const formData = new FormData();

    // Iterate through each document and append to the formData using the docName as the key
    documents.forEach((document) => {
      if (document.docName && document.file) {
        // Use the docName directly as the key
        formData.append(document.docName, document.file); // Append the file with the docName as the key
      } else {
        console.warn("A document is missing a name or file.");
      }
    });

    setLoading(true); // Show loading indicator

    try {
      // Make the PATCH request to add documents
      const response = await api.patch(
        `/admin/bowser-creation/add-documents/${bowserId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure proper content type for file upload
          },
        }
      );

      // Handle successful response
      if (response.status === 200) {
        setOpenDialog(false); // Close the dialog
        toast.success("Documents added successfully!"); // Show success message
        fetchBowserDetails(); // Refetch the bowser details to update the UI
      } else {
        throw new Error("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Error adding documents:", error);
      toast.error("Failed to add documents. Please try again."); // Show error message
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
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

  const { brand, vehicleModel, rcNumber, capacity, isDeleted, Documents } =
    bowserDetails;

  return (
    <Box sx={{ p: 3 }}>
      <BreadcrumbNavigation />
      <Typography variant="h4" gutterBottom>
        Bowser Details
      </Typography>
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              <strong>Brand:</strong> {brand}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              <strong>Vehicle Model:</strong> {vehicleModel}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              <strong>RC Number:</strong> {rcNumber}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              <strong>Capacity:</strong> {capacity} Liters
            </Typography>
            <Typography>
              <strong>Is Deleted:</strong>{" "}
              {isDeleted ? (
                <span style={{ color: "red" }}>Yes</span> // Red text for "Yes"
              ) : (
                <span style={{ color: "green" }}>No</span> // Green text for "No"
              )}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
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
                  "&:hover": { backgroundColor: "#1565C0" },
                }}
                disabled={!permissions.update || isDeleted}
                size="large"
              >
                <Edit />
              </IconButton>
            </Box>
          )}
        </CardContent>
      </Card>
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
          disabled={!permissions.update || isDeleted}
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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setSelectedDoc(doc.filePath)}
                >
                  View
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  component="a"
                  href={doc.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </Button>
                {editMode && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemoveDoc(doc.documentId)}
                  >
                    <Delete />
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
        {editMode && (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Save />}
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
      {/* Document Preview Modal */}
      <Modal
        open={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backdropFilter: "blur(5px)",
        }}
      >
        <Box
          sx={{
            width: "90%",
            maxWidth: "800px",
            height: "90%",
            maxHeight: "600px",
            backgroundColor: theme.palette.background.paper, // Use theme background color
            boxShadow: 24,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Title Bar */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: theme.palette.primary.main, // Use theme primary color
              color: theme.palette.primary.contrastText, // Use theme contrast text color
              p: 2,
            }}
          >
            <Typography variant="h6">Document Preview</Typography>
            <IconButton
              onClick={() => setSelectedDoc(null)}
              sx={{ color: theme.palette.primary.contrastText }} // Use theme contrast text color
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Document Preview */}
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflow: "hidden",
              backgroundColor: theme.palette.background.default, // Use theme background color
            }}
          >
            <iframe
              src={selectedDoc}
              title="Document Preview"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: 4,
              }}
            />
          </Box>
        </Box>
      </Modal>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Documents</DialogTitle>
        <DialogContent>
          {documents.map((document, index) => (
            <Box
              key={index}
              sx={{ mb: 2 }}
              display="flex"
              flexDirection="column"
            >
              <TextField
                label={`Document Name ${index + 1}`}
                variant="outlined"
                fullWidth
                margin="normal"
                value={document.docName}
                onChange={(e) =>
                  handleInputChange(index, "docName", e.target.value)
                }
              />
              <input
                type="file"
                onChange={(e) =>
                  handleInputChange(index, "file", e.target.files[0])
                }
                style={{ marginBottom: "10px" }}
              />
              {documents.length > 1 && (
                <IconButton
                  onClick={() => handleRemoveDocField(index)}
                  color="error"
                  sx={{ alignSelf: "flex-end" }}
                >
                  <RemoveCircleOutline />
                </IconButton>
              )}
            </Box>
          ))}
          <Button
            variant="outlined"
            color="primary"
            onClick={handleAddNewDocField}
            sx={{ mb: 2 }}
          >
            Add New Document Field
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleAddDocument}
            variant="contained"
            color="primary"
          >
            Add Documents
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BowserCreationDetail;
