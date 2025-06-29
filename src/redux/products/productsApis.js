import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const URL = "http://localhost:5000/products";

// Get all products
const getProducts = async () => {
  try {
    const res = await axios.get(URL);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5,
  });
};

// Get Product by ID
const getProductById = async (id) => {
  try {
    const res = await axios.get(`${URL}/${id}`);
    return res.data || [];
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const useProductById = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    staleTime: 1000 * 60 * 5,
  });
};

// Get all glasses
const getAllGlasses = async () => {
  try {
    const res = await axios.get(`${URL}?type=Glasses`);
    return res.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const useAllGlasses = () => {
  return useQuery({
    queryKey: ["glasses"],
    queryFn: getAllGlasses,
    // staleTime: 1000 * 60 * 5,
  });
};

// Add a new product
const addProduct = async (productData) => {
  try {
    const res = await axios.post(URL, productData);
    return res.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });
};

// Update an existing product
const updateProduct = async ({ id, ...productData }) => {
  try {
    const res = await axios.put(`${URL}/${id}`, productData);
    return res.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });
};

// Delete a product
const deleteProduct = async (id) => {
  try {
    const res = await axios.delete(`${URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });
};
