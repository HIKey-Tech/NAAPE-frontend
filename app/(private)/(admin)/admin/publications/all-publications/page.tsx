"use client";
import React from "react";
import { PublicationTable } from "@/components/admin/components/table";
import { usePublications } from "@/hooks/usePublications";

const AllPublicationsPage: React.FC = () => {
    // Fetch all publications (no status filter means admin sees all)
    const { data: publications, isPending, error } = usePublications();

    return (
        <div className="max-w-full mx-auto w-full px-2 md:px-5 py-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[#16355D]">All Publications</h1>
            
            {isPending ? (
                <div className="py-24 flex justify-center items-center text-[#357AA8] text-lg">
                    Loading publications...
                </div>
            ) : error ? (
                <div className="py-24 flex justify-center items-center text-red-600 text-lg">
                    Failed to load publications. Please try again later.
                </div>
            ) : (
                <PublicationTable publications={publications || []} />
            )}
        </div>
    );
};

export default AllPublicationsPage;
