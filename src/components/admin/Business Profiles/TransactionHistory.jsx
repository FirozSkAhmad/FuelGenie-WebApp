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
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  AccountBalanceWallet as WalletIcon,
  Payment as PaymentIcon,
  PendingActions as PendingIcon,
  CheckCircle as SuccessIcon,
  Cancel as FailedIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import api from "../../../utils/api";

const TransactionHistory = ({ transactionHistory, fetchTransaction }) => {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [chequeImage, setChequeImage] = useState(null);
  const navigate = useNavigate();
  const { cid } = useParams();
  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <PendingIcon color="warning" />;
      case "PROCESSING":
        return <PendingIcon color="info" />;
      case "PAID":
        return <SuccessIcon color="success" />;
      case "OVERDUE":
        return <FailedIcon color="error" />;
      default:
        return null;
    }
  };
  const handleOpenModal = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTransaction(null);
    setPaymentMethod("");
    setPaymentDetails("");
    setChequeImage(null);
  };
  const handleOrderDetailpageRedirect = (orderId) => () => {
    navigate(`/operations/orders/${orderId}`);
  };

  const extractDatePart = (isoString) => {
    if (!isoString) return "N/A";
    return isoString.split("T")[0];
  };

  const getDueDateColor = (dueDate, status) => {
    if (status === "PAID") return "inherit";
    if (!dueDate) return "inherit";

    const today = new Date();
    const todayDatePart = extractDatePart(today.toISOString());
    const dueDatePart = extractDatePart(dueDate);

    const todayDate = new Date(todayDatePart);
    const dueDateObj = new Date(dueDatePart);

    const timeDifference = dueDateObj - todayDate;
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference < 1) return "red";
    if (daysDifference < 4) return "orange";
    return "green";
  };

  const filteredTransactions = transactionHistory.filter((transaction) => {
    const statusMatch =
      statusFilter === "ALL" || transaction.status === statusFilter;
    const typeMatch = typeFilter === "ALL" || transaction.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedTransactions = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const handlePayment = async () => {
    if (!selectedTransaction) return;

    const formData = new FormData();
    formData.append("cid", cid);
    formData.append("transactionId", selectedTransaction.transactionId);
    formData.append("paymentMethod", paymentMethod);
    formData.append("paymentDetails", paymentDetails);
    if (chequeImage) {
      formData.append("chequeImage", chequeImage);
    }

    try {
      const response = await api.put(
        "/admin/business-profiles/pay-a-creditTransactionAmount",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Required for file uploads
          },
        }
      );

      if (response.status === 200) {
        // Update the transaction status in the UI
        const updatedTransactions = transactionHistory.map((t) =>
          t.transactionId === selectedTransaction.transactionId
            ? { ...t, status: "PAID" }
            : t
        );
        transactionHistory = updatedTransactions;
        fetchTransaction();
        handleCloseModal();
      } else {
        console.error("Payment failed");
      }
    } catch (error) {
      console.error("Error making payment:", error);
    }
  };
  return (
    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
      <Typography variant="h6" sx={{ padding: 2 }}>
        Transaction History
      </Typography>

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
            <MenuItem value="PROCESSING">Processing</MenuItem>
            <MenuItem value="PAID">Paid</MenuItem>
            <MenuItem value="OVERDUE">Overdue</MenuItem>
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

                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTransactions.map((transaction) => {
                const dueDateColor = getDueDateColor(
                  transaction.dueDate,
                  transaction.status
                );
                const dueDateFormatted = extractDatePart(transaction.dueDate);
                const dateFormatted = extractDatePart(transaction.orderedDate);

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
                    <TableCell>
                      {transaction.status !== "PAID" && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(transaction);
                          }}
                        >
                          Pay
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredTransactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
      {/* Modal Code below  */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Pay Credit Transaction Amount
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              label="Payment Method"
            >
              <MenuItem value="CASH">Cash</MenuItem>
              <MenuItem value="CHEQUE">Cheque</MenuItem>
              <MenuItem value="ONLINE">Online</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Payment Details"
            value={paymentDetails}
            onChange={(e) => setPaymentDetails(e.target.value)}
            sx={{ mt: 2 }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setChequeImage(e.target.files[0])}
            style={{ marginTop: 16 }}
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleCloseModal} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handlePayment}>
              Pay
            </Button>
          </Box>
        </Box>
      </Modal>
    </TableContainer>
  );
};

export default TransactionHistory;
