import { useSelector } from "react-redux";
import { useRemoveAppointment, useUserAppointments } from "../../../redux/appointments/appointmentApis";
import styles from "./Appointments.module.css";

const Appointments = () => {
  const userId = useSelector((state) => state?.auth?.user?.id);
  const appointmentsQuery = useUserAppointments(userId);

  const { mutate: removeAppointment } = useRemoveAppointment();

  const appointments = appointmentsQuery?.data || [];

  // Function to get status class
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return styles.approved;
      case "rejected":
        return styles.rejected;
      case "pending":
        return styles.pending;
      case "completed":
        return styles.completed;
      default:
        return styles.pending;
    }
  };

  // Function to get status style class
  const getStatusStyleClass = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return styles.approvedStatus;
      case "rejected":
        return styles.rejectedStatus;
      case "pending":
        return styles.pendingStatus;
      case "completed":
        return styles.completedStatus;
      default:
        return styles.pendingStatus;
    }
  };

  // Function to format date and time
  const formatDateTime = (day, date, time) => {
    return `${day}, ${date} at ${time}`;
  };

  const handleCancleButton = (id) => {
    removeAppointment(id);
  };

  // Handle loading state
  if (appointmentsQuery.isLoading) {
    return (
      <div className={styles.appointments}>
        <div className={styles.sectionCard}>
          <div className={styles.header}>
            <div>
              <h3 className={styles.title}>Appointments</h3>
              <p className={styles.subtitle}>Loading appointments...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (appointmentsQuery.isError) {
    return (
      <div className={styles.appointments}>
        <div className={styles.sectionCard}>
          <div className={styles.header}>
            <div>
              <h3 className={styles.title}>Appointments</h3>
              <p className={styles.subtitle}>Error loading appointments</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.appointments}>
      <div className={styles.sectionCard}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Appointments</h3>
            <p className={styles.subtitle}>Upcoming and past appointments</p>
          </div>
        </div>

        <div className={styles.appointmentsList}>
          {appointments.length === 0 ? (
            <div className={styles.noAppointments}>
              <p>No appointments found.</p>
            </div>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment.id} className={`${styles.appointmentItem} ${getStatusClass(appointment.status)}`}>
                <div className={styles.appointmentContent}>
                  <div>
                    <h4 className={styles.doctorName}>{appointment.doctorName}</h4>
                    <div className={styles.appointmentTime}>
                      <i className="fas fa-clock"></i>
                      <span>{formatDateTime(appointment.day, appointment.date, appointment.time)}</span>
                    </div>
                    <p className={styles.appointmentDescription}>{appointment.symptoms || "General consultation"}</p>
                  </div>
                  <div className={styles.appointmentActions}>
                    <span className={`${styles.appointmentStatus} ${getStatusStyleClass(appointment.status)}`}>{appointment.status}</span>
                    {appointment.status?.toLowerCase() === "pending" && (
                      <button className={`${styles.cancelButton}`} onClick={() => handleCancleButton(appointment.id)}>
                        <i className="fas fa-times"></i>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
