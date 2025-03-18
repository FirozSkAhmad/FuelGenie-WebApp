import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../utils/api";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Snackbar,
  Grid,
  FormControlLabel,
  Switch,
  Chip,
  Tooltip,
  TablePagination,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import UploadDocumentModal from "../../../components/management/Pumps/UploadDocumentModal";
import { usePermissions } from "../../../utils/permissionssHelper";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import WarningIcon from "@mui/icons-material/Warning";

const PumpDetails = () => {
  const { pumpId } = useParams();
  const [pump, setPump] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const permissions = usePermissions();
  // Fetch pump details
  const fetchPumpDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/management/pumps/get-pumpDetails/${pumpId}`
      );
      setPump(response.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch pump details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  // Add this useEffect for fetching price history
  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        const response = await api.get(
          `/management/pumps/instant-product-price-updation-history/${pumpId}?page=${pagination.page}&limit=${pagination.limit}`
        );
        setPriceHistory(response.data.data);
        setPagination((prev) => ({
          ...prev,
          total: response.data.pagination.total,
        }));
      } catch (err) {
        setSnackbar({
          open: true,
          message: "Failed to load price history",
          severity: "error",
        });
      }
    };
    fetchPriceHistory();
  }, [pumpId, pagination.page, pagination.limit]);

  // Handle pagination changes
  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleLimitChange = (event) => {
    setPagination((prev) => ({
      ...prev,
      limit: parseInt(event.target.value, 10),
      page: 1,
    }));
  };

  useEffect(() => {
    fetchPumpDetails();
  }, [pumpId]);

  // Handle document upload
  const handleUploadDocument = async (documentName, documentFile) => {
    console.log("Document Name:", documentName);
    console.log("File Name:", documentFile.name);
    const formData = new FormData();

    formData.append(`${documentName}`, documentFile);

    try {
      const response = await api.post(
        `/management/pumps/add-docs/${pumpId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchPumpDetails();
      setPump((prevPump) => ({
        ...prevPump,
        documents: [...prevPump.documents, response.data.data],
      }));

      setSnackbar({
        open: true,
        message: "Document uploaded successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to upload document. Please try again.",
        severity: "error",
      });
    }
  };

  // Handle document deletion
  const handleDeleteDocument = async (documentId) => {
    try {
      await api.delete(
        `/management/pumps/${pumpId}/delete-a-doc/${documentId}`
      );
      setPump((prevPump) => ({
        ...prevPump,
        documents: prevPump.documents.filter(
          (doc) => doc.documentId !== documentId
        ),
      }));
      setSnackbar({
        open: true,
        message: "Document deleted successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to delete document. Please try again.",
        severity: "error",
      });
    }
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Handle status change
  const handleStatusChange = async () => {
    const newIsBlocked = !pump.isBlocked;
    const action = newIsBlocked ? "block" : "activate";

    try {
      // Optimistic update
      setPump((prev) => ({ ...prev, isBlocked: newIsBlocked }));

      await api.put(`/management/pumps/pump-status/${pumpId}`, {
        action: action,
      });

      setSnackbar({
        open: true,
        message: `Status updated to ${newIsBlocked ? "Blocked" : "Active"}!`,
        severity: "success",
      });
    } catch (err) {
      // Revert on error
      setPump((prev) => ({ ...prev, isBlocked: !newIsBlocked }));
      setSnackbar({
        open: true,
        message: "Failed to update status. Please try again.",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!pump) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="textSecondary">
          No pump details found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <BreadcrumbNavigation />
      <Typography variant="h4" component="h1" gutterBottom>
        {pump.pumpName}
      </Typography>

      {/* Pump Details Section */}

      <Paper sx={{ p: 3, mt: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Owner: {pump.ownerName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Contact: {pump.contactNo}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Email: {pump.emailId}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Address: {pump.addressLine}, {pump.city}, {pump.state},{" "}
              {pump.pincode}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Country: {pump.country}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                mb: 2,
                // p: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Typography variant="subtitle1" component="div">
                    Account Status:
                  </Typography>
                  <Chip
                    label={pump.isBlocked ? "Blocked" : "Active"}
                    variant="outlined"
                    size="small"
                    sx={{
                      fontWeight: 600,
                      borderWidth: 2,
                      borderColor: pump.isBlocked
                        ? "error.main"
                        : "success.main",
                      color: pump.isBlocked ? "error.main" : "success.main",
                      bgcolor: "background.paper",
                    }}
                    icon={
                      pump.isBlocked ? (
                        <BlockIcon
                          fontSize="small"
                          sx={{ color: "error.main" }}
                        />
                      ) : (
                        <CheckCircleIcon
                          fontSize="small"
                          sx={{ color: "success.main" }}
                        />
                      )
                    }
                  />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Tooltip
                    title={`Toggle to ${
                      pump.isBlocked ? "activate" : "block"
                    } this pump`}
                  >
                    <Switch
                      checked={!pump.isBlocked}
                      onChange={handleStatusChange}
                      disabled={!permissions?.update}
                      color={pump.isBlocked ? "error" : "success"}
                      sx={{
                        "& .MuiSwitch-track": {
                          bgcolor: pump.isBlocked
                            ? "error.main"
                            : "success.main",
                          opacity: 0.5,
                        },
                        "& .MuiSwitch-thumb": {
                          bgcolor: pump.isBlocked
                            ? "error.main"
                            : "success.main",
                        },
                      }}
                    />
                  </Tooltip>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {pump.isBlocked ? "Blocked" : "Active"}
                  </Typography>
                </Box>
              </Box>
              {pump.isBlocked && (
                <Typography
                  variant="caption"
                  sx={{ color: "error.main", display: "block", mt: 1 }}
                >
                  <WarningIcon
                    fontSize="small"
                    sx={{ verticalAlign: "middle", mr: 0.5 }}
                  />
                  This pump account is currently blocked from performing
                  transactions
                </Typography>
              )}
            </Box>

            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  Total Orders: {pump.totalOrders}
                </Typography>
                <Typography variant="body2">
                  Delivered: {pump.deliveredOrders}
                </Typography>
                <Typography variant="body2">
                  Cancelled: {pump.cancelledOrders}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  Rejected: {pump.rejectedOrders}
                </Typography>
                <Typography variant="body2">
                  Pending Commission: ₹{pump.pendingCommission}
                </Typography>
                <Typography variant="body2">
                  Total Commission: ₹{pump.totalCommission}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Documents Section */}
      <Paper sx={{ p: 3, mt: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Documents</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setUploadModalOpen(true)}
            disabled={!permissions?.create}
          >
            Add Document
          </Button>
        </Box>
        <List>
          {pump.documents.map((doc) => (
            <ListItem
              key={doc.documentId}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteDocument(doc.documentId)}
                  disabled={!permissions?.delete}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={doc.documentName}
                secondary={
                  <a
                    href={doc.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Document
                  </a>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Instant Products Section */}
      <Paper sx={{ p: 3, mt: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Instant Products
        </Typography>
        <List>
          {pump.instantProducts.map((product) => (
            <ListItem key={product.instantProductId}>
              <ListItemText
                primary={product.name}
                secondary={`Price: ${product.price} ${product.unit}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      {/* Price Change History Section */}
      <Paper sx={{ p: 3, mt: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Price Change History
        </Typography>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {priceHistory.map((history) => (
            <ListItem
              key={`${history.instantProductId}-${history.uid}`}
              sx={{
                py: 2,
                px: 3,
                mb: 2,
                borderRadius: 2,
                boxShadow: 1,
                "&:hover": { boxShadow: 3 },
                transition: "box-shadow 0.3s ease",
              }}
            >
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle1"
                    fontWeight="medium"
                    sx={{ mb: 1 }}
                  >
                    {history.productName} ({history.productType})
                  </Typography>
                }
                secondary={
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        Updated by{" "}
                        <Box
                          component="span"
                          sx={{ color: "primary.main", fontWeight: "medium" }}
                        >
                          {history.updatedBy}
                        </Box>{" "}
                        ({history.roleType})
                      </Typography>
                      {history.roleType !== "ADMIN" && history.teams && (
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          {history.teams} team
                        </Typography>
                      )}
                      <Box
                        sx={{
                          width: "4px",
                          height: "4px",
                          borderRadius: "50%",
                          bgcolor: "text.secondary",
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <AccessTimeIcon fontSize="inherit" />
                        {new Date(history.createdAt).toLocaleString()}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mt: 1,
                      }}
                    >
                      <Chip
                        label={`${
                          history.adjustmentType === "inc"
                            ? "Increased"
                            : "Decreased"
                        } by ₹${history.adjustmentValue}`}
                        size="small"
                        color={
                          history.adjustmentType === "inc" ? "success" : "error"
                        }
                        variant="outlined"
                        sx={{
                          fontWeight: "medium",
                          borderWidth: 1.5,
                          "& .MuiChip-label": { px: 1.5 },
                        }}
                      />

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: "text.secondary",
                        }}
                      >
                        <Typography variant="body2">Old Price:</Typography>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          color="text.primary"
                        >
                          ₹{history.oldPrice}
                        </Typography>
                        <ArrowForwardIcon fontSize="small" />
                        <Typography variant="body2">New Price:</Typography>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          color={
                            history.adjustmentType === "inc"
                              ? "success.main"
                              : "error.main"
                          }
                        >
                          ₹{history.newPrice}
                        </Typography>
                      </Box>
                    </Box>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
        {priceHistory.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            No price change history found
          </Typography>
        ) : (
          <TablePagination
            component="div"
            count={pagination.total}
            page={pagination.page - 1}
            onPageChange={handlePageChange}
            rowsPerPage={pagination.limit}
            onRowsPerPageChange={handleLimitChange}
            rowsPerPageOptions={[5, 10, 25]}
            sx={{
              ".MuiTablePagination-toolbar": {
                pl: 2,
                minHeight: "52px",
              },
            }}
          />
        )}
      </Paper>
      {/* Document Upload Modal */}
      <UploadDocumentModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUploadDocument}
      />

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PumpDetails;
