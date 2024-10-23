import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { useTheme } from "@mui/material/styles"; // Import the theme hook

const DocumentPreviewComponent = ({
  isOpen,
  handleClose,
  document,
  handleDelete,
  handleDownload,
}) => {
  const theme = useTheme(); // Get the current theme

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
          bgcolor:
            theme.palette.mode === "dark" ? "grey.900" : "background.paper", // Adjust background for dark mode
          maxWidth: "400px",
          width: "100%",
          maxHeight: "90vh",
          mx: "auto",
          mt: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: "8px", // Add some border-radius for better aesthetics
        }}
      >
        <Typography
          variant="h6"
          id="document-preview-title"
          sx={{ mb: 2, textAlign: "center", color: theme.palette.text.primary }} // Adjust text color for dark mode
        >
          {document?.name || "Document Preview"}
        </Typography>

        {/* Document Image/Preview */}
        <Box
          sx={{
            width: "100%",
            height: "250px",
            backgroundColor:
              theme.palette.mode === "dark" ? "grey.800" : "grey.300", // Adjust background color for dark mode
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
            borderRadius: "4px", // Slight border-radius for preview area
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.mode === "dark" ? "grey.300" : "white", // Adjust text color for dark mode
            }}
          >
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
