import { useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

export interface NewsComment {
    _id: string;
    text: string;
    user: {
        _id: string;
        name: string;
        email: string;
        role: string;
    };
    parentComment?: string;
    replies?: NewsComment[];
    createdAt: string;
}

export const useNewsComments = (newsId: string) => {
    const [comments, setComments] = useState<NewsComment[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = async () => {
        if (!newsId) return;
        
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/news/${newsId}/comments`);
            setComments(response.data.data || []);
        } catch (error: any) {
            console.error("Failed to fetch comments:", error);
            toast.error(error.response?.data?.message || "Failed to load comments");
        } finally {
            setLoading(false);
        }
    };

    const addComment = async (text: string, parentCommentId?: string) => {
        if (!text.trim()) {
            toast.error("Comment cannot be empty");
            return false;
        }

        setSubmitting(true);
        try {
            const response = await axiosInstance.post(`/news/${newsId}/comments`, { 
                text,
                parentCommentId 
            });
            
            // Refresh comments to get updated tree structure
            await fetchComments();
            toast.success(parentCommentId ? "Reply added successfully" : "Comment added successfully");
            return true;
        } catch (error: any) {
            console.error("Failed to add comment:", error);
            toast.error(error.response?.data?.message || "Failed to add comment");
            return false;
        } finally {
            setSubmitting(false);
        }
    };

    const deleteComment = async (commentId: string) => {
        try {
            await axiosInstance.delete(`/news/comments/${commentId}`);
            setComments((prev) => prev.filter((c) => c._id !== commentId));
            toast.success("Comment deleted");
            return true;
        } catch (error: any) {
            console.error("Failed to delete comment:", error);
            toast.error(error.response?.data?.message || "Failed to delete comment");
            return false;
        }
    };

    return {
        comments,
        loading,
        submitting,
        fetchComments,
        addComment,
        deleteComment,
    };
};
