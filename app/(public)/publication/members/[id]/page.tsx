"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import PublicationDetail from "@/components/ui/custom/publication.detail";
import { getSinglePublicationPublic, getSinglePublication } from "@/app/api/publication/publication";
import { useAuth } from "@/context/authcontext";
import { NaapButton } from "@/components/ui/custom/button.naap";

interface Publication {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  image?: string;
  author: {
    name: string;
    role: string;
    email: string;
  };
  category?: string;
  createdAt: string;
  isPreview?: boolean;
  requiresSubscription?: boolean;
}

export default function MemberPublicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Next.js dynamic route params: [id]
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  useEffect(() => {
    const fetchPublication = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Use authenticated API if user is logged in, otherwise use public API
        const data = user 
          ? await getSinglePublication(id)
          : await getSinglePublicationPublic(id);
        setPublication(data);
      } catch (err: any) {
        console.error("Failed to fetch publication:", err);
        setError(err.response?.data?.message || "Failed to load publication");
      } finally {
        setLoading(false);
      }
    };

    fetchPublication();
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#F8FAFC]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-600">Loading publication...</p>
      </div>
    );
  }

  if (error || !publication) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#F8FAFC]">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold mb-2 text-[#2852B4]">Publication not found</h1>
          <p className="mb-6 text-gray-500">
            {error || "Sorry, we couldn't find that publication."}
          </p>
          <button
            className="bg-[#2043A2] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#183077] transition-colors"
            onClick={() => router.push("/publication/members")}
          >
            Back to Publications
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-10 px-2 sm:px-0 flex flex-col items-center">
      <PublicationDetail
        imageUrl={publication.image || "/images/plane.jpg"}
        title={publication.title}
        summary={publication.summary}
        content={publication.content}
        authorName={publication.author?.name || "NAAPE Member"}
        authorRole={publication.author?.role || "Member"}
        authorAvatarUrl="/images/leader.png"
        category={publication.category}
        publishedDate={publication.createdAt}
        backHref="/publication/members"
      />
      
      {/* Premium Access Prompt */}
      {publication.isPreview && publication.requiresSubscription && (
        <div className="w-full max-w-3xl mx-auto mt-8 bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-3">
            Continue Reading with Premium Access
          </h3>
          <p className="text-slate-600 mb-6">
            This is a preview of the full publication. Sign in or subscribe to read the complete article and access our full library of member publications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <NaapButton
                  variant="primary"
                  onClick={() => router.push("/login")}
                  className="px-6 py-3 rounded-lg font-semibold"
                >
                  Sign In
                </NaapButton>
                <NaapButton
                  variant="ghost"
                  onClick={() => router.push("/register")}
                  className="px-6 py-3 rounded-lg font-semibold"
                >
                  Create Account
                </NaapButton>
              </>
            ) : (
              <NaapButton
                variant="primary"
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3 rounded-lg font-semibold"
              >
                Upgrade to Premium
              </NaapButton>
            )}
          </div>
        </div>
      )}
    </main>
  );
}