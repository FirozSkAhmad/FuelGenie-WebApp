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
import ProductsList from "../pages/Products/ProductsList";
import Login from "../Auth/Login";
import PriceHistory from "../pages/Products/PriceHistory";
import Banner from "../pages/Products/Banner";
import Order from "../pages/Sales/Order";
import OrderDetails from "../pages/Sales/OrderDetails";
import NotifyMe from "../pages/Sales/NotifyMe";
import OnboardingApprovals from "../pages/Sales/Approvals/OnboardingApprovals";
import OnBoardingApprovalsDetails from "../pages/Sales/Approvals/OnBoardingApprovalsDetails";
import ZoneCreation from "../pages/Products/Zone/ZoneCreation";
import ZoneCreationDetails from "../pages/Products/Zone/ZoneCreationDetails";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/products/product-list" element={<ProductsList />} />
      <Route path="/products/zone" element={<ZoneCreation />} />
      <Route path="/products/zone/:zoneID" element={<ZoneCreationDetails />} />
      <Route path="/products/price-history" element={<PriceHistory />} />
      <Route path="/products/banner" element={<Banner />} />
      <Route path="/sales/orders" element={<Order />} />
      <Route path="/sales/orders/:orderId" element={<OrderDetails />} />
      <Route path="/sales/notify" element={<NotifyMe />} />
      <Route
        path="/sales/onboarding-approval"
        element={<OnboardingApprovals />}
      />
      <Route
        path="/sales/onboarding-approval/:customerId"
        element={<OnBoardingApprovalsDetails />}
      />
      <Route path="/operations" element={<Operations />} />
      <Route path="/vendor-management" element={<VendorManagement />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/management" element={<Management />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
