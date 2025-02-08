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
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Download,
} from "@mui/icons-material";

const PaymentHistory = ({ paymentHistory, isSmallScreen }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedPayments = paymentHistory.slice(
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

  const handleOpenModal = (imageUrl) => {
    setSelectedImage(imageUrl);
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

  return (
    <>
      {/* Payment History Title */}
      <Typography variant="h6" gutterBottom sx={{ marginTop: 4 }}>
        Payment History
      </Typography>

      {/* No Data Available */}
      {paymentHistory.length === 0 ? (
        <Box sx={{ padding: 2, textAlign: "center" }}>
          <Typography variant="body1" color="textSecondary">
            No payment history available
          </Typography>
        </Box>
      ) : isSmallScreen ? (
        // Small Screen Layout
        <Box>
          {paginatedPayments.map((payment) => (
            <Card key={payment._id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1">
                  Payment ID: {payment.paymentId}
                </Typography>
                <Typography variant="body2">
                  Amount: ₹{payment.amountPaid.toLocaleString("en-IN")}
                </Typography>
                <Typography variant="body2">
                  Date: {extractDatePart(payment.paymentDate)}
                </Typography>
                <Typography variant="body2">
                  Method: {payment.paymentMethod}
                </Typography>
                <Typography variant="body2">
                  Status:{" "}
                  <Chip
                    label={payment.status}
                    color={getStatusColor(payment.status)}
                  />
                </Typography>

                {/* Payment Details */}
                {payment.paymentMethod === "CHEQUE" && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      Cheque Number: {payment.paymentDetails?.chequeNumber}
                    </Typography>
                    <Typography variant="body2">
                      Bank Name: {payment.paymentDetails?.bankName}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download />}
                      onClick={() =>
                        handleOpenModal(payment.paymentDetails?.chequeImageUrl)
                      }
                    >
                      View Cheque
                    </Button>
                  </Box>
                )}
                {payment.paymentMethod === "ACCOUNT_TRANSFER" && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      UTR: {payment.paymentDetails?.UTR}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download />}
                      onClick={() =>
                        downloadFile(
                          payment.paymentDetails?.transferReceiptUrl,
                          "transfer_receipt.pdf"
                        )
                      }
                    >
                      Download Transfer Receipt
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        // Desktop Layout
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Payment ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPayments.map((payment) => {
                const isExpanded = expandedRow === payment._id;

                return (
                  <React.Fragment key={payment._id}>
                    <TableRow>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => toggleRowExpansion(payment._id)}
                        >
                          {isExpanded ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell>{payment.paymentId}</TableCell>
                      <TableCell>
                        ₹{payment.amountPaid.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        {extractDatePart(payment.paymentDate)}
                      </TableCell>
                      <TableCell>{payment.paymentMethod}</TableCell>
                      <TableCell>
                        <Chip
                          label={payment.status}
                          color={getStatusColor(payment.status)}
                        />
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <Box sx={{ p: 2 }}>
                            {payment.paymentMethod === "CHEQUE" && (
                              <Card>
                                <CardContent>
                                  <Typography variant="body2">
                                    Cheque Number:{" "}
                                    {payment.paymentDetails?.chequeNumber}
                                  </Typography>
                                  <Typography variant="body2">
                                    Bank Name:{" "}
                                    {payment.paymentDetails?.bankName}
                                  </Typography>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Download />}
                                    onClick={() =>
                                      handleOpenModal(
                                        payment.paymentDetails?.chequeImageUrl
                                      )
                                    }
                                  >
                                    View Cheque
                                  </Button>
                                </CardContent>
                              </Card>
                            )}
                            {payment.paymentMethod === "ACCOUNT_TRANSFER" && (
                              <Card>
                                <CardContent>
                                  <Typography variant="body2">
                                    UTR: {payment.paymentDetails?.UTR}
                                  </Typography>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Download />}
                                    onClick={() =>
                                      downloadFile(
                                        payment.paymentDetails
                                          ?.transferReceiptUrl,
                                        "transfer_receipt.pdf"
                                      )
                                    }
                                  >
                                    Download Transfer Receipt
                                  </Button>
                                </CardContent>
                              </Card>
                            )}
                            {payment.paymentMethod === "CASH" && (
                              <Typography variant="body2">
                                Cash Payment
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
        component="div"
        count={paymentHistory.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Modal for Cheque Image */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <img
                src={selectedImage}
                alt="Cheque"
                style={{
                  width: "100%",
                  maxHeight: "500px",
                  objectFit: "contain",
                  borderRadius: 4,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Download />}
                onClick={() => downloadFile(selectedImage, "cheque_image.png")}
              >
                Download Cheque
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" fullWidth onClick={handleCloseModal}>
                Close
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default PaymentHistory;
