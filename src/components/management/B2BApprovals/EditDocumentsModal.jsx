import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import {
  PictureAsPdf,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import DocumentViewerModal from "./DocumentViewerModal"; // Import the DocumentViewerModal

const EditDocumentsModal = ({
  openModal,
  handleCloseModal,
  firmType,
  handleFirmTypeChange,
  updatedCustomer,
  handleDocumentChange,
  handleUploadNewDocument,
  requiredDocuments,
  isSaveDisabled,
  handleSaveDocuments,
  setUpdatedCustomer,
  setTouchedFields,
}) => {
  const [openViewModal, setOpenViewModal] = useState(false); // State to control the DocumentViewerModal
  const [documentUrl, setDocumentUrl] = useState(""); // State to store the document URL

  const handleViewDocument = (docValue) => {
    if (docValue instanceof File) {
      // If it's a file, create a temporary URL
      const fileUrl = URL.createObjectURL(docValue);
      setDocumentUrl(fileUrl);
    } else if (typeof docValue === "string" && docValue.startsWith("http")) {
      // If it's a URL, use it directly
      setDocumentUrl(docValue);
    }
    setOpenViewModal(true); // Open the modal
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false); // Close the modal
    setDocumentUrl(""); // Clear the document URL
  };

  return (
    <>
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="md"
        scroll="paper"
      >
        <DialogTitle>Edit Documents</DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth margin="normal">
            <InputLabel>Firm Type</InputLabel>
            <Select
              value={firmType}
              onChange={handleFirmTypeChange}
              label="Firm Type"
            >
              <MenuItem value="PROPRIETORSHIP">Proprietorship</MenuItem>
              <MenuItem value="PARTNERSHIP">Partnership</MenuItem>
              <MenuItem value="PRIVATE LTD / LTD.">Private Limited</MenuItem>
            </Select>
          </FormControl>

          {requiredDocuments.map((docKey) => {
            const docValue = updatedCustomer.documents?.[docKey];
            const isPdfField = docKey.endsWith("PdfUrl");

            // Extract the file name for PDF fields
            const fileName =
              isPdfField && docValue
                ? docValue instanceof File
                  ? docValue.name // Use the file name if it's a File object
                  : docValue.split("/").pop() // Extract the file name from the URL
                : ""; // Default to empty string

            return (
              <div key={docKey}>
                {isPdfField ? (
                  <>
                    <TextField
                      name={docKey}
                      label={docKey
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())
                        .replace(/PdfUrl/g, " PDF")
                        .replace(/Number/g, "")}
                      value={fileName} // Display the file name
                      fullWidth
                      margin="normal"
                      InputProps={{
                        readOnly: true, // Make the field read-only
                      }}
                    />
                    <Box
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "16px",
                      }}
                    >
                      {fileName && (
                        <Typography
                          variant="body1"
                          style={{ fontStyle: "italic" }}
                        >
                          {fileName}
                        </Typography>
                      )}
                      <Button
                        variant="contained"
                        startIcon={<PictureAsPdf />}
                        onClick={() => handleViewDocument(docValue)} // Open the DocumentViewerModal
                        disabled={!docValue} // Disable if no file or URL is available
                      >
                        {docValue ? "View PDF" : "Not Uploaded"}
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<CloudUploadIcon />}
                        onClick={() => handleUploadNewDocument(docKey)}
                      >
                        Upload New
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => {
                          // Clear the file or URL for this field
                          setUpdatedCustomer((prev) => ({
                            ...prev,
                            documents: {
                              ...prev.documents,
                              [docKey]: null,
                            },
                          }));
                          // Mark the field as touched
                          setTouchedFields((prev) => ({
                            ...prev,
                            [docKey]: true,
                          }));
                        }}
                        disabled={!docValue} // Disable if no file or URL is available
                      >
                        Clear
                      </Button>
                    </Box>
                  </>
                ) : (
                  // Non-PDF fields (e.g., gstNumber, aadhaarNumber)
                  <TextField
                    name={docKey}
                    label={docKey
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())
                      .replace(/Number/g, "")}
                    value={docValue || ""} // Use the actual value
                    onChange={handleDocumentChange}
                    fullWidth
                    margin="normal"
                  />
                )}
              </div>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={handleCloseModal}
            style={{ marginRight: "10px" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveDocuments}
            color="primary"
            disabled={isSaveDisabled()}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        openViewModal={openViewModal}
        handleCloseModal={handleCloseViewModal}
        documentUrl={documentUrl}
      />
    </>
  );
};

export default EditDocumentsModal;
