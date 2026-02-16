"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";

interface ForumMetrics {
    totalThreads: number;
    totalReplies: number;
    totalCategories: number;
    pendingReports: number;
    activeUsers: number;
    pendingApprovals: number;
    activeBans: number;
}

interface RecentActivity {
    recentThreads: number;
    recentReplies: number;
    period: string;
}

interface TopCategory {
    name: string;
    threadCount: number;
    lastActivity: string;
}

interface DashboardData {
    metrics: ForumMetrics;
    recentActivity: RecentActivity;
    topCategories: TopCategory[];
}

export interface ActivityItem {
    type: 'thread' | 'reply' | 'report';
    data: any;
    timestamp: string;
}

export const useForumDashboard = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = useCallback(async () => {
        try {
            const response = await api.get('/admin/forum/dashboard');
            setDashboardData(response.data.data);
            setError(null);
            return response.data.data;
        } catch (err: any) {
            console.error('Error fetching dashboard data:', err);
            const errorMessage = err.response?.data?.message || err.message;
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    }, []);

    const fetchRecentActivity = useCallback(async (limit: number = 10) => {
        try {
            const response = await api.get(`/admin/forum/activity?limit=${limit}`);
            setRecentActivity(response.data.data);
            return response.data.data;
        } catch (err: any) {
            console.error('Error fetching recent activity:', err);
            throw err;
        }
    }, []);

    const refreshDashboard = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await Promise.all([fetchDashboardData(), fetchRecentActivity()]);
            toast.success('Dashboard refreshed');
        } catch (err: any) {
            toast.error('Failed to refresh dashboard');
        } finally {
            setIsRefreshing(false);
        }
    }, [fetchDashboardData, fetchRecentActivity]);

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([fetchDashboardData(), fetchRecentActivity()]);
            } catch (err: any) {
                toast.error('Failed to load dashboard data');
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();

        // Set up auto-refresh every 5 minutes
        const interval = setInterval(() => {
            fetchDashboardData();
            fetchRecentActivity();
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [fetchDashboardData, fetchRecentActivity]);

    return {
        dashboardData,
        recentActivity,
        isLoading,
        isRefreshing,
        error,
        refreshDashboard,
        fetchDashboardData,
        fetchRecentActivity
    };
};

export default useForumDashboard;