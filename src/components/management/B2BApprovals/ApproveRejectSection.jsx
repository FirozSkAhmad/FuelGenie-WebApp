import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Typography,
  Modal,
  List,
  ListItem,
  ListItemText,
  Avatar,
  TextField,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Autorenew as AutorenewIcon,
} from "@mui/icons-material";

import ApproveRejectModal from "./ApproveRejectModal";
import { usePermissions } from "../../../utils/permissionssHelper";
import ApprovedAndReviewed from "./ApprovedAndReviewed";
import api from "../../../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ApproveRejectSection = ({ customer, loading, handleApproveReject }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApproval, setIsApproval] = useState(true); // true for approve, false for reject
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [updateHistory, setUpdateHistory] = useState([]);
  const [isReApproveModalOpen, setIsReApproveModalOpen] = useState(false);
  const [remarks, setRemarks] = useState("");

  const { cid } = useParams();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const handleOpenModal = (isApprovalAction) => {
    setIsApproval(isApprovalAction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = async (remarks) => {
    try {
      await handleApproveReject(isApproval, remarks);
      toast.success(
        isApproval
          ? "Customer successfully approved!"
          : "Customer successfully rejected!"
      );
    } catch (error) {
      toast.error(
        `Error ${isApproval ? "approving" : "rejecting"} customer: ${
          error.message || "Unexpected error"
        }`
      );
    } finally {
      setIsModalOpen(false);
    }
  };

  const fetchUpdateHistory = async () => {
    try {
      const response = await api.get(
        `/management/b2b-approvals/get-update-history/${cid}`
      );
      setUpdateHistory(response.data.data);
      setIsHistoryModalOpen(true);
    } catch (error) {
      toast.error(
        `Failed to fetch update history: ${error.message || "Unexpected error"}`
      );
    }
  };

  const handleCloseHistoryModal = () => {
    setIsHistoryModalOpen(false);
  };

  const handleOpenReApproveModal = () => {
    setIsReApproveModalOpen(true);
  };

  const handleCloseReApproveModal = () => {
    setIsReApproveModalOpen(false);
    setRemarks("");
  };

  const handleResetRejection = async () => {
    try {
      await api.put(`/management/b2b-approvals/reset-is-rejected/${cid}`, {
        remarks,
      });
      toast.success("Rejection reset successfully!");
      navigate("/management/b2b-approvals");
    } catch (error) {
      toast.error(
        `Error resetting rejection: ${error.message || "Unexpected error"}`
      );
    } finally {
      setIsReApproveModalOpen(false);
      setRemarks("");
    }
  };

  return (
    <Box>
      <ApprovedAndReviewed customer={customer} />

      <Box
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <Chip
          label="Update History"
          color="primary"
          icon={<HistoryIcon />}
          variant="outlined"
          onClick={fetchUpdateHistory}
          clickable
        />

        {customer.isAccepted === true && (
          <Chip
            label="Accepted"
            color="success"
            icon={<CheckCircleIcon />}
            variant="outlined"
            clickable
          />
        )}
        {customer.isAccepted === false && (
          <Chip
            label="Reset Rejection"
            color="primary"
            icon={<AutorenewIcon />}
            variant="outlined"
            clickable
            onClick={handleOpenReApproveModal}
            disabled={loading || !permissions.update}
            sx={{
              borderRadius: "4px",
              borderColor: "primary.main",
              color: "primary.main",
              "&:hover": {
                backgroundColor: "primary.light",
              },
            }}
          />
        )}
        {customer.isAccepted === null && (
          <>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={() => handleOpenModal(true)}
              disabled={loading || !permissions.update}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => handleOpenModal(false)}
              disabled={loading || !permissions.update}
            >
              Reject
            </Button>
          </>
        )}
      </Box>

      <ApproveRejectModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        isApproval={isApproval}
      />

      <Modal
        open={isHistoryModalOpen}
        onClose={handleCloseHistoryModal}
        aria-labelledby="update-history-modal"
        aria-describedby="update-history-details"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            maxHeight: "80vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ p: 3, borderBottom: "1px solid #eee" }}>
            <Typography variant="h6" gutterBottom>
              Update History
            </Typography>
          </Box>

          <Box sx={{ overflowY: "auto", flex: 1, p: 3 }}>
            <List>
              {updateHistory.map((history, index) => (
                <ListItem key={index} sx={{ borderBottom: "1px solid #eee" }}>
                  <Avatar sx={{ width: 24, height: 24, mr: 2 }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  <ListItemText
                    primary={history.name}
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {history.remarks}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(history.updatedAt).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={isReApproveModalOpen}
        onClose={handleCloseReApproveModal}
        aria-labelledby="reapprove-modal"
        aria-describedby="reapprove-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "8px",
            p: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Reset Rejection
          </Typography>
          <TextField
            label="Remarks"
            fullWidth
            multiline
            rows={4}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={handleCloseReApproveModal} color="error">
              Cancel
            </Button>
            <Button
              onClick={handleResetRejection}
              color="primary"
              variant="contained"
              disabled={!remarks.trim()}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ApproveRejectSection;
