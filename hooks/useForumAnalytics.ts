"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { adminForumAPI } from "@/app/api/admin/forum";

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

export interface AnalyticsFilters {
    dateFrom?: string;
    dateTo?: string;
    categoryId?: string;
    period?: string;
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

const useForumAnalytics = () => {
    const [analyticsOverview, setAnalyticsOverview] = useState<AnalyticsOverview | null>(null);
    const [activityMetrics, setActivityMetrics] = useState<{ period: string; dailyActivity: ActivityDataPoint[] } | null>(null);
    const [userEngagement, setUserEngagement] = useState<UserEngagementData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch analytics overview
    const fetchAnalyticsOverview = useCallback(async (filters: AnalyticsFilters = {}) => {
        try {
            setIsLoading(true);
            setError(null);

            const queryParams = new URLSearchParams();
            if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
            if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
            if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);

            const response = await adminForumAPI.getAnalyticsOverview(queryParams.toString());
            
            if (response.data) {
                setAnalyticsOverview(response.data);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to fetch analytics overview";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch activity metrics
    const fetchActivityMetrics = useCallback(async (filters: AnalyticsFilters = {}) => {
        try {
            setIsLoading(true);
            setError(null);

            const queryParams = new URLSearchParams();
            if (filters.period) queryParams.append('period', filters.period);
            if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);

            const response = await adminForumAPI.getActivityMetrics(queryParams.toString());
            
            if (response.data) {
                setActivityMetrics(response.data);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to fetch activity metrics";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch user engagement metrics
    const fetchUserEngagement = useCallback(async (filters: AnalyticsFilters = {}) => {
        try {
            setIsLoading(true);
            setError(null);

            const queryParams = new URLSearchParams();
            if (filters.period) queryParams.append('period', filters.period);
            if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);

            const response = await adminForumAPI.getUserEngagementMetrics(queryParams.toString());
            
            if (response.data) {
                setUserEngagement(response.data);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to fetch user engagement metrics";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Refresh all analytics data
    const refreshAnalytics = useCallback(async (filters: AnalyticsFilters = {}) => {
        try {
            setIsRefreshing(true);
            setError(null);

            await Promise.all([
                fetchAnalyticsOverview(filters),
                fetchActivityMetrics(filters),
                fetchUserEngagement(filters)
            ]);

            toast.success("Analytics data refreshed successfully");
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to refresh analytics";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsRefreshing(false);
        }
    }, [fetchAnalyticsOverview, fetchActivityMetrics, fetchUserEngagement]);

    // Export analytics data
    const exportAnalytics = useCallback(async (format: 'json' | 'csv' = 'json', filters: AnalyticsFilters = {}) => {
        try {
            setIsExporting(true);

            const queryParams = new URLSearchParams();
            queryParams.append('format', format);
            if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
            if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
            if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);

            const response = await adminForumAPI.exportAnalytics(queryParams.toString());

            // Create download link
            const blob = new Blob([format === 'json' ? JSON.stringify(response.data, null, 2) : response.data], {
                type: format === 'json' ? 'application/json' : 'text/csv'
            });
            
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `forum-analytics-${new Date().toISOString().split('T')[0]}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success(`Analytics exported as ${format.toUpperCase()}`);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to export analytics";
            toast.error(errorMessage);
        } finally {
            setIsExporting(false);
        }
    }, []);

    // Load initial data
    useEffect(() => {
        fetchAnalyticsOverview();
    }, [fetchAnalyticsOverview]);

    return {
        // Data
        analyticsOverview,
        activityMetrics,
        userEngagement,
        
        // Loading states
        isLoading,
        isRefreshing,
        isExporting,
        error,
        
        // Actions
        fetchAnalyticsOverview,
        fetchActivityMetrics,
        fetchUserEngagement,
        refreshAnalytics,
        exportAnalytics
    };
};

export default useForumAnalytics;