"use client";

import axios from "axios";

const baseURL = process.env.BASE_URL;

const api = axios.create({
    baseURL: `https://naape-backend.onrender.com/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor safely for client-side only
api.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
