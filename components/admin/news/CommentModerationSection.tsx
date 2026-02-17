"use client";

import { useState, useEffect } from "react";
import { useAdminNews, useNewsComments } from "@/hooks/useAdminNews";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaComments, FaTrash, FaExclamationTriangle, FaTimes, FaReply, FaNewspaper } from "react-icons/fa";

export function CommentModerationSection() {
    const { news, fetchNews } = useAdminNews();
    const { comments, loading, pagination, fetchComments, deleteComment } = useNewsComments();
    const [selectedNewsId, setSelectedNewsId] = useState<string>("");
    const [deletingComment, setDeletingComment] = useState<any>(null);

    useEffect(() => {
        fetchNews({ limit: 100 });
    }, [fetchNews]);

    useEffect(() => {
        if (selectedNewsId) {
            fetchComments(selectedNewsId);
        }
    }, [selectedNewsId, fetchComments]);

    const handleDeleteComment = async () => {
        if (!deletingComment) return;
        const success = await deleteComment(deletingComment._id);
        if (success) {
            setDeletingComment(null);
            if (selectedNewsId) fetchComments(selectedNewsId);
        }
    };

    return (
        <div className="space-y-6">
            {/* News Selector */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 p-5 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center"><FaNewspaper className="w-4 h-4 text-primary" /></div>
                    <h3 className="text-base font-bold text-slate-900">Select News Article</h3>
                </div>
                <div className="p-5">
                    <Select value={selectedNewsId} onValueChange={setSelectedNewsId}>
                        <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50">
                            <SelectValue placeholder="Select a news article to view comments" />
                        </SelectTrigger>
                        <SelectContent>
                            {news.map((item) => (
                                <SelectItem key={item._id} value={item._id}>{item.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Comments */}
            {selectedNewsId && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 p-5 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center"><FaComments className="w-4 h-4 text-pink-500" /></div>
                        <h3 className="text-base font-bold text-slate-900">Comments</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">{pagination.total}</span>
                    </div>
                    <div className="p-5">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
                                    <p className="text-slate-500 text-sm">Loading comments...</p>
                                </div>
                            </div>
                        ) : comments.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4"><FaComments className="w-8 h-8 text-slate-300" /></div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">No comments yet</h3>
                                <p className="text-slate-500">This article doesn&apos;t have any comments.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {comments.map((comment) => (
                                    <div key={comment._id} className="rounded-xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 transition-all duration-200 p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                {comment.user?.name?.charAt(0)?.toUpperCase() || "U"}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="font-bold text-sm text-slate-900">{comment.user?.name || "Unknown User"}</p>
                                                        <p className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleString()}</p>
                                                    </div>
                                                    <button onClick={() => setDeletingComment(comment)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                                                        <FaTrash className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <p className="mt-2 text-sm text-slate-700 leading-relaxed">{comment.text}</p>
                                                {comment.parentComment && (
                                                    <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                                                        <FaReply className="w-3 h-3" />
                                                        <span>Reply to another comment</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                                <span className="text-sm text-slate-500">Page {pagination.page} of {pagination.pages}</span>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" disabled={pagination.page === 1} onClick={() => fetchComments(selectedNewsId, pagination.page - 1)} className="rounded-xl font-bold border-slate-200">Previous</Button>
                                    <Button variant="outline" size="sm" disabled={pagination.page >= pagination.pages} onClick={() => fetchComments(selectedNewsId, pagination.page + 1)} className="rounded-xl font-bold border-slate-200">Next</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingComment && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"><FaExclamationTriangle className="w-5 h-5 text-red-500" /></div>
                                <h2 className="text-lg font-bold text-slate-900">Delete Comment</h2>
                            </div>
                            <button onClick={() => setDeletingComment(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"><FaTimes className="w-3.5 h-3.5 text-slate-500" /></button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-slate-600">Are you sure you want to delete this comment? This action cannot be undone. All replies to this comment will also be deleted.</p>
                        </div>
                        <div className="flex justify-end gap-3 p-6 border-t border-slate-100">
                            <Button variant="outline" onClick={() => setDeletingComment(null)} className="rounded-xl font-bold border-slate-200">Cancel</Button>
                            <Button variant="destructive" onClick={handleDeleteComment} className="rounded-xl font-bold shadow-md shadow-red-600/20">Delete</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
