import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Grid,
  Avatar,
  Chip,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import { CloudUpload, Delete, CheckCircle, Error } from "@mui/icons-material";
import { visuallyHidden } from "@mui/utils";

const ModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
}));

const VisuallyHiddenInput = styled("input")(visuallyHidden);

const StatusUpdateModal = ({
  order,
  open,
  handleClose,
  handleUpdateStatus,
  fetchOrder,
}) => {
  const [status, setStatus] = useState("");
  const [otp, setOtp] = useState("");
  const [receiptImages, setReceiptImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (order) {
      setStatus(order.orderStatus || "");
      setOtp("");
      setReceiptImages([]);
      setError("");
    }
  }, [order]);

  const handleCloseModal = () => {
    setStatus("");
    setOtp("");
    setReceiptImages([]);
    setError("");
    handleClose();
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setReceiptImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setReceiptImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      if (status === "DELIVERED") {
        if (!otp || otp.length < 4) {
          throw new Error("Valid OTP is required for delivery");
        }
        if (receiptImages.length === 0) {
          throw new Error("At least one receipt image is required");
        }
      }

      const formData = new FormData();
      formData.append("status", status);

      if (status === "DELIVERED") {
        formData.append("otp", otp);
        receiptImages.forEach((image) => {
          formData.append("receiptImgs", image);
        });
      }

      await handleUpdateStatus(order.orderId, formData);
      handleCloseModal();
      fetchOrder(); // Fetch updated orders after closing modal
    } catch (err) {
      // Show API errors and keep modal open
      setError(err.response?.data?.message || err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <ModalBox>
        <Typography variant="h6" component="h2" gutterBottom>
          Update Order Status
          {order && (
            <Typography variant="caption" color="textSecondary" display="block">
              Order ID: {order.orderId}
            </Typography>
          )}
        </Typography>

        {error && (
          <Box
            bgcolor="error.light"
            color="error.contrastText"
            p={2}
            mb={2}
            borderRadius={1}
            display="flex"
            alignItems="center"
            gap={1}
          >
            <Error fontSize="small" />
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}

        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label">Order Status</InputLabel>
          <Select
            labelId="status-label"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            label="Order Status"
          >
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="CONFIRMED">Confirmed</MenuItem>
            <MenuItem value="PROCESSING">Processing</MenuItem>
            <MenuItem value="OUT_FOR_DELIVERY">Out for Delivery</MenuItem>
            <MenuItem value="DELIVERED">Delivered</MenuItem>
          </Select>
        </FormControl>

        {status === "DELIVERED" && (
          <>
            <TextField
              label="Delivery OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              fullWidth
              margin="normal"
              type="number"
              inputProps={{ maxLength: 6 }}
            />

            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>
                Receipt Images:
              </Typography>

              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload />}
                disabled={loading}
              >
                Upload Images
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
              </Button>

              <Grid container spacing={2} mt={2}>
                {receiptImages.map((file, index) => (
                  <Grid item xs={4} key={index}>
                    <Box position="relative">
                      <Avatar
                        variant="rounded"
                        src={URL.createObjectURL(file)}
                        sx={{ width: 100, height: 100 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeImage(index)}
                        sx={{
                          position: "absolute",
                          right: 8,
                          top: 8,
                          backgroundColor: "background.paper",
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                      <Typography
                        variant="caption"
                        display="block"
                        noWrap
                        width={100}
                      >
                        {file.name}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </>
        )}

        <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} /> : <CheckCircle />
            }
          >
            {loading ? "Updating..." : "Confirm Update"}
          </Button>
          <Button variant="outlined" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Box>
      </ModalBox>
    </Modal>
  );
};

StatusUpdateModal.propTypes = {
  order: PropTypes.object,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleUpdateStatus: PropTypes.func.isRequired,
};

export default StatusUpdateModal;
