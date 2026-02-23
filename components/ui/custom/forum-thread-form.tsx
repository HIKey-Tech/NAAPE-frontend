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
                    <div className="h-8 bg-slate-100 rounded-lg w-1/2" />
                    <div className="h-12 bg-slate-100 rounded-lg" />
                    <div className="h-32 bg-slate-100 rounded-lg" />
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
                    className="text-primary hover:text-primary/80 mb-4 flex items-center gap-2 font-bold text-sm transition-colors"
                >
                    <MdArrowBack />
                    Back
                </button>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {isEditMode ? "Edit Thread" : "Create New Thread"}
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    {isEditMode ? "Update your thread" : "Start a new discussion with the community"}
                </p>
            </motion.div>

            {/* Form */}
            <motion.form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm p-8 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Category */}
                <div>
                    <label htmlFor="category" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        disabled={isEditMode}
                        className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:cursor-not-allowed transition-all text-slate-900 dark:text-slate-100"
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
                        <p className="text-xs text-slate-400 mt-1">Category cannot be changed after creation</p>
                    )}
                </div>

                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a descriptive title..."
                        className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-slate-900 dark:text-slate-100"
                        maxLength={200}
                        required
                    />
                    <p className="text-xs text-slate-400 mt-1">{title.length}/200 characters</p>
                </div>

                {/* Content */}
                <div>
                    <label htmlFor="content" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                        Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Share your thoughts, ask questions, or start a discussion..."
                        className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-slate-900 dark:text-slate-100"
                        rows={12}
                        required
                    />
                    <p className="text-xs text-slate-400 mt-1">
                        Be clear and descriptive. You can edit your post later.
                    </p>
                </div>

                {/* Guidelines */}
                <div className="bg-primary/5 border border-primary/10 dark:border-primary/20 rounded-xl p-4">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">📝 Posting Guidelines</h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        <li>• Be respectful and constructive</li>
                        <li>• Stay on topic for the selected category</li>
                        <li>• Search for existing threads before posting</li>
                        <li>• Use clear and descriptive titles</li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100 dark:border-border">
                    <button
                        type="submit"
                        disabled={createThread.isPending || updateThread.isPending}
                        className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-primary/20 hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <MdSend />
                        {isEditMode ? "Update Thread" : "Create Thread"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
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
                    <div className="h-8 bg-slate-100 rounded-lg w-1/2" />
                    <div className="h-12 bg-slate-100 rounded-lg" />
                    <div className="h-32 bg-slate-100 rounded-lg" />
                </div>
            </div>
        }>
            <ForumThreadFormContent threadId={threadId} />
        </Suspense>
    );
};

export default ForumThreadForm;
