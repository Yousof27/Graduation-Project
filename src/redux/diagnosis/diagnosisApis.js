import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const URL = "http://localhost:5000/users";
const URL1 = "http://localhost:5000/doctors";

// Fetch user diagnosis
const getUserDiagnosis = async (userId) => {
  try {
    const { data } = await axios.get(`${URL}/${userId}`);
    return data.diagnosis || [];
  } catch (error) {
    console.error("Error fetching user diagnosis:", error);
    throw error;
  }
};

export const useUserDiagnosis = (userId) => {
  return useQuery({
    queryKey: ["userDiagnosis", userId],
    queryFn: () => getUserDiagnosis(userId),
    enabled: !!userId, // Only fetch when userId exists
  });
};

// Fetch doctor diagnosis
const getDoctorDiagnosis = async (doctorId) => {
  try {
    const { data } = await axios.get(`${URL1}/${doctorId}`);
    return data.diagnosis || [];
  } catch (error) {
    console.error("Error fetching doctor diagnosis:", error);
    throw error;
  }
};

export const useDoctorDiagnosis = (doctorId) => {
  return useQuery({
    queryKey: ["doctorDiagnosis", doctorId],
    queryFn: () => getDoctorDiagnosis(doctorId),
    enabled: !!doctorId, // Only fetch when doctorId exists
  });
};

// Add diagnosis to user
const addUserDiagnosis = async ({ userId, diagnosisData }) => {
  try {
    const { data: userData } = await axios.get(`${URL}/${userId}`);
    const updatedDiagnosis = [diagnosisData, ...(userData.diagnosis || [])];
    
    const res = await axios.patch(`${URL}/${userId}`, {
      diagnosis: updatedDiagnosis
    });
    return res.data;
  } catch (error) {
    console.error("Error adding user diagnosis:", error);
    throw error;
  }
};

export const useAddUserDiagnosis = (userId, onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (diagnosisData) => addUserDiagnosis({ userId, diagnosisData }),
    onSuccess: () => {
      queryClient.invalidateQueries(["userDiagnosis", userId]);
      if (onSuccessCallback) onSuccessCallback();
    }
  });
};

// Add diagnosis to doctor
const addDoctorDiagnosis = async ({ doctorId, diagnosisData }) => {
  try {
    const { data: doctorData } = await axios.get(`${URL1}/${doctorId}`);
    const updatedDiagnosis = [diagnosisData, ...(doctorData.diagnosis || [])];
    
    const res = await axios.patch(`${URL1}/${doctorId}`, {
      diagnosis: updatedDiagnosis
    });
    return res.data;
  } catch (error) {
    console.error("Error adding doctor diagnosis:", error);
    throw error;
  }
};

export const useAddDoctorDiagnosis = (doctorId, onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (diagnosisData) => addDoctorDiagnosis({ doctorId, diagnosisData }),
    onSuccess: () => {
      queryClient.invalidateQueries(["doctorDiagnosis", doctorId]);
      if (onSuccessCallback) onSuccessCallback();
    }
  });
};

// Update existing diagnosis (for both user and doctor)
const updateDiagnosis = async ({ entityId, diagnosisData, isDoctor = false }) => {
  try {
    const baseUrl = isDoctor ? URL1 : URL;
    const { data } = await axios.get(`${baseUrl}/${entityId}`);
    
    const updatedDiagnosis = (data.diagnosis || []).map(diag => 
      diag.id === diagnosisData.id ? diagnosisData : diag
    );

    const res = await axios.patch(`${baseUrl}/${entityId}`, {
      diagnosis: updatedDiagnosis
    });
    return res.data;
  } catch (error) {
    console.error("Error updating diagnosis:", error);
    throw error;
  }
};

export const useUpdateDiagnosis = (entityId, isDoctor, onSuccessCallback) => {
  const queryClient = useQueryClient();
  const queryKey = isDoctor 
    ? ["doctorDiagnosis", entityId] 
    : ["userDiagnosis", entityId];

  return useMutation({
    mutationFn: (diagnosisData) => 
      updateDiagnosis({ entityId, diagnosisData, isDoctor }),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      if (onSuccessCallback) onSuccessCallback();
    }
  });
};