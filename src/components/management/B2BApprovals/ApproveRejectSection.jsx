import React, { useState } from "react";
import { Box, Button, Chip } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import ApproveRejectModal from "./ApproveRejectModal";

const ApproveRejectSection = ({ customer, loading, handleApproveReject }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApproval, setIsApproval] = useState(true); // true for approve, false for reject

  const handleOpenModal = (isApprovalAction) => {
    setIsApproval(isApprovalAction); // Set whether it's an approval or rejection
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleConfirm = (remarks) => {
    handleApproveReject(isApproval, remarks); // Pass the action and remarks to the parent
  };

  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        marginTop: "20px",
      }}
    >
      {customer.isAccepted === true && (
        <Chip
          label="Accepted"
          color="success"
          icon={<CheckCircle />}
          variant="outlined"
        />
      )}
      {customer.isAccepted === false && (
        <Chip
          label="Rejected"
          color="error"
          icon={<Cancel />}
          variant="outlined"
        />
      )}
      {customer.isAccepted === null && (
        <>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            onClick={() => handleOpenModal(true)} // Open modal for approval
            disabled={loading}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Cancel />}
            onClick={() => handleOpenModal(false)} // Open modal for rejection
            disabled={loading}
          >
            Reject
          </Button>
        </>
      )}

      {/* Modal for Remarks */}
      <ApproveRejectModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        isApproval={isApproval}
      />
    </Box>
  );
};

export default ApproveRejectSection;
