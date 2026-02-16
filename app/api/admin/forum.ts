import axios from "@/lib/axios";
import { ForumThread, ForumReply, ForumCategory } from "../forum/forum";

// ============ ADMIN THREAD MODERATION TYPES ============

export interface AdminForumThread extends ForumThread {
    requiresApproval?: boolean;
    isApproved?: boolean;
    moderationNotes?: string;
    moderatedBy?: {
        _id: string;
        name: string;
        email: string;
    };
    moderatedAt?: Date;
}

export interface AdminForumReply extends ForumReply {
    moderationNotes?: string;
    moderatedBy?: {
        _id: string;
        name: string;
        email: string;
    };
    moderatedAt?: Date;
}

export interface BulkActionData {
    threadIds: string[];
    action: 'pin' | 'unpin' | 'lock' | 'unlock' | 'delete' | 'move' | 'approve' | 'reject';
    data?: {
        categoryId?: string;
        reason?: string;
    };
}

export interface BulkReplyActionData {
    replyIds: string[];
    action: 'delete' | 'edit';
    data?: {
        content?: string;
        reason?: string;
    };
}

// ============ ADMIN THREAD MODERATION API ============

export const getAllThreadsAdmin = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: 'pending' | 'approved' | 'pinned' | 'locked';
}): Promise<{ data: AdminForumThread[]; pagination: any }> => {
    const response = await axios.get("/admin/forum/threads", { params });
    return response.data;
};

export const pinThreadAdmin = async (threadId: string): Promise<AdminForumThread> => {
    const response = await axios.patch(`/admin/forum/threads/${threadId}/pin`);
    return response.data.data;
};

export const lockThreadAdmin = async (threadId: string): Promise<AdminForumThread> => {
    const response = await axios.patch(`/admin/forum/threads/${threadId}/lock`);
    return response.data.data;
};

export const moveThreadAdmin = async (
    threadId: string, 
    data: { categoryId: string; reason?: string }
): Promise<AdminForumThread> => {
    const response = await axios.patch(`/admin/forum/threads/${threadId}/move`, data);
    return response.data.data;
};

export const deleteThreadAdmin = async (
    threadId: string, 
    data?: { reason?: string }
): Promise<void> => {
    await axios.delete(`/admin/forum/threads/${threadId}`, { data });
};

export const bulkThreadActions = async (data: BulkActionData): Promise<{ 
    message: string; 
    modifiedCount: number; 
    totalRequested: number; 
}> => {
    const response = await axios.post("/admin/forum/threads/bulk-action", data);
    return response.data;
};

export const getPendingApprovals = async (params?: {
    page?: number;
    limit?: number;
}): Promise<{ data: AdminForumThread[]; pagination: any }> => {
    const response = await axios.get("/admin/forum/threads/pending", { params });
    return response.data;
};

export const approveThread = async (
    threadId: string, 
    data?: { reviewNotes?: string }
): Promise<AdminForumThread> => {
    const response = await axios.post(`/admin/forum/threads/${threadId}/approve`, data);
    return response.data.data;
};

export const rejectThread = async (
    threadId: string, 
    data?: { reviewNotes?: string }
): Promise<AdminForumThread> => {
    const response = await axios.post(`/admin/forum/threads/${threadId}/reject`, data);
    return response.data.data;
};

// ============ ADMIN CATEGORY MANAGEMENT API ============

export const getAllCategoriesAdmin = async (): Promise<ForumCategory[]> => {
    const response = await axios.get("/admin/forum/categories");
    return response.data.data;
};

export const createCategoryAdmin = async (data: {
    name: string;
    description: string;
    slug: string;
    icon?: string;
    order?: number;
}): Promise<ForumCategory> => {
    const response = await axios.post("/admin/forum/categories", data);
    return response.data.data;
};

export const updateCategoryAdmin = async (
    categoryId: string,
    data: {
        name?: string;
        description?: string;
        slug?: string;
        icon?: string;
        order?: number;
        isActive?: boolean;
    }
): Promise<ForumCategory> => {
    const response = await axios.put(`/admin/forum/categories/${categoryId}`, data);
    return response.data.data;
};

export const deleteCategoryAdmin = async (
    categoryId: string,
    data?: { migrateTo?: string; deleteThreads?: boolean }
): Promise<void> => {
    await axios.delete(`/admin/forum/categories/${categoryId}`, { data });
};

export const reorderCategoriesAdmin = async (data: {
    categoryOrders: { id: string; order: number }[];
}): Promise<ForumCategory[]> => {
    const response = await axios.patch("/admin/forum/categories/reorder", data);
    return response.data.data;
};

// ============ ADMIN REPLY MODERATION API ============

export const getAllRepliesAdmin = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    threadId?: string;
}): Promise<{ data: AdminForumReply[]; pagination: any }> => {
    const response = await axios.get("/admin/forum/replies", { params });
    return response.data;
};

export const updateReplyAdmin = async (
    replyId: string,
    data: { content: string; reason?: string }
): Promise<AdminForumReply> => {
    const response = await axios.put(`/admin/forum/replies/${replyId}`, data);
    return response.data.data;
};

export const deleteReplyAdmin = async (
    replyId: string,
    data?: { reason?: string }
): Promise<void> => {
    await axios.delete(`/admin/forum/replies/${replyId}`, { data });
};

export const bulkReplyActions = async (data: BulkReplyActionData): Promise<{
    message: string;
    modifiedCount: number;
    totalRequested: number;
}> => {
    const response = await axios.post("/admin/forum/replies/bulk-action", data);
    return response.data;
};

// ============ USER MANAGEMENT TYPES ============

export interface ForumUser {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'member';
    createdAt: string;
    forumActivity?: {
        threadCount: number;
        replyCount: number;
        lastActivity?: string;
    };
    banStatus?: {
        type: 'permanent' | 'temporary' | 'mute';
        reason: string;
        expiresAt?: string;
        bannedBy: string;
    };
    status: 'active' | 'permanent' | 'temporary' | 'mute';
}

export interface BanUserData {
    banType: 'permanent' | 'temporary' | 'mute';
    duration?: number;
    reason: string;
}

export interface UserRestrictionData {
    reason: string;
    duration?: number; // in days, for temporary restrictions
}

// ============ USER MANAGEMENT API ============

export const getForumUsers = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
}): Promise<{ data: ForumUser[]; pagination: any }> => {
    const response = await axios.get("/admin/forum/users", { params });
    return response.data;
};

export const banUserAdmin = async (userId: string, data: BanUserData): Promise<void> => {
    await axios.post(`/admin/forum/users/${userId}/ban`, data);
};

export const unbanUserAdmin = async (userId: string, data?: { reason?: string }): Promise<void> => {
    await axios.delete(`/admin/forum/users/${userId}/ban`, { data });
};

export const getUserForumActivity = async (userId: string, params?: {
    page?: number;
    limit?: number;
}): Promise<{
    data: {
        user: ForumUser;
        stats: {
            totalThreads: number;
            totalReplies: number;
            totalViews: number;
            joinDate: string;
            lastActivity?: string;
        };
        recentThreads: any[];
        recentReplies: any[];
        banHistory: any[];
        currentBan?: any;
    };
}> => {
    const response = await axios.get(`/admin/forum/users/${userId}/activity`, { params });
    return response.data;
};

// ============ REPORT MANAGEMENT TYPES ============

export interface ForumReport {
    _id: string;
    reportType: 'thread' | 'reply' | 'user';
    reportedContent?: {
        _id: string;
        title?: string;
        content?: string;
        author?: {
            _id: string;
            name: string;
            email: string;
            role: string;
        };
        category?: {
            _id: string;
            name: string;
        };
        thread?: {
            _id: string;
            title: string;
            category?: {
                _id: string;
                name: string;
            };
        };
    };
    reportedUser?: {
        _id: string;
        name: string;
        email: string;
        role: string;
    };
    reporter: {
        _id: string;
        name: string;
        email: string;
        role: string;
    };
    reason: 'spam' | 'harassment' | 'inappropriate' | 'off-topic' | 'other';
    description?: string;
    status: 'pending' | 'resolved' | 'dismissed';
    resolvedBy?: {
        _id: string;
        name: string;
        email: string;
    };
    resolvedAt?: string;
    resolutionNotes?: string;
    createdAt: string;
    updatedAt: string;
    additionalContext?: {
        threadTitle?: string;
        threadCategory?: string;
    };
}

export interface ReportStats {
    total: number;
    pending: number;
    resolved: number;
    dismissed: number;
}

export interface ResolveReportData {
    resolutionNotes?: string;
    actionTaken?: 'delete_content' | 'ban_user' | 'suspend_user' | 'none';
}

export interface BulkReportActionData {
    reportIds: string[];
    action: 'resolve' | 'dismiss';
    resolutionNotes?: string;
}

// ============ REPORT MANAGEMENT API ============

export const getAllReports = async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    reportType?: string;
    dateFrom?: string;
    dateTo?: string;
}): Promise<{ 
    data: ForumReport[]; 
    stats: ReportStats;
    pagination: any;
}> => {
    const response = await axios.get("/admin/forum/reports", { params });
    return response.data;
};

export const getReportById = async (reportId: string): Promise<ForumReport> => {
    const response = await axios.get(`/admin/forum/reports/${reportId}`);
    return response.data.data;
};

export const resolveReport = async (
    reportId: string, 
    data: ResolveReportData
): Promise<ForumReport> => {
    const response = await axios.post(`/admin/forum/reports/${reportId}/resolve`, data);
    return response.data.data;
};

export const dismissReport = async (
    reportId: string, 
    data?: { resolutionNotes?: string }
): Promise<ForumReport> => {
    const response = await axios.post(`/admin/forum/reports/${reportId}/dismiss`, data);
    return response.data.data;
};

export const bulkReportActions = async (data: BulkReportActionData): Promise<{
    message: string;
    modifiedCount: number;
    totalRequested: number;
}> => {
    const response = await axios.post("/admin/forum/reports/bulk-action", data);
    return response.data;
};

// ============ ANALYTICS TYPES ============

export interface AnalyticsMetrics {
    totalThreads: number;
    totalReplies: number;
    totalUsers: number;
    totalViews: number;
    activeCategories: number;
}

export interface ActivityDataPoint {
    date: string;
    threadCount: number;
    replyCount: number;
    totalViews: number;
    uniqueAuthorCount: number;
    uniqueReplierCount: number;
}

export interface TopCategory {
    _id: string;
    name: string;
    slug: string;
    threadCount: number;
    totalViews: number;
    lastActivity: string;
}

export interface TopUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    threadCount: number;
    replyCount: number;
    totalViews: number;
    engagementScore?: number;
    joinDate?: string;
}

export interface AnalyticsOverview {
    metrics: AnalyticsMetrics;
    activityOverTime: ActivityDataPoint[];
    topCategories: TopCategory[];
    topUsers: TopUser[];
}

export interface UserEngagementData {
    period: string;
    stats: {
        totalActiveUsers: number;
        averageThreadsPerUser: number;
        averageRepliesPerUser: number;
        totalEngagementScore: number;
    };
    topUsers: TopUser[];
}

// ============ ANALYTICS API ============

export const getAnalyticsOverview = async (queryString?: string): Promise<{ data: AnalyticsOverview }> => {
    const response = await axios.get(`/admin/forum/analytics/overview${queryString ? `?${queryString}` : ''}`);
    return response.data;
};

export const getActivityMetrics = async (queryString?: string): Promise<{ 
    data: { period: string; dailyActivity: ActivityDataPoint[] } 
}> => {
    const response = await axios.get(`/admin/forum/analytics/activity${queryString ? `?${queryString}` : ''}`);
    return response.data;
};

export const getUserEngagementMetrics = async (queryString?: string): Promise<{ data: UserEngagementData }> => {
    const response = await axios.get(`/admin/forum/analytics/users${queryString ? `?${queryString}` : ''}`);
    return response.data;
};

export const exportAnalytics = async (queryString?: string): Promise<{ data: any }> => {
    const response = await axios.get(`/admin/forum/analytics/export${queryString ? `?${queryString}` : ''}`);
    return response.data;
};

// ============ ADMIN FORUM API OBJECT ============

export const adminForumAPI = {
    // Thread moderation
    getAllThreadsAdmin,
    pinThreadAdmin,
    lockThreadAdmin,
    moveThreadAdmin,
    deleteThreadAdmin,
    bulkThreadActions,
    getPendingApprovals,
    approveThread,
    rejectThread,
    
    // Reply moderation
    getAllRepliesAdmin,
    updateReplyAdmin,
    deleteReplyAdmin,
    bulkReplyActions,
    
    // User management
    getForumUsers,
    banUserAdmin,
    unbanUserAdmin,
    getUserForumActivity,
    
    // Report management
    getAllReports,
    getReportById,
    resolveReport,
    dismissReport,
    bulkReportActions,
    
    // Analytics
    getAnalyticsOverview,
    getActivityMetrics,
    getUserEngagementMetrics,
    exportAnalytics
};