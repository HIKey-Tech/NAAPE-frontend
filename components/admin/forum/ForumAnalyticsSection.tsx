"use client";

import React, { useState, useEffect } from "react";
import { 
    FaChartLine, 
    FaChartBar,
    FaUsers, 
    FaComments,
    FaEye,
    FaDownload,
    FaSyncAlt,
    FaCalendarAlt,
    FaFilter,
    FaTrophy,
    FaExclamationTriangle,
    FaList
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format, subDays } from "date-fns";
import useForumAnalytics from "@/hooks/useForumAnalytics";
import { useAdminForumCategories } from "@/hooks/useAdminForumCategories";

const ForumAnalyticsSection: React.FC = () => {
    const {
        analyticsOverview,
        activityMetrics,
        userEngagement,
        isLoading,
        isRefreshing,
        isExporting,
        error,
        fetchAnalyticsOverview,
        fetchActivityMetrics,
        fetchUserEngagement,
        refreshAnalytics,
        exportAnalytics
    } = useForumAnalytics();

    const { data: categories } = useAdminForumCategories();

    // Filter states
    const [dateFrom, setDateFrom] = useState<string>("");
    const [dateTo, setDateTo] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedPeriod, setSelectedPeriod] = useState<string>("30");
    const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
    const [quickDateRange, setQuickDateRange] = useState<string>("");

    // Quick date range handler
    const handleQuickDateRange = (range: string) => {
        const today = new Date();
        let fromDate: Date;
        
        switch (range) {
            case 'today':
                fromDate = today;
                break;
            case 'week':
                fromDate = subDays(today, 7);
                break;
            case 'month':
                fromDate = subDays(today, 30);
                break;
            case 'quarter':
                fromDate = subDays(today, 90);
                break;
            case 'year':
                fromDate = subDays(today, 365);
                break;
            default:
                return;
        }
        
        setDateFrom(format(fromDate, 'yyyy-MM-dd'));
        setDateTo(format(today, 'yyyy-MM-dd'));
        setQuickDateRange(range);
    };

    // Apply filters
    const applyFilters = () => {
        const filters = {
            dateFrom: dateFrom || undefined,
            dateTo: dateTo || undefined,
            categoryId: selectedCategory || undefined,
            period: selectedPeriod
        };

        fetchAnalyticsOverview(filters);
        fetchActivityMetrics(filters);
        fetchUserEngagement(filters);
    };

    // Reset filters
    const resetFilters = () => {
        setDateFrom("");
        setDateTo("");
        setSelectedCategory("");
        setSelectedPeriod("30");
        setQuickDateRange("");
        
        fetchAnalyticsOverview();
        fetchActivityMetrics({ period: "30" });
        fetchUserEngagement({ period: "30" });
    };

    // Handle export
    const handleExport = () => {
        const filters = {
            dateFrom: dateFrom || undefined,
            dateTo: dateTo || undefined,
            categoryId: selectedCategory || undefined
        };
        
        exportAnalytics(exportFormat, filters);
    };

    // Set default date range (last 30 days)
    useEffect(() => {
        const today = new Date();
        const thirtyDaysAgo = subDays(today, 30);
        setDateFrom(format(thirtyDaysAgo, 'yyyy-MM-dd'));
        setDateTo(format(today, 'yyyy-MM-dd'));
    }, []);

    if (isLoading && !analyticsOverview) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (error && !analyticsOverview) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 mb-4">Error loading analytics: {error}</p>
                    <Button onClick={() => fetchAnalyticsOverview()} variant="outline">
                        <FaSyncAlt className="w-4 h-4 mr-2" />
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Forum Analytics</h1>
                    <p className="text-gray-600">Statistics and insights about forum activity</p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        onClick={applyFilters} 
                        disabled={isRefreshing}
                        variant="outline"
                        size="sm"
                    >
                        <FaSyncAlt className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button 
                        onClick={handleExport}
                        disabled={isExporting}
                        variant="outline"
                        size="sm"
                    >
                        <FaDownload className={`w-4 h-4 mr-2 ${isExporting ? 'animate-spin' : ''}`} />
                        Export
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FaFilter className="w-5 h-5" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Quick Date Range Buttons */}
                        <div>
                            <Label>Quick Date Ranges</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {[
                                    { value: 'today', label: 'Today' },
                                    { value: 'week', label: 'Last 7 days' },
                                    { value: 'month', label: 'Last 30 days' },
                                    { value: 'quarter', label: 'Last 90 days' },
                                    { value: 'year', label: 'Last year' }
                                ].map((range) => (
                                    <Button
                                        key={range.value}
                                        variant={quickDateRange === range.value ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleQuickDateRange(range.value)}
                                    >
                                        {range.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Date Range and Other Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div>
                                <Label htmlFor="dateFrom">From Date</Label>
                                <Input
                                    id="dateFrom"
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => {
                                        setDateFrom(e.target.value);
                                        setQuickDateRange("");
                                    }}
                                />
                            </div>
                            <div>
                                <Label htmlFor="dateTo">To Date</Label>
                                <Input
                                    id="dateTo"
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => {
                                        setDateTo(e.target.value);
                                        setQuickDateRange("");
                                    }}
                                />
                            </div>
                            <div>
                                <Label htmlFor="category">Category</Label>
                                <Select value={selectedCategory || ""} onValueChange={setSelectedCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All categories</SelectItem>
                                        {(categories || []).map((category) => (
                                            <SelectItem key={category._id} value={category._id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="period">Activity Period</Label>
                                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7">Last 7 days</SelectItem>
                                        <SelectItem value="30">Last 30 days</SelectItem>
                                        <SelectItem value="90">Last 90 days</SelectItem>
                                        <SelectItem value="365">Last year</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end gap-2">
                                <Button onClick={applyFilters} size="sm" className="flex-1">
                                    <FaFilter className="w-4 h-4 mr-2" />
                                    Apply
                                </Button>
                                <Button onClick={resetFilters} variant="outline" size="sm">
                                    Reset
                                </Button>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {(dateFrom || dateTo || selectedCategory || quickDateRange) && (
                            <div className="flex flex-wrap gap-2 pt-2 border-t">
                                <span className="text-sm text-gray-600">Active filters:</span>
                                {quickDateRange && (
                                    <Badge variant="secondary">
                                        {quickDateRange === 'today' ? 'Today' :
                                         quickDateRange === 'week' ? 'Last 7 days' :
                                         quickDateRange === 'month' ? 'Last 30 days' :
                                         quickDateRange === 'quarter' ? 'Last 90 days' :
                                         'Last year'}
                                    </Badge>
                                )}
                                {(dateFrom || dateTo) && !quickDateRange && (
                                    <Badge variant="secondary">
                                        {dateFrom && dateTo ? `${dateFrom} to ${dateTo}` :
                                         dateFrom ? `From ${dateFrom}` :
                                         `Until ${dateTo}`}
                                    </Badge>
                                )}
                                {selectedCategory && (
                                    <Badge variant="secondary">
                                        Category: {(categories || []).find(c => c._id === selectedCategory)?.name}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Key Metrics */}
            {analyticsOverview && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Threads</CardTitle>
                            <FaComments className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analyticsOverview.metrics.totalThreads}</div>
                            <p className="text-xs text-muted-foreground">
                                Across all categories
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Replies</CardTitle>
                            <FaComments className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analyticsOverview.metrics.totalReplies}</div>
                            <p className="text-xs text-muted-foreground">
                                Forum discussions
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                            <FaEye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analyticsOverview.metrics.totalViews.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                Thread views
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                            <FaUsers className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analyticsOverview.metrics.totalUsers}</div>
                            <p className="text-xs text-muted-foreground">
                                Registered members
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Categories</CardTitle>
                            <FaList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analyticsOverview.metrics.activeCategories}</div>
                            <p className="text-xs text-muted-foreground">
                                Active categories
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Activity Over Time Chart */}
            {analyticsOverview && analyticsOverview.activityOverTime.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FaChartLine className="w-5 h-5" />
                            Activity Over Time
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="text-sm text-gray-600">
                                Daily activity for the selected period
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Simple activity list - in a real implementation, you'd use a chart library */}
                                <div>
                                    <h4 className="font-medium mb-3">Recent Activity</h4>
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {analyticsOverview.activityOverTime.slice(-10).reverse().map((activity, index) => (
                                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                <span className="text-sm">
                                                    {format(new Date(activity.date), 'MMM dd')}
                                                </span>
                                                <div className="flex gap-4 text-xs">
                                                    <span className="text-blue-600">
                                                        {activity.threadCount} threads
                                                    </span>
                                                    <span className="text-green-600">
                                                        {activity.totalViews} views
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-3">Activity Summary</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span>Total Days:</span>
                                            <span className="font-medium">{analyticsOverview.activityOverTime.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Avg Threads/Day:</span>
                                            <span className="font-medium">
                                                {(analyticsOverview.activityOverTime.reduce((sum, day) => sum + day.threadCount, 0) / analyticsOverview.activityOverTime.length).toFixed(1)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Avg Views/Day:</span>
                                            <span className="font-medium">
                                                {(analyticsOverview.activityOverTime.reduce((sum, day) => sum + day.totalViews, 0) / analyticsOverview.activityOverTime.length).toFixed(0)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Most Active Categories */}
                {analyticsOverview && analyticsOverview.topCategories.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FaTrophy className="w-5 h-5" />
                                Most Active Categories
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analyticsOverview.topCategories.map((category, index) => (
                                    <div key={category._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <Badge variant="secondary">
                                                #{index + 1}
                                            </Badge>
                                            <div>
                                                <p className="font-medium text-gray-900">{category.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {category.threadCount} threads • {category.totalViews} views
                                                </p>
                                            </div>
                                        </div>
                                        {category.lastActivity && (
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">
                                                    Last activity
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    {format(new Date(category.lastActivity), 'MMM dd, yyyy')}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Most Active Users */}
                {analyticsOverview && analyticsOverview.topUsers.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FaUsers className="w-5 h-5" />
                                Most Active Users
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analyticsOverview.topUsers.map((user, index) => (
                                    <div key={user._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <Badge variant="secondary">
                                                #{index + 1}
                                            </Badge>
                                            <div>
                                                <p className="font-medium text-gray-900">{user.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {user.threadCount} threads • {user.replyCount} replies
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge 
                                                variant={user.role === 'admin' ? 'destructive' : user.role === 'editor' ? 'default' : 'secondary'}
                                            >
                                                {user.role}
                                            </Badge>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {user.totalViews} views
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* User Engagement Metrics */}
            {userEngagement && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FaChartBar className="w-5 h-5" />
                            User Engagement Metrics
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{userEngagement.stats.totalActiveUsers}</div>
                                <p className="text-sm text-gray-600">Active Users</p>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {userEngagement.stats.averageThreadsPerUser.toFixed(1)}
                                </div>
                                <p className="text-sm text-gray-600">Avg Threads/User</p>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {userEngagement.stats.averageRepliesPerUser.toFixed(1)}
                                </div>
                                <p className="text-sm text-gray-600">Avg Replies/User</p>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">
                                    {userEngagement.stats.totalEngagementScore}
                                </div>
                                <p className="text-sm text-gray-600">Total Engagement</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium mb-3">Top Engaged Users ({userEngagement.period})</h4>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {userEngagement.topUsers.slice(0, 10).map((user, index) => (
                                    <div key={user._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline">#{index + 1}</Badge>
                                            <div>
                                                <span className="font-medium">{user.name}</span>
                                                <span className="text-sm text-gray-500 ml-2">
                                                    ({user.role})
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 text-sm">
                                            <span className="text-blue-600">
                                                {user.threadCount}T
                                            </span>
                                            <span className="text-green-600">
                                                {user.replyCount}R
                                            </span>
                                            {user.engagementScore && (
                                                <span className="text-purple-600 font-medium">
                                                    {user.engagementScore}pts
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Export Options */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FaDownload className="w-5 h-5" />
                        Export Analytics Data
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="exportFormat">Export Format</Label>
                                <Select value={exportFormat} onValueChange={(value: 'json' | 'csv') => setExportFormat(value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="json">JSON (Complete Data)</SelectItem>
                                        <SelectItem value="csv">CSV (Threads Only)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end">
                                <Button 
                                    onClick={handleExport}
                                    disabled={isExporting}
                                    className="w-full"
                                >
                                    <FaDownload className={`w-4 h-4 mr-2 ${isExporting ? 'animate-spin' : ''}`} />
                                    {isExporting ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}
                                </Button>
                            </div>
                            <div className="flex items-end">
                                <Button 
                                    onClick={() => {
                                        const filters = {
                                            dateFrom: dateFrom || undefined,
                                            dateTo: dateTo || undefined,
                                            categoryId: selectedCategory || undefined
                                        };
                                        
                                        // Generate a summary report
                                        const summaryData = {
                                            reportDate: new Date().toISOString(),
                                            filters,
                                            summary: analyticsOverview?.metrics,
                                            topCategories: analyticsOverview?.topCategories?.slice(0, 5),
                                            topUsers: analyticsOverview?.topUsers?.slice(0, 10),
                                            userEngagement: userEngagement?.stats
                                        };
                                        
                                        const blob = new Blob([JSON.stringify(summaryData, null, 2)], {
                                            type: 'application/json'
                                        });
                                        
                                        const url = window.URL.createObjectURL(blob);
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.download = `forum-summary-${new Date().toISOString().split('T')[0]}.json`;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                        window.URL.revokeObjectURL(url);
                                        
                                        toast.success("Summary report exported");
                                    }}
                                    variant="outline"
                                    className="w-full"
                                >
                                    <FaChartLine className="w-4 h-4 mr-2" />
                                    Export Summary
                                </Button>
                            </div>
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>JSON Export:</strong> Complete analytics data including threads, replies, categories, users, and engagement metrics.</p>
                            <p><strong>CSV Export:</strong> Thread data only in spreadsheet format for easy analysis.</p>
                            <p><strong>Summary Export:</strong> Key metrics and top performers in a compact format.</p>
                            <p className="text-xs text-gray-500 mt-2">
                                All exports respect the current filter settings and include data based on your selected date range and category.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForumAnalyticsSection;