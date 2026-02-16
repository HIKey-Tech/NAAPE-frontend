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
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
            case 'resolved':
                return <Badge variant="default" className="bg-green-100 text-green-800">Resolved</Badge>;
            case 'dismissed':
                return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Dismissed</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getReasonBadge = (reason: string) => {
        const colors = {
            spam: "bg-red-100 text-red-800",
            harassment: "bg-orange-100 text-orange-800",
            inappropriate: "bg-purple-100 text-purple-800",
            'off-topic': "bg-blue-100 text-blue-800",
            other: "bg-gray-100 text-gray-800"
        };

        return (
            <Badge variant="secondary" className={colors[reason as keyof typeof colors] || colors.other}>
                {reason.charAt(0).toUpperCase() + reason.slice(1).replace('-', ' ')}
            </Badge>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            {getTypeIcon(report.reportType)}
                            Report Details
                        </div>
                        {getStatusBadge(report.status)}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FaTimes className="w-4 h-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Report Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Report Information</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600">Type:</span>
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(report.reportType)}
                                            <span className="capitalize">{report.reportType}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600">Reason:</span>
                                        {getReasonBadge(report.reason)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">Reported:</span>
                                        <span>{format(new Date(report.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Reporter Info */}
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Reported By</h3>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                                        {report.reporter.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-medium">{report.reporter.name}</div>
                                        <div className="text-sm text-gray-600">{report.reporter.email}</div>
                                        <Badge variant="secondary" className="text-xs">
                                            {report.reporter.role}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Reported User (if applicable) */}
                            {report.reportedUser && (
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Reported User</h3>
                                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                                        <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                            {report.reportedUser.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium">{report.reportedUser.name}</div>
                                            <div className="text-sm text-gray-600">{report.reportedUser.email}</div>
                                            <Badge variant="secondary" className="text-xs">
                                                {report.reportedUser.role}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Resolution Info (if resolved) */}
                            {report.status !== 'pending' && report.resolvedBy && (
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Resolution</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-600">Resolved by:</span>
                                            <span className="font-medium">{report.resolvedBy.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">Resolved:</span>
                                            <span>{format(new Date(report.resolvedAt!), 'MMM dd, yyyy HH:mm')}</span>
                                        </div>
                                        {report.resolutionNotes && (
                                            <div className="mt-2">
                                                <span className="text-gray-600">Notes:</span>
                                                <div className="mt-1 p-2 bg-gray-50 rounded text-sm">
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
                            <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                            <div className="p-3 bg-gray-50 rounded-lg text-sm">
                                {report.description}
                            </div>
                        </div>
                    )}

                    {/* Reported Content */}
                    {report.reportedContent && (
                        <div>
                            <h3 className="font-medium text-gray-900 mb-2">Reported Content</h3>
                            <div className="border rounded-lg p-4 bg-gray-50">
                                {report.reportType === 'thread' && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaComments className="w-4 h-4 text-gray-500" />
                                            <span className="font-medium">{report.reportedContent.title}</span>
                                            {report.reportedContent.category && (
                                                <Badge variant="secondary" className="text-xs">
                                                    {report.reportedContent.category.name}
                                                </Badge>
                                            )}
                                        </div>
                                        {report.reportedContent.author && (
                                            <div className="text-sm text-gray-600 mb-2">
                                                By: {report.reportedContent.author.name}
                                            </div>
                                        )}
                                        {report.reportedContent.content && (
                                            <div className="text-sm bg-white p-3 rounded border">
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
                                            <FaReply className="w-4 h-4 text-gray-500" />
                                            <span className="font-medium">Reply</span>
                                            {report.additionalContext?.threadTitle && (
                                                <span className="text-sm text-gray-600">
                                                    in "{report.additionalContext.threadTitle}"
                                                </span>
                                            )}
                                        </div>
                                        {report.reportedContent.author && (
                                            <div className="text-sm text-gray-600 mb-2">
                                                By: {report.reportedContent.author.name}
                                            </div>
                                        )}
                                        {report.reportedContent.content && (
                                            <div className="text-sm bg-white p-3 rounded border">
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
                        <div className="border-t pt-6">
                            <h3 className="font-medium text-gray-900 mb-4">Resolve Report</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Action to Take
                                    </label>
                                    <Select value={actionTaken} onValueChange={(value: any) => setActionTaken(value)}>
                                        <SelectTrigger>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Resolution Notes *
                                    </label>
                                    <Textarea
                                        value={resolutionNotes}
                                        onChange={(e) => setResolutionNotes(e.target.value)}
                                        placeholder="Explain how this report was resolved..."
                                        rows={3}
                                        className="w-full"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleResolve}
                                        disabled={isProcessing || !resolutionNotes.trim()}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        <FaCheckCircle className="w-4 h-4 mr-2" />
                                        {isProcessing ? "Resolving..." : "Resolve Report"}
                                    </Button>
                                    <Button
                                        onClick={handleDismiss}
                                        disabled={isProcessing}
                                        variant="outline"
                                        className="text-gray-600 hover:text-gray-800"
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