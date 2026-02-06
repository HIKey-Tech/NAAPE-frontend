"use client";
import React, { useState } from "react";
import { useForumThread, useThreadReplies, useCreateForumReply, useDeleteForumReply, useUpdateForumReply } from "@/hooks/useForum";
import { ForumReply } from "@/app/api/forum/forum";
import { motion } from "framer-motion";
import { MdPushPin, MdLock, MdVisibility, MdComment, MdSend, MdEdit, MdDelete, MdReply } from "react-icons/md";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/hook/store/useAuthStore";
import { toast } from "sonner";

const ReplyItem: React.FC<{ reply: ForumReply; threadId: string; isNested?: boolean }> = ({ reply, threadId, isNested = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(reply.content);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    
    const user = useAuthStore((state) => state.user);
    const isAuthor = user?._id === reply.author._id;
    const isAdmin = user?.role === "admin";
    
    const updateReply = useUpdateForumReply();
    const deleteReply = useDeleteForumReply();
    const createReply = useCreateForumReply();

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

    return (
        <div className={`${isNested ? "ml-8 mt-4" : "mt-6"}`}>
            <div className="bg-[#f8fbff] rounded-lg border-2 border-[#e4ecf7] p-4 hover:border-[#c9daf9] transition-colors">
                {/* Author Info */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2C6ED4] to-[#15407c] flex items-center justify-center text-white font-bold">
                            {reply.author.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-[#15407c]">{reply.author.name}</span>
                                {reply.author.role === "admin" && (
                                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold border border-purple-300">
                                        Admin
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-[#6782a9]">
                                {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                                {reply.isEdited && " (edited)"}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    {(isAuthor || isAdmin) && !isEditing && (
                        <div className="flex gap-2">
                            {isAuthor && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="p-2 hover:bg-[#e8f0fb] rounded-full transition-colors"
                                    title="Edit"
                                >
                                    <MdEdit size={18} className="text-[#2C6ED4]" />
                                </button>
                            )}
                            <button
                                onClick={handleDelete}
                                className="p-2 hover:bg-red-50 rounded-full transition-colors"
                                title="Delete"
                            >
                                <MdDelete size={18} className="text-red-600" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Content */}
                {isEditing ? (
                    <div className="space-y-2">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full border-2 border-[#e4ecf7] rounded-lg p-3 focus:border-[#2C6ED4] focus:ring-2 focus:ring-[#2C6ED4]/20 outline-none text-[#16355D]"
                            rows={3}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleUpdate}
                                disabled={updateReply.isPending}
                                className="px-4 py-2 bg-[#2C6ED4] text-white rounded-lg hover:bg-[#15407c] disabled:opacity-50 transition-colors"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditContent(reply.content);
                                }}
                                className="px-4 py-2 bg-[#e4ecf7] text-[#16355D] rounded-lg hover:bg-[#d1e0f3] transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-[#16355D] whitespace-pre-wrap mb-3">{reply.content}</p>
                        
                        {!isNested && (
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="text-sm text-[#2C6ED4] hover:text-[#15407c] flex items-center gap-1 font-semibold transition-colors"
                            >
                                <MdReply />
                                Reply
                            </button>
                        )}
                    </>
                )}

                {/* Reply Form */}
                {showReplyForm && (
                    <div className="mt-4 space-y-2">
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write your reply..."
                            className="w-full border-2 border-[#e4ecf7] rounded-lg p-3 focus:border-[#2C6ED4] focus:ring-2 focus:ring-[#2C6ED4]/20 outline-none text-[#16355D]"
                            rows={3}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleReply}
                                disabled={createReply.isPending || !replyContent.trim()}
                                className="px-4 py-2 bg-[#2C6ED4] text-white rounded-lg hover:bg-[#15407c] disabled:opacity-50 flex items-center gap-2 transition-colors"
                            >
                                <MdSend />
                                Post Reply
                            </button>
                            <button
                                onClick={() => {
                                    setShowReplyForm(false);
                                    setReplyContent("");
                                }}
                                className="px-4 py-2 bg-[#e4ecf7] text-[#16355D] rounded-lg hover:bg-[#d1e0f3] transition-colors"
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
        </div>
    );
};

interface ForumThreadDetailProps {
    threadId: string;
}

const ForumThreadDetail: React.FC<ForumThreadDetailProps> = ({ threadId }) => {
    const router = useRouter();
    const [replyContent, setReplyContent] = useState("");
    
    const { data: thread, isPending: threadLoading, error: threadError } = useForumThread(threadId);
    const { data: repliesData, isPending: repliesLoading } = useThreadReplies(threadId);
    const createReply = useCreateForumReply();
    const user = useAuthStore((state) => state.user);

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
                    <div className="h-8 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-32 bg-gray-200 rounded" />
                </div>
            </div>
        );
    }

    if (threadError || !thread) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 text-center">
                <div className="text-6xl mb-4">😕</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Thread not found</h3>
                <button
                    onClick={() => router.push("/forum")}
                    className="text-blue-600 hover:text-blue-700"
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
                className="text-[#2C6ED4] hover:text-[#15407c] mb-6 flex items-center gap-2 font-semibold transition-colors"
            >
                ← Back to {thread.category.name}
            </button>

            {/* Thread Content */}
            <motion.div
                className="bg-white rounded-xl border-2 border-[#dde7f3] p-8 mb-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Badges */}
                <div className="flex items-center gap-2 mb-4">
                    {thread.isPinned && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold border border-yellow-300">
                            <MdPushPin />
                            Pinned
                        </span>
                    )}
                    {thread.isLocked && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold border border-red-300">
                            <MdLock />
                            Locked
                        </span>
                    )}
                    <span className="px-3 py-1 bg-[#e8f0fb] text-[#2C6ED4] rounded-full text-sm font-semibold border border-[#c9daf9]">
                        {thread.category.name}
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-black text-[#15407c] mb-4">{thread.title}</h1>

                {/* Author & Meta */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#e4ecf7]">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2C6ED4] to-[#15407c] flex items-center justify-center text-white font-bold text-lg">
                        {thread.author.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#15407c]">{thread.author.name}</span>
                            {thread.author.role === "admin" && (
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold border border-purple-300">
                                    Admin
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-[#6782a9]">
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
                    <p className="text-[#16355D] text-lg whitespace-pre-wrap leading-relaxed">{thread.content}</p>
                </div>
            </motion.div>

            {/* Reply Form */}
            {!thread.isLocked && user && (
                <div className="bg-white rounded-xl border-2 border-[#dde7f3] p-6 mb-6 shadow-sm">
                    <h3 className="text-xl font-bold text-[#15407c] mb-4 flex items-center gap-2">
                        <MdComment className="text-[#2C6ED4]" />
                        Post a Reply
                    </h3>
                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="w-full border-2 border-[#e4ecf7] rounded-lg p-4 focus:border-[#2C6ED4] focus:ring-2 focus:ring-[#2C6ED4]/20 outline-none mb-4 text-[#16355D]"
                        rows={5}
                    />
                    <button
                        onClick={handleReply}
                        disabled={createReply.isPending || !replyContent.trim()}
                        className="bg-[#2C6ED4] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#15407c] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <MdSend />
                        {createReply.isPending ? "Posting..." : "Post Reply"}
                    </button>
                </div>
            )}

            {thread.isLocked && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6 text-center">
                    <MdLock className="mx-auto text-red-600 mb-2" size={32} />
                    <p className="text-red-700 font-semibold">This thread is locked. No new replies can be posted.</p>
                </div>
            )}

            {/* Replies */}
            <div className="bg-white rounded-xl border-2 border-[#dde7f3] p-6 shadow-sm">
                <h3 className="text-2xl font-bold text-[#15407c] mb-6 flex items-center gap-2">
                    <MdComment className="text-[#2C6ED4]" />
                    Replies ({repliesData?.data.length || 0})
                </h3>

                {repliesLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-20 bg-[#f0f5fc] rounded" />
                            </div>
                        ))}
                    </div>
                ) : repliesData?.data.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-3">💬</div>
                        <p className="text-[#6782a9]">No replies yet. Be the first to respond!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {repliesData?.data.map((reply) => (
                            <ReplyItem key={reply._id} reply={reply} threadId={threadId} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForumThreadDetail;
