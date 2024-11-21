import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Settings from "../pages/Setting";
import PrivateRoute from "./PrivateRoute";
import Operations from "../pages/Operations";
import Admin from "../pages/admin";
import Management from "../pages/Management";
import VendorManagement from "../pages/Vendor-Management";
import NotFoundPage from "../pages/NotFound";

import Login from "../Auth/Login";
import PriceHistory from "../pages/Products/PriceHistory/PriceHistory";
import Banner from "../pages/Products/Banner/Banner";
import Order from "../pages/Sales/Order";
import OrderDetails from "../pages/Sales/OrderDetails";
import NotifyMe from "../pages/Sales/NotifyMe";
import OnboardingApprovals from "../pages/Sales/Approvals/OnboardingApprovals";
import OnBoardingApprovalsDetails from "../pages/Sales/Approvals/OnBoardingApprovalsDetails";
import ZoneCreation from "../pages/Products/Zone/ZoneCreation";
import ZoneCreationDetails from "../pages/Products/Zone/ZoneCreationDetails";
import SignupPage from "../Auth/Signup";
import PriceHistoryByProduct from "../pages/Products/PriceHistory/PriceHistoryByProduct";
import Roles from "../pages/Admin/Roles";
import TimeSlots from "../pages/Products/TimeSlots/TimeSlots";
import ProductDetail from "../pages/Products/Zone/ProductDetail";
import Approvals from "../pages/Admin/Approvals/Approvals";
import Team from "../pages/Admin/Team/Team";
import TeamDetail from "../pages/Admin/Team/TeamDetail";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/dashboard"
        element={<PrivateRoute element={<Dashboard />} />}
      />
      <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
      <Route
        path="/settings"
        element={<PrivateRoute element={<Settings />} />}
      />
      <Route
        path="/products/time-slots"
        element={<PrivateRoute element={<TimeSlots />} />}
      />
      <Route
        path="/products/zone-prod-mgr"
        element={<PrivateRoute element={<ZoneCreation />} />}
      />
      <Route
        path="/products/zone-prod-mgr/:zoneID"
        element={<PrivateRoute element={<ZoneCreationDetails />} />}
      />
      <Route
        path="/products/zone-prod-mgr/price-history-by-zone-product/:zoneId/:productId"
        element={<PrivateRoute element={<ProductDetail />} />}
      />

      <Route
        path="/products/price-history"
        element={<PrivateRoute element={<PriceHistory />} />}
      />
      <Route
        path="/products/price-history-by-zone-product/:zoneId/:productId"
        element={<PrivateRoute element={<PriceHistoryByProduct />} />}
      />
      <Route
        path="/products/banner"
        element={<PrivateRoute element={<Banner />} />}
      />
      <Route
        path="/sales/orders"
        element={<PrivateRoute element={<Order />} />}
      />
      <Route
        path="/sales/orders/:orderId"
        element={<PrivateRoute element={<OrderDetails />} />}
      />
      <Route
        path="/sales/notify"
        element={<PrivateRoute element={<NotifyMe />} />}
      />
      <Route
        path="/sales/onboarding-approval"
        element={<PrivateRoute element={<OnboardingApprovals />} />}
      />
      <Route
        path="/sales/onboarding-approval/:customerId"
        element={<PrivateRoute element={<OnBoardingApprovalsDetails />} />}
      />
      <Route
        path="/operations"
        element={<PrivateRoute element={<Operations />} />}
      />
      <Route
        path="/vendor-management"
        element={<PrivateRoute element={<VendorManagement />} />}
      />
      <Route path="/admin" element={<PrivateRoute element={<Admin />} />} />
      <Route
        path="/admin/roles"
        element={<PrivateRoute element={<Roles />} />}
      />
      <Route path="/admin/team" element={<PrivateRoute element={<Team />} />} />
      <Route
        path="/admin/team/:teamId"
        element={<PrivateRoute element={<TeamDetail />} />}
      />
      <Route
        path="/admin/approvals"
        element={<PrivateRoute element={<Approvals />} />}
      />
      <Route
        path="/management"
        element={<PrivateRoute element={<Management />} />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
