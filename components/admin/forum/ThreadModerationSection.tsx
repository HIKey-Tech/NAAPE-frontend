"use client";

import React, { useState } from "react";
import { 
    FaSearch, 
    FaFilter, 
    FaEye, 
    FaThumbtack, 
    FaLock, 
    FaEdit, 
    FaTrash, 
    FaArrowRight,
    FaCheck,
    FaTimes,
    FaExclamationTriangle
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { Textarea } from "@/components/ui/textarea";
import { 
    useAllThreadsAdmin, 
    usePendingApprovals,
    usePinThread,
    useLockThread,
    useMoveThread,
    useDeleteThread,
    useBulkThreadActions,
    useApproveThread,
    useRejectThread
} from "@/hooks/useThreadModeration";
import { useAdminForumCategories } from "@/hooks/useAdminForumCategories";
import { AdminForumThread } from "@/app/api/admin/forum";
import { ReplyModerationSection } from "./ReplyModerationSection";

interface ThreadModerationSectionProps {
    className?: string;
}
function ThreadModerationSection({ className }: ThreadModerationSectionProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [selectedThreads, setSelectedThreads] = useState<string[]>([]);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showMoveDialog, setShowMoveDialog] = useState(false);
    const [showApprovalDialog, setShowApprovalDialog] = useState(false);
    const [currentThread, setCurrentThread] = useState<AdminForumThread | null>(null);
    const [deleteReason, setDeleteReason] = useState("");
    const [moveTargetCategory, setMoveTargetCategory] = useState("");
    const [moveReason, setMoveReason] = useState("");
    const [approvalNotes, setApprovalNotes] = useState("");
    const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState<'threads' | 'pending' | 'replies'>('threads');

    // Hooks
    const { data: categories } = useAdminForumCategories();
    const { data: threadsData, isLoading: threadsLoading } = useAllThreadsAdmin({
        page: currentPage,
        limit: 20,
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
        status: (statusFilter as 'pending' | 'approved' | 'pinned' | 'locked') || undefined,
    });
    const { data: pendingData, isLoading: pendingLoading } = usePendingApprovals({
        page: currentPage,
        limit: 20,
    });

    const pinThread = usePinThread();
    const lockThread = useLockThread();
    const moveThread = useMoveThread();
    const deleteThread = useDeleteThread();
    const bulkActions = useBulkThreadActions();
    const approveThread = useApproveThread();
    const rejectThread = useRejectThread();

    const currentData = activeTab === 'threads' ? threadsData : pendingData;
    const isLoading = activeTab === 'threads' ? threadsLoading : pendingLoading;
    const threads = currentData?.data || [];
    const pagination = currentData?.pagination;

    // Handlers
    const handleSelectThread = (threadId: string, checked: boolean) => {
        if (checked) {
            setSelectedThreads(prev => [...prev, threadId]);
        } else {
            setSelectedThreads(prev => prev.filter(id => id !== threadId));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedThreads(threads.map(thread => thread._id));
        } else {
            setSelectedThreads([]);
        }
    };

    const handleBulkAction = (action: string) => {
        if (selectedThreads.length === 0) return;

        const actionData: any = {
            threadIds: selectedThreads,
            action,
        };

        if (action === 'move') {
            setShowMoveDialog(true);
            return;
        }

        if (action === 'delete') {
            setShowDeleteDialog(true);
            return;
        }

        bulkActions.mutate(actionData, {
            onSuccess: () => {
                setSelectedThreads([]);
                setShowBulkActions(false);
            }
        });
    };

    const handleSingleAction = (thread: AdminForumThread, action: string) => {
        setCurrentThread(thread);
        
        switch (action) {
            case 'pin':
                pinThread.mutate(thread._id);
                break;
            case 'lock':
                lockThread.mutate(thread._id);
                break;
            case 'move':
                setShowMoveDialog(true);
                break;
            case 'delete':
                setShowDeleteDialog(true);
                break;
            case 'approve':
                setApprovalAction('approve');
                setShowApprovalDialog(true);
                break;
            case 'reject':
                setApprovalAction('reject');
                setShowApprovalDialog(true);
                break;
        }
    };

    const confirmDelete = () => {
        if (selectedThreads.length > 0) {
            bulkActions.mutate({
                threadIds: selectedThreads,
                action: 'delete',
                data: { reason: deleteReason }
            }, {
                onSuccess: () => {
                    setSelectedThreads([]);
                    setShowBulkActions(false);
                    setShowDeleteDialog(false);
                    setDeleteReason("");
                }
            });
        } else if (currentThread) {
            deleteThread.mutate({
                threadId: currentThread._id,
                reason: deleteReason
            }, {
                onSuccess: () => {
                    setShowDeleteDialog(false);
                    setDeleteReason("");
                    setCurrentThread(null);
                }
            });
        }
    };

    const confirmMove = () => {
        if (!moveTargetCategory) return;

        if (selectedThreads.length > 0) {
            bulkActions.mutate({
                threadIds: selectedThreads,
                action: 'move',
                data: { categoryId: moveTargetCategory, reason: moveReason }
            }, {
                onSuccess: () => {
                    setSelectedThreads([]);
                    setShowBulkActions(false);
                    setShowMoveDialog(false);
                    setMoveTargetCategory("");
                    setMoveReason("");
                }
            });
        } else if (currentThread) {
            moveThread.mutate({
                threadId: currentThread._id,
                data: { categoryId: moveTargetCategory, reason: moveReason }
            }, {
                onSuccess: () => {
                    setShowMoveDialog(false);
                    setMoveTargetCategory("");
                    setMoveReason("");
                    setCurrentThread(null);
                }
            });
        }
    };

    const confirmApproval = () => {
        if (!currentThread) return;

        const mutation = approvalAction === 'approve' ? approveThread : rejectThread;
        mutation.mutate({
            threadId: currentThread._id,
            reviewNotes: approvalNotes
        }, {
            onSuccess: () => {
                setShowApprovalDialog(false);
                setApprovalNotes("");
                setCurrentThread(null);
            }
        });
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Thread Moderation</h2>
                    <p className="text-gray-600 mt-1">Manage and moderate forum threads</p>
                </div>
                
                {/* Tab Switcher */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('threads')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === 'threads'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        All Threads
                    </button>
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === 'pending'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Pending Approval
                        {(pendingData?.pagination?.total ?? 0) > 0 && (
                            <Badge variant="destructive" className="ml-2">
                                {pendingData?.pagination?.total}
                            </Badge>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('replies')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === 'replies'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Reply Moderation
                    </button>
                </div>
            </div>

            {/* Filters - Only show for 'threads' tab */}
            {activeTab === 'threads' && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search threads..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select value={selectedCategory || "all"} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories?.map((category) => (
                                        <SelectItem key={category._id} value={category._id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter || "all"} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending Approval</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="pinned">Pinned</SelectItem>
                                    <SelectItem value="locked">Locked</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Bulk Actions Bar */}
            {selectedThreads.length > 0 && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-blue-900">
                                    {selectedThreads.length} thread{selectedThreads.length !== 1 ? 's' : ''} selected
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedThreads([])}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Clear selection
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleBulkAction('pin')}
                                    className="text-green-600 border-green-300 hover:bg-green-50"
                                >
                                    <FaThumbtack className="w-3 h-3 mr-1" />
                                    Pin
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleBulkAction('lock')}
                                    className="text-orange-600 border-orange-300 hover:bg-orange-50"
                                >
                                    <FaLock className="w-3 h-3 mr-1" />
                                    Lock
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleBulkAction('move')}
                                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                                >
                                    <FaArrowRight className="w-3 h-3 mr-1" />
                                    Move
                                </Button>
                                {activeTab === 'pending' && (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleBulkAction('approve')}
                                            className="text-green-600 border-green-300 hover:bg-green-50"
                                        >
                                            <FaCheck className="w-3 h-3 mr-1" />
                                            Approve
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleBulkAction('reject')}
                                            className="text-red-600 border-red-300 hover:bg-red-50"
                                        >
                                            <FaTimes className="w-3 h-3 mr-1" />
                                            Reject
                                        </Button>
                                    </>
                                )}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleBulkAction('delete')}
                                    className="text-red-600 border-red-300 hover:bg-red-50"
                                >
                                    <FaTrash className="w-3 h-3 mr-1" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
            {/* Threads List */}
            {activeTab !== 'replies' && (
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            {activeTab === 'threads' ? 'All Threads' : 'Pending Approval'}
                            {pagination?.total && (
                                <Badge variant="secondary">
                                    {pagination.total} total
                                </Badge>
                            )}
                        </CardTitle>
                        {threads.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={selectedThreads.length === threads.length}
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
                    ) : threads.length === 0 ? (
                        <div className="text-center py-8">
                            <FaExclamationTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {activeTab === 'threads' ? 'No threads found' : 'No pending threads'}
                            </h3>
                            <p className="text-gray-600">
                                {activeTab === 'threads' 
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'All threads have been reviewed.'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {threads.map((thread) => (
                                <div
                                    key={thread._id}
                                    className={`border rounded-lg p-4 transition-colors ${
                                        selectedThreads.includes(thread._id)
                                            ? 'border-blue-300 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <Checkbox
                                            checked={selectedThreads.includes(thread._id)}
                                            onCheckedChange={(checked) => 
                                                handleSelectThread(thread._id, checked as boolean)
                                            }
                                            className="mt-1"
                                        />
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-gray-900 truncate">
                                                        {thread.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                                        <span>by {thread.author.name}</span>
                                                        <span>•</span>
                                                        <span>{thread.category.name}</span>
                                                        <span>•</span>
                                                        <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                                                        {thread.replyCount !== undefined && (
                                                            <>
                                                                <span>•</span>
                                                                <span>{thread.replyCount} replies</span>
                                                            </>
                                                        )}
                                                        <span>•</span>
                                                        <span>{thread.views} views</span>
                                                    </div>
                                                    
                                                    {/* Status Badges */}
                                                    <div className="flex items-center gap-2 mt-2">
                                                        {thread.isPinned && (
                                                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                                <FaThumbtack className="w-3 h-3 mr-1" />
                                                                Pinned
                                                            </Badge>
                                                        )}
                                                        {thread.isLocked && (
                                                            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                                                <FaLock className="w-3 h-3 mr-1" />
                                                                Locked
                                                            </Badge>
                                                        )}
                                                        {thread.requiresApproval && !thread.isApproved && (
                                                            <Badge variant="destructive">
                                                                Pending Approval
                                                            </Badge>
                                                        )}
                                                        {thread.isApproved && (
                                                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                                                Approved
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {/* Moderation Notes */}
                                                    {thread.moderationNotes && (
                                                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                                            <span className="font-medium text-gray-700">Moderation Notes:</span>
                                                            <p className="text-gray-600 mt-1">{thread.moderationNotes}</p>
                                                            {thread.moderatedBy && (
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    by {thread.moderatedBy.name} on{' '}
                                                                    {thread.moderatedAt && new Date(thread.moderatedAt).toLocaleString()}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Action Buttons */}
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleSingleAction(thread, 'pin')}
                                                        className={thread.isPinned ? "text-green-600" : "text-gray-600"}
                                                        title={thread.isPinned ? "Unpin thread" : "Pin thread"}
                                                    >
                                                        <FaThumbtack className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleSingleAction(thread, 'lock')}
                                                        className={thread.isLocked ? "text-orange-600" : "text-gray-600"}
                                                        title={thread.isLocked ? "Unlock thread" : "Lock thread"}
                                                    >
                                                        <FaLock className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleSingleAction(thread, 'move')}
                                                        className="text-blue-600"
                                                        title="Move thread"
                                                    >
                                                        <FaArrowRight className="w-4 h-4" />
                                                    </Button>
                                                    {activeTab === 'pending' && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleSingleAction(thread, 'approve')}
                                                                className="text-green-600"
                                                                title="Approve thread"
                                                            >
                                                                <FaCheck className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleSingleAction(thread, 'reject')}
                                                                className="text-red-600"
                                                                title="Reject thread"
                                                            >
                                                                <FaTimes className="w-4 h-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleSingleAction(thread, 'delete')}
                                                        className="text-red-600"
                                                        title="Delete thread"
                                                    >
                                                        <FaTrash className="w-4 h-4" />
                                                    </Button>
                                                </div>
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
                                {pagination.total} threads
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
            )}

            {/* Reply Moderation Section */}
            {activeTab === 'replies' && (
                <ReplyModerationSection />
            )}
            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedThreads.length > 0 
                                ? `Are you sure you want to delete ${selectedThreads.length} selected thread${selectedThreads.length !== 1 ? 's' : ''}? This action cannot be undone and will also delete all replies.`
                                : `Are you sure you want to delete "${currentThread?.title}"? This action cannot be undone and will also delete all replies.`
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
                            setCurrentThread(null);
                        }}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete Thread{selectedThreads.length > 1 ? 's' : ''}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Move Thread Dialog */}
            <AlertDialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Move Thread{selectedThreads.length > 1 ? 's' : ''}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedThreads.length > 0 
                                ? `Select the target category for ${selectedThreads.length} selected thread${selectedThreads.length !== 1 ? 's' : ''}.`
                                : `Select the target category for "${currentThread?.title}".`
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4 my-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Target Category *
                            </label>
                            <Select value={moveTargetCategory} onValueChange={setMoveTargetCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories?.map((category) => (
                                        <SelectItem key={category._id} value={category._id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for move (optional)
                            </label>
                            <Textarea
                                value={moveReason}
                                onChange={(e) => setMoveReason(e.target.value)}
                                placeholder="Enter reason for moving..."
                                rows={3}
                            />
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setShowMoveDialog(false);
                            setMoveTargetCategory("");
                            setMoveReason("");
                            setCurrentThread(null);
                        }}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmMove}
                            disabled={!moveTargetCategory}
                        >
                            Move Thread{selectedThreads.length > 1 ? 's' : ''}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Approval Dialog */}
            <AlertDialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {approvalAction === 'approve' ? 'Approve' : 'Reject'} Thread
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {approvalAction === 'approve' 
                                ? `Are you sure you want to approve "${currentThread?.title}"? This will make it visible to all users.`
                                : `Are you sure you want to reject "${currentThread?.title}"? This will prevent it from being published.`
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="my-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Review notes (optional)
                        </label>
                        <Textarea
                            value={approvalNotes}
                            onChange={(e) => setApprovalNotes(e.target.value)}
                            placeholder={`Enter notes for ${approvalAction}...`}
                            rows={3}
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setShowApprovalDialog(false);
                            setApprovalNotes("");
                            setCurrentThread(null);
                        }}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmApproval}
                            className={approvalAction === 'approve' 
                                ? "bg-green-600 hover:bg-green-700" 
                                : "bg-red-600 hover:bg-red-700"
                            }
                        >
                            {approvalAction === 'approve' ? 'Approve' : 'Reject'} Thread
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
export default ThreadModerationSection;