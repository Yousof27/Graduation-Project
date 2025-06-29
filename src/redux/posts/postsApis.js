import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { successMessage } from "../toasts";

const POSTS_URL = "http://localhost:5000/posts";
const USERS_URL = "http://localhost:5000/users";

// Get all posts for admin (full list of posts)
const getAllPosts = async () => {
  try {
    const res = await axios.get(POSTS_URL);
    return res.data || [];
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }
};

export const useAllPosts = () => {
  return useQuery({
    queryKey: ["allPosts"],
    queryFn: getAllPosts,
    staleTime: 1000 * 60 * 5,
  });
};

// Get Saved Posts For User
const getUserSavedPosts = async (id) => {
  try {
    if (!id) return [];
    const userResponse = await axios.get(`${USERS_URL}/${id}`);
    const postsResponse = await axios.get(POSTS_URL);

    const userPostsIds = Array.isArray(userResponse.data.savedPosts) ? userResponse.data.savedPosts : [];
    const allPosts = postsResponse.data || [];

    const userPosts = allPosts.filter((post) => userPostsIds.includes(post.id));

    return userPosts;
  } catch (error) {
    console.error("Error fetching user saved posts for id:", id, error);
    return [];
  }
};

export const useUserSavedPosts = (id) => {
  return useQuery({
    queryKey: ["userSavedPosts", id],
    queryFn: () => getUserSavedPosts(id),
    staleTime: 1000 * 60 * 5,
  });
};

// Save Post
const savePost = async ({ userId, postId }) => {
  try {
    const { data } = await axios.get(`${USERS_URL}/${userId}`);
    const savedPostsArr = Array.isArray(data.savedPosts) ? data.savedPosts : [];
    const updatedUserSavedPosts = savedPostsArr.includes(postId) ? savedPostsArr : [...savedPostsArr, postId];
    const res = await axios.patch(`${USERS_URL}/${userId}`, {
      savedPosts: updatedUserSavedPosts,
    });
    successMessage("Post saved successfully");
    return res.data;
  } catch (error) {
    console.error("Error saving post:", error);
    throw error;
  }
};

export const useSavePost = (userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId) => savePost({ userId, postId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["userSavedPosts", userId]);
      queryClient.invalidateQueries(["allPosts"]);
    },
  });
};

// Remove Saved Post
const removeSavedPost = async ({ userId, postId }) => {
  try {
    const { data } = await axios.get(`${USERS_URL}/${userId}`);
    const savedPostsArr = Array.isArray(data.savedPosts) ? data.savedPosts : [];
    const willRemovedPostIndex = savedPostsArr.findIndex((id) => id === postId);

    if (willRemovedPostIndex !== -1) {
      const updatedUserSavedPosts = [...savedPostsArr];
      updatedUserSavedPosts.splice(willRemovedPostIndex, 1);
      const res = await axios.patch(`${USERS_URL}/${userId}`, {
        savedPosts: updatedUserSavedPosts,
      });
      successMessage("Post removed from saved list");
      return res.data;
    }
    console.log("The post you want to remove does not exist in user saved list.");
  } catch (error) {
    console.error("Error removing saved post:", error);
    throw error;
  }
};

export const useRemoveSavedPost = (userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId) => removeSavedPost({ userId, postId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["userSavedPosts", userId]);
      queryClient.invalidateQueries(["allPosts"]);
    },
  });
};

// Add a new post
const addPost = async (postData) => {
  try {
    const res = await axios.post(POSTS_URL, postData);
    return res.data;
  } catch (error) {
    console.error("Error adding post:", error);
    throw error;
  }
};

export const useAddPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["allPosts"]);
    },
  });
};

// Update a post
const updatePost = async ({ id, postData }) => {
  try {
    const res = await axios.patch(`${POSTS_URL}/${id}`, postData);
    return res.data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries(["allPosts"]);
    },
  });
};

// Delete a post
const deletePost = async (id) => {
  try {
    const res = await axios.delete(`${POSTS_URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries(["allPosts"]);
    },
  });
};
