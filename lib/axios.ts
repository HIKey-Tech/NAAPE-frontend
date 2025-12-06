
import axios from "axios";

// const baseURL = "http://localhost:5000";
const baseURL = process.env.NEXT_PUBLIC_BASE_URL! || "http://localhost:5000"

// const publish: boolean = false

// const headers = {
//     if(publish == true) {

//     }
// }


const api = axios.create({
    baseURL: `${baseURL}/api/v1`,
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
