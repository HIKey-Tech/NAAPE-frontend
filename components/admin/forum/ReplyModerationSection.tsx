"use client";

import React, { useState } from "react";
import {
    FaSearch,
    FaEdit,
    FaTrash,
    FaExclamationTriangle,
    FaSave,
    FaTimes,
    FaReply
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    useAllRepliesAdmin,
    useUpdateReply,
    useDeleteReply,
    useBulkReplyActions
} from "@/hooks/useThreadModeration";
import { AdminForumReply } from "@/app/api/admin/forum";

interface ReplyModerationSectionProps {
    className?: string;
}

export function ReplyModerationSection({ className }: ReplyModerationSectionProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedReplies, setSelectedReplies] = useState<string[]>([]);
    const [editingReply, setEditingReply] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [editReason, setEditReason] = useState("");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [currentReply, setCurrentReply] = useState<AdminForumReply | null>(null);
    const [deleteReason, setDeleteReason] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Hooks
    const { data: repliesData, isLoading } = useAllRepliesAdmin({
        page: currentPage,
        limit: 20,
        search: searchTerm || undefined,
    });

    const updateReply = useUpdateReply();
    const deleteReply = useDeleteReply();
    const bulkActions = useBulkReplyActions();

    const replies = repliesData?.data || [];
    const pagination = repliesData?.pagination;

    // Handlers
    const handleSelectReply = (replyId: string, checked: boolean) => {
        if (checked) {
            setSelectedReplies(prev => [...prev, replyId]);
        } else {
            setSelectedReplies(prev => prev.filter(id => id !== replyId));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedReplies(replies.map(reply => reply._id));
        } else {
            setSelectedReplies([]);
        }
    };

    const startEdit = (reply: AdminForumReply) => {
        setEditingReply(reply._id);
        setEditContent(reply.content);
        setEditReason("");
    };

    const cancelEdit = () => {
        setEditingReply(null);
        setEditContent("");
        setEditReason("");
    };

    const saveEdit = () => {
        if (!editingReply || !editContent.trim()) return;

        updateReply.mutate({
            replyId: editingReply,
            content: editContent.trim(),
            reason: editReason || undefined
        }, {
            onSuccess: () => {
                setEditingReply(null);
                setEditContent("");
                setEditReason("");
            }
        });
    };

    const handleDelete = (reply: AdminForumReply) => {
        setCurrentReply(reply);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (selectedReplies.length > 0) {
            bulkActions.mutate({
                replyIds: selectedReplies,
                action: 'delete',
                data: { reason: deleteReason }
            }, {
                onSuccess: () => {
                    setSelectedReplies([]);
                    setShowDeleteDialog(false);
                    setDeleteReason("");
                }
            });
        } else if (currentReply) {
            deleteReply.mutate({
                replyId: currentReply._id,
                reason: deleteReason
            }, {
                onSuccess: () => {
                    setShowDeleteDialog(false);
                    setDeleteReason("");
                    setCurrentReply(null);
                }
            });
        }
    };

    const handleBulkDelete = () => {
        if (selectedReplies.length === 0) return;
        setShowDeleteDialog(true);
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Reply Moderation</h2>
                    <p className="text-slate-500 mt-1">Manage and moderate forum replies</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                        placeholder="Search replies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                    />
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedReplies.length > 0 && (
                <div className="bg-primary/5 rounded-2xl border border-primary/20 shadow-sm p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-primary/90">
                                {selectedReplies.length} repl{selectedReplies.length !== 1 ? 'ies' : 'y'} selected
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedReplies([])}
                                className="text-primary hover:text-primary/80 rounded-xl"
                            >
                                Clear selection
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleBulkDelete}
                                className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl font-bold"
                            >
                                <FaTrash className="w-3 h-3 mr-1" />
                                Delete Selected
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Replies List */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                {/* List Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                            <FaReply className="w-4 h-4 text-purple-600" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900">Forum Replies</h3>
                        {pagination?.total && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                                {pagination.total} total
                            </span>
                        )}
                    </div>
                    {replies.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={selectedReplies.length === replies.length}
                                onCheckedChange={handleSelectAll}
                            />
                            <span className="text-sm text-slate-500">Select all</span>
                        </div>
                    )}
                </div>

                {/* List Content */}
                <div className="p-5">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : replies.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                                <FaReply className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">No replies found</h3>
                            <p className="text-slate-500">Try adjusting your search criteria.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {replies.map((reply) => (
                                <div
                                    key={reply._id}
                                    className={`rounded-xl p-4 transition-all duration-200 ${selectedReplies.includes(reply._id)
                                            ? 'bg-primary/5 border border-primary/20'
                                            : 'bg-slate-50/50 border border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <Checkbox
                                            checked={selectedReplies.includes(reply._id)}
                                            onCheckedChange={(checked) =>
                                                handleSelectReply(reply._id, checked as boolean)
                                            }
                                            className="mt-1"
                                        />

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    {/* Reply Info */}
                                                    <div className="flex items-center gap-2 mb-2 text-sm text-slate-500">
                                                        <span className="font-bold text-slate-700">{reply.author.name}</span>
                                                        <span className="text-slate-300">•</span>
                                                        <span>{new Date(reply.createdAt).toLocaleString()}</span>
                                                        {reply.thread && (
                                                            <>
                                                                <span className="text-slate-300">•</span>
                                                                <span className="text-primary font-medium">
                                                                    in &quot;{(reply.thread as any).title}&quot;
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Reply Content */}
                                                    {editingReply === reply._id ? (
                                                        <div className="space-y-3">
                                                            <Textarea
                                                                value={editContent}
                                                                onChange={(e) => setEditContent(e.target.value)}
                                                                rows={4}
                                                                className="w-full rounded-xl border-slate-200 bg-white focus:bg-white"
                                                            />
                                                            <Input
                                                                placeholder="Reason for edit (optional)"
                                                                value={editReason}
                                                                onChange={(e) => setEditReason(e.target.value)}
                                                                className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                                                            />
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    onClick={saveEdit}
                                                                    disabled={!editContent.trim() || updateReply.isPending}
                                                                    className="bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold shadow-md shadow-emerald-600/20"
                                                                >
                                                                    <FaSave className="w-3 h-3 mr-1" />
                                                                    Save
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={cancelEdit}
                                                                    className="rounded-xl font-bold border-slate-200"
                                                                >
                                                                    <FaTimes className="w-3 h-3 mr-1" />
                                                                    Cancel
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-white rounded-xl p-3 mb-3 border border-slate-100">
                                                            <p className="text-slate-800 whitespace-pre-wrap text-sm">
                                                                {reply.content}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Edit Status */}
                                                    {reply.isEdited && (
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                                                                Edited
                                                            </span>
                                                            {reply.editedAt && (
                                                                <span className="text-xs text-slate-400">
                                                                    {new Date(reply.editedAt).toLocaleString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Moderation Notes */}
                                                    {reply.moderationNotes && (
                                                        <div className="mt-2 p-3 bg-slate-50 rounded-xl text-sm border border-slate-100">
                                                            <span className="font-bold text-slate-600 text-xs uppercase tracking-wide">Moderation Notes</span>
                                                            <p className="text-slate-600 mt-1">{reply.moderationNotes}</p>
                                                            {reply.moderatedBy && (
                                                                <p className="text-xs text-slate-400 mt-1">
                                                                    by {(reply.moderatedBy as any).name} on{' '}
                                                                    {reply.moderatedAt && new Date(reply.moderatedAt).toLocaleString()}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                {editingReply !== reply._id && (
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => startEdit(reply)}
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-primary hover:bg-primary/5 transition-colors"
                                                            title="Edit reply"
                                                        >
                                                            <FaEdit className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(reply)}
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                                                            title="Delete reply"
                                                        >
                                                            <FaTrash className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                            <div className="text-sm text-slate-500">
                                Showing {((currentPage - 1) * (pagination.limit || 20)) + 1} to{' '}
                                {Math.min(currentPage * (pagination.limit || 20), pagination.total)} of{' '}
                                {pagination.total} replies
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="rounded-xl font-bold border-slate-200"
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-slate-500 px-2">
                                    Page {currentPage} of {pagination.pages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                                    disabled={currentPage === pagination.pages}
                                    className="rounded-xl font-bold border-slate-200"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-900">Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500">
                            {selectedReplies.length > 0
                                ? `Are you sure you want to delete ${selectedReplies.length} selected repl${selectedReplies.length !== 1 ? 'ies' : 'y'}? This action cannot be undone.`
                                : `Are you sure you want to delete this reply? This action cannot be undone.`
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="my-4">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                            Reason for deletion (optional)
                        </label>
                        <Textarea
                            value={deleteReason}
                            onChange={(e) => setDeleteReason(e.target.value)}
                            placeholder="Enter reason for deletion..."
                            rows={3}
                            className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => {
                                setShowDeleteDialog(false);
                                setDeleteReason("");
                                setCurrentReply(null);
                            }}
                            className="rounded-xl font-bold border-slate-200"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700 rounded-xl font-bold shadow-md shadow-red-600/20"
                        >
                            Delete Repl{selectedReplies.length > 1 ? 'ies' : 'y'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}