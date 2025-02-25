import React, { useState } from "react";
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

  return (
    <div>
      <Button variant="contained" onClick={handleModalOpen}>
        Create Order
      </Button>
      <CreateOrderModal
        open={isModalOpen}
        handleClose={handleModalClose}
        fetchOrder={fetchOrder} // Pass fetchOrder to the modal
      />
    </div>
  );
};

export default CreateOrder;
