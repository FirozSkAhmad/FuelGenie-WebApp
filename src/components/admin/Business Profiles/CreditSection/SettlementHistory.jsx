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
  Paper,
  Chip,
  Link,
  Collapse,
  IconButton,
  Modal,
  Backdrop,
  Fade,
  Button,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import api from "../../../../utils/api";

const SettlementHistory = ({ settlementHistory, isSmallScreen }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openRow, setOpenRow] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [chequeDetails, setChequeDetails] = useState(null);
  const [rejectionReason, setRejectionReason] = useState(
    chequeDetails?.chequeVerificationFailureReason || ""
  );
  const [selectedChequeStatus, setSelectedChequeStatus] = useState(
    chequeDetails?.chequeStatus || "FAILED"
  );
  const [chequeVerificationStatus, setChequeVerificationStatus] =
    useState(null);
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleRow = (index) => {
    setOpenRow(openRow === index ? null : index);
  };

  const openChequeModal = (details) => {
    setChequeDetails(details);
    setModalOpen(true);
  };

  const closeChequeModal = () => {
    setModalOpen(false);
    setChequeDetails(null);
    setChequeVerificationStatus(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCESS":
      case "PAID":
        return "success";
      case "FAILED":
        return "error";
      case "PENDING":
        return "warning";
      default:
        return "info";
    }
  };

  const handleChequeVerification = async (settlementId, cid) => {
    try {
      // Prepare the data for the API call
      const verificationData = {
        cid,
        settlementId,
        verificationStatus: selectedChequeStatus, // You can modify this as per your logic
        reason: rejectionReason,
      };

      // Make the API call to verify the cheque
      const response = await api.put(
        "/admin/business-profiles/verify-settlement-cheque",
        verificationData
      );

      if (response.data.status === "SUCCESS") {
        setChequeVerificationStatus("Cheque verified successfully.");
      } else {
        setChequeVerificationStatus(
          error.response.data.message || "Cheque verification failed."
        );
      }
    } catch (error) {
      // Handle 409 Conflict or other error codes
      if (error.response && error.response.status === 409) {
        // If the status code is 409, capture the error message from the response
        setChequeVerificationStatus(
          error.response.data.message ||
            "Settlement already processed or invalid status"
        );
      } else {
        // Handle any other errors (like network errors)
        setChequeVerificationStatus(
          error.response.data.message ||
            "An error occurred during verification. Please try again."
        );
      }
    }
  };
  return (
    <Box sx={{ marginTop: 4, paddingX: isSmallScreen ? 1 : 4 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Settlement History
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Settlement ID</TableCell>
              <TableCell>Settled (₹)</TableCell>
              <TableCell>Outstanding (₹)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {settlementHistory
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((settlement, index) => (
                <React.Fragment key={settlement._id}>
                  <TableRow>
                    <TableCell>{settlement.settlementId}</TableCell>
                    <TableCell>₹{settlement.settledAmount}</TableCell>
                    <TableCell>₹{settlement.outstandingAmount}</TableCell>
                    <TableCell>
                      <Chip
                        label={settlement.status}
                        color={getStatusColor(settlement.status)}
                      />
                    </TableCell>
                    <TableCell>
                      {settlement.settlementDate?.split("T")[0]}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => toggleRow(index)}
                        aria-label="expand row"
                      >
                        {openRow === index ? (
                          <KeyboardArrowUp />
                        ) : (
                          <KeyboardArrowDown />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6} style={{ padding: 0 }}>
                      <Collapse
                        in={openRow === index}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ margin: 3 }}>
                          <Typography
                            variant="h6"
                            gutterBottom
                            sx={{ fontWeight: 600 }}
                          >
                            Details
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          <Box
                            sx={{
                              display: "flex",
                              gap: 4,
                              flexWrap: "wrap",
                            }}
                          >
                            {/* Left Column */}
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="subtitle2"
                                fontWeight={500}
                                sx={{ mb: 1 }}
                              >
                                General Information
                              </Typography>
                              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                                <Box>
                                  <Typography variant="body2" fontWeight={500}>
                                    Payment Method
                                  </Typography>
                                  <Typography variant="body2">
                                    {settlement.paymentMethod}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography variant="body2" fontWeight={500}>
                                    Status
                                  </Typography>
                                  <Typography variant="body2">
                                    {settlement.status}
                                  </Typography>
                                </Box>
                              </Box>
                              {settlement.paymentMethod === "CHEQUE" && (
                                <Box sx={{ mb: 2 }}>
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight={500}
                                    sx={{ mb: 1 }}
                                  >
                                    Cheque Information
                                  </Typography>
                                  <Typography variant="body2">
                                    Cheque Status:{" "}
                                    {settlement.chequeVerificationStatus}
                                  </Typography>
                                  {settlement?.chequeVerificationFailureReason && (
                                    <Typography variant="body2">
                                      Failure Reason:{" "}
                                      {
                                        settlement?.chequeVerificationFailureReason
                                      }
                                    </Typography>
                                  )}
                                </Box>
                              )}
                            </Box>

                            {/* Right Column */}
                            <Box sx={{ flex: 1 }}>
                              {settlement.paymentMethod ===
                                "ACCOUNT_TRANSFER" && (
                                <Box sx={{ mb: 2 }}>
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight={500}
                                    sx={{ mb: 1 }}
                                  >
                                    Transfer Information
                                  </Typography>
                                  <Typography variant="body2">
                                    UTR: {settlement.paymentDetails?.UTR}
                                  </Typography>
                                  <Typography variant="body2">
                                    Reference ID:{" "}
                                    {settlement.paymentDetails?.ReferenceID}
                                  </Typography>
                                  <Typography variant="body2">
                                    To Account:{" "}
                                    {settlement.paymentDetails?.ToAccount}
                                  </Typography>
                                  <Typography variant="body2">
                                    From Account:{" "}
                                    {settlement.paymentDetails?.FromAccount}
                                  </Typography>
                                  <Typography variant="body2">
                                    Amount: ₹{settlement.paymentDetails?.Amount}
                                  </Typography>
                                  <Typography variant="body2">
                                    Payment Date:{" "}
                                    {settlement.paymentDetails?.PaymentDate}
                                  </Typography>
                                  <Typography variant="body2">
                                    Remarks:{" "}
                                    {settlement.paymentDetails?.Remarks}
                                  </Typography>
                                  <Typography variant="body2">
                                    Network:{" "}
                                    {settlement.paymentDetails?.Network}
                                  </Typography>
                                  <Typography variant="body2">
                                    Manual Release Required:{" "}
                                    {
                                      settlement.paymentDetails
                                        ?.ManualReleaseRequired
                                    }
                                  </Typography>
                                  <Typography variant="body2">
                                    Transaction Status:{" "}
                                    {
                                      settlement.paymentDetails
                                        ?.TransactionStatus
                                    }
                                  </Typography>
                                </Box>
                              )}
                              {settlement.paymentDetails?.chequeImageUrl && (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  sx={{
                                    mt: 2,
                                    textTransform: "none",
                                    borderRadius: 2,
                                  }}
                                  onClick={() =>
                                    openChequeModal({
                                      chequeNumber:
                                        settlement.paymentDetails.chequeNumber,
                                      bankName:
                                        settlement.paymentDetails.bankName,
                                      chequeIssuedDate:
                                        settlement.paymentDetails
                                          .chequeIssuedDate,
                                      chequeReceivedDate:
                                        settlement.paymentDetails
                                          .chequeReceivedDate,
                                      chequeAmount:
                                        settlement.paymentDetails.chequeAmount,
                                      chequeImageUrl:
                                        settlement.paymentDetails
                                          .chequeImageUrl,
                                      chequeStatus:
                                        settlement.chequeVerificationStatus,
                                      chequeVerificationFailureReason:
                                        settlement.chequeVerificationFailureReason,
                                      settlementId: settlement.settlementId,
                                      cid: settlement.cid,
                                    })
                                  }
                                  disabled={
                                    !settlement.paymentDetails.chequeImageUrl
                                  }
                                >
                                  View Cheque Details
                                </Button>
                              )}
                              {settlement.paymentDetails
                                ?.transferReceiptUrl && (
                                <Link
                                  href={
                                    settlement.paymentDetails.transferReceiptUrl
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{
                                    mt: 2,
                                    display: "inline-block",
                                    textDecoration: "none",
                                  }}
                                >
                                  <Button
                                    variant="outlined"
                                    color="secondary"
                                    sx={{
                                      textTransform: "none",
                                      borderRadius: 2,
                                    }}
                                  >
                                    View Transfer Receipt
                                  </Button>
                                </Link>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={settlementHistory?.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{ marginTop: 2 }}
      />
      {/* Cheque Modal */}
      <Modal
        open={modalOpen}
        onClose={closeChequeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={modalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              width: isSmallScreen ? "90%" : "auto",
              maxWidth: 600,
              minHeight: 400,
            }}
          >
            <Typography variant="h6" gutterBottom align="center">
              Settlement Cheque Details
            </Typography>
            {/* Cheque Image */}
            {chequeDetails?.chequeImageUrl && (
              <Box sx={{ mb: 3, textAlign: "center" }}>
                <img
                  src={chequeDetails.chequeImageUrl}
                  alt="Cheque"
                  style={{
                    width: "80%",
                    maxWidth: 500,
                    borderRadius: 8,
                    marginBottom: 16,
                    border: "1px solid #ddd",
                  }}
                />
              </Box>
            )}

            {chequeDetails && (
              <>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={500}>
                    Cheque Number
                  </Typography>
                  <Typography variant="body2">
                    {chequeDetails.chequeNumber}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={500}>
                    Bank Name
                  </Typography>
                  <Typography variant="body2">
                    {chequeDetails.bankName}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={500}>
                    Issued Date
                  </Typography>
                  <Typography variant="body2">
                    {chequeDetails.chequeIssuedDate}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={500}>
                    Received Date
                  </Typography>
                  <Typography variant="body2">
                    {chequeDetails.chequeReceivedDate}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={500}>
                    Amount
                  </Typography>
                  <Typography variant="body2">
                    ₹{chequeDetails.chequeAmount}
                  </Typography>
                </Box>

                {/* Status with Color */}
                <Box sx={{ mb: 2 }}>
                  <Typography>
                    <strong>Status:</strong>{" "}
                    <Chip
                      label={chequeDetails?.chequeStatus || "PENDING"}
                      color={getStatusColor(chequeDetails?.chequeStatus)}
                      size="small"
                    />
                  </Typography>
                  {chequeDetails?.chequeStatus === "FAILED" && (
                    <Typography color="error">
                      <strong>Failure Reason:</strong>{" "}
                      {chequeDetails?.chequeVerificationFailureReason ||
                        "No failure reason available."}
                    </Typography>
                  )}
                </Box>

                {/* Selection for Verifying Cheque Status */}
                {/* Selection for Verifying Cheque Status */}
                {chequeDetails.chequeStatus === null && (
                  <Box sx={{ mb: 3 }}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">
                        Verify Cheque Status
                      </FormLabel>
                      <RadioGroup
                        value={selectedChequeStatus}
                        onChange={(e) =>
                          setSelectedChequeStatus(e.target.value)
                        }
                        row
                      >
                        <FormControlLabel
                          value="SUCCESS"
                          control={<Radio />}
                          label="SUCCESS"
                          disabled={
                            chequeDetails?.chequeStatus === "SUCCESS" ||
                            chequeDetails?.chequeStatus === "FAILED"
                          }
                        />
                        <FormControlLabel
                          value="FAILED"
                          control={<Radio />}
                          label="FAILED"
                          disabled={
                            chequeDetails?.chequeStatus === "SUCCESS" ||
                            chequeDetails?.chequeStatus === "FAILED"
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                )}

                {/* Reason for Failure */}
                {chequeDetails?.chequeStatus === "FAILED" &&
                  !chequeDetails?.chequeVerificationFailureReason && (
                    <Box sx={{ mb: 3 }}>
                      <TextField
                        label="Failure Reason"
                        multiline
                        rows={4}
                        fullWidth
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                    </Box>
                  )}
              </>
            )}

            {/* Buttons */}
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Button
                onClick={closeChequeModal}
                variant="outlined"
                color="secondary"
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  width: "48%",
                }}
              >
                Close
              </Button>

              {chequeDetails?.chequeImageUrl && (
                <Button
                  variant="contained"
                  color="primary"
                  component="a"
                  href={chequeDetails.chequeImageUrl}
                  download
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    width: "48%",
                  }}
                >
                  Download
                </Button>
              )}

              <Button
                onClick={() =>
                  handleChequeVerification(
                    chequeDetails.settlementId,
                    chequeDetails.cid,
                    chequeDetails.chequeNumber
                  )
                }
                variant="contained"
                color="success"
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  width: "48%",
                }}
                disabled={chequeDetails?.chequeStatus !== null}
              >
                {chequeDetails?.chequeStatus === "SUCCESS"
                  ? "Verified"
                  : "Verify Cheque..."}
              </Button>
            </Box>

            {/* Feedback Message */}
            {chequeVerificationStatus && (
              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  color:
                    chequeVerificationStatus.includes("successfully") ||
                    chequeVerificationStatus.includes("verified")
                      ? "green"
                      : "red",
                }}
              >
                {chequeVerificationStatus}
              </Typography>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default SettlementHistory;
