import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Breadcrumbs,
  Link,
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Search as SearchIcon,
  CloudDownload as CloudDownloadIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const OnboardingApprovals = () => {
  // State for tabs, pagination, and search
  const [currentTab, setCurrentTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data
  const approvalData = [
    {
      customerId: "11223345",
      businessType: "Industrial",
      firmType: "Proprietorship",
      bon: "ABC",
      contactNo: "9999999999",
      emailId: "test@gmail.com",
      panNumber: "ABCDE1234F",
      gstNumber: "H4SDFG456543HD",
      salesPerson: "Vinay Kumar",
    },
    {
      customerId: "11223346",
      businessType: "Residential",
      firmType: "Partnership",
      bon: "Abcds",
      contactNo: "9999999999",
      emailId: "test@gmail.com",
      panNumber: "ACFHD7788F",
      gstNumber: "348DFGTG64301GL",
      salesPerson: "Vinay Kumar",
    },
    // Add more sample data here
  ];

  const navigate = useNavigate(); // useNavigate hook

  // Handlers
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleRowClick = (customerId) => {
    // Navigate to the detailed page
    navigate(`/sales/onboarding-approval/${customerId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 3 }}
      >
        <Link color="inherit" href="/" underline="hover">
          Home
        </Link>
        <Typography color="primary">Onboarding/Approvals</Typography>
      </Breadcrumbs>

      {/* Search and Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          gap: 2,
        }}
      >
        <TextField
          placeholder="Search for"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 200 }}
        />
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" startIcon={<CloudDownloadIcon />}>
            Download
          </Button>
          <Button variant="outlined" endIcon={<KeyboardArrowDownIcon />}>
            Newest first
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: "100%", mb: 2 }}>
        {/* Tabs */}
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tab label="Pending" />
          <Tab label="Accepted" />
          <Tab label="Rejected" />
        </Tabs>

        {/* Table */}
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "common.white",
                  }}
                >
                  Customer ID
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "common.white",
                  }}
                >
                  Business Type
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "common.white",
                  }}
                >
                  Firm Type
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "common.white",
                  }}
                >
                  B.O.N
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "common.white",
                  }}
                >
                  Contact No
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "common.white",
                  }}
                >
                  Email ID
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "common.white",
                  }}
                >
                  Pan Number
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "common.white",
                  }}
                >
                  GST Number
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "common.white",
                  }}
                >
                  Sales Person
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {approvalData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow
                    key={index}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    onClick={() => handleRowClick(row.customerId)} // Click event
                    style={{ cursor: "pointer" }} // Add pointer cursor
                  >
                    <TableCell>{row.customerId}</TableCell>
                    <TableCell>{row.businessType}</TableCell>
                    <TableCell>{row.firmType}</TableCell>
                    <TableCell>{row.bon}</TableCell>
                    <TableCell>{row.contactNo}</TableCell>
                    <TableCell>{row.emailId}</TableCell>
                    <TableCell>{row.panNumber}</TableCell>
                    <TableCell>{row.gstNumber}</TableCell>
                    <TableCell>{row.salesPerson}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={approvalData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default OnboardingApprovals;
