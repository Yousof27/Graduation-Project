import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRouteUser = () => {
  const authData = useSelector((state) => state.auth);

  const isAuthenticated = authData?.isAuthenticated;
  const role = authData?.user?.role;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  //
  else if (role !== "client") {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default ProtectedRouteUser;
