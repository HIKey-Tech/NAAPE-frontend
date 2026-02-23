"use client";

import React, { useState, useEffect } from "react";
import { FaChartLine, FaChartBar, FaUsers, FaComments, FaEye, FaDownload, FaSyncAlt, FaFilter, FaTrophy, FaExclamationTriangle, FaList } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format, subDays } from "date-fns";
import useForumAnalytics from "@/hooks/useForumAnalytics";
import { useAdminForumCategories } from "@/hooks/useAdminForumCategories";

const ForumAnalyticsSection: React.FC = () => {
    const { analyticsOverview, userEngagement, isLoading, isRefreshing, isExporting, error, fetchAnalyticsOverview, fetchActivityMetrics, fetchUserEngagement, exportAnalytics } = useForumAnalytics();
    const { data: categories } = useAdminForumCategories();

    const [dateFrom, setDateFrom] = useState<string>("");
    const [dateTo, setDateTo] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedPeriod, setSelectedPeriod] = useState<string>("30");
    const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
    const [quickDateRange, setQuickDateRange] = useState<string>("");

    const handleQuickDateRange = (range: string) => {
        const today = new Date(); let from: Date;
        switch (range) { case 'today': from = today; break; case 'week': from = subDays(today, 7); break; case 'month': from = subDays(today, 30); break; case 'quarter': from = subDays(today, 90); break; case 'year': from = subDays(today, 365); break; default: return; }
        setDateFrom(format(from, 'yyyy-MM-dd')); setDateTo(format(today, 'yyyy-MM-dd')); setQuickDateRange(range);
    };

    const applyFilters = () => { const f = { dateFrom: dateFrom || undefined, dateTo: dateTo || undefined, categoryId: selectedCategory === "all" ? undefined : selectedCategory || undefined, period: selectedPeriod }; fetchAnalyticsOverview(f); fetchActivityMetrics(f); fetchUserEngagement(f); };
    const resetFilters = () => { setDateFrom(""); setDateTo(""); setSelectedCategory("all"); setSelectedPeriod("30"); setQuickDateRange(""); fetchAnalyticsOverview(); fetchActivityMetrics({ period: "30" }); fetchUserEngagement({ period: "30" }); };
    const handleExport = () => { exportAnalytics(exportFormat, { dateFrom: dateFrom || undefined, dateTo: dateTo || undefined, categoryId: selectedCategory === "all" ? undefined : selectedCategory || undefined }); };

    useEffect(() => { const today = new Date(); setDateFrom(format(subDays(today, 30), 'yyyy-MM-dd')); setDateTo(format(today, 'yyyy-MM-dd')); }, []);

    if (isLoading && !analyticsOverview) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
    if (error && !analyticsOverview) return (
        <div className="flex items-center justify-center h-64"><div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><FaExclamationTriangle className="text-2xl text-red-400" /></div>
            <p className="text-sm text-red-500 mb-4">{error}</p>
            <Button onClick={() => fetchAnalyticsOverview()} variant="outline" className="rounded-xl font-bold"><FaSyncAlt className="w-3 h-3 mr-2" /> Retry</Button>
        </div></div>
    );

    const metricStats = analyticsOverview ? [
        { label: "Total Threads", value: analyticsOverview.metrics.totalThreads, sub: "Across all categories", icon: FaComments, iconClass: "text-primary bg-primary/5" },
        { label: "Total Replies", value: analyticsOverview.metrics.totalReplies, sub: "Forum discussions", icon: FaComments, iconClass: "text-emerald-600 bg-emerald-50" },
        { label: "Total Views", value: analyticsOverview.metrics.totalViews.toLocaleString(), sub: "Thread views", icon: FaEye, iconClass: "text-violet-600 bg-violet-50" },
        { label: "Active Users", value: analyticsOverview.metrics.totalUsers, sub: "Registered members", icon: FaUsers, iconClass: "text-amber-600 bg-amber-50" },
        { label: "Categories", value: analyticsOverview.metrics.activeCategories, sub: "Active categories", icon: FaList, iconClass: "text-pink-600 bg-pink-50" },
    ] : [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div><h1 className="text-2xl font-black text-slate-900">Forum Analytics</h1><p className="text-slate-500 text-sm">Statistics and insights about forum activity</p></div>
                <div className="flex gap-2">
                    <Button onClick={applyFilters} disabled={isRefreshing} variant="outline" size="sm" className="rounded-xl font-bold"><FaSyncAlt className={`w-3 h-3 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh</Button>
                    <Button onClick={handleExport} disabled={isExporting} variant="outline" size="sm" className="rounded-xl font-bold"><FaDownload className={`w-3 h-3 mr-2 ${isExporting ? 'animate-spin' : ''}`} /> Export</Button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                <div className="flex items-center gap-2"><div className="p-2 bg-slate-100 rounded-xl"><FaFilter className="text-slate-500" size={14} /></div><h3 className="text-sm font-black text-slate-700">Filters</h3></div>
                <div>
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Quick Ranges</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {[{ v: 'today', l: 'Today' }, { v: 'week', l: '7 Days' }, { v: 'month', l: '30 Days' }, { v: 'quarter', l: '90 Days' }, { v: 'year', l: 'Year' }].map(r => (
                            <Button key={r.v} variant={quickDateRange === r.v ? "default" : "outline"} size="sm" onClick={() => handleQuickDateRange(r.v)} className="rounded-xl text-xs font-bold">{r.l}</Button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                    <div className="space-y-1.5"><Label className="text-xs font-bold text-slate-400 uppercase tracking-wide">From</Label><Input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setQuickDateRange(""); }} className="rounded-xl border-slate-200" /></div>
                    <div className="space-y-1.5"><Label className="text-xs font-bold text-slate-400 uppercase tracking-wide">To</Label><Input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setQuickDateRange(""); }} className="rounded-xl border-slate-200" /></div>
                    <div className="space-y-1.5"><Label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Category</Label><Select value={selectedCategory || "all"} onValueChange={setSelectedCategory}><SelectTrigger className="rounded-xl border-slate-200"><SelectValue placeholder="All categories" /></SelectTrigger><SelectContent><SelectItem value="all">All categories</SelectItem>{(categories || []).map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
                    <div className="space-y-1.5"><Label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Period</Label><Select value={selectedPeriod} onValueChange={setSelectedPeriod}><SelectTrigger className="rounded-xl border-slate-200"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="7">7 days</SelectItem><SelectItem value="30">30 days</SelectItem><SelectItem value="90">90 days</SelectItem><SelectItem value="365">Year</SelectItem></SelectContent></Select></div>
                    <div className="flex items-end gap-2"><Button onClick={applyFilters} size="sm" className="flex-1 bg-primary rounded-xl font-bold"><FaFilter className="w-3 h-3 mr-1" /> Apply</Button><Button onClick={resetFilters} variant="outline" size="sm" className="rounded-xl font-bold">Reset</Button></div>
                </div>
                {(dateFrom || dateTo || selectedCategory || quickDateRange) && (
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-400">Active:</span>
                        {quickDateRange && <span className="inline-flex px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[10px] font-bold">{quickDateRange === 'today' ? 'Today' : quickDateRange === 'week' ? '7 days' : quickDateRange === 'month' ? '30 days' : quickDateRange === 'quarter' ? '90 days' : 'Year'}</span>}
                        {(dateFrom || dateTo) && !quickDateRange && <span className="inline-flex px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[10px] font-bold">{dateFrom && dateTo ? `${dateFrom} to ${dateTo}` : dateFrom ? `From ${dateFrom}` : `Until ${dateTo}`}</span>}
                        {selectedCategory && selectedCategory !== "all" && <span className="inline-flex px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 text-[10px] font-bold">Category: {(categories || []).find(c => c._id === selectedCategory)?.name}</span>}
                    </div>
                )}
            </div>

            {/* Key Metrics */}
            {analyticsOverview && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {metricStats.map(s => (
                        <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconClass}`}><s.icon size={16} /></div>
                            <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{s.label}</p><p className="text-xl font-black text-slate-800">{s.value}</p><p className="text-[10px] text-slate-400">{s.sub}</p></div>
                        </div>
                    ))}
                </div>
            )}

            {/* Activity Over Time */}
            {analyticsOverview && analyticsOverview.activityOverTime.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4"><div className="p-2 bg-primary/5 rounded-xl"><FaChartLine className="text-primary" size={14} /></div><h3 className="text-sm font-black text-slate-700">Activity Over Time</h3></div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Recent Activity</h4>
                            <div className="space-y-1.5 max-h-64 overflow-y-auto">
                                {analyticsOverview.activityOverTime.slice(-10).reverse().map((a, i) => (
                                    <div key={i} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                                        <span className="text-xs font-bold text-slate-600">{a.date ? format(new Date(a.date), 'MMM dd') : 'Unknown'}</span>
                                        <div className="flex gap-4 text-xs"><span className="text-primary font-bold">{a.threadCount} threads</span><span className="text-emerald-600 font-bold">{a.totalViews} views</span></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Summary</h4>
                            <div className="space-y-3 bg-slate-50 rounded-xl p-4">
                                {[{ l: "Total Days", v: analyticsOverview.activityOverTime.length }, { l: "Avg Threads/Day", v: (analyticsOverview.activityOverTime.reduce((s, d) => s + d.threadCount, 0) / analyticsOverview.activityOverTime.length).toFixed(1) }, { l: "Avg Views/Day", v: (analyticsOverview.activityOverTime.reduce((s, d) => s + d.totalViews, 0) / analyticsOverview.activityOverTime.length).toFixed(0) }].map(r => (
                                    <div key={r.l} className="flex justify-between"><span className="text-xs text-slate-500">{r.l}</span><span className="text-xs font-bold text-slate-700">{r.v}</span></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Categories */}
                {analyticsOverview && analyticsOverview.topCategories.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-4"><div className="p-2 bg-amber-50 rounded-xl"><FaTrophy className="text-amber-600" size={14} /></div><h3 className="text-sm font-black text-slate-700">Most Active Categories</h3></div>
                        <div className="space-y-2">
                            {analyticsOverview.topCategories.map((c, i) => (
                                <div key={c._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[10px] font-bold">#{i + 1}</span>
                                        <div><p className="text-sm font-bold text-slate-700">{c.name}</p><p className="text-xs text-slate-400">{c.threadCount} threads • {c.totalViews} views</p></div>
                                    </div>
                                    {c.lastActivity && <div className="text-right"><p className="text-[10px] text-slate-400">Last activity</p><p className="text-xs font-bold text-slate-500">{format(new Date(c.lastActivity), 'MMM dd, yyyy')}</p></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Top Users */}
                {analyticsOverview && analyticsOverview.topUsers.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-4"><div className="p-2 bg-violet-50 rounded-xl"><FaUsers className="text-violet-600" size={14} /></div><h3 className="text-sm font-black text-slate-700">Most Active Users</h3></div>
                        <div className="space-y-2">
                            {analyticsOverview.topUsers.map((u, i) => (
                                <div key={u._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[10px] font-bold">#{i + 1}</span>
                                        <div><p className="text-sm font-bold text-slate-700">{u.name}</p><p className="text-xs text-slate-400">{u.threadCount} threads • {u.replyCount} replies</p></div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${u.role === 'admin' ? 'bg-red-50 text-red-700' : u.role === 'editor' ? 'bg-primary/5 text-primary' : 'bg-slate-100 text-slate-600'}`}>{u.role}</span>
                                        <p className="text-[10px] text-slate-400 mt-1">{u.totalViews} views</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* User Engagement */}
            {userEngagement && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4"><div className="p-2 bg-emerald-50 rounded-xl"><FaChartBar className="text-emerald-600" size={14} /></div><h3 className="text-sm font-black text-slate-700">User Engagement</h3></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {[{ l: "Active Users", v: userEngagement.stats.totalActiveUsers, c: "text-primary" }, { l: "Avg Threads/User", v: userEngagement.stats.averageThreadsPerUser.toFixed(1), c: "text-emerald-600" }, { l: "Avg Replies/User", v: userEngagement.stats.averageRepliesPerUser.toFixed(1), c: "text-violet-600" }, { l: "Total Engagement", v: userEngagement.stats.totalEngagementScore, c: "text-amber-600" }].map(s => (
                            <div key={s.l} className="bg-slate-50 rounded-xl p-4 text-center">
                                <div className={`text-2xl font-black ${s.c}`}>{s.v}</div>
                                <p className="text-xs text-slate-400 mt-1">{s.l}</p>
                            </div>
                        ))}
                    </div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Top Engaged Users ({userEngagement.period})</h4>
                    <div className="space-y-1.5 max-h-64 overflow-y-auto">
                        {userEngagement.topUsers.slice(0, 10).map((u, i) => (
                            <div key={u._id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-primary/5 text-primary text-[10px] font-bold">{i + 1}</span>
                                    <div><span className="text-sm font-bold text-slate-700">{u.name}</span><span className="text-xs text-slate-400 ml-2">({u.role})</span></div>
                                </div>
                                <div className="flex gap-3 text-xs">
                                    <span className="text-primary font-bold">{u.threadCount}T</span>
                                    <span className="text-emerald-600 font-bold">{u.replyCount}R</span>
                                    {u.engagementScore && <span className="text-violet-600 font-bold">{u.engagementScore}pts</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Export */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4"><div className="p-2 bg-slate-100 rounded-xl"><FaDownload className="text-slate-500" size={14} /></div><h3 className="text-sm font-black text-slate-700">Export Analytics</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-1.5"><Label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Format</Label><Select value={exportFormat} onValueChange={(v: 'json' | 'csv') => setExportFormat(v)}><SelectTrigger className="rounded-xl border-slate-200"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="json">JSON (Complete)</SelectItem><SelectItem value="csv">CSV (Threads)</SelectItem></SelectContent></Select></div>
                    <div className="flex items-end"><Button onClick={handleExport} disabled={isExporting} className="w-full bg-primary rounded-xl font-bold shadow-md shadow-primary/20"><FaDownload className={`w-3 h-3 mr-2 ${isExporting ? 'animate-spin' : ''}`} />{isExporting ? 'Exporting...' : `Export ${exportFormat.toUpperCase()}`}</Button></div>
                    <div className="flex items-end"><Button onClick={() => {
                        const f = { dateFrom: dateFrom || undefined, dateTo: dateTo || undefined, categoryId: selectedCategory || undefined };
                        const d = { reportDate: new Date().toISOString(), filters: f, summary: analyticsOverview?.metrics, topCategories: analyticsOverview?.topCategories?.slice(0, 5), topUsers: analyticsOverview?.topUsers?.slice(0, 10), userEngagement: userEngagement?.stats };
                        const blob = new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' }); const url = window.URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `forum-summary-${new Date().toISOString().split('T')[0]}.json`; document.body.appendChild(a); a.click(); document.body.removeChild(a); window.URL.revokeObjectURL(url); toast.success("Summary exported");
                    }} variant="outline" className="w-full rounded-xl font-bold"><FaChartLine className="w-3 h-3 mr-2" /> Export Summary</Button></div>
                </div>
                <div className="text-xs text-slate-400 space-y-1 bg-slate-50 p-3 rounded-xl">
                    <p><strong className="text-slate-500">JSON:</strong> Complete analytics data including threads, replies, categories, users, and engagement.</p>
                    <p><strong className="text-slate-500">CSV:</strong> Thread data only in spreadsheet format.</p>
                    <p><strong className="text-slate-500">Summary:</strong> Key metrics and top performers in a compact format.</p>
                    <p className="text-[10px] text-slate-400 mt-2">All exports respect current filter settings.</p>
                </div>
            </div>
        </div>
    );
};

export default ForumAnalyticsSection;