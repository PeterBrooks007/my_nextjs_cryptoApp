"use client";

import axios, { AxiosInstance } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://rn-x-clone-social-media-backend.vercel.app/api";

/**
 * Create an Axios client that automatically sends HttpOnly JWT cookies
 */
export const createApiClient = (): AxiosInstance => {
  const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // 👈 Enables sending cookies automatically
  });

  // Optional: Handle global errors (e.g., expired JWT)
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.warn("JWT expired or unauthorized");
        // Example: Redirect to login or refresh the token
        // window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export const api = createApiClient();

/* ------------------------------------------------------------------ */
/*                              USER API                              */
/* ------------------------------------------------------------------ */

export const userApi = {
  syncUser: () => api.post("/users/sync"),
  getCurrentUser: () => api.get("/users/me"),
  updateProfile: (data: any) => api.put("/users/profile", data),
};

/* ------------------------------------------------------------------ */
/*                              POST API                              */
/* ------------------------------------------------------------------ */

export const postApi = {
  createPost: (data: { content: string; image?: string }) =>
    api.post("/posts", data),
  getPosts: () => api.get("/posts"),
  getUserPosts: (username: string) => api.get(`/posts/user/${username}`),
  likePost: (postId: string) => api.post(`/posts/${postId}/like`),
  deletePost: (postId: string) => api.delete(`/posts/${postId}`),
};

/* ------------------------------------------------------------------ */
/*                            COMMENT API                             */
/* ------------------------------------------------------------------ */

export const commentApi = {
  createComment: (
    postId: string,
    body: { content: string; parentId: string | null }
  ) => api.post(`/comments/post/${postId}`, body),
  getComments: (postId: string) => api.get(`/comments/post/${postId}`),
};
