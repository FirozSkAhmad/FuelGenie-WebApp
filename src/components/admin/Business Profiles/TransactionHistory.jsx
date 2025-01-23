import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TablePagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  AccountBalanceWallet as WalletIcon,
  Payment as PaymentIcon,
  PendingActions as PendingIcon,
  CheckCircle as SuccessIcon,
  Cancel as FailedIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";

const TransactionHistory = ({ transactionHistory }) => {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [page, setPage] = useState(0); // Pagination page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page
  const navigate = useNavigate();

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <PendingIcon color="warning" />;
      case "SUCCESS":
        return <SuccessIcon color="success" />;
      case "FAILED":
        return <FailedIcon color="error" />;
      default:
        return null;
    }
  };

  const handleOrderDetailpageRedirect = (orderId) => () => {
    navigate(`/operations/orders/${orderId}`);
  };

  // Extract only the date part (YYYY-MM-DD) from the ISO string
  const extractDatePart = (isoString) => {
    return isoString.split("T")[0];
  };

  // Calculate the difference in days between the due date and the current date
  const getDueDateColor = (dueDate) => {
    const today = new Date();
    const todayDatePart = extractDatePart(today.toISOString()); // Current date part
    const dueDatePart = extractDatePart(dueDate); // Due date part

    // Convert to Date objects for comparison
    const todayDate = new Date(todayDatePart);
    const dueDateObj = new Date(dueDatePart);

    const timeDifference = dueDateObj - todayDate;
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference < 1) {
      return "red"; // Less than 1 days
    } else if (daysDifference < 4) {
      return "orange"; // Less than 4 days
    } else {
      return "green"; // More than 5 days
    }
  };

  // Filter transactions based on status and type
  const filteredTransactions = transactionHistory.filter((transaction) => {
    const statusMatch =
      statusFilter === "ALL" || transaction.status === statusFilter;
    const typeMatch = typeFilter === "ALL" || transaction.type === typeFilter;
    return statusMatch && typeMatch;
  });

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page changes
  };

  // Paginated transactions
  const paginatedTransactions = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
      <Typography variant="h6" sx={{ padding: 2 }}>
        Transaction History
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, padding: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="SUCCESS">Success</MenuItem>
            <MenuItem value="FAILED">Failed</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            label="Type"
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="DEBIT">Debit</MenuItem>
            <MenuItem value="CREDIT">Credit</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Show message if no transactions are found */}
      {filteredTransactions.length === 0 ? (
        <Box sx={{ padding: 2 }}>
          <Typography variant="body1" color="textSecondary">
            No transactions found.
          </Typography>
        </Box>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <WalletIcon sx={{ marginRight: 1 }} />
                    Transaction ID
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <PaymentIcon sx={{ marginRight: 1 }} />
                    Type
                  </Box>
                </TableCell>
                <TableCell>Amount (INR)</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <PendingIcon sx={{ marginRight: 1 }} />
                    Status
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <CalendarIcon sx={{ marginRight: 1 }} />
                    Date
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <CalendarIcon sx={{ marginRight: 1 }} />
                    Due Date
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTransactions.map((transaction) => {
                const dueDateColor = getDueDateColor(transaction.dueDate);
                const dueDateFormatted = extractDatePart(transaction.dueDate); // Format due date
                const dateFormatted = extractDatePart(transaction.date); // Format date
                return (
                  <TableRow
                    key={transaction.transactionId}
                    onClick={handleOrderDetailpageRedirect(transaction.orderId)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{transaction.transactionId}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>
                      ₹{transaction.amount.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {getStatusIcon(transaction.status)}
                        <Typography sx={{ marginLeft: 1 }}>
                          {transaction.status}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{dateFormatted}</TableCell>
                    <TableCell>
                      <Typography sx={{ color: dueDateColor }}>
                        {dueDateFormatted}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]} // Options for rows per page
            component="div"
            count={filteredTransactions.length} // Total number of transactions
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </TableContainer>
  );
};

export default TransactionHistory;
