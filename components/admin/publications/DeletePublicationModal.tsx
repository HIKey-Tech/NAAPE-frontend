"use client";
import React, { useState } from "react";
import { IPublication } from "@/app/api/publication/types";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
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
                onSuccess: () => {
                    toast.success("Publication deleted successfully");
                    onClose();
                },
                onError: (error: any) => {
                    toast.error(error?.response?.data?.message || "Failed to delete publication");
                },
            }
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
                {/* Header */}
                <div className="bg-red-50 border-b border-red-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
                    <div className="flex items-center gap-3">
                        <FaExclamationTriangle className="text-red-600 text-xl" />
                        <h2 className="text-xl font-bold text-red-900">Delete Publication</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-red-400 hover:text-red-600 transition"
                        aria-label="Close"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-gray-700">
                        Are you sure you want to delete this publication? This action cannot be undone.
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div>
                            <span className="text-sm font-semibold text-gray-600">Title:</span>
                            <p className="text-gray-900">{publication.title}</p>
                        </div>
                        <div>
                            <span className="text-sm font-semibold text-gray-600">Author:</span>
                            <p className="text-gray-900">{publication.author.name}</p>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                            Reason for deletion (optional)
                        </label>
                        <textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Provide a reason for deleting this publication..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                            rows={3}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3 rounded-b-lg">
                    <button
                        onClick={onClose}
                        disabled={deleteMutation.isPending}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                    >
                        {deleteMutation.isPending ? "Deleting..." : "Delete Publication"}
                    </button>
                </div>
            </div>
        </div>
    );
};
