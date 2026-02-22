"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function getInitials(name?: string) {
  if (!name || typeof name !== "string" || !name.trim()) return "NA";
  const parts = name.trim().split(/\s+/);
  return parts.map((s) => s[0]?.toUpperCase() || "").join("").slice(0, 2) || "NA";
}

export default function NaapePublicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [publication, setPublication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchPublication = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await api.get(`/publications/${id}`);
        setPublication(response.data.data || response.data);
      } catch (err) {
        console.error("Failed to fetch publication:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPublication();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !publication) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-slate-50">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2 text-primary">Publication not found</h1>
          <p className="mb-6 text-slate-500">Sorry, we couldn&apos;t find that publication.</p>
          <button
            className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-colors"
            onClick={() => router.push("/publication/naape")}
          >
            Back to Publications
          </button>
        </div>
      </div>
    );
  }

  const authorName = publication.author?.name || "NAAPE";
  const authorRole = publication.author?.role || "Admin";
  const authorAvatar = publication.author?.profile?.image?.url || null;
  const category = publication.category;
  const displayDate = publication.createdAt
    ? new Date(publication.createdAt).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    })
    : "";

  // Medium-style: show partial content if not logged in
  const contentHtml = publication.content || "";
  const showPaywall = !isLoggedIn;

  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-16 px-4 flex flex-col items-center">
      <article className="w-full max-w-3xl mx-auto bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Header Image */}
        <div className="relative w-full h-64 md:h-80 bg-slate-100">
          {publication.image ? (
            <Image
              src={publication.image}
              alt={publication.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width:900px) 100vw, 900px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xl">No Image</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          {category && (
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold shadow-sm">
                {category}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 p-7 pt-6">
          <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-2 text-slate-900">
            {publication.title}
          </h1>

          {displayDate && (
            <div className="flex items-center gap-5 mb-2">
              <span className="text-xs text-slate-400 font-medium">{displayDate}</span>
            </div>
          )}

          {/* Author */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-11 h-11 border border-slate-100">
              {authorAvatar ? (
                <AvatarImage src={authorAvatar} alt={authorName} />
              ) : (
                <AvatarFallback className="bg-slate-100 text-slate-600 text-sm font-bold">
                  {getInitials(authorName)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col justify-center">
              <span className="text-sm font-bold text-slate-900 leading-tight">{authorName}</span>
              <span className="text-xs text-slate-400 font-medium capitalize">{authorRole}</span>
            </div>
          </div>

          {/* Content with Medium-style paywall */}
          <div className="relative">
            <section
              className={`prose md:prose-lg max-w-none text-slate-800 ${showPaywall ? "max-h-[400px] overflow-hidden" : ""}`}
            >
              <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
            </section>

            {/* Paywall gradient overlay */}
            {showPaywall && (
              <div className="absolute bottom-0 left-0 right-0">
                <div className="h-48 bg-gradient-to-t from-white via-white/95 to-transparent" />
                <div className="bg-white pt-2 pb-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Continue Reading</h3>
                  <p className="text-slate-500 mb-6 max-w-md mx-auto">
                    Log in or create a free account to read the full publication.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Link
                      href="/login"
                      className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/register"
                      className="px-8 py-3 bg-white text-primary border-2 border-primary/20 rounded-xl font-bold hover:border-primary/40 hover:-translate-y-0.5 transition-all"
                    >
                      Join Now
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer / Back */}
        <footer className="px-7 pt-0 pb-6">
          <Link
            href="/publication/naape"
            className="inline-flex items-center gap-1 text-primary text-sm font-bold hover:text-primary/80 transition-colors"
          >
            ← Back to Publications
          </Link>
        </footer>
      </article>
    </main>
  );
}
