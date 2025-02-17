import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Collapse,
  TableRow,
  TableCell,
} from "@mui/material";
import FailedChequeViewModal from "./FailedChequeViewModal";

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
  const isCheque = transaction.paymentMethod === "CHEQUE";
  const isAccountTransfer = transaction.paymentMethod === "ACCOUNT_TRANSFER";
  const chequeVerificationFailedHistory =
    transaction.chequeVerificationFailedHistory;

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
