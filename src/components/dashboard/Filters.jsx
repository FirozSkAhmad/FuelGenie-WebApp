import React, { useState } from "react";
import { Box, TextField, MenuItem } from "@mui/material";

const Filters = () => {
  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedProduct, setSelectedProduct] = useState("Diesel");

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    console.log(event.target.value);
  };

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
    console.log(event.target.value);
  };

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <TextField
        select
        label="Date"
        value={selectedDate}
        onChange={handleDateChange}
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="Today">Today</MenuItem>
        <MenuItem value="This Week">This Week</MenuItem>
        <MenuItem value="This Month">This Month</MenuItem>
      </TextField>
      <TextField
        select
        label="Product"
        value={selectedProduct}
        onChange={handleProductChange}
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="Diesel">Diesel</MenuItem>
        <MenuItem value="MTO">MTO</MenuItem>
        <MenuItem value="LTO">LTO</MenuItem>
      </TextField>
    </Box>
  );
};

export default Filters;
