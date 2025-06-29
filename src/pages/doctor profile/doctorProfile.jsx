import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PersonalInformation from "./PersonalInformation/aboutDoctor";
import DiagnosisRecords from "./DiagnosisRecords/DiagnosisRecords";
import Appointments from "./Appointments/Appointments";
import styles from "./doctorProfile.module.css";

import { logout } from "../../redux/auth/authSlice";

const DoctorProfile = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const authData = useSelector((state) => state.auth);
  const user = authData?.user || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showSection = (sectionId) => {
    setActiveSection(sectionId);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <i className="fas fa-eye"></i>
          </div>
          <h1 className={styles.brandName}>Eyecare Hub</h1>
        </div>
        <nav className={styles.nav}>
          <button className={`${styles.sidebarBtn} ${activeSection === "profile" ? styles.active : ""}`} onClick={() => showSection("profile")}>
            <i className="fas fa-user-circle"></i>
            <span className={styles.btnText}>About</span>
          </button>
          <button
            className={`${styles.sidebarBtn} ${activeSection === "medical-records" ? styles.active : ""}`}
            onClick={() => showSection("medical-records")}
          >
            <i className="fas fa-file-medical"></i>
            <span className={styles.btnText}>Diagnosis Records</span>
          </button>
          <button
            className={`${styles.sidebarBtn} ${activeSection === "appointments" ? styles.active : ""}`}
            onClick={() => showSection("appointments")}
          >
            <i className="fas fa-calendar-check"></i>
            <span className={styles.btnText}>My Appointments</span>
          </button>
          <button className={`${styles.sidebarBtn} ${styles.logoutBtn}`} onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span className={styles.btnText}>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.headerTitle}>{authData?.isAuthenticated ? `${user.fullname}'s Profile` : "Patient Profile"}</h2>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className={styles.contentArea}>
          {(() => {
            switch (activeSection) {
              case "profile":
                return <PersonalInformation doctorId={user?.id} />;
              case "medical-records":
                return <DiagnosisRecords />;
              case "appointments":
                return <Appointments doctorId={user?.id} />;
              default:
                return <PersonalInformation />;
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
