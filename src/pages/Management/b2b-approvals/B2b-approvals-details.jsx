import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Paper,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Snackbar,
  Alert,
  Modal,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Person,
  Home,
  Description,
  PictureAsPdf,
  Close,
  Edit,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Business,
  CheckCircle,
  Cancel,
  AccountCircle,
} from "@mui/icons-material";

import api from "../../../utils/api";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";
import { toast } from "react-toastify";

const B2BApprovalsDetails = () => {
  const { cid } = useParams(); // Get the customer ID from the URL
  const [customer, setCustomer] = useState(null);
  const [touchedFields, setTouchedFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [documentUrl, setDocumentUrl] = useState("");
  const [updatedCustomer, setUpdatedCustomer] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [firmType, setFirmType] = useState("");
  const [requiredDocuments, setRequiredDocuments] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [imageError, setImageError] = useState(false);
  useEffect(() => {
    fetchCustomerDetails();
  }, [cid]);

  const fetchCustomerDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `/management/b2b-approvals/get-b2b-registered-customer-info/${cid}`
      );
      setCustomer(response.data.data);

      setUpdatedCustomer(response.data.data);
      setFirmType(response.data.data.firmType || "PROPRIETORSHIP");
      setRequiredDocuments(getRequiredDocuments(response.data.data.firmType));
    } catch (error) {
      console.error("Error fetching customer details:", error);
      setError("Failed to fetch customer details. Please try again later.");
      toast.error("Failed to fetch customer details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getRequiredDocuments = (firmType) => {
    switch (firmType) {
      case "PROPRIETORSHIP":
        return [
          "auditedFinancialItrNumber",
          "auditedFinancialItrPdfUrl",
          "gstNumber",
          "gstCertificatePdfUrl",
          "bankStatementPdfUrl",
          "aadhaarNumber",
          "aadhaarCardPdfUrl",
        ];
      case "PARTNERSHIP":
        return [
          "auditedFinancialItrNumber",
          "auditedFinancialItrPdfUrl",
          "gstNumber",
          "gstCertificatePdfUrl",
          "bankStatementPdfUrl",
          "aadhaarNumber",
          "aadhaarCardPdfUrl",
          "partnershipDeedPdfUrl",
          "listOfPartnersPdfUrl",
          "partnershipLetterPdfUrl",
        ];
      case "PRIVATELTD":
        return [
          "auditedFinancialItrNumber",
          "auditedFinancialItrPdfUrl",
          "gstNumber",
          "gstCertificatePdfUrl",
          "bankStatementPdfUrl",
          "aadhaarNumber",
          "aadhaarCardPdfUrl",
          "boardResolutionPdfUrl",
          "listOfDirectorsPdfUrl",
          "companyPanNumber",
          "companyPanPdfUrl",
          "certificateOfIncorporationPdfUrl",
          "moaAoaPdfUrl",
        ];
      default:
        return [];
    }
  };

  const handleViewDocument = (url) => {
    setDocumentUrl(url); // Set the document URL to be displayed
    setOpenViewModal(true); // Open the modal
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setOpenViewModal(false);
    setDocumentUrl("");
  };

  //   const handleInputChange = (e) => {
  //     const { name, value } = e.target;
  //     setUpdatedCustomer((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check if the field is nested (e.g., businessAddress.city or documents.someKey)
    if (name.includes(".")) {
      const [parentKey, childKey] = name.split("."); // Split into parent and child keys
      setUpdatedCustomer((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey], // Preserve existing nested fields
          [childKey]: value, // Update the specific nested field
        },
      }));
    } else {
      // Update root-level fields
      setUpdatedCustomer((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDocumentChange = (e) => {
    const { name, value } = e.target;

    // Mark the field as touched
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Update the nested `documents` object
    setUpdatedCustomer((prev) => ({
      ...prev,
      documents: {
        ...prev.documents, // Preserve existing document fields
        [name]: value, // Update the specific document field
      },
    }));
  };

  const handleUploadNewDocument = (docKey) => {
    // Create a file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "application/pdf"; // Restrict to PDF files
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Mark the field as touched
        setTouchedFields((prev) => ({
          ...prev,
          [docKey]: true,
        }));

        // Update the state with the selected file
        setUpdatedCustomer((prev) => ({
          ...prev,
          documents: {
            ...prev.documents,
            [docKey]: file, // Store the file object, not a URL
          },
        }));
      }
    };
    fileInput.click(); // Trigger the file input dialog
  };
  const isSaveDisabled = () => {
    // Check if any required field is empty
    for (const docKey of requiredDocuments) {
      const docValue = updatedCustomer.documents?.[docKey];
      if (
        !docValue ||
        (typeof docValue === "string" && docValue.trim() === "")
      ) {
        return true; // Disable save button if any field is empty
      }
    }

    // Check if no fields have been touched
    const hasTouchedFields = Object.values(touchedFields).some(
      (touched) => touched
    );
    return !hasTouchedFields; // Disable save button if no fields have been touched
  };

  const handleFirmTypeChange = (e) => {
    const newFirmType = e.target.value;
    setFirmType(newFirmType);
    setRequiredDocuments(getRequiredDocuments(newFirmType));

    // Mark firmType as touched
    setTouchedFields((prev) => ({
      ...prev,
      firmType: true,
    }));
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setUpdatedCustomer(customer); // Reset updatedCustomer to original data
  };

  const handleSaveCustomerInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      // Create a payload with only the updated keys
      const payload = {};
      for (const key in updatedCustomer) {
        if (updatedCustomer[key] !== customer[key]) {
          payload[key] = updatedCustomer[key];
        }
      }

      // Send the payload to the API
      const response = await api.put(
        `/management/b2b-approvals/update-b2b-registered-customer-info/${cid}`,
        payload
      );
      fetchCustomerDetails(); // Refresh customer details after update
      setEditMode(false);
      setSnackbarMessage("Customer details updated successfully!");
      toast.success("Customer details updated successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating customer details:", error);
      toast.error("Failed to update customer details. Please try again later.");
      setError("Failed to update customer details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      // Create a FormData object
      const formData = new FormData();

      // Append firmType if it has been touched
      if (touchedFields.firmType) {
        formData.append("firmType", updatedCustomer.firmType);
      }

      // Append only the required and touched document fields
      for (const docKey of requiredDocuments) {
        if (touchedFields[docKey]) {
          const docValue = updatedCustomer.documents?.[docKey];

          // Check if the field is a file (PDF)
          if (docKey.endsWith("PdfUrl") && docValue instanceof File) {
            // Append the file to FormData
            formData.append(docKey, docValue);
          } else {
            // Append non-file fields (e.g., text fields)
            formData.append(docKey, docValue);
          }
        }
      }

      // Send the FormData to the API
      const response = await api.put(
        `/management/b2b-approvals/update-b2b-registered-customer-documents/${cid}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type for file uploads
          },
        }
      );

      fetchCustomerDetails(); // Refresh customer details
      setOpenModal(false); // Close the modal
      setSnackbarMessage("Documents updated successfully!");
      toast.success("Documents updated successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating documents:", error);
      toast.error("Failed to update documents. Please try again later.");
      setError("Failed to update documents. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const handleApproveReject = async (isAccepted) => {
    setLoading(true); // Show loading state
    try {
      // Call the API to approve/reject the customer
      const response = await api.put(
        `/management/b2b-approvals/approve-b2b-registered-customer/${cid}?isAccepted=${isAccepted}`
      );

      // Handle success
      setSnackbarMessage(
        isAccepted
          ? "Customer approved successfully!"
          : "Customer rejected successfully!"
      );
      toast.success(
        isAccepted
          ? "Customer approved successfully!"
          : "Customer rejected successfully!"
      );
      setSnackbarOpen(true);

      // Refresh customer details after approval/rejection
      fetchCustomerDetails();
    } catch (error) {
      console.error("Error updating customer status:", error);
      toast.error("Failed to update customer status. Please try again later.");
      setError("Failed to update customer status. Please try again later.");
    } finally {
      setLoading(false); // Hide loading state
    }
  };
  if (loading) {
    return <CircularProgress />;
  }

  if (!customer) {
    return <Typography variant="h6">No customer data found.</Typography>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <BreadcrumbNavigation />
      <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
        {/* Customer Details Heading */}
        <Typography variant="h4" gutterBottom>
          <Description
            fontSize="small"
            style={{ marginRight: "10px", verticalAlign: "middle" }}
          />
          Customer Details
        </Typography>

        {/* Firm Type Section */}
        <Box style={{ marginLeft: "20px" }}>
          <Typography variant="h6" gutterBottom>
            <Business
              fontSize="small"
              style={{ marginRight: "10px", verticalAlign: "middle" }}
            />
            <strong>Firm Type</strong>
          </Typography>
          <Typography
            variant="body1"
            style={{
              marginLeft: "28px",
              color:
                customer.firmType === "PROPRIETORSHIP"
                  ? "#00E326" // Green for Proprietorship
                  : customer.firmType === "PARTNERSHIP"
                  ? "#D72727" // Red for Partnership
                  : "#CDBA0A", // Yellow for Private Limited
              fontWeight: "bold", // Optional: Make the text bold
            }}
          >
            {customer.firmType}
          </Typography>
        </Box>

        {/* Profile Image Section */}
        <Box style={{ marginLeft: "20px", marginTop: "20px" }}>
          <Typography variant="h6" gutterBottom>
            <AccountCircle
              fontSize="small"
              style={{ marginRight: "10px", verticalAlign: "middle" }}
            />
            <strong>Profile Image</strong>
          </Typography>
          <Box
            style={{
              marginLeft: "28px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {customer.profileImage ? (
              <>
                <img
                  src={
                    customer.profileImage.endsWith(".jpg") ||
                    customer.profileImage.endsWith(".jpeg") ||
                    customer.profileImage.endsWith(".png")
                      ? customer.profileImage // Use the URL as is if it has a valid extension
                      : `${customer.profileImage}.jpg` // Append .jpg if the extension is missing
                  }
                  alt="Profile"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "8px",
                    display: imageError ? "none" : "block", // Hide the image if it fails to load
                  }}
                  onError={() => setImageError(true)} // Set error state if the image fails to load
                />
                {imageError && (
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "8px",
                    }}
                  >
                    <AccountCircle
                      style={{ fontSize: "50px", color: "#ccc" }}
                    />
                  </div>
                )}
              </>
            ) : (
              <Typography variant="body1" style={{ fontStyle: "italic" }}>
                No profile image available
              </Typography>
            )}
          </Box>
        </Box>

        {/* Approve and Reject Buttons */}
        <Box
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircle />} // Approve icon
            onClick={() => handleApproveReject(true)} // Pass `true` for Approve
            disabled={loading} // Disable while API call is in progress
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Cancel />} // Reject icon
            onClick={() => handleApproveReject(false)} // Pass `false` for Reject
            disabled={loading} // Disable while API call is in progress
          >
            Reject
          </Button>
        </Box>
      </Paper>
      {/* Edit Button for Customer Info */}
      <Button
        variant="contained"
        startIcon={<Edit />}
        onClick={handleEditClick}
        style={{ marginBottom: "20px" }}
      >
        Edit Customer Info
      </Button>
      {/* Edit Button for Documents */}
      <Button
        variant="contained"
        startIcon={<Edit />}
        onClick={() => setOpenModal(true)}
        style={{ marginBottom: "20px", marginLeft: "10px" }}
      >
        Edit Documents
      </Button>
      {/* Basic Information Section */}
      {/* Basic Information Section */}
      <Paper style={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h6" gutterBottom>
          <Person
            fontSize="small"
            style={{ marginRight: "10px", verticalAlign: "middle" }}
          />
          Basic Information
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <strong>Full Name</strong>
                </TableCell>
                <TableCell>{customer.fullName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>{customer.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Phone Number</strong>
                </TableCell>
                <TableCell>{customer.phoneNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Firm Type</strong>
                </TableCell>
                <TableCell>{customer.firmType}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Business Name</strong>
                </TableCell>
                <TableCell>{customer.businessName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Business Contact Number</strong>
                </TableCell>
                <TableCell>{customer.businessContactNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Business Email</strong>
                </TableCell>
                <TableCell>{customer.businessEmail}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* Business Address Section */}
      <Paper style={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h6" gutterBottom>
          <Home
            fontSize="small"
            style={{ marginRight: "10px", verticalAlign: "middle" }}
          />
          Business Address
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <strong>Address Line</strong>
                </TableCell>
                <TableCell>{customer.businessAddress.addressLine}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>City</strong>
                </TableCell>
                <TableCell>{customer.businessAddress.city}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>State</strong>
                </TableCell>
                <TableCell>{customer.businessAddress.state}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Pincode</strong>
                </TableCell>
                <TableCell>{customer.businessAddress.pincode}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Country</strong>
                </TableCell>
                <TableCell>{customer.businessAddress.country}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/*  Documents Section */}

      <Paper style={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h6" gutterBottom>
          <Description
            fontSize="small"
            style={{ marginRight: "10px", verticalAlign: "middle" }}
          />
          Documents
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              {getRequiredDocuments(customer.firmType).map((docKey) => {
                const docValue = customer.documents[docKey];
                const isPdfField = docKey.endsWith("PdfUrl"); // Check if the field is a PDF URL
                const documentName = docKey
                  .replace(/([A-Z])/g, " $1") // Add space before capital letters
                  .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
                  .replace(/PdfUrl/g, " PDF") // Replace "PdfUrl" with "PDF"
                  .replace(/Number/g, ""); // Remove "Number"

                // Extract the PDF file name
                const pdfFileName =
                  docValue instanceof File
                    ? docValue.name // Get the file name from the File object
                    : typeof docValue === "string" &&
                      docValue.startsWith("http")
                    ? docValue.split("/").pop() // Extract the file name from the URL
                    : null;

                return (
                  <TableRow key={docKey}>
                    <TableCell>
                      <strong>{documentName}</strong>
                    </TableCell>
                    <TableCell>
                      {docValue ? (
                        // Check if the document is a URL (file) or a text field (number)
                        isPdfField ? (
                          // Handle PDF fields (URLs or File objects)
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <Typography
                              variant="body1"
                              style={{ fontStyle: "italic" }}
                            >
                              {pdfFileName} {/* Display the PDF file name */}
                            </Typography>
                            <Button
                              variant="contained"
                              startIcon={<PictureAsPdf />}
                              onClick={() =>
                                handleViewDocument(
                                  updatedCustomer.documents?.[docKey]
                                )
                              }
                              //   onClick={() => {
                              //     if (docValue instanceof File) {
                              //       // If it's a file, create a temporary URL for preview
                              //       const fileUrl = URL.createObjectURL(docValue);
                              //       window.open(fileUrl, "_blank");
                              //     } else if (
                              //       typeof docValue === "string" &&
                              //       docValue.startsWith("http")
                              //     ) {
                              //       // If it's a URL, open it directly
                              //       window.open(docValue, "_blank");
                              //     }
                              //   }}
                            >
                              View
                            </Button>
                          </div>
                        ) : (
                          // Handle non-PDF fields (text fields)
                          <Typography variant="body1">{docValue}</Typography>
                        )
                      ) : (
                        // Handle missing values
                        <Typography variant="body2" style={{ color: "red" }}>
                          {isPdfField ? "Not Uploaded" : "Not Provided"}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* Modal for Editing Customer Info */}
      <Dialog
        open={editMode}
        onClose={handleCancelEdit}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Edit Customer Details</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            <Person
              fontSize="small"
              style={{ marginRight: "10px", verticalAlign: "middle" }}
            />
            Basic Information
          </Typography>
          <TextField
            name="fullName"
            label="Full Name"
            value={updatedCustomer.fullName || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled
          />
          <TextField
            name="email"
            label="Email"
            value={updatedCustomer.email || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled
          />
          <TextField
            name="phoneNumber"
            label="Phone Number"
            value={updatedCustomer.phoneNumber || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled
          />
          <TextField
            name="businessName"
            label="Business Name"
            value={updatedCustomer.businessName || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="businessContactNumber"
            label="Business Contact Number"
            value={updatedCustomer.businessContactNumber || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="businessEmail"
            label="Business Email"
            value={updatedCustomer.businessEmail || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <Typography variant="h6" gutterBottom style={{ marginTop: "20px" }}>
            <Home
              fontSize="small"
              style={{ marginRight: "10px", verticalAlign: "middle" }}
            />
            Business Address
          </Typography>
          <TextField
            name="businessAddress.addressLine"
            label="Address Line"
            value={updatedCustomer.businessAddress?.addressLine || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="businessAddress.city"
            label="City"
            value={updatedCustomer.businessAddress?.city || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="businessAddress.state"
            label="State"
            value={updatedCustomer.businessAddress?.state || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="businessAddress.pincode"
            label="Pincode"
            value={updatedCustomer.businessAddress?.pincode || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="businessAddress.country"
            label="Country"
            value={updatedCustomer.businessAddress?.country || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveCustomerInfo} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal for Editing Documents */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="document-modal-title"
        aria-describedby="document-modal-description"
        fullWidth
        maxWidth="md"
        scroll="paper"
      >
        <DialogTitle id="document-modal-title">Edit Documents</DialogTitle>
        <DialogContent dividers>
          {/* Firm Type Dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Firm Type</InputLabel>
            <Select
              value={firmType}
              onChange={handleFirmTypeChange}
              label="Firm Type"
            >
              <MenuItem value="PROPRIETORSHIP">Proprietorship</MenuItem>
              <MenuItem value="PARTNERSHIP">Partnership</MenuItem>
              <MenuItem value="PRIVATELTD">Private Limited</MenuItem>
            </Select>
          </FormControl>

          {/* Document Fields */}
          {requiredDocuments.map((docKey) => {
            const docValue = updatedCustomer.documents?.[docKey];
            const isPdfField = docKey.endsWith("PdfUrl"); // Check if the field is a PDF URL

            // Extract the PDF file name
            const pdfFileName =
              docValue instanceof File
                ? docValue.name // Get the file name from the File object
                : typeof docValue === "string" && docValue.startsWith("http")
                ? docValue.split("/").pop() // Extract the file name from the URL
                : null;

            return (
              <div key={docKey}>
                <TextField
                  name={docKey} // Use the document key directly
                  label={docKey
                    .replace(/([A-Z])/g, " $1") // Add space before capital letters
                    .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
                    .replace(/PdfUrl/g, " PDF") // Replace "PdfUrl" with "PDF"
                    .replace(/Number/g, "")} // Remove "Number"
                  value={docValue || ""}
                  onChange={handleDocumentChange} // Use the dedicated handler
                  fullWidth
                  margin="normal"
                  disabled={isPdfField} // Disable the text field for PDF URLs
                />
                {isPdfField && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    {/* Display the PDF file name */}
                    {pdfFileName && (
                      <Typography
                        variant="body1"
                        style={{ fontStyle: "italic" }}
                      >
                        {pdfFileName}
                      </Typography>
                    )}
                    <Button
                      variant="contained"
                      startIcon={<PictureAsPdf />}
                      onClick={() => {
                        const docValue = updatedCustomer.documents?.[docKey];
                        if (docValue instanceof File) {
                          // If it's a file, create a temporary URL for preview
                          const fileUrl = URL.createObjectURL(docValue);
                          window.open(fileUrl, "_blank");
                        } else if (
                          typeof docValue === "string" &&
                          docValue.startsWith("http")
                        ) {
                          // If it's a URL, open it directly
                          window.open(docValue, "_blank");
                        }
                      }}
                      disabled={!updatedCustomer.documents?.[docKey]} // Disable if no file or URL is available
                    >
                      {updatedCustomer.documents?.[docKey]
                        ? "View PDF"
                        : "Not Uploaded"}
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<CloudUploadIcon />} // Use an upload icon
                      onClick={() => handleUploadNewDocument(docKey)} // Handle upload new document
                    >
                      Upload New
                    </Button>
                    {/* Clear Selected PDF Button */}
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />} // Use a delete icon
                      onClick={() => {
                        // Clear the selected PDF for this field
                        setUpdatedCustomer((prev) => ({
                          ...prev,
                          documents: {
                            ...prev.documents,
                            [docKey]: null, // Clear the field
                          },
                        }));
                        // Mark the field as touched
                        setTouchedFields((prev) => ({
                          ...prev,
                          [docKey]: true,
                        }));
                      }}
                      disabled={!updatedCustomer.documents?.[docKey]} // Disable if no file or URL is available
                    >
                      Clear
                    </Button>
                  </div>
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
            disabled={isSaveDisabled()} // Disable if any field is empty or untouched
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      {/* Modal for Document Viewing */}
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
          }}
        >
          <Typography variant="h6" id="document-modal-title" gutterBottom>
            Document Viewer
          </Typography>
          <iframe
            src={documentUrl}
            title="Document Viewer"
            width="100%"
            height="500px"
            style={{ border: "none" }}
          />
          <Button
            variant="contained"
            startIcon={<Close />}
            onClick={handleCloseModal}
            style={{ marginTop: "20px" }}
          >
            Close
          </Button>
        </Box>
      </Modal>
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
    </div>
  );
};

export default B2BApprovalsDetails;
