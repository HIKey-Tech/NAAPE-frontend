"use client";

import { useEffect } from "react";
import { useNewsStats } from "@/hooks/useAdminNews";
import { FaChartBar, FaChartLine, FaNewspaper, FaEye, FaComments, FaTrophy } from "react-icons/fa";

export function NewsAnalyticsSection() {
    const { stats, loading, fetchStats } = useNewsStats();

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (!stats) return null;

    const categoryData = stats.byCategory.map((cat: any) => ({ name: cat._id, value: cat.count }));
    const categoryColors = ["bg-primary/50", "bg-emerald-500", "bg-purple-500", "bg-amber-500", "bg-pink-500", "bg-cyan-500"];
    const categoryBgColors = ["bg-primary/10 text-primary", "bg-emerald-100 text-emerald-700", "bg-purple-100 text-purple-700", "bg-amber-100 text-amber-700", "bg-pink-100 text-pink-700", "bg-cyan-100 text-cyan-700"];

    const totalNews = stats.overview.totalNews || 1;
    const publishedPct = ((stats.overview.publishedNews / totalNews) * 100).toFixed(1);
    const draftPct = ((stats.overview.draftNews / totalNews) * 100).toFixed(1);

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                {/* News by Category */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 p-5 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center"><FaChartBar className="w-4 h-4 text-primary" /></div>
                        <h3 className="text-base font-bold text-slate-900">News by Category</h3>
                    </div>
                    <div className="p-5 space-y-3">
                        {categoryData.map((cat: any, index: number) => (
                            <div key={cat.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${categoryColors[index % categoryColors.length]}`} />
                                    <span className="font-bold text-sm text-slate-700">{cat.name}</span>
                                </div>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${categoryBgColors[index % categoryBgColors.length]}`}>{cat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Distribution */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 p-5 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><FaChartLine className="w-4 h-4 text-emerald-500" /></div>
                        <h3 className="text-base font-bold text-slate-900">Status Distribution</h3>
                    </div>
                    <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                <span className="font-bold text-sm text-slate-700">Published</span>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">{stats.overview.publishedNews}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-amber-500" />
                                <span className="font-bold text-sm text-slate-700">Draft</span>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">{stats.overview.draftNews}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-slate-100">
                                <div className="bg-emerald-500 rounded-l-full transition-all duration-500" style={{ width: `${publishedPct}%` }} />
                                <div className="bg-amber-400 rounded-r-full transition-all duration-500" style={{ width: `${draftPct}%` }} />
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-slate-500">
                                <span>Published {publishedPct}%</span>
                                <span>Draft {draftPct}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Performing News */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 p-5 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center"><FaTrophy className="w-4 h-4 text-purple-500" /></div>
                    <h3 className="text-base font-bold text-slate-900">Top Performing News</h3>
                </div>
                <div className="p-5 space-y-3">
                    {stats.topViewedNews.map((news: any, index: number) => (
                        <div key={news._id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 transition-colors">
                            <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{index + 1}</div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm text-slate-900 truncate">{news.title}</p>
                                <p className="text-xs text-slate-500">{news.category}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="text-lg font-bold text-slate-900">{news.views}</p>
                                <p className="text-xs text-slate-400">views</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                {[
                    { label: "Engagement Rate", value: `${stats.overview.totalNews > 0 ? ((stats.overview.totalComments / stats.overview.totalNews) * 100).toFixed(1) : 0}%`, sub: "Comments per news article", icon: FaComments, bg: "bg-pink-50", ic: "text-pink-500" },
                    { label: "Avg Views per News", value: stats.overview.totalNews > 0 ? Math.round(stats.overview.totalViews / stats.overview.totalNews) : 0, sub: "Average views", icon: FaEye, bg: "bg-purple-50", ic: "text-purple-500" },
                    { label: "Publication Rate", value: `${stats.overview.totalNews > 0 ? ((stats.overview.publishedNews / stats.overview.totalNews) * 100).toFixed(1) : 0}%`, sub: "Published vs total", icon: FaNewspaper, bg: "bg-primary/5", ic: "text-primary" },
                ].map((s, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
                        <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center mx-auto mb-3`}><s.icon className={`w-6 h-6 ${s.ic}`} /></div>
                        <p className="text-3xl font-bold text-slate-900">{s.value}</p>
                        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide font-bold">{s.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{s.sub}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
