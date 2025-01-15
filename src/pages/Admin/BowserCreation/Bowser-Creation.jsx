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
  TablePagination,
  Backdrop,
  Tabs,
  Tab,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { usePermissions } from "../../../utils/permissionssHelper";

const BowserCreation = () => {
  const [bowsers, setBowsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBowserId, setSelectedBowserId] = useState(null);
  const [remarks, setRemarks] = useState("");
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
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page
  const [tabValue, setTabValue] = useState(0); // Tab value (0 for active, 1 for deleted)
  const navigate = useNavigate();
  const permissions = usePermissions();

  // Fetch Bowsers based on deletion status
  const fetchBowsers = async () => {
    try {
      const response = await api.get(
        `/admin/bowser-creation/get-bowsers/${tabValue === 1}` // Use tabValue to determine isDeleted
      );
      setBowsers(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bowsers:", error);
      setLoading(false);
    }
  };

  // Call fetchBowsers in useEffect
  useEffect(() => {
    fetchBowsers();
  }, [tabValue]);

  // Handle Tab Change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setBowsers([]); // Reset bowsers state to empty array
    setPage(0); // Reset pagination to the first page
  };

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

  const removeSelectedFile = (fieldName) => {
    setFormData((prev) => {
      // Ensure fieldName exists in predefined fields
      if (["RC", "Insurance", "EmissionReport"].includes(fieldName)) {
        return { ...prev, [fieldName]: null }; // Set the field to null
      }
      console.warn(`Invalid field: ${fieldName}`); // Debugging
      return prev; // Return unchanged state if field is not valid
    });
  };

  // Handle Form Submit
  const handleSubmit = () => {
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "customDocs") {
        value.forEach((doc, index) => {
          payload.append(`customDoc${index + 1}Name`, doc.name);
          payload.append(`customDoc${index + 1}File`, doc.file);
        });
      } else {
        payload.append(key, value);
      }
    });
    setLoading(true);
    api
      .post("/admin/bowser-creation/create-bowser", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        setLoading(true);
        toast.success("Bowser created successfully!");
        setModalOpen(false);
        fetchBowsers();
      })
      .catch((error) => {
        toast.error("Failed to create bowser. Please try again.");
        console.error("Error creating bowser:", error);
        setLoading(false);
      });
  };

  // Handle Delete Bowser
  const handleDelete = (bowserId, remarks) => {
    setLoading(true);
    api
      .delete("/admin/bowser-creation/delete-bowser", {
        data: { bowserId, remarks }, // Pass both bowserId and remarks in the body
      })
      .then(() => {
        toast.success("Bowser deleted successfully!");
        setDeleteDialogOpen(false);
        setRemarks("");
        // Refresh the bowsers list
        fetchBowsers();
      })
      .catch((error) => {
        toast.error("Failed to delete bowser. Please try again.");
        console.error("Error deleting bowser:", error);
        setLoading(false);
      });
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

      {/* Tabs for Active and Deleted Bowsers */}
      <Box sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Active Bowsers" />
          <Tab label="Deleted Bowsers" />
        </Tabs>
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
                  {tabValue === 1 && ( // Show additional columns for deleted bowsers
                    <>
                      <TableCell>Deleted By</TableCell>
                      <TableCell>UID</TableCell>
                      <TableCell>Deletion Date</TableCell>
                    </>
                  )}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bowsers.length === 0 ? ( // Check if bowsers array is empty
                  <TableRow>
                    <TableCell colSpan={tabValue === 1 ? 8 : 5} align="center">
                      <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                        No data available
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  bowsers.map((bowser) => (
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
                      {tabValue === 1 && ( // Show additional data for deleted bowsers
                        <>
                          <TableCell>{bowser.deletedBy}</TableCell>
                          <TableCell>{bowser.uid}</TableCell>
                          <TableCell>
                            {new Date(bowser.deletionDate).toLocaleString()}
                          </TableCell>
                        </>
                      )}
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click event
                            setSelectedBowserId(bowser.bowserId);
                            setDeleteDialogOpen(true);
                          }}
                          disabled={!permissions?.delete || tabValue === 1} // Disable delete for deleted bowsers
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={bowsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
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
          {loading && (
            <Backdrop
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
              color="#fff"
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          )}
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
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeSelectedFile("RC")}
                    >
                      Remove File
                    </Button>
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
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeSelectedFile("Insurance")}
                    >
                      Remove File
                    </Button>
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
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeSelectedFile("EmissionReport")}
                    >
                      Remove File
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Custom Documents Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Upload Custom Documents:
                </Typography>
                {formData.customDocs.map((doc, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <TextField
                      label={`Custom Document ${index + 1} Name`}
                      value={doc.name || ""}
                      onChange={(e) =>
                        setFormData((prev) => {
                          const updatedDocs = [...prev.customDocs];
                          updatedDocs[index].name = e.target.value;
                          return { ...prev, customDocs: updatedDocs };
                        })
                      }
                      fullWidth
                      margin="normal"
                    />
                    <Button
                      variant="contained"
                      component="label"
                      fullWidth
                      sx={{ textTransform: "none", mb: 1 }}
                    >
                      Upload File
                      <input
                        type="file"
                        hidden
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setFormData((prev) => {
                            const updatedDocs = [...prev.customDocs];
                            updatedDocs[index].file = file;
                            return { ...prev, customDocs: updatedDocs };
                          });
                        }}
                      />
                    </Button>
                    {doc.file && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Selected File: {doc.file.name}
                      </Typography>
                    )}
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() =>
                        setFormData((prev) => {
                          const updatedDocs = [...prev.customDocs];
                          updatedDocs.splice(index, 1);
                          return { ...prev, customDocs: updatedDocs };
                        })
                      }
                    >
                      Remove Document
                    </Button>
                  </Box>
                ))}
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      customDocs: [
                        ...prev.customDocs,
                        { name: "", file: null },
                      ],
                    }))
                  }
                  sx={{ textTransform: "none" }}
                >
                  Add New Custom Document
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

      {/* Delete Bowser Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Bowser</DialogTitle>
        <DialogContent>
          <TextField
            label="Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!remarks) {
                toast.error("Please enter remarks.");
                return;
              }
              handleDelete(selectedBowserId, remarks);
            }}
            variant="contained"
            color="error"
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BowserCreation;
