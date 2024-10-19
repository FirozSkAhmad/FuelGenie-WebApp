import React from "react";
import { Box, Grid } from "@mui/material";
import Header from "../components/dashboard/Header";
import MetricCards from "../components/dashboard/MetricCards";
import OrdersTable from "../components/dashboard/OrdersTable";
import OrderCountGraph from "../components/dashboard/OrderCountGraph";
import Filters from "../components/dashboard/Filters";

const Dashboard = () => {
  return (
    <Box sx={{ width: "100%", minHeight: "100vh", p: 3 }}>
      {/* Header */}
      <Header />

      {/* Top metric cards */}
      <Box sx={{ width: "100%", mt: 2 }}>
        <MetricCards />
      </Box>

      {/* Filters */}
      <Box mt={2} sx={{ width: "100%" }}>
        <Filters />
      </Box>

      {/* Orders and Graph */}
      <Grid container spacing={3} mt={3} sx={{ width: "100%" }}>
        <Grid item xs={12} md={7}>
          <OrdersTable />
        </Grid>
        <Grid item xs={12} md={5}>
          <OrderCountGraph />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
