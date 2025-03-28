import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
  Pagination,
  CircularProgress,
  styled,
} from "@mui/material";
import api from "../../../utils/api";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";

const StyledTableHeader = styled(TableHead)(({ theme }) => ({
  //   backgroundColor: theme.shadows[10],
  color: theme.palette.common.white,
}));

const ClickableTableRow = styled(TableRow)(({ theme }) => ({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function TotalizerErrors() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          "/operations/totalizer-errors/get-totalizer-errors"
        );
        setErrors(response.data.data);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRowClick = (rcNumber, loginHistoryId) => {
    navigate(
      `/operations/totalizer-errors/detail/${encodeURIComponent(
        rcNumber
      )}/${loginHistoryId}`
    );
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress size={60} />
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      <BreadcrumbNavigation />
      <Typography variant="h4" gutterBottom>
        Totalizer Errors
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <StyledTableHeader>
            <TableRow>
              <TableCell>RC Number</TableCell>
              <TableCell>Driver ID</TableCell>
              <TableCell>Shift</TableCell>
              <TableCell>Totalizer Error</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </StyledTableHeader>
          <TableBody>
            {errors.map((error) => (
              <ClickableTableRow
                key={error.loginHistoryId}
                onClick={() =>
                  handleRowClick(error.rcNumber, error.loginHistoryId)
                }
              >
                <TableCell>{error.rcNumber}</TableCell>
                <TableCell>{error.driverId}</TableCell>
                <TableCell>{error.shift}</TableCell>
                <TableCell>{error.totalizerError}</TableCell>
                <TableCell>
                  <Chip
                    label={error.isResolved ? "Resolved" : "Unresolved"}
                    color={error.isResolved ? "success" : "error"}
                  />
                </TableCell>
              </ClickableTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={pagination.totalPages}
          page={pagination.currentPage}
          color="primary"
        />
      </Box>
    </Box>
  );
}
