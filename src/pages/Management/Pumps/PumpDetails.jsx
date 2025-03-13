import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../utils/api";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Snackbar,
} from "@mui/material";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import UploadDocumentModal from "../../../components/management/Pumps/UploadDocumentModal";

const PumpDetails = () => {
  const { pumpId } = useParams();
  const [pump, setPump] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Fetch pump details
  const fetchPumpDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/management/pumps/get-pumpDetails/${pumpId}`
      );
      setPump(response.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch pump details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPumpDetails();
  }, [pumpId]);

  // Handle document upload
  const handleUploadDocument = async (documentName, documentFile) => {
    console.log("Document Name:", documentName);
    console.log("File Name:", documentFile.name);
    const formData = new FormData();
    formData.append("documentName", documentName);
    formData.append("documentFile", documentFile);

    try {
      const response = await api.post(
        `/management/pumps/add-docs/${pumpId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchPumpDetails();
      setPump((prevPump) => ({
        ...prevPump,
        documents: [...prevPump.documents, response.data.data],
      }));

      setSnackbar({
        open: true,
        message: "Document uploaded successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to upload document. Please try again.",
        severity: "error",
      });
    }
  };

  // Handle document deletion
  const handleDeleteDocument = async (documentId) => {
    try {
      await api.delete(
        `/management/pumps/${pumpId}/delete-a-doc/${documentId}`
      );
      setPump((prevPump) => ({
        ...prevPump,
        documents: prevPump.documents.filter(
          (doc) => doc.documentId !== documentId
        ),
      }));
      setSnackbar({
        open: true,
        message: "Document deleted successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to delete document. Please try again.",
        severity: "error",
      });
    }
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!pump) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="textSecondary">
          No pump details found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <BreadcrumbNavigation />
      <Typography variant="h4" component="h1" gutterBottom>
        {pump.pumpName}
      </Typography>

      {/* Pump Details Section */}
      <Paper sx={{ p: 3, mt: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Owner: {pump.ownerName}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Contact: {pump.contactNo}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Email: {pump.emailId}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Address: {pump.addressLine}, {pump.city}, {pump.state}, {pump.pincode}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Country: {pump.country}
        </Typography>
      </Paper>

      {/* Documents Section */}
      <Paper sx={{ p: 3, mt: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Documents</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setUploadModalOpen(true)}
          >
            Add Document
          </Button>
        </Box>
        <List>
          {pump.documents.map((doc) => (
            <ListItem
              key={doc.documentId}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteDocument(doc.documentId)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={doc.documentName}
                secondary={
                  <a
                    href={doc.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Document
                  </a>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Instant Products Section */}
      <Paper sx={{ p: 3, mt: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Instant Products
        </Typography>
        <List>
          {pump.instantProducts.map((product) => (
            <ListItem key={product.instantProductId}>
              <ListItemText
                primary={product.name}
                secondary={`Price: ${product.price} ${product.unit}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Document Upload Modal */}
      <UploadDocumentModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUploadDocument}
      />

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PumpDetails;
