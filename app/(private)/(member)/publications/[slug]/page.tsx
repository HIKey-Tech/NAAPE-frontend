"use client";

import PublicationDetail from "@/components/member/component/publication.detail";

export default function PublicationDetailsPage({ params }: { params: { slug: string } }) {
    
    console.log("Slug from Publication Details Page", params)

    return (
        <div className="min-h-[500px] w-full flex items-center justify-center py-6 px-2">
            <PublicationDetail publicationId={params.slug} />
        </div>
    );
}
