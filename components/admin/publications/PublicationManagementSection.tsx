"use client";
import React, { useState } from "react";
import { useAdminPublications } from "@/hooks/useAdminPublications";
import { useApprovePublication, useRejectPublication } from "@/hooks/usePublications";
import { IPublication } from "@/app/api/publication/types";
import { FaSearch, FaEye, FaTrash, FaCheck, FaTimes, FaChevronLeft, FaChevronRight, FaBook } from "react-icons/fa";
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

const statusStyles: Record<string, string> = {
    draft: "bg-slate-100 text-slate-600",
    pending: "bg-amber-50 text-amber-700 border border-amber-100",
    approved: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    rejected: "bg-red-50 text-red-700 border border-red-100",
};

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

    const handleApprove = (pub: IPublication) => {
        approveMutation.mutate(pub._id, {
            onSuccess: () => toast.success("Publication approved"),
            onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to approve"),
        });
    };

    const handleReject = (pub: IPublication) => {
        rejectMutation.mutate(pub._id, {
            onSuccess: () => toast.success("Publication rejected"),
            onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to reject"),
        });
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            {/* Header with Filters */}
            <div className="p-6 border-b border-slate-50">
                <h3 className="text-lg font-bold text-slate-800 mb-5">All Publications</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search by title, author..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="sm:w-44 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none"
                    >
                        {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <div className="w-8 h-8 border-2 border-slate-200 border-t-primary rounded-full animate-spin mb-3" />
                        <span className="font-medium text-sm">Loading publications...</span>
                    </div>
                ) : isError ? (
                    <div className="py-16 text-center text-red-500 font-medium text-sm">Failed to load publications.</div>
                ) : !data?.data || data.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <FaBook className="text-xl text-slate-300" />
                        </div>
                        <span className="font-semibold text-slate-500">No publications found</span>
                        <span className="text-sm text-slate-400 mt-1">Try adjusting your filters.</span>
                    </div>
                ) : (
                    <>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Title</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Author</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Date</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data.data.map((pub) => (
                                    <tr key={pub._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="text-sm font-semibold text-slate-800 truncate max-w-xs">{pub.title}</div>
                                            <div className="text-xs text-slate-400 mt-0.5">{pub.category || "Uncategorized"}</div>
                                        </td>
                                        <td className="py-4 px-6 hidden md:table-cell">
                                            <div className="text-sm font-medium text-slate-700">{pub.author.name}</div>
                                            <div className="text-xs text-slate-400">{pub.author.email}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${statusStyles[pub.status]}`}>
                                                {pub.status.charAt(0).toUpperCase() + pub.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-500 hidden sm:table-cell">{formatDate(pub.createdAt)}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button onClick={() => setSelectedPublication(pub)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors" title="View">
                                                    <FaEye size={14} />
                                                </button>
                                                {pub.status === "pending" && (
                                                    <>
                                                        <button onClick={() => handleApprove(pub)} disabled={approveMutation.isPending} className="p-2 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50" title="Approve">
                                                            <FaCheck size={14} />
                                                        </button>
                                                        <button onClick={() => handleReject(pub)} disabled={rejectMutation.isPending} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" title="Reject">
                                                            <FaTimes size={14} />
                                                        </button>
                                                    </>
                                                )}
                                                <button onClick={() => setDeletePublication(pub)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                    <FaTrash size={12} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {data.pagination && data.pagination.totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-slate-50 flex items-center justify-between">
                                <span className="text-sm text-slate-500">
                                    Page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} total)
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                        <FaChevronLeft size={10} /> Previous
                                    </button>
                                    <button onClick={() => setPage((p) => p + 1)} disabled={page >= data.pagination.totalPages} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                        Next <FaChevronRight size={10} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            {selectedPublication && <PublicationDetailsModal publication={selectedPublication} onClose={() => setSelectedPublication(null)} />}
            {deletePublication && <DeletePublicationModal publication={deletePublication} onClose={() => setDeletePublication(null)} />}
        </div>
    );
};
