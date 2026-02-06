"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useForumCategories, useCreateForumThread, useUpdateForumThread, useForumThread } from "@/hooks/useForum";
import { motion } from "framer-motion";
import { MdArrowBack, MdSend } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface ForumThreadFormProps {
    threadId?: string; // If provided, it's edit mode
}

const ForumThreadFormContent: React.FC<ForumThreadFormProps> = ({ threadId }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedCategory = searchParams?.get("category");

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categoryId, setCategoryId] = useState(preselectedCategory || "");

    const { data: categories, isPending: categoriesLoading } = useForumCategories();
    const { data: existingThread, isPending: threadLoading } = useForumThread(threadId || "");
    const createThread = useCreateForumThread();
    const updateThread = useUpdateForumThread();

    const isEditMode = !!threadId;

    // Load existing thread data in edit mode
    useEffect(() => {
        if (existingThread && isEditMode) {
            setTitle(existingThread.title);
            setContent(existingThread.content);
            setCategoryId(existingThread.category._id);
        }
    }, [existingThread, isEditMode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Please enter a title");
            return;
        }

        if (!content.trim()) {
            toast.error("Please enter content");
            return;
        }

        if (!categoryId) {
            toast.error("Please select a category");
            return;
        }

        if (isEditMode && threadId) {
            updateThread.mutate(
                { threadId, data: { title, content } },
                {
                    onSuccess: () => {
                        router.push(`/forum/threads/${threadId}`);
                    },
                }
            );
        } else {
            createThread.mutate(
                { title, content, categoryId },
                {
                    onSuccess: (data) => {
                        router.push(`/forum/threads/${data._id}`);
                    },
                }
            );
        }
    };

    if (isEditMode && threadLoading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/2" />
                    <div className="h-12 bg-gray-200 rounded" />
                    <div className="h-32 bg-gray-200 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Header */}
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <button
                    onClick={() => router.back()}
                    className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
                >
                    <MdArrowBack />
                    Back
                </button>
                <h1 className="text-4xl font-black text-gray-900 mb-2">
                    {isEditMode ? "Edit Thread" : "Create New Thread"}
                </h1>
                <p className="text-gray-600">
                    {isEditMode ? "Update your thread" : "Start a new discussion with the community"}
                </p>
            </motion.div>

            {/* Form */}
            <motion.form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl border-2 border-gray-100 p-8 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Category */}
                <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                        Category *
                    </label>
                    <select
                        id="category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        disabled={isEditMode} // Can't change category in edit mode
                        className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                        required
                    >
                        <option value="">Select a category</option>
                        {categoriesLoading ? (
                            <option>Loading categories...</option>
                        ) : (
                            categories?.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.icon} {cat.name}
                                </option>
                            ))
                        )}
                    </select>
                    {isEditMode && (
                        <p className="text-xs text-gray-500 mt-1">Category cannot be changed after creation</p>
                    )}
                </div>

                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                        Title *
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a descriptive title..."
                        className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        maxLength={200}
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">{title.length}/200 characters</p>
                </div>

                {/* Content */}
                <div>
                    <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
                        Content *
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Share your thoughts, ask questions, or start a discussion..."
                        className="w-full border-2 border-gray-200 rounded-lg p-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        rows={12}
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Be clear and descriptive. You can edit your post later.
                    </p>
                </div>

                {/* Guidelines */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">📝 Posting Guidelines</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Be respectful and constructive</li>
                        <li>• Stay on topic for the selected category</li>
                        <li>• Search for existing threads before posting</li>
                        <li>• Use clear and descriptive titles</li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={createThread.isPending || updateThread.isPending}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <MdSend />
                        {isEditMode ? "Update Thread" : "Create Thread"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </motion.form>
        </div>
    );
};

const ForumThreadForm: React.FC<ForumThreadFormProps> = ({ threadId }) => {
    return (
        <Suspense fallback={
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/2" />
                    <div className="h-12 bg-gray-200 rounded" />
                    <div className="h-32 bg-gray-200 rounded" />
                </div>
            </div>
        }>
            <ForumThreadFormContent threadId={threadId} />
        </Suspense>
    );
};

export default ForumThreadForm;
