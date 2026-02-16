"use client";
import React, { useState, useMemo } from "react";
import { useAdminPublications } from "@/hooks/useAdminPublications";
import { useApprovePublication, useRejectPublication } from "@/hooks/usePublications";
import { IPublication } from "@/app/api/publication/types";
import { FaSearch, FaEye, FaTrash, FaFilter } from "react-icons/fa";
import { PublicationDetailsModal } from "./PublicationDetailsModal";
import { DeletePublicationModal } from "./DeletePublicationModal";
import { toast } from "sonner";

const STATUS_OPTIONS = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "draft", label: "Draft" },
];

export const PublicationManagementSection: React.FC = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [selectedPublication, setSelectedPublication] = useState<IPublication | null>(null);
    const [deletePublication, setDeletePublication] = useState<IPublication | null>(null);

    const { data, isLoading, isError } = useAdminPublications({
        status: statusFilter || undefined,
        search: search || undefined,
        page,
        limit: 20,
    });

    const approveMutation = useApprovePublication();
    const rejectMutation = useRejectPublication();

    const handleApprove = (publication: IPublication) => {
        approveMutation.mutate(publication._id, {
            onSuccess: () => toast.success("Publication approved"),
            onError: (error: any) =>
                toast.error(error?.response?.data?.message || "Failed to approve"),
        });
    };

    const handleReject = (publication: IPublication) => {
        rejectMutation.mutate(publication._id, {
            onSuccess: () => toast.success("Publication rejected"),
            onError: (error: any) =>
                toast.error(error?.response?.data?.message || "Failed to reject"),
        });
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getStatusBadge = (status: IPublication["status"]) => {
        const styles = {
            draft: "bg-gray-100 text-gray-800 border-gray-300",
            pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
            approved: "bg-green-100 text-green-800 border-green-300",
            rejected: "bg-red-100 text-red-800 border-red-300",
        };

        return (
            <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                    styles[status]
                }`}
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200">
            {/* Header with Filters */}
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">All Publications</h3>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by title, author, or content..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="sm:w-48 relative">
                        <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600">Loading publications...</p>
                    </div>
                ) : isError ? (
                    <div className="p-12 text-center text-red-600">
                        Failed to load publications. Please try again.
                    </div>
                ) : !data?.data || data.data.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No publications found.
                    </div>
                ) : (
                    <>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Author
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Submitted
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.data.map((publication) => (
                                    <tr key={publication._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                                {publication.title}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {publication.category || "Uncategorized"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {publication.author.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {publication.author.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(publication.status)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(publication.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedPublication(publication)}
                                                    className="text-blue-600 hover:text-blue-900 p-2"
                                                    title="View Details"
                                                >
                                                    <FaEye />
                                                </button>
                                                {publication.status === "pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(publication)}
                                                            disabled={approveMutation.isPending}
                                                            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(publication)}
                                                            disabled={rejectMutation.isPending}
                                                            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => setDeletePublication(publication)}
                                                    className="text-red-600 hover:text-red-900 p-2"
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {data.pagination && data.pagination.totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Showing page {data.pagination.page} of {data.pagination.totalPages}
                                    {" "}({data.pagination.total} total)
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setPage((p) => p + 1)}
                                        disabled={page >= data.pagination.totalPages}
                                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            {selectedPublication && (
                <PublicationDetailsModal
                    publication={selectedPublication}
                    onClose={() => setSelectedPublication(null)}
                />
            )}
            {deletePublication && (
                <DeletePublicationModal
                    publication={deletePublication}
                    onClose={() => setDeletePublication(null)}
                />
            )}
        </div>
    );
};
