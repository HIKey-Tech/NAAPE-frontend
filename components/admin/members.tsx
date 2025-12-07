"use client";

import React, { useState } from "react";
import { MembersTable } from "./components/members.table";
import { useMembers } from "@/hooks/useMembers";
import { useMakeAdmin } from "@/hooks/useMakeAdmin";

const AdminMembersPage: React.FC = () => {
    const { data: members = [], isLoading, error: fetchError } = useMembers();
    const {
        mutate: makeAdmin,
        isPending,
        error: mutationError,
    } = useMakeAdmin();

    // State to track which member is currently being promoted to admin
    const [makingAdminId, setMakingAdminId] = useState<string | null>(null);

    const handleMakeAdmin = (memberId: string) => {
        setMakingAdminId(memberId);
        makeAdmin(memberId, {
            onSettled: () => {
                setMakingAdminId(null);
            },
        });
    };

    // Prefer a single "error" message either from mutation or fetch
    let errorMessage = "";
    if (mutationError) {
        errorMessage =
            typeof mutationError === "string"
                ? mutationError
                : (mutationError as any).message || "Failed to promote member.";
    } else if (fetchError) {
        errorMessage =
            typeof fetchError === "string"
                ? fetchError
                : (fetchError as any).message || "Failed to load members.";
    }

    return (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Page header */}
            <header className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-y-4 gap-x-8">
                <div className="flex-1">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-[#16355D] mb-2 leading-tight tracking-tight">
                        Members
                    </h1>
                    <p className="text-base sm:text-lg text-[#5E6C87] font-medium">
                        Manage your members, promote to admin, and see member details.
                    </p>
                </div>
            </header>
            {/* Error message */}
            {errorMessage && (
                <div className="mb-8 flex justify-center">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-3 rounded-xl shadow font-semibold flex items-center gap-3 transition-all animate-fade-in max-w-xl w-full">
                        <svg width="22" height="22" className="shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden>
                            <circle cx="10" cy="10" r="9" stroke="#E02E2E" strokeWidth="2" fill="#FEE2E2"/>
                            <path d="M10 6v4.5" stroke="#E02E2E" strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="10" cy="14" r="1" fill="#E02E2E"/>
                        </svg>
                        <span>{errorMessage}</span>
                    </div>
                </div>
            )}
            {/* Table card */}
            <section className="bg-white border border-[#e0e6ef] rounded-2xl shadow-sm px-2 sm:px-6 py-3 sm:py-6 transition-all">
                <MembersTable
                    members={members}
                    isLoading={isLoading}
                    onMakeAdmin={handleMakeAdmin}
                    makeAdminLoadingId={isPending ? makingAdminId : null}
                />
            </section>
        </div>
    );
};

export default AdminMembersPage;
