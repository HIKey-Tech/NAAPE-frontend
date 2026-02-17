"use client";
import React, { useState } from "react";
import { useForumThread, useThreadReplies, useCreateForumReply, useDeleteForumReply, useUpdateForumReply, useReportThread, useReportReply, useReportUser } from "@/hooks/useForum";
import { ForumReply } from "@/app/api/forum/forum";
import { motion } from "framer-motion";
import { MdPushPin, MdLock, MdVisibility, MdComment, MdSend, MdEdit, MdDelete, MdReply, MdFlag } from "react-icons/md";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/context/authcontext";
import { toast } from "sonner";
import ReportModal from "./report-modal";

const ReplyItem: React.FC<{ reply: ForumReply; threadId: string; isNested?: boolean }> = ({ reply, threadId, isNested = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(reply.content);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [showReportModal, setShowReportModal] = useState(false);
    const [showUserReportModal, setShowUserReportModal] = useState(false);

    const { user } = useAuth();
    const isAuthor = user?._id === reply.author._id;
    const isAdmin = user?.role === "admin";

    const updateReply = useUpdateForumReply();
    const deleteReply = useDeleteForumReply();
    const createReply = useCreateForumReply();
    const reportReplyMutation = useReportReply();
    const reportUserMutation = useReportUser();

    const handleUpdate = () => {
        if (!editContent.trim()) return;
        updateReply.mutate(
            { replyId: reply._id, data: { content: editContent } },
            {
                onSuccess: () => setIsEditing(false),
            }
        );
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this reply?")) {
            deleteReply.mutate(reply._id);
        }
    };

    const handleReply = () => {
        if (!replyContent.trim()) return;
        createReply.mutate(
            { threadId, data: { content: replyContent, parentReplyId: reply._id } },
            {
                onSuccess: () => {
                    setReplyContent("");
                    setShowReplyForm(false);
                },
            }
        );
    };

    const handleReportReply = async (data: { reason: string; description?: string }) => {
        await reportReplyMutation.mutateAsync({ replyId: reply._id, data });
    };

    const handleReportUser = async (data: { reason: string; description?: string }) => {
        await reportUserMutation.mutateAsync({ userId: reply.author._id, data });
    };

    return (
        <div className={`${isNested ? "ml-8 mt-4" : "mt-6"}`}>
            <div className="bg-slate-50/80 rounded-2xl border border-slate-100 p-5 hover:border-slate-200 transition-colors">
                {/* Author Info */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold shadow-sm">
                            {reply.author.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-slate-900">{reply.author.name}</span>
                                {reply.author.role === "admin" && (
                                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                                        Admin
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-slate-400">
                                {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                                {reply.isEdited && " (edited)"}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1">
                        {(isAuthor || isAdmin) && !isEditing && (
                            <>
                                {isAuthor && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="p-2 hover:bg-slate-200/60 rounded-xl transition-colors"
                                        title="Edit"
                                    >
                                        <MdEdit size={16} className="text-primary" />
                                    </button>
                                )}
                                <button
                                    onClick={handleDelete}
                                    className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                                    title="Delete"
                                >
                                    <MdDelete size={16} className="text-red-500" />
                                </button>
                            </>
                        )}

                        {/* Report buttons for non-authors */}
                        {user && !isAuthor && (
                            <>
                                <button
                                    onClick={() => setShowReportModal(true)}
                                    className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                                    title="Report Reply"
                                >
                                    <MdFlag size={16} className="text-red-500" />
                                </button>
                                <button
                                    onClick={() => setShowUserReportModal(true)}
                                    className="p-2 hover:bg-orange-50 rounded-xl transition-colors"
                                    title="Report User"
                                >
                                    <MdFlag size={16} className="text-orange-500" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Content */}
                {isEditing ? (
                    <div className="space-y-3">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl p-3 bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-slate-800 transition-all"
                            rows={3}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleUpdate}
                                disabled={updateReply.isPending}
                                className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditContent(reply.content);
                                }}
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-slate-700 whitespace-pre-wrap mb-3 text-sm leading-relaxed">{reply.content}</p>

                        {!isNested && (
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 font-bold transition-colors"
                            >
                                <MdReply />
                                Reply
                            </button>
                        )}
                    </>
                )}

                {/* Reply Form */}
                {showReplyForm && (
                    <div className="mt-4 space-y-3">
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write your reply..."
                            className="w-full border border-slate-200 rounded-xl p-3 bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-slate-800 transition-all"
                            rows={3}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleReply}
                                disabled={createReply.isPending || !replyContent.trim()}
                                className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2 transition-colors"
                            >
                                <MdSend size={14} />
                                Post Reply
                            </button>
                            <button
                                onClick={() => {
                                    setShowReplyForm(false);
                                    setReplyContent("");
                                }}
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Nested Replies */}
            {reply.replies && reply.replies.length > 0 && (
                <div className="space-y-2">
                    {reply.replies.map((nestedReply) => (
                        <ReplyItem key={nestedReply._id} reply={nestedReply} threadId={threadId} isNested />
                    ))}
                </div>
            )}

            {/* Report Modals */}
            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                onSubmit={handleReportReply}
                title="Report Reply"
                contentType="reply"
                contentPreview={reply.content}
            />

            <ReportModal
                isOpen={showUserReportModal}
                onClose={() => setShowUserReportModal(false)}
                onSubmit={handleReportUser}
                title={`Report User: ${reply.author.name}`}
                contentType="user"
            />
        </div>
    );
};

interface ForumThreadDetailProps {
    threadId: string;
}

const ForumThreadDetail: React.FC<ForumThreadDetailProps> = ({ threadId }) => {
    const router = useRouter();
    const [replyContent, setReplyContent] = useState("");
    const [hasTrackedView, setHasTrackedView] = useState(false);
    const [showThreadReportModal, setShowThreadReportModal] = useState(false);
    const [showUserReportModal, setShowUserReportModal] = useState(false);

    const { data: thread, isPending: threadLoading, error: threadError } = useForumThread(threadId);
    const { data: repliesData, isPending: repliesLoading } = useThreadReplies(threadId);
    const createReply = useCreateForumReply();
    const reportThreadMutation = useReportThread();
    const reportUserMutation = useReportUser();
    const { user } = useAuth();

    const isAuthor = user?._id === thread?.author._id;

    const handleReportThread = async (data: { reason: string; description?: string }) => {
        await reportThreadMutation.mutateAsync({ threadId, data });
    };

    const handleReportUser = async (data: { reason: string; description?: string }) => {
        if (thread?.author._id) {
            await reportUserMutation.mutateAsync({ userId: thread.author._id, data });
        }
    };

    // Track view only once per thread per browser session
    React.useEffect(() => {
        if (thread && !hasTrackedView) {
            const viewedThreads = JSON.parse(localStorage.getItem('viewedThreads') || '[]');

            if (!viewedThreads.includes(threadId)) {
                setHasTrackedView(true);
                viewedThreads.push(threadId);
                localStorage.setItem('viewedThreads', JSON.stringify(viewedThreads));
            } else {
                setHasTrackedView(true);
            }
        }
    }, [thread, threadId, hasTrackedView]);

    const handleReply = () => {
        if (!replyContent.trim()) {
            toast.error("Reply cannot be empty");
            return;
        }

        if (thread?.isLocked) {
            toast.error("This thread is locked");
            return;
        }

        createReply.mutate(
            { threadId, data: { content: replyContent } },
            {
                onSuccess: () => {
                    setReplyContent("");
                    toast.success("Reply posted!");
                },
            }
        );
    };

    if (threadLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-slate-100 rounded-lg w-3/4" />
                    <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
                    <div className="h-32 bg-slate-100 rounded-lg" />
                </div>
            </div>
        );
    }

    if (threadError || !thread) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 text-center">
                <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">😕</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Thread not found</h3>
                <button
                    onClick={() => router.push("/forum")}
                    className="text-primary hover:text-primary/80 font-bold transition-colors"
                >
                    ← Back to Forum
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Back Button */}
            <button
                onClick={() => router.push(`/forum/category/${thread.category._id}`)}
                className="text-primary hover:text-primary/80 mb-6 flex items-center gap-2 font-bold text-sm transition-colors"
            >
                ← Back to {thread.category.name}
            </button>

            {/* Thread Content */}
            <motion.div
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Badges */}
                <div className="flex items-center gap-2 mb-4">
                    {thread.isPinned && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                            <MdPushPin />
                            Pinned
                        </span>
                    )}
                    {thread.isLocked && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                            <MdLock />
                            Locked
                        </span>
                    )}
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                        {thread.category.name}
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">{thread.title}</h1>

                {/* Author & Meta */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary/20">
                        {thread.author.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{thread.author.name}</span>
                            {thread.author.role === "admin" && (
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                                    Admin
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                            <span>{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                                <MdVisibility />
                                {thread.views} views
                            </span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                                <MdComment />
                                {thread.replyCount || 0} replies
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="prose max-w-none">
                    <p className="text-slate-700 text-base whitespace-pre-wrap leading-relaxed">{thread.content}</p>
                </div>

                {/* Report Actions */}
                {user && !isAuthor && (
                    <div className="flex gap-2 mt-6 pt-6 border-t border-slate-100">
                        <button
                            onClick={() => setShowThreadReportModal(true)}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            <MdFlag size={16} />
                            Report Thread
                        </button>
                        <button
                            onClick={() => setShowUserReportModal(true)}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
                        >
                            <MdFlag size={16} />
                            Report User
                        </button>
                    </div>
                )}
            </motion.div>

            {/* Reply Form */}
            {!thread.isLocked ? (
                user ? (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <MdComment className="text-primary" />
                            Post a Reply
                        </h3>
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="w-full border border-slate-200 rounded-xl p-4 bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none mb-4 text-slate-800 transition-all"
                            rows={5}
                        />
                        <button
                            onClick={handleReply}
                            disabled={createReply.isPending || !replyContent.trim()}
                            className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-primary/20 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <MdSend />
                            {createReply.isPending ? "Posting..." : "Post Reply"}
                        </button>
                    </div>
                ) : (
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-6 text-center">
                        <p className="text-slate-700 font-bold">Please log in to reply to this thread.</p>
                    </div>
                )
            ) : (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-6 text-center">
                    <MdLock className="mx-auto text-red-500 mb-2" size={32} />
                    <p className="text-red-700 font-bold">This thread is locked. No new replies can be posted.</p>
                </div>
            )}

            {/* Replies */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <MdComment className="text-primary" />
                    Replies ({repliesData?.data.length || 0})
                </h3>

                {repliesLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-20 bg-slate-50 rounded-xl" />
                            </div>
                        ))}
                    </div>
                ) : repliesData?.data.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
                            <span className="text-3xl">💬</span>
                        </div>
                        <p className="text-slate-400 font-medium">No replies yet. Be the first to respond!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {repliesData?.data.map((reply) => (
                            <ReplyItem key={reply._id} reply={reply} threadId={threadId} />
                        ))}
                    </div>
                )}
            </div>

            {/* Report Modals */}
            <ReportModal
                isOpen={showThreadReportModal}
                onClose={() => setShowThreadReportModal(false)}
                onSubmit={handleReportThread}
                title={`Report Thread: ${thread?.title}`}
                contentType="thread"
                contentPreview={thread?.content}
            />

            <ReportModal
                isOpen={showUserReportModal}
                onClose={() => setShowUserReportModal(false)}
                onSubmit={handleReportUser}
                title={`Report User: ${thread?.author.name}`}
                contentType="user"
            />
        </div>
    );
};

export default ForumThreadDetail;
