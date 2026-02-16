"use client";
import React from "react";
import { IPublication } from "@/app/api/publication/types";
import { FaTimes, FaUser, FaEnvelope, FaCalendar, FaTag } from "react-icons/fa";
import { useApprovePublication, useRejectPublication } from "@/hooks/usePublications";
import { toast } from "sonner";

interface PublicationDetailsModalProps {
    publication: IPublication;
    onClose: () => void;
}

export const PublicationDetailsModal: React.FC<PublicationDetailsModalProps> = ({
    publication,
    onClose,
}) => {
    const approveMutation = useApprovePublication();
    const rejectMutation = useRejectPublication();

    const handleApprove = () => {
        approveMutation.mutate(publication._id, {
            onSuccess: () => {
                toast.success("Publication approved successfully");
                onClose();
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || "Failed to approve publication");
            },
        });
    };

    const handleReject = () => {
        rejectMutation.mutate(publication._id, {
            onSuccess: () => {
                toast.success("Publication rejected successfully");
                onClose();
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || "Failed to reject publication");
            },
        });
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Publication Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                        aria-label="Close"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">{publication.title}</h3>
                        <div className="flex items-center gap-2">
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                    publication.status === "approved"
                                        ? "bg-green-100 text-green-800"
                                        : publication.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : publication.status === "rejected"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                            >
                                {publication.status.charAt(0).toUpperCase() + publication.status.slice(1)}
                            </span>
                        </div>
                    </div>

                    {/* Author Info */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <h4 className="font-semibold text-gray-900 mb-3">Author Information</h4>
                        <div className="flex items-center gap-2 text-gray-700">
                            <FaUser className="text-gray-400" />
                            <span>{publication.author.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <FaEnvelope className="text-gray-400" />
                            <span>{publication.author.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <FaTag className="text-gray-400" />
                            <span className="capitalize">{publication.author.role}</span>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FaCalendar className="text-gray-400" />
                                <span>Submitted: {formatDate(publication.createdAt)}</span>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FaTag className="text-gray-400" />
                                <span>Category: {publication.category || "Uncategorized"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Image */}
                    {publication.image && (
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Featured Image</h4>
                            <img
                                src={publication.image}
                                alt={publication.title}
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Content</h4>
                        <div
                            className="prose max-w-none text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: publication.content }}
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                {publication.status === "pending" && (
                    <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            Close
                        </button>
                        <button
                            onClick={handleReject}
                            disabled={rejectMutation.isPending}
                            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                        >
                            {rejectMutation.isPending ? "Rejecting..." : "Reject"}
                        </button>
                        <button
                            onClick={handleApprove}
                            disabled={approveMutation.isPending}
                            className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                        >
                            {approveMutation.isPending ? "Approving..." : "Approve"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
