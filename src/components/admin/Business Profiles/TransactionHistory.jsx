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
  IconButton,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  AccountBalanceWallet as WalletIcon,
  Payment as PaymentIcon,
  PendingActions as PendingIcon,
  CheckCircle as SuccessIcon,
  Cancel as FailedIcon,
  CalendarToday as CalendarIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import PaymentModal from "./TransactionSection/PaymentModal";
import api from "../../../utils/api";
import PaymentDetailsCollapse from "./TransactionSection/PaymentDetailsCollapse";
import PaymentImageModal from "./TransactionSection/PaymentImageModal";
import { usePermissions } from "../../../utils/permissionssHelper";
const TransactionHistory = ({ transactionHistory, fetchTransaction }) => {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
  const [chequeImageModalOpen, setChequeImageModalOpen] = useState(false);
  const [selectedChequeImage, setSelectedChequeImage] = useState("");
  const [selectedTransactionForImage, setSelectedTransactionForImage] =
    useState(null);
  const navigate = useNavigate();
  const { cid } = useParams();
  const permissions = usePermissions();
  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <PendingIcon color="warning" />;
      case "PROCESSING":
        return <PendingIcon color="info" />;
      case "PARTIALLY_PAID":
        return <PendingIcon color="warning" />;
      case "PAID":
        return <SuccessIcon color="success" />;
      case "OVERDUE":
        return <FailedIcon color="error" />;
      default:
        return null;
    }
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
    const typeMatch =
      typeFilter === "ALL" || transaction.paymentType === typeFilter;
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

  const handleRowExpand = (transactionId) => {
    setExpandedRows((prev) =>
      prev.includes(transactionId)
        ? prev.filter((id) => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const handleChequeImageClick = (imageUrl, transaction) => {
    setSelectedChequeImage(imageUrl);
    setSelectedTransactionForImage(transaction);
    setChequeImageModalOpen(true);
  };

  const handleChequeVerify = async (transactionId, status, reason) => {
    try {
      const response = await api.put(
        "/admin/business-profiles/update-cheque-status-of-a-transaction",
        {
          cid,
          transactionId,
          status,
          reason,
        }
      );
      if (response.status === 200) {
        fetchTransaction(); // Refresh the transaction list
      }
    } catch (error) {
      console.error("Error verifying cheque:", error);
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
            <MenuItem value="PARTIALLY_PAID">PARTIALLY_PAID</MenuItem>

            <MenuItem value="PAID">Paid</MenuItem>
            <MenuItem value="OVERDUE">Overdue</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Payment Type</InputLabel>
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            label="Payment Type"
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="SETTLEMENT">SETTLEMENT</MenuItem>
            <MenuItem value="INDIVIDUAL">INDIVIDUAL</MenuItem>
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
                    Payment Type
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
                const dateFormatted = extractDatePart(transaction?.orderedDate);
                const isExpanded = expandedRows.includes(
                  transaction.transactionId
                );

                return (
                  <React.Fragment key={transaction.transactionId}>
                    <TableRow
                      onClick={handleOrderDetailpageRedirect(
                        transaction.orderId
                      )}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>{transaction.transactionId}</TableCell>
                      <TableCell>{transaction.paymentType}</TableCell>
                      <TableCell>
                        ₹{transaction.amount?.toLocaleString("en-IN")}
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
                        {/* Pay Button for PENDING or OVERDUE transactions */}
                        {["PENDING", "OVERDUE", "PARTIALLY_PAID"].includes(
                          transaction.status
                        ) && (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTransaction(transaction);
                            }}
                            sx={{ mr: 1 }}
                            disabled={!permissions?.update}
                          >
                            Pay
                          </Button>
                        )}
                        {transaction.chequeVerificationFailedHistory &&
                          transaction.chequeVerificationFailedHistory.length >
                            0 && (
                            <IconButton
                              color="info"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Open a modal or display the info as needed.
                                // For example, you might set state to show an info modal.
                                handleRowExpand(transaction.transactionId);
                              }}
                            >
                              <InfoIcon />
                            </IconButton>
                          )}

                        {/* View Details Button for PAID transactions */}
                        {transaction.status === "PAID" && (
                          <Button
                            variant="outlined"
                            color="success"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle view details or receipt logic here
                              handleRowExpand(transaction.transactionId);
                            }}
                            sx={{ mr: 1 }}
                          >
                            View Receipt
                          </Button>
                        )}
                        {transaction.status === "PROCESSING" && (
                          <Button
                            variant="contained"
                            color="info"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowExpand(transaction.transactionId);
                            }}
                          >
                            Processing{" "}
                          </Button>
                        )}
                        {/* Expand/Collapse Icon */}
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowExpand(transaction.transactionId);
                          }}
                          disabled={
                            transaction.paymentMethod === "CASH" ||
                            transaction.paymentType === "SETTLEMENT" ||
                            transaction.status === "PENDING" ||
                            transaction.paymentType === "BULK_PAYMENT" ||
                            transaction.chequeVerificationFailedHistory
                              .length === null
                          }
                        >
                          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={8}
                      >
                        <PaymentDetailsCollapse
                          transaction={transaction}
                          isExpanded={isExpanded}
                          onChequeImageClick={(imageUrl) =>
                            handleChequeImageClick(imageUrl, transaction)
                          }
                          onChequeVerify={handleChequeVerify}
                          onExpand={handleRowExpand}
                        />
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
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

      <PaymentImageModal
        open={chequeImageModalOpen}
        onClose={() => setChequeImageModalOpen(false)}
        imageUrl={selectedChequeImage}
        transaction={selectedTransactionForImage}
        onChequeVerify={handleChequeVerify}
      />
      <PaymentModal
        open={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
        cid={cid}
        onPaymentSuccess={fetchTransaction}
      />
    </TableContainer>
  );
};

export default TransactionHistory;
