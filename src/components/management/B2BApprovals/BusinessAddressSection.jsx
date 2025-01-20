import React from "react";
import {
  Typography,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { Home } from "@mui/icons-material";

const BusinessAddressSection = ({ customer }) => {
  return (
    <Paper style={{ padding: "20px", marginBottom: "20px" }}>
      <Typography variant="h6" gutterBottom>
        <Home
          fontSize="small"
          style={{ marginRight: "10px", verticalAlign: "middle" }}
        />
        Business Address
      </Typography>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Address Line</strong>
              </TableCell>
              <TableCell>{customer.businessAddress.addressLine}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>City</strong>
              </TableCell>
              <TableCell>{customer.businessAddress.city}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>State</strong>
              </TableCell>
              <TableCell>{customer.businessAddress.state}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Pincode</strong>
              </TableCell>
              <TableCell>{customer.businessAddress.pincode}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Country</strong>
              </TableCell>
              <TableCell>{customer.businessAddress.country}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default BusinessAddressSection;
