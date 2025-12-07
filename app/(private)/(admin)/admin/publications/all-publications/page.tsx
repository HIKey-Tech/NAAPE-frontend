"use client";
import React from "react";
import { PublicationTable } from "@/components/admin/components/table";
import { usePublications } from "@/hooks/usePublications";

const AllPublicationsPage: React.FC = () => {
    const { data: publications, isPending, error } = usePublications();

    return (
        <main className="max-w-screen-xl mx-auto w-full px-2 md:px-6 py-10">
            <header className="mb-8 border-b border-slate-200 pb-4 flex flex-col gap-2">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#16355D]">
                    All Publications
                </h1>
                <p className="text-base text-slate-500 font-medium">
                    Review, manage, and filter all submissions from the system.
                </p>
            </header>
            <section>
                {isPending ? (
                    <div className="py-20 flex justify-center items-center text-[#357AA8] text-lg font-medium border border-slate-100 rounded-md bg-slate-50">
                        Loading publications...
                    </div>
                ) : error ? (
                    <div className="py-20 flex justify-center items-center text-red-600 text-lg font-medium border border-red-100 rounded-md bg-red-50">
                        Failed to load publications. Please try again later.
                    </div>
                ) : (
                    <div className="border border-slate-200 rounded-lg bg-white">
                        <PublicationTable publications={publications || []} />
                    </div>
                )}
            </section>
        </main>
    );
};

export default AllPublicationsPage;
