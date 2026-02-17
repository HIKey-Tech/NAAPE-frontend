"use client";
import React, { useState } from "react";
import { IPublication } from "@/app/api/publication/types";
import { FaTimes, FaExclamationTriangle, FaTrash } from "react-icons/fa";
import { useDeletePublication } from "@/hooks/useAdminPublications";
import { toast } from "sonner";

interface DeletePublicationModalProps {
    publication: IPublication;
    onClose: () => void;
}

export const DeletePublicationModal: React.FC<DeletePublicationModalProps> = ({
    publication,
    onClose,
}) => {
    const [reason, setReason] = useState("");
    const deleteMutation = useDeletePublication();

    const handleDelete = () => {
        deleteMutation.mutate(
            { id: publication._id, reason: reason.trim() || undefined },
            {
                onSuccess: () => { toast.success("Publication deleted"); onClose(); },
                onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to delete"),
            }
        );
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                            <FaExclamationTriangle size={18} />
                        </div>
                        <h2 className="text-lg font-black text-slate-900">Delete Publication</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors" aria-label="Close">
                        <FaTimes className="text-slate-400" size={14} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    <p className="text-sm text-slate-600">Are you sure you want to delete this publication? This action cannot be undone.</p>

                    <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-100">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Title</span>
                            <p className="text-sm font-bold text-slate-800 mt-0.5">{publication.title}</p>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Author</span>
                            <p className="text-sm font-medium text-slate-700 mt-0.5">{publication.author.name}</p>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="reason" className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-2">
                            Reason (optional)
                        </label>
                        <textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Provide a reason for deletion..."
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-red-400 focus:ring-4 focus:ring-red-50 outline-none resize-none transition-all"
                            rows={3}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-end gap-3">
                    <button onClick={onClose} disabled={deleteMutation.isPending} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50">
                        Cancel
                    </button>
                    <button onClick={handleDelete} disabled={deleteMutation.isPending} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl shadow-md shadow-red-200 hover:bg-red-700 transition-colors disabled:opacity-50">
                        <FaTrash size={12} />
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};
