"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdFlag, MdSend } from "react-icons/md";
import { toast } from "sonner";

export interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { reason: string; description?: string }) => Promise<void>;
    title: string;
    contentType: "thread" | "reply" | "user";
    contentPreview?: string;
}

const REPORT_REASONS = [
    { value: "spam", label: "Spam", description: "Unwanted commercial content or repetitive posts" },
    { value: "harassment", label: "Harassment", description: "Bullying, threats, or personal attacks" },
    { value: "inappropriate", label: "Inappropriate Content", description: "Offensive, explicit, or unsuitable material" },
    { value: "off-topic", label: "Off-topic", description: "Content not relevant to the discussion" },
    { value: "other", label: "Other", description: "Other violations not listed above" },
];

const ReportModal: React.FC<ReportModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    contentType,
    contentPreview,
}) => {
    const [selectedReason, setSelectedReason] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedReason) {
            toast.error("Please select a reason for reporting");
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                reason: selectedReason,
                description: description.trim() || undefined,
            });

            setSelectedReason("");
            setDescription("");
            onClose();
            toast.success("Report submitted successfully");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to submit report");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setSelectedReason("");
            setDescription("");
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                                    <MdFlag className="text-red-500" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Report {contentType}</h2>
                                    <p className="text-xs text-slate-500">{title}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="w-8 h-8 hover:bg-slate-100 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
                            >
                                <MdClose size={18} className="text-slate-500" />
                            </button>
                        </div>

                        {/* Content Preview */}
                        {contentPreview && (
                            <div className="p-6 border-b border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Content being reported</p>
                                <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-700 line-clamp-3">
                                    {contentPreview}
                                </div>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6">
                            {/* Reason Selection */}
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                                    Why are you reporting this {contentType}? <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-2">
                                    {REPORT_REASONS.map((reason) => (
                                        <label
                                            key={reason.value}
                                            className={`block p-3 border rounded-xl cursor-pointer transition-all ${selectedReason === reason.value
                                                    ? "border-red-300 bg-red-50"
                                                    : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/50"
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="radio"
                                                    name="reason"
                                                    value={reason.value}
                                                    checked={selectedReason === reason.value}
                                                    onChange={(e) => setSelectedReason(e.target.value)}
                                                    className="mt-1 text-red-600 focus:ring-red-500"
                                                />
                                                <div>
                                                    <div className="font-bold text-sm text-slate-900">{reason.label}</div>
                                                    <div className="text-xs text-slate-500">{reason.description}</div>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Description */}
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                                    Additional details (optional)
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Provide any additional context that might help us understand the issue..."
                                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-500/10 outline-none resize-none transition-all"
                                    rows={4}
                                    maxLength={1000}
                                />
                                <div className="text-xs text-slate-400 mt-1">
                                    {description.length}/1000 characters
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!selectedReason || isSubmitting}
                                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold shadow-md shadow-red-600/20 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                                >
                                    <MdSend size={16} />
                                    {isSubmitting ? "Submitting..." : "Submit Report"}
                                </button>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="px-6 pb-6">
                            <div className="bg-primary/5 border border-primary/10 rounded-xl p-3">
                                <p className="text-xs text-slate-600">
                                    <strong className="text-slate-700">Note:</strong> False reports may result in restrictions on your account.
                                    Reports are reviewed by our moderation team and appropriate action will be taken.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ReportModal;