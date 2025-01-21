import React, { useState } from "react";
import {
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Modal,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import {
  Person,
  LocationOn,
  Description,
  PictureAsPdf,
  InsertDriveFile,
  Download,
  Check,
  Close,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import ProfileImage from "../../UI/ProfileImage";
import DocumentViewerModal from "../../UI/DocViewModal";
import api from "../../../utils/api";

const CustomerDetails = ({ customerDetails }) => {
  if (!customerDetails) return null;

  // State for document viewer modal
  const [openViewModal, setOpenViewModal] = useState(false);
  const [documentUrl, setDocumentUrl] = useState("");

  // State for approve/reject modals
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);

  // State for approval data
  const [creditAmount, setCreditAmount] = useState(100000);
  const [creditPeriod, setCreditPeriod] = useState(12);
  const [interestRate, setInterestRate] = useState(5);

  // State for rejection data
  const [adminRemarks, setAdminRemarks] = useState("");

  // State for snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Function to handle document view
  const handleViewDocument = (url) => {
    setDocumentUrl(url);
    setOpenViewModal(true);
  };

  // Function to handle modal close
  const handleCloseModal = () => {
    setOpenViewModal(false);
    setDocumentUrl("");
  };

  // Function to handle document download
  const handleDownloadDocument = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop();
    link.click();
  };

  // Function to handle approval submission
  const handleApproveSubmit = async () => {
    try {
      const response = await api.put(
        `/admin/business-profiles/approve-b2b-registered-customer/${customerDetails.cid}?action=true`,
        {
          creditAmount,
          creditPeriod,
          interestRate,
        }
      );
      if (response.data.success) {
        setSnackbarMessage("Customer approved successfully!");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage("Failed to approve customer.");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      setSnackbarMessage("An error occurred while approving the customer.");
      setSnackbarSeverity("error");
    } finally {
      setOpenApproveModal(false);
      setSnackbarOpen(true);
    }
  };

  // Function to handle rejection submission
  const handleRejectSubmit = async () => {
    try {
      const response = await api.put(
        `/admin/business-profiles/approve-b2b-registered-customer/${customerDetails.cid}?action=false`,
        {
          adminRemarks,
        }
      );
      if (response.data.success) {
        setSnackbarMessage("Customer rejected successfully!");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage("Failed to reject customer.");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      setSnackbarMessage("An error occurred while rejecting the customer.");
      setSnackbarSeverity("error");
    } finally {
      setOpenRejectModal(false);
      setSnackbarOpen(true);
    }
  };

  // Function to close the snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper sx={{ padding: 2, marginTop: 2 }}>
      {/* Profile Image and Firm Type */}
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
        <ProfileImage profileImage={customerDetails.profileImage} />
        <Box>
          <Typography variant="h6">Firm Type</Typography>
          <Typography>{customerDetails.firmType}</Typography>
        </Box>
      </Box>
      {/* Approve and Reject Buttons */}
      {/* Approve and Reject Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        {customerDetails.isApproved === true ? (
          <Chip
            label="Accepted"
            color="success"
            icon={<CheckCircle />}
            variant="outlined"
          />
        ) : customerDetails.isApproved === false ? (
          <Chip
            label="Rejected"
            color="error"
            icon={<Cancel />}
            variant="outlined"
          />
        ) : (
          <>
            <Button
              variant="contained"
              color="success"
              startIcon={<Check />}
              onClick={() => setOpenApproveModal(true)}
              sx={{ mr: 2 }}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<Close />}
              onClick={() => setOpenRejectModal(true)}
            >
              Reject
            </Button>
          </>
        )}
      </Box>
      {/* Basic Information */}
      <Box>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          <Person
            fontSize="small"
            sx={{ marginRight: 1, verticalAlign: "middle" }}
          />
          Basic Information
        </Typography>
        <Card sx={{ marginBottom: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Full Name</strong>
                </Typography>
                <Typography>{customerDetails.fullName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Email</strong>
                </Typography>
                <Typography>{customerDetails.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Phone Number</strong>
                </Typography>
                <Typography>{customerDetails.phoneNumber}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Business Name</strong>
                </Typography>
                <Typography>{customerDetails.businessName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Business Contact Number</strong>
                </Typography>
                <Typography>{customerDetails.businessContactNumber}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Business Email</strong>
                </Typography>
                <Typography>{customerDetails.businessEmail}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
      {/* Business Address */}
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        <LocationOn
          fontSize="small"
          sx={{ marginRight: 1, verticalAlign: "middle" }}
        />
        Business Address
      </Typography>
      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Address Line</strong>
              </Typography>
              <Typography>
                {customerDetails.businessAddress.addressLine}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>City</strong>
              </Typography>
              <Typography>{customerDetails.businessAddress.city}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>State</strong>
              </Typography>
              <Typography>{customerDetails.businessAddress.state}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Pincode</strong>
              </Typography>
              <Typography>{customerDetails.businessAddress.pincode}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Country</strong>
              </Typography>
              <Typography>{customerDetails.businessAddress.country}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Documents */}
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        <Description
          fontSize="small"
          sx={{ marginRight: 1, verticalAlign: "middle" }}
        />
        Documents
      </Typography>
      <Grid container spacing={3} sx={{ marginBottom: 3 }}>
        {Object.entries(customerDetails.documents).map(([key, value]) => {
          const isPdfField = key.endsWith("PdfUrl");
          const documentName = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())
            .replace(/PdfUrl/g, " PDF");

          return (
            <Grid item xs={12} sm={6} md={4} key={key}>
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
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 1,
                    }}
                  >
                    {isPdfField ? (
                      <PictureAsPdf fontSize="small" />
                    ) : (
                      <Description fontSize="small" />
                    )}
                    <Typography variant="subtitle1" sx={{ marginLeft: 1 }}>
                      <strong>{documentName}</strong>
                    </Typography>
                  </Box>
                  {value ? (
                    isPdfField ? (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ fontStyle: "italic" }}
                      >
                        {value.split("/").pop()}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        {value}
                      </Typography>
                    )
                  ) : (
                    <Typography variant="body2" color="error">
                      {isPdfField ? "Not Uploaded" : "Not Provided"}
                    </Typography>
                  )}
                </CardContent>
                {isPdfField && value && (
                  <CardActions sx={{ marginTop: "auto" }}>
                    <Button
                      size="small"
                      startIcon={<InsertDriveFile />}
                      onClick={() => handleViewDocument(value)}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Download />}
                      onClick={() => handleDownloadDocument(value)}
                    >
                      Download
                    </Button>
                  </CardActions>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Other Documents */}
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        <InsertDriveFile
          fontSize="small"
          sx={{ marginRight: 1, verticalAlign: "middle" }}
        />
        Other Documents
      </Typography>
      <Grid container spacing={3}>
        {customerDetails.otherDocs.map((doc) => (
          <Grid item xs={12} sm={6} md={4} key={doc._id}>
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
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 1,
                  }}
                >
                  <InsertDriveFile fontSize="small" />
                  <Typography variant="subtitle1" sx={{ marginLeft: 1 }}>
                    <strong>{doc.name}</strong>
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Type: {doc.type}
                </Typography>
              </CardContent>
              <CardActions sx={{ marginTop: "auto" }}>
                <Button
                  size="small"
                  startIcon={<InsertDriveFile />}
                  onClick={() => handleViewDocument(doc.url)}
                >
                  View
                </Button>
                <Button
                  size="small"
                  startIcon={<Download />}
                  onClick={() => handleDownloadDocument(doc.url)}
                >
                  Download
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Approve Modal */}
      <Modal
        open={openApproveModal}
        onClose={() => setOpenApproveModal(false)}
        aria-labelledby="approve-modal-title"
        aria-describedby="approve-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" id="approve-modal-title" gutterBottom>
            Approve Customer
          </Typography>
          <TextField
            label="Credit Amount"
            type="number"
            fullWidth
            value={creditAmount}
            onChange={(e) => setCreditAmount(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Credit Period (Months)"
            type="number"
            fullWidth
            value={creditPeriod}
            onChange={(e) => setCreditPeriod(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Interest Rate (%)"
            type="number"
            fullWidth
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleApproveSubmit}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Reject Modal */}
      <Modal
        open={openRejectModal}
        onClose={() => setOpenRejectModal(false)}
        aria-labelledby="reject-modal-title"
        aria-describedby="reject-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" id="reject-modal-title" gutterBottom>
            Reject Customer
          </Typography>
          <TextField
            label="Admin Remarks"
            fullWidth
            multiline
            rows={4}
            value={adminRemarks}
            onChange={(e) => setAdminRemarks(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleRejectSubmit}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        openViewModal={openViewModal}
        handleCloseModal={handleCloseModal}
        documentUrl={documentUrl}
      />

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CustomerDetails;
