import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getForumCategories,
    getAllForumThreads,
    getThreadsByCategory,
    getForumThreadById,
    createForumThread,
    updateForumThread,
    deleteForumThread,
    togglePinThread,
    toggleLockThread,
    getThreadReplies,
    createForumReply,
    updateForumReply,
    deleteForumReply,
    reportThread,
    reportReply,
    reportUser,
    ForumCategory,
    ForumThread,
    ForumReply,
    ReportData,
} from "@/app/api/forum/forum";
import { toast } from "sonner";

// ============ CATEGORIES ============

export const useForumCategories = () => {
    return useQuery<ForumCategory[]>({
        queryKey: ["forum-categories"],
        queryFn: getForumCategories,
    });
};

// ============ THREADS ============

export const useAllForumThreads = (params?: { page?: number; limit?: number; search?: string }) => {
    return useQuery({
        queryKey: ["forum-threads", params],
        queryFn: () => getAllForumThreads(params),
    });
};

export const useThreadsByCategory = (categoryId: string, params?: { page?: number; limit?: number }) => {
    return useQuery({
        queryKey: ["forum-threads", categoryId, params],
        queryFn: () => getThreadsByCategory(categoryId, params),
        enabled: !!categoryId,
    });
};

export const useForumThread = (threadId: string) => {
    return useQuery<ForumThread>({
        queryKey: ["forum-thread", threadId],
        queryFn: () => getForumThreadById(threadId),
        enabled: !!threadId,
    });
};

export const useCreateForumThread = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createForumThread,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["forum-threads"] });
            queryClient.invalidateQueries({ queryKey: ["forum-categories"] });
            toast.success("Thread created successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create thread");
        },
    });
};

export const useUpdateForumThread = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ threadId, data }: { threadId: string; data: { title?: string; content?: string } }) =>
            updateForumThread(threadId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["forum-thread", variables.threadId] });
            queryClient.invalidateQueries({ queryKey: ["forum-threads"] });
            toast.success("Thread updated successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update thread");
        },
    });
};

export const useDeleteForumThread = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteForumThread,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["forum-threads"] });
            queryClient.invalidateQueries({ queryKey: ["forum-categories"] });
            toast.success("Thread deleted successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete thread");
        },
    });
};

export const useTogglePinThread = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: togglePinThread,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["forum-threads"] });
            queryClient.invalidateQueries({ queryKey: ["forum-thread", data._id] });
            toast.success(data.isPinned ? "Thread pinned!" : "Thread unpinned!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to toggle pin");
        },
    });
};

export const useToggleLockThread = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleLockThread,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["forum-threads"] });
            queryClient.invalidateQueries({ queryKey: ["forum-thread", data._id] });
            toast.success(data.isLocked ? "Thread locked!" : "Thread unlocked!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to toggle lock");
        },
    });
};

// ============ REPLIES ============

export const useThreadReplies = (threadId: string, params?: { page?: number; limit?: number }) => {
    return useQuery({
        queryKey: ["forum-replies", threadId, params],
        queryFn: () => getThreadReplies(threadId, params),
        enabled: !!threadId,
    });
};

export const useCreateForumReply = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ threadId, data }: { threadId: string; data: { content: string; parentReplyId?: string } }) =>
            createForumReply(threadId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["forum-replies", variables.threadId] });
            queryClient.invalidateQueries({ queryKey: ["forum-thread", variables.threadId] });
            queryClient.invalidateQueries({ queryKey: ["forum-threads"] });
            toast.success("Reply posted!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to post reply");
        },
    });
};

export const useUpdateForumReply = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ replyId, data }: { replyId: string; data: { content: string } }) =>
            updateForumReply(replyId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["forum-replies"] });
            toast.success("Reply updated!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update reply");
        },
    });
};

export const useDeleteForumReply = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteForumReply,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["forum-replies"] });
            queryClient.invalidateQueries({ queryKey: ["forum-threads"] });
            toast.success("Reply deleted!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete reply");
        },
    });
};

// ============ REPORTING ============

export const useReportThread = () => {
    return useMutation({
        mutationFn: ({ threadId, data }: { threadId: string; data: ReportData }) =>
            reportThread(threadId, data),
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to submit report");
        },
    });
};

export const useReportReply = () => {
    return useMutation({
        mutationFn: ({ replyId, data }: { replyId: string; data: ReportData }) =>
            reportReply(replyId, data),
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to submit report");
        },
    });
};

export const useReportUser = () => {
    return useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: ReportData }) =>
            reportUser(userId, data),
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to submit report");
        },
    });
};
