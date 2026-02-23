"use client";

import React from "react";
import { FaChartLine, FaComments, FaUsers, FaFlag, FaList, FaSyncAlt, FaClock, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import ErrorBoundary from "../../ui/error-boundary";
import useForumDashboard, { ActivityItem } from "@/hooks/useForumDashboard";

const ForumDashboardSection: React.FC = () => {
    const { dashboardData, recentActivity, isLoading, isRefreshing, error, refreshDashboard } = useForumDashboard();

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'thread': return <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center"><FaComments className="w-3.5 h-3.5 text-primary" /></div>;
            case 'reply': return <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><FaComments className="w-3.5 h-3.5 text-emerald-600" /></div>;
            case 'report': return <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center"><FaFlag className="w-3.5 h-3.5 text-red-600" /></div>;
            default: return <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center"><FaClock className="w-3.5 h-3.5 text-slate-400" /></div>;
        }
    };

    const getActivityDescription = (activity: ActivityItem) => {
        switch (activity.type) {
            case 'thread': return `New thread: "${activity.data.title}" by ${activity.data.author?.name}`;
            case 'reply': return `New reply in "${activity.data.thread?.title}" by ${activity.data.author?.name}`;
            case 'report': return `New ${activity.data.reportType} report: ${activity.data.reason}`;
            default: return 'Unknown activity';
        }
    };

    if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
    if (error) return (
        <div className="flex items-center justify-center h-64"><div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><FaExclamationTriangle className="text-2xl text-red-400" /></div>
            <p className="text-sm text-red-500 mb-4">{error}</p>
            <Button onClick={refreshDashboard} variant="outline" className="rounded-xl font-bold"><FaSyncAlt className="w-3 h-3 mr-2" /> Retry</Button>
        </div></div>
    );

    const stats = [
        { label: "Total Threads", value: dashboardData?.metrics.totalThreads || 0, sub: `+${dashboardData?.recentActivity.recentThreads || 0} in last ${dashboardData?.recentActivity.period || '7 days'}`, icon: FaComments, iconClass: "text-primary bg-primary/5" },
        { label: "Total Replies", value: dashboardData?.metrics.totalReplies || 0, sub: `+${dashboardData?.recentActivity.recentReplies || 0} in last ${dashboardData?.recentActivity.period || '7 days'}`, icon: FaComments, iconClass: "text-emerald-600 bg-emerald-50" },
        { label: "Active Users", value: dashboardData?.metrics.activeUsers || 0, sub: "Registered members", icon: FaUsers, iconClass: "text-violet-600 bg-violet-50" },
        { label: "Pending Reports", value: dashboardData?.metrics.pendingReports || 0, sub: "Require attention", icon: FaFlag, iconClass: "text-red-600 bg-red-50" },
    ];

    const secondaryStats = [
        { label: "Categories", value: dashboardData?.metrics.totalCategories || 0, sub: "Active categories", icon: FaList, iconClass: "text-primary bg-primary/5" },
        { label: "Pending Approvals", value: dashboardData?.metrics.pendingApprovals || 0, sub: "Awaiting review", icon: FaClock, iconClass: "text-amber-600 bg-amber-50" },
        { label: "Active Bans", value: dashboardData?.metrics.activeBans || 0, sub: "Restricted users", icon: FaExclamationTriangle, iconClass: "text-red-600 bg-red-50" },
    ];

    const quickActions = [
        { label: "Manage Categories", desc: "Create, edit, reorder", icon: FaList, href: '/admin/forum/categories' },
        { label: "Moderate Content", desc: "Review threads & replies", icon: FaCheckCircle, href: '/admin/forum/moderation' },
        { label: "Handle Reports", desc: `${dashboardData?.metrics.pendingReports || 0} pending`, icon: FaFlag, href: '/admin/forum/reports' },
        { label: "View Analytics", desc: "Statistics & insights", icon: FaChartLine, href: '/admin/forum/analytics' },
    ];

    return (
        <ErrorBoundary>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900">Forum Dashboard</h1>
                        <p className="text-slate-500 text-sm">Overview of forum activity and key metrics</p>
                    </div>
                    <Button onClick={refreshDashboard} disabled={isRefreshing} variant="outline" size="sm" className="rounded-xl font-bold">
                        <FaSyncAlt className={`w-3 h-3 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh
                    </Button>
                </div>

                {/* Primary Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map(s => (
                        <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.iconClass}`}><s.icon size={20} /></div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{s.label}</p>
                                <p className="text-2xl font-black text-slate-800">{s.value}</p>
                                <p className="text-[10px] text-slate-400">{s.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Secondary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {secondaryStats.map(s => (
                        <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconClass}`}><s.icon size={16} /></div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{s.label}</p>
                                <p className="text-xl font-black text-slate-800">{s.value}</p>
                                <p className="text-[10px] text-slate-400">{s.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-slate-100 rounded-xl"><FaClock className="text-slate-500" size={14} /></div>
                            <h3 className="text-sm font-black text-slate-700">Recent Activity</h3>
                        </div>
                        <div className="space-y-2">
                            {recentActivity.length > 0 ? recentActivity.slice(0, 8).map((activity, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                                    {getActivityIcon(activity.type)}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-700 truncate">{getActivityDescription(activity)}</p>
                                        <p className="text-xs text-slate-400">{format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}</p>
                                    </div>
                                </div>
                            )) : <p className="text-slate-400 text-sm text-center py-8">No recent activity</p>}
                        </div>
                    </div>

                    {/* Top Categories */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-emerald-50 rounded-xl"><FaChartLine className="text-emerald-600" size={14} /></div>
                            <h3 className="text-sm font-black text-slate-700">Most Active Categories</h3>
                        </div>
                        <div className="space-y-2">
                            {dashboardData?.topCategories && dashboardData.topCategories.length > 0 ? dashboardData.topCategories.map((category, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                                    <div className="flex-1">
                                        <p className="font-bold text-sm text-slate-700">{category.name}</p>
                                        <p className="text-xs text-slate-400">{category.threadCount} threads</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-flex px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[10px] font-bold">#{index + 1}</span>
                                        {category.lastActivity && <p className="text-[10px] text-slate-400 mt-1">{format(new Date(category.lastActivity), 'MMM dd')}</p>}
                                    </div>
                                </div>
                            )) : <p className="text-slate-400 text-sm text-center py-8">No category data available</p>}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h3 className="text-sm font-black text-slate-700 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {quickActions.map(a => (
                            <button key={a.label} onClick={() => window.location.href = a.href} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all text-left">
                                <div className="p-2 bg-primary/5 rounded-lg"><a.icon className="w-4 h-4 text-primary" /></div>
                                <div><div className="text-sm font-bold text-slate-700">{a.label}</div><div className="text-xs text-slate-400">{a.desc}</div></div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default ForumDashboardSection;