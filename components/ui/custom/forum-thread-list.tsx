"use client";
import React, { useState } from "react";
import { useThreadsByCategory, useTogglePinThread, useToggleLockThread, useDeleteForumThread, useReportThread, useReportUser } from "@/hooks/useForum";
import { ForumThread } from "@/app/api/forum/forum";
import { motion } from "framer-motion";
import { MdPushPin, MdLock, MdVisibility, MdComment, MdMoreVert, MdEdit, MdDelete, MdFlag } from "react-icons/md";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/hook/store/useAuthStore";
import Link from "next/link";
import ReportModal from "./report-modal";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";


const ThreadCard: React.FC<{ thread: ForumThread; isAdmin: boolean }> = ({ thread, isAdmin }) => {
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);
    const [showThreadReportModal, setShowThreadReportModal] = useState(false);
    const [showUserReportModal, setShowUserReportModal] = useState(false);
    const togglePin = useTogglePinThread();
    const toggleLock = useToggleLockThread();
    const deleteThread = useDeleteForumThread();
    const reportThreadMutation = useReportThread();
    const reportUserMutation = useReportUser();
    const user = useAuthStore((state) => state.user);

    const isAuthor = user?._id === thread.author._id;

    const handleReportThread = async (data: { reason: string; description?: string }) => {
        await reportThreadMutation.mutateAsync({ threadId: thread._id, data });
    };

    const handleReportUser = async (data: { reason: string; description?: string }) => {
        await reportUserMutation.mutateAsync({ userId: thread.author._id, data });
    };

    return (
        <motion.div
            className={`bg-white dark:bg-card rounded-2xl border p-6 cursor-pointer hover:shadow-lg transition-all relative ${thread.isPinned ? "border-amber-300 dark:border-amber-700 bg-amber-50/30 dark:bg-amber-900/10" : "border-slate-100 dark:border-border shadow-sm"
                }`}
            whileHover={{ scale: 1.01, y: -2 }}
            onClick={() => router.push(`/forum/threads/${thread._id}`)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
                {thread.isPinned && (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                        <MdPushPin size={14} />
                        Pinned
                    </span>
                )}
                {thread.isLocked && (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                        <MdLock size={14} />
                        Locked
                    </span>
                )}
                {thread.author.role === "admin" && (
                    <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                        Admin
                    </span>
                )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 hover:text-primary dark:hover:text-primary transition-colors">
                {thread.title}
            </h3>

            {/* Content Preview */}
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">{thread.content}</p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 dark:text-slate-500">
                <Link
                    href={`/dashboard/members/${thread.author._id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="font-bold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
                >
                    {thread.author.name}
                </Link>
                <span>·</span>
                <span>{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</span>
                <span className="flex items-center gap-1">
                    <MdVisibility />
                    {thread.views}
                </span>
                <span className="flex items-center gap-1">
                    <MdComment />
                    {thread.replyCount || 0}
                </span>
            </div>

            {/* Last Reply */}
            {thread.lastReply && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/50 text-xs text-slate-400 dark:text-slate-500">
                    Last reply by{" "}
                    <Link
                        href={`/dashboard/members/${(thread.lastReply.author as any)._id || thread.lastReply.author}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                    >
                        {thread.lastReply.author.name}
                    </Link>{" "}
                    {formatDistanceToNow(new Date(thread.lastReply.createdAt), { addSuffix: true })}
                </div>
            )}

            {/* Report Actions */}
            {user && !isAuthor && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowThreadReportModal(true);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <MdFlag size={12} />
                        Report Thread
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowUserReportModal(true);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                        <MdFlag size={12} />
                        Report User
                    </button>
                </div>
            )}

            {/* Admin/Author Menu */}
            {(isAdmin || isAuthor) && (
                <div className="absolute top-4 right-4">
                    <button
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                    >
                        <MdMoreVert size={20} className="text-slate-400 dark:text-slate-500" />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-10">
                            {isAdmin && (
                                <>
                                    <button
                                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            togglePin.mutate(thread._id);
                                            setShowMenu(false);
                                        }}
                                    >
                                        <MdPushPin className="text-amber-500" />
                                        {thread.isPinned ? "Unpin" : "Pin"}
                                    </button>
                                    <button
                                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleLock.mutate(thread._id);
                                            setShowMenu(false);
                                        }}
                                    >
                                        <MdLock className="text-slate-500 dark:text-slate-400" />
                                        {thread.isLocked ? "Unlock" : "Lock"}
                                    </button>
                                </>
                            )}
                            {(isAdmin || isAuthor) && (
                                <>
                                    <button
                                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/forum/threads/${thread._id}/edit`);
                                        }}
                                    >
                                        <MdEdit className="text-primary" />
                                        Edit
                                    </button>
                                    <button
                                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-2 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm("Are you sure you want to delete this thread?")) {
                                                deleteThread.mutate(thread._id);
                                            }
                                            setShowMenu(false);
                                        }}
                                    >
                                        <MdDelete />
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Report Modals */}
            <ReportModal
                isOpen={showThreadReportModal}
                onClose={() => setShowThreadReportModal(false)}
                onSubmit={handleReportThread}
                title={`Report Thread: ${thread.title}`}
                contentType="thread"
                contentPreview={thread.content}
            />

            <ReportModal
                isOpen={showUserReportModal}
                onClose={() => setShowUserReportModal(false)}
                onSubmit={handleReportUser}
                title={`Report User: ${thread.author.name}`}
                contentType="user"
            />
        </motion.div>
    );
};

interface ForumThreadListProps {
    categoryId: string;
    categoryName?: string;
}

const ForumThreadList: React.FC<ForumThreadListProps> = ({ categoryId, categoryName }) => {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const { data, isPending, error } = useThreadsByCategory(categoryId, { page, limit: 20 });
    const user = useAuthStore((state) => state.user);
    const isAdmin = user?.role === "admin";

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => router.push("/forum")}
                    className="text-primary hover:text-primary/80 mb-4 flex items-center gap-2 font-bold text-sm transition-colors"
                >
                    ← Back to Categories
                </button>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{categoryName || "Threads"}</h1>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <p className="text-slate-500 dark:text-slate-400">
                        {data?.pagination.total || 0} threads
                    </p>
                    <button
                        onClick={() => router.push(`/forum/new-thread?category=${categoryId}`)}
                        className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-primary/20 hover:shadow-lg transition-all"
                    >
                        + New Thread
                    </button>
                </div>
            </div>

            {/* Thread List */}
            {isPending ? (
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
                            <div className="h-6 bg-slate-100 rounded-lg w-3/4 mb-3" />
                            <div className="h-4 bg-slate-100 rounded-lg w-full mb-2" />
                            <div className="h-4 bg-slate-100 rounded-lg w-2/3" />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="text-center py-20">
                    <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">😕</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Unable to load threads</h3>
                    <p className="text-slate-500">Please try again later</p>
                </div>
            ) : data?.data.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">📝</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">No threads yet</h3>
                    <p className="text-slate-500 mb-6">Be the first to start a discussion!</p>
                    <button
                        onClick={() => router.push(`/forum/new-thread?category=${categoryId}`)}
                        className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-primary/20 hover:shadow-lg transition-all"
                    >
                        Create First Thread
                    </button>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {data?.data.map((thread) => (
                            <ThreadCard key={thread._id} thread={thread} isAdmin={isAdmin} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {data && data.pagination.pages > 1 && (
                        <div className="mt-12 flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (page > 1) setPage(page - 1);
                                            }}
                                            className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: data.pagination.pages }).map((_, i) => (
                                        <PaginationItem key={i}>
                                            <PaginationLink
                                                isActive={page === i + 1}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setPage(i + 1);
                                                }}
                                                className="cursor-pointer"
                                            >
                                                {i + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (page < data.pagination.pages) setPage(page + 1);
                                            }}
                                            className={page >= data.pagination.pages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ForumThreadList;
