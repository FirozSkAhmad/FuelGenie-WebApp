import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

const DocumentUploadModal = ({ open, onClose }) => {
  const [documents, setDocuments] = useState({
    auditFinancial: null,
    gstCertificate: null,
    bankStatement: null,
    aadharCard: null,
    panCard: null,
  });
  const [documentName, setDocumentName] = useState("");

  const handleFileChange = (field, file) => {
    setDocuments((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Submitted documents:", documents);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Upload Documents</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Audit Financial Upload */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Audit Financial,Tax Audit, ITR & Computation
              </Typography>
              <Box display="flex" gap={1}>
                <TextField
                  type="file"
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={(e) =>
                    handleFileChange("auditFinancial", e.target.files[0])
                  }
                  InputProps={{
                    style: { fontSize: "0.875rem" },
                  }}
                />
                <IconButton
                  color="error"
                  onClick={() => handleFileChange("auditFinancial", null)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>

            {/* GST Certificate Upload */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                GST Certificate & GSTR 3B
              </Typography>
              <Box display="flex" gap={1}>
                <TextField
                  type="file"
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={(e) =>
                    handleFileChange("gstCertificate", e.target.files[0])
                  }
                  InputProps={{
                    style: { fontSize: "0.875rem" },
                  }}
                />
                <IconButton
                  color="error"
                  onClick={() => handleFileChange("gstCertificate", null)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>

            {/* Bank Statement Upload */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Bank Statement
              </Typography>
              <Box display="flex" gap={1}>
                <TextField
                  type="file"
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={(e) =>
                    handleFileChange("bankStatement", e.target.files[0])
                  }
                  InputProps={{
                    style: { fontSize: "0.875rem" },
                  }}
                />
                <IconButton
                  color="error"
                  onClick={() => handleFileChange("bankStatement", null)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>

            {/* Aadhar Card Upload */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Aadhar Card
              </Typography>
              <Box display="flex" gap={1}>
                <TextField
                  type="file"
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={(e) =>
                    handleFileChange("aadharCard", e.target.files[0])
                  }
                  InputProps={{
                    style: { fontSize: "0.875rem" },
                  }}
                />
                <IconButton
                  color="error"
                  onClick={() => handleFileChange("aadharCard", null)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>

            {/* Pan Card Upload */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Pan Card
              </Typography>
              <Box display="flex" gap={1}>
                <TextField
                  type="file"
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={(e) =>
                    handleFileChange("panCard", e.target.files[0])
                  }
                  InputProps={{
                    style: { fontSize: "0.875rem" },
                  }}
                />
                <IconButton
                  color="error"
                  onClick={() => handleFileChange("panCard", null)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>

            {/* Document Name Input */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Document Name
              </Typography>
              <Box display="flex" gap={1}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder="Enter Doc Name"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  InputProps={{
                    style: { fontSize: "0.875rem" },
                  }}
                />
                <IconButton
                  color="error"
                  onClick={() => setDocumentName("")}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DocumentUploadModal;
