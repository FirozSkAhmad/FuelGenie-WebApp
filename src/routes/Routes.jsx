import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Settings from "../pages/Setting";

import Operations from "../pages/Operations";
import Admin from "../pages/admin";
import Management from "../pages/Management";
import VendorManagement from "../pages/Vendor-Management";
import NotFoundPage from "../pages/NotFound";
import ProductsList from "../pages/ProductsList";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/products/product-list" element={<ProductsList />} />
      <Route path="/operations" element={<Operations />} />
      <Route path="/vendor-management" element={<VendorManagement />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/management" element={<Management />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
