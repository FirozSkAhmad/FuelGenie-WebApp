import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import api from "../../../utils/api";
import { useParams } from "react-router-dom";
import { usePermissions } from "../../../utils/permissionssHelper";
import UpgradeCreditModal from "./CreditSection/UpgradeCreditModal";
import TransactionHistory from "./CreditSection/TransactionHistory";
import PaymentHistory from "./CreditSection/PaymentHistory";
import SettlementHistory from "./CreditSection/SettlementHistory";
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
import PartialPaymentHistory from "./CreditSection/PartialPaymentHistory";
import CreditPaymentModals from "./CreditSection/CreditPaymentModals";
const CreditInfo = ({ creditInfo, fetchCredit }) => {
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [settlementHistory, setSettlementHistory] = useState([]);
  const [partialPaymentHistory, setPartialPaymentHistory] = useState([]);
  const { cid } = useParams();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const permissions = usePermissions();

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await api.get(
          `/admin/business-profiles/get-full-payment-histories/${cid}`
        );
        setPaymentHistory(response.data);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to fetch payment history",
          severity: "error",
        });
      }
    };

    const fetchSettlementHistory = async () => {
      try {
        const response = await api.get(
          `/admin/business-profiles/get-settlement-history/${cid}`
        );
        setSettlementHistory(response.data.data);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to fetch settlement history",
          severity: "error",
        });
      }
    };
    const fetchPartialPaymentHistory = async () => {
      try {
        const response = await api.get(
          `/admin/business-profiles/get-partical-payment-history/${cid}`
        );
        setPartialPaymentHistory(response.data.data);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to fetch partial payment history",
          severity: "error",
        });
      }
    };
    fetchPartialPaymentHistory();
    fetchPaymentHistory();
    fetchSettlementHistory();
  }, [cid]);

  if (!creditInfo) return null;

  const handleOpenUpgradeModal = () => setOpenUpgradeModal(true);
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handlePaymentModal = (type) => {
    setPaymentType(type);
    setOpenPaymentModal(true);
  };
  return (
    <>
      {/* Credit Information Section */}
      <Typography variant="h6" gutterBottom>
        Credit Information
      </Typography>
      {/* Upgrade/Downgrade Credit Button */}{" "}
      <List>
        <ListItem>
          <ListItemIcon>
            <CreditAmountIcon />
          </ListItemIcon>
          <ListItemText
            primary="Credit Amount"
            secondary={`₹${creditInfo?.creditAmount.toLocaleString("en-IN")}`}
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <CurrentCreditAmountIcon />
          </ListItemIcon>
          <ListItemText
            primary="Current Credit Amount"
            secondary={`₹${creditInfo?.currentCreditAmount.toLocaleString(
              "en-IN"
            )}`}
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <CreditPeriodIcon />
          </ListItemIcon>
          <ListItemText
            primary="Credit Period"
            secondary={`${creditInfo?.creditPeriod} days`}
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <InterestRateIcon />
          </ListItemIcon>
          <ListItemText
            primary="Interest Rate"
            secondary={`${creditInfo?.interestRate}%`}
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <StatusActiveIcon
              color={creditInfo?.status === "ACTIVE" ? "success" : "error"}
            />
          </ListItemIcon>
          <ListItemText primary="Status" secondary={creditInfo?.status} />
        </ListItem>
      </List>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        <Button
          variant="contained"
          onClick={handleOpenUpgradeModal}
          sx={{ minWidth: 180 }}
          disabled={!permissions.update}
        >
          Upgrade/Downgrade Credit
        </Button>
        <Button
          variant="contained"
          sx={{ minWidth: 180 }}
          disabled={!permissions.update}
          onClick={() => handlePaymentModal("Settle Credit")}
        >
          Settle Credit
        </Button>
        <Button
          variant="contained"
          sx={{ minWidth: 180 }}
          disabled={!permissions.update}
          onClick={() => handlePaymentModal("Partial Payment")}
        >
          Partial Payments
        </Button>
        <Button
          variant="contained"
          color="success"
          sx={{ minWidth: 180 }}
          disabled={!permissions.update}
          onClick={() => handlePaymentModal("Pay Total Amount")}
        >
          Pay Total Amount
        </Button>
      </Box>
      {/* Upgrade Credit Modal */}
      <UpgradeCreditModal
        open={openUpgradeModal}
        onClose={() => setOpenUpgradeModal(false)}
        creditInfo={creditInfo}
        fetchCredit={fetchCredit}
        setSnackbar={setSnackbar}
      />
      {/* Payment Modal for all the modes in one  */}
      <CreditPaymentModals
        open={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
        creditInfo={creditInfo}
        type={paymentType}
        fetchCredit={fetchCredit}
        setSnackbar={setSnackbar}
        cid={cid}
      />
      {/* Transaction History Section */}
      <TransactionHistory
        transactions={creditInfo.transactions || []}
        isSmallScreen={isSmallScreen}
      />
      {/* Partial  Payment History Section */}
      <PartialPaymentHistory partialPaymentHistory={partialPaymentHistory} />
      {/* Payment History Section */}
      <PaymentHistory
        paymentHistory={paymentHistory}
        isSmallScreen={isSmallScreen}
      />
      {/* Settlement History Section */}
      <SettlementHistory
        settlementHistory={settlementHistory}
        isSmallScreen={isSmallScreen}
      />
      {/* Snackbar for Notifications */}
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
    </>
  );
};

export default CreditInfo;
