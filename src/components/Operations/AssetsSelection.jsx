import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControl,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
  Collapse,
} from "@mui/material";
import api from "../../utils/api";

const AssetsSelection = ({ customerId, selectedAssets, setSelectedAssets }) => {
  const [assets, setAssets] = useState([]); // State for available assets
  const [showAddAssetForm, setShowAddAssetForm] = useState(false); // State to toggle the form
  const [newAsset, setNewAsset] = useState({
    assetName: "",
    assetCapacity: "",
    identificationNo: "",
  });

  // Fetch assets when customerId changes
  useEffect(() => {
    if (customerId) {
      fetchAssets();
    }
  }, [customerId]);

  // Fetch assets from the API
  const fetchAssets = async () => {
    try {
      const response = await api.get(
        `/operations/orders/get-assets/${customerId}`
      );
      setAssets(response.data.data); // Update the assets list
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  // Handle adding a new asset
  const handleAddAsset = async (e) => {
    e.preventDefault();
    try {
      // Add the new asset via the API
      await api.post(`/operations/orders/add-asset/${customerId}`, newAsset);
      await fetchAssets(); // Refresh the assets list
      setNewAsset({ assetName: "", assetCapacity: "", identificationNo: "" }); // Reset the form
      setShowAddAssetForm(false); // Hide the form after adding
    } catch (error) {
      console.error("Error adding asset:", error);
    }
  };

  // Toggle selection of an asset
  const toggleAssetSelection = (assetId) => {
    setSelectedAssets(
      (prev) =>
        prev.includes(assetId)
          ? prev.filter((id) => id !== assetId) // Deselect if already selected
          : [...prev, assetId] // Select if not already selected
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* Existing Assets */}
      <Typography variant="h6" gutterBottom>
        Select Assets
      </Typography>
      <List>
        {assets.map((asset) => (
          <ListItem key={asset.assetId} button>
            <Checkbox
              checked={selectedAssets.includes(asset.assetId)}
              onChange={() => toggleAssetSelection(asset.assetId)}
            />
            <ListItemText
              primary={asset.assetName}
              secondary={`ID: ${asset.identificationNo} | Capacity: ${asset.assetCapacity}`}
            />
          </ListItem>
        ))}
      </List>

      {/* Button to show the "Add New Asset" form */}
      {!showAddAssetForm && (
        <Button
          variant="outlined"
          onClick={() => setShowAddAssetForm(true)}
          sx={{ mt: 2 }}
        >
          Add New Asset
        </Button>
      )}

      {/* Collapsible form for adding a new asset */}
      <Collapse in={showAddAssetForm}>
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Add New Asset
        </Typography>
        <Box component="form" onSubmit={handleAddAsset}>
          <TextField
            fullWidth
            label="Asset Name"
            value={newAsset.assetName}
            onChange={(e) =>
              setNewAsset({ ...newAsset, assetName: e.target.value })
            }
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Capacity"
            type="number"
            value={newAsset.assetCapacity}
            onChange={(e) =>
              setNewAsset({ ...newAsset, assetCapacity: e.target.value })
            }
            margin="normal"
            required
            InputProps={{
              endAdornment: <InputAdornment position="end">L</InputAdornment>,
            }}
          />
          <TextField
            fullWidth
            label="Identification Number"
            value={newAsset.identificationNo}
            onChange={(e) =>
              setNewAsset({ ...newAsset, identificationNo: e.target.value })
            }
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" sx={{ mt: 2, mr: 2 }}>
            Save Asset
          </Button>
          <Button
            variant="outlined"
            onClick={() => setShowAddAssetForm(false)}
            sx={{ mt: 2 }}
          >
            Cancel
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
};

export default AssetsSelection;
