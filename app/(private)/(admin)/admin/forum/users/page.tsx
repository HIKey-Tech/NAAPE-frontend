"use client";

import React, { useState } from "react";
import { AdminForumLayout, ForumSection } from "@/components/admin/forum/AdminForumLayout";
import UserManagementSection from "@/components/admin/forum/UserManagementSection";

export default function ForumUsersPage() {
    const [activeSection, setActiveSection] = useState<ForumSection>(ForumSection.USERS);

    return (
        <AdminForumLayout 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
        >
            <div className="container mx-auto px-4 py-6">
                <UserManagementSection />
            </div>
        </AdminForumLayout>
    );
}