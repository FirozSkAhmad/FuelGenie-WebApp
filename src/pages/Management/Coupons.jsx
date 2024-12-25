import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import api from "../../utils/api";
import { usePermissions } from "../../utils/permissionssHelper";
import BreadcrumbNavigation from "../../components/addProduct/utils/BreadcrumbNavigation";
const Coupons = () => {
  const [open, setOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [deletedCoupons, setDeletedCoupons] = useState([]);
  const [expiredCoupons, setExpiredCoupons] = useState([]);
  const [activeTab, setActiveTab] = useState("expired"); // default tab to 'expired'
  const [usageLimitCompletedCoupons, setUsageLimitCompletedCoupons] = useState(
    []
  );
  const [loading, setLoading] = useState({
    active: false,
    deleted: false,
    expired: false,
  });
  const [error, setError] = useState({
    active: null,
    deleted: null,
    expired: null,
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discountPercentage: "",
    usageLimit: "",
    expiresAt: "",
  });
  const permissions = usePermissions();
  useEffect(() => {
    fetchCoupons();
    fetchDeletedCoupons();
    fetchExpiredCoupons("expired"); // Fetch initial expired coupons
  }, []);

  useEffect(() => {
    fetchExpiredCoupons(activeTab); // Refetch data on tab change
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const fetchCoupons = async () => {
    setLoading((prev) => ({ ...prev, active: true }));
    try {
      const response = await api.get("/management/coupons/get-active-coupons");
      setCoupons(response?.data?.data || []);
      setError((prev) => ({ ...prev, active: null }));
    } catch {
      setError((prev) => ({
        ...prev,
        active: "Failed to fetch active coupons.",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, active: false }));
    }
  };

  const fetchDeletedCoupons = async () => {
    setLoading((prev) => ({ ...prev, deleted: true }));
    try {
      const response = await api.get("/management/coupons/deleted-coupons");
      const deletedCouponsData = response?.data?.data;
      setDeletedCoupons(
        Array.isArray(deletedCouponsData) ? deletedCouponsData : []
      );
      setError((prev) => ({ ...prev, deleted: null }));
    } catch (error) {
      setError((prev) => ({
        ...prev,
        deleted: "Failed to fetch deleted coupons.",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, deleted: false }));
    }
  };

  const fetchExpiredCoupons = async (type) => {
    setLoading((prev) => ({ ...prev, [type]: true }));
    try {
      const response = await api.get(
        `/management/coupons/get-coupons?type=${type}`
      );

      if (type === "expired") {
        setExpiredCoupons(response?.data?.data || []);
      } else if (type === "USAGELIMITCOMPLETED") {
        setUsageLimitCompletedCoupons(response?.data?.data || []);
      }

      setError((prev) => ({ ...prev, [type]: null }));
    } catch (error) {
      setError((prev) => ({
        ...prev,
        [type]: "Failed to fetch coupons.",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      await api.post("/management/coupons/create-coupon", formData);
      fetchCoupons();
      handleClose();
    } catch {
      console.error("Error creating coupon");
    }
  };

  const handleDelete = async (code) => {
    try {
      await api.delete(`/management/coupons/delete-coupon/${code}`);
      fetchCoupons();
      fetchDeletedCoupons();
    } catch {
      console.error("Error deleting coupon");
    }
  };

  const renderActiveCouponsTable = () => {
    if (loading.active) return <CircularProgress sx={{ m: 2 }} />;
    if (error.active)
      return <Typography color="error">{error.active}</Typography>;
    if (coupons.length === 0)
      return <Typography>No active coupons available.</Typography>;

    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.map((coupon, index) => (
              <TableRow key={index}>
                <TableCell>{coupon.name}</TableCell>
                <TableCell>{coupon.description}</TableCell>
                <TableCell>{coupon.discountPercentage}%</TableCell>
                <TableCell>{coupon.code}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(coupon.code)}
                    disabled={!permissions.delete}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderDeletedCouponsTable = () => {
    if (loading.deleted) return <CircularProgress sx={{ m: 2 }} />;
    if (error.deleted)
      return <Typography color="error">{error.deleted}</Typography>;
    if (deletedCoupons.length === 0)
      return <Typography>No deleted coupons available.</Typography>;

    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Usage Limit</TableCell>
              <TableCell>Expires At</TableCell>
              <TableCell>Deleted At</TableCell>
              <TableCell>Deleted By</TableCell>
              <TableCell>Role Type</TableCell>
              <TableCell>Code</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deletedCoupons.map((coupon, index) => (
              <TableRow key={index}>
                <TableCell>{coupon.name}</TableCell>
                <TableCell>{coupon.description}</TableCell>
                <TableCell>{coupon.discountPercentage}%</TableCell>
                <TableCell>{coupon.usageLimit}</TableCell>
                <TableCell>
                  {new Date(coupon.expiresAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(coupon.deletedAt).toLocaleString()}
                </TableCell>
                <TableCell>{coupon.deletedBy}</TableCell>
                <TableCell>{coupon.roleType}</TableCell>
                <TableCell>{coupon.code}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderExpiredCouponsTable = () => {
    const coupons =
      activeTab === "expired" ? expiredCoupons : usageLimitCompletedCoupons;
    const loadingState = loading[activeTab];
    const errorState = error[activeTab];

    if (loadingState) return <CircularProgress sx={{ m: 2 }} />;
    if (errorState) return <Typography color="error">{errorState}</Typography>;
    if (coupons.length === 0)
      return (
        <Typography sx={{ marginTop: 2, textAlign: "center" }}>
          No {activeTab} coupons available.
        </Typography>
      );

    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Code</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.map((coupon, index) => (
              <TableRow key={index}>
                <TableCell>{coupon.name}</TableCell>
                <TableCell>{coupon.description}</TableCell>
                <TableCell>{coupon.discountPercentage}%</TableCell>
                <TableCell>{coupon.code}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <BreadcrumbNavigation />
      <Typography variant="h4" gutterBottom>
        Coupon Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ mb: 2 }}
        disabled={!permissions.create}
      >
        Generate Coupon
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: 300, sm: 400 },
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 1,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Generate a New Coupon
          </Typography>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Discount Percentage"
            margin="normal"
            type="number"
            value={formData.discountPercentage}
            onChange={(e) =>
              setFormData({
                ...formData,
                discountPercentage: e.target.value,
              })
            }
          />
          <TextField
            fullWidth
            label="Usage Limit"
            margin="normal"
            type="number"
            value={formData.usageLimit}
            onChange={(e) =>
              setFormData({
                ...formData,
                usageLimit: e.target.value,
              })
            }
          />
          <TextField
            fullWidth
            label="Expires At"
            margin="normal"
            type="datetime-local"
            value={formData.expiresAt}
            onChange={(e) =>
              setFormData({ ...formData, expiresAt: e.target.value })
            }
          />
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
            >
              Create Coupon
            </Button>
          </Box>
        </Box>
      </Modal>

      <Typography variant="h6" sx={{ mt: 4 }}>
        Active Coupons
      </Typography>
      {renderActiveCouponsTable()}

      <Typography variant="h6" sx={{ mt: 4 }}>
        Deleted Coupons
      </Typography>
      {renderDeletedCouponsTable()}

      <Typography variant="h6" sx={{ mt: 4 }}>
        Expired Coupons
      </Typography>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="coupon type tabs"
      >
        <Tab label="Expired Coupons" value="expired" />
        <Tab
          label="Usage Limit Completed Coupons"
          value="USAGELIMITCOMPLETED"
        />
      </Tabs>
      {renderExpiredCouponsTable()}
    </Box>
  );
};

export default Coupons;
