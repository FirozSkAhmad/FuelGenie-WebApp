import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TablePagination,
  Box,
  Button,
  Modal,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  AccountBalanceWallet as CreditAmountIcon,
  MonetizationOn as CurrentCreditAmountIcon,
  CalendarToday as CreditPeriodIcon,
  Percent as InterestRateIcon,
  CheckCircle as StatusActiveIcon,
  History as TransactionHistoryIcon,
  Description as DescriptionIcon,
  AttachMoney as AmountIcon,
  Event as DateIcon,
  CompareArrows as CompareIcon,
  TrendingUp as UpgradedIcon,
  TrendingDown as PreviousIcon,
  Add as AddIcon,
  Upgrade as UpgradeIcon,
} from "@mui/icons-material";
import api from "../../../utils/api";
import { useParams } from "react-router-dom";

const CreditInfo = ({ creditInfo }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [extraCreditPage, setExtraCreditPage] = useState(0);
  const [extraCreditRowsPerPage, setExtraCreditRowsPerPage] = useState(5);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [openExtraCreditModal, setOpenExtraCreditModal] = useState(false);
  const [upgradeData, setUpgradeData] = useState({
    upgradedCreditAmount: "",
    upgradedCreditPeriod: "",
    upgradedInterestRate: "",
  });
  const [extraCreditData, setExtraCreditData] = useState({
    creditAmount: "",
    creditPeriod: "",
    interestRate: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { cid } = useParams();

  if (!creditInfo) return null;

  const {
    creditId,
    creditAmount,
    currentCreditAmount,
    creditPeriod,
    interestRate,
    status,
    transactions,
    extraCredits,
  } = creditInfo;

  // Pre-fill upgradeData with current credit details when modal opens
  useEffect(() => {
    if (openUpgradeModal) {
      setUpgradeData({
        upgradedCreditAmount: currentCreditAmount,
        upgradedCreditPeriod: creditPeriod,
        upgradedInterestRate: interestRate,
      });
    }
  }, [openUpgradeModal, currentCreditAmount, creditPeriod, interestRate]);

  // Handle pagination for transaction history
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle pagination for extra credits
  const handleExtraCreditPageChange = (event, newPage) => {
    setExtraCreditPage(newPage);
  };

  const handleExtraCreditRowsPerPageChange = (event) => {
    setExtraCreditRowsPerPage(parseInt(event.target.value, 10));
    setExtraCreditPage(0);
  };

  // Handle modal open/close
  const handleOpenUpgradeModal = () => setOpenUpgradeModal(true);
  const handleCloseUpgradeModal = () => setOpenUpgradeModal(false);

  const handleOpenExtraCreditModal = () => setOpenExtraCreditModal(true);
  const handleCloseExtraCreditModal = () => setOpenExtraCreditModal(false);

  // Handle input changes
  const handleUpgradeChange = (e) => {
    const { name, value } = e.target;
    setUpgradeData({ ...upgradeData, [name]: value });
  };

  const handleExtraCreditChange = (e) => {
    const { name, value } = e.target;
    setExtraCreditData({ ...extraCreditData, [name]: value });
  };

  // Handle API calls
  const handleUpgradeCredit = async () => {
    setLoading(true);
    try {
      const response = await api.put(
        `/admin/business-profiles/upgrade-credit/${cid}`,
        upgradeData
      );
      setSnackbar({
        open: true,
        message: "Credit upgraded successfully!",
        severity: "success",
      });
      handleCloseUpgradeModal();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to upgrade credit. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddExtraCredit = async () => {
    setLoading(true);
    try {
      const response = await api.put(
        `/admin/business-profiles/add-extra-credit/${cid}`,
        extraCreditData
      );
      setSnackbar({
        open: true,
        message: "Extra credit added successfully!",
        severity: "success",
      });
      handleCloseExtraCreditModal();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to add extra credit. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Slice transactions for pagination
  const paginatedTransactions = transactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Slice extra credits for pagination
  const paginatedExtraCredits = extraCredits.slice(
    extraCreditPage * extraCreditRowsPerPage,
    extraCreditPage * extraCreditRowsPerPage + extraCreditRowsPerPage
  );

  return (
    <Paper sx={{ padding: 2, marginTop: 2 }}>
      <Typography variant="h6" gutterBottom>
        Credit Information
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon>
            <CreditAmountIcon />
          </ListItemIcon>
          <ListItemText
            primary="Credit Amount"
            secondary={`₹${creditAmount.toLocaleString("en-IN")}`}
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <CurrentCreditAmountIcon />
          </ListItemIcon>
          <ListItemText
            primary="Current Credit Amount"
            secondary={`₹${currentCreditAmount.toLocaleString("en-IN")}`}
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <CreditPeriodIcon />
          </ListItemIcon>
          <ListItemText
            primary="Credit Period"
            secondary={`${creditPeriod} days`}
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <InterestRateIcon />
          </ListItemIcon>
          <ListItemText
            primary="Interest Rate"
            secondary={`${interestRate}%`}
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <StatusActiveIcon
              color={status === "ACTIVE" ? "success" : "error"}
            />
          </ListItemIcon>
          <ListItemText primary="Status" secondary={status} />
        </ListItem>
      </List>

      <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
        <Button
          variant="contained"
          startIcon={<UpgradeIcon />}
          onClick={handleOpenUpgradeModal}
        >
          Upgrade/Downgrade Credit
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenExtraCreditModal}
          disabled={status === "ACTIVE"}
        >
          Add Extra Credit
        </Button>
      </Box>

      {/* Upgrade/Downgrade Credit Modal */}
      <Modal open={openUpgradeModal} onClose={handleCloseUpgradeModal}>
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
          <Typography variant="h6" gutterBottom>
            Upgrade/Downgrade Credit
          </Typography>
          <TextField
            fullWidth
            label="Upgraded Credit Amount"
            name="upgradedCreditAmount"
            value={upgradeData.upgradedCreditAmount}
            onChange={handleUpgradeChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Upgraded Credit Period (days)"
            name="upgradedCreditPeriod"
            value={upgradeData.upgradedCreditPeriod}
            onChange={handleUpgradeChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Upgraded Interest Rate (%)"
            name="upgradedInterestRate"
            value={upgradeData.upgradedInterestRate}
            onChange={handleUpgradeChange}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleUpgradeCredit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </Box>
      </Modal>

      {/* Add Extra Credit Modal */}
      <Modal open={openExtraCreditModal} onClose={handleCloseExtraCreditModal}>
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
          <Typography variant="h6" gutterBottom>
            Add Extra Credit
          </Typography>
          <TextField
            fullWidth
            label="Credit Amount"
            name="creditAmount"
            value={extraCreditData.creditAmount}
            onChange={handleExtraCreditChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Credit Period (days)"
            name="creditPeriod"
            value={extraCreditData.creditPeriod}
            onChange={handleExtraCreditChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Interest Rate (%)"
            name="interestRate"
            value={extraCreditData.interestRate}
            onChange={handleExtraCreditChange}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleAddExtraCredit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </Box>
      </Modal>

      {/* Transaction History */}
      <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
        Transaction History
      </Typography>

      {transactions.length === 0 ? (
        <Box sx={{ padding: 2, textAlign: "center" }}>
          <Typography variant="body1" color="textSecondary">
            No data available
          </Typography>
        </Box>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <DescriptionIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  Description
                </TableCell>
                <TableCell>
                  <AmountIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  Amount (₹)
                </TableCell>
                <TableCell>
                  <DateIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  Date
                </TableCell>
                <TableCell>
                  <PreviousIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  Previous Credit Amount
                </TableCell>
                <TableCell>
                  <UpgradedIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  Upgraded Credit Amount
                </TableCell>
                <TableCell>
                  <PreviousIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  Previous Interest Rate
                </TableCell>
                <TableCell>
                  <UpgradedIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  Upgraded Interest Rate
                </TableCell>
                <TableCell>
                  <PreviousIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  Previous Credit Period
                </TableCell>
                <TableCell>
                  <UpgradedIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  Upgraded Credit Period
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.transactionId}>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    ₹{transaction.amount.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.date).toLocaleString()}
                  </TableCell>
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

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={transactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      {/* Extra Credit Section */}
      <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
        Extra Credits
      </Typography>

      {extraCredits.length === 0 ? (
        <Box sx={{ padding: 2, textAlign: "center" }}>
          <Typography variant="body1" color="textSecondary">
            No extra credit assigned.
          </Typography>
        </Box>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Credit Amount</TableCell>
                <TableCell>Credit Period</TableCell>
                <TableCell>Interest Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedExtraCredits.map((extraCredit, index) => (
                <TableRow key={index}>
                  <TableCell>
                    ₹{extraCredit.creditAmount.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>{extraCredit.creditPeriod} days</TableCell>
                  <TableCell>{extraCredit.interestRate}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={extraCredits.length}
            rowsPerPage={extraCreditRowsPerPage}
            page={extraCreditPage}
            onPageChange={handleExtraCreditPageChange}
            onRowsPerPageChange={handleExtraCreditRowsPerPageChange}
          />
        </>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CreditInfo;
