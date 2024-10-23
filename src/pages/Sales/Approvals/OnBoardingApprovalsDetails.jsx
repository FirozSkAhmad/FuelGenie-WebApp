import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Divider,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import DocumentUploadModal from "../../../components/Sales/Approvals/DocumentUploadModal";
import EditOnboardingModal from "../../../components/Sales/Approvals/EditOnboardingModal";
import DocumentPreviewComponent from "../../../components/Sales/Approvals/DocumentPreviewModal";
const OnboardingApprovalsDetails = () => {
  const theme = useTheme();
  const { customerId } = useParams();
  const [documentModal, setDocumentModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const customerDetails = {
    customerId: `#${customerId}`,
    customerName: "Kiran Kumar",
    contactNumber: "99999 99999",
    emailId: "test@gmail.com",
    businessOrgName: "ABC",
    businessType: "Industrial",
    firmType: "Partnership",
    secondaryContactNumber: "99999 99999",
    secondaryEmailId: "test2@gmail.com",
    panNumber: "ABCDE1234F",
    gstNumber: "31ASDFG34C65S34D",
    salespersonName: "Vishal",
    salespersonId: "12345",
  };
  const salesPeople = [
    { id: "12345", name: "Vishal" },
    { id: "67890", name: "Rahul" },
    { id: "54321", name: "Sandeep" },
  ];
  const uploadedDocs = [
    { name: "AAdar", id: 1 },
    { name: "Pancard", id: 2 },
    { name: "Regular Credit agreement", id: 3 },
    { name: "Security Cheque", id: 4 },
    { name: "KYC of the directors", id: 5 },
    { name: "Audited Financial, and ITR", id: 6 },
    { name: "ST Certificate and GSTR 3B", id: 7 },
    { name: "Bank Statement for last 3 months", id: 8 },
  ];
  const handleSave = (updatedCustomerData) => {
    console.log("Updated Customer Data:", updatedCustomerData);
    // Handle the saving logic here (e.g., API call)
  };
  const handleDocumentClick = (doc) => {
    setSelectedDoc(doc);
    setPreviewOpen(true); // Open the preview modal
  };

  return (
    <Box>
      {/* Breadcrumb */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Sales / Onboarding Approvals
        </Typography>
      </Box>
      <Paper
        elevation={theme.palette.mode === "dark" ? 2 : 1}
        sx={{
          p: 2,
          bgcolor: "background.paper",
        }}
      >
        {/* Customer Details Grid */}
        <Grid container spacing={2}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <InfoRow label="Customer ID" value={customerDetails.customerId} />
              <InfoRow
                label="Customer Name"
                value={customerDetails.customerName}
              />
              <InfoRow
                label="Contact Number"
                value={customerDetails.contactNumber}
              />
              <InfoRow label="Mail ID" value={customerDetails.emailId} />
              <InfoRow
                label="Business Organization Name"
                value={customerDetails.businessOrgName}
              />
              <InfoRow
                label="Business Type"
                value={customerDetails.businessType}
              />
              <InfoRow label="Firm Type" value={customerDetails.firmType} />
              <InfoRow
                label="Contact Number"
                value={customerDetails.secondaryContactNumber}
              />
              <InfoRow
                label="Mail ID"
                value={customerDetails.secondaryEmailId}
              />
            </Box>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <InfoRow label="Pan Number" value={customerDetails.panNumber} />
              <InfoRow label="GST Number" value={customerDetails.gstNumber} />
              <InfoRow
                label="Salesperson Name"
                value={customerDetails.salespersonName}
              />
              <InfoRow
                label="Salesperson ID"
                value={customerDetails.salespersonId}
              />
            </Box>
          </Grid>
        </Grid>

        <Divider
          sx={{
            my: 2,
            borderColor: "divider",
          }}
        />

        {/* Documents Section */}
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            sx={{ mb: 1 }}
            onClick={() => setDocumentModal(true)}
          >
            Upload Documents
          </Button>

          <Typography
            variant="subtitle1"
            sx={{
              mb: 1,
              color: "text.primary",
            }}
          >
            Uploaded Docs
          </Typography>

          <Box sx={{ position: "relative" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                overflowX: "auto",
                "&::-webkit-scrollbar": {
                  height: 6,
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.05)",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.2)"
                      : "rgba(0, 0, 0, 0.2)",
                  borderRadius: 3,
                },
              }}
            >
              <IconButton size="small" sx={{ color: "text.primary" }}>
                <ChevronLeftIcon />
              </IconButton>

              {uploadedDocs.map((doc) => (
                <Paper
                  key={doc.id}
                  elevation={0}
                  sx={{
                    width: 120,
                    height: 90,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "action.hover"
                        : "grey.100",
                    flexShrink: 0,
                    p: 1,
                    textAlign: "center",
                    border: 1,
                    borderColor: "divider",
                    cursor: "pointer", // Pointer cursor
                  }}
                  onClick={() => handleDocumentClick(doc)} // Open document preview
                >
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    {doc.name}
                  </Typography>
                </Paper>
              ))}

              <IconButton size="small" sx={{ color: "text.primary" }}>
                <ChevronRightIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Use DocumentPreviewComponent */}
          <DocumentPreviewComponent
            isOpen={isPreviewOpen}
            handleClose={() => setPreviewOpen(false)}
            document={selectedDoc}
          />
        </Box>

        <Divider
          sx={{
            my: 2,
            borderColor: "divider",
          }}
        />

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" color="error">
              Delete
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setEditModal(true)}
            >
              Edit
            </Button>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" color="secondary">
              Reject
            </Button>
            <Button variant="contained" color="primary">
              Approve
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Modals */}
      <DocumentUploadModal
        open={documentModal}
        onClose={() => setDocumentModal(false)}
      />
      <EditOnboardingModal
        open={editModal}
        onClose={() => setEditModal(false)}
        customerData={customerDetails}
        salesPeople={salesPeople}
        onSave={handleSave}
      />
    </Box>
  );
};

// Helper component for consistent info row display
const InfoRow = ({ label, value }) => (
  <Box sx={{ display: "flex", gap: 0.5 }}>
    <Typography variant="body2" sx={{ color: "text.secondary" }}>
      {label}:
    </Typography>
    <Typography variant="body2" sx={{ color: "text.primary" }}>
      {value}
    </Typography>
  </Box>
);

export default OnboardingApprovalsDetails;
