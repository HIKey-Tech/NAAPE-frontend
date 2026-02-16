"use client";

import React from "react";
import { 
    FaChartLine, 
    FaComments, 
    FaUsers, 
    FaFlag, 
    FaList,
    FaSyncAlt,
    FaEye,
    FaClock,
    FaCheckCircle,
    FaExclamationTriangle
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import ErrorBoundary from "../../ui/error-boundary";
import useForumDashboard, { ActivityItem } from "@/hooks/useForumDashboard";

const ForumDashboardSection: React.FC = () => {
    const {
        dashboardData,
        recentActivity,
        isLoading,
        isRefreshing,
        error,
        refreshDashboard
    } = useForumDashboard();

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'thread':
                return <FaComments className="w-4 h-4 text-blue-500" />;
            case 'reply':
                return <FaComments className="w-4 h-4 text-green-500" />;
            case 'report':
                return <FaFlag className="w-4 h-4 text-red-500" />;
            default:
                return <FaClock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getActivityDescription = (activity: ActivityItem) => {
        switch (activity.type) {
            case 'thread':
                return `New thread: "${activity.data.title}" by ${activity.data.author?.name}`;
            case 'reply':
                return `New reply in "${activity.data.thread?.title}" by ${activity.data.author?.name}`;
            case 'report':
                return `New ${activity.data.reportType} report: ${activity.data.reason}`;
            default:
                return 'Unknown activity';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 mb-4">Error loading dashboard: {error}</p>
                    <Button onClick={refreshDashboard} variant="outline">
                        <FaSyncAlt className="w-4 h-4 mr-2" />
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Forum Dashboard</h1>
                    <p className="text-gray-600">Overview of forum activity and key metrics</p>
                </div>
                <Button 
                    onClick={refreshDashboard} 
                    disabled={isRefreshing}
                    variant="outline"
                    size="sm"
                >
                    <FaSyncAlt className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Threads</CardTitle>
                        <FaComments className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardData?.metrics.totalThreads || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            +{dashboardData?.recentActivity.recentThreads || 0} in last {dashboardData?.recentActivity.period || '7 days'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Replies</CardTitle>
                        <FaComments className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardData?.metrics.totalReplies || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            +{dashboardData?.recentActivity.recentReplies || 0} in last {dashboardData?.recentActivity.period || '7 days'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <FaUsers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardData?.metrics.activeUsers || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Registered members
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                        <FaFlag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{dashboardData?.metrics.pendingReports || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Require attention
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Categories</CardTitle>
                        <FaList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardData?.metrics.totalCategories || 0}</div>
                        <p className="text-xs text-muted-foreground">Active categories</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                        <FaClock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{dashboardData?.metrics.pendingApprovals || 0}</div>
                        <p className="text-xs text-muted-foreground">Awaiting review</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Bans</CardTitle>
                        <FaExclamationTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{dashboardData?.metrics.activeBans || 0}</div>
                        <p className="text-xs text-muted-foreground">Restricted users</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FaClock className="w-5 h-5" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.length > 0 ? (
                                recentActivity.slice(0, 8).map((activity, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                                        {getActivityIcon(activity.type)}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900 truncate">
                                                {getActivityDescription(activity)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">No recent activity</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Categories */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FaChartLine className="w-5 h-5" />
                            Most Active Categories
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {dashboardData?.topCategories && dashboardData.topCategories.length > 0 ? (
                                dashboardData.topCategories.map((category, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{category.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {category.threadCount} threads
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="secondary">
                                                #{index + 1}
                                            </Badge>
                                            {category.lastActivity && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {format(new Date(category.lastActivity), 'MMM dd')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">No category data available</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button 
                            variant="outline" 
                            className="flex items-center gap-2 h-auto p-4"
                            onClick={() => window.location.href = '/admin/forum/categories'}
                        >
                            <FaList className="w-5 h-5" />
                            <div className="text-left">
                                <div className="font-medium">Manage Categories</div>
                                <div className="text-sm text-gray-500">Create, edit, reorder</div>
                            </div>
                        </Button>

                        <Button 
                            variant="outline" 
                            className="flex items-center gap-2 h-auto p-4"
                            onClick={() => window.location.href = '/admin/forum/moderation'}
                        >
                            <FaCheckCircle className="w-5 h-5" />
                            <div className="text-left">
                                <div className="font-medium">Moderate Content</div>
                                <div className="text-sm text-gray-500">Review threads & replies</div>
                            </div>
                        </Button>

                        <Button 
                            variant="outline" 
                            className="flex items-center gap-2 h-auto p-4"
                            onClick={() => window.location.href = '/admin/forum/reports'}
                        >
                            <FaFlag className="w-5 h-5" />
                            <div className="text-left">
                                <div className="font-medium">Handle Reports</div>
                                <div className="text-sm text-gray-500">
                                    {dashboardData?.metrics.pendingReports || 0} pending
                                </div>
                            </div>
                        </Button>

                        <Button 
                            variant="outline" 
                            className="flex items-center gap-2 h-auto p-4"
                            onClick={() => window.location.href = '/admin/forum/analytics'}
                        >
                            <FaChartLine className="w-5 h-5" />
                            <div className="text-left">
                                <div className="font-medium">View Analytics</div>
                                <div className="text-sm text-gray-500">Statistics & insights</div>
                            </div>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
        </ErrorBoundary>
    );
};

export default ForumDashboardSection;