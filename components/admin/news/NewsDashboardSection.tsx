"use client";

import { useEffect } from "react";
import { useNewsStats } from "@/hooks/useAdminNews";
import { FaNewspaper, FaFileAlt, FaEye, FaComments, FaChartLine } from "react-icons/fa";

export function NewsDashboardSection() {
    const { stats, loading, fetchStats } = useNewsStats();

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!stats) return null;

    const statCards = [
        { label: "Total News", value: stats.overview.totalNews, icon: FaNewspaper, bg: "bg-primary/5", ic: "text-primary", vc: "text-slate-900" },
        { label: "Published", value: stats.overview.publishedNews, icon: FaFileAlt, bg: "bg-emerald-50", ic: "text-emerald-500", vc: "text-emerald-600" },
        { label: "Drafts", value: stats.overview.draftNews, icon: FaFileAlt, bg: "bg-amber-50", ic: "text-amber-500", vc: "text-amber-600" },
        { label: "Total Views", value: stats.overview.totalViews, icon: FaEye, bg: "bg-purple-50", ic: "text-purple-500", vc: "text-purple-600" },
        { label: "Total Comments", value: stats.overview.totalComments, icon: FaComments, bg: "bg-pink-50", ic: "text-pink-500", vc: "text-pink-600" },
    ];

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {statCards.map((s) => (
                    <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{s.label}</span>
                            <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`w-4 h-4 ${s.ic}`} /></div>
                        </div>
                        <div className={`text-2xl font-bold ${s.vc}`}>{s.value}</div>
                    </div>
                ))}
            </div>

            {/* Recent News & Top Viewed */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 p-5 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center"><FaChartLine className="w-4 h-4 text-primary" /></div>
                        <h3 className="text-base font-bold text-slate-900">Recent News</h3>
                    </div>
                    <div className="p-5 space-y-3">
                        {stats.recentNews.map((news: any) => (
                            <div key={news._id} className="flex justify-between items-center p-3 rounded-xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 transition-colors">
                                <div className="flex-1 min-w-0 mr-3">
                                    <p className="font-bold text-sm text-slate-900 truncate">{news.title}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{news.category} • {new Date(news.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${news.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                    }`}>{news.status}</span>
                            </div>
                        ))}
                        {stats.recentNews.length === 0 && (
                            <div className="text-center py-8"><p className="text-slate-400">No recent news</p></div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 p-5 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center"><FaEye className="w-4 h-4 text-purple-500" /></div>
                        <h3 className="text-base font-bold text-slate-900">Top Viewed News</h3>
                    </div>
                    <div className="p-5 space-y-3">
                        {stats.topViewedNews.map((news: any) => (
                            <div key={news._id} className="flex justify-between items-center p-3 rounded-xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 transition-colors">
                                <div className="flex-1 min-w-0 mr-3">
                                    <p className="font-bold text-sm text-slate-900 truncate">{news.title}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{news.category}</p>
                                </div>
                                <span className="text-sm font-bold text-purple-600 flex-shrink-0">{news.views} views</span>
                            </div>
                        ))}
                        {stats.topViewedNews.length === 0 && (
                            <div className="text-center py-8"><p className="text-slate-400">No data available</p></div>
                        )}
                    </div>
                </div>
            </div>

            {/* News by Category */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 p-5 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center"><FaNewspaper className="w-4 h-4 text-slate-500" /></div>
                    <h3 className="text-base font-bold text-slate-900">News by Category</h3>
                </div>
                <div className="p-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.byCategory.map((cat: any) => (
                            <div key={cat._id} className="text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <p className="text-2xl font-bold text-slate-900">{cat.count}</p>
                                <p className="text-xs text-slate-500 mt-1 font-medium">{cat._id}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
