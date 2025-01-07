import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material"; // Import delete icon
import UploadIcon from "@mui/icons-material/Upload";
import { toast } from "react-toastify"; // Toast notifications
import "react-toastify/dist/ReactToastify.css"; // Toast CSS
import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";
import { usePermissions } from "../../../utils/permissionssHelper";
const DriverCreation = () => {
  const [open, setOpen] = useState(false); // State for modal
  const [drivers, setDrivers] = useState([]); // State for driver list
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    contactNumber: "",
    email: "",
    bloodGroup: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    aadharNumber: "",
    panCardNumber: "",
    drivingLicenseNumber: "",
    aadharFile: null,
    panCardFile: null,
    drivingLicenseFile: null,
  });
  const [customDocs, setCustomDocs] = useState([]); // State for custom documents
  const [loading, setLoading] = useState(false); // Loading state
  const permissions = usePermissions();
  const navigate = useNavigate();

  // Fetch drivers on component mount
  useEffect(() => {
    fetchDrivers();
  }, []);

  // Fetch drivers from API
  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/driver-creation/get-drivers");
      setDrivers(response.data.data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      toast.error("Failed to fetch drivers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input changes
  const handleFileChange = (e, fieldName) => {
    const { files } = e.target;
    setFormData({ ...formData, [fieldName]: files[0] });
  };

  // Handle custom document addition
  const handleAddCustomDoc = () => {
    setCustomDocs([...customDocs, { docName: "", docFile: null }]);
  };

  // Handle custom document input changes
  const handleCustomDocChange = (index, field, value) => {
    const updatedDocs = [...customDocs];
    updatedDocs[index][field] = value;
    setCustomDocs(updatedDocs);
  };

  // Handle custom document file changes
  const handleCustomDocFileChange = (index, e) => {
    const { files } = e.target;
    const updatedDocs = [...customDocs];
    updatedDocs[index].docFile = files[0];
    setCustomDocs(updatedDocs);
  };

  // Handle document removal
  const handleRemoveDoc = (fieldName, index = null) => {
    if (
      fieldName === "aadharFile" ||
      fieldName === "panCardFile" ||
      fieldName === "drivingLicenseFile"
    ) {
      setFormData({ ...formData, [fieldName]: null });
    } else if (index !== null) {
      const updatedDocs = customDocs.filter((_, i) => i !== index);
      setCustomDocs(updatedDocs);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== "") {
        data.append(key, formData[key]);
      }
    }
    customDocs.forEach((doc, index) => {
      if (doc.docName && doc.docFile) {
        data.append(doc.docName, doc.docFile);
      } else {
        toast.error(
          "Please fill all fields and upload files for all documents."
        );
      }
    });

    try {
      await api.post("/admin/driver-creation/create-driver", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Driver created successfully!");
      setOpen(false); // Close modal
      fetchDrivers(); // Refresh driver list
    } catch (error) {
      console.error("Error creating driver:", error);
      toast.error("Failed to create driver. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle row click to navigate to driver details
  const handleRowClick = (driverId) => {
    navigate(`/admin/driver-creation/${driverId}`);
  };

  // Check if main fields are filled
  const isFormValid = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "dateOfBirth",
      "contactNumber",
      "email",
      "bloodGroup",
      "accountNumber",
      "ifscCode",
      "accountHolderName",
      "aadharNumber",
      "panCardNumber",
      "drivingLicenseNumber",
      "aadharFile",
      "panCardFile",
      "drivingLicenseFile",
    ];
    return requiredFields.every((field) => formData[field]);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Driver Creation Button */}
      <BreadcrumbNavigation />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Driver Creation</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          disabled={!permissions.create}
        >
          Create Driver
        </Button>
      </Box>
      {/* Driver Creation Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Create Driver
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Personal Details */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Personal Details
                    </Typography>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      margin="normal"
                      required
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      margin="normal"
                      required
                    />
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                    <TextField
                      fullWidth
                      label="Contact Number"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      margin="normal"
                      required
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      margin="normal"
                      required
                    />
                    <TextField
                      fullWidth
                      label="Blood Group"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      margin="normal"
                      required
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Bank Details */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Bank Details
                    </Typography>
                    <TextField
                      fullWidth
                      label="Account Number"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      margin="normal"
                      required
                    />
                    <TextField
                      fullWidth
                      label="IFSC Code"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      margin="normal"
                      required
                    />
                    <TextField
                      fullWidth
                      label="Account Holder Name"
                      name="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={handleInputChange}
                      margin="normal"
                      required
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Document Uploads */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Document Uploads
                    </Typography>
                    {/* Aadhar */}
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Aadhar Number"
                        name="aadharNumber"
                        value={formData.aadharNumber}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                      />
                      {/* Material-UI Button for File Upload */}
                      <input
                        type="file"
                        id="aadharFile" // Add an ID for the input
                        onChange={(e) => handleFileChange(e, "aadharFile")}
                        style={{ display: "none" }} // Hide the default file input
                        required
                      />
                      <label htmlFor="aadharFile">
                        {" "}
                        {/* Link the label to the input */}
                        <Button
                          variant="contained"
                          component="span" // Make the button act as a span for the label
                          startIcon={<UploadIcon />} // Add an upload icon (optional)
                          sx={{ mt: 1 }}
                        >
                          Upload Aadhar File
                        </Button>
                      </label>
                      {formData.aadharFile && (
                        <Box
                          sx={{ display: "flex", alignItems: "center", mt: 1 }}
                        >
                          <Typography variant="body2">
                            {formData.aadharFile.name}
                          </Typography>
                          <IconButton
                            onClick={() => handleRemoveDoc("aadharFile")}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )}
                    </Box>

                    {/* PAN Card */}
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        label="PAN Card Number"
                        name="panCardNumber"
                        value={formData.panCardNumber}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                      />
                      {/* Material-UI Button for File Upload */}
                      <input
                        type="file"
                        id="panCardFile" // Add an ID for the input
                        onChange={(e) => handleFileChange(e, "panCardFile")}
                        style={{ display: "none" }} // Hide the default file input
                        required
                      />
                      <label htmlFor="panCardFile">
                        {" "}
                        {/* Link the label to the input */}
                        <Button
                          variant="contained"
                          component="span" // Make the button act as a span for the label
                          startIcon={<UploadIcon />} // Add an upload icon (optional)
                          sx={{ mt: 1 }}
                        >
                          Upload PAN Card File
                        </Button>
                      </label>
                      {formData.panCardFile && (
                        <Box
                          sx={{ display: "flex", alignItems: "center", mt: 1 }}
                        >
                          <Typography variant="body2">
                            {formData.panCardFile.name}
                          </Typography>
                          <IconButton
                            onClick={() => handleRemoveDoc("panCardFile")}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )}
                    </Box>

                    {/* Driving License */}
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Driving License Number"
                        name="drivingLicenseNumber"
                        value={formData.drivingLicenseNumber}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                      />
                      {/* Material-UI Button for File Upload */}
                      <input
                        type="file"
                        id="drivingLicenseFile" // Add an ID for the input
                        onChange={(e) =>
                          handleFileChange(e, "drivingLicenseFile")
                        }
                        style={{ display: "none" }} // Hide the default file input
                        required
                      />
                      <label htmlFor="drivingLicenseFile">
                        {" "}
                        {/* Link the label to the input */}
                        <Button
                          variant="contained"
                          component="span" // Make the button act as a span for the label
                          startIcon={<UploadIcon />} // Add an upload icon (optional)
                          sx={{ mt: 1 }}
                        >
                          Upload Driving License File
                        </Button>
                      </label>
                      {formData.drivingLicenseFile && (
                        <Box
                          sx={{ display: "flex", alignItems: "center", mt: 1 }}
                        >
                          <Typography variant="body2">
                            {formData.drivingLicenseFile.name}
                          </Typography>
                          <IconButton
                            onClick={() =>
                              handleRemoveDoc("drivingLicenseFile")
                            }
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )}
                    </Box>

                    {/* Custom Documents */}
                    {customDocs.map((doc, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <TextField
                          fullWidth
                          label="Document Name"
                          value={doc.docName}
                          onChange={(e) =>
                            handleCustomDocChange(
                              index,
                              "docName",
                              e.target.value
                            )
                          }
                          margin="normal"
                          required
                        />
                        {/* Material-UI Button for File Upload */}
                        <input
                          type="file"
                          id={`customDocFile-${index}`} // Unique ID for each custom document input
                          onChange={(e) => handleCustomDocFileChange(index, e)}
                          style={{ display: "none" }} // Hide the default file input
                          required
                        />
                        <label htmlFor={`customDocFile-${index}`}>
                          {" "}
                          {/* Link the label to the input */}
                          <Button
                            variant="contained"
                            component="span" // Make the button act as a span for the label
                            startIcon={<UploadIcon />} // Add an upload icon (optional)
                            sx={{ mt: 1 }}
                          >
                            Upload Custom Document
                          </Button>
                        </label>
                        {doc.docFile && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 1,
                            }}
                          >
                            <Typography variant="body2">
                              {doc.docFile.name}
                            </Typography>
                            <IconButton
                              onClick={() => handleRemoveDoc(null, index)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    ))}
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleAddCustomDoc}
                      sx={{ mt: 2 }}
                    >
                      Add Custom Document
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              disabled={!isFormValid() || loading}
            >
              {loading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </form>
        </Box>
      </Modal>

      {/* Driver List Table */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Driver ID</TableCell>
              <TableCell>Driver Name</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Blood Group</TableCell>
              <TableCell>Date of Joining</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? ( // Show loading spinner if data is being fetched
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : drivers.length > 0 ? ( // Show data if available
              drivers.map((driver) => (
                <TableRow
                  key={driver.driverId}
                  onClick={() => handleRowClick(driver.driverId)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{driver.driverId}</TableCell>
                  <TableCell>{driver.driverName}</TableCell>
                  <TableCell>{driver.dob}</TableCell>
                  <TableCell>{driver.contactNumber}</TableCell>
                  <TableCell>{driver.email}</TableCell>
                  <TableCell>{driver.bloodGroup}</TableCell>
                  <TableCell>{driver.dateOfJoining}</TableCell>
                </TableRow>
              ))
            ) : (
              // Show a message if no data is available
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No drivers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DriverCreation;
