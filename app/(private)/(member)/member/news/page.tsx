"use client";

import { useState, useEffect } from "react";
import { NewsCard } from "@/components/ui/custom/news.card";
import Link from "next/link";
import api from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function MemberNewsPage() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await api.get("/news");
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
        <div className="bg-slate-50/50 w-full min-h-screen">
            <div className="w-full pt-10 pb-8 bg-white border-b border-slate-100 px-6 sm:px-10">
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                    News <span className="text-primary">& Updates</span>
                </h1>
                <p className="text-sm text-slate-500 max-w-2xl">
                    Stay up to date with the latest features and stories from NAAPE.
                </p>
                <div className="mt-6 flex max-w-md relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        type="text"
                        placeholder="Search news..."
                        className="pl-10 h-10 w-full rounded-full border-slate-200 bg-slate-50 focus-visible:ring-primary shadow-sm text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="px-6 sm:px-10 py-10">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredNews.length === 0 ? (
                    <div className="py-20 text-center text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm max-w-2xl mx-auto">
                        <p className="text-sm font-medium">No news articles found.</p>
                        {searchTerm && (
                            <button onClick={() => setSearchTerm("")} className="mt-4 text-primary hover:underline font-bold text-sm">
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredNews.map((item) => (
                            <Link href={`/member/news/${item._id || item.id}`} key={item._id || item.id} className="block group focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl transition-transform hover:-translate-y-1">
                                <NewsCard
                                    imageUrl={item.image || "/images/plane.jpg"}
                                    title={item.title}
                                    summary={item.content?.substring(0, 150) + "..."}
                                    authorName={item.author?.name || "NAAPE Media Team"}
                                    authorRole={item.category || "General"}
                                    authorAvatarUrl="/logo.png"
                                    linkUrl={`/member/news/${item._id || item.id}`}
                                    category={item.category}
                                />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
