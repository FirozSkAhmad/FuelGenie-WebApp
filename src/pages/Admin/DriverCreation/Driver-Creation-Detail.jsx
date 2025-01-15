import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Modal,
  TextField,
  IconButton,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Upload as UploadIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../utils/api";
import { useParams } from "react-router-dom";
import { usePermissions } from "../../../utils/permissionssHelper";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";
const DriverCreationDetail = () => {
  const { driverId } = useParams(); // Get driverId from URL
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [driverDetails, setDriverDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedFields, setUpdatedFields] = useState({});
  const [removedDocs, setRemovedDocs] = useState([]);
  const [addDocModalOpen, setAddDocModalOpen] = useState(false);
  const [newDoc, setNewDoc] = useState([
    { documentName: "", documentFile: null }, // Initial document
  ]);
  const theme = useTheme();
  const permissions = usePermissions(); // Get user permissions
  // Fetch driver details on component mount
  useEffect(() => {
    fetchDriverDetails();
  }, [driverId]);

  // Fetch driver details from API
  const fetchDriverDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/admin/driver-creation/get-driverInf/${driverId}`
      );
      setDriverDetails(response.data.data);
    } catch (error) {
      console.error("Error fetching driver details:", error);
      toast.error("Failed to fetch driver details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes for editing driver details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedFields({ ...updatedFields, [name]: value });
  };

  // Handle file input changes for adding documents
  const handleFileChange = (e) => {
    const { files } = e.target;
    setNewDoc({ ...newDoc, documentFile: files[0] });
  };

  // Handle adding a new document
  const handleAddDocument = async () => {
    // Validate that all documents have a name and file
    const isValid = newDoc.every((doc) => doc.documentName && doc.documentFile);
    if (!isValid) {
      toast.error("Please fill all fields and upload files for all documents.");
      return;
    }

    // Create FormData object
    const formData = new FormData();

    // Append each document to the FormData
    newDoc.forEach((doc) => {
      if (doc.documentName && doc.documentFile) {
        formData.append(doc.documentName, doc.documentFile);
      } else {
        toast.error(
          "Please fill all fields and upload files for all documents."
        );
      }
    });

    setLoading(true); // Show loading indicator

    try {
      // Make the PATCH request to add documents
      const response = await api.patch(
        `/admin/driver-creation/add-documents/${driverId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure proper content type for file upload
          },
        }
      );

      // Handle successful response
      if (response.status === 200) {
        setAddDocModalOpen(false); // Close the modal
        toast.success("Documents added successfully!"); // Show success message
        fetchDriverDetails(); // Refetch the driver details to update the UI
        setNewDoc([{ documentName: "", documentFile: null }]); // Reset the newDoc state
      } else {
        throw new Error("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Error adding documents:", error);
      toast.error("Failed to add documents. Please try again."); // Show error message
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };
  // Handle editing driver details
  const handleEditDetails = async () => {
    try {
      await api.patch(`/admin/driver-creation/edit-driverDetails/${driverId}`, {
        updatedFields,
        removedDocs,
      });
      toast.success("Driver details updated successfully!");
      setEditMode(false);
      fetchDriverDetails(); // Refresh driver details
    } catch (error) {
      console.error("Error updating driver details:", error);
      toast.error("Failed to update driver details. Please try again.");
    }
  };

  // Handle removing a document
  const handleRemoveDocument = (documentId) => {
    setRemovedDocs([...removedDocs, documentId]);
    setDriverDetails({
      ...driverDetails,
      Documents: driverDetails.Documents.filter(
        (doc) => doc.documentId !== documentId
      ),
    });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!driverDetails) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h6">No driver details found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <BreadcrumbNavigation />

      {/* Driver Information Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h5">Driver Information</Typography>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setEditMode(!editMode)}
              disabled={
                !permissions?.update ||
                driverDetails.driverInformation.isDeleted
              } // Disable the button based on user permissions
            >
              {editMode ? "Cancel Edit" : "Edit Details"}
            </Button>
          </Box>
          {editMode ? (
            <>
              <TextField
                fullWidth
                label="Driver Name"
                name="driverName"
                value={
                  updatedFields.driverName ||
                  driverDetails.driverInformation.driverName
                }
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={
                  updatedFields.dateOfBirth ||
                  driverDetails.driverInformation.dateOfBirth
                }
                onChange={handleInputChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Email"
                name="mailId"
                value={
                  updatedFields.mailId || driverDetails.driverInformation.mailId
                }
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Contact Number"
                name="contactNumber"
                value={
                  updatedFields.contactNumber ||
                  driverDetails.driverInformation.contactNumber
                }
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Blood Group"
                name="bloodGroup"
                value={
                  updatedFields.bloodGroup ||
                  driverDetails.driverInformation.bloodGroup
                }
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Aadhar Number"
                name="aadharNumber"
                value={
                  updatedFields.aadharNumber ||
                  driverDetails.driverInformation.aadharNumber
                }
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="PAN Card Number"
                name="panCardNumber"
                value={
                  updatedFields.panCardNumber ||
                  driverDetails.driverInformation.panCardNumber
                }
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Driving License Number"
                name="drivingLicenseNumber"
                value={
                  updatedFields.drivingLicenseNumber ||
                  driverDetails.driverInformation.drivingLicenseNumber
                }
                onChange={handleInputChange}
                margin="normal"
              />
            </>
          ) : (
            <>
              <Typography>
                <strong>Name:</strong>{" "}
                {driverDetails.driverInformation.driverName}
              </Typography>
              <Typography>
                <strong>Date of Birth:</strong>{" "}
                {driverDetails.driverInformation.dateOfBirth}
              </Typography>
              <Typography>
                <strong>Email:</strong> {driverDetails.driverInformation.mailId}
              </Typography>
              <Typography>
                <strong>Contact Number:</strong>{" "}
                {driverDetails.driverInformation.contactNumber}
              </Typography>
              <Typography>
                <strong>Blood Group:</strong>{" "}
                {driverDetails.driverInformation.bloodGroup}
              </Typography>
              <Typography>
                <strong>Aadhar Number:</strong>{" "}
                {driverDetails.driverInformation.aadharNumber}
              </Typography>
              <Typography>
                <strong>PAN Card Number:</strong>{" "}
                {driverDetails.driverInformation.panCardNumber}
              </Typography>
              <Typography>
                <strong>Driving License Number:</strong>{" "}
                {driverDetails.driverInformation.drivingLicenseNumber}
              </Typography>
              <Typography>
                <strong>Is Deleted:</strong>{" "}
                {driverDetails.driverInformation.isDeleted ? (
                  <span style={{ color: "red" }}>Yes</span> // Red text for "Yes"
                ) : (
                  <span style={{ color: "green" }}>No</span> // Green text for "No"
                )}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>

      {/* Bank Details Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" mb={2}>
            Bank Details
          </Typography>
          {editMode ? (
            <>
              <TextField
                fullWidth
                label="Account Number"
                name="bankAccount"
                value={
                  updatedFields.bankAccount ||
                  driverDetails.bankDetails.bankAccount
                }
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="IFSC Code"
                name="ifscCode"
                value={
                  updatedFields.ifscCode || driverDetails.bankDetails.ifscCode
                }
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Account Holder Name"
                name="bankAccountHolderName"
                value={
                  updatedFields.bankAccountHolderName ||
                  driverDetails.bankDetails.bankAccountHolderName
                }
                onChange={handleInputChange}
                margin="normal"
              />
            </>
          ) : (
            <>
              <Typography>
                <strong>Account Number:</strong>{" "}
                {driverDetails.bankDetails.bankAccount}
              </Typography>
              <Typography>
                <strong>IFSC Code:</strong> {driverDetails.bankDetails.ifscCode}
              </Typography>
              <Typography>
                <strong>Account Holder Name:</strong>{" "}
                {driverDetails.bankDetails.bankAccountHolderName}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>

      {/* Documents Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h5">Documents</Typography>
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={() => setAddDocModalOpen(true)}
              disabled={
                !permissions.update ||
                editMode ||
                driverDetails.driverInformation.isDeleted
              } // Disable the button in edit mode
            >
              Add Document
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Document Name</TableCell>
                  <TableCell>Uploaded At</TableCell>
                  <TableCell>View</TableCell>
                  {editMode && <TableCell>Action</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {driverDetails.Documents.map((doc, index) => (
                  <TableRow key={index}>
                    <TableCell>{doc.documentName}</TableCell>
                    <TableCell>{doc.uploadedAt}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setSelectedDoc(doc.documentUrl)}
                      >
                        View
                      </Button>
                    </TableCell>
                    {editMode && (
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveDocument(doc.documentId)}
                          disabled={!permissions.delete}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      {/* Add Document Modal */}
      <Modal open={addDocModalOpen} onClose={() => setAddDocModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500, // Increased width for better spacing
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" mb={2}>
            Add Documents
          </Typography>

          {/* List of Documents */}
          {newDoc.map((doc, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Document Name"
                value={doc.documentName}
                onChange={(e) => {
                  const updatedDocs = [...newDoc];
                  updatedDocs[index].documentName = e.target.value;
                  setNewDoc(updatedDocs);
                }}
                margin="normal"
                required
              />
              <input
                type="file"
                id={`documentFile-${index}`}
                onChange={(e) => {
                  const updatedDocs = [...newDoc];
                  updatedDocs[index].documentFile = e.target.files[0];
                  setNewDoc(updatedDocs);
                }}
                style={{ display: "none" }}
                required
              />
              <label htmlFor={`documentFile-${index}`}>
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<UploadIcon />}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Upload File
                </Button>
              </label>
              {doc.documentFile && (
                <Typography variant="body2" sx={{ display: "inline", ml: 1 }}>
                  Selected File: {doc.documentFile.name}
                </Typography>
              )}
              <IconButton
                color="error"
                onClick={() => {
                  const updatedDocs = newDoc.filter((_, i) => i !== index);
                  setNewDoc(updatedDocs);
                }}
                sx={{ ml: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          {/* Add New Document Button */}
          <Button
            variant="outlined"
            onClick={() =>
              setNewDoc([...newDoc, { documentName: "", documentFile: null }])
            }
            sx={{ mt: 2 }}
          >
            Add Another Document
          </Button>

          {/* Submit Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddDocument}
            sx={{ mt: 2 }}
            disabled={loading} // Disable the button while loading
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </Box>
      </Modal>

      {/* Save Changes Button at the Bottom */}
      {editMode && (
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditDetails}
            sx={{ mt: 2 }}
            disabled={!permissions.update} // Disable the button while loading
          >
            Save Changes
          </Button>
        </Box>
      )}
      {/* Document Preview Modal */}
      <Modal
        open={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backdropFilter: "blur(5px)",
        }}
      >
        <Box
          sx={{
            width: "90%",
            maxWidth: "800px",
            height: "90%",
            maxHeight: "600px",
            backgroundColor: theme.palette.background.paper, // Use theme background color
            boxShadow: 24,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Title Bar */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: theme.palette.primary.main, // Use theme primary color
              color: theme.palette.primary.contrastText, // Use theme contrast text color
              p: 2,
            }}
          >
            <Typography variant="h6">Document Preview</Typography>
            <IconButton
              onClick={() => setSelectedDoc(null)}
              sx={{ color: theme.palette.primary.contrastText }} // Use theme contrast text color
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Document Preview */}
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflow: "hidden",
              backgroundColor: theme.palette.background.default, // Use theme background color
            }}
          >
            <iframe
              src={selectedDoc}
              title="Document Preview"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: 4,
              }}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default DriverCreationDetail;
