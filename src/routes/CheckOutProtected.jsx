import { Navigate } from "react-router-dom";

function CheckOutProtected({ checkoutPageKey, children }) {
  return <>{checkoutPageKey ? children : <Navigate to="/cart" replace />}</>;
}

export default CheckOutProtected;
