"use client";

import { useParams, useRouter } from "next/navigation";
import NewsDetails from "@/components/ui/custom/news.details";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Loader2 } from "lucide-react";

export default function NaapeNewsDetailsPage() {
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#F8FAFC]">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold mb-2 text-[#357AA8]">News article not found</h1>
          <p className="mb-6 text-gray-500">
            Sorry, we couldn't find that news article.
          </p>
          <button
            className="bg-[#357AA8] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#256E98] transition-colors"
            onClick={() => router.push("/news")}
          >
            Back to News
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-9 px-3 sm:px-0">
      <NewsDetails
        imageUrl={news.image || "/images/plane.jpg"}
        title={news.title}
        content={news.content}
        date={news.createdAt}
        category={news.category}
        author={news.author || {
          name: "NAAPE Media Team",
          avatarUrl: "/logo.png"
        }}
        backHref="/news"
        newsId={news._id || news.id}
        showComments={true}
      />
    </main>
  );
}
