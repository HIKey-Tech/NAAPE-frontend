"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetSinglePublication } from "@/hooks/usePublications";
import EditPublicationComponent from "@/components/member/publications/edit.publication";

export default function EditPublicationPage() {
    const params = useParams<{ publicationId: string }>();
    const router = useRouter();
    const { data: publication, isLoading, error } = useGetSinglePublication(params.publicationId);

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#15407c] border-t-transparent" />
                <span className="ml-3 text-lg">Loading publication...</span>
            </div>
        );
    }

    if (error || !publication) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg font-semibold">Publication not found</p>
                    <button
                        onClick={() => router.push("/publications")}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to My Publications
                    </button>
                </div>
            </div>
        );
    }

    return <EditPublicationComponent publication={publication} />;
}
