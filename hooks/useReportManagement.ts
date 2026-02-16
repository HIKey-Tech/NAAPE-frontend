"use client";

import { useState, useEffect, useCallback } from "react";
import { 
    getAllReports, 
    getReportById, 
    resolveReport, 
    dismissReport, 
    bulkReportActions,
    ForumReport, 
    ReportStats, 
    ResolveReportData, 
    BulkReportActionData 
} from "@/app/api/admin/forum";

export const useReportManagement = () => {
    const [reports, setReports] = useState<ForumReport[]>([]);
    const [stats, setStats] = useState<ReportStats>({ total: 0, pending: 0, resolved: 0, dismissed: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Filters
    const [statusFilter, setStatusFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [dateFromFilter, setDateFromFilter] = useState("");
    const [dateToFilter, setDateToFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchReports = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const params = {
                page: currentPage,
                limit: 20,
                ...(statusFilter && { status: statusFilter }),
                ...(typeFilter && { reportType: typeFilter }),
                ...(dateFromFilter && { dateFrom: dateFromFilter }),
                ...(dateToFilter && { dateTo: dateToFilter })
            };

            const response = await getAllReports(params);
            setReports(response.data);
            setStats(response.stats);
            setTotalPages(response.pagination.pages);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch reports");
            console.error("Error fetching reports:", err);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, statusFilter, typeFilter, dateFromFilter, dateToFilter]);

    const getReportDetails = async (reportId: string): Promise<ForumReport | null> => {
        try {
            const report = await getReportById(reportId);
            return report;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch report details");
            console.error("Error fetching report details:", err);
            return null;
        }
    };

    const processResolveReport = async (reportId: string, data: ResolveReportData): Promise<boolean> => {
        setIsProcessing(true);
        try {
            await resolveReport(reportId, data);
            await fetchReports(); // Refresh the list
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to resolve report");
            console.error("Error resolving report:", err);
            return false;
        } finally {
            setIsProcessing(false);
        }
    };

    const processDismissReport = async (reportId: string, resolutionNotes?: string): Promise<boolean> => {
        setIsProcessing(true);
        try {
            await dismissReport(reportId, { resolutionNotes });
            await fetchReports(); // Refresh the list
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to dismiss report");
            console.error("Error dismissing report:", err);
            return false;
        } finally {
            setIsProcessing(false);
        }
    };

    const processBulkAction = async (data: BulkReportActionData): Promise<boolean> => {
        setIsProcessing(true);
        try {
            await bulkReportActions(data);
            await fetchReports(); // Refresh the list
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to perform bulk action");
            console.error("Error performing bulk action:", err);
            return false;
        } finally {
            setIsProcessing(false);
        }
    };

    // Auto-fetch on mount and when filters change
    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, typeFilter, dateFromFilter, dateToFilter]);

    return {
        // Data
        reports,
        stats,
        isLoading,
        isProcessing,
        error,
        
        // Filters
        statusFilter,
        typeFilter,
        dateFromFilter,
        dateToFilter,
        currentPage,
        totalPages,
        
        // Actions
        fetchReports,
        getReportDetails,
        processResolveReport,
        processDismissReport,
        processBulkAction,
        
        // Filter setters
        setStatusFilter,
        setTypeFilter,
        setDateFromFilter,
        setDateToFilter,
        setCurrentPage
    };
};