"use client";

import { useState } from "react";
import { useAdminNews } from "@/hooks/useAdminNews";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface DeleteNewsModalProps {
    news: any;
    onClose: () => void;
    onSuccess: () => void;
}

export function DeleteNewsModal({ news, onClose, onSuccess }: DeleteNewsModalProps) {
    const { deleteNews } = useAdminNews();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        const success = await deleteNews(news._id);
        setLoading(false);
        if (success) onSuccess();
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                            <FaExclamationTriangle className="w-5 h-5 text-red-500" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Delete News</h2>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                        <FaTimes className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-sm text-slate-600">
                        Are you sure you want to delete <span className="font-bold text-slate-900">&ldquo;{news.title}&rdquo;</span>? This action cannot be undone.
                        All associated comments will also be deleted.
                    </p>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-slate-100">
                    <Button variant="outline" onClick={onClose} disabled={loading} className="rounded-xl font-bold border-slate-200">Cancel</Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={loading} className="rounded-xl font-bold shadow-md shadow-red-600/20">
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
