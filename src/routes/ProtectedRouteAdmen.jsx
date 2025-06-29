import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRouteAdmin = () => {
  const authData = useSelector((state) => state.auth);

  const isAuthenticated = authData?.isAuthenticated;
  const role = authData?.user?.role;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  //
  else if (role !== "admin") {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default ProtectedRouteAdmin;
