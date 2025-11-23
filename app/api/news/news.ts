import api from "@/lib/axios";

export async function fetchNews() {
    const res = await api.get("/news");
    return res.data.data;
}

export async function getSingleNews(id: string) {
    const res = await api.get(`/news/${id}`);
    return res.data;
}

export async function createNews(data: any) {
    const res = await api.post("/news", data);
    return res.data;
}
