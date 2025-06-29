import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRouteUserAdmin = () => {
  const authData = useSelector((state) => state.auth);

  const role = authData?.user?.role;
  if (role === "doctor" ) {
    return <Navigate to="/unauthorized" />;
  }
  else if( typeof role==="undefined"){
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRouteUserAdmin;
