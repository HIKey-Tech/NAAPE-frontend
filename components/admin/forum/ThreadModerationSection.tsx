"use client";

import React, { useState } from "react";
import { FaSearch, FaFilter, FaEye, FaThumbtack, FaLock, FaEdit, FaTrash, FaArrowRight, FaCheck, FaTimes, FaExclamationTriangle, FaGavel } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAllThreadsAdmin, usePendingApprovals, usePinThread, useLockThread, useMoveThread, useDeleteThread, useBulkThreadActions, useApproveThread, useRejectThread } from "@/hooks/useThreadModeration";
import { useAdminForumCategories } from "@/hooks/useAdminForumCategories";
import { AdminForumThread } from "@/app/api/admin/forum";
import { ReplyModerationSection } from "./ReplyModerationSection";

interface ThreadModerationSectionProps { className?: string; }

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

    const { data: categories } = useAdminForumCategories();
    const { data: threadsData, isLoading: threadsLoading } = useAllThreadsAdmin({ page: currentPage, limit: 20, search: searchTerm || undefined, category: selectedCategory || undefined, status: (statusFilter as 'pending' | 'approved' | 'pinned' | 'locked') || undefined });
    const { data: pendingData, isLoading: pendingLoading } = usePendingApprovals({ page: currentPage, limit: 20 });

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

    const handleSelectThread = (threadId: string, checked: boolean) => {
        if (checked) setSelectedThreads(prev => [...prev, threadId]);
        else setSelectedThreads(prev => prev.filter(id => id !== threadId));
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) setSelectedThreads(threads.map(t => t._id));
        else setSelectedThreads([]);
    };

    const handleBulkAction = (action: string) => {
        if (selectedThreads.length === 0) return;
        if (action === 'move') { setShowMoveDialog(true); return; }
        if (action === 'delete') { setShowDeleteDialog(true); return; }
        bulkActions.mutate({ threadIds: selectedThreads, action } as any, { onSuccess: () => { setSelectedThreads([]); setShowBulkActions(false); } });
    };

    const handleSingleAction = (thread: AdminForumThread, action: string) => {
        setCurrentThread(thread);
        switch (action) {
            case 'pin': pinThread.mutate(thread._id); break;
            case 'lock': lockThread.mutate(thread._id); break;
            case 'move': setShowMoveDialog(true); break;
            case 'delete': setShowDeleteDialog(true); break;
            case 'approve': setApprovalAction('approve'); setShowApprovalDialog(true); break;
            case 'reject': setApprovalAction('reject'); setShowApprovalDialog(true); break;
        }
    };

    const confirmDelete = () => {
        if (selectedThreads.length > 0) {
            bulkActions.mutate({ threadIds: selectedThreads, action: 'delete', data: { reason: deleteReason } }, { onSuccess: () => { setSelectedThreads([]); setShowBulkActions(false); setShowDeleteDialog(false); setDeleteReason(""); } });
        } else if (currentThread) {
            deleteThread.mutate({ threadId: currentThread._id, reason: deleteReason }, { onSuccess: () => { setShowDeleteDialog(false); setDeleteReason(""); setCurrentThread(null); } });
        }
    };

    const confirmMove = () => {
        if (!moveTargetCategory) return;
        if (selectedThreads.length > 0) {
            bulkActions.mutate({ threadIds: selectedThreads, action: 'move', data: { categoryId: moveTargetCategory, reason: moveReason } }, { onSuccess: () => { setSelectedThreads([]); setShowBulkActions(false); setShowMoveDialog(false); setMoveTargetCategory(""); setMoveReason(""); } });
        } else if (currentThread) {
            moveThread.mutate({ threadId: currentThread._id, data: { categoryId: moveTargetCategory, reason: moveReason } }, { onSuccess: () => { setShowMoveDialog(false); setMoveTargetCategory(""); setMoveReason(""); setCurrentThread(null); } });
        }
    };

    const confirmApproval = () => {
        if (!currentThread) return;
        const mutation = approvalAction === 'approve' ? approveThread : rejectThread;
        mutation.mutate({ threadId: currentThread._id, reviewNotes: approvalNotes }, { onSuccess: () => { setShowApprovalDialog(false); setApprovalNotes(""); setCurrentThread(null); } });
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Thread Moderation</h2>
                    <p className="text-slate-500 mt-1">Manage and moderate forum threads</p>
                </div>
                {/* Tab Switcher */}
                <div className="flex bg-slate-100 rounded-xl p-1">
                    {(['threads', 'replies'] as const).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
                            {tab === 'threads' ? 'All Threads' : 'Reply Moderation'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filters */}
            {activeTab === 'threads' && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <Input placeholder="Search threads..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                            </div>
                        </div>
                        <Select value={selectedCategory || "all"} onValueChange={(v) => setSelectedCategory(v === "all" ? "" : v)}>
                            <SelectTrigger className="w-full sm:w-48 rounded-xl border-slate-200 bg-slate-50"><SelectValue placeholder="All Categories" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories?.map((c) => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter || "all"} onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}>
                            <SelectTrigger className="w-full sm:w-48 rounded-xl border-slate-200 bg-slate-50"><SelectValue placeholder="All Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending Approval</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="pinned">Pinned</SelectItem>
                                <SelectItem value="locked">Locked</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {/* Bulk Actions Bar */}
            {selectedThreads.length > 0 && (
                <div className="bg-primary/5 rounded-2xl border border-primary/20 shadow-sm p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-primary/90">{selectedThreads.length} thread{selectedThreads.length !== 1 ? 's' : ''} selected</span>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedThreads([])} className="text-primary hover:text-primary/80 rounded-xl">Clear</Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleBulkAction('pin')} className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 rounded-xl font-bold"><FaThumbtack className="w-3 h-3 mr-1" />Pin</Button>
                            <Button size="sm" variant="outline" onClick={() => handleBulkAction('lock')} className="text-orange-600 border-orange-200 hover:bg-orange-50 rounded-xl font-bold"><FaLock className="w-3 h-3 mr-1" />Lock</Button>
                            <Button size="sm" variant="outline" onClick={() => handleBulkAction('move')} className="text-primary border-primary/20 hover:bg-primary/5 rounded-xl font-bold"><FaArrowRight className="w-3 h-3 mr-1" />Move</Button>
                            {activeTab === 'pending' && (<>
                                <Button size="sm" variant="outline" onClick={() => handleBulkAction('approve')} className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 rounded-xl font-bold"><FaCheck className="w-3 h-3 mr-1" />Approve</Button>
                                <Button size="sm" variant="outline" onClick={() => handleBulkAction('reject')} className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl font-bold"><FaTimes className="w-3 h-3 mr-1" />Reject</Button>
                            </>)}
                            <Button size="sm" variant="outline" onClick={() => handleBulkAction('delete')} className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl font-bold"><FaTrash className="w-3 h-3 mr-1" />Delete</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Threads List */}
            {activeTab !== 'replies' && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between p-5 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center"><FaGavel className="w-4 h-4 text-indigo-500" /></div>
                            <h3 className="text-base font-bold text-slate-900">{activeTab === 'threads' ? 'All Threads' : 'Pending Approval'}</h3>
                            {pagination?.total && <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">{pagination.total} total</span>}
                        </div>
                        {threads.length > 0 && (
                            <div className="flex items-center gap-2"><Checkbox checked={selectedThreads.length === threads.length} onCheckedChange={handleSelectAll} /><span className="text-sm text-slate-500">Select all</span></div>
                        )}
                    </div>
                    <div className="p-5">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                        ) : threads.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4"><FaGavel className="w-8 h-8 text-slate-300" /></div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{activeTab === 'threads' ? 'No threads found' : 'No pending threads'}</h3>
                                <p className="text-slate-500">{activeTab === 'threads' ? 'Try adjusting your search or filter criteria.' : 'All threads have been reviewed.'}</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {threads.map((thread) => (
                                    <div key={thread._id} className={`rounded-xl p-4 transition-all duration-200 ${selectedThreads.includes(thread._id) ? 'bg-primary/5 border border-primary/20' : 'bg-slate-50/50 border border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}>
                                        <div className="flex items-start gap-4">
                                            <Checkbox checked={selectedThreads.includes(thread._id)} onCheckedChange={(checked) => handleSelectThread(thread._id, checked as boolean)} className="mt-1" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-slate-900 truncate text-sm">{thread.title}</h3>
                                                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 flex-wrap">
                                                            <span>by <span className="font-medium text-slate-600">{thread.author.name}</span></span>
                                                            <span className="text-slate-300">•</span>
                                                            <span>{thread.category.name}</span>
                                                            <span className="text-slate-300">•</span>
                                                            <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                                                            {thread.replyCount !== undefined && (<><span className="text-slate-300">•</span><span>{thread.replyCount} replies</span></>)}
                                                            <span className="text-slate-300">•</span>
                                                            <span>{thread.views} views</span>
                                                        </div>
                                                        {/* Status Badges */}
                                                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                            {thread.isPinned && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 inline-flex items-center gap-1"><FaThumbtack className="w-2.5 h-2.5" />Pinned</span>}
                                                            {thread.isLocked && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 inline-flex items-center gap-1"><FaLock className="w-2.5 h-2.5" />Locked</span>}
                                                            {thread.requiresApproval && !thread.isApproved && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">Pending Approval</span>}
                                                            {thread.isApproved && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">Approved</span>}
                                                        </div>
                                                        {thread.moderationNotes && (
                                                            <div className="mt-2 p-3 bg-white rounded-xl text-sm border border-slate-100">
                                                                <span className="font-bold text-slate-500 text-xs uppercase tracking-wide">Moderation Notes</span>
                                                                <p className="text-slate-600 mt-1 text-xs">{thread.moderationNotes}</p>
                                                                {thread.moderatedBy && <p className="text-xs text-slate-400 mt-1">by {thread.moderatedBy.name} on {thread.moderatedAt && new Date(thread.moderatedAt).toLocaleString()}</p>}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* Action Buttons */}
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => handleSingleAction(thread, 'pin')} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${thread.isPinned ? 'text-emerald-500 bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'}`} title={thread.isPinned ? "Unpin" : "Pin"}><FaThumbtack className="w-3.5 h-3.5" /></button>
                                                        <button onClick={() => handleSingleAction(thread, 'lock')} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${thread.isLocked ? 'text-orange-500 bg-orange-50' : 'text-slate-400 hover:bg-slate-100'}`} title={thread.isLocked ? "Unlock" : "Lock"}><FaLock className="w-3.5 h-3.5" /></button>
                                                        <button onClick={() => handleSingleAction(thread, 'move')} className="w-8 h-8 rounded-lg flex items-center justify-center text-primary hover:bg-primary/5 transition-colors" title="Move"><FaArrowRight className="w-3.5 h-3.5" /></button>
                                                        {activeTab === 'pending' && (<>
                                                            <button onClick={() => handleSingleAction(thread, 'approve')} className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition-colors" title="Approve"><FaCheck className="w-3.5 h-3.5" /></button>
                                                            <button onClick={() => handleSingleAction(thread, 'reject')} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors" title="Reject"><FaTimes className="w-3.5 h-3.5" /></button>
                                                        </>)}
                                                        <button onClick={() => handleSingleAction(thread, 'delete')} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors" title="Delete"><FaTrash className="w-3.5 h-3.5" /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {pagination && pagination.pages > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                                <div className="text-sm text-slate-500">Showing {((currentPage - 1) * (pagination.limit || 20)) + 1} to {Math.min(currentPage * (pagination.limit || 20), pagination.total)} of {pagination.total} threads</div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="rounded-xl font-bold border-slate-200">Previous</Button>
                                    <span className="text-sm text-slate-500 px-2">Page {currentPage} of {pagination.pages}</span>
                                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))} disabled={currentPage === pagination.pages} className="rounded-xl font-bold border-slate-200">Next</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'replies' && <ReplyModerationSection />}

            {/* Delete Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-900">Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500">
                            {selectedThreads.length > 0 ? `Are you sure you want to delete ${selectedThreads.length} selected thread${selectedThreads.length !== 1 ? 's' : ''}? This action cannot be undone and will also delete all replies.` : `Are you sure you want to delete "${currentThread?.title}"? This action cannot be undone and will also delete all replies.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="my-4">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Reason for deletion (optional)</label>
                        <Textarea value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} placeholder="Enter reason for deletion..." rows={3} className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => { setShowDeleteDialog(false); setDeleteReason(""); setCurrentThread(null); }} className="rounded-xl font-bold border-slate-200">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 rounded-xl font-bold shadow-md shadow-red-600/20">Delete Thread{selectedThreads.length > 1 ? 's' : ''}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Move Dialog */}
            <AlertDialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-900">Move Thread{selectedThreads.length > 1 ? 's' : ''}</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500">{selectedThreads.length > 0 ? `Select the target category for ${selectedThreads.length} selected thread${selectedThreads.length !== 1 ? 's' : ''}.` : `Select the target category for "${currentThread?.title}".`}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4 my-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Target Category *</label>
                            <Select value={moveTargetCategory} onValueChange={setMoveTargetCategory}>
                                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50"><SelectValue placeholder="Select category" /></SelectTrigger>
                                <SelectContent>{categories?.map((c) => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Reason for move (optional)</label>
                            <Textarea value={moveReason} onChange={(e) => setMoveReason(e.target.value)} placeholder="Enter reason for moving..." rows={3} className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => { setShowMoveDialog(false); setMoveTargetCategory(""); setMoveReason(""); setCurrentThread(null); }} className="rounded-xl font-bold border-slate-200">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmMove} disabled={!moveTargetCategory} className="rounded-xl font-bold shadow-md shadow-primary/20">Move Thread{selectedThreads.length > 1 ? 's' : ''}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Approval Dialog */}
            <AlertDialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-900">{approvalAction === 'approve' ? 'Approve' : 'Reject'} Thread</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500">{approvalAction === 'approve' ? `Are you sure you want to approve "${currentThread?.title}"? This will make it visible to all users.` : `Are you sure you want to reject "${currentThread?.title}"? This will prevent it from being published.`}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="my-4">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Review notes (optional)</label>
                        <Textarea value={approvalNotes} onChange={(e) => setApprovalNotes(e.target.value)} placeholder={`Enter notes for ${approvalAction}...`} rows={3} className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => { setShowApprovalDialog(false); setApprovalNotes(""); setCurrentThread(null); }} className="rounded-xl font-bold border-slate-200">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmApproval} className={`rounded-xl font-bold shadow-md ${approvalAction === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'}`}>{approvalAction === 'approve' ? 'Approve' : 'Reject'} Thread</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
export default ThreadModerationSection;