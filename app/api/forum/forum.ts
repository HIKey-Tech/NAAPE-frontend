import axios from "@/lib/axios";

export interface ForumCategory {
    _id: string;
    name: string;
    description: string;
    slug: string;
    icon?: string;
    order: number;
    threadCount?: number;
}

export interface ForumThread {
    _id: string;
    title: string;
    content: string;
    category: ForumCategory;
    author: {
        _id: string;
        name: string;
        email: string;
        role: string;
    };
    isPinned: boolean;
    isLocked: boolean;
    views: number;
    lastActivity: Date;
    replyCount?: number;
    lastReply?: {
        _id: string;
        author: {
            name: string;
        };
        createdAt: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface ForumReply {
    _id: string;
    thread: string;
    author: {
        _id: string;
        name: string;
        email: string;
        role: string;
    };
    content: string;
    parentReply?: string;
    isEdited: boolean;
    editedAt?: Date;
    replies?: ForumReply[];
    createdAt: Date;
    updatedAt: Date;
}

// ============ CATEGORIES ============

export const getForumCategories = async (): Promise<ForumCategory[]> => {
    const response = await axios.get("/forum/categories");
    return response.data.data;
};

export const createForumCategory = async (data: {
    name: string;
    description: string;
    slug: string;
    icon?: string;
    order?: number;
}): Promise<ForumCategory> => {
    const response = await axios.post("/forum/categories", data);
    return response.data.data;
};

// ============ THREADS ============

export const getAllForumThreads = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
}): Promise<{ data: ForumThread[]; pagination: any }> => {
    const response = await axios.get("/forum/threads", { params });
    return response.data;
};

export const getThreadsByCategory = async (
    categoryId: string,
    params?: { page?: number; limit?: number }
): Promise<{ data: ForumThread[]; pagination: any }> => {
    const response = await axios.get(`/forum/threads/category/${categoryId}`, { params });
    return response.data;
};

export const getForumThreadById = async (threadId: string): Promise<ForumThread> => {
    const response = await axios.get(`/forum/threads/${threadId}`);
    return response.data.data;
};

export const createForumThread = async (data: {
    title: string;
    content: string;
    categoryId: string;
}): Promise<ForumThread> => {
    const response = await axios.post("/forum/threads", data);
    return response.data.data;
};

export const updateForumThread = async (
    threadId: string,
    data: { title?: string; content?: string }
): Promise<ForumThread> => {
    const response = await axios.put(`/forum/threads/${threadId}`, data);
    return response.data.data;
};

export const deleteForumThread = async (threadId: string): Promise<void> => {
    await axios.delete(`/forum/threads/${threadId}`);
};

export const togglePinThread = async (threadId: string): Promise<ForumThread> => {
    const response = await axios.patch(`/forum/threads/${threadId}/pin`);
    return response.data.data;
};

export const toggleLockThread = async (threadId: string): Promise<ForumThread> => {
    const response = await axios.patch(`/forum/threads/${threadId}/lock`);
    return response.data.data;
};

// ============ REPLIES ============

export const getThreadReplies = async (
    threadId: string,
    params?: { page?: number; limit?: number }
): Promise<{ data: ForumReply[]; pagination: any }> => {
    const response = await axios.get(`/forum/threads/${threadId}/replies`, { params });
    return response.data;
};

export const createForumReply = async (
    threadId: string,
    data: { content: string; parentReplyId?: string }
): Promise<ForumReply> => {
    const response = await axios.post(`/forum/threads/${threadId}/replies`, data);
    return response.data.data;
};

export const updateForumReply = async (
    replyId: string,
    data: { content: string }
): Promise<ForumReply> => {
    const response = await axios.put(`/forum/replies/${replyId}`, data);
    return response.data.data;
};

export const deleteForumReply = async (replyId: string): Promise<void> => {
    await axios.delete(`/forum/replies/${replyId}`);
};

// ============ REPORTING ============

export interface ReportData {
    reason: string;
    description?: string;
}

export interface ReportResponse {
    reportId: string;
    status: string;
}

export const reportThread = async (threadId: string, data: ReportData): Promise<ReportResponse> => {
    const response = await axios.post(`/forum/reports/thread/${threadId}`, data);
    return response.data.data;
};

export const reportReply = async (replyId: string, data: ReportData): Promise<ReportResponse> => {
    const response = await axios.post(`/forum/reports/reply/${replyId}`, data);
    return response.data.data;
};

export const reportUser = async (userId: string, data: ReportData): Promise<ReportResponse> => {
    const response = await axios.post(`/forum/reports/user/${userId}`, data);
    return response.data.data;
};
