import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { successMessage } from "../toasts";

const URL = "http://localhost:5000/appointments";

// Get User Appointments
const getUserAppointments = async (id) => {
  try {
    const res = await axios.get(URL, {
      // Changed URL
      params: {
        patientId: id, // Added query parameter
      },
    });
    return res?.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const useUserAppointments = (id) => {
  return useQuery({
    queryKey: ["userAppointments"],
    queryFn: () => getUserAppointments(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

// remove appointment
const removeAppointment = async ({ appointmentId }) => {
  try {
    const res = await axios.delete(`${URL}/${appointmentId}`);
    successMessage("Appointment Canceled !");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error; // Re-throw the error to be caught by useMutation
  }
};

export const useRemoveAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId) => removeAppointment({ appointmentId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["userAppointments"]);
      queryClient.invalidateQueries(["allAppointments"]);
    },
    onError: (error) => {
      console.error("Failed to remove appointment:", error);
      // Optionally, display an error message to the user
    },
  });
};

// Get User Appointments
const getDoctorsAppointments = async (id) => {
  try {
    const res = await axios.get(URL, {
      params: {
        doctorId: id,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const useDoctorsAppointments = (id) => {
  return useQuery({
    queryKey: ["doctorAppointments", id],
    queryFn: () => getDoctorsAppointments(id),
    enabled: !!id, // optional safeguard
    staleTime: 1000 * 60 * 5,
  });
};

const updateAppointmentStatus = async ({ appointmentId, status }) => {
  try {
    const res = await axios.patch(`${URL}/${appointmentId}`, { status });
    successMessage(`Appointment ${status} successfully!`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appointmentId, status }) => updateAppointmentStatus({ appointmentId, status }),
    onSuccess: () => {
      queryClient.invalidateQueries(["doctorAppointments"]);
      queryClient.invalidateQueries(["userAppointments"]);
      queryClient.invalidateQueries(["allAppointments"]);
    },
    onError: (error) => {
      console.error("Failed to update appointment status:", error);
    },
  });
};
