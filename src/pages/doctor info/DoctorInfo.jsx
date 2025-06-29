import { Navigate, useParams } from "react-router-dom";
import { useDoctorById } from "../../redux/doctors/doctorsApis";
import DoctorDetails from "../../components/doctor/doctor details/DoctorDetails";
import styles from "./doctorInfo.module.css";
import PostReviewCon from "../../components/doctor/posts and reviews container/PostReviewCon";
import Review from "../../components/doctor/review/Review";
import { useDoctorsAppointments } from "../../redux/appointments/appointmentApis";
const DoctorInfoPage = () => {
  const { id } = useParams();
  const doctor = useDoctorById(id);
  const appointmentsQuery = useDoctorsAppointments(id);
  const appointments = appointmentsQuery?.data || [];

  if (doctor.isPending)
    return (
      <h1 className="isLoading">
        <span className="spinner pageLoader"></span>
      </h1>
    );
  if (doctor.isError || !doctor.data) return <h2>Doctor not found</h2>;

  return (
    <>
      <main className={styles.main}>
        <h1 className={styles.title}>Doctor's Information</h1>
        <div className={`container ${styles.container}`}>
          <div className={`${styles.doctorDetailsContainer}`}>
            <DoctorDetails doctor={doctor?.data} appointmentCount={appointments.length} />
          </div>

          <div className={`${styles.doctorReviewsContainer}`}>
            <PostReviewCon title="Doctor's Reviews" data={doctor?.data.reviews || []} Component={Review} type="review" />
          </div>
        </div>
      </main>
    </>
  );
};

export default DoctorInfoPage;
