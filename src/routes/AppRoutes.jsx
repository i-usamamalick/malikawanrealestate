import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ContactPage from "../pages/ContactPage";
import LoginPage from "../pages/auth/LoginPage";
import AdminDashboard from "../pages/auth/AdminDashboard";
import PrivateRoute from "../components/auth/PrivateRoute";
import TermsAndConditionsPage from "../pages/TermsAndConditionsPage";
import { BuyerDetails } from "../pages/auth/BuyerDetails";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/admin-login" element={<LoginPage />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/buyers" element={<BuyerDetails />} />
      </Route>
      <Route path="/*" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
