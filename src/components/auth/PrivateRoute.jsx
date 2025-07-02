import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = sessionStorage.getItem("token"); // Check for stored JWT
  return token ? <Outlet /> : <Navigate to="/admin-login" />;
};

export default PrivateRoute;
