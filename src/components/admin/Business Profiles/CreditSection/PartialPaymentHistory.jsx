import React, { useState } from "react";
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
  Button,
  Modal,
  IconButton,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  useTheme,
  CircularProgress,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Download,
  Receipt,
  Visibility,
  Close,
  CheckCircle,
} from "@mui/icons-material";
import api from "../../../../utils/api";

const PartialPaymentHistory = ({ partialPaymentHistory }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [reason, setReason] = useState("");

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const paginatedPartialPayments = partialPaymentHistory?.length
    ? partialPaymentHistory.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      )
    : [];

  const extractDatePart = (isoString) => isoString.split("T")[0];

  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCESS":
      case "VERIFIED":
        return "success";
      case "FAILED":
      case "FAILED_VERIFICATION":
        return "error";
      case "PENDING":
      case "PENDING_VERIFICATION":
        return "warning";
      default:
        return "info";
    }
  };

  const payment = Array.isArray(partialPaymentHistory)
    ? partialPaymentHistory.find((p) => p._id === selectedId)
    : null;

  const handleOpenModal = (imageUrl, id) => {
    setSelectedImage(imageUrl);
    setSelectedId(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setOpenModal(false);
  };

  const toggleRowExpansion = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const downloadFile = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleVerifyPartialPayment = async () => {
    if (!payment || !verificationStatus) return;

    setLoading(true);
    try {
      const requestBody = {
        cid: payment.customerId,
        paymentId: payment.paymentId,
        verificationStatus,
        ...(verificationStatus === "FAILED" && reason ? { reason } : {}),
      };

      await api.put(
        "/admin/business-profiles/verify-partial-payment",
        requestBody
      );
      alert(`Partial payment verification marked as ${verificationStatus}!`);
      setVerificationStatus("");
      setReason("");
    } catch (error) {
      console.error("Partial payment verification failed:", error);
      alert("Partial payment verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: isSmallScreen ? 1 : 3,
        backgroundColor: "background.paper",
        borderRadius: 2,
      }}
    >
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
        Partial Payment History
      </Typography>
      {partialPaymentHistory && partialPaymentHistory.length === 0 ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            No partial payment records found
          </Typography>
        </Box>
      ) : isSmallScreen ? (
        // Mobile View
        <Box>
          {paginatedPartialPayments.map((payment) => (
            <Card key={payment._id} sx={{ mb: 2, boxShadow: 1 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    {extractDatePart(payment.timestamp)}
                  </Typography>
                  <Chip
                    label={payment.status}
                    size="small"
                    color={getStatusColor(payment.status)}
                    sx={{ borderRadius: 1 }}
                  />
                </Box>

                <Typography variant="h6" sx={{ mb: 1 }}>
                  ₹{payment.amountPaid.toLocaleString("en-IN")}
                </Typography>

                <Grid container spacing={1} sx={{ mb: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Payment ID
                    </Typography>
                    <Typography variant="body2">{payment.paymentId}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Method
                    </Typography>
                    <Typography variant="body2">
                      {payment.paymentMethod.replace("_", " ")}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Cleared Transactions */}
                <Box
                  sx={{
                    mt: 1.5,
                    borderTop: "1px solid",
                    borderColor: "divider",
                    pt: 1.5,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Cleared Transactions
                  </Typography>
                  {payment.clearedTransactions?.length > 0 ? (
                    payment.clearedTransactions.map((transaction, index) => (
                      <Box key={index} sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          Transaction ID: {transaction.transactionId}
                        </Typography>
                        <Typography variant="body2">
                          Amount Cleared: ₹
                          {transaction.amountCleared.toLocaleString("en-IN")}
                        </Typography>
                        <Typography variant="body2">
                          Remaining: ₹
                          {transaction.remainingAmount.toLocaleString("en-IN")}
                        </Typography>
                        <Typography variant="body2">
                          Provisional: {transaction.provisional ? "Yes" : "No"}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No cleared transactions
                    </Typography>
                  )}
                </Box>

                {payment.paymentMethod === "CHEQUE" && (
                  <Box
                    sx={{
                      mt: 1.5,
                      borderTop: "1px solid",
                      borderColor: "divider",
                      pt: 1.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Cheque Details
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          {payment.paymentDetails?.chequeNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Cheque No.
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          startIcon={<Visibility fontSize="small" />}
                          onClick={() =>
                            handleOpenModal(
                              payment.paymentDetails?.chequeImageUrl
                            )
                          }
                          sx={{ mt: 0.5 }}
                        >
                          View
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {payment.paymentMethod === "ACCOUNT_TRANSFER" && (
                  <Box
                    sx={{
                      mt: 1.5,
                      borderTop: "1px solid",
                      borderColor: "divider",
                      pt: 1.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Transfer Details
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          UTR: {payment.paymentDetails?.UTR}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          startIcon={<Receipt fontSize="small" />}
                          onClick={() =>
                            downloadFile(
                              payment.paymentDetails?.transferReceiptUrl
                            )
                          }
                        >
                          Receipt
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        // Desktop View
        <TableContainer
          sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1 }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "action.hover" }}>
                <TableCell>Payment ID</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPartialPayments.map((payment) => {
                const isExpanded = expandedRow === payment._id;

                return (
                  <React.Fragment key={payment._id}>
                    <TableRow hover>
                      <TableCell>{payment.paymentId}</TableCell>
                      <TableCell align="right">
                        ₹{payment.amountPaid.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        {extractDatePart(payment.timestamp)}
                      </TableCell>
                      <TableCell>
                        {payment.paymentMethod.replace("_", " ")}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={payment.status}
                          color={getStatusColor(payment.status)}
                          size="small"
                          sx={{ minWidth: 80 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => toggleRowExpansion(payment._id)}
                          color={isExpanded ? "primary" : "default"}
                          disabled={payment.paymentMethod === "CASH"}
                        >
                          {isExpanded ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          sx={{ py: 2, backgroundColor: "background.default" }}
                        >
                          <Box sx={{ pl: 6, pr: 2 }}>
                            {payment.paymentMethod === "CHEQUE" && (
                              <Grid container spacing={2}>
                                <Grid item xs={4}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Cheque Number
                                  </Typography>
                                  <Typography variant="body1">
                                    {payment.paymentDetails?.chequeNumber}
                                  </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Bank Name
                                  </Typography>
                                  <Typography variant="body1">
                                    {payment.paymentDetails?.bankName}
                                  </Typography>
                                </Grid>
                                <Grid
                                  item
                                  xs={4}
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<Visibility />}
                                    onClick={() =>
                                      handleOpenModal(
                                        payment.paymentDetails?.chequeImageUrl,
                                        payment._id
                                      )
                                    }
                                  >
                                    View Cheque
                                  </Button>
                                </Grid>
                              </Grid>
                            )}
                            {payment.paymentMethod === "ACCOUNT_TRANSFER" && (
                              <Grid container spacing={2}>
                                <Grid item xs={8}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    UTR Number
                                  </Typography>
                                  <Typography variant="body1">
                                    {payment.paymentDetails?.UTR}
                                  </Typography>
                                </Grid>
                                <Grid
                                  item
                                  xs={4}
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<Receipt />}
                                    onClick={() =>
                                      downloadFile(
                                        payment.paymentDetails
                                          ?.transferReceiptUrl
                                      )
                                    }
                                  >
                                    Get Receipt
                                  </Button>
                                </Grid>
                              </Grid>
                            )}
                            {/* Cleared Transactions Table */}
                            {payment.clearedTransactions?.length > 0 ? (
                              <Box sx={{ mt: 4 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                  Cleared Transactions
                                </Typography>
                                <TableContainer>
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Transaction ID</TableCell>
                                        <TableCell align="right">
                                          Amount Cleared
                                        </TableCell>
                                        <TableCell align="right">
                                          Remaining Amount
                                        </TableCell>
                                        <TableCell>Provisional</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {payment.clearedTransactions.map(
                                        (transaction) => (
                                          <TableRow
                                            key={transaction.transactionId}
                                          >
                                            <TableCell>
                                              {transaction.transactionId}
                                            </TableCell>
                                            <TableCell align="right">
                                              ₹
                                              {transaction.amountCleared.toLocaleString(
                                                "en-IN"
                                              )}
                                            </TableCell>
                                            <TableCell align="right">
                                              ₹
                                              {transaction.remainingAmount.toLocaleString(
                                                "en-IN"
                                              )}
                                            </TableCell>
                                            <TableCell>
                                              {transaction.provisional
                                                ? "Yes"
                                                : "No"}
                                            </TableCell>
                                          </TableRow>
                                        )
                                      )}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </Box>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 2 }}
                              >
                                No cleared transactions
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={partialPaymentHistory.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ borderTop: "1px solid", borderColor: "divider" }}
      />
      {/* Image Preview Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 800,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 3,
            p: 3,
            maxHeight: "100vh",
            overflow: "auto",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Cheque Preview
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <Close />
            </IconButton>
          </Box>

          {/* Image Preview */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              borderRadius: 2,
              mb: 3,
            }}
          >
            <img
              src={selectedImage}
              alt="Cheque preview"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "60vh",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Payment Details */}
          {payment && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Payment Details
              </Typography>
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <Typography>
                  <strong>Payment ID:</strong> {payment.paymentId}
                </Typography>
                <Typography>
                  <strong>Customer ID:</strong> {payment.customerId}
                </Typography>
                <Typography>
                  <strong>Amount Paid:</strong> ₹
                  {payment.amountPaid.toLocaleString("en-IN")}
                </Typography>
                <Typography>
                  <strong>Payment Date:</strong>{" "}
                  {new Date(payment.timestamp).toLocaleDateString()}
                </Typography>
                <Typography>
                  <strong>Payment Method:</strong>{" "}
                  {payment.paymentMethod.replace("_", " ")}
                </Typography>
              </Box>

              {/* Cheque Details */}
              {payment.paymentMethod === "CHEQUE" && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Cheque Details
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 2,
                    }}
                  >
                    <Typography>
                      <strong>Cheque Number:</strong>{" "}
                      {payment.paymentDetails?.chequeNumber}
                    </Typography>
                    <Typography>
                      <strong>Bank Name:</strong>{" "}
                      {payment.paymentDetails?.bankName}
                    </Typography>
                    <Typography>
                      <strong>Issued Date:</strong>{" "}
                      {payment.paymentDetails?.chequeIssuedDate}
                    </Typography>
                    <Typography>
                      <strong>Received Date:</strong>{" "}
                      {payment.paymentDetails?.chequeReceivedDate}
                    </Typography>
                    <Typography>
                      <strong>Cheque Amount:</strong> ₹
                      {payment.paymentDetails?.chequeAmount}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography>
                        <strong>Verification Status:</strong>
                      </Typography>
                      <Chip
                        label={payment.verificationStatus || verificationStatus}
                        color={
                          (payment.verificationStatus || verificationStatus) ===
                          "SUCCESS"
                            ? "success"
                            : (payment.verificationStatus ||
                                verificationStatus) === "PENDING_VERIFICATION"
                            ? "warning"
                            : "error"
                        }
                        size="small"
                      />
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {/* Verification Dropdown */}
          {payment?.paymentMethod === "CHEQUE" &&
            payment?.chequeVerificationStatus !== "SUCCESS" && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Verify Cheque
                </Typography>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Select
                    value={verificationStatus}
                    onChange={(e) => {
                      setVerificationStatus(e.target.value);
                      setReason(""); // Reset reason when changing status
                    }}
                    displayEmpty
                    sx={{ minWidth: 200 }}
                  >
                    <MenuItem value="" disabled>
                      Select Verification Status
                    </MenuItem>
                    <MenuItem value="SUCCESS">SUCCESS</MenuItem>
                    <MenuItem value="FAILED">FAILED</MenuItem>
                  </Select>
                </Box>

                {/* Show reason input if FAILED is selected */}
                {verificationStatus === "FAILED" && (
                  <TextField
                    label="Failure Reason"
                    variant="outlined"
                    fullWidth
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                )}
              </Box>
            )}

          {/* Action Buttons */}
          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={() => downloadFile(selectedImage, "cheque_image.png")}
            >
              Download
            </Button>
            {payment?.paymentMethod === "CHEQUE" && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<CheckCircle />}
                onClick={handleVerifyPartialPayment}
                disabled={!verificationStatus}
              >
                Verify
              </Button>
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
export default PartialPaymentHistory;
