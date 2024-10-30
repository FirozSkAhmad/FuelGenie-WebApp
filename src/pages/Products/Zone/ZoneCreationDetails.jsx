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

  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  const handleOpenModal = (pincode = "") => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Fetch pincodes on component mount or when zoneID changes
  const fetchPincodes = async () => {
    try {
      setLoadingPincodes(true);
      const response = await api.get(`/products/all-pincodes/${zoneID}`);

      if (response.status !== 200) {
        throw new Error(response.message || "Failed to fetch pincodes");
      }

      setPincodes(response.data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingPincodes(false);
    }
  };
  useEffect(() => {
    fetchPincodes();
  }, [zoneID]);

  // Fetch products
  const fetchProducts = async () => {
    if (activeTab === 1) {
      try {
        setLoadingProducts(true);
        const response = await api.get(`/products/products-by-zone/${zoneID}`);

        if (response.status === 200 && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingProducts(false);
      }
    }
  };

  // Fetch products on component mount or when activeTab or zoneID changes
  useEffect(() => {
    fetchProducts();
  }, [activeTab, zoneID]);

  // Handler for adding a product
  const handleAddProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };
  const handleUpdatePincodes = () => {
    fetchPincodes();
  };

  const handleDeletePincode = async (pincode) => {
    try {
      await api.patch(`/products/add-or-remove-pincodes/${zoneID}`, {
        pincodesToAdd: [],
        pincodesToRemove: [pincode],
      });
      // fetchPincodes();
      setPincodes((prev) => prev.filter((pc) => pc !== pincode));
    } catch (error) {
      setError("Failed to delete pincode");
    }
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
            onUpdatePincodes={handleUpdatePincodes}
            onAddPincode={() => handleOpenModal()} // Open modal for new pincode
            onEdit={handleOpenModal} // Open modal for editing existing pincode
            onDelete={handleDeletePincode}
          />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <ProductList
            zoneId={zoneID}
            products={products}
            loading={loadingProducts}
            error={error}
            onAddProduct={handleAddProduct}
            fetchProducts={fetchProducts}
          />
        </TabPanel>
      </Paper>
      {/* Pincode Modal for Adding/Editing */}
      <PincodeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        zoneId={zoneID}
        existingPincodes={pincodes}
        onUpdatePincodes={handleUpdatePincodes} // Pass the update handler
      />
    </Container>
  );
};

export default ZoneCreationDetails;
