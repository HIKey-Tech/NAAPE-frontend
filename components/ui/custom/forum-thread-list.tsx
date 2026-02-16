"use client";
import React, { useState } from "react";
import { useThreadsByCategory, useTogglePinThread, useToggleLockThread, useDeleteForumThread, useReportThread, useReportUser } from "@/hooks/useForum";
import { ForumThread } from "@/app/api/forum/forum";
import { motion } from "framer-motion";
import { MdPushPin, MdLock, MdVisibility, MdComment, MdMoreVert, MdEdit, MdDelete, MdFlag } from "react-icons/md";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/hook/store/useAuthStore";
import ReportModal from "./report-modal";

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
            className={`bg-white rounded-xl border-2 p-6 cursor-pointer hover:shadow-lg transition-all relative ${
                thread.isPinned ? "border-yellow-400 bg-yellow-50" : "border-gray-100"
            }`}
            whileHover={{ scale: 1.01, y: -2 }}
            onClick={() => router.push(`/forum/threads/${thread._id}`)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
                {thread.isPinned && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                        <MdPushPin size={14} />
                        Pinned
                    </span>
                )}
                {thread.isLocked && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        <MdLock size={14} />
                        Locked
                    </span>
                )}
                {thread.author.role === "admin" && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                        Admin
                    </span>
                )}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                {thread.title}
            </h3>

            {/* Content Preview */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{thread.content}</p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="font-semibold text-gray-700">{thread.author.name}</span>
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
                <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                    Last reply by <span className="font-semibold">{thread.lastReply.author.name}</span>{" "}
                    {formatDistanceToNow(new Date(thread.lastReply.createdAt), { addSuffix: true })}
                </div>
            )}

            {/* Report Actions */}
            {user && !isAuthor && (
                <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowThreadReportModal(true);
                        }}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                        <MdFlag size={12} />
                        Report Thread
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowUserReportModal(true);
                        }}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-orange-600 hover:bg-orange-50 rounded transition-colors"
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
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                    >
                        <MdMoreVert size={20} />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10">
                            {isAdmin && (
                                <>
                                    <button
                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            togglePin.mutate(thread._id);
                                            setShowMenu(false);
                                        }}
                                    >
                                        <MdPushPin />
                                        {thread.isPinned ? "Unpin" : "Pin"}
                                    </button>
                                    <button
                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleLock.mutate(thread._id);
                                            setShowMenu(false);
                                        }}
                                    >
                                        <MdLock />
                                        {thread.isLocked ? "Unlock" : "Lock"}
                                    </button>
                                </>
                            )}
                            {(isAdmin || isAuthor) && (
                                <>
                                    <button
                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/forum/threads/${thread._id}/edit`);
                                        }}
                                    >
                                        <MdEdit />
                                        Edit
                                    </button>
                                    <button
                                        className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
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
                    className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
                >
                    ← Back to Categories
                </button>
                <h1 className="text-4xl font-black text-gray-900 mb-2">{categoryName || "Threads"}</h1>
                <div className="flex justify-between items-center">
                    <p className="text-gray-600">
                        {data?.pagination.total || 0} threads
                    </p>
                    <button
                        onClick={() => router.push(`/forum/new-thread?category=${categoryId}`)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        + New Thread
                    </button>
                </div>
            </div>

            {/* Thread List */}
            {isPending ? (
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border-2 border-gray-100 p-6 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">😕</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Unable to load threads</h3>
                    <p className="text-gray-600">Please try again later</p>
                </div>
            ) : data?.data.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No threads yet</h3>
                    <p className="text-gray-600 mb-6">Be the first to start a discussion!</p>
                    <button
                        onClick={() => router.push(`/forum/new-thread?category=${categoryId}`)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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
                        <div className="flex justify-center gap-2 mt-8">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2">
                                Page {page} of {data.pagination.pages}
                            </span>
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={page === data.pagination.pages}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ForumThreadList;
