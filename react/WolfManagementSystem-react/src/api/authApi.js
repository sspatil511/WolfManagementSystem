import axiosInstance from "./axiosInstance";

export const loginUser = (email, password) =>
    axiosInstance.post("/auth/signin", { email, password });

export const registerUser = (fullName, email, password) =>
  axiosInstance.post("/auth/signup", { fullName, email, password });