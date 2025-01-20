import React, { useState } from "react";
import {
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  PictureAsPdf,
} from "@mui/icons-material";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import DocumentViewerModal from "./DocumentViewerModal"; // Import the modal
import { usePermissions } from "../../../utils/permissionssHelper";
import { is } from "date-fns/locale";
const OtherDocumentsSection = ({
  customerId,
  otherDocs = [],
  fetchCustomerDetails,
  isAccepted,
}) => {
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openViewModal, setOpenViewModal] = useState(false); // State to control the modal
  const [documentUrl, setDocumentUrl] = useState(""); // State to store the document URL
  const permissions = usePermissions(); // Get the permissions
  const handleUploadOtherDoc = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "application/pdf";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        setLoading(true);
        try {
          const formData = new FormData();
          formData.append(file.name, file); // Use the file name as the key

          const response = await api.put(
            `/management/b2b-approvals/add-otherDocs-to-b2b-registered-customer/${customerId}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          setSnackbarMessage("Document uploaded successfully!");
          toast.success("Document uploaded successfully!");
          setSnackbarOpen(true);
          fetchCustomerDetails(); // Refresh customer details
        } catch (error) {
          console.error("Error uploading document:", error);
          toast.error("Failed to upload document. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };
    fileInput.click();
  };

  const handleDeleteOtherDoc = async (docName) => {
    setLoading(true);
    try {
      const response = await api.delete(
        `/management/b2b-approvals/delete-a-otherDoc/${customerId}/${docName}`
      );

      setSnackbarMessage("Document deleted successfully!");
      toast.success("Document deleted successfully!");
      setSnackbarOpen(true);
      fetchCustomerDetails(); // Refresh customer details
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = (url) => {
    setDocumentUrl(url); // Set the document URL
    setOpenViewModal(true); // Open the modal
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false); // Close the modal
    setDocumentUrl(""); // Clear the document URL
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper style={{ padding: "20px", marginBottom: "20px" }}>
      <Typography variant="h6" gutterBottom>
        Other Documents
      </Typography>
      <Button
        variant="contained"
        startIcon={<CloudUploadIcon />}
        onClick={handleUploadOtherDoc}
        disabled={
          loading || !permissions.update || isAccepted || isAccepted === "false"
        }
        style={{ marginBottom: "20px" }}
      >
        Upload Other Document
      </Button>
      <Grid container spacing={3}>
        {otherDocs.map((doc, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                border: "1px solid #e0e0e0",
                "&:hover": {
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>{doc.name}</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {doc.url.split("/").pop()}
                </Typography>
              </CardContent>
              <CardActions sx={{ marginTop: "auto" }}>
                <Tooltip title="View Document">
                  <IconButton
                    color="primary"
                    onClick={() => handleViewDocument(doc.url)}
                  >
                    <PictureAsPdf />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Document">
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteOtherDoc(doc.name)}
                    disabled={
                      loading ||
                      !permissions.delete ||
                      isAccepted ||
                      isAccepted === "false"
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        openViewModal={openViewModal}
        handleCloseModal={handleCloseViewModal}
        documentUrl={documentUrl}
      />

      {/* Snackbar for Success/Failure Messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default OtherDocumentsSection;
