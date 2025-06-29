import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/home/Home";
import Login from "./pages/login and Register/Login";
import Register from "./pages/login and Register/Register";
import Market from "./pages/market/Market";
import Doctors from "./pages/doctors/Doctors";
import MainPage from "./pages/MainPage";
import DoctorInfo from "./pages/doctor info/DoctorInfo";
import ProductInfo from "./components/products/product info/ProductInfo";
import ProtectedRoute from "./routes/ProtectedRoute";
import Cart from "./pages/cart/Cart";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import CheckOutProtected from "./routes/CheckOutProtected";
import Checkout from "./pages/checkout/Checkout";
import Unauthorized from "./pages/Unauthorized";
import "./App.css";
import VerifyEmail from "./pages/verify email/VerifyEmail";
import Appointment from "./pages/appointment/Appointment";
import Detector from "./pages/model/Detector";
import Profile from "./pages/profile/profile";
import DoctorProfile from "./pages/doctor profile/doctorProfile";
import GlassesTryOn from "./pages/tryAr/GlassesTryOn";
import EducationalContent from "./pages/educationalContent/EducationalContent";
import ProtectedRouteUserAdmin from "./routes/ProtectedRouteUserAdmin";
import ProtectedRouteUser from "./routes/ProtectedRouteUser";
import ProtectedRouteDoctor from "./routes/ProtectedRouteDoctor";
import AdmenProfile from "./pages/admin profile/AdminProfile";
import ProtectedRouteAdmin from "./routes/ProtectedRouteAdmen";
import MarketManage from "./pages/market manage/MarketManage";
import DoctorsManage from "./pages/doctors manage/DoctorsManage";
import EducationalContentManage from "./pages/educational content manage/EducationalContentManage";

function App() {
  const [checkoutPageKey, setCheckoutPageKey] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/checkout") {
      setCheckoutPageKey(false);
    }
  }, [location.pathname]);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<MainPage />}>
          <Route index element={<Home />} />

          <Route path="/home" element={<Home />} />

          {/* Client And Admin Routes */}

          <Route path="/educationalContent" element={<EducationalContent />} />

          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:id" element={<DoctorInfo />} />

          <Route path="/market" element={<Market />} />
          <Route path="/market/:id" element={<ProductInfo />} />

          {/* Client Routes */}
          <Route path="/" element={<ProtectedRouteUser />}>
            <Route path="/cart" element={<Cart setCheckoutPageKey={setCheckoutPageKey} />} />
            <Route
              path="/checkout"
              element={
                <CheckOutProtected checkoutPageKey={checkoutPageKey}>
                  <Checkout setCheckoutPageKey={setCheckoutPageKey} />
                </CheckOutProtected>
              }
            />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/appointment/:id" element={<Appointment />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="/" element={<ProtectedRouteUserAdmin />}>
            <Route path="/tryAr" element={<GlassesTryOn />} />
            <Route path="/tryAr/:id" element={<GlassesTryOn />} />
          </Route>

          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/diagnosis" element={<Detector />} />
          </Route>

          <Route path="/" element={<ProtectedRouteDoctor />}>
            <Route path="/doctorProfile" element={<DoctorProfile />} />
          </Route>

          <Route path="/" element={<ProtectedRouteAdmin />}>
            <Route path="/adminProfile" element={<AdmenProfile />} />
            <Route path="/market_management" element={<MarketManage />} />
            <Route path="/doctors_management" element={<DoctorsManage />} />
            <Route path="/educationalContent_management" element={<EducationalContentManage />} />
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/sign_up" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="*" element={<h1>Page Not Found :(</h1>} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
