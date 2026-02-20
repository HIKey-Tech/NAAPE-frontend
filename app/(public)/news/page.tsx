"use client";

import { useState, useEffect } from "react";
import { NewsCard } from "@/components/ui/custom/news.card";
import Link from "next/link";
import api from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function NewsPage() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await api.get("/news");
                // Assuming backend returns an array or response.data.data
                setNews(response.data.data || response.data || []);
            } catch (error) {
                console.error("Failed to fetch news:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const filteredNews = news.filter((item) =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="min-h-screen bg-gray-50 w-full flex flex-col items-center">
            {/* Simple Hero Section */}
            <div className="w-full pt-32 pb-16 bg-white border-b border-slate-100 text-center px-4">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                    NAAPE <span className="text-primary">News</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Updates, features, and stories from the National Association of Aircraft Pilots and Engineers.
                </p>
                <div className="mt-8 flex justify-center max-w-md mx-auto relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        type="text"
                        placeholder="Search news..."
                        className="pl-10 h-12 rounded-full border-slate-200 bg-slate-50 focus-visible:ring-primary shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <section className="w-full max-w-7xl mx-auto px-4 py-16">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredNews.length === 0 ? (
                    <div className="py-20 text-center text-slate-500 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-2xl mx-auto">
                        <p className="text-lg font-medium">No news articles found.</p>
                        {searchTerm && (
                            <button onClick={() => setSearchTerm("")} className="mt-4 text-primary hover:underline font-bold">
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredNews.map((item) => (
                            <Link href={`/news/${item._id || item.id}`} key={item._id || item.id} className="block group focus:outline-none focus:ring-2 focus:ring-primary rounded-3xl transition-transform hover:-translate-y-1">
                                <NewsCard
                                    imageUrl={item.image || "/images/plane.jpg"}
                                    title={item.title}
                                    summary={item.content?.substring(0, 150) + "..."}
                                    authorName={item.author?.name || "NAAPE Media Team"}
                                    authorRole={item.category || "General"}
                                    authorAvatarUrl="/logo.png"
                                    linkUrl={`/news/${item._id || item.id}`}
                                    category={item.category}
                                />
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
