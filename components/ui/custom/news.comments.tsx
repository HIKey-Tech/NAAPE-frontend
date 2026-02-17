"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNewsComments, NewsComment } from "@/hooks/useNewsComments";
import { useAuth } from "@/context/authcontext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Reply, Trash2 } from "lucide-react";

interface NewsCommentsProps {
    newsId: string;
}

interface CommentItemProps {
    comment: NewsComment;
    onDelete: (id: string) => void;
    onReply: (commentId: string, text: string) => Promise<void>;
    currentUserId: string;
    currentUserRole: string;
    depth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    onDelete,
    onReply,
    currentUserId,
    currentUserRole,
    depth = 0
}) => {
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const canDelete = currentUserId === comment.user._id || currentUserRole === "admin";
    const maxDepth = 3;

    const handleReply = async () => {
        if (!replyText.trim()) return;

        setSubmitting(true);
        await onReply(comment._id, replyText);
        setReplyText("");
        setShowReplyBox(false);
        setSubmitting(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className={`${depth > 0 ? 'ml-8 mt-3' : 'mt-4'}`}>
            <div className={`bg-white border ${depth > 0 ? 'border-l-4 border-l-primary/40' : 'border-slate-100'} rounded-2xl p-4 hover:shadow-sm transition-shadow`}>
                <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <Avatar className="w-10 h-10 shrink-0">
                        {comment.user.profile?.image?.url ? (
                            <AvatarImage
                                src={comment.user.profile.image.url}
                                alt={comment.user.name}
                                className="object-cover"
                            />
                        ) : null}
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                            {getInitials(comment.user.name)}
                        </AvatarFallback>
                    </Avatar>

                    {/* Comment Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-bold text-sm text-slate-900">
                                {comment.user.name}
                            </span>
                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide px-2 py-0.5 bg-slate-100 rounded-full">
                                {comment.user.role}
                            </span>
                            <span className="text-xs text-slate-400">
                                {formatDate(comment.createdAt)}
                            </span>
                        </div>
                        <p className="text-slate-700 whitespace-pre-wrap break-words mb-2 text-sm leading-relaxed">
                            {comment.text}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 mt-2">
                            {depth < maxDepth && (
                                <button
                                    onClick={() => setShowReplyBox(!showReplyBox)}
                                    className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-bold transition-colors"
                                >
                                    <Reply className="h-3.5 w-3.5" />
                                    Reply
                                </button>
                            )}
                            {canDelete && (
                                <button
                                    onClick={() => onDelete(comment._id)}
                                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-bold transition-colors"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Delete
                                </button>
                            )}
                        </div>

                        {/* Reply Box */}
                        {showReplyBox && (
                            <div className="mt-3 space-y-2 bg-slate-50 p-3 rounded-xl">
                                <Textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder={`Reply to ${comment.user.name}...`}
                                    className="min-h-[80px] resize-none rounded-xl border-slate-200 bg-white focus:border-primary"
                                />
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleReply}
                                        disabled={submitting || !replyText.trim()}
                                        size="sm"
                                        className="bg-primary hover:bg-primary/90 rounded-xl font-bold shadow-md shadow-primary/20"
                                    >
                                        {submitting ? "Posting..." : "Post Reply"}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setShowReplyBox(false);
                                            setReplyText("");
                                        }}
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl font-bold"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Render nested replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply._id}
                            comment={reply}
                            onDelete={onDelete}
                            onReply={onReply}
                            currentUserId={currentUserId}
                            currentUserRole={currentUserRole}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const NewsComments: React.FC<NewsCommentsProps> = ({ newsId }) => {
    const router = useRouter();
    const { comments, loading, submitting, fetchComments, addComment, deleteComment } = useNewsComments(newsId);
    const { user, loading: authLoading } = useAuth();
    const [commentText, setCommentText] = useState("");

    useEffect(() => {
        if (newsId && user && !authLoading) {
            fetchComments();
        }
    }, [newsId, user, authLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            router.push("/login");
            return;
        }
        const success = await addComment(commentText);
        if (success) {
            setCommentText("");
        }
    };

    const handleTextareaFocus = () => {
        if (!user) {
            router.push("/login");
        }
    };

    const handleReply = async (parentCommentId: string, text: string) => {
        await addComment(text, parentCommentId);
    };

    const handleDelete = async (commentId: string) => {
        if (confirm("Are you sure you want to delete this comment?")) {
            await deleteComment(commentId);
        }
    };

    const handleLoginRedirect = () => {
        router.push("/login");
    };

    if (authLoading) {
        return (
            <div className="mt-8 text-center py-8">
                <p className="text-slate-400">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="mt-8 p-8 bg-primary/5 rounded-2xl border border-primary/10 text-center">
                <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                        Join the Conversation
                    </h3>
                    <p className="text-slate-500 mb-6">
                        Log in to read and share your thoughts on this news article.
                    </p>
                    <Button
                        onClick={handleLoginRedirect}
                        className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-base font-bold rounded-xl shadow-md shadow-primary/20"
                    >
                        Log In to Comment
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-8 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold mb-6 text-slate-900">
                Comments ({comments.length})
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-8">
                <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onFocus={handleTextareaFocus}
                    placeholder="Share your thoughts..."
                    className="min-h-[100px] mb-3 resize-none rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary"
                    disabled={submitting}
                />
                <Button
                    type="submit"
                    disabled={submitting || !commentText.trim()}
                    className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-md shadow-primary/20"
                >
                    {submitting ? "Posting..." : "Post Comment"}
                </Button>
            </form>

            {/* Comments List */}
            {loading ? (
                <div className="text-center py-8">
                    <p className="text-slate-400">Loading comments...</p>
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl">
                    <p className="text-slate-400 font-medium">No comments yet. Be the first to comment!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            onDelete={handleDelete}
                            onReply={handleReply}
                            currentUserId={user._id}
                            currentUserRole={user.role}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default NewsComments;
