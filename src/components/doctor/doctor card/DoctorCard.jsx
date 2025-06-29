import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import styles from "./doctorCard.module.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function DoctorCard({ data, children }) {
  const { id, profileImage, fullname, specialty, clinicLocation, rating, availableDays, bio, socialLinks } = data;

  const userRole = useSelector((state) => state?.auth?.user?.role);

  const navigate = useNavigate();

  const bookAppointmentHandler = (e) => {
    e.stopPropagation();
    navigate(`/appointment/${id}`);
  };

  const moreInfoHandler = () => {
    navigate(`/doctors/${id}`);
  };

  const handleBookAppointmentButton = (e) => {
    e.stopPropagation();
    if (userRole === "client") {
      bookAppointmentHandler(e);
    } else if (["admin", "doctor"].includes(userRole)) {
      moreInfoHandler();
    } else {
      navigate("/login");
      toast.info("Please Login First");
    }
  };

  return (
    <div className={styles.card} onClick={moreInfoHandler}>
      <div className={styles.imgCon}>
        <img src={profileImage} alt={fullname} loading="lazy" className={styles.image} />
      </div>
      <div className={styles.content}>
        <h2 className={styles.name}>{fullname}</h2>
        <p className={styles.specialty}>{specialty}</p>
        <p className={styles.location}>{clinicLocation}</p>
        <p className={styles.rating}>⭐ {rating || "0"}</p>
        <p className={styles.days}>
          <strong>Available:</strong> {availableDays.join(", ")}
        </p>
        <p className={styles.bio}>{bio.slice(0, 100)}...</p>
        <div className={styles.last}>
          <div className={styles.social}>
            {socialLinks.facebook && (
              <a className={styles.facebook} href={socialLinks.facebook} target="_blank" rel="noreferrer">
                <FaFacebookF />
              </a>
            )}
            {socialLinks.twitter && (
              <a className={styles.twitter} href={socialLinks.twitter} target="_blank" rel="noreferrer">
                <FaTwitter />
              </a>
            )}
            {socialLinks.linkedin && (
              <a className={styles.linkedin} href={socialLinks.linkedin} target="_blank" rel="noreferrer">
                <FaLinkedinIn />
              </a>
            )}
          </div>
          {userRole === "admin" ? (
            children
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBookAppointmentButton(e);
              }}
              className={styles.button}
            >
              {userRole === "client" || !userRole ? "Book Appointment" : "More Details"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorCard;
