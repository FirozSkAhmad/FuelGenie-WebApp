import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { usePermissions } from "../../../utils/permissionssHelper";

const BowserCreation = () => {
  const [bowsers, setBowsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    brand: "",
    rcNumber: "",
    vehicleModel: "",
    capacity: "",
    RC: null,
    Insurance: null,
    EmissionReport: null,
    customDocs: [], // Array to store multiple custom documents
  });

  const navigate = useNavigate();
  const permissions = usePermissions();
  // Fetch Bowsers
  useEffect(() => {
    api
      .get("/admin/bowser-creation/get-bowsers")
      .then((response) => {
        setBowsers(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bowsers:", error);
        setLoading(false);
      });
  }, []);

  // Handle Form Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "customDocs") {
      setFormData((prev) => ({
        ...prev,
        customDocs: [...prev.customDocs, files[0]],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const removeSelectedFile = (fieldName, index) => {
    setFormData((prev) => {
      const updatedDocs = [...prev.customDocs];
      updatedDocs.splice(index, 1);
      return { ...prev, customDocs: updatedDocs };
    });
  };

  // Handle Form Submit
  const handleSubmit = () => {
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "customDocs") {
        value.forEach((doc, index) => {
          payload.append(`customDoc${index + 1}`, doc);
        });
      } else {
        payload.append(key, value);
      }
    });

    api
      .post("/admin/bowser-creation/create-bowser", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        toast.success("Bowser created successfully!");
        setModalOpen(false);
        setLoading(true);
        // Refresh the bowsers list
        api.get("/admin/bowser-creation/get-bowsers").then((response) => {
          setBowsers(response.data.data);
          setLoading(false);
        });
      })
      .catch((error) => {
        toast.error("Failed to create bowser. Please try again.");
        console.error("Error creating bowser:", error);
      });
  };

  return (
    <Box sx={{ p: 3 }}>
      <BreadcrumbNavigation />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Bowser Creation</Typography>
        <Button
          variant="contained"
          onClick={() => setModalOpen(true)}
          disabled={!permissions?.create}
        >
          Create Bowser
        </Button>
      </Box>

      {/* Bowsers Table */}
      <Box sx={{ height: 400, mb: 2 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>BowserID</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Model</TableCell>
                  <TableCell>RC Number</TableCell>
                  <TableCell>Capacity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bowsers.map((bowser) => (
                  <TableRow
                    key={bowser.bowserId}
                    hover
                    onClick={() =>
                      navigate(`/admin/bowser-creation/${bowser.bowserId}`)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{bowser.bowserId}</TableCell>
                    <TableCell>{bowser.brand}</TableCell>
                    <TableCell>{bowser.model}</TableCell>
                    <TableCell>{bowser.rcNumber}</TableCell>
                    <TableCell>{bowser.capacity} Liters</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Create Bowser Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="lg"
      >
        <DialogTitle>Create Bowser</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 4,
              justifyContent: "space-between",
              mt: 2,
              width: "100%",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <TextField
                label="Brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
              />
              <TextField
                label="RC Number"
                name="rcNumber"
                value={formData.rcNumber}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
              />
              <TextField
                label="Vehicle Model"
                name="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
              />
              <TextField
                label="Capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Upload Documents (PDF only):
              </Typography>

              {/* Upload RC */}
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  sx={{ textTransform: "none" }}
                >
                  Upload RC
                  <input
                    type="file"
                    name="RC"
                    hidden
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                </Button>
                {formData.RC && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      Selected: {formData.RC.name}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Upload Insurance */}
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  sx={{ textTransform: "none" }}
                >
                  Upload Insurance
                  <input
                    type="file"
                    name="Insurance"
                    hidden
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                </Button>
                {formData.Insurance && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      Selected: {formData.Insurance.name}
                    </Typography>
                  </Box>
                )}
              </Box>
              {/* Upload Emission Report */}
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  sx={{ textTransform: "none" }}
                >
                  Upload Emission Report
                  <input
                    type="file"
                    name="EmissionReport"
                    hidden
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                </Button>
                {formData.EmissionReport && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      Selected: {formData.EmissionReport.name}
                    </Typography>
                  </Box>
                )}
              </Box>
              {/* Upload Custom Documents */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Upload Custom Documents:
                </Typography>
                {formData.customDocs.map((doc, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      Custom Doc {index + 1}: {doc.name}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeSelectedFile("customDocs", index)}
                    >
                      Remove File
                    </Button>
                  </Box>
                ))}
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  sx={{ textTransform: "none" }}
                >
                  Add Custom Document
                  <input
                    type="file"
                    name="customDocs"
                    hidden
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BowserCreation;
