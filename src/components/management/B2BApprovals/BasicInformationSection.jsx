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
import { Person } from "@mui/icons-material";

const BasicInformationSection = ({ customer }) => {
  return (
    <Paper style={{ padding: "20px", marginBottom: "20px" }}>
      <Typography variant="h6" gutterBottom>
        <Person
          fontSize="small"
          style={{ marginRight: "10px", verticalAlign: "middle" }}
        />
        Basic Information
      </Typography>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Full Name</strong>
              </TableCell>
              <TableCell>{customer.fullName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>{customer.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Phone Number</strong>
              </TableCell>
              <TableCell>{customer.phoneNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Firm Type</strong>
              </TableCell>
              <TableCell>{customer.firmType}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Business Name</strong>
              </TableCell>
              <TableCell>{customer.businessName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Business Contact Number</strong>
              </TableCell>
              <TableCell>{customer.businessContactNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Business Email</strong>
              </TableCell>
              <TableCell>{customer.businessEmail}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default BasicInformationSection;
