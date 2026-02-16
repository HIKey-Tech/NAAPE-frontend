"use client";

import React, { useState } from "react";
import { 
    FaSearch, 
    FaEdit, 
    FaTrash, 
    FaExclamationTriangle,
    FaSave,
    FaTimes
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
                    <h2 className="text-2xl font-bold text-gray-900">Reply Moderation</h2>
                    <p className="text-gray-600 mt-1">Manage and moderate forum replies</p>
                </div>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search replies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Bulk Actions Bar */}
            {selectedReplies.length > 0 && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-blue-900">
                                    {selectedReplies.length} repl{selectedReplies.length !== 1 ? 'ies' : 'y'} selected
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedReplies([])}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Clear selection
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleBulkDelete}
                                    className="text-red-600 border-red-300 hover:bg-red-50"
                                >
                                    <FaTrash className="w-3 h-3 mr-1" />
                                    Delete Selected
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
            {/* Replies List */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            Forum Replies
                            {pagination?.total && (
                                <Badge variant="secondary">
                                    {pagination.total} total
                                </Badge>
                            )}
                        </CardTitle>
                        {replies.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={selectedReplies.length === replies.length}
                                    onCheckedChange={handleSelectAll}
                                />
                                <span className="text-sm text-gray-600">Select all</span>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : replies.length === 0 ? (
                        <div className="text-center py-8">
                            <FaExclamationTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No replies found</h3>
                            <p className="text-gray-600">Try adjusting your search criteria.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {replies.map((reply) => (
                                <div
                                    key={reply._id}
                                    className={`border rounded-lg p-4 transition-colors ${
                                        selectedReplies.includes(reply._id)
                                            ? 'border-blue-300 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
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
                                                    <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                                                        <span className="font-medium">{reply.author.name}</span>
                                                        <span>•</span>
                                                        <span>{new Date(reply.createdAt).toLocaleString()}</span>
                                                        {reply.thread && (
                                                            <>
                                                                <span>•</span>
                                                                <span className="text-blue-600">
                                                                    in "{(reply.thread as any).title}"
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
                                                                className="w-full"
                                                            />
                                                            <Input
                                                                placeholder="Reason for edit (optional)"
                                                                value={editReason}
                                                                onChange={(e) => setEditReason(e.target.value)}
                                                            />
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    onClick={saveEdit}
                                                                    disabled={!editContent.trim() || updateReply.isPending}
                                                                    className="bg-green-600 hover:bg-green-700"
                                                                >
                                                                    <FaSave className="w-3 h-3 mr-1" />
                                                                    Save
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={cancelEdit}
                                                                >
                                                                    <FaTimes className="w-3 h-3 mr-1" />
                                                                    Cancel
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-gray-50 rounded p-3 mb-3">
                                                            <p className="text-gray-900 whitespace-pre-wrap">
                                                                {reply.content}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Edit Status */}
                                                    {reply.isEdited && (
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                                                Edited
                                                            </Badge>
                                                            {reply.editedAt && (
                                                                <span className="text-xs text-gray-500">
                                                                    {new Date(reply.editedAt).toLocaleString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Moderation Notes */}
                                                    {reply.moderationNotes && (
                                                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                                            <span className="font-medium text-gray-700">Moderation Notes:</span>
                                                            <p className="text-gray-600 mt-1">{reply.moderationNotes}</p>
                                                            {reply.moderatedBy && (
                                                                <p className="text-xs text-gray-500 mt-1">
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
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => startEdit(reply)}
                                                            className="text-blue-600"
                                                            title="Edit reply"
                                                        >
                                                            <FaEdit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleDelete(reply)}
                                                            className="text-red-600"
                                                            title="Delete reply"
                                                        >
                                                            <FaTrash className="w-4 h-4" />
                                                        </Button>
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
                        <div className="flex items-center justify-between mt-6 pt-4 border-t">
                            <div className="text-sm text-gray-600">
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
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-gray-600">
                                    Page {currentPage} of {pagination.pages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                                    disabled={currentPage === pagination.pages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedReplies.length > 0 
                                ? `Are you sure you want to delete ${selectedReplies.length} selected repl${selectedReplies.length !== 1 ? 'ies' : 'y'}? This action cannot be undone.`
                                : `Are you sure you want to delete this reply? This action cannot be undone.`
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="my-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reason for deletion (optional)
                        </label>
                        <Textarea
                            value={deleteReason}
                            onChange={(e) => setDeleteReason(e.target.value)}
                            placeholder="Enter reason for deletion..."
                            rows={3}
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setShowDeleteDialog(false);
                            setDeleteReason("");
                            setCurrentReply(null);
                        }}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete Repl{selectedReplies.length > 1 ? 'ies' : 'y'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}