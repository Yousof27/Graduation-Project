import { useState, useEffect } from "react";
import styles from "./aboutDoctor.module.css";
import { useDoctorById, useUpdateDoctor } from "../../../redux/doctors/doctorsApis";
import image from "../../../assets/arafa2.jpg";
import { useDoctorsAppointments } from "../../../redux/appointments/appointmentApis";

const PersonalInformation = ({ doctorId }) => {
  const { data: doctor, isLoading, isError } = useDoctorById(doctorId);
  const updateDoctorMutation = useUpdateDoctor();
const appointmentsQuery = useDoctorsAppointments(doctorId);
const appointments = appointmentsQuery?.data || [];

const completedAppointmentsCount = appointments.filter(
  (appointment) => appointment.status === 'completed'
).length;



  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    specialty: "",
    phone: "",
    clinicLocation: "",
    bio: "",
    availableHours: "",
    availableTimes: {},
  });
  const [tempFormData, setTempFormData] = useState(formData);
  const [newDay, setNewDay] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newSlot, setNewSlot] = useState("");

  // Synchronize formData with doctor data
  useEffect(() => {
    if (doctor) {
      const newFormData = {
        fullname: doctor.fullname || "",
        specialty: doctor.specialty || "",
        email: doctor.email || "",
        phone: doctor.phone || "",
        clinicLocation: doctor.clinicLocation || "",
        bio: doctor.bio || "",
        availableHours: doctor.availableHours || "",
        availableTimes: doctor.availableTimes || {},
      };
      setFormData(newFormData);
      setTempFormData(newFormData);
    }
  }, [doctor]);

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

  const handleAvailableTimesChange = (day, timeIndex, field, value) => {
    setTempFormData((prev) => ({
      ...prev,
      availableTimes: {
        ...prev.availableTimes,
        [day]: prev.availableTimes[day]
          ? prev.availableTimes[day].map((time, index) =>
              index === timeIndex ? { ...time, [field]: value } : time
            )
          : [{ [field]: value }],
      },
    }));
  };

  const handleAddDay = () => {
    if (newDay && newTime && newSlot) {
      setTempFormData((prev) => ({
        ...prev,
        availableTimes: {
          ...prev.availableTimes,
          [newDay]: [...(prev.availableTimes[newDay] || []), { time: newTime, slot: newSlot }],
        },
      }));
      setNewDay("");
      setNewTime("");
      setNewSlot("");
    }
  };

  const handleAddTimeSlot = (day) => {
    setTempFormData((prev) => ({
      ...prev,
      availableTimes: {
        ...prev.availableTimes,
        [day]: [...(prev.availableTimes[day] || []), { time: "", slot: "" }],
      },
    }));
  };

  const handleSave = () => {
    updateDoctorMutation.mutate(
      { id: doctorId, doctorData: tempFormData },
      {
        onSuccess: () => {
          setFormData(tempFormData);
          setIsEditing(false);
        },
        onError: (error) => {
          console.error("Update failed:", error);
        },
      }
    );
  };

  const handleCancel = () => {
    setTempFormData(formData);
    setIsEditing(false);
    setNewDay("");
    setNewTime("");
    setNewSlot("");
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading doctor data</div>;

  return (
    <div className={styles.container}>
      <div className={styles.mainSection}>
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarContainer}>
              <img src={image} alt="Profile" loading="lazy" className={styles.avatar} />
            </div>
            <div className={styles.profileInfo}>
              <h3 className={styles.profileName}>{formData.fullname ? formData.fullname : "-"}</h3>
              <p className={styles.profileEmail}>{formData.email || "-"}</p>
              <p className={styles.profilePhone}>{formData.phone || "-"}</p>
              <div className={styles.badges}>
                <span className={styles.badge}>{formData.specialty || "-"}</span>
                <span className={`${styles.badge} ${styles.badgeActive}`}>{formData.clinicLocation || "-"}</span>
              </div>
              {isEditing ? (
                <div className={styles.editButtons}>
                  <button className={styles.saveBtn} onClick={handleSave} disabled={updateDoctorMutation.isLoading}>
                    <i className="fas fa-save"></i> {updateDoctorMutation.isLoading ? "Saving..." : "Save"}
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
              <div className={styles.statNumber}>{completedAppointmentsCount || "0+"}</div>
              <div className={styles.statLabel}>Patients</div>
              <div className={styles.statIcon}>
                <i className="fas fa-user-injured"></i>
              </div>
            </div>
            <div className={`${styles.statCard} ${styles.statIndigo}`}>
              <div className={styles.statNumber}>{doctor.experience || "0+"}</div>
              <div className={styles.statLabel}>Experience</div>
              <div className={styles.statIcon}>
                <i className="fas fa-briefcase"></i>
              </div>
            </div>
            <div className={`${styles.statCard} ${styles.statAmber}`}>
              <div className={styles.statNumber}>{doctor.rating || "0"}</div>
              <div className={styles.statLabel}>Rating</div>
              <div className={styles.statIcon}>
                <i className="fas fa-star"></i>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Personal Information</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoField}>
              <label className={styles.fieldLabel}>Full Name</label>
              {isEditing ? (
                <input type="text" name="fullname" value={tempFormData.fullname} onChange={handleInputChange} className={styles.input} />
              ) : (
                <div className={styles.fieldValue}>{formData.fullname || "-"}</div>
              )}
            </div>
            <div className={styles.infoField}>
              <label className={styles.fieldLabel}>Specialty</label>
              {isEditing ? (
                <input type="text" name="specialty" value={tempFormData.specialty} onChange={handleInputChange} className={styles.input} />
              ) : (
                <div className={styles.fieldValue}>{formData.specialty || "-"}</div>
              )}
            </div>
            <div className={styles.infoField}>
              <label className={styles.fieldLabel}>Phone</label>
              {isEditing ? (
                <input type="tel" name="phone" value={tempFormData.phone} onChange={handleInputChange} className={styles.input} />
              ) : (
                <div className={styles.fieldValue}>{formData.phone || "-"}</div>
              )}
            </div>
            <div className={styles.infoField}>
              <label className={styles.fieldLabel}>Clinic Location</label>
              {isEditing ? (
                <input type="text" name="clinicLocation" value={tempFormData.clinicLocation} onChange={handleInputChange} className={styles.input} />
              ) : (
                <div className={styles.fieldValue}>{formData.clinicLocation || "-"}</div>
              )}
            </div>
            <div className={`${styles.infoField} ${styles.fullWidth}`}>
              <label className={styles.fieldLabel}>Bio</label>
              {isEditing ? (
                <textarea name="bio" value={tempFormData.bio} onChange={handleInputChange} className={styles.textarea} rows="3" />
              ) : (
                <div className={styles.fieldValue}>{formData.bio || "-"}</div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Availability Information</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoField}>
              <label className={styles.fieldLabel}>Available Hours</label>
              {isEditing ? (
                <input
                  type="text"
                  name="availableHours"
                  value={tempFormData.availableHours}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              ) : (
                <div className={styles.fieldValue}>{formData.availableHours || "-"}</div>
              )}
            </div>
            {Object.entries(tempFormData.availableTimes).map(([day, times]) => (
              <div key={day} className={`${styles.infoField} ${styles.fullWidth}`}>
                <label className={styles.fieldLabel}>{day} Availability</label>
                {isEditing ? (
                  <div className={styles.timeSlots}>
                    {times.map((time, index) => (
                      <div key={index} className={styles.timeSlot}>
                        <input
                          type="text"
                          value={time.time}
                          onChange={(e) => handleAvailableTimesChange(day, index, "time", e.target.value)}
                          className={styles.input}
                          placeholder="Time"
                        />
                        <input
                          type="text"
                          value={time.slot}
                          onChange={(e) => handleAvailableTimesChange(day, index, "slot", e.target.value)}
                          className={styles.input}
                          placeholder="Slot"
                        />
                      </div>
                    ))}
                    <button
                      className={styles.addBtn}
                      onClick={() => handleAddTimeSlot(day)}
                    >
                      Add Time Slot
                    </button>
                  </div>
                ) : (
                  <div className={styles.fieldValue}>
                    {times.length > 0 ? (
                      times.map((time, index) => (
                        <div key={index}>{`${time.time} - ${time.slot}`}</div>
                      ))
                    ) : (
                      "-"
                    )}
                  </div>
                )}
              </div>
            ))}
            {isEditing && (
              <div className={`${styles.infoField} ${styles.fullWidth}`}>
                <label className={styles.fieldLabel}>Add New Day</label>
                <div className={styles.timeSlots}>
                  <input
                    type="text"
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value)}
                    className={styles.input}
                    placeholder="Day (e.g., Monday)"
                  />
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className={styles.input}
                    placeholder="Time (e.g., 10 AM)"
                  />
                  <input
                    type="text"
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    className={styles.input}
                    placeholder="Slot (e.g., Slot 1)"
                  />
                  <button className={styles.addBtn} onClick={handleAddDay}>
                    Add Day
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;