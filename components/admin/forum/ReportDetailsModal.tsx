"use client";

import React, { useState, useEffect } from "react";
import {
    FaTimes,
    FaFlag,
    FaUser,
    FaComments,
    FaReply,
    FaCalendarAlt,
    FaExclamationTriangle,
    FaCheckCircle,
    FaTimesCircle,
    FaBan,
    FaClock,
    FaTrash
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ForumReport, ResolveReportData } from "@/app/api/admin/forum";

interface ReportDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    report: ForumReport | null;
    onResolve: (reportId: string, data: ResolveReportData) => Promise<boolean>;
    onDismiss: (reportId: string, resolutionNotes?: string) => Promise<boolean>;
    isProcessing: boolean;
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
    isOpen,
    onClose,
    report,
    onResolve,
    onDismiss,
    isProcessing
}) => {
    const [resolutionNotes, setResolutionNotes] = useState("");
    const [actionTaken, setActionTaken] = useState<'delete_content' | 'ban_user' | 'suspend_user' | 'none'>('none');
    const [isResolving, setIsResolving] = useState(false);

    useEffect(() => {
        if (isOpen && report) {
            setResolutionNotes("");
            setActionTaken('none');
            setIsResolving(false);
        }
    }, [isOpen, report]);

    if (!isOpen || !report) return null;

    const handleResolve = async () => {
        if (!resolutionNotes.trim()) {
            alert("Please provide resolution notes");
            return;
        }

        const success = await onResolve(report._id, {
            resolutionNotes,
            actionTaken
        });

        if (success) {
            onClose();
        }
    };

    const handleDismiss = async () => {
        const success = await onDismiss(report._id, resolutionNotes || "Dismissed by admin");
        if (success) {
            onClose();
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Pending</span>;
            case 'resolved':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Resolved</span>;
            case 'dismissed':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">Dismissed</span>;
            default:
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">{status}</span>;
        }
    };

    const getReasonBadge = (reason: string) => {
        const colors: Record<string, string> = {
            spam: "bg-red-100 text-red-700",
            harassment: "bg-orange-100 text-orange-700",
            inappropriate: "bg-purple-100 text-purple-700",
            'off-topic': "bg-primary/10 text-primary",
            other: "bg-slate-100 text-slate-600"
        };

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${colors[reason] || colors.other}`}>
                {reason.charAt(0).toUpperCase() + reason.slice(1).replace('-', ' ')}
            </span>
        );
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'thread':
                return <FaComments className="w-4 h-4" />;
            case 'reply':
                return <FaReply className="w-4 h-4" />;
            case 'user':
                return <FaUser className="w-4 h-4" />;
            default:
                return <FaFlag className="w-4 h-4" />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                            {getTypeIcon(report.reportType)}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Report Details</h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                {getStatusBadge(report.status)}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                    >
                        <FaTimes className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Report Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-5">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Report Information</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500">Type:</span>
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(report.reportType)}
                                            <span className="capitalize font-medium text-slate-700">{report.reportType}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500">Reason:</span>
                                        {getReasonBadge(report.reason)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-slate-500">Reported:</span>
                                        <span className="text-slate-700">{format(new Date(report.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Reporter Info */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Reported By</h3>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center text-sm font-bold">
                                        {report.reporter.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 text-sm">{report.reporter.name}</div>
                                        <div className="text-xs text-slate-500">{report.reporter.email}</div>
                                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-500 mt-1 inline-block">
                                            {report.reporter.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {/* Reported User (if applicable) */}
                            {report.reportedUser && (
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Reported User</h3>
                                    <div className="flex items-center gap-3 p-3 bg-red-50/50 rounded-xl border border-red-100">
                                        <div className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center text-sm font-bold">
                                            {report.reportedUser.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-sm">{report.reportedUser.name}</div>
                                            <div className="text-xs text-slate-500">{report.reportedUser.email}</div>
                                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600 mt-1 inline-block">
                                                {report.reportedUser.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Resolution Info (if resolved) */}
                            {report.status !== 'pending' && report.resolvedBy && (
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Resolution</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-500">Resolved by:</span>
                                            <span className="font-bold text-slate-700">{report.resolvedBy.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaCalendarAlt className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="text-slate-500">Resolved:</span>
                                            <span className="text-slate-700">{format(new Date(report.resolvedAt!), 'MMM dd, yyyy HH:mm')}</span>
                                        </div>
                                        {report.resolutionNotes && (
                                            <div className="mt-2">
                                                <span className="text-slate-500">Notes:</span>
                                                <div className="mt-1 p-3 bg-slate-50 rounded-xl text-sm border border-slate-100">
                                                    {report.resolutionNotes}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Report Description */}
                    {report.description && (
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Description</h3>
                            <div className="p-4 bg-slate-50 rounded-xl text-sm border border-slate-100 text-slate-700">
                                {report.description}
                            </div>
                        </div>
                    )}

                    {/* Reported Content */}
                    {report.reportedContent && (
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Reported Content</h3>
                            <div className="rounded-xl p-4 bg-slate-50 border border-slate-100">
                                {report.reportType === 'thread' && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaComments className="w-4 h-4 text-slate-400" />
                                            <span className="font-bold text-slate-900 text-sm">{report.reportedContent.title}</span>
                                            {report.reportedContent.category && (
                                                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
                                                    {report.reportedContent.category.name}
                                                </span>
                                            )}
                                        </div>
                                        {report.reportedContent.author && (
                                            <div className="text-sm text-slate-500 mb-2">
                                                By: {report.reportedContent.author.name}
                                            </div>
                                        )}
                                        {report.reportedContent.content && (
                                            <div className="text-sm bg-white p-3 rounded-xl border border-slate-100 text-slate-700">
                                                {report.reportedContent.content.length > 200
                                                    ? `${report.reportedContent.content.substring(0, 200)}...`
                                                    : report.reportedContent.content
                                                }
                                            </div>
                                        )}
                                    </div>
                                )}

                                {report.reportType === 'reply' && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaReply className="w-4 h-4 text-slate-400" />
                                            <span className="font-bold text-slate-900 text-sm">Reply</span>
                                            {report.additionalContext?.threadTitle && (
                                                <span className="text-sm text-slate-500">
                                                    in &quot;{report.additionalContext.threadTitle}&quot;
                                                </span>
                                            )}
                                        </div>
                                        {report.reportedContent.author && (
                                            <div className="text-sm text-slate-500 mb-2">
                                                By: {report.reportedContent.author.name}
                                            </div>
                                        )}
                                        {report.reportedContent.content && (
                                            <div className="text-sm bg-white p-3 rounded-xl border border-slate-100 text-slate-700">
                                                {report.reportedContent.content.length > 200
                                                    ? `${report.reportedContent.content.substring(0, 200)}...`
                                                    : report.reportedContent.content
                                                }
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Resolution Actions (only for pending reports) */}
                    {report.status === 'pending' && (
                        <div className="border-t border-slate-100 pt-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Resolve Report</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                                        Action to Take
                                    </label>
                                    <Select value={actionTaken} onValueChange={(value: any) => setActionTaken(value)}>
                                        <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white">
                                            <SelectValue placeholder="Select action" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No additional action</SelectItem>
                                            <SelectItem value="delete_content">Delete reported content</SelectItem>
                                            <SelectItem value="suspend_user">Suspend user (7 days)</SelectItem>
                                            <SelectItem value="ban_user">Ban user permanently</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                                        Resolution Notes *
                                    </label>
                                    <Textarea
                                        value={resolutionNotes}
                                        onChange={(e) => setResolutionNotes(e.target.value)}
                                        placeholder="Explain how this report was resolved..."
                                        rows={3}
                                        className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleResolve}
                                        disabled={isProcessing || !resolutionNotes.trim()}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20"
                                    >
                                        <FaCheckCircle className="w-4 h-4 mr-2" />
                                        {isProcessing ? "Resolving..." : "Resolve Report"}
                                    </Button>
                                    <Button
                                        onClick={handleDismiss}
                                        disabled={isProcessing}
                                        variant="outline"
                                        className="text-slate-600 hover:text-slate-800 rounded-xl font-bold border-slate-200"
                                    >
                                        <FaTimesCircle className="w-4 h-4 mr-2" />
                                        {isProcessing ? "Dismissing..." : "Dismiss Report"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportDetailsModal;