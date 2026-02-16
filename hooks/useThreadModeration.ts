import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    getAllThreadsAdmin,
    pinThreadAdmin,
    lockThreadAdmin,
    moveThreadAdmin,
    deleteThreadAdmin,
    bulkThreadActions,
    getPendingApprovals,
    approveThread,
    rejectThread,
    getAllRepliesAdmin,
    updateReplyAdmin,
    deleteReplyAdmin,
    bulkReplyActions,
    getAllCategoriesAdmin,
    AdminForumThread,
    AdminForumReply,
    BulkActionData,
    BulkReplyActionData
} from "@/app/api/admin/forum";
import { ForumCategory } from "@/app/api/forum/forum";

// ============ THREAD QUERIES ============

export const useAllThreadsAdmin = (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: 'pending' | 'approved' | 'pinned' | 'locked';
}) => {
    return useQuery({
        queryKey: ["admin-forum-threads", params],
        queryFn: () => getAllThreadsAdmin(params),
        staleTime: 30000, // 30 seconds
    });
};

export const usePendingApprovals = (params?: {
    page?: number;
    limit?: number;
}) => {
    return useQuery({
        queryKey: ["admin-forum-pending-approvals", params],
        queryFn: () => getPendingApprovals(params),
        staleTime: 30000,
    });
};

export const useAllRepliesAdmin = (params?: {
    page?: number;
    limit?: number;
    search?: string;
    threadId?: string;
}) => {
    return useQuery({
        queryKey: ["admin-forum-replies", params],
        queryFn: () => getAllRepliesAdmin(params),
        staleTime: 30000,
    });
};

// ============ THREAD MUTATIONS ============

export const usePinThread = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: pinThreadAdmin,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["admin-forum-threads"] });
            queryClient.invalidateQueries({ queryKey: ["forum-threads"] });
            toast.success(`Thread ${data.isPinned ? 'pinned' : 'unpinned'} successfully!`);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to pin/unpin thread");
        },
    });
};

export const useLockThread = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: lockThreadAdmin,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["admin-forum-threads"] });
            queryClient.invalidateQueries({ queryKey: ["forum-threads"] });
            toast.success(`Thread ${data.isLocked ? 'locked' : 'unlocked'} successfully!`);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to lock/unlock thread");
        },
    });
};

export const useMoveThread = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ threadId, data }: { threadId: string; data: { categoryId: string; reason?: string } }) =>
            moveThreadAdmin(threadId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-forum-threads"] });
            queryClient.invalidateQueries({ queryKey: ["forum-threads"] });
            queryClient.invalidateQueries({ queryKey: ["forum-categories"] });
            toast.success("Thread moved successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to move thread");
        },
    });
};

export const useDeleteThread = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ threadId, reason }: { threadId: string; reason?: string }) =>
            deleteThreadAdmin(threadId, { reason }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-forum-threads"] });
            queryClient.invalidateQueries({ queryKey: ["forum-threads"] });
            queryClient.invalidateQueries({ queryKey: ["forum-categories"] });
            toast.success("Thread deleted successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete thread");
        },
    });
};

export const useBulkThreadActions = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: bulkThreadActions,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["admin-forum-threads"] });
            queryClient.invalidateQueries({ queryKey: ["forum-threads"] });
            queryClient.invalidateQueries({ queryKey: ["forum-categories"] });
            toast.success(`${data.message} (${data.modifiedCount}/${data.totalRequested} threads affected)`);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to perform bulk action");
        },
    });
};

export const useApproveThread = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ threadId, reviewNotes }: { threadId: string; reviewNotes?: string }) =>
            approveThread(threadId, { reviewNotes }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-forum-threads"] });
            queryClient.invalidateQueries({ queryKey: ["admin-forum-pending-approvals"] });
            queryClient.invalidateQueries({ queryKey: ["forum-threads"] });
            toast.success("Thread approved successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to approve thread");
        },
    });
};

export const useRejectThread = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ threadId, reviewNotes }: { threadId: string; reviewNotes?: string }) =>
            rejectThread(threadId, { reviewNotes }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-forum-threads"] });
            queryClient.invalidateQueries({ queryKey: ["admin-forum-pending-approvals"] });
            queryClient.invalidateQueries({ queryKey: ["forum-threads"] });
            toast.success("Thread rejected successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to reject thread");
        },
    });
};

// ============ REPLY MUTATIONS ============

export const useUpdateReply = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ replyId, content, reason }: { replyId: string; content: string; reason?: string }) =>
            updateReplyAdmin(replyId, { content, reason }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-forum-replies"] });
            queryClient.invalidateQueries({ queryKey: ["forum-replies"] });
            toast.success("Reply updated successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update reply");
        },
    });
};

export const useDeleteReply = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ replyId, reason }: { replyId: string; reason?: string }) =>
            deleteReplyAdmin(replyId, { reason }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-forum-replies"] });
            queryClient.invalidateQueries({ queryKey: ["forum-replies"] });
            queryClient.invalidateQueries({ queryKey: ["admin-forum-threads"] });
            toast.success("Reply deleted successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete reply");
        },
    });
};

export const useBulkReplyActions = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: bulkReplyActions,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["admin-forum-replies"] });
            queryClient.invalidateQueries({ queryKey: ["forum-replies"] });
            queryClient.invalidateQueries({ queryKey: ["admin-forum-threads"] });
            toast.success(`${data.message} (${data.modifiedCount}/${data.totalRequested} replies affected)`);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to perform bulk reply action");
        },
    });
};

// ============ ADMIN CATEGORIES ============

export const useAdminForumCategories = () => {
    return useQuery<ForumCategory[]>({
        queryKey: ["admin-forum-categories"],
        queryFn: getAllCategoriesAdmin,
        staleTime: 60000, // 1 minute
    });
};