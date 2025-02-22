import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Collapse,
  TableRow,
  TableCell,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PaidIcon from "@mui/icons-material/Paid";
import PaymentIcon from "@mui/icons-material/Payment";
import FailedChequeViewModal from "./FailedChequeViewModal";
import { usePermissions } from "../../../../utils/permissionssHelper";

const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return isNaN(date)
    ? isoString
    : `${date.toLocaleDateString("en-IN", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })} ${date.toLocaleTimeString("en-IN")}`;
};

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return isNaN(date) ? isoString : date.toLocaleDateString("en-IN");
};

const PaymentDetailsCollapse = ({
  transaction,
  isExpanded,
  onChequeImageClick,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const hasPaymentDetails = transaction.paymentDetails !== null;
  const PaymentDetails = transaction.paymentDetails;
  const isCheque = transaction.paymentMethod === "CHEQUE";
  const isAccountTransfer = transaction.paymentMethod === "ACCOUNT_TRANSFER";
  const chequeVerificationFailedHistory =
    transaction.chequeVerificationFailedHistory;
  const isStatus = transaction.status;
  const isPartiallyPaid = isStatus === "PARTIALLY_PAID";
  const paymentHistory = transaction.paymentHistory || [];
  const permissions = usePermissions();
  const handleChequeImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImageUrl("");
  };

  return (
    <>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Payment Details
              </Typography>

              {hasPaymentDetails ? (
                <Box>
                  {isCheque && (
                    <>
                      <Typography>
                        Cheque Number: {transaction.paymentDetails.chequeNumber}
                      </Typography>
                      <Typography>
                        Bank Name: {transaction.paymentDetails.bankName}
                      </Typography>
                      <Typography>
                        Cheque Issued Date:{" "}
                        {formatDate(
                          transaction.paymentDetails.chequeIssuedDate
                        )}
                      </Typography>
                      <Typography>
                        Cheque Received Date:{" "}
                        {formatDate(
                          transaction.paymentDetails.chequeReceivedDate
                        )}
                      </Typography>
                      <Typography>
                        Cheque Amount: ₹
                        {transaction.paymentDetails.chequeAmount?.toLocaleString(
                          "en-IN"
                        )}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          onChequeImageClick(transaction);
                        }}
                      >
                        View Cheque
                      </Button>
                    </>
                  )}

                  {isAccountTransfer && (
                    <>
                      <Typography>
                        UTR: {transaction.paymentDetails.UTR}
                      </Typography>
                      <Typography>
                        Reference ID: {transaction.paymentDetails.ReferenceID}
                      </Typography>
                      <Typography>
                        From Account: {transaction.paymentDetails.FromAccount}
                      </Typography>
                      <Typography>
                        Payment Date:{" "}
                        {formatDate(transaction.paymentDetails.PaymentDate)}
                      </Typography>
                      <Typography>
                        Network: {transaction.paymentDetails.Network}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          onChequeImageClick(transaction);
                        }}
                      >
                        View Transfer Receipt
                      </Button>
                    </>
                  )}
                </Box>
              ) : (
                chequeVerificationFailedHistory?.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Cheque Verification Failed History
                    </Typography>
                    {chequeVerificationFailedHistory.map((history) => (
                      <Box
                        key={history._id}
                        sx={{
                          mb: 2,
                          p: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="subtitle2" color="error">
                          {history.status}
                        </Typography>
                        <Typography>
                          <strong>Reason:</strong> {history.reason}
                        </Typography>
                        <Typography>
                          <strong>Date:</strong> {formatDateTime(history.date)}
                        </Typography>

                        <Box
                          sx={{
                            mt: 1,
                            pl: 1,
                            borderLeft: 3,
                            borderColor: "divider",
                          }}
                        >
                          <Typography variant="subtitle2">
                            Cheque Details:
                          </Typography>
                          <Typography>
                            <strong>Number:</strong>{" "}
                            {history.details.chequeNumber}
                          </Typography>
                          <Typography>
                            <strong>Bank:</strong> {history.details.bankName}
                          </Typography>
                          <Typography>
                            <strong>Issued:</strong>{" "}
                            {formatDate(history.details.chequeIssuedDate)}
                          </Typography>
                          <Typography>
                            <strong>Received:</strong>{" "}
                            {formatDate(history.details.chequeReceivedDate)}
                          </Typography>
                          <Typography>
                            <strong>Amount:</strong> ₹
                            {history.details.chequeAmount?.toLocaleString(
                              "en-IN"
                            )}
                          </Typography>
                        </Box>

                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          onClick={() =>
                            handleChequeImageClick(
                              history.details.chequeImageUrl
                            )
                          }
                          sx={{ mt: 1 }}
                        >
                          View Failed Cheque Image
                        </Button>
                      </Box>
                    ))}
                  </Box>
                )
              )}
              {(isPartiallyPaid && paymentHistory.length > 0) ||
              PaymentDetails === null ? (
                <Box sx={{ mt: 4, mb: 4 }}>
                  {/* Header Section */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                      p: 2,
                      backgroundColor: "background.paper",
                      borderRadius: 1,
                      boxShadow: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{ fontWeight: 600 }}
                    >
                      Payment History
                    </Typography>
                    {paymentHistory.length > 0 && (
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Total Payments: {paymentHistory.length}
                      </Typography>
                    )}
                  </Box>

                  {/* Content Area */}
                  {paymentHistory.length === 0 ? (
                    <Box
                      sx={{
                        p: 3,
                        textAlign: "center",
                        backgroundColor: "action.hover",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        No payment history available
                      </Typography>
                    </Box>
                  ) : (
                    paymentHistory.map((payment, index) => (
                      <Box
                        key={index}
                        sx={{
                          mb: 2,
                          p: 3,
                          borderLeft: "4px solid",
                          borderColor: "primary.main",
                          backgroundColor: "background.paper",
                          borderRadius: 1,
                          boxShadow: 1,
                          transition: "transform 0.2s",
                          "&:hover": {
                            transform: "translateX(4px)",
                          },
                        }}
                      >
                        {/* Main Content Grid */}
                        <Grid container spacing={2} alignItems="center">
                          {/* Date */}
                          <Grid item xs={12} md={4}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                              }}
                            >
                              <EventNoteIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                {formatDateTime(payment.date)}
                              </Typography>
                            </Box>
                          </Grid>

                          {/* Amount Paid */}
                          <Grid item xs={6} md={2}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                              }}
                            >
                              <PaidIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                ₹{payment.amountPaid?.toLocaleString("en-IN")}
                              </Typography>
                            </Box>
                          </Grid>

                          {/* Payment Method */}
                          <Grid item xs={6} md={3}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                              }}
                            >
                              <PaymentIcon fontSize="small" color="action" />
                              <Typography variant="body2" noWrap>
                                {payment.paymentMethod}
                              </Typography>
                            </Box>
                          </Grid>

                          {/* Verification Status */}
                          <Grid item xs={12} md={3}>
                            <Chip
                              label={payment.verificationStatus.toLowerCase()}
                              size="small"
                              color={
                                payment.verificationStatus === "VERIFIED"
                                  ? "success"
                                  : payment.verificationStatus === "PENDING"
                                  ? "warning"
                                  : "error"
                              }
                              sx={{
                                fontWeight: 500,
                                textTransform: "capitalize",
                                width: "fit-content",
                                "& .MuiChip-label": {
                                  px: 1.2,
                                  fontSize: "0.8rem",
                                },
                              }}
                            />
                          </Grid>
                        </Grid>

                        {/* Divider and Footer */}
                        <Divider sx={{ my: 2 }} />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                          >
                            Transaction ID: #{payment._id || index + 1}
                          </Typography>
                          <Typography variant="body2">
                            Remaining: ₹
                            {payment.remainingAmount?.toLocaleString("en-IN")}
                          </Typography>
                        </Box>
                      </Box>
                    ))
                  )}
                </Box>
              ) : null}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <FailedChequeViewModal
        open={modalOpen}
        onClose={handleCloseModal}
        imageUrl={selectedImageUrl}
      />
    </>
  );
};

export default PaymentDetailsCollapse;
