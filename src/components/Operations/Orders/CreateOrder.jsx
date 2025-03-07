import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import CreateOrderModal from "./CreateOrderModal";

const CreateOrder = ({ fetchOrder }) => {
  // Destructure fetchOrder from props
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = async () => {
    setIsModalOpen(false);
    if (typeof fetchOrder === "function") {
      // Use fetchOrder (no "s")
      await fetchOrder(); // Call fetchOrder to refresh the orders list
    } else {
      console.error("fetchOrder is not a function");
    }
  };

  const fetchData = async () => {
    await fetchOrder();
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Button variant="contained" onClick={handleModalOpen}>
        Create Order
      </Button>
      <CreateOrderModal
        open={isModalOpen}
        handleClose={handleModalClose}
        fetchOrder={fetchData} // Pass fetchOrder to the modal
      />
    </div>
  );
};

export default CreateOrder;
