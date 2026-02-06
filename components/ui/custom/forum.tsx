"use client";
import React, { useState } from "react";
import { useForumCategories } from "@/hooks/useForum";
import { motion, AnimatePresence } from "framer-motion";
import { MdForum, MdAdd, MdSearch, MdTrendingUp } from "react-icons/md";
import { useRouter } from "next/navigation";
import { ForumCategory } from "@/app/api/forum/forum";

const shimmer = "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse";

const CategorySkeleton = () => (
    <motion.div
        className="bg-white rounded-xl border-2 border-gray-100 p-6 hover:shadow-lg transition-all"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
    >
        <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-lg ${shimmer}`} />
            <div className="flex-1">
                <div className={`h-6 w-3/4 rounded mb-2 ${shimmer}`} />
                <div className={`h-4 w-full rounded mb-3 ${shimmer}`} />
                <div className={`h-4 w-1/3 rounded ${shimmer}`} />
            </div>
        </div>
    </motion.div>
);

const CategoryCard: React.FC<{ category: ForumCategory }> = ({ category }) => {
    const router = useRouter();

    return (
        <motion.div
            className="bg-white rounded-xl border-2 border-gray-100 p-6 cursor-pointer hover:border-blue-400 hover:shadow-xl transition-all group"
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(`/forum/category/${category._id}`)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                    {category.icon || "💬"}
                </div>

                {/* Content */}
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                        {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{category.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <MdForum className="text-blue-500" />
                            {category.threadCount || 0} threads
                        </span>
                    </div>
                </div>

                {/* Arrow */}
                <div className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
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
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 flex items-center gap-3">
                            <span className="text-5xl">💬</span>
                            Community Forum
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Connect, discuss, and share knowledge with fellow members
                        </p>
                    </div>

                    <motion.button
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-all"
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
                        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                        <MdTrendingUp className="text-blue-600" size={20} />
                        <span className="font-semibold text-gray-700">
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
                    <div className="text-6xl mb-4">😕</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Unable to load categories</h3>
                    <p className="text-gray-600">Please try again later</p>
                </motion.div>
            ) : filteredCategories && filteredCategories.length === 0 ? (
                <motion.div
                    className="text-center py-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No categories found</h3>
                    <p className="text-gray-600">Try a different search term</p>
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
