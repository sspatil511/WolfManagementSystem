import axiosInstance from "./axiosInstance";

export const loginUser = (email, password) =>
    axiosInstance.post("/auth/signin", { email, password });

export const registerUser = (fullName, email, password) =>
  axiosInstance.post("/auth/signup", { fullName, email, password });

export const getCurrentUser = () =>
    axiosInstance.get("/api/users/profile");

export const getUserProjects = () =>
    axiosInstance.get("/api/projects");

export const getProjectDetails = (projectId) =>
    axiosInstance.get(`/api/projects/${projectId}`);

export const createProject = (projectData) =>
    axiosInstance.post("/api/projects", projectData);

export const inviteToProject = (projectId, email) =>
    axiosInstance.post("/api/projects/invite", { projectId, email });
