import React from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";

const DocumentPreviewComponent = ({
  isOpen,
  handleClose,
  document,
  handleDelete,
  handleDownload,
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="document-preview-title"
      aria-describedby="document-preview-description"
    >
      <Box
        sx={{
          p: 2,
          bgcolor: "background.paper",
          maxWidth: "400px",
          width: "100%",
          maxHeight: "90vh",
          mx: "auto",
          mt: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          id="document-preview-title"
          sx={{ mb: 2, textAlign: "center" }}
        >
          {document?.name || "Document Preview"}
        </Typography>

        {/* Document Image/Preview */}
        <Box
          sx={{
            width: "100%",
            height: "250px",
            backgroundColor: "grey.300",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: "white" }}>
            {document?.name || "No Preview Available"}
          </Typography>
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          {/* Delete Button */}
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(document)}
          >
            Delete
          </Button>

          {/* Download Button */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={() => handleDownload(document)}
          >
            Download
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DocumentPreviewComponent;
