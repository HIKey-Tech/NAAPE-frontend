"use client";
import React, { useState } from "react";
import { useForumCategories } from "@/hooks/useForum";
import { motion, AnimatePresence } from "framer-motion";
import { MdForum, MdAdd, MdSearch, MdTrendingUp } from "react-icons/md";
import { useRouter } from "next/navigation";
import { ForumCategory } from "@/app/api/forum/forum";

const shimmer = "bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse";

const CategorySkeleton = () => (
    <motion.div
        className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
    >
        <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-xl ${shimmer}`} />
            <div className="flex-1">
                <div className={`h-6 w-3/4 rounded-lg mb-2 ${shimmer}`} />
                <div className={`h-4 w-full rounded-lg mb-3 ${shimmer}`} />
                <div className={`h-4 w-1/3 rounded-lg ${shimmer}`} />
            </div>
        </div>
    </motion.div>
);

const CategoryCard: React.FC<{ category: ForumCategory }> = ({ category }) => {
    const router = useRouter();

    return (
        <motion.div
            className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm p-6 cursor-pointer hover:border-primary/30 dark:hover:border-primary/50 hover:shadow-lg transition-all group"
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(`/forum/category/${category._id}`)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform shadow-md shadow-primary/20">
                    {category.icon || "💬"}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-primary transition-colors">
                        {category.name}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-3 line-clamp-2">{category.description}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1.5">
                            <MdForum className="text-primary" />
                            <span className="font-medium">{category.threadCount || 0}</span> threads
                        </span>
                    </div>
                </div>

                {/* Arrow */}
                <div className="text-slate-300 dark:text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-all">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </motion.div>
    );
};

const Forum: React.FC = () => {
    const router = useRouter();
    const { data: categories, isPending: loading, error } = useForumCategories();
    const [search, setSearch] = useState("");

    const filteredCategories = categories?.filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase()) ||
        cat.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className="max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
            {/* Header */}
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-3">
                            <span className="text-4xl">💬</span>
                            Community Forum
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">
                            Connect, discuss, and share knowledge with fellow members
                        </p>
                    </div>

                    <motion.button
                        className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push("/forum/new-thread")}
                    >
                        <MdAdd size={24} />
                        New Thread
                    </motion.button>
                </div>

                {/* Search & Stats */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder-slate-400 dark:placeholder-slate-500"
                        />
                    </div>

                    <div className="flex items-center gap-2 px-4 py-3 bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 rounded-xl">
                        <MdTrendingUp className="text-primary" size={20} />
                        <span className="font-bold text-slate-700 dark:text-slate-200">
                            {categories?.length || 0} Categories
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Categories Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <CategorySkeleton key={i} />
                    ))}
                </div>
            ) : error ? (
                <motion.div
                    className="text-center py-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">😕</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Unable to load categories</h3>
                    <p className="text-slate-500 dark:text-slate-400">Please try again later</p>
                </motion.div>
            ) : filteredCategories && filteredCategories.length === 0 ? (
                <motion.div
                    className="text-center py-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">🔍</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">No categories found</h3>
                    <p className="text-slate-500 dark:text-slate-400">Try a different search term</p>
                </motion.div>
            ) : (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 },
                        },
                    }}
                >
                    {filteredCategories?.map((category) => (
                        <CategoryCard key={category._id} category={category} />
                    ))}
                </motion.div>
            )}
        </section>
    );
};

export default Forum;
