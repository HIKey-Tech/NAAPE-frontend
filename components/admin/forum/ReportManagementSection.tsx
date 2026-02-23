"use client";

import React, { useState } from "react";
import {
    FaFlag, FaFilter, FaSyncAlt, FaExclamationTriangle,
    FaCheckCircle, FaTimesCircle, FaEye, FaUser,
    FaComments, FaReply, FaCalendarAlt, FaSearch,
    FaTrash, FaBan, FaClock
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { format } from "date-fns";
import { useReportManagement } from "@/hooks/useReportManagement";
import { ForumReport } from "@/app/api/admin/forum";
import ReportDetailsModal from "./ReportDetailsModal";

const ReportManagementSection: React.FC = () => {
    const {
        reports, stats, isLoading, isProcessing, error,
        statusFilter, typeFilter, dateFromFilter, dateToFilter,
        currentPage, totalPages, fetchReports, getReportDetails,
        processResolveReport, processDismissReport, processBulkAction,
        setStatusFilter, setTypeFilter, setDateFromFilter,
        setDateToFilter, setCurrentPage
    } = useReportManagement();

    const [selectedReports, setSelectedReports] = useState<string[]>([]);
    const [selectedReport, setSelectedReport] = useState<ForumReport | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleStatusFilterChange = (value: string) => setStatusFilter(value === 'all' ? '' : value);
    const handleTypeFilterChange = (value: string) => setTypeFilter(value === 'all' ? '' : value);

    const handleSelectReport = (reportId: string, checked: boolean) => {
        if (checked) setSelectedReports(prev => [...prev, reportId]);
        else setSelectedReports(prev => prev.filter(id => id !== reportId));
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) setSelectedReports(reports.map(r => r._id));
        else setSelectedReports([]);
    };

    const handleViewDetails = async (report: ForumReport) => {
        const fullReport = await getReportDetails(report._id);
        if (fullReport) { setSelectedReport(fullReport); setIsDetailsModalOpen(true); }
    };

    const handleQuickResolve = async (reportId: string) => {
        const success = await processResolveReport(reportId, { resolutionNotes: "Quick resolved by admin", actionTaken: 'none' });
        if (success) toast.success("Report resolved successfully");
    };

    const handleQuickDismiss = async (reportId: string) => {
        const success = await processDismissReport(reportId, "Quick dismissed by admin");
        if (success) toast.success("Report dismissed successfully");
    };

    const handleBulkAction = async (action: 'resolve' | 'dismiss') => {
        if (selectedReports.length === 0) { toast.error("Please select reports to process"); return; }
        const success = await processBulkAction({ reportIds: selectedReports, action, resolutionNotes: `Bulk ${action}d by admin` });
        if (success) { toast.success(`${selectedReports.length} reports ${action}d successfully`); setSelectedReports([]); }
    };

    const getStatusBadge = (status: string) => {
        const map: Record<string, string> = { pending: "bg-amber-100 text-amber-700", resolved: "bg-emerald-100 text-emerald-700", dismissed: "bg-slate-100 text-slate-600" };
        return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${map[status] || "bg-slate-100 text-slate-600"}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
    };

    const getReasonBadge = (reason: string) => {
        const colors: Record<string, string> = { spam: "bg-red-100 text-red-700", harassment: "bg-orange-100 text-orange-700", inappropriate: "bg-purple-100 text-purple-700", 'off-topic': "bg-primary/10 text-primary", other: "bg-slate-100 text-slate-600" };
        return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${colors[reason] || colors.other}`}>{reason.charAt(0).toUpperCase() + reason.slice(1).replace('-', ' ')}</span>;
    };

    const getTypeIcon = (type: string) => {
        if (type === 'thread') return <FaComments className="w-4 h-4 text-primary" />;
        if (type === 'reply') return <FaReply className="w-4 h-4 text-emerald-500" />;
        if (type === 'user') return <FaUser className="w-4 h-4 text-purple-500" />;
        return <FaFlag className="w-4 h-4 text-slate-400" />;
    };

    const filteredReports = reports.filter(report => {
        if (!searchTerm) return true;
        const s = searchTerm.toLowerCase();
        return report.reporter.name.toLowerCase().includes(s) || report.reporter.email.toLowerCase().includes(s) || report.reason.toLowerCase().includes(s) || (report.reportedUser?.name.toLowerCase().includes(s)) || (report.reportedContent?.title?.toLowerCase().includes(s)) || (report.description?.toLowerCase().includes(s));
    });

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-slate-500">Loading reports...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                    <FaExclamationTriangle className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-red-600 mb-4 font-medium">Error loading reports: {error}</p>
                <Button onClick={fetchReports} variant="outline" className="rounded-xl font-bold border-slate-200">
                    <FaSyncAlt className="w-4 h-4 mr-2" />Retry
                </Button>
            </div>
        </div>
    );

    const statCards = [
        { label: "Total Reports", value: stats.total, icon: FaFlag, bg: "bg-primary/5", ic: "text-primary", vc: "text-slate-900", sub: "All time reports" },
        { label: "Pending", value: stats.pending, icon: FaExclamationTriangle, bg: "bg-amber-50", ic: "text-amber-500", vc: "text-amber-600", sub: "Awaiting review" },
        { label: "Resolved", value: stats.resolved, icon: FaCheckCircle, bg: "bg-emerald-50", ic: "text-emerald-500", vc: "text-emerald-600", sub: "Action taken" },
        { label: "Dismissed", value: stats.dismissed, icon: FaTimesCircle, bg: "bg-slate-50", ic: "text-slate-500", vc: "text-slate-600", sub: "No action needed" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Report Management</h1>
                    <p className="text-slate-500">Review and process user reports</p>
                </div>
                <Button onClick={fetchReports} disabled={isLoading} variant="outline" size="sm" className="rounded-xl font-bold border-slate-200">
                    <FaSyncAlt className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />Refresh
                </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map((s, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{s.label}</span>
                            <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                                <s.icon className={`w-4 h-4 ${s.ic}`} />
                            </div>
                        </div>
                        <div className={`text-2xl font-bold ${s.vc}`}>{s.value}</div>
                        <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 p-5 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center"><FaFilter className="w-4 h-4 text-slate-500" /></div>
                    <h3 className="text-base font-bold text-slate-900">Filters</h3>
                </div>
                <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Search</label>
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <Input placeholder="Search reports..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Status</label>
                            <Select value={statusFilter || 'all'} onValueChange={handleStatusFilterChange}>
                                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50"><SelectValue placeholder="All statuses" /></SelectTrigger>
                                <SelectContent><SelectItem value="all">All Statuses</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="resolved">Resolved</SelectItem><SelectItem value="dismissed">Dismissed</SelectItem></SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Type</label>
                            <Select value={typeFilter || 'all'} onValueChange={handleTypeFilterChange}>
                                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50"><SelectValue placeholder="All types" /></SelectTrigger>
                                <SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="thread">Thread</SelectItem><SelectItem value="reply">Reply</SelectItem><SelectItem value="user">User</SelectItem></SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Date From</label>
                            <Input type="date" value={dateFromFilter} onChange={(e) => setDateFromFilter(e.target.value)} className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Date To</label>
                            <Input type="date" value={dateToFilter} onChange={(e) => setDateToFilter(e.target.value)} className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedReports.length > 0 && (
                <div className="bg-primary/5 rounded-2xl border border-primary/20 shadow-sm p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <span className="text-sm font-bold text-primary/90">{selectedReports.length} report{selectedReports.length !== 1 ? 's' : ''} selected</span>
                        <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleBulkAction('resolve')} disabled={isProcessing} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20"><FaCheckCircle className="w-4 h-4 mr-2" />Bulk Resolve</Button>
                            <Button size="sm" variant="outline" onClick={() => handleBulkAction('dismiss')} disabled={isProcessing} className="rounded-xl font-bold border-slate-200"><FaTimesCircle className="w-4 h-4 mr-2" />Bulk Dismiss</Button>
                            <Button size="sm" variant="ghost" onClick={() => setSelectedReports([])} className="rounded-xl font-bold text-slate-600">Clear</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reports List */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center"><FaFlag className="w-4 h-4 text-red-500" /></div>
                        <h3 className="text-base font-bold text-slate-900">Reports</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">{filteredReports.length}</span>
                    </div>
                    {filteredReports.length > 0 && (
                        <div className="flex items-center gap-2"><Checkbox checked={selectedReports.length === filteredReports.length} onCheckedChange={handleSelectAll} /><span className="text-sm text-slate-500">Select All</span></div>
                    )}
                </div>
                <div className="p-5">
                    {filteredReports.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4"><FaFlag className="w-8 h-8 text-slate-300" /></div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">No reports found</h3>
                            <p className="text-slate-500">{searchTerm || statusFilter || typeFilter || dateFromFilter || dateToFilter ? "Try adjusting your filters." : "No reports have been submitted yet."}</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredReports.map((report) => (
                                <div key={report._id} className="flex flex-wrap items-center gap-3 sm:gap-4 p-4 rounded-xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all duration-200">
                                    <Checkbox checked={selectedReports.includes(report._id)} onCheckedChange={(checked) => handleSelectReport(report._id, checked as boolean)} />
                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-100">{getTypeIcon(report.reportType)}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="font-bold text-slate-900 capitalize text-sm">{report.reportType} Report</span>
                                            {getStatusBadge(report.status)}
                                            {getReasonBadge(report.reason)}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-1 flex-wrap">
                                            <span>By: <span className="font-medium text-slate-600">{report.reporter.name}</span></span>
                                            <span className="text-slate-300">•</span>
                                            <span>{format(new Date(report.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                                            {report.reportedUser && (<><span className="text-slate-300">•</span><span>Against: <span className="font-medium text-slate-600">{report.reportedUser.name}</span></span></>)}
                                        </div>
                                        {report.reportedContent && (
                                            <div className="text-xs text-slate-600">
                                                {report.reportType === 'thread' && report.reportedContent.title && <span className="font-medium">&quot;{report.reportedContent.title}&quot;</span>}
                                                {report.reportType === 'reply' && report.additionalContext?.threadTitle && <span>Reply in &quot;{report.additionalContext.threadTitle}&quot;</span>}
                                            </div>
                                        )}
                                        {report.description && <div className="text-xs text-slate-400 italic mt-0.5">&quot;{report.description.length > 100 ? `${report.description.substring(0, 100)}...` : report.description}&quot;</div>}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => handleViewDetails(report)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors" title="View details"><FaEye className="w-3.5 h-3.5" /></button>
                                        {report.status === 'pending' && (<>
                                            <button onClick={() => handleQuickResolve(report._id)} disabled={isProcessing} className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition-colors disabled:opacity-50" title="Quick resolve"><FaCheckCircle className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => handleQuickDismiss(report._id)} disabled={isProcessing} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors disabled:opacity-50" title="Quick dismiss"><FaTimesCircle className="w-3.5 h-3.5" /></button>
                                        </>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                            <div className="text-sm text-slate-500">Page {currentPage} of {totalPages}</div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="rounded-xl font-bold border-slate-200">Previous</Button>
                                <Button size="sm" variant="outline" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="rounded-xl font-bold border-slate-200">Next</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ReportDetailsModal isOpen={isDetailsModalOpen} onClose={() => { setIsDetailsModalOpen(false); setSelectedReport(null); }} report={selectedReport} onResolve={processResolveReport} onDismiss={processDismissReport} isProcessing={isProcessing} />
        </div>
    );
};

export default ReportManagementSection;