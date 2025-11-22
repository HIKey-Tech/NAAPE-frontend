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
        <div className="w-full max-w-full mx-auto px-2 py-8">
            <h1 className="text-2xl font-bold text-[#212B36] mb-6">Members</h1>
            {errorMessage && (
                <div className="mb-4 text-red-500 text-[15px] font-medium">
                    {errorMessage}
                </div>
            )}
            <MembersTable
                members={members}
                isLoading={isLoading}
                onMakeAdmin={handleMakeAdmin}
                makeAdminLoadingId={isPending ? makingAdminId : null}
            />
        </div>
    );
};

export default AdminMembersPage;
