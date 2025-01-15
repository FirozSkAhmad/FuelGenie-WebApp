import React, { useContext } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Settings from "../pages/Setting";
import PrivateRoute from "./PrivateRoute";
import Operations from "../pages/Operations";
import Admin from "../pages/Admin";
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
import Roles from "../pages/Admin/Roles/Roles";
import TimeSlots from "../pages/Products/TimeSlots/TimeSlots";
import ProductDetail from "../pages/Products/Zone/ProductDetail";
import Approvals from "../pages/Admin/Approvals/Approvals";
import Team from "../pages/Admin/Team/Team";
import TeamDetail from "../pages/Admin/Team/TeamDetail";
import Restricted from "../pages/Restricted";
import ModuleAccessWrapper from "./ModuleAccessWrapper";
import Wallets from "../pages/Admin/wallets/Wallets";
import WalletDetails from "../pages/Admin/wallets/WalletDetails";
import AuthContext from "../context/AuthContext";
import Coupons from "../pages/Management/Coupons";
import BowserCreation from "../pages/Admin/BowserCreation/Bowser-Creation";
import BowserCreationDetail from "../pages/Admin/BowserCreation/Bowser-Creation-Detail";
import DriverCreation from "../pages/Admin/DriverCreation/Driver-Creation";
import DriverCreationDetail from "../pages/Admin/DriverCreation/Driver-Creation-Detail";
import Orders from "../pages/Operations/Orders/Orders";
import OrdersDetails from "../pages/Operations/Orders/OrdersDetails";
import AssignBowsers from "../pages/Operations/Assign-bowsers/AssignBowsers";
import BDAssignmentHistory from "../pages/Operations/bd-assignment-history/BDAssignmentHistory";

function AppRoutes() {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  // Function to extract requiredModule and requiredSubModule from the path
  const getModuleAndSubModule = (path) => {
    const segments = path.split("/").filter(Boolean); // Split path and remove empty segments
    console.log(segments); // Debugging to check the split path

    // Define module and submodule with default values
    let requiredModule = null;
    let requiredSubModule = null;

    // Ensure there are enough segments to extract the module and submodule
    if (segments.length > 0) {
      requiredModule = segments[0]; // First part of the path as the module
    }
    if (segments.length > 1) {
      requiredSubModule = segments[1]; // Second part of the path as the submodule (if any)
    }

    // Return the extracted module and submodule
    return { requiredModule, requiredSubModule };
  };

  const { requiredModule, requiredSubModule } = getModuleAndSubModule(
    location.pathname
  );

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />
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
        element={
          <ModuleAccessWrapper
            element={<TimeSlots />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/products/zone-prod-mgr"
        element={
          <ModuleAccessWrapper
            element={<ZoneCreation />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/products/zone-prod-mgr/:zoneID"
        element={
          <ModuleAccessWrapper
            element={<ZoneCreationDetails />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/products/zone-prod-mgr/price-history-by-zone-product/:zoneId/:productId"
        element={
          <ModuleAccessWrapper
            element={<ProductDetail />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />

      <Route
        path="/products/price-history"
        element={
          <ModuleAccessWrapper
            element={<PriceHistory />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/products/price-history/by-zone-product/:zoneId/:productId"
        element={
          <ModuleAccessWrapper
            element={<PriceHistoryByProduct />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/products/banner"
        element={
          <ModuleAccessWrapper
            element={<Banner />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/sales/orders"
        element={
          <ModuleAccessWrapper
            element={<Order />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/sales/orders/:orderId"
        element={
          <ModuleAccessWrapper
            element={<OrderDetails />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/sales/notify"
        element={
          <ModuleAccessWrapper
            element={<NotifyMe />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/sales/onboarding-approval"
        element={
          <ModuleAccessWrapper
            element={<OnboardingApprovals />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/sales/onboarding-approval/:customerId"
        element={
          <ModuleAccessWrapper
            element={<OnBoardingApprovalsDetails />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/operations"
        element={
          <ModuleAccessWrapper
            element={<Operations />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/operations/orders"
        element={
          <ModuleAccessWrapper
            element={<Orders />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/operations/orders/:orderId"
        element={
          <ModuleAccessWrapper
            element={<OrdersDetails />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/operations/assign-bowsers"
        element={
          <ModuleAccessWrapper
            element={<AssignBowsers />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/operations/bd-assignment-history"
        element={
          <ModuleAccessWrapper
            element={<BDAssignmentHistory />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/vendor-management"
        element={
          <ModuleAccessWrapper
            element={<VendorManagement />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/admin"
        element={
          <ModuleAccessWrapper
            element={<Admin />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/admin/roles"
        element={
          <ModuleAccessWrapper
            element={<Roles />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/admin/teams"
        element={
          <ModuleAccessWrapper
            element={<Team />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/admin/teams/:teamId"
        element={
          <ModuleAccessWrapper
            element={<TeamDetail />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/admin/wallets"
        element={
          <ModuleAccessWrapper
            element={<Wallets />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/admin/wallets/wallet-details/:customerId"
        element={
          <ModuleAccessWrapper
            element={<WalletDetails />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/admin/approvals"
        element={
          <ModuleAccessWrapper
            element={<Approvals />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/admin/bowser-creation"
        element={
          <ModuleAccessWrapper
            element={<BowserCreation />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/admin/bowser-creation/:bowserId"
        element={
          <ModuleAccessWrapper
            element={<BowserCreationDetail />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/admin/driver-creation"
        element={
          <ModuleAccessWrapper
            element={<DriverCreation />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/admin/driver-creation/:driverId"
        element={
          <ModuleAccessWrapper
            element={<DriverCreationDetail />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/management"
        element={
          <ModuleAccessWrapper
            element={<Management />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route
        path="/management/coupons"
        element={
          <ModuleAccessWrapper
            element={<Coupons />}
            requiredModule={requiredModule}
            requiredSubModule={requiredSubModule}
          />
        }
      />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/restricted" element={<Restricted />} />
    </Routes>
  );
}

export default AppRoutes;
