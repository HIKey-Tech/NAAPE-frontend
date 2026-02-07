"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNewsComments, NewsComment } from "@/hooks/useNewsComments";
import { useAuthStore } from "@/hook/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface NewsCommentsProps {
    newsId: string;
}

const NewsComments: React.FC<NewsCommentsProps> = ({ newsId }) => {
    const router = useRouter();
    const { comments, loading, submitting, fetchComments, addComment, deleteComment } = useNewsComments(newsId);
    const { user } = useAuthStore();
    const [commentText, setCommentText] = useState("");

    useEffect(() => {
        if (newsId && user) {
            fetchComments();
        }
    }, [newsId, user]);

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

    const handleDelete = async (commentId: string) => {
        if (confirm("Are you sure you want to delete this comment?")) {
            await deleteComment(commentId);
        }
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

    const handleLoginRedirect = () => {
        router.push("/login");
    };

    if (!user) {
        return (
            <div className="mt-8 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-[#193B7A]/20 text-center">
                <div className="max-w-md mx-auto">
                    <svg
                        className="w-16 h-16 mx-auto mb-4 text-[#193B7A]"
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
                    <h3 className="text-xl font-bold text-[#193B7A] mb-2">
                        Join the Conversation
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Log in to read and share your thoughts on this news article.
                    </p>
                    <Button
                        onClick={handleLoginRedirect}
                        className="bg-[#193B7A] hover:bg-[#154075] text-white px-8 py-3 text-base font-semibold"
                    >
                        Log In to Comment
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-2xl font-bold mb-6 text-[#193B7A]">
                Comments ({comments.length})
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-8">
                <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onFocus={handleTextareaFocus}
                    placeholder="Share your thoughts..."
                    className="min-h-[100px] mb-3 resize-none"
                    disabled={submitting}
                />
                <Button
                    type="submit"
                    disabled={submitting || !commentText.trim()}
                    className="bg-[#193B7A] hover:bg-[#154075] text-white"
                >
                    {submitting ? "Posting..." : "Post Comment"}
                </Button>
            </form>

            {/* Comments List */}
            {loading ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">Loading comments...</p>
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div
                            key={comment._id}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                        >
                            <div className="flex items-start gap-3">
                                {/* Avatar */}
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#193B7A] text-white flex items-center justify-center font-semibold">
                                    {getInitials(comment.user.name)}
                                </div>

                                {/* Comment Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-gray-900">
                                            {comment.user.name}
                                        </span>
                                        <span className="text-xs text-gray-500 uppercase px-2 py-0.5 bg-gray-100 rounded">
                                            {comment.user.role}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {formatDate(comment.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-wrap break-words">
                                        {comment.text}
                                    </p>
                                </div>

                                {/* Delete Button */}
                                {(user._id === comment.user._id || user.role === "admin") && (
                                    <button
                                        onClick={() => handleDelete(comment._id)}
                                        className="flex-shrink-0 text-red-500 hover:text-red-700 text-sm font-medium"
                                        title="Delete comment"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NewsComments;
