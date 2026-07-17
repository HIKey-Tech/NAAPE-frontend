"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import PublicationDetail from "@/components/ui/custom/publication.detail";
import { getSinglePublicationPublic, getSinglePublication } from "@/app/api/publication/publication";
import { useAuth } from "@/context/authcontext";

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
    <main className="min-h-screen bg-[#F8FAFC] pt-24 pb-10 px-2 sm:px-0 flex flex-col items-center">
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
    </main>
  );
}
