import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import api from "../../../../utils/api";
import { useParams } from "react-router-dom";
const UpgradeCreditModal = ({
  open,
  onClose,
  creditInfo,
  fetchCredit,
  setSnackbar,
}) => {
  const [loading, setLoading] = useState(false);
  const [upgradeData, setUpgradeData] = useState({
    upgradedCreditAmount: "",
    upgradedCreditPeriod: "",
    upgradedInterestRate: "",
  });
  const { cid } = useParams();
  useEffect(() => {
    if (open) {
      setUpgradeData({
        upgradedCreditAmount: creditInfo.creditAmount,
        upgradedCreditPeriod: creditInfo.creditPeriod,
        upgradedInterestRate: creditInfo.interestRate,
      });
    }
  }, [open, creditInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpgradeData({ ...upgradeData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.put(
        `/admin/business-profiles/upgrade-credit/${cid}`,
        upgradeData
      );
      setSnackbar({
        open: true,
        message: "Credit upgraded successfully!",
        severity: "success",
      });
      fetchCredit();
      onClose();
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

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Upgrade/Downgrade Credit
        </Typography>
        <TextField
          label="Upgraded Credit Amount"
          name="upgradedCreditAmount"
          value={upgradeData.upgradedCreditAmount}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Upgraded Credit Period"
          name="upgradedCreditPeriod"
          value={upgradeData.upgradedCreditPeriod}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Upgraded Interest Rate"
          name="upgradedInterestRate"
          value={upgradeData.upgradedInterestRate}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Submit"}
        </Button>
      </Box>
    </Modal>
  );
};

export default UpgradeCreditModal;
