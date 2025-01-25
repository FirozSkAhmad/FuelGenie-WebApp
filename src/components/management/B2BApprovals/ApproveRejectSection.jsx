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
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Autorenew as AutorenewIcon,
} from "@mui/icons-material"; // All icons imported

import ApproveRejectModal from "./ApproveRejectModal";
import { usePermissions } from "../../../utils/permissionssHelper";
import ApprovedAndReviewed from "./ApprovedAndReviewed";
import api from "../../../utils/api";
import { useParams } from "react-router-dom";

const ApproveRejectSection = ({ customer, loading, handleApproveReject }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApproval, setIsApproval] = useState(true); // true for approve, false for reject
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false); // For update history modal
  const [updateHistory, setUpdateHistory] = useState([]); // To store update history
  const { cid } = useParams();
  const permissions = usePermissions();

  const handleOpenModal = (isApprovalAction) => {
    setIsApproval(isApprovalAction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = (remarks) => {
    handleApproveReject(isApproval, remarks);
  };

  // Fetch update history when the chip is clicked
  const fetchUpdateHistory = async () => {
    try {
      const response = await api.get(
        `/management/b2b-approvals/get-update-history/${cid}`
      );
      setUpdateHistory(response.data.data); // Set the fetched history
      setIsHistoryModalOpen(true); // Open the history modal
    } catch (error) {
      console.error("Error fetching update history:", error);
    }
  };

  // Close the history modal
  const handleCloseHistoryModal = () => {
    setIsHistoryModalOpen(false);
  };

  return (
    <Box>
      {/* Approved and Reviewed Section */}

      <ApprovedAndReviewed customer={customer} />

      {/* Approval/Rejection Buttons or Status Chips */}
      <Box
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        {/* Update History Chip */}
        <Chip
          label="Update History"
          color="primary"
          icon={<HistoryIcon />} // History icon
          variant="outlined"
          onClick={fetchUpdateHistory} // Fetch history on click
          clickable
        />

        {customer.isAccepted === true && (
          <Chip
            label="Accepted"
            color="success"
            icon={<CheckCircleIcon />} // CheckCircle icon
            variant="outlined"
            clickable
          />
        )}
        {customer.isAccepted === false && (
          <Chip
            label="Re-Approve"
            color="primary" // Use "primary" or a custom color
            icon={<AutorenewIcon />} // Use the Autorenew icon
            variant="outlined"
            clickable
            onClick={() => handleOpenModal(true)} // Open modal for re-approval
            sx={{
              borderRadius: "4px",
              borderColor: "primary.main", // Customize border color
              color: "primary.main", // Customize text color
              "&:hover": {
                backgroundColor: "primary.light", // Add hover effect
              },
            }}
          />
        )}
        {customer.isAccepted === null && (
          <>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />} // CheckCircle icon
              onClick={() => handleOpenModal(true)}
              disabled={loading || !permissions.update}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<CancelIcon />} // Cancel icon
              onClick={() => handleOpenModal(false)}
              disabled={loading || !permissions.update}
            >
              Reject
            </Button>
          </>
        )}
      </Box>

      {/* Modal for Approval/Rejection Remarks */}
      <ApproveRejectModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        isApproval={isApproval}
      />

      {/* Modal for Update History */}
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
          {/* Fixed Header */}
          <Box sx={{ p: 3, borderBottom: "1px solid #eee" }}>
            <Typography variant="h6" gutterBottom>
              Update History
            </Typography>
          </Box>

          {/* Scrollable List */}
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
    </Box>
  );
};

export default ApproveRejectSection;
