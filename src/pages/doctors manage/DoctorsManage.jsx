import { useState } from "react";
import styles from "./doctorsManage.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { successMessage } from "../../redux/toasts";
import { useAddDoctor, useDeleteDoctor, useDoctors, useUpdateDoctor } from "../../redux/doctors/doctorsApis";
import DoctorCard from "../../components/doctor/doctor card/DoctorCard";

const validationSchema = Yup.object({
  fullname: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  specialty: Yup.string().required("Specialty is required"),
  phone: Yup.string().required("Phone is required"),
  profileImage: Yup.string().required("Profile Image is required"),
  bio: Yup.string().required("Bio is required"),
  clinicLocation: Yup.string().required("Clinic Location is required"),
  availableDays: Yup.string().min(1, "At least one day is required").required("Available Days are required"),
  availableHours: Yup.string().required("Available Hours are required"),
});

const DoctorsManage = () => {
  const { data: doctors = [], isLoading, error, refetch } = useDoctors();
  const addDoctorMutation = useAddDoctor();
  const updateDoctorMutation = useUpdateDoctor();
  const deleteDoctorMutation = useDeleteDoctor();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenModal = (doctor = null) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDoctor(null);
    setIsModalOpen(false);
  };

  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFieldValue("profileImage", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const doctorData = {
        ...values,
        availableDays: values.availableDays.split(",").map((day) => day.trim()),
        role: "doctor",
        password: selectedDoctor?.password || "123456", // Preserve or set default password
        ratings: selectedDoctor?.ratings || 0,
        availableTimes: selectedDoctor?.availableTimes || {},
        socialLinks: values.socialLinks || {},
        patients: selectedDoctor?.patients || "0+",
        experience: values.experience || "0+ Years",
        reviews: selectedDoctor?.reviews || [],
        diagnosis: selectedDoctor?.diagnosis || [],
      };
      if (selectedDoctor) {
        await updateDoctorMutation.mutateAsync({ id: selectedDoctor.id, doctorData });
        successMessage("Doctor updated successfully");
      } else {
        await addDoctorMutation.mutateAsync(doctorData);
        successMessage("Doctor added successfully");
      }
      resetForm();
      handleCloseModal();
      refetch();
    } catch (err) {
      console.error("Error submitting doctor:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoctorMutation.mutateAsync(id);
      successMessage("Doctor deleted successfully");
      refetch();
    } catch (err) {
      console.error("Error deleting doctor:", err);
    }
  };

  const filteredDoctors = doctors.filter(
    (doctor) => doctor.fullname.toLowerCase().includes(searchQuery.toLowerCase()) || doctor.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.mainSection}>
        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Doctors Management</h3>
          <div className={styles.controls}>
            <input
              type="text"
              placeholder="Search doctors..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className={styles.addButton} onClick={() => handleOpenModal()}>
              Add Doctor
            </button>
          </div>
          {isLoading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
          <div className={styles.doctorGrid}>
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className={styles.doctorCardWrapper}>
                <DoctorCard data={doctor}>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.editButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(doctor);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(doctor.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </DoctorCard>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{selectedDoctor ? "Edit Doctor" : "Add Doctor"}</h2>
            <Formik
              initialValues={{
                fullname: selectedDoctor?.fullname || "",
                email: selectedDoctor?.email || "",
                specialty: selectedDoctor?.specialty || "",
                phone: selectedDoctor?.phone || "",
                profileImage: selectedDoctor?.profileImage || "",
                bio: selectedDoctor?.bio || "",
                clinicLocation: selectedDoctor?.clinicLocation || "",
                availableDays: selectedDoctor?.availableDays.join(", ") || "",
                availableHours: selectedDoctor?.availableHours || "",
                socialLinks: {
                  facebook: selectedDoctor?.socialLinks?.facebook || "",
                  twitter: selectedDoctor?.socialLinks?.twitter || "",
                  linkedin: selectedDoctor?.socialLinks?.linkedin || "",
                },
                experience: selectedDoctor?.experience || "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form className={styles.form}>
                  <div className={styles.formGroup}>
                    <label>Full Name</label>
                    <Field name="fullname" type="text" className={styles.input} />
                    <ErrorMessage name="fullname" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Email</label>
                    <Field name="email" type="email" className={styles.input} />
                    <ErrorMessage name="email" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Specialty</label>
                    <Field name="specialty" as="select" className={styles.input}>
                      <option value="">Select Specialty</option>
                      <option value="Retinal Surgeon">Retinal Surgeon</option>
                      <option value="Cataract Specialist">Cataract Specialist</option>
                      <option value="Glaucoma Specialist">Glaucoma Specialist</option>
                      <option value="Diabetic Retinopathy Specialist">Diabetic Retinopathy Specialist</option>
                      <option value="Cataract Surgeon">Cataract Surgeon</option>
                      <option value="Retina Specialist">Retina Specialist</option>
                      <option value="Glaucoma Surgeon">Glaucoma Surgeon</option>
                    </Field>
                    <ErrorMessage name="specialty" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Phone</label>
                    <Field name="phone" type="text" className={styles.input} />
                    <ErrorMessage name="phone" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Profile Image</label>
                    <input type="file" accept="image/*" className={styles.input} onChange={(event) => handleImageChange(event, setFieldValue)} />
                    <ErrorMessage name="profileImage" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Bio</label>
                    <Field name="bio" as="textarea" className={styles.input} />
                    <ErrorMessage name="bio" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Clinic Location</label>
                    <Field name="clinicLocation" type="text" className={styles.input} />
                    <ErrorMessage name="clinicLocation" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Available Days (comma-separated)</label>
                    <Field name="availableDays" type="text" className={styles.input} />
                    <ErrorMessage name="availableDays" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Available Hours</label>
                    <Field name="availableHours" type="text" className={styles.input} />
                    <ErrorMessage name="availableHours" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Facebook Link</label>
                    <Field name="socialLinks.facebook" type="text" className={styles.input} />
                    <ErrorMessage name="socialLinks.facebook" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Twitter Link</label>
                    <Field name="socialLinks.twitter" type="text" className={styles.input} />
                    <ErrorMessage name="socialLinks.twitter" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>LinkedIn Link</label>
                    <Field name="socialLinks.linkedin" type="text" className={styles.input} />
                    <ErrorMessage name="socialLinks.linkedin" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Experience</label>
                    <Field name="experience" type="text" className={styles.input} />
                    <ErrorMessage name="experience" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formButtons}>
                    <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                      {selectedDoctor ? "Update" : "Add"} Doctor
                    </button>
                    <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsManage;
