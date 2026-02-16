import axios from "@/lib/axios";

export interface NewsFilters {
    status?: "draft" | "published";
    category?: "Engineering" | "Pilot" | "General" | "Announcement";
    search?: string;
    sortBy?: string;
    order?: "asc" | "desc";
    page?: number;
    limit?: number;
}

export interface NewsStats {
    overview: {
        totalNews: number;
        publishedNews: number;
        draftNews: number;
        totalViews: number;
        totalComments: number;
    };
    byCategory: Array<{ _id: string; count: number }>;
    recentNews: any[];
    topViewedNews: any[];
}

export const adminNewsAPI = {
    // Get all news with filters
    getAllNews: async (filters: NewsFilters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, String(value));
            }
        });
        
        const response = await axios.get(`/admin/news?${params.toString()}`);
        return response.data;
    },

    // Get news statistics
    getStats: async (): Promise<NewsStats> => {
        const response = await axios.get("/admin/news/stats");
        return response.data;
    },

    // Get single news details
    getNewsDetails: async (id: string) => {
        const response = await axios.get(`/admin/news/${id}`);
        return response.data;
    },

    // Update news
    updateNews: async (id: string, data: any) => {
        const response = await axios.put(`/admin/news/${id}`, data);
        return response.data;
    },

    // Delete news
    deleteNews: async (id: string) => {
        const response = await axios.delete(`/admin/news/${id}`);
        return response.data;
    },

    // Bulk delete news
    bulkDeleteNews: async (ids: string[]) => {
        const response = await axios.post("/admin/news/bulk/delete", { ids });
        return response.data;
    },

    // Bulk update status
    bulkUpdateStatus: async (ids: string[], status: "draft" | "published") => {
        const response = await axios.post("/admin/news/bulk/status", { ids, status });
        return response.data;
    },

    // Get comments for a news article
    getNewsComments: async (newsId: string, page = 1, limit = 20) => {
        const response = await axios.get(`/admin/news/${newsId}/comments`, {
            params: { page, limit }
        });
        return response.data;
    },

    // Delete comment
    deleteComment: async (commentId: string) => {
        const response = await axios.delete(`/admin/news/comments/${commentId}`);
        return response.data;
    }
};
