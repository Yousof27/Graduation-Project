import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaCalendarAlt, FaUser, FaPhone, FaClipboardList, FaClock, FaUserMd, FaStar, FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";
import { useDoctors } from "../../redux/doctors/doctorsApis";
import { useParams } from "react-router-dom";
import { successMessage } from "../../redux/toasts";
import { AppointmentOperationsApi } from "../../redux/auth/authApis";
import axios from "axios";
import styles from "./appointment.module.css";

const MedicalAppointmentBooking = () => {
  const doctorsQuery = useDoctors();
  const doctorId = useParams("id").id;
  const [existsAppointments, setAppointments_for_mostafa] = useState([]);

  useEffect(() => {
    const getAppointments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/appointments");
        setAppointments_for_mostafa(res.data.filter((ap) => ["Pending", "Approved"].includes(ap.status)));
      } catch (error) {
        console.log(error);
      }
    };
    getAppointments();
  }, []);

  const dispatch = useDispatch();

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentFor, setAppointmentFor] = useState("me");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState({});

  // Get user data from Redux store
  const currentUser = useSelector((state) => state?.auth?.user);

  // Helper function to convert available times
  const convertAvailableTimes = (availableTimes) => {
    const timeSlots = {};
    const today = new Date();

    const formatDate = (date) => `${date.getMonth() + 1}/${date.getDate()}`;

    const getDayName = (date) => {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return days[date.getDay()];
    };

    for (let i = 0; i < 14; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      const dayName = getDayName(currentDate);
      const formattedDate = formatDate(currentDate);
      const formattedKey = `${formattedDate} ${dayName}`;

      if (availableTimes[dayName]) {
        if (!timeSlots[formattedKey]) {
          timeSlots[formattedKey] = [];
        }
        timeSlots[formattedKey] = timeSlots[formattedKey].concat(
          availableTimes[dayName].map((slot) => ({
            ...slot,
            date: formattedDate,
            day: dayName,
          }))
        );
      }
    }
    return timeSlots;
  };

  // Function to get booked dates for the selected doctor
  const getBookedDates = (doctorId) => {
    return existsAppointments
      .filter((ap) => ap.doctorId === doctorId && ap.patientId !== currentUser?.id && ["Pending", "Approved"].includes(ap.status))
      .map((ap) => `${ap.date} ${ap.day}`)
      .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
  };

  // Fetch doctors from API
  useEffect(() => {
    setDoctors(doctorsQuery?.data);

    const doctorsList = doctorsQuery?.data || [];

    let doc;

    if (doctorId && doctorsList.length > 0) {
      doc = doctorsList.find((d) => d.id === doctorId);
    } else if (doctorsList.length > 0) {
      doc = doctorsList[0] || {};
    }

    setSelectedDoctor(doc);
  }, [doctorId, doctorsQuery?.data]);

  // Update available slots when doctor changes
  useEffect(() => {
    if (selectedDoctor) {
      const slots = convertAvailableTimes(selectedDoctor?.availableTimes);
      setAvailableSlots(slots);
      const firstDate = Object.keys(slots)[0];
      setSelectedDate(firstDate || "");
      setSelectedTime("");
    }
  }, [selectedDoctor]);

  const initialValues = {
    fullName: currentUser?.username || "",
    age: currentUser?.age || "",
    phone: currentUser?.phoneNumber || "",
    symptoms: "",
  };

  // Formik form configuration
  const validationSchema = Yup.object({
    fullName: Yup.string().min(2, "Name must be at least 2 characters").required("Full name is required"),
    age: Yup.number().min(1, "Age must be at least 1").max(120, "Age must be less than 120").required("Age is required"),
    phone: Yup.string()
      .matches(/^[0-9+\-\s()]+$/, "Invalid phone number format")
      .min(10, "Phone number must be at least 10 digits")
      .required("Phone number is required"),
    symptoms: Yup.string().min(10, "Please provide more details about your symptoms").required("Symptoms description is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      handleBookAppointment(values);
    },
  });

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    const doctor = doctors.find((d) => d.id === doctorId);
    setSelectedDoctor(doctor);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime("");
  };

  const bookAppointmentHandler = (data) => dispatch(AppointmentOperationsApi(data));

  const handleBookAppointment = (patientData) => {
    if (!selectedTime || !selectedDate) {
      alert("Please select a date and time slot");
      return;
    }

    const appointmentData = {
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.fullname,
      patientId: currentUser.id,
      patientName: currentUser.username,
      symptoms: patientData.symptoms,
      appointmentFor,
      day: selectedDate.split(" ")[1],
      date: selectedDate.split(" ")[0],
      time: selectedTime,
      timestamp: new Date().toISOString(),
      status: "Pending",
    };

    bookAppointmentHandler({ operation: "add", data: appointmentData });
    // Update local appointments state immediately
    setAppointments_for_mostafa((prev) => [...prev, appointmentData]);
    dispatch(successMessage("Appointment booked successfully!"));
    setSelectedTime("");
    formik.resetForm({
      values: {
        fullName: currentUser?.username || "",
        age: currentUser?.age || "",
        phone: currentUser?.phoneNumber || "",
        symptoms: "",
      },
    });

    console.log("Booked successfully :)", appointmentData);
  };

  // Updated function to check booking status
  const getBookingStatus = (time) => {
    const selectedPeriod = `${time} ${selectedDate}`;
    const existingAppointment = existsAppointments.find(
      (ap) => `${ap.time} ${ap.date} ${ap.day}` === selectedPeriod && ap.doctorId === selectedDoctor?.id
    );

    if (existingAppointment) {
      return existingAppointment.patientId === currentUser?.id ? "booked-by-current-user" : "booked-by-others";
    }
    return "available";
  };

  if (doctorsQuery.isLoading) {
    return (
      <div className={styles.container}>
        <div className="flex items-center justify-center h-64">
          <div className={styles.loadingSpinner}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>
          <FaCalendarAlt className={styles.headerIcon} />
          Medical Appointment Booking
        </h1>
        <p className={styles.headerSubtitle}>Book your appointment with our experienced doctors</p>
      </div>

      {/* Doctor Selector */}
      <div className={styles.doctorSelector}>
        <label className={styles.selectorLabel}>
          <FaUserMd />
          Select a Doctor
        </label>
        <div className={styles.selectWrapper}>
          <select className={styles.select} value={selectedDoctor?.id || ""} onChange={handleDoctorChange}>
            {doctors?.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.fullname} - {doctor.specialty}
              </option>
            ))}
          </select>
          <FaChevronDown className={styles.selectIcon} />
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Left Panel */}
        <div className={styles.leftPanel}>
          {/* Doctor Card */}
          {selectedDoctor && (
            <div className={styles.card}>
              <div className={styles.doctorCard}>
                <div className={styles.doctorImage}>{(selectedDate && selectedDoctor?.fullname.split(" ")[1]?.[0]) || "D"}</div>
                <div className={styles.doctorInfo}>
                  <h3 className={styles.doctorName}>{selectedDoctor.fullname}</h3>
                  <p className={styles.doctorSpecialty}>{selectedDoctor.specialty}</p>
                  <div className={styles.doctorMeta}>
                    <span className="flex items-center gap-1">
                      <FaStar /> {selectedDoctor.ratings}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaMapMarkerAlt /> {selectedDoctor.clinicLocation}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appointment For */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <FaUser />
              Appointment For
            </h3>
            <div className={styles.appointmentTabs}>
              <button
                className={`${styles.tabButton} ${appointmentFor === "me" ? styles.tabActive : styles.tabInactive}`}
                onClick={() => {
                  setAppointmentFor("me");
                  formik.resetForm({
                    values: {
                      fullName: currentUser?.username || "",
                      age: currentUser?.age || "",
                      phone: currentUser?.phoneNumber || "",
                      symptoms: "",
                    },
                  });
                }}
              >
                For Me
              </button>
              <button
                className={`${styles.tabButton} ${appointmentFor === "other" ? styles.tabActive : styles.tabInactive}`}
                onClick={() => {
                  setAppointmentFor("other");
                  formik.resetForm({
                    values: {
                      fullName: "",
                      age: "",
                      phone: "",
                      symptoms: "",
                    },
                  });
                }}
              >
                Other Person
              </button>
            </div>
          </div>

          {/* Patient Information Form */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <FaClipboardList />
              Patient Information
            </h3>

            <form onSubmit={formik.handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <FaUser />
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  className={`${styles.input} ${formik.touched.fullName && formik.errors.fullName ? styles.inputError : ""}`}
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter full name"
                  disabled={appointmentFor === "me"}
                />
                {formik.touched.fullName && formik.errors.fullName && <div className={styles.errorText}>{formik.errors.fullName}</div>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <FaCalendarAlt />
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  className={`${styles.input} ${formik.touched.age && formik.errors.age ? styles.inputError : ""}`}
                  value={formik.values.age}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter age"
                  disabled={appointmentFor === "me"}
                />
                {formik.touched.age && formik.errors.age && <div className={styles.errorText}>{formik.errors.age}</div>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <FaPhone />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  className={`${styles.input} ${formik.touched.phone && formik.errors.phone ? styles.inputError : ""}`}
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter phone number"
                  disabled={appointmentFor === "me"}
                />
                {formik.touched.phone && formik.errors.phone && <div className={styles.errorText}>{formik.errors.phone}</div>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <FaClipboardList />
                  Symptoms Description
                </label>
                <textarea
                  name="symptoms"
                  className={`${styles.textarea} ${formik.touched.symptoms && formik.errors.symptoms ? styles.inputError : ""}`}
                  value={formik.values.symptoms}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Describe your symptoms in detail..."
                />
                {formik.touched.symptoms && formik.errors.symptoms && <div className={styles.errorText}>{formik.errors.symptoms}</div>}
              </div>
            </form>
          </div>
        </div>

        {/* Right Panel - Appointment Details */}
        <div className={styles.rightPanel}>
          <div className={styles.appointmentCard}>
            <div className={styles.appointmentHeader}>
              <h3 className={styles.appointmentTitle}>
                <FaCalendarAlt />
                Appointment Details
              </h3>
            </div>

            <div className={styles.appointmentBody}>
              {/* Available Dates */}
              {Object.keys(availableSlots).length > 0 ? (
                <>
                  {/* Date Dropdown */}
                  <div className={styles.dateDropdownWrapper}>
                    <label className={styles.dateDropdownLabel}>
                      <FaCalendarAlt />
                      Select Date
                    </label>
                    <div className="relative">
                      <select className={styles.dateDropdown} value={selectedDate} onChange={handleDateChange}>
                        <option value="">Choose a date</option>
                        {Object.keys(availableSlots).map((dateKey) => {
                          const isBooked = selectedDoctor && getBookedDates(selectedDoctor.id).includes(dateKey);
                          return (
                            <option key={dateKey} value={dateKey} className={isBooked ? styles.dateOptionBooked : ""}>
                              {dateKey}
                            </option>
                          );
                        })}
                      </select>
                      <FaChevronDown className={styles.dateDropdownIcon} />
                    </div>
                  </div>

                  {/* Time Slots */}
                  {selectedDate && availableSlots[selectedDate] && (
                    <div className={styles.timeGrid}>
                      {availableSlots[selectedDate].map((timeSlot, index) => {
                        const bookingStatus = getBookingStatus(timeSlot.time);
                        const isDisabled = bookingStatus !== "available";

                        return (
                          <div
                            key={index}
                            className={`${styles.timeSlot} 
                              ${selectedTime === timeSlot.time ? styles.timeSlotSelected : ""}
                              ${bookingStatus === "booked-by-current-user" ? styles.timeSlotBookedByCurrentUser : ""}
                              ${bookingStatus === "booked-by-others" ? styles.timeSlotBookedByOthers : ""}`}
                            onClick={() => {
                              if (!isDisabled) {
                                setSelectedTime(timeSlot.time);
                              }
                            }}
                          >
                            <div className={styles.timeSlotTime}>{timeSlot.time}</div>
                            <div className={styles.timeSlotLabel}>
                              {bookingStatus === "booked-by-current-user"
                                ? "Your Booking"
                                : bookingStatus === "booked-by-others"
                                ? "Booked"
                                : timeSlot.slot}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.noData}>
                  <FaClock className="mx-auto mb-2 text-gray-400" size={32} />
                  <p>No available slots</p>
                </div>
              )}

              {/* Book Appointment Button */}
              <button className={styles.bookButton} type="submit" onClick={formik.handleSubmit} disabled={!selectedTime || !selectedDate}>
                <FaCalendarAlt />
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalAppointmentBooking;
