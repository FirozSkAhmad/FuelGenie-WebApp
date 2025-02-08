import React from "react";
import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Box,
  Chip,
} from "@mui/material";

const SettlementHistory = ({ settlementHistory, isSmallScreen }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedSettlements = settlementHistory.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const extractDatePart = (isoString) => isoString.split("T")[0];

  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCESS":
        return "success";
      case "FAILED":
        return "error";
      case "PENDING":
        return "warning";
      default:
        return "info";
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ marginTop: 4 }}>
        Settlement History
      </Typography>
      {settlementHistory.length === 0 ? (
        <Box sx={{ padding: 2, textAlign: "center" }}>
          <Typography variant="body1" color="textSecondary">
            No settlement history available
          </Typography>
        </Box>
      ) : isSmallScreen ? (
        <Box>
          {paginatedSettlements.map((settlement) => (
            <Box
              key={settlement._id}
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                padding: 2,
                marginBottom: 2,
              }}
            >
              <Typography variant="subtitle1">
                Settlement ID: {settlement.settlementId}
              </Typography>
              <Typography variant="body2">
                Settled: ₹{settlement.settledAmount.toLocaleString("en-IN")}
              </Typography>
              <Typography variant="body2">
                Outstanding: ₹
                {settlement.outstandingAmount.toLocaleString("en-IN")}
              </Typography>
              <Typography variant="body2">
                Total Due: ₹
                {settlement.totalAmountNeedToPay.toLocaleString("en-IN")}
              </Typography>
              <Typography variant="body2">
                Status:{" "}
                <Chip
                  label={settlement.status}
                  color={getStatusColor(settlement.status)}
                />
              </Typography>
              <Typography variant="body2">
                Date: {extractDatePart(settlement.settlementDate)}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Settlement ID</TableCell>
                <TableCell>Settled</TableCell>
                <TableCell>Outstanding</TableCell>
                <TableCell>Total Due</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSettlements.map((settlement) => (
                <TableRow key={settlement._id}>
                  <TableCell>{settlement.settlementId}</TableCell>
                  <TableCell>
                    ₹{settlement.settledAmount.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    ₹{settlement.outstandingAmount.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    ₹{settlement.totalAmountNeedToPay.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={settlement.status}
                      color={getStatusColor(settlement.status)}
                    />
                  </TableCell>
                  <TableCell>
                    {extractDatePart(settlement.settlementDate)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <TablePagination
        component="div"
        count={settlementHistory.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default SettlementHistory;
