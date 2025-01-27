import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../utils/api";
import { Tabs, Tab, Typography, CircularProgress, Box } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomerDetails from "../../../components/admin/Business Profiles/CustomerDetails";
import TransactionHistory from "../../../components/admin/Business Profiles/TransactionHistory";
import CreditInfo from "../../../components/admin/Business Profiles/CreditInfo";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";

const BusinessProfilesDetails = () => {
  const { cid } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [creditInfo, setCreditInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch customer details
  const fetchCustomerDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `/admin/business-profiles/get-b2b-registered-customer-info/${cid}`
      );
      if (response.data.message === "Customer details fetched successfully") {
        setCustomerDetails(response.data.data);
      } else {
        setError("Failed to fetch customer details.");
        toast.error("Failed to fetch customer details.");
      }
    } catch (err) {
      setError(err.message);
      toast.error("An error occurred while fetching customer details.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch transaction history
  const fetchTransactionHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `/admin/business-profiles/get-credit-transactions/${cid}`
      );
      if (response.data.message === "Transactions fetched successfully.") {
        setTransactionHistory(response.data.transactions);
      } else {
        setError("Failed to fetch transaction history.");
        toast.error("Failed to fetch transaction history.");
      }
    } catch (err) {
      setError(err.message);
      toast.error("An error occurred while fetching transaction history.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch credit info
  const fetchCreditInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `/admin/business-profiles/credit-info/${cid}`
      );
      if (response.data.message === "Credit info fetched successfully.") {
        setCreditInfo(response.data.data);
      } else {
        setError("Failed to fetch credit info.");
        toast.error("Failed to fetch credit info.");
      }
    } catch (err) {
      setError(err.message);
      toast.error("An error occurred while fetching credit info.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all data when the component mounts or the tab changes
  useEffect(() => {
    if (activeTab === 0) {
      fetchCustomerDetails();
    } else if (activeTab === 1) {
      fetchTransactionHistory();
    } else if (activeTab === 2) {
      fetchCreditInfo();
    }
  }, [activeTab, cid]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div>
      <BreadcrumbNavigation />
      <Typography variant="h4" gutterBottom>
        Customer Details
      </Typography>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Customer Details" />
        <Tab
          label="Transaction History"
          disabled={
            customerDetails?.isApproved === null ||
            customerDetails?.isApproved === false
          } // Disable if isApproved is null
        />
        <Tab
          label="Credit Info"
          disabled={
            customerDetails?.isApproved === null ||
            customerDetails?.isApproved === false
          } // Disable if isApproved is null
        />
      </Tabs>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          {activeTab === 0 && (
            <CustomerDetails
              customerDetails={customerDetails}
              fetchCustomer={fetchCustomerDetails}
            />
          )}
          {activeTab === 1 && (
            <TransactionHistory transactionHistory={transactionHistory} />
          )}
          {activeTab === 2 && <CreditInfo creditInfo={creditInfo} />}
        </>
      )}
    </div>
  );
};

export default BusinessProfilesDetails;
