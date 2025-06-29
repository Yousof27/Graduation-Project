import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.svg";
import styles from "./header.module.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/auth/authSlice";
import { MdKeyboardArrowDown } from "react-icons/md";

function Header() {
  const [activeMenu, setActiveMenu] = useState(false);
  const [activeCart, setActiveCart] = useState(false);
  const [activeAuthMenu, setActiveAuthMenu] = useState(false);

  const navigate = useNavigate();

  const toggleMenu = () => {
    setActiveMenu((prev) => !prev);
    setActiveCart(false);
    setActiveAuthMenu(false);
  };
  const toggleCart = () => {
    navigate("/cart");
  };
  const toggleAuthMenu = () => {
    setActiveAuthMenu((prev) => !prev);
    setActiveCart(false);
    setActiveMenu(false);
  };
  const toggleAll = () => {
    setActiveAuthMenu(false);
    setActiveCart(false);
    setActiveMenu(false);
  };

  const handleProfileButton = () => {
    toggleAll();
    switch (authData?.user?.role) {
      case "client":
        navigate("/profile");
        break;
      case "doctor":
        navigate("/doctorProfile");
        break;
      case "admin":
        navigate("/adminProfile");
        break;
    }
  };

  const cartData = useSelector((state) => state.auth?.user?.cartInfo);
  const authData = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  let roleCheck = authData?.user?.role;
  if (typeof roleCheck === "undefined") {
    roleCheck = "gest";
  }
  // console.log(roleCheck);

  const navStyle = ({ isActive }) => (isActive ? `${styles.activeNavLink}` : "navLink");

  const logoutHandler = () => {
    setActiveMenu(false);
    dispatch(logout());
    navigate("/login");
  };

  const navLinks = [
    {
      path: "/appointment",
      label: "Appointment",
      icon: "📅",
      users: ["client"],
    },
    {
      path: `/${authData?.user?.role === "admin" ? "doctors_management" : "doctors"}`,
      label: "Doctors",
      icon: "🩺",
      users: ["client", "admin", "gest"],
    },
    {
      path: `/${authData?.user?.role === "admin" ? "market_management" : "market"}`,
      label: "Market",
      icon: "💊",
      users: ["client", "doctor", "admin", "gest"],
    },
    {
      path: `/${authData?.user?.role === "admin" ? "educationalContent_management" : "educationalContent"}`,
      label: "Educational Content",
      icon: "🚩",
      users: ["client", "admin", "gest"],
    },
    {
      path: "/diagnosis",
      label: "Diagnosis",
      icon: "🤖",
      users: ["client", "doctor"],
    },
    {
      path: "/tryAr",
      label: "Try AR",
      icon: "👓",
      users: ["client", "gest"],
    },
  ];

  return (
    <header className={`${styles.header}`}>
      <div onClick={toggleAll} className={`overlay ${activeMenu || activeCart || activeAuthMenu ? `active ${styles.active}` : ""}`}></div>
      <div className={`container ${styles.container} ${authData?.isAuthenticated ? styles.isAuth : ""}`}>
        <nav className={styles.nav}>
          <Link to="/home">
            <img src={logo} alt="logo" loading="lazy" className={styles.logo} onClick={toggleAll} />
          </Link>

          {/* line 134 */}
          <ul className={`${styles.headerList} ${activeMenu ? styles.active : ""}`}>
            {navLinks.map(
              (link, index) =>
                link.users.includes(roleCheck) && (
                  <li key={index}>
                    <NavLink to={link.path} onClick={toggleAll} className={navStyle}>
                      <span className={styles.navIcon}>{link.icon}</span> {link.label}
                    </NavLink>
                  </li>
                )
            )}
          </ul>

          <div className={styles.headerAuthContainer}>
            {authData?.isAuthenticated && authData?.user?.role === "client" && (
              <div className={styles.headerCart}>
                <button onClick={toggleCart}>
                  <span className={styles.cartIconCon}>
                    🛒
                    <span className={styles.cartNum}>{cartData.cart.length}</span>
                  </span>{" "}
                  <span className={styles.label}>My Cart</span>
                </button>
              </div>
            )}

            <div className={styles.headerAuth}>
              <button onClick={toggleAuthMenu}>
                {authData?.isAuthenticated ? (
                  <span>
                    <span className={styles.label}>Hi</span> {authData.user.username || authData.user.fullname}
                  </span>
                ) : (
                  ` Account`
                )}{" "}
                <MdKeyboardArrowDown className={activeAuthMenu ? styles.up : ""} />
              </button>
              <ul className={`${styles.innerAuth} ${activeAuthMenu ? styles.active : ""}`}>
                {authData?.isAuthenticated ? (
                  <>
                    <li>
                      <button onClick={handleProfileButton}>👤 Profile</button>
                    </li>
                    <li>
                      <button onClick={logoutHandler}>🔒 Log Out</button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <button onClick={() => navigate("/login")}>🔑 Login</button>
                    </li>
                    <li>
                      <button onClick={() => navigate("/sign_up")}>📝 Sign Up</button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <button onClick={toggleMenu} className={`${styles.ul_icon} ${activeMenu ? styles.active : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
