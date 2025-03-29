import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Box,
  Grid,
  CircularProgress,
  Card,
  Divider,
  useTheme,
  styled,
  Chip,
  Avatar,
  Stack,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";

import ChatIcon from "@mui/icons-material/Chat";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AdjustIcon from "@mui/icons-material/Adjust";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { alpha } from "@mui/material";

import api from "../../../utils/api";
import { format } from "date-fns";

import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";

const ImageGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const DetailSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  fontWeight: 500,
}));

export default function TotalizerErrorDetail() {
  const theme = useTheme();
  const { rcNumber: encodedRcNumber, loginHistoryId } = useParams();
  const [bowserData, setBowserData] = useState(null);
  const [driverHistory, setDriverHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const rcNumber = decodeURIComponent(encodedRcNumber);
  const [openRemarksDialog, setOpenRemarksDialog] = useState(false);
  const [remarksInput, setRemarksInput] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [bowserResponse, historyResponse] = await Promise.all([
          api.get(
            `/operations/totalizer-errors/bowser-details/${encodeURIComponent(
              rcNumber
            )}`
          ),
          api.get(
            `/operations/totalizer-errors/driver-history/${loginHistoryId}`
          ),
        ]);

        setBowserData(bowserResponse.data.data);
        setDriverHistory(historyResponse.data.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [rcNumber, loginHistoryId]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress size={60} />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 3, textAlign: "center", color: "error.main" }}>
        <ErrorOutlineIcon sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h5">Error loading details</Typography>
        <Typography>{error.message}</Typography>
      </Box>
    );

  if (!bowserData || !driverHistory) return null;
  const handleAddTotalizerError = async () => {
    try {
      const response = await api.put(
        "/operations/totalizer-errors/add-totalizer-error",
        {
          loginHistoryId,
          addTotalizerError: driverHistory.totalizerError, // Using existing error value
        }
      );

      setSnackbar({
        open: true,
        message: "Error added successfully!",
        severity: "success",
      });
      // Refresh data after successful update
      const historyResponse = await api.get(
        `/operations/totalizer-errors/driver-history/${loginHistoryId}`
      );
      setDriverHistory(historyResponse.data.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to add error",
        severity: "error",
      });
      console.error("Error adding totalizer error:", error);
    }
  };

  const handleAddRemarks = async () => {
    try {
      await api.put("/operations/totalizer-errors/add-remarks", {
        loginHistoryId,
        remarks: remarksInput,
      });

      setSnackbar({
        open: true,
        message: "Remarks added successfully!",
        severity: "success",
      });
      setOpenRemarksDialog(false);
      // Refresh data after successful update
      const historyResponse = await api.get(
        `/operations/totalizer-errors/driver-history/${loginHistoryId}`
      );
      setDriverHistory(historyResponse.data.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to add remarks",
        severity: "error",
      });
      console.error("Error adding remarks:", error);
    }
  };
  return (
    <Box sx={{ p: 3 }}>
      <BreadcrumbNavigation />
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Totalizer Error Details
        <StatusChip
          label={driverHistory.totalizerError ? "Error Recorded" : "No Error"}
          color={driverHistory.totalizerError ? "error" : "success"}
          variant="outlined"
        />
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddTotalizerError}
          disabled={driverHistory?.addedTotalizerError}
        >
          Confirm Totalizer Error
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setOpenRemarksDialog(true)}
          disabled={driverHistory?.remarks !== null}
        >
          Add Remarks
        </Button>
      </Box>
      {/* Main Grid */}
      <Grid container spacing={3}>
        {/* Vehicle Section */}
        <Grid item xs={12} md={6}>
          <DetailSection elevation={3}>
            <Typography variant="h6" color="primary" gutterBottom>
              <Box component="span" sx={{ mr: 1 }}>
                🚛
              </Box>
              Vehicle Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <DetailItem label="RC Number" value={bowserData.rcNumber} />
                <DetailItem label="Brand" value={bowserData.brand} />
              </Grid>
              <Grid item xs={6}>
                <DetailItem label="Model" value={bowserData.vehicleModel} />
                <DetailItem
                  label="Capacity"
                  value={`${bowserData.capacity} L`}
                />
              </Grid>
              <Grid item xs={6}>
                <DetailItem
                  label="Current Capacity"
                  value={`${bowserData.currentCapacity} L`}
                />
                <DetailItem
                  label="Available"
                  value={`${bowserData.isAvailable} `}
                />
              </Grid>
              <Grid item xs={6}>
                <DetailItem
                  label="Current Driver ID"
                  value={`${bowserData.currentDriverId} `}
                />
                <DetailItem
                  label="BowserId"
                  value={`${bowserData.bowserId} `}
                />
              </Grid>
            </Grid>
          </DetailSection>
        </Grid>

        {/* Driver Section */}
        <Grid item xs={12} md={6}>
          <DetailSection elevation={3}>
            <Typography variant="h6" color="primary" gutterBottom>
              <Box component="span" sx={{ mr: 1 }}>
                👤
              </Box>
              Driver Information
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                {driverHistory.driver?.firstName?.[0]}
              </Avatar>
              <div>
                <Typography variant="subtitle1">
                  {driverHistory.driver?.firstName}{" "}
                  {driverHistory.driver?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: {driverHistory.driver?.driverId}
                </Typography>
              </div>
            </Stack>
            <DetailItem
              label="Contact"
              value={driverHistory.driver?.contactNumber}
            />
            <DetailItem
              label="Last Login"
              value={format(
                new Date(driverHistory.loggedDate),
                "dd MMM yyyy HH:mm"
              )}
            />
          </DetailSection>
        </Grid>

        {/* Shift Metrics */}
        <Grid item xs={12}>
          <DetailSection elevation={3}>
            <Typography variant="h6" color="primary" gutterBottom>
              <Box component="span" sx={{ mr: 1 }}>
                📊
              </Box>
              Shift Metrics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <MetricCard
                  title="Odometer"
                  initial={driverHistory.initialOdometer}
                  final={driverHistory.finalOdometer}
                  unit="km"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MetricCard
                  title="Totalizer"
                  initial={driverHistory.initialTotalizer}
                  final={driverHistory.finalTotalizer}
                  unit="L"
                  error={driverHistory.totalizerError}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MetricCard
                  title="Calculations"
                  items={[
                    {
                      label: "Recorded Error",
                      value: driverHistory.totalizerError,
                    },
                    {
                      label: "Adjusted Error",
                      value: driverHistory.addedTotalizerError,
                    },
                    {
                      label: "Final Totalizer Error",
                      value:
                        driverHistory.totalizerError -
                        driverHistory.addedTotalizerError,
                    },
                  ]}
                  unit="L"
                />
              </Grid>
            </Grid>
          </DetailSection>
        </Grid>
        <Grid item xs={12}>
          <DetailSection elevation={3}>
            <Typography variant="h6" color="primary" gutterBottom>
              <Box component="span" sx={{ mr: 1 }}>
                📅
              </Box>
              Login History
            </Typography>

            {bowserData.loginHistory.data.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                  No historical login records found
                </Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ mb: 2 }}>
                  {bowserData.loginHistory.data.map((entry) => (
                    <LoginHistoryEntry
                      key={entry.loginHistoryId}
                      entry={entry}
                      driverHistory={driverHistory}
                      currentDriverId={bowserData.currentDriverId}
                    />
                  ))}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Showing {bowserData.loginHistory.data.length} of{" "}
                    {bowserData.loginHistory.pagination.total} entries
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      disabled={
                        bowserData.loginHistory.pagination.currentPage === 1
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      size="small"
                      disabled={
                        bowserData.loginHistory.pagination.currentPage ===
                        bowserData.loginHistory.pagination.totalPages
                      }
                    >
                      Next
                    </Button>
                  </Stack>
                </Box>
              </>
            )}
          </DetailSection>
        </Grid>
        {/* Documentation Images */}
        <Grid item xs={12}>
          <DetailSection elevation={3}>
            <Typography variant="h6" color="primary" gutterBottom>
              <Box component="span" sx={{ mr: 1 }}>
                📸
              </Box>
              Documentation
            </Typography>
            <ImageGrid container spacing={2}>
              {driverHistory.images?.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <ImageCard image={image} />
                </Grid>
              ))}
            </ImageGrid>
          </DetailSection>
        </Grid>

        {/* Remarks & Audit */}
        <Grid item xs={12}>
          <DetailSection elevation={3}>
            <Typography variant="h6" color="primary" gutterBottom>
              <Box component="span" sx={{ mr: 1 }}>
                📝
              </Box>
              Remarks & Audit
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 2 }}>
              {driverHistory.remarks || "No remarks provided"}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <DetailItem
                  label="Last Updated"
                  value={format(
                    new Date(driverHistory.updatedAt),
                    "dd MMM yyyy HH:mm"
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DetailItem
                  label="Updated By"
                  value={`${driverHistory.updatedBy} (${driverHistory.roleType})`}
                />
              </Grid>
            </Grid>
          </DetailSection>
        </Grid>
      </Grid>
      {/* Remarks Dialog */}
      <Dialog
        open={openRemarksDialog}
        onClose={() => setOpenRemarksDialog(false)}
      >
        <DialogTitle>Add Remarks</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Remarks"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={remarksInput}
            onChange={(e) => setRemarksInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRemarksDialog(false)}>Cancel</Button>
          <Button onClick={handleAddRemarks} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// Reusable Components
const DetailItem = ({ label, value }) => (
  <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
    <Typography variant="subtitle1" sx={{ minWidth: 120 }}>
      {label}:
    </Typography>
    <Typography variant="body1" color="text.secondary">
      {value || "N/A"}
    </Typography>
  </Stack>
);

const MetricCard = ({ title, initial, final, error, items, unit }) => (
  <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
    <Typography variant="subtitle1" color="primary" gutterBottom>
      {title}
    </Typography>

    {items ? (
      items.map((item, index) => (
        <DetailItem
          key={index}
          label={item.label}
          value={item.value !== null ? `${item.value} ${unit}` : "N/A"}
        />
      ))
    ) : (
      <>
        <DetailItem label="Initial" value={`${initial} ${unit}`} />
        <DetailItem label="Final" value={`${final ?? "N/A"} ${unit}`} />
        {error !== null && (
          <DetailItem label="Error" value={`${error} ${unit}`} />
        )}
      </>
    )}
  </Card>
);

const ImageCard = ({ image }) => (
  <Card sx={{ position: "relative", height: 250 }}>
    <img
      src={image.imageUrl}
      alt={image.imageName}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "4px",
      }}
    />
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: "rgba(0,0,0,0.7)",
        color: "white",
        p: 1,
        borderBottomLeftRadius: "4px",
        borderBottomRightRadius: "4px",
      }}
    >
      <Typography variant="caption">
        {image.imageName.replace(/([A-Z])/g, " $1").trim()}
      </Typography>
    </Box>
  </Card>
);

const LoginHistoryEntry = ({ entry, currentDriverId }) => {
  const theme = useTheme();
  const isActiveDriver = entry.driverId === currentDriverId;
  const netError = entry.totalizerError - (entry.addedTotalizerError || 0);

  return (
    <Card
      variant="outlined"
      sx={{
        p: 2,
        mb: 1,
        borderLeft: `4px solid ${
          isActiveDriver ? theme.palette.success.main : "transparent"
        }`,
        backgroundColor: isActiveDriver
          ? alpha(theme.palette.success.light, 0.05)
          : "inherit",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateX(4px)",
          boxShadow: theme.shadows[1],
        },
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              {format(new Date(entry.loggedDate), "dd MMM yyyy HH:mm")}
            </Typography>
            {isActiveDriver && (
              <Chip
                label="Active"
                size="small"
                color="success"
                variant="filled"
                sx={{ ml: 1 }}
              />
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 1 }}>
            <PersonOutlineIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {entry.driverId}
              {isActiveDriver && " (Current Driver)"}
            </Typography>
          </Box>

          <Chip
            label={entry.shift}
            size="small"
            sx={{ mt: 1 }}
            color={entry.shift === "9-21" ? "primary" : "secondary"}
            icon={<AccessTimeIcon fontSize="small" />}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Stack spacing={0.5}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ArrowUpwardIcon
                fontSize="small"
                sx={{ color: theme.palette.info.main }}
              />
              <Typography variant="body2">
                Initial: <strong>{entry.initialTotalizer} L</strong>
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ArrowDownwardIcon
                fontSize="small"
                sx={{ color: theme.palette.warning.main }}
              />
              <Typography variant="body2">
                Final: <strong>{entry.finalTotalizer ?? "N/A"} L</strong>
              </Typography>
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={12} md={3}>
          <Stack spacing={1}>
            <Tooltip title="Original recorded discrepancy">
              <Chip
                label={`Recorded: ${entry.totalizerError ?? 0}L`}
                size="small"
                variant="outlined"
                color="error"
                icon={<ErrorOutlineIcon fontSize="small" />}
              />
            </Tooltip>
            <Tooltip title="Manually adjusted error">
              <Chip
                label={`Adjusted: ${entry.addedTotalizerError ?? 0}L`}
                size="small"
                variant="outlined"
                color="success"
                icon={<AdjustIcon fontSize="small" />}
              />
            </Tooltip>
            <Divider sx={{ my: 0.5 }} />
            <Typography variant="body2">
              Net Error:{" "}
              <span
                style={{
                  color:
                    netError > 0
                      ? theme.palette.error.main
                      : theme.palette.success.main,
                  fontWeight: 500,
                }}
              >
                {netError}L
              </span>
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} md={3}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <StatusChip
              label={
                entry.totalizerError
                  ? `Error: ${entry.totalizerError}L`
                  : "Clean Shift"
              }
              color={entry.totalizerError ? "error" : "success"}
              variant="filled"
              size="small"
            />
            {entry.remarks && (
              <Tooltip title={entry.remarks}>
                <ChatIcon
                  fontSize="small"
                  color="action"
                  sx={{ cursor: "pointer" }}
                />
              </Tooltip>
            )}
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};
