import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const URL = "http://localhost:5000/doctors";

const getDoctors = async () => {
  try {
    const res = await axios.get(URL);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const useDoctors = () => {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: getDoctors,
    staleTime: 1000 * 60 * 5,
  });
};

const getUsers = async () => {
  try {
    const res = await axios.get("http://localhost:5000/users");
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: 1000 * 60 * 5,
  });
};

const getDoctorById = async (id) => {
  try {
    const res = await axios.get(`${URL}/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const useDoctorById = (id) => {
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: () => getDoctorById(id),
    staleTime: 1000 * 60 * 5,
  });
};

// Add a new doctor
const addDoctor = async (doctorData) => {
  try {
    const res = await axios.post(URL, doctorData);
    return res.data;
  } catch (error) {
    console.error("Error adding doctor:", error);
    throw error;
  }
};

export const useAddDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries(["doctors"]);
    },
  });
};

// Update doctor
const updateDoctor = async ({ id, doctorData }) => {
  try {
    const res = await axios.patch(`${URL}/${id}`, doctorData);
    return res.data;
  } catch (error) {
    console.error("Update Doctor Error:", error);
    throw new Error("Failed to update doctor data");
  }
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDoctor,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["doctor", variables.id], data);
      queryClient.invalidateQueries(["doctors"]);
    },
  });
};

// Delete a doctor
const deleteDoctor = async (id) => {
  try {
    const res = await axios.delete(`${URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting doctor:", error);
    throw error;
  }
};

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries(["doctors"]);
    },
  });
};
