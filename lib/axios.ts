
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL! || "http://localhost:5000"
// const baseURL =  "http://localhost:5000"

// const publish: boolean = false

// const headers = {
//     if(publish == true) {

//     }
// }
// 

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
                console.log("🔐 Axios interceptor: Token added to request");
                console.log("Request URL:", config.url);
                console.log("Request method:", config.method);
            } else {
                console.log("⚠️ Axios interceptor: No token found in localStorage");
            }
        }
        return config;
    },
    (error) => {
        console.error("❌ Axios request interceptor error:", error);
        return Promise.reject(error);
    }
);

// Add response interceptor for logging
api.interceptors.response.use(
    (response) => {
        console.log("✅ Axios response received:");
        console.log("URL:", response.config.url);
        console.log("Status:", response.status);
        console.log("Data:", response.data);
        return response;
    },
    (error) => {
        console.error("❌ Axios response error:");
        console.error("URL:", error.config?.url);
        console.error("Status:", error.response?.status);
        console.error("Data:", error.response?.data);
        console.error("Message:", error.message);
        return Promise.reject(error);
    }
);

export default api;
