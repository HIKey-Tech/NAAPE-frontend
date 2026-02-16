import { useState, useCallback } from "react";
import { adminNewsAPI, NewsFilters, NewsStats } from "@/app/api/admin/news";
import { toast } from "sonner";

export const useAdminNews = () => {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        pages: 0
    });

    const fetchNews = useCallback(async (filters: NewsFilters = {}) => {
        setLoading(true);
        try {
            const data = await adminNewsAPI.getAllNews(filters);
            setNews(data.data);
            setPagination(data.pagination);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch news");
        } finally {
            setLoading(false);
        }
    }, []);

    const updateNews = useCallback(async (id: string, updateData: any) => {
        try {
            await adminNewsAPI.updateNews(id, updateData);
            toast.success("News updated successfully");
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update news");
            return false;
        }
    }, []);

    const deleteNews = useCallback(async (id: string) => {
        try {
            await adminNewsAPI.deleteNews(id);
            toast.success("News deleted successfully");
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete news");
            return false;
        }
    }, []);

    const bulkDeleteNews = useCallback(async (ids: string[]) => {
        try {
            await adminNewsAPI.bulkDeleteNews(ids);
            toast.success(`${ids.length} news articles deleted successfully`);
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete news");
            return false;
        }
    }, []);

    const bulkUpdateStatus = useCallback(async (ids: string[], status: "draft" | "published") => {
        try {
            await adminNewsAPI.bulkUpdateStatus(ids, status);
            toast.success(`${ids.length} news articles updated successfully`);
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update status");
            return false;
        }
    }, []);

    return {
        news,
        loading,
        pagination,
        fetchNews,
        updateNews,
        deleteNews,
        bulkDeleteNews,
        bulkUpdateStatus
    };
};

export const useNewsStats = () => {
    const [stats, setStats] = useState<NewsStats | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminNewsAPI.getStats();
            setStats(data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch statistics");
        } finally {
            setLoading(false);
        }
    }, []);

    return { stats, loading, fetchStats };
};

export const useNewsComments = () => {
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 20,
        pages: 0
    });

    const fetchComments = useCallback(async (newsId: string, page = 1) => {
        setLoading(true);
        try {
            const data = await adminNewsAPI.getNewsComments(newsId, page);
            setComments(data.data);
            setPagination(data.pagination);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch comments");
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteComment = useCallback(async (commentId: string) => {
        try {
            await adminNewsAPI.deleteComment(commentId);
            toast.success("Comment deleted successfully");
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete comment");
            return false;
        }
    }, []);

    return {
        comments,
        loading,
        pagination,
        fetchComments,
        deleteComment
    };
};
