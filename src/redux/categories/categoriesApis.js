import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const getCategories = async (type) => {
  try {
    const res = await axios.get(`http://localhost:5000/${type}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const useCategories = (type) => {
  return useQuery({
    queryKey: ["categories", type],
    queryFn: () => getCategories(type),
    staleTime: 1000 * 60 * 5,
  });
};
