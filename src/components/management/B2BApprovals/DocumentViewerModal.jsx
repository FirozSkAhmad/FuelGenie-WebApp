import React, { useState, useRef, useEffect } from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import {
  Close,
  OpenInNew,
  Download,
  ZoomIn,
  ZoomOut,
  Fullscreen,
  FullscreenExit,
} from "@mui/icons-material";

const DocumentViewerModal = ({
  openViewModal,
  handleCloseModal,
  documentUrl,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1); // State for zoom level
  const [isFullscreen, setIsFullscreen] = useState(false); // State for fullscreen mode
  const iframeRef = useRef(null); // Ref for the iframe

  // Handle zoom in
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2)); // Limit zoom to 2x
  };

  // Handle zoom out
  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5)); // Limit zoom to 0.5x
  };

  // Handle fullscreen toggle
  const handleToggleFullscreen = async () => {
    if (iframeRef.current) {
      if (!isFullscreen) {
        // Enter fullscreen
        if (iframeRef.current.requestFullscreen) {
          await iframeRef.current.requestFullscreen();
        } else if (iframeRef.current.mozRequestFullScreen) {
          // Firefox
          await iframeRef.current.mozRequestFullScreen();
        } else if (iframeRef.current.webkitRequestFullscreen) {
          // Chrome, Safari, and Opera
          await iframeRef.current.webkitRequestFullscreen();
        } else if (iframeRef.current.msRequestFullscreen) {
          // IE/Edge
          await iframeRef.current.msRequestFullscreen();
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          // Firefox
          await document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          // Chrome, Safari, and Opera
          await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          // IE/Edge
          await document.msExitFullscreen();
        }
      }
    }
  };

  // Handle download
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = documentUrl;
    link.download = documentUrl.split("/").pop(); // Extract file name from URL
    link.click(); // Trigger download
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  return (
    <Modal
      open={openViewModal}
      onClose={handleCloseModal}
      aria-labelledby="document-modal-title"
      aria-describedby="document-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: "800px",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          height: "auto", // Keep the height auto to maintain the same size
        }}
      >
        <Typography variant="h6" id="document-modal-title" gutterBottom>
          Document Viewer
        </Typography>
        <Box
          sx={{
            height: "500px", // Fixed height for the iframe
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <iframe
            ref={iframeRef} // Attach the ref to the iframe
            src={documentUrl}
            title="Document Viewer"
            width="100%"
            height="100%"
            style={{
              border: "none",
              transform: `scale(${zoomLevel})`,
              transformOrigin: "0 0",
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Box>
            <IconButton onClick={handleZoomIn} title="Zoom In">
              <ZoomIn />
            </IconButton>
            <IconButton onClick={handleZoomOut} title="Zoom Out">
              <ZoomOut />
            </IconButton>
            <IconButton
              onClick={handleToggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </Box>
          <Box>
            <Button
              variant="outlined"
              startIcon={<OpenInNew />}
              onClick={() => window.open(documentUrl, "_blank")}
              style={{ marginRight: "10px" }}
            >
              Open in New Tab
            </Button>
            {/* <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleDownload}
              style={{ marginRight: "10px" }}
            >
              Download
            </Button> */}
            <Button
              variant="contained"
              startIcon={<Close />}
              onClick={handleCloseModal}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default DocumentViewerModal;
