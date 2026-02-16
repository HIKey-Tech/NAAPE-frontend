"use client";

import React, { useState } from "react";
import {
    FaFlag,
    FaFilter,
    FaSyncAlt,
    FaExclamationTriangle,
    FaCheckCircle,
    FaTimesCircle,
    FaEye,
    FaUser,
    FaComments,
    FaReply,
    FaCalendarAlt,
    FaSearch,
    FaTrash,
    FaBan,
    FaClock
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        reports,
        stats,
        isLoading,
        isProcessing,
        error,
        statusFilter,
        typeFilter,
        dateFromFilter,
        dateToFilter,
        currentPage,
        totalPages,
        fetchReports,
        getReportDetails,
        processResolveReport,
        processDismissReport,
        processBulkAction,
        setStatusFilter,
        setTypeFilter,
        setDateFromFilter,
        setDateToFilter,
        setCurrentPage
    } = useReportManagement();

    const [selectedReports, setSelectedReports] = useState<string[]>([]);
    const [selectedReport, setSelectedReport] = useState<ForumReport | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value === 'all' ? '' : value);
    };

    const handleTypeFilterChange = (value: string) => {
        setTypeFilter(value === 'all' ? '' : value);
    };

    const handleSelectReport = (reportId: string, checked: boolean) => {
        if (checked) {
            setSelectedReports(prev => [...prev, reportId]);
        } else {
            setSelectedReports(prev => prev.filter(id => id !== reportId));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedReports(reports.map(report => report._id));
        } else {
            setSelectedReports([]);
        }
    };

    const handleViewDetails = async (report: ForumReport) => {
        // Get full report details
        const fullReport = await getReportDetails(report._id);
        if (fullReport) {
            setSelectedReport(fullReport);
            setIsDetailsModalOpen(true);
        }
    };

    const handleQuickResolve = async (reportId: string) => {
        const success = await processResolveReport(reportId, {
            resolutionNotes: "Quick resolved by admin",
            actionTaken: 'none'
        });
        
        if (success) {
            toast.success("Report resolved successfully");
        }
    };

    const handleQuickDismiss = async (reportId: string) => {
        const success = await processDismissReport(reportId, "Quick dismissed by admin");
        
        if (success) {
            toast.success("Report dismissed successfully");
        }
    };

    const handleBulkAction = async (action: 'resolve' | 'dismiss') => {
        if (selectedReports.length === 0) {
            toast.error("Please select reports to process");
            return;
        }

        const success = await processBulkAction({
            reportIds: selectedReports,
            action,
            resolutionNotes: `Bulk ${action}d by admin`
        });

        if (success) {
            toast.success(`${selectedReports.length} reports ${action}d successfully`);
            setSelectedReports([]);
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
                return <FaComments className="w-4 h-4 text-blue-500" />;
            case 'reply':
                return <FaReply className="w-4 h-4 text-green-500" />;
            case 'user':
                return <FaUser className="w-4 h-4 text-purple-500" />;
            default:
                return <FaFlag className="w-4 h-4" />;
        }
    };

    // Filter reports based on search term
    const filteredReports = reports.filter(report => {
        if (!searchTerm) return true;
        
        const searchLower = searchTerm.toLowerCase();
        return (
            report.reporter.name.toLowerCase().includes(searchLower) ||
            report.reporter.email.toLowerCase().includes(searchLower) ||
            report.reason.toLowerCase().includes(searchLower) ||
            (report.reportedUser?.name.toLowerCase().includes(searchLower)) ||
            (report.reportedContent?.title?.toLowerCase().includes(searchLower)) ||
            (report.description?.toLowerCase().includes(searchLower))
        );
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading reports...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 mb-4">Error loading reports: {error}</p>
                    <Button onClick={fetchReports} variant="outline">
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
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Report Management</h1>
                    <p className="text-gray-600">Review and process user reports</p>
                </div>
                <Button 
                    onClick={fetchReports} 
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                >
                    <FaSyncAlt className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                        <FaFlag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">
                            All time reports
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <FaExclamationTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        <p className="text-xs text-muted-foreground">
                            Awaiting review
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                        <FaCheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
                        <p className="text-xs text-muted-foreground">
                            Action taken
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dismissed</CardTitle>
                        <FaTimesCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-600">{stats.dismissed}</div>
                        <p className="text-xs text-muted-foreground">
                            No action needed
                        </p>
                    </CardContent>
                </Card>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Search Reports</label>
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search reports..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <Select value={statusFilter || 'all'} onValueChange={handleStatusFilterChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="dismissed">Dismissed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Type</label>
                            <Select value={typeFilter || 'all'} onValueChange={handleTypeFilterChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="thread">Thread</SelectItem>
                                    <SelectItem value="reply">Reply</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date From</label>
                            <Input
                                type="date"
                                value={dateFromFilter}
                                onChange={(e) => setDateFromFilter(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date To</label>
                            <Input
                                type="date"
                                value={dateToFilter}
                                onChange={(e) => setDateToFilter(e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedReports.length > 0 && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                    {selectedReports.length} report{selectedReports.length !== 1 ? 's' : ''} selected
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={() => handleBulkAction('resolve')}
                                    disabled={isProcessing}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <FaCheckCircle className="w-4 h-4 mr-2" />
                                    Bulk Resolve
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleBulkAction('dismiss')}
                                    disabled={isProcessing}
                                >
                                    <FaTimesCircle className="w-4 h-4 mr-2" />
                                    Bulk Dismiss
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setSelectedReports([])}
                                >
                                    Clear Selection
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Reports List */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <FaFlag className="w-5 h-5" />
                            Reports
                            <Badge variant="secondary" className="ml-2">
                                {filteredReports.length}
                            </Badge>
                        </CardTitle>
                        {filteredReports.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={selectedReports.length === filteredReports.length}
                                    onCheckedChange={handleSelectAll}
                                />
                                <span className="text-sm text-gray-600">Select All</span>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredReports.length === 0 ? (
                        <div className="text-center py-12">
                            <FaFlag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm || statusFilter || typeFilter || dateFromFilter || dateToFilter
                                    ? "Try adjusting your filters to see more results."
                                    : "No reports have been submitted yet."
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredReports.map((report) => (
                                <div
                                    key={report._id}
                                    className="flex items-center gap-4 p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                                >
                                    {/* Selection Checkbox */}
                                    <Checkbox
                                        checked={selectedReports.includes(report._id)}
                                        onCheckedChange={(checked) => handleSelectReport(report._id, checked as boolean)}
                                    />

                                    {/* Report Type Icon */}
                                    <div className="flex-shrink-0">
                                        {getTypeIcon(report.reportType)}
                                    </div>

                                    {/* Report Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-gray-900 capitalize">
                                                {report.reportType} Report
                                            </span>
                                            {getStatusBadge(report.status)}
                                            {getReasonBadge(report.reason)}
                                        </div>
                                        
                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                            <span>By: {report.reporter.name}</span>
                                            <span>•</span>
                                            <span>{format(new Date(report.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                                            {report.reportedUser && (
                                                <>
                                                    <span>•</span>
                                                    <span>Against: {report.reportedUser.name}</span>
                                                </>
                                            )}
                                        </div>

                                        {/* Content Preview */}
                                        {report.reportedContent && (
                                            <div className="text-sm text-gray-700 mb-2">
                                                {report.reportType === 'thread' && report.reportedContent.title && (
                                                    <span className="font-medium">"{report.reportedContent.title}"</span>
                                                )}
                                                {report.reportType === 'reply' && report.additionalContext?.threadTitle && (
                                                    <span>Reply in "{report.additionalContext.threadTitle}"</span>
                                                )}
                                            </div>
                                        )}

                                        {report.description && (
                                            <div className="text-sm text-gray-600 italic">
                                                "{report.description.length > 100 
                                                    ? `${report.description.substring(0, 100)}...`
                                                    : report.description
                                                }"
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleViewDetails(report)}
                                            title="View details"
                                        >
                                            <FaEye className="w-4 h-4" />
                                        </Button>
                                        
                                        {report.status === 'pending' && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleQuickResolve(report._id)}
                                                    disabled={isProcessing}
                                                    className="text-green-600 hover:text-green-700"
                                                    title="Quick resolve"
                                                >
                                                    <FaCheckCircle className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleQuickDismiss(report._id)}
                                                    disabled={isProcessing}
                                                    className="text-gray-600 hover:text-gray-700"
                                                    title="Quick dismiss"
                                                >
                                                    <FaTimesCircle className="w-4 h-4" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t">
                            <div className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Report Details Modal */}
            <ReportDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedReport(null);
                }}
                report={selectedReport}
                onResolve={processResolveReport}
                onDismiss={processDismissReport}
                isProcessing={isProcessing}
            />
        </div>
    );
};

export default ReportManagementSection;