import { useState, useEffect } from "react";
import styles from "./aboutDoctor.module.css";
import { useDoctors, useUsers } from "../../redux/doctors/doctorsApis";
import { useDispatch, useSelector } from "react-redux";
import { updateUserDataApi } from "../../redux/auth/authApis";
import image from "../../assets/Ashaf.png";

function getTotalBillsSum(users) {
  let total = 0;
  users.forEach((user) => {
    if (Array.isArray(user?.billsHistory)) {
      user.billsHistory.forEach((bill) => {
        if (typeof bill.totalPrice === "number") {
          total += bill.totalPrice;
        }
      });
    }
  });
  return total;
}

const PersonalInformation = () => {
  const authData = useSelector((state) => state?.auth?.user);

  const { data: doctors } = useDoctors();

  const [total, setTotal] = useState(0);

  const { data } = useUsers();

  useEffect(() => {
    if (data) {
      const theTotal = getTotalBillsSum(data);
      setTotal(theTotal);
    }
  }, [data]);

  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    age: 0,
    phoneNumber: "",
  });
  const [tempFormData, setTempFormData] = useState(formData);

  // Synchronize formData with doctor data
  useEffect(() => {
    if (authData) {
      const newFormData = {
        username: authData.username || "",
        email: authData.email || "",
        age: authData.age || 0,
        phoneNumber: authData.phoneNumber || "",
      };
      setFormData(newFormData);
      setTempFormData(newFormData);
    }
  }, [authData]);

  const handleEditClick = () => {
    setIsEditing(true);
    setTempFormData(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    dispatch(updateUserDataApi(tempFormData));
  };

  const handleCancel = () => {
    setTempFormData(formData);
    setIsEditing(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainSection}>
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarContainer}>
              <img src={image} alt="Profile" loading="lazy" className={styles.avatar} />
            </div>
            <div className={styles.profileInfo}>
              <h3 className={styles.profileName}>{formData.username ? formData.username : "-"}</h3>
              <p className={styles.profileEmail}>{formData.email || "-"}</p>
              <p className={styles.profilePhone}>{formData.phoneNumber || "-"}</p>
              <div className={styles.badges}>
                <span className={styles.badge}>{formData.specialty || "Admin"}</span>
              </div>
              {isEditing ? (
                <div className={styles.editButtons}>
                  <button className={styles.saveBtn} onClick={handleSave}>
                    <i className="fas fa-save"></i> Saved
                  </button>
                  <button className={styles.cancelBtn} onClick={handleCancel}>
                    <i className="fas fa-times"></i> Cancel
                  </button>
                </div>
              ) : (
                <button className={styles.editBtn} onClick={handleEditClick}>
                  <i className="fas fa-pen"></i> Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className={styles.statsGrid}>
            <div className={`${styles.statCard} ${styles.statBlue}`}>
              <div className={styles.statNumber}>{data?.length || "0+"}</div>
              <div className={styles.statLabel}>Clients</div>
              <div className={styles.statIcon}>
                <i className="fas fa-user"></i>
              </div>
            </div>
            <div className={`${styles.statCard} ${styles.statIndigo}`}>
              <div className={styles.statNumber}>{doctors?.length || "0+"}</div>
              <div className={styles.statLabel}>Doctors</div>
              <div className={styles.statIcon}>
                <i className="fas fa-briefcase"></i>
              </div>
            </div>
            <div className={`${styles.statCard} ${styles.statAmber}`}>
              <div className={styles.statNumber}>{total || "0"}</div>
              <div className={styles.statLabel}>Income</div>
              <div className={styles.statIcon}>
                <i className="fas fa-star"></i>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Professional Information</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoField}>
              <label className={styles.fieldLabel}>Full Name</label>
              {isEditing ? (
                <input type="text" name="fullname" value={tempFormData.username} onChange={handleInputChange} className={styles.input} />
              ) : (
                <div className={styles.fieldValue}>{formData.username || "-"}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
