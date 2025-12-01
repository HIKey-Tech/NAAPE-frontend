import api from "@/lib/axios";
import axios from "axios";

export async function fetchNews() {
    const res = await api.get("/news");
    return res.data.data;
}

export async function getSingleNews(id: string) {
    const res = await api.get(`/news/${id}`);
    return res.data;
}

export async function createNews(data: FormData) {
    const token = localStorage.getItem("token");
    try {
        const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL!}/api` || "http://localhost:5000/api"

        const response = await axios.post(`${BASE_URL}/news`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        })

        return response.data
    } catch (error) {
        throw error

    }


}
