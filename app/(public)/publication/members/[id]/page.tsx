"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import PublicationDetail from "@/components/ui/custom/publication.detail";

// Dummy data source for publications; in production use a data fetcher/API.
const PUBLICATIONS: Array<{
  id: string;
  imageUrl: string;
  title: string;
  summary?: string;
  content: string;
  authorName: string;
  authorRole?: string;
  authorAvatarUrl?: string;
  category?: string;
  publishedDate?: string;
}> = [
  {
    id: "safety-protocols",
    imageUrl: "/images/event1.jpg",
    title: "Safety Protocols in Modern Aviation",
    summary: "A deep dive into protocols ensuring flight safety in today's advanced aviation sector.",
    content: `<p>This article examines crucial safety measures adopted in the modern aviation industry, highlighting real-world implementation and continuous improvement strategies. From pre-flight checks to emergency protocols, pilots and engineers share insights into best practices.</p>
      <ul>
        <li>Detailed walkthroughs of mandatory safety checklists</li>
        <li>Recent case studies of incident prevention</li>
        <li>Recommendations for continuous safety education</li>
      </ul>
      <p>Adherence to robust safety protocols has cemented the reputation of aviation as the safest mode of transport globally.</p>`,
    authorName: "Jane Doe",
    authorRole: "Pilot",
    authorAvatarUrl: "/images/leader.png",
    category: "Safety",
    publishedDate: "2024-03-21"
  },
  {
    id: "maintaining-avionics",
    imageUrl: "/images/plane.jpg",
    title: "Maintaining Avionics: A Modern Perspective",
    summary: "Best practices for avionics maintenance based on latest industry research.",
    content: `<p>Modern avionics systems require a blend of traditional discipline and up-to-date digital knowhow. This article covers:</p>
      <ol>
        <li>Diagnostic tools for digital avionics suites</li>
        <li>Maintenance log workflows and software</li>
        <li>How to keep up with evolving OEM guidance</li>
      </ol>
      <p>Featuring expert interviews and actionable maintenance checklists for engineers.</p>`,
    authorName: "Engr. Ifeanyi Okeke",
    authorRole: "Avionics Engineer",
    authorAvatarUrl: "/images/leader.png",
    category: "Avionics",
    publishedDate: "2023-12-17"
  }
];

// Util to fetch publication by id
function getPublicationById(id: string | undefined) {
  if (!id) return null;
  return PUBLICATIONS.find((p) => p.id === id) || null;
}

export default function MemberPublicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  // Next.js dynamic route params: [id]
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const publication = useMemo(() => getPublicationById(id), [id]);

  if (!publication) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#F8FAFC]">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold mb-2 text-[#2852B4]">Publication not found</h1>
          <p className="mb-6 text-gray-500">
            Sorry, we couldn't find that publication.
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
        imageUrl={publication.imageUrl}
        title={publication.title}
        summary={publication.summary}
        content={publication.content}
        authorName={publication.authorName}
        authorRole={publication.authorRole}
        authorAvatarUrl={publication.authorAvatarUrl}
        category={publication.category}
        publishedDate={publication.publishedDate}
        backHref="/publication/members"
      />
    </main>
  );
}
