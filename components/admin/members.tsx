"use client";

import React, { useState } from "react";
import { MembersTable } from "./components/members.table";
import { useMembers } from "@/hooks/useMembers";
import { useMakeAdmin } from "@/hooks/useMakeAdmin";
import { FaUsers, FaExclamationTriangle } from "react-icons/fa";

const AdminMembersPage: React.FC = () => {
    const { data: members = [], isLoading, error: fetchError } = useMembers();
    const { mutate: makeAdmin, isPending, error: mutationError } = useMakeAdmin();
    const [makingAdminId, setMakingAdminId] = useState<string | null>(null);

    const handleMakeAdmin = (memberId: string) => {
        setMakingAdminId(memberId);
        makeAdmin(memberId, { onSettled: () => setMakingAdminId(null) });
    };

    let errorMessage = "";
    if (mutationError) {
        errorMessage = typeof mutationError === "string" ? mutationError : (mutationError as any).message || "Failed to promote member.";
    } else if (fetchError) {
        errorMessage = typeof fetchError === "string" ? fetchError : (fetchError as any).message || "Failed to load members.";
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-primary/5 text-primary rounded-xl">
                        <FaUsers size={20} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Members</h1>
                </div>
                <p className="text-slate-500 text-base ml-[52px]">
                    Manage your members and promote to admin.
                </p>
            </div>

            {/* Error */}
            {errorMessage && (
                <div className="mb-6 flex items-center gap-3 bg-red-50 text-red-700 px-5 py-3.5 rounded-xl border border-red-100 text-sm font-medium">
                    <FaExclamationTriangle className="shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <MembersTable
                    members={members}
                    isLoading={isLoading}
                    onMakeAdmin={handleMakeAdmin}
                    makeAdminLoadingId={isPending ? makingAdminId : null}
                />
            </div>
        </div>
    );
};

export default AdminMembersPage;
