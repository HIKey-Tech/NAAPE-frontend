"use client";
import React from "react";
import { IPublication } from "@/app/api/publication/types";
import { FaTimes, FaUser, FaEnvelope, FaCalendar, FaTag, FaCheck } from "react-icons/fa";
import { useApprovePublication, useRejectPublication } from "@/hooks/usePublications";
import { toast } from "sonner";

interface PublicationDetailsModalProps {
    publication: IPublication;
    onClose: () => void;
}

const statusStyles: Record<string, string> = {
    approved: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    pending: "bg-amber-50 text-amber-700 border border-amber-100",
    rejected: "bg-red-50 text-red-700 border border-red-100",
    draft: "bg-slate-100 text-slate-600",
};

export const PublicationDetailsModal: React.FC<PublicationDetailsModalProps> = ({
    publication,
    onClose,
}) => {
    const approveMutation = useApprovePublication();
    const rejectMutation = useRejectPublication();

    const handleApprove = () => {
        approveMutation.mutate(publication._id, {
            onSuccess: () => { toast.success("Publication approved"); onClose(); },
            onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to approve"),
        });
    };

    const handleReject = () => {
        rejectMutation.mutate(publication._id, {
            onSuccess: () => { toast.success("Publication rejected"); onClose(); },
            onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to reject"),
        });
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-6 py-5 flex items-center justify-between z-10 rounded-t-2xl">
                    <h2 className="text-xl font-black text-slate-900">Publication Details</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors" aria-label="Close">
                        <FaTimes className="text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 mb-3">{publication.title}</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusStyles[publication.status]}`}>
                            {publication.status.charAt(0).toUpperCase() + publication.status.slice(1)}
                        </span>
                    </div>

                    {/* Author Info */}
                    <div className="bg-slate-50 rounded-xl p-5 space-y-3 border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Author Information</h4>
                        <div className="flex items-center gap-2.5 text-sm text-slate-700">
                            <FaUser className="text-slate-400" size={14} /> <span className="font-medium">{publication.author.name}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-sm text-slate-700">
                            <FaEnvelope className="text-slate-400" size={14} /> <span>{publication.author.email}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-sm text-slate-700">
                            <FaTag className="text-slate-400" size={14} /> <span className="capitalize">{publication.author.role}</span>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <FaCalendar className="text-slate-400" size={12} />
                                <span>Submitted: <strong>{formatDate(publication.createdAt)}</strong></span>
                            </div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <FaTag className="text-slate-400" size={12} />
                                <span>Category: <strong>{publication.category || "Uncategorized"}</strong></span>
                            </div>
                        </div>
                    </div>

                    {/* Image */}
                    {publication.image && (
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Featured Image</h4>
                            <img src={publication.image} alt={publication.title} className="w-full h-64 object-cover rounded-xl" />
                        </div>
                    )}

                    {/* Content */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Content</h4>
                        <div className="prose max-w-none text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: publication.content }} />
                    </div>
                </div>

                {/* Footer Actions */}
                {publication.status === "pending" && (
                    <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
                        <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                            Close
                        </button>
                        <button onClick={handleReject} disabled={rejectMutation.isPending} className="px-5 py-2.5 text-sm font-bold text-red-700 bg-red-50 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50">
                            {rejectMutation.isPending ? "Rejecting..." : "Reject"}
                        </button>
                        <button onClick={handleApprove} disabled={approveMutation.isPending} className="px-5 py-2.5 text-sm font-bold text-white bg-primary rounded-xl shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors disabled:opacity-50">
                            <FaCheck className="inline mr-1.5" size={12} />
                            {approveMutation.isPending ? "Approving..." : "Approve"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
