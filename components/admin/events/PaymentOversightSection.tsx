"use client";

import React, { useState, useMemo } from "react";
import { useAdminEventPayments } from "@/hooks/useAdminEventPayments";
import { FaDownload, FaSearch, FaChartLine, FaMoneyBillWave, FaCheckCircle, FaClock, FaTimesCircle, FaEye, FaCalendarAlt } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventPayment {
    _id: string;
    user: { _id: string; firstName: string; lastName: string; email: string; profilePicture?: string; };
    type: string; transactionId: string; amount: number; currency: string; status: string;
    metadata: { eventId: string; eventTitle: string; };
    eventDetails?: { _id: string; title: string; date: string; location: string; price: number; };
    createdAt: string;
}
interface EventStats { _id: string; eventTitle: string; count: number; totalAmount: number; statuses: string[]; }
type PaymentStatus = 'all' | 'success' | 'successful' | 'completed' | 'pending' | 'failed' | 'cancelled';

const statusBadge: Record<string, string> = {
    success: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    successful: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    completed: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    pending: "bg-amber-50 text-amber-700 border border-amber-100",
    failed: "bg-red-50 text-red-700 border border-red-100",
    cancelled: "bg-red-50 text-red-700 border border-red-100",
};
const statusLabel: Record<string, string> = { success: "Paid", successful: "Paid", completed: "Completed", pending: "Pending", failed: "Failed", cancelled: "Cancelled" };
const isSuccessfulPayment = (status: string) => status === "success" || status === "successful" || status === "completed";

export default function PaymentOversightSection() {
    const [selectedEvent, setSelectedEvent] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<PaymentStatus>('all');
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const { payments = [], eventStats = [], loading, error } = useAdminEventPayments(selectedEvent);

    const analytics = useMemo(() => {
        const filteredPayments = payments.filter((p: EventPayment) => {
            const s = searchTerm.toLowerCase();
            const matchesSearch = !s || (p.user?.firstName?.toLowerCase() || "").includes(s) || (p.user?.lastName?.toLowerCase() || "").includes(s) || (p.user?.email?.toLowerCase() || "").includes(s) || (p.metadata?.eventTitle?.toLowerCase() || "").includes(s);
            const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
            const matchesDate = (!dateRange.start || new Date(p.createdAt) >= new Date(dateRange.start)) && (!dateRange.end || new Date(p.createdAt) <= new Date(dateRange.end));
            return matchesSearch && matchesStatus && matchesDate;
        });
        const totalRevenue = filteredPayments.filter((p: EventPayment) => isSuccessfulPayment(p.status)).reduce((s: number, p: EventPayment) => s + p.amount, 0);
        const successfulPayments = filteredPayments.filter((p: EventPayment) => isSuccessfulPayment(p.status)).length;
        const pendingPayments = filteredPayments.filter((p: EventPayment) => p.status === 'pending').length;
        const failedPayments = filteredPayments.filter((p: EventPayment) => p.status === 'failed' || p.status === 'cancelled').length;
        const revenueByEvent = filteredPayments.filter((p: EventPayment) => isSuccessfulPayment(p.status)).reduce((acc: Record<string, { title: string; revenue: number; count: number }>, p: EventPayment) => {
            const id = p.metadata?.eventId || 'unknown'; const title = p.metadata?.eventTitle || 'Unknown Event';
            if (!acc[id]) acc[id] = { title, revenue: 0, count: 0 }; acc[id].revenue += p.amount; acc[id].count += 1; return acc;
        }, {});
        return { filteredPayments, totalRevenue, successfulPayments, pendingPayments, failedPayments, totalTransactions: filteredPayments.length, revenueByEvent: Object.entries(revenueByEvent).map(([id, d]) => ({ eventId: id, ...d })).sort((a, b) => b.revenue - a.revenue) };
    }, [payments, searchTerm, statusFilter, dateRange]);

    const formatAmount = (amount: number, currency: string = "NGN") => new Intl.NumberFormat("en-NG", { style: "currency", currency }).format(amount);
    const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

    const handleExport = () => {
        const csvData = analytics.filteredPayments.map((p: EventPayment) => ({ 'Name': `${p.user?.firstName || ''} ${p.user?.lastName || ''}`, 'Email': p.user?.email || '', 'Event': p.metadata?.eventTitle || '', 'Amount': p.amount, 'Currency': p.currency, 'Status': p.status, 'TX ID': p.transactionId, 'Date': formatDate(p.createdAt) }));
        const csv = [Object.keys(csvData[0] || {}).join(','), ...csvData.map(r => Object.values(r).map(v => `"${v}"`).join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `event-payments-${new Date().toISOString().split('T')[0]}.csv`; a.click(); URL.revokeObjectURL(url);
    };

    const clearFilters = () => { setSelectedEvent(""); setSearchTerm(""); setStatusFilter('all'); setDateRange({ start: "", end: "" }); };

    const stats = [
        { label: "Total Revenue", value: formatAmount(analytics.totalRevenue), sub: `From ${analytics.successfulPayments} payments`, iconClass: "text-emerald-600 bg-emerald-50", icon: FaMoneyBillWave },
        { label: "Successful", value: analytics.successfulPayments, sub: analytics.totalTransactions > 0 ? `${Math.round((analytics.successfulPayments / analytics.totalTransactions) * 100)}% success` : "No transactions", iconClass: "text-primary bg-primary/5", icon: FaCheckCircle },
        { label: "Pending", value: analytics.pendingPayments, sub: "Awaiting completion", iconClass: "text-amber-600 bg-amber-50", icon: FaClock },
        { label: "Failed", value: analytics.failedPayments, sub: "Require attention", iconClass: "text-red-600 bg-red-50", icon: FaTimesCircle },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-slate-900">Payment Oversight</h1>
                <p className="text-slate-500 text-sm">Monitor event revenue, analyze payment trends, and track performance</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.iconClass}`}><s.icon size={20} /></div>
                        <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{s.label}</p><p className="text-2xl font-black text-slate-800">{s.value}</p><p className="text-[10px] text-slate-400">{s.sub}</p></div>
                    </div>
                ))}
            </div>

            {/* Revenue by Event */}
            {analytics.revenueByEvent.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4"><div className="p-2 bg-emerald-50 rounded-xl"><FaChartLine className="text-emerald-600" size={16} /></div><h2 className="text-sm font-black text-slate-700">Revenue by Event</h2></div>
                    <div className="space-y-2">
                        {analytics.revenueByEvent.slice(0, 5).map(e => (
                            <div key={e.eventId} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <div><p className="text-sm font-bold text-slate-700">{e.title}</p><p className="text-xs text-slate-400">{e.count} payments</p></div>
                                <p className="text-sm font-black text-emerald-600">{formatAmount(e.revenue)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Filter & Search</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={clearFilters} className="rounded-xl text-xs font-bold">Clear</Button>
                        <Button size="sm" onClick={handleExport} className="bg-primary rounded-xl text-xs font-bold shadow-md shadow-primary/20"><FaDownload size={10} className="mr-1" /> Export CSV</Button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Select value={selectedEvent || "all"} onValueChange={v => setSelectedEvent(v === "all" ? "" : v)}>
                        <SelectTrigger className="rounded-xl border-slate-200"><SelectValue placeholder="All Events" /></SelectTrigger>
                        <SelectContent><SelectItem value="all">All Events</SelectItem>{eventStats.map((s: EventStats) => <SelectItem key={s._id} value={s._id}>{s.eventTitle} ({s.count})</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={v => setStatusFilter(v as PaymentStatus)}>
                        <SelectTrigger className="rounded-xl border-slate-200"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                        <SelectContent><SelectItem value="all">All Statuses</SelectItem><SelectItem value="success">Successful</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="failed">Failed</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent>
                    </Select>
                    <div className="relative"><FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" /><Input placeholder="Search members..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 bg-slate-50 border-slate-200 rounded-xl" /></div>
                    <div className="flex gap-2"><Input type="date" value={dateRange.start} onChange={e => setDateRange(p => ({ ...p, start: e.target.value }))} className="rounded-xl border-slate-200 text-xs" /><Input type="date" value={dateRange.end} onChange={e => setDateRange(p => ({ ...p, end: e.target.value }))} className="rounded-xl border-slate-200 text-xs" /></div>
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100"><h3 className="text-sm font-black text-slate-700">Payment Transactions ({analytics.filteredPayments.length})</h3></div>
                {loading ? (
                    <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
                ) : error ? (
                    <div className="text-center py-16"><div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><FaTimesCircle className="text-2xl text-red-400" /></div><p className="text-sm text-red-500">{error}</p></div>
                ) : analytics.filteredPayments.length === 0 ? (
                    <div className="text-center py-16"><div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"><FaCalendarAlt className="text-2xl text-slate-300" /></div><p className="text-sm text-slate-500 mb-3">No payments found</p><Button variant="outline" size="sm" onClick={clearFilters} className="rounded-xl text-xs font-bold">Clear Filters</Button></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead><tr className="bg-slate-50/80">
                                {['Member', 'Event', 'Amount', 'Status', 'Date', 'TX ID'].map(h => <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>)}
                            </tr></thead>
                            <tbody className="divide-y divide-slate-50">
                                {analytics.filteredPayments.map((p: EventPayment) => (
                                    <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-primary/5 flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                                                    {p.user?.profilePicture ? <img src={p.user.profilePicture} alt="" className="w-full h-full object-cover" /> : `${p.user?.firstName?.[0] || ""}${p.user?.lastName?.[0] || ""}`}
                                                </div>
                                                <div><p className="text-sm font-bold text-slate-800">{p.user?.firstName || ""} {p.user?.lastName || ""}</p><p className="text-xs text-slate-400">{p.user?.email || ""}</p></div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4"><p className="text-sm font-medium text-slate-700">{p.metadata?.eventTitle || "Unknown"}</p>{p.eventDetails && <p className="text-xs text-slate-400">{new Date(p.eventDetails.date).toLocaleDateString()} • {p.eventDetails.location}</p>}</td>
                                        <td className="px-5 py-4"><p className="text-sm font-bold text-slate-800">{formatAmount(p.amount, p.currency)}</p></td>
                                        <td className="px-5 py-4"><span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusBadge[p.status] || "bg-slate-100 text-slate-600"}`}>{statusLabel[p.status] || p.status}</span></td>
                                        <td className="px-5 py-4"><p className="text-xs text-slate-500">{formatDate(p.createdAt)}</p></td>
                                        <td className="px-5 py-4"><p className="text-[10px] font-mono text-slate-400">{p.transactionId}</p></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}