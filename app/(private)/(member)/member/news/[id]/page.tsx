"use client";

import { useParams, useRouter } from "next/navigation";
import NewsDetails from "@/components/ui/custom/news.details";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Loader2 } from "lucide-react";

export default function MemberNewsDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

    const [news, setNews] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSingleNews = async () => {
            if (!id) return;
            try {
                const response = await api.get(`/news/${id}`);
                setNews(response.data.data || response.data);
            } catch (error) {
                console.error("Failed to fetch news details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSingleNews();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (!news) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center px-6">
                <div className="max-w-md text-center bg-white dark:bg-card p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-border">
                    <h1 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">News article not found</h1>
                    <p className="mb-6 text-slate-500 dark:text-slate-400 text-sm">
                        Sorry, we couldn't find that news article.
                    </p>
                    <button
                        className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
                        onClick={() => router.push("/member/news")}
                    >
                        Back to News
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="bg-slate-50/50 dark:bg-transparent min-h-screen pt-4 pb-16 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto mb-4">
                <button
                    className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2"
                    onClick={() => router.push("/member/news")}
                >
                    &larr; Back to News
                </button>
            </div>
            <NewsDetails
                imageUrl={news.image || "/images/plane.jpg"}
                title={news.title}
                content={news.content}
                date={news.createdAt}
                author={news.author || {
                    name: "NAAPE Media Team",
                    avatarUrl: "/logo.png"
                }}
                backHref="/member/news"
                newsId={news._id || news.id}
                showComments={true}
            />
        </main>
    );
}
