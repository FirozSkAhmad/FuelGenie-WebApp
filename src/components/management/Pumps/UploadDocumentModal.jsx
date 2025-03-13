import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const UploadDocumentModal = ({ open, onClose, onUpload }) => {
  const [documentName, setDocumentName] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentFile(file);
      setFileName(file.name);
    }
  };

  const handleUpload = async () => {
    if (!documentName || !documentFile) {
      alert("Please provide a document name and file.");
      return;
    }

    setLoading(true); // Start loading
    try {
      console.log(documentName, documentFile);
      await onUpload(documentName, documentFile);
      setDocumentName("");
      setDocumentFile(null);
      setFileName("");
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload the document. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Upload Document</DialogTitle>
      <DialogContent>
        <TextField
          label="Document Name"
          fullWidth
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            disabled={loading} // Disable during loading
          >
            Choose File
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              hidden
            />
          </Button>
          <Typography variant="body1">
            {fileName || "No file chosen"}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleUpload} color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Upload"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDocumentModal;
