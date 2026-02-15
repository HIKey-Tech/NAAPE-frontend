"use client";

import React, { useState, useMemo } from "react";
import { useAdminEventPayments } from "@/hooks/useAdminEventPayments";
import {
    FaDownload,
    FaFilter,
    FaSearch,
    FaChartLine,
    FaMoneyBillWave,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaEye,
    FaCalendarAlt
} from "react-icons/fa";

interface EventPayment {
    _id: string;
    user: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        profilePicture?: string;
    };
    type: string;
    transactionId: string;
    amount: number;
    currency: string;
    status: string;
    metadata: {
        eventId: string;
        eventTitle: string;
    };
    eventDetails?: {
        _id: string;
        title: string;
        date: string;
        location: string;
        price: number;
    };
    createdAt: string;
}

interface EventStats {
    _id: string;
    eventTitle: string;
    count: number;
    totalAmount: number;
    statuses: string[];
}

type PaymentStatus = 'all' | 'success' | 'successful' | 'completed' | 'pending' | 'failed' | 'cancelled';
type ExportFormat = 'csv' | 'excel';

const STATUS_COLORS = {
    success: { bg: "#e7faf0", color: "#187c49", label: "Paid", icon: FaCheckCircle },
    successful: { bg: "#e7faf0", color: "#187c49", label: "Paid", icon: FaCheckCircle },
    completed: { bg: "#e7faf0", color: "#187c49", label: "Completed", icon: FaCheckCircle },
    pending: { bg: "#fffbe2", color: "#b88712", label: "Pending", icon: FaClock },
    failed: { bg: "#fbeaec", color: "#af272e", label: "Failed", icon: FaTimesCircle },
    cancelled: { bg: "#fbeaec", color: "#af272e", label: "Cancelled", icon: FaTimesCircle },
};

// Helper function to check if payment is successful
const isSuccessfulPayment = (status: string) => {
    return status === "success" || status === "successful" || status === "completed";
};

export default function PaymentOversightSection() {
    const [selectedEvent, setSelectedEvent] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<PaymentStatus>('all');
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    
    const { payments = [], eventStats = [], paymentStats = [], loading, error } = useAdminEventPayments(selectedEvent);

    // Calculate analytics data
    const analytics = useMemo(() => {
        const filteredPayments = payments.filter((payment: EventPayment) => {
            const matchesSearch = 
                (payment.user?.firstName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                (payment.user?.lastName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                (payment.user?.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                (payment.metadata?.eventTitle?.toLowerCase() || "").includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
            
            const matchesDateRange = 
                (!dateRange.start || new Date(payment.createdAt) >= new Date(dateRange.start)) &&
                (!dateRange.end || new Date(payment.createdAt) <= new Date(dateRange.end));
            
            return matchesSearch && matchesStatus && matchesDateRange;
        });

        const totalRevenue = filteredPayments
            .filter((p: EventPayment) => isSuccessfulPayment(p.status))
            .reduce((sum: number, p: EventPayment) => sum + p.amount, 0);

        const successfulPayments = filteredPayments.filter(
            (p: EventPayment) => isSuccessfulPayment(p.status)
        ).length;

        const pendingPayments = filteredPayments.filter(
            (p: EventPayment) => p.status === 'pending'
        ).length;

        const failedPayments = filteredPayments.filter(
            (p: EventPayment) => p.status === 'failed' || p.status === 'cancelled'
        ).length;

        // Revenue by event breakdown
        const revenueByEvent = filteredPayments
            .filter((p: EventPayment) => isSuccessfulPayment(p.status))
            .reduce((acc: Record<string, { title: string; revenue: number; count: number }>, payment: EventPayment) => {
                const eventId = payment.metadata?.eventId || 'unknown';
                const eventTitle = payment.metadata?.eventTitle || 'Unknown Event';
                
                if (!acc[eventId]) {
                    acc[eventId] = { title: eventTitle, revenue: 0, count: 0 };
                }
                acc[eventId].revenue += payment.amount;
                acc[eventId].count += 1;
                return acc;
            }, {});

        return {
            filteredPayments,
            totalRevenue,
            successfulPayments,
            pendingPayments,
            failedPayments,
            totalTransactions: filteredPayments.length,
            revenueByEvent: Object.entries(revenueByEvent)
                .map(([eventId, data]) => ({ eventId, ...data }))
                .sort((a, b) => b.revenue - a.revenue)
        };
    }, [payments, searchTerm, statusFilter, dateRange]);

    const formatAmount = (amount: number, currency: string = "NGN") => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency,
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusStyle = (status: string) => {
        const statusConfig = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || {
            bg: "#f4f6fa",
            color: "#767676",
            label: status,
            icon: FaEye,
        };
        return {
            backgroundColor: statusConfig.bg,
            color: statusConfig.color,
            padding: "4px 12px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "600",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
        };
    };

    const handleExport = async (format: ExportFormat) => {
        try {
            // Create CSV data
            const csvData = analytics.filteredPayments.map((payment: EventPayment) => ({
                'Member Name': `${payment.user?.firstName || ''} ${payment.user?.lastName || ''}`,
                'Email': payment.user?.email || '',
                'Event': payment.metadata?.eventTitle || 'Unknown Event',
                'Amount': payment.amount,
                'Currency': payment.currency,
                'Status': payment.status,
                'Transaction ID': payment.transactionId,
                'Date': formatDate(payment.createdAt),
            }));

            if (format === 'csv') {
                const csvContent = [
                    Object.keys(csvData[0] || {}).join(','),
                    ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
                ].join('\n');

                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `event-payments-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Export failed:', error);
        }
    };

    const clearFilters = () => {
        setSelectedEvent("");
        setSearchTerm("");
        setStatusFilter('all');
        setDateRange({ start: "", end: "" });
    };

    return (
        <div style={{ padding: "24px", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
            {/* Header */}
            <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
                    Payment Oversight
                </h1>
                <p style={{ color: "#64748b", fontSize: "16px" }}>
                    Monitor event revenue, analyze payment trends, and track financial performance
                </p>
            </div>

            {/* Analytics Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>
                            Total Revenue
                        </h3>
                        <FaMoneyBillWave style={{ color: "#059669", fontSize: "16px" }} />
                    </div>
                    <p style={{ fontSize: "24px", fontWeight: "700", color: "#059669" }}>
                        {formatAmount(analytics.totalRevenue)}
                    </p>
                    <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                        From {analytics.successfulPayments} successful payments
                    </p>
                </div>

                <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>
                            Successful Payments
                        </h3>
                        <FaCheckCircle style={{ color: "#059669", fontSize: "16px" }} />
                    </div>
                    <p style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a" }}>
                        {analytics.successfulPayments}
                    </p>
                    <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                        {analytics.totalTransactions > 0 ? 
                            `${Math.round((analytics.successfulPayments / analytics.totalTransactions) * 100)}% success rate` : 
                            'No transactions'
                        }
                    </p>
                </div>

                <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>
                            Pending Payments
                        </h3>
                        <FaClock style={{ color: "#b88712", fontSize: "16px" }} />
                    </div>
                    <p style={{ fontSize: "24px", fontWeight: "700", color: "#b88712" }}>
                        {analytics.pendingPayments}
                    </p>
                    <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                        Awaiting completion
                    </p>
                </div>

                <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>
                            Failed Payments
                        </h3>
                        <FaTimesCircle style={{ color: "#dc2626", fontSize: "16px" }} />
                    </div>
                    <p style={{ fontSize: "24px", fontWeight: "700", color: "#dc2626" }}>
                        {analytics.failedPayments}
                    </p>
                    <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                        Require attention
                    </p>
                </div>
            </div>

            {/* Revenue by Event Breakdown */}
            {analytics.revenueByEvent.length > 0 && (
                <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                        <FaChartLine style={{ color: "#059669", fontSize: "16px" }} />
                        <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>
                            Revenue by Event
                        </h2>
                    </div>
                    <div style={{ display: "grid", gap: "12px" }}>
                        {analytics.revenueByEvent.slice(0, 5).map((event) => (
                            <div key={event.eventId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                                <div>
                                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>
                                        {event.title}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "#64748b" }}>
                                        {event.count} payments
                                    </div>
                                </div>
                                <div style={{ fontSize: "16px", fontWeight: "700", color: "#059669" }}>
                                    {formatAmount(event.revenue)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Filters and Search */}
            <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaFilter style={{ color: "#64748b", fontSize: "16px" }} />
                        <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>
                            Filters & Search
                        </h3>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button
                            onClick={clearFilters}
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#f1f5f9",
                                color: "#64748b",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "14px",
                                fontWeight: "500",
                                cursor: "pointer",
                            }}
                        >
                            Clear Filters
                        </button>
                        <button
                            onClick={() => handleExport('csv')}
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#059669",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "14px",
                                fontWeight: "500",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                            }}
                        >
                            <FaDownload style={{ fontSize: "12px" }} />
                            Export CSV
                        </button>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                            Filter by Event
                        </label>
                        <select
                            value={selectedEvent}
                            onChange={(e) => setSelectedEvent(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "8px 12px",
                                border: "1px solid #d1d5db",
                                borderRadius: "8px",
                                fontSize: "14px",
                            }}
                        >
                            <option value="">All Events</option>
                            {eventStats.map((stat: EventStats) => (
                                <option key={stat._id} value={stat._id}>
                                    {stat.eventTitle} ({stat.count} payments)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                            Payment Status
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as PaymentStatus)}
                            style={{
                                width: "100%",
                                padding: "8px 12px",
                                border: "1px solid #d1d5db",
                                borderRadius: "8px",
                                fontSize: "14px",
                            }}
                        >
                            <option value="all">All Statuses</option>
                            <option value="success">Successful</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                            Search Members
                        </label>
                        <div style={{ position: "relative" }}>
                            <FaSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: "14px" }} />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px 8px 36px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                            Date Range
                        </label>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                style={{
                                    flex: 1,
                                    padding: "8px 12px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                }}
                            />
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                style={{
                                    flex: 1,
                                    padding: "8px 12px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Payments Table */}
            <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
                <div style={{ padding: "20px", borderBottom: "1px solid #e5e7eb" }}>
                    <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>
                        Payment Transactions ({analytics.filteredPayments.length})
                    </h2>
                </div>

                {loading ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                        Loading payments...
                    </div>
                ) : error ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "#dc2626" }}>
                        Error: {error}
                    </div>
                ) : analytics.filteredPayments.length === 0 ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                        <FaCalendarAlt style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.3 }} />
                        <div>No payments found matching your criteria</div>
                        <button
                            onClick={clearFilters}
                            style={{
                                marginTop: "12px",
                                padding: "8px 16px",
                                backgroundColor: "#059669",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "14px",
                                cursor: "pointer",
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead style={{ backgroundColor: "#f8fafc" }}>
                                <tr>
                                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>
                                        Member
                                    </th>
                                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>
                                        Event
                                    </th>
                                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>
                                        Amount
                                    </th>
                                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>
                                        Status
                                    </th>
                                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>
                                        Date
                                    </th>
                                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>
                                        Transaction ID
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.filteredPayments.map((payment: EventPayment) => {
                                    const StatusIcon = STATUS_COLORS[payment.status as keyof typeof STATUS_COLORS]?.icon || FaEye;
                                    return (
                                        <tr key={payment._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                            <td style={{ padding: "16px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                    <div
                                                        style={{
                                                            width: "40px",
                                                            height: "40px",
                                                            borderRadius: "50%",
                                                            backgroundColor: "#e2e8f0",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontSize: "14px",
                                                            fontWeight: "600",
                                                            color: "#64748b",
                                                        }}
                                                    >
                                                        {payment.user?.profilePicture ? (
                                                            <img
                                                                src={payment.user.profilePicture}
                                                                alt=""
                                                                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                                                            />
                                                        ) : (
                                                            `${payment.user?.firstName?.[0] || ""}${payment.user?.lastName?.[0] || ""}`
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>
                                                            {payment.user?.firstName || ""} {payment.user?.lastName || ""}
                                                        </div>
                                                        <div style={{ fontSize: "12px", color: "#64748b" }}>
                                                            {payment.user?.email || ""}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: "16px" }}>
                                                <div style={{ fontSize: "14px", fontWeight: "500", color: "#1e293b" }}>
                                                    {payment.metadata?.eventTitle || "Unknown Event"}
                                                </div>
                                                {payment.eventDetails && (
                                                    <div style={{ fontSize: "12px", color: "#64748b" }}>
                                                        {new Date(payment.eventDetails.date).toLocaleDateString()} • {payment.eventDetails.location}
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ padding: "16px" }}>
                                                <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>
                                                    {formatAmount(payment.amount, payment.currency)}
                                                </div>
                                            </td>
                                            <td style={{ padding: "16px" }}>
                                                <span style={getStatusStyle(payment.status)}>
                                                    <StatusIcon style={{ fontSize: "10px" }} />
                                                    {STATUS_COLORS[payment.status as keyof typeof STATUS_COLORS]?.label || payment.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: "16px" }}>
                                                <div style={{ fontSize: "14px", color: "#64748b" }}>
                                                    {formatDate(payment.createdAt)}
                                                </div>
                                            </td>
                                            <td style={{ padding: "16px" }}>
                                                <div style={{ fontSize: "12px", fontFamily: "monospace", color: "#64748b" }}>
                                                    {payment.transactionId}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}