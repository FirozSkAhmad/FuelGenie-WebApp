import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Pagination,
  Alert,
  Snackbar,
  Button,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import OnboardPumpModal from "../../../components/management/Pumps/OnboardPumpModal";
import { styled } from "@mui/material/styles";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";
import { usePermissions } from "../../../utils/permissionssHelper";
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Pumps = () => {
  const theme = useTheme();
  const permissions = usePermissions();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [pumps, setPumps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const fetchPumps = async (page) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/management/pumps/get-pumps?page=${page}&limit=10`
      );
      setPumps(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotalItems(response.data.pagination.total);
      setError(null);
    } catch (err) {
      setError("Failed to fetch pumps. Please try again later.");
      setSnackbar({
        open: true,
        message: "Failed to fetch pumps",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPumps(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleOnboardSuccess = () => {
    fetchPumps(page);
    setSnackbar({
      open: true,
      message: "Pump onboarded successfully!",
      severity: "success",
    });
  };

  const handleRowClick = (pumpId) => {
    navigate(`/management/pumps/${pumpId}`);
  };

  const tableHeaders = [
    "Pump ID",
    "Pump Name",
    "Owner Name",
    "Contact No",
    "Email",
    "State",
    "City",
    "Pincode",
  ];

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <BreadcrumbNavigation />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Pumps Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenModal}
          sx={{ minWidth: 180 }}
          disabled={!permissions?.create}
        >
          + New Pump
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress size={60} />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography color="error">{error}</Typography>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => fetchPumps(page)}
          >
            Retry
          </Button>
        </Box>
      ) : pumps.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            mt: 4,
            p: 4,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="textSecondary">
            No pumps found
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              overflowX: "auto",
              boxShadow: theme.shadows[1],
            }}
          >
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ bgcolor: theme.palette.background.default }}>
                <TableRow>
                  {tableHeaders.map((header) => (
                    <TableCell key={header} sx={{ fontWeight: 600 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {pumps.map((pump) => (
                  <StyledTableRow
                    key={pump.pumpId}
                    hover
                    onClick={() => handleRowClick(pump.pumpId)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{pump.pumpId}</TableCell>
                    <TableCell>{pump.pumpName}</TableCell>
                    <TableCell>{pump.ownerName}</TableCell>
                    <TableCell>{pump.contactNo}</TableCell>
                    <TableCell>{pump.emailId}</TableCell>
                    <TableCell>{pump.state}</TableCell>
                    <TableCell>{pump.city}</TableCell>
                    <TableCell>{pump.pincode}</TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 3,
              p: 2,
              bgcolor: "background.paper",
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Showing {(page - 1) * 10 + 1} - {Math.min(page * 10, totalItems)}{" "}
              of {totalItems}
            </Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              siblingCount={isMobile ? 0 : 1}
            />
          </Box>
        </>
      )}

      <OnboardPumpModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSuccess={handleOnboardSuccess}
        onError={(message) =>
          setSnackbar({
            open: true,
            message,
            severity: "error",
          })
        }
      />

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

export default Pumps;
