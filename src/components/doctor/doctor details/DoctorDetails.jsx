import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./doctorDetails.module.css";
import { FiCalendar, FiClock, FiMail, FiMapPin, FiPhone, FiStar, FiAward, FiUsers } from "react-icons/fi";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const DoctorDetails = ({ doctor, appointmentCount }) => {
  const doctorData = doctor;
  // console.log(doctorData);
  const navigate = useNavigate();

  const userRole = useSelector((state) => state?.auth?.user?.role);
  const roleCheck = userRole === "client" || !userRole;
  // Handle navigation to appointment page
  const handleScheduleAppointment = () => {
    if (doctorData?.id && userRole === "client") {
      navigate(`/appointment/${doctorData.id}`);
    } else {
      navigate("/login");
      toast.info("Please Login First");
    }
  };

  // Generate Google Maps URL
  const getGoogleMapsUrl = (location) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  };

  // Generate mailto URL
  const getMailtoUrl = (email) => {
    return `mailto:${email}?subject=Appointment%20Inquiry`;
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.profileImageWrapper}>
            <div className={styles.profileImage}>
              <img src={doctorData.profileImage} alt={doctorData.fullname} loading="lazy" className={styles.image} />
            </div>
            <div className={styles.availabilityBadge}>
              <div className={styles.availabilityIndicator}></div>
              Available
            </div>
          </div>

          <div className={styles.doctorInfo}>
            <h1 className={styles.doctorName}>{doctorData.fullname}</h1>
            <p className={styles.specialty}>{doctorData.specialty}</p>

            <div className={styles.statsWrapper}>
              <div className={styles.stat}>
                <FiAward className={styles.statIconExperience} />
                <span className={styles.statText}>{doctorData.experience || "15+ Years"}</span>
              </div>
              <div className={styles.stat}>
                <FiUsers className={styles.statIconPatients} />
                <span className={styles.statText}>{appointmentCount || "0"} Appointment</span>
              </div>
              <div className={styles.stat}>
                <FiStar className={styles.statIconRating} />
                <span className={styles.statText}>{`${doctorData.rating || "0"}`} Rating</span>
              </div>
            </div>

            <p className={styles.bio}>{doctorData.bio}</p>

            {
              <div className={styles.buttonWrapper}>
                {userRole === "admin" ? (
                  <button className={styles.bookButton} onClick={() => navigate("/doctors_management")}>
                    Back To Doctors
                  </button>
                ) : (
                  roleCheck && (
                    <button className={styles.bookButton} onClick={handleScheduleAppointment}>
                      Book Appointment
                    </button>
                  )
                )}
              </div>
            }
          </div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className={styles.infoGrid}>
        {/* Contact Info Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            <div className={styles.cardIconWrapper}>
              <FiPhone className={styles.cardIconPhone} />
            </div>
            Contact Information
          </h3>
          <div className={styles.cardContent}>
            <div className={styles.contactItem}>
              <FiMapPin className={styles.contactIconLocation} />
              <span>{doctorData.clinicLocation}</span>
            </div>
            <div className={styles.contactItem}>
              <FiMail className={styles.contactIconEmail} />
              <span>{doctorData.email}</span>
            </div>
            <div className={styles.contactItem}>
              <FiPhone className={styles.cardIconPhone} />
              <span>{doctorData.phone}</span>
            </div>
          </div>
        </div>

        {/* Schedule Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            <div className={styles.cardIconWrapperGreen}>
              <FiCalendar className={styles.cardIconCalendar} />
            </div>
            Schedule
          </h3>
          <div className={styles.cardContent}>
            <div className={styles.scheduleItem}>
              <FiCalendar className={styles.scheduleIconDays} />
              <div>
                <p className={styles.scheduleLabel}>Available Days</p>
                <p>{doctorData.availableDays.join(", ")}</p>
              </div>
            </div>
            <div className={styles.scheduleItem}>
              <FiClock className={styles.scheduleIconHours} />
              <div>
                <p className={styles.scheduleLabel}>Working Hours</p>
                <p>{doctorData.availableHours}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links Card */}
        <div className={styles.socialCard}>
          <h3 className={styles.cardTitle}>Connect With Me</h3>
          <div className={styles.socialLinks}>
            {doctorData.socialLinks.facebook && (
              <a href={doctorData.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialLinkFacebook}>
                <FaFacebook className={styles.socialIconFacebook} />
              </a>
            )}
            {doctorData.socialLinks.twitter && (
              <a href={doctorData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialLinkTwitter}>
                <FaTwitter className={styles.socialIconTwitter} />
              </a>
            )}
            {doctorData.socialLinks?.linkedin && (
              <a href={doctorData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLinkLinkedin}>
                <FaLinkedin className={styles.socialIconLinkedin} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActionsCard}>
        <h3 className={styles.cardTitle}>Quick Actions</h3>
        <div className={styles.quickActionsGrid}>
          {roleCheck && (
            <button className={styles.quickActionButton} onClick={handleScheduleAppointment}>
              <FiCalendar className={styles.quickActionIconCalendar} />
              <span className={styles.quickActionText}>Schedule Appointment</span>
            </button>
          )}
          <a
            href={doctorData?.email ? getMailtoUrl(doctorData.email) : "#"}
            className={styles.quickActionButton}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FiMail className={styles.quickActionIconEmail} />
            <span className={styles.quickActionText}>Send Email</span>
          </a>
          <a
            href={doctorData?.clinicLocation ? getGoogleMapsUrl(doctorData.clinicLocation) : "#"}
            className={styles.quickActionButton}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FiMapPin className={styles.quickActionIconLocation} />
            <span className={styles.quickActionText}>Get Directions</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
