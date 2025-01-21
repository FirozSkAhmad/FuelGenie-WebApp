import React from "react";
import { Typography, Paper } from "@mui/material";

const CreditInfo = ({ creditInfo }) => {
  if (!creditInfo) return null;

  return (
    <Paper sx={{ padding: 2, marginTop: 2 }}>
      <Typography variant="h6">Credit Information</Typography>
      <Typography>Credit Amount: {creditInfo.creditAmount}</Typography>
      <Typography>
        Current Credit Amount: {creditInfo.currentCreditAmount}
      </Typography>
      <Typography>Credit Period: {creditInfo.creditPeriod} months</Typography>
      <Typography>Interest Rate: {creditInfo.interestRate}%</Typography>
      <Typography>Status: {creditInfo.status}</Typography>
    </Paper>
  );
};

export default CreditInfo;
