import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Box, Grid } from "@mui/material";
import { CircularProgress, Button, Typography, Paper } from "@mui/material";
import { toast } from "react-toastify";
import api from "../../../utils/api";
import CustomerDetailsHeader from "../../../components/management/B2BApprovals/CustomerDetailsHeader";
import FirmTypeSection from "../../../components/management/B2BApprovals/FirmTypeSection";
import ProfileImageSection from "../../../components/management/B2BApprovals/ProfileImageSection";
import ApproveRejectSection from "../../../components/management/B2BApprovals/ApproveRejectSection";
import BasicInformationSection from "../../../components/management/B2BApprovals/BasicInformationSection";
import BusinessAddressSection from "../../../components/management/B2BApprovals/BusinessAddressSection";
import DocumentsSection from "../../../components/management/B2BApprovals/DocumentsSection";
import EditCustomerInfoModal from "../../../components/management/B2BApprovals/EditCustomerInfoModal";
import EditDocumentsModal from "../../../components/management/B2BApprovals/EditDocumentsModal";
import DocumentViewerModal from "../../../components/management/B2BApprovals/DocumentViewerModal";
import SnackbarComponent from "../../../components/UI/SnackbarComponent";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";
import {
  Edit,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import OtherDocumentsSection from "../../../components/management/B2BApprovals/OtherDocumentsSection";
import { usePermissions } from "../../../utils/permissionssHelper";
import RemarkDialog from "../../../components/management/B2BApprovals/RemarkDialog";

const B2BApprovalsDetails = () => {
  const { cid } = useParams();
  const [customer, setCustomer] = useState(null);
  const [touchedFields, setTouchedFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [documentUrl, setDocumentUrl] = useState("");
  const [updatedCustomer, setUpdatedCustomer] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [firmType, setFirmType] = useState("");
  const [requiredDocuments, setRequiredDocuments] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isRemarkDialogOpen, setIsRemarkDialogOpen] = useState(false);
  const [remarkType, setRemarkType] = useState(null); // To track which save function triggered the remark dialog

  const permissions = usePermissions();
  useEffect(() => {
    fetchCustomerDetails();
  }, [cid]);

  const fetchCustomerDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `/management/b2b-approvals/get-b2b-registered-customer-info/${cid}`
      );
      setCustomer(response.data.data);
      setUpdatedCustomer(response.data.data); // Initialize updatedCustomer with fetched data
      setFirmType(response.data.data.firmType || "PROPRIETORSHIP");
      setRequiredDocuments(getRequiredDocuments(response.data.data.firmType));
    } catch (error) {
      console.error("Error fetching customer details:", error);
      setError("Failed to fetch customer details. Please try again later.");
      toast.error("Failed to fetch customer details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getRequiredDocuments = (firmType) => {
    switch (firmType) {
      case "PROPRIETORSHIP":
        return [
          "auditedFinancialItrNumber",
          "auditedFinancialItrPdfUrl",
          "gstNumber",
          "gstCertificatePdfUrl",
          "bankStatementPdfUrl",
          "aadhaarNumber",
          "aadhaarCardPdfUrl",
        ];
      case "PARTNERSHIP":
        return [
          "auditedFinancialItrNumber",
          "auditedFinancialItrPdfUrl",
          "gstNumber",
          "gstCertificatePdfUrl",
          "bankStatementPdfUrl",
          "aadhaarNumber",
          "aadhaarCardPdfUrl",
          "partnershipDeedPdfUrl",
          "listOfPartnersPdfUrl",
          "partnershipLetterPdfUrl",
        ];
      case "PRIVATE LTD / LTD.":
        return [
          "auditedFinancialItrNumber",
          "auditedFinancialItrPdfUrl",
          "gstNumber",
          "gstCertificatePdfUrl",
          "bankStatementPdfUrl",
          "aadhaarNumber",
          "aadhaarCardPdfUrl",
          "boardResolutionPdfUrl",
          "listOfDirectorsPdfUrl",
          "companyPanNumber",
          "companyPanPdfUrl",
          "certificateOfIncorporationPdfUrl",
          "moaAoaPdfUrl",
        ];
      default:
        return [];
    }
  };

  const handleViewDocument = (url) => {
    setDocumentUrl(url);
    setOpenViewModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setOpenViewModal(false);
    setDocumentUrl("");
    setUpdatedCustomer(customer); // Reset updatedCustomer when closing the modal
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parentKey, childKey] = name.split(".");
      setUpdatedCustomer((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: value,
        },
      }));
    } else {
      setUpdatedCustomer((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDocumentChange = (e) => {
    const { name, value } = e.target;
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));
    setUpdatedCustomer((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [name]: value,
      },
    }));
  };

  const handleUploadNewDocument = (docKey) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "application/pdf";
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setTouchedFields((prev) => ({
          ...prev,
          [docKey]: true,
        }));
        setUpdatedCustomer((prev) => ({
          ...prev,
          documents: {
            ...prev.documents,
            [docKey]: file,
          },
        }));
      }
    };
    fileInput.click();
  };

  const isSaveDisabled = () => {
    for (const docKey of requiredDocuments) {
      const docValue = updatedCustomer.documents?.[docKey];
      if (
        !docValue ||
        (typeof docValue === "string" && docValue.trim() === "")
      ) {
        return true;
      }
    }
    const hasTouchedFields = Object.values(touchedFields).some(
      (touched) => touched
    );
    return !hasTouchedFields;
  };

  const handleFirmTypeChange = (e) => {
    const newFirmType = e.target.value;
    setFirmType(newFirmType);
    setRequiredDocuments(getRequiredDocuments(newFirmType));
    setTouchedFields((prev) => ({
      ...prev,
      firmType: true,
    }));
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setUpdatedCustomer(customer); // Reset updatedCustomer when canceling edit
  };

  const handleSaveCustomerInfo = async () => {
    setRemarkType("customerInfo"); // Set remark type for customer info
    setIsRemarkDialogOpen(true); // Open the remark dialog
  };

  const handleSaveDocuments = async () => {
    setRemarkType("documents"); // Set remark type for documents
    setIsRemarkDialogOpen(true); // Open the remark dialog
  };

  const handleRemarkSubmit = async (remark) => {
    setIsRemarkDialogOpen(false); // Close the remark dialog
    setLoading(true);
    setError(null);
    try {
      if (remarkType === "customerInfo") {
        const payload = {};
        for (const key in updatedCustomer) {
          if (updatedCustomer[key] !== customer[key]) {
            payload[key] = updatedCustomer[key];
          }
        }
        payload.remarks = remark; // Add remark to the payload
        const response = await api.put(
          `/management/b2b-approvals/update-b2b-registered-customer-info/${cid}`,
          payload
        );
        fetchCustomerDetails();
        setEditMode(false);
        setSnackbarMessage("Customer details updated successfully!");
        toast.success("Customer details updated successfully!");
        setSnackbarOpen(true);
      } else if (remarkType === "documents") {
        const formData = new FormData();
        if (touchedFields.firmType) {
          formData.append("firmType", firmType);
        }
        for (const docKey of requiredDocuments) {
          if (touchedFields[docKey]) {
            const docValue = updatedCustomer.documents?.[docKey];
            if (docKey.endsWith("PdfUrl") && docValue instanceof File) {
              formData.append(docKey, docValue);
            } else {
              formData.append(docKey, docValue);
            }
          }
        }
        formData.append("remarks", remark); // Add remark to the formData
        const response = await api.put(
          `/management/b2b-approvals/update-b2b-registered-customer-documents/${cid}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        fetchCustomerDetails();
        setOpenModal(false);
        setSnackbarMessage("Documents updated successfully!");
        toast.success("Documents updated successfully!");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error updating details:", error);
      toast.error("Failed to update details. Please try again later.");
      setError("Failed to update details. Please try again later.");
      setUpdatedCustomer(customer); // Reset updatedCustomer on error
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleApproveReject = async (isAccepted, remarks) => {
    setLoading(true);
    try {
      const response = await api.put(
        `/management/b2b-approvals/approve-b2b-registered-customer/${cid}?isAccepted=${isAccepted}`,
        { managementRemarks: remarks } // Include remarks in the request body
      );
      setSnackbarMessage(
        isAccepted
          ? "Customer approved successfully!"
          : "Customer rejected successfully!"
      );
      toast.success(
        isAccepted
          ? "Customer approved successfully!"
          : "Customer rejected successfully!"
      );
      setSnackbarOpen(true);
      fetchCustomerDetails(); // Refresh customer details
    } catch (error) {
      console.error("Error updating customer status:", error);
      toast.error("Failed to update customer status. Please try again later.");
      setError("Failed to update customer status. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!customer) {
    return <Typography variant="h6">No customer data found.</Typography>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <BreadcrumbNavigation />
      <Paper
        elevation={3}
        sx={{
          padding: "24px",
          marginBottom: "24px",
          borderRadius: "8px",
        }}
      >
        {/* Grid Layout for Two Columns */}
        <Grid container spacing={3}>
          {/* Left Column: Customer Details Header, Firm Type, Profile Image */}
          <Grid item xs={12} md={7}>
            {" "}
            {/* Reduced width from md={8} to md={7} */}
            <Box sx={{ marginBottom: "24px" }}>
              <CustomerDetailsHeader />
            </Box>
            <Box sx={{ marginBottom: "24px" }}>
              <FirmTypeSection firmType={customer.firmType} />
            </Box>
            <Box sx={{ marginBottom: "24px" }}>
              <ProfileImageSection profileImage={customer.profileImage} />
            </Box>
          </Grid>

          {/* Right Column: Approve/Reject Section */}
          <Grid item xs={12} md={5}>
            {" "}
            {/* Increased width from md={4} to md={5} */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                height: "100%",
              }}
            >
              <ApproveRejectSection
                customer={customer}
                loading={loading}
                handleApproveReject={handleApproveReject}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Button
        variant="contained"
        startIcon={<Edit />}
        onClick={handleEditClick}
        style={{ marginBottom: "20px" }}
        disabled={!permissions.update}
      >
        Edit Customer Info
      </Button>
      <Button
        variant="contained"
        startIcon={<Edit />}
        onClick={() => setOpenModal(true)}
        style={{ marginBottom: "20px", marginLeft: "10px" }}
        disabled={!permissions.update}
      >
        Edit Documents
      </Button>
      <BasicInformationSection customer={customer} />
      <BusinessAddressSection customer={customer} />
      <DocumentsSection
        customer={customer}
        handleViewDocument={handleViewDocument}
      />
      <OtherDocumentsSection
        customerId={cid}
        otherDocs={customer?.otherDocs || []}
        fetchCustomerDetails={fetchCustomerDetails}
        isAccepted={customer.isAccepted}
      />
      <EditCustomerInfoModal
        editMode={editMode}
        handleCancelEdit={handleCancelEdit}
        updatedCustomer={updatedCustomer}
        handleInputChange={handleInputChange}
        handleSaveCustomerInfo={handleSaveCustomerInfo}
      />
      <EditDocumentsModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        firmType={firmType}
        handleFirmTypeChange={handleFirmTypeChange}
        updatedCustomer={updatedCustomer}
        handleDocumentChange={handleDocumentChange}
        handleUploadNewDocument={handleUploadNewDocument}
        requiredDocuments={requiredDocuments}
        isSaveDisabled={isSaveDisabled}
        handleSaveDocuments={handleSaveDocuments}
      />
      <DocumentViewerModal
        openViewModal={openViewModal}
        handleCloseModal={handleCloseModal}
        documentUrl={documentUrl}
      />
      <SnackbarComponent
        snackbarOpen={snackbarOpen}
        handleCloseSnackbar={handleCloseSnackbar}
        snackbarMessage={snackbarMessage}
      />
      <RemarkDialog
        isOpen={isRemarkDialogOpen}
        onClose={() => setIsRemarkDialogOpen(false)}
        onSubmit={handleRemarkSubmit}
      />
    </div>
  );
};

export default B2BApprovalsDetails;
