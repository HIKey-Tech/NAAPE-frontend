"use client";

import React, { useState } from "react";
import { MembersTable } from "./components/members.table";
import { useMembers } from "@/hooks/useMembers";

// Example: make member an admin (replace with real mutation API)
async function makeAdmin(memberId: string): Promise<void> {
    const res = await fetch(`/api/admin/members/${memberId}/make-admin`, {
        method: "POST",
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to make admin");
    }
}

const AdminMembersPage: React.FC = () => {
    const { data: members = [], isLoading, error: fetchError, refetch } = useMembers();
    const [makeAdminLoadingId, setMakeAdminLoadingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Handler for making a member admin
    const handleMakeAdmin = async (memberId: string) => {
        setMakeAdminLoadingId(memberId);
        setError(null);
        try {
            await makeAdmin(memberId);
            // Refetch members after promotion
            await refetch();
        } catch (err: any) {
            setError(err.message || "Failed to make admin.");
        } finally {
            setMakeAdminLoadingId(null);
        }
    };

    return (
        <div className="w-full max-w-full mx-auto px-2 py-8">
            <h1 className="text-2xl font-bold text-[#212B36] mb-6">Members</h1>
            {(error || fetchError) && (
                <div className="mb-4 text-red-500 text-[15px] font-medium">
                    {error || fetchError?.message || "Failed to load members."}
                </div>
            )}
            <MembersTable
                members={members}
                isLoading={isLoading}
                onMakeAdmin={handleMakeAdmin}
                makeAdminLoadingId={makeAdminLoadingId}
            />
        </div>
    );
};

export default AdminMembersPage;
