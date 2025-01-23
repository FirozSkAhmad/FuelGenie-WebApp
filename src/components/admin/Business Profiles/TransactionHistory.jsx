import React from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  AccountBalanceWallet as WalletIcon,
  Payment as PaymentIcon,
  PendingActions as PendingIcon,
  CheckCircle as SuccessIcon,
  Cancel as FailedIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";

const TransactionHistory = ({ transactionHistory }) => {
  if (!transactionHistory.length) return null;
  const navigate = useNavigate();
  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <PendingIcon color="warning" />;
      case "SUCCESS":
        return <SuccessIcon color="success" />;
      case "FAILED":
        return <FailedIcon color="error" />;
      default:
        return null;
    }
  };
  const handleOrderDetailpageRedirect = (orderId) => () => {
    navigate(`/operations/orders/${orderId}`);
  };
  return (
    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
      <Typography variant="h6" sx={{ padding: 2 }}>
        Transaction History
      </Typography>
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
                Type
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
          </TableRow>
        </TableHead>
        <TableBody>
          {transactionHistory.map((transaction) => (
            <TableRow
              key={transaction.transactionId}
              onClick={handleOrderDetailpageRedirect(transaction.orderId)}
              sx={{ cursor: "pointer" }}
            >
              <TableCell>{transaction.transactionId}</TableCell>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>
                ₹{transaction.amount.toLocaleString("en-IN")}
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
              <TableCell>
                {new Date(transaction.date).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionHistory;
