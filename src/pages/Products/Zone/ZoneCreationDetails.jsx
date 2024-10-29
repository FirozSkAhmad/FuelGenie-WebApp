import React, { useState, useEffect } from "react";
import { Container, Paper, Box, Tabs, Tab } from "@mui/material";
import { useParams } from "react-router-dom";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";
import TabPanel from "../../../components/addProduct/utils/TabPanel";
import PincodeTable from "../../../components/addProduct/utils/PincodeTable";
import ProductList from "../../../components/addProduct/utils/ProductList";
import PincodeModal from "../../../components/addProduct/utils/PincodeModal";
import api from "../../../utils/api";

const ZoneCreationDetails = () => {
  const { zoneID } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [pincodes, setPincodes] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingPincodes, setLoadingPincodes] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPincode, setNewPincode] = useState("");

  const handleTabChange = (event, newValue) => setActiveTab(newValue);
  const handleAddPincode = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSavePincode = () => {
    if (newPincode) {
      setPincodes([...pincodes, newPincode]);
      handleCloseModal();
    }
  };

  // Fetch pincodes on component mount or when zoneID changes
  useEffect(() => {
    const fetchPincodes = async () => {
      try {
        setLoadingPincodes(true);
        const response = await api.get(`/products/all-pincodes/${zoneID}`);

        // Check if response is ok
        if (response.status !== 200) {
          throw new Error(response.message || "Failed to fetch pincodes");
        }

        // Directly set the array of pincodes from the response
        setPincodes(response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingPincodes(false);
      }
    };

    fetchPincodes();
  }, [zoneID]);

  // Fetch products
  const fetchProducts = async () => {
    if (activeTab === 1) {
      try {
        setLoadingProducts(true);
        const response = await api.get(`/products/products-by-zone/${zoneID}`);

        // Check if the response is successful and contains a products array
        if (response.status === 200 && Array.isArray(response.data.products)) {
          setProducts(response.data.products); // Set products if valid
        } else {
          setProducts([]); // Ensure products is an empty array if not valid
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingProducts(false);
      }
    }
  };

  const handleRefreshProducts = () => {
    fetchProducts();
    console.log("refectch"); // Call fetchProducts when refreshing
  };

  // Fetch products on component mount or when activeTab or zoneID changes
  useEffect(() => {
    fetchProducts();
  }, [activeTab, zoneID]);

  // Handler for adding a product
  const handleAddProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };
  return (
    <Container maxWidth="lg">
      <BreadcrumbNavigation />
      <Paper sx={{ width: "100%", mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Pincodes" />
            <Tab label="Products" />
          </Tabs>
        </Box>
        <TabPanel value={activeTab} index={0}>
          <PincodeTable
            pincodes={pincodes}
            loading={loadingPincodes}
            error={error}
            onAddPincode={handleAddPincode}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <ProductList
            products={products}
            loading={loadingProducts}
            error={error}
            onAddProduct={handleAddProduct}
            fetchProducts={handleRefreshProducts}
          />
        </TabPanel>
      </Paper>
      <PincodeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePincode}
        pincode={newPincode}
        setPincode={setNewPincode}
      />
    </Container>
  );
};

export default ZoneCreationDetails;
