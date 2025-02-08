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
} from "@mui/material";

const TransactionHistory = ({ transactions, isSmallScreen }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
    <>
      <Typography variant="h6" gutterBottom sx={{ marginTop: 4 }}>
        Transaction History
      </Typography>
      {transactions.length === 0 ? (
        <Box sx={{ padding: 2, textAlign: "center" }}>
          <Typography variant="body1" color="textSecondary">
            No data available
          </Typography>
        </Box>
      ) : isSmallScreen ? (
        <Box>
          {paginatedTransactions.map((transaction) => {
            const date = extractDatePart(transaction.date); // Safely extract date
            return (
              <Box
                key={transaction.transactionId}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 1,
                  padding: 2,
                  marginBottom: 2,
                }}
              >
                <Typography variant="subtitle1">
                  {transaction.description || "No description"}
                </Typography>
                <Typography variant="body2">
                  Amount: ₹
                  {transaction.amount?.toLocaleString("en-IN") || "N/A"}
                </Typography>
                <Typography variant="body2">Date: {date}</Typography>
                <Typography variant="body2">
                  Previous Credit Amount:{" "}
                  {transaction.previousCreditAmount
                    ? `₹${transaction.previousCreditAmount.toLocaleString(
                        "en-IN"
                      )}`
                    : "Initial"}
                </Typography>
                <Typography variant="body2">
                  Upgraded Credit Amount:{" "}
                  {transaction.upgradedCreditAmount
                    ? `₹${transaction.upgradedCreditAmount.toLocaleString(
                        "en-IN"
                      )}`
                    : "Initial"}
                </Typography>
                <Typography variant="body2">
                  Previous Interest Rate:{" "}
                  {transaction.previousInterestRate ?? "Initial"}
                </Typography>
                <Typography variant="body2">
                  Upgraded Interest Rate:{" "}
                  {transaction.upgradedInterestRate ?? "Initial"}
                </Typography>
                <Typography variant="body2">
                  Previous Credit Period:{" "}
                  {transaction.previousCreditPeriod ?? "Initial"}
                </Typography>
                <Typography variant="body2">
                  Upgraded Credit Period:{" "}
                  {transaction.upgradedCreditPeriod ?? "Initial"}
                </Typography>
              </Box>
            );
          })}
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Amount (₹)</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Previous Credit Amount</TableCell>
                <TableCell>Upgraded Credit Amount</TableCell>
                <TableCell>Previous Interest Rate</TableCell>
                <TableCell>Upgraded Interest Rate</TableCell>
                <TableCell>Previous Credit Period</TableCell>
                <TableCell>Upgraded Credit Period</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.transactionId}>
                  <TableCell>
                    {transaction.description || "No description"}
                  </TableCell>
                  <TableCell>
                    ₹{transaction.amount?.toLocaleString("en-IN") || "N/A"}
                  </TableCell>
                  <TableCell>{extractDatePart(transaction.date)}</TableCell>
                  <TableCell>
                    {transaction.previousCreditAmount
                      ? `₹${transaction.previousCreditAmount.toLocaleString(
                          "en-IN"
                        )}`
                      : "Initial"}
                  </TableCell>
                  <TableCell>
                    {transaction.upgradedCreditAmount
                      ? `₹${transaction.upgradedCreditAmount.toLocaleString(
                          "en-IN"
                        )}`
                      : "Initial"}
                  </TableCell>
                  <TableCell>
                    {transaction.previousInterestRate ?? "Initial"}
                  </TableCell>
                  <TableCell>
                    {transaction.upgradedInterestRate ?? "Initial"}
                  </TableCell>
                  <TableCell>
                    {transaction.previousCreditPeriod ?? "Initial"}
                  </TableCell>
                  <TableCell>
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
      />
    </>
  );
};

export default TransactionHistory;
