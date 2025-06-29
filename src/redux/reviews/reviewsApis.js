import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const URL = "http://localhost:5000/doctors";

// update doctor rating function
const updateRating = (reviews) => {
  const ratingList = reviews.map((r) => r.rating);
  const rateSum = ratingList.reduce((prev, current) => {
    return prev + current;
  }, 0);
  return (rateSum / ratingList.length).toFixed(1);
};

// add review on doctor post
const addReview = async ({ doctorId, reviewData }) => {
  try {
    const { data } = await axios.get(`${URL}/${doctorId}`);
    const updatedReviews = [reviewData, ...data.reviews];
    const doctorRate = updateRating(updatedReviews);
    const res = await axios.patch(`${URL}/${doctorId}`, {
      reviews: updatedReviews,
      rating: doctorRate,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const useAddReview = (doctorId, onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewData) => addReview({ doctorId, reviewData }),
    onSuccess: () => {
      queryClient.invalidateQueries(["doctorReviews", doctorId]);
      if (onSuccessCallback) onSuccessCallback();
    },
  });
};

// update existing review for doctor post
const updateReview = async ({ doctorId, reviewData }) => {
  try {
    const { data } = await axios.get(`${URL}/${doctorId}`);
    const updatedReviews = data.reviews.map((review) => (review.clientId === reviewData.clientId ? reviewData : review));
    const doctorRate = updateRating(updatedReviews);
    const res = await axios.patch(`${URL}/${doctorId}`, {
      reviews: updatedReviews,
      rating: doctorRate,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const useUpdateReview = (doctorId, onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewData) => updateReview({ doctorId, reviewData }),
    onSuccess: () => {
      queryClient.invalidateQueries(["doctorReviews", doctorId]);
      if (onSuccessCallback) onSuccessCallback();
    },
  });
};
