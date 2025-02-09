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
  Paper,
  useMediaQuery,
} from "@mui/material";

const TransactionHistory = ({ transactions }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to the first page after change
  };

  // Slice transactions for pagination
  const paginatedTransactions = transactions?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Safely extract the date part, handling undefined/null values
  const extractDatePart = (isoString) => {
    if (!isoString) return "N/A"; // Fallback for missing or null dates
    return isoString.split("T")[0];
  };

  return (
    <Box sx={{ marginTop: 4, paddingX: isSmallScreen ? 1 : 4 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: "text.primary",
          mb: 3,
          display: "flex",
          alignItems: "center",
        }}
      >
        Transaction History
      </Typography>

      {transactions.length === 0 ? (
        <Box sx={{ padding: 2, textAlign: "center" }}>
          <Typography variant="body1" color="textSecondary">
            No data available
          </Typography>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            overflowX: isSmallScreen ? "auto" : "hidden",
            boxShadow: 3,
          }}
        >
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ backgroundColor: "action.hover" }}>
              <TableRow>
                {[
                  "Description",
                  "Amount (₹)",
                  "Date",
                  "Previous Credit Amount",
                  "Upgraded Credit Amount",
                  "Previous Interest Rate",
                  "Upgraded Interest Rate",
                  "Previous Credit Period",
                  "Upgraded Credit Period",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontSize: isSmallScreen ? "12px" : "14px",
                      padding: isSmallScreen ? "6px" : "12px",
                      whiteSpace: isSmallScreen ? "nowrap" : "normal",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTransactions.map((transaction, index) => (
                <TableRow
                  key={transaction.transactionId}
                  sx={{
                    backgroundColor:
                      index % 2 === 0
                        ? "background.default"
                        : "background.default",
                    "&:hover": { backgroundColor: "action.hover" },
                  }}
                >
                  <TableCell sx={{ fontSize: isSmallScreen ? "12px" : "14px" }}>
                    {transaction.description || "No description"}
                  </TableCell>
                  <TableCell sx={{ fontSize: isSmallScreen ? "12px" : "14px" }}>
                    ₹{transaction.amount?.toLocaleString("en-IN") || "N/A"}
                  </TableCell>
                  <TableCell sx={{ fontSize: isSmallScreen ? "12px" : "14px" }}>
                    {extractDatePart(transaction.date)}
                  </TableCell>
                  <TableCell sx={{ fontSize: isSmallScreen ? "12px" : "14px" }}>
                    {transaction.previousCreditAmount
                      ? `₹${transaction.previousCreditAmount.toLocaleString(
                          "en-IN"
                        )}`
                      : "Initial"}
                  </TableCell>
                  <TableCell sx={{ fontSize: isSmallScreen ? "12px" : "14px" }}>
                    {transaction.upgradedCreditAmount
                      ? `₹${transaction.upgradedCreditAmount.toLocaleString(
                          "en-IN"
                        )}`
                      : "Initial"}
                  </TableCell>
                  <TableCell sx={{ fontSize: isSmallScreen ? "12px" : "14px" }}>
                    {transaction.previousInterestRate ?? "Initial"}
                  </TableCell>
                  <TableCell sx={{ fontSize: isSmallScreen ? "12px" : "14px" }}>
                    {transaction.upgradedInterestRate ?? "Initial"}
                  </TableCell>
                  <TableCell sx={{ fontSize: isSmallScreen ? "12px" : "14px" }}>
                    {transaction.previousCreditPeriod ?? "Initial"}
                  </TableCell>
                  <TableCell sx={{ fontSize: isSmallScreen ? "12px" : "14px" }}>
                    {transaction.upgradedCreditPeriod ?? "Initial"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TablePagination
        component="div"
        count={transactions.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]} // Ensure 5 is included
        sx={{ marginTop: 2 }}
      />
    </Box>
  );
};

export default TransactionHistory;
