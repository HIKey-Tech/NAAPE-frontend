"use client";

import React, { useState } from "react";
import { AdminForumLayout, ForumSection } from "@/components/admin/forum/AdminForumLayout";
import ForumDashboardSection from "@/components/admin/forum/ForumDashboardSection";

export default function ForumDashboardPage() {
    const [activeSection, setActiveSection] = useState<ForumSection>(ForumSection.DASHBOARD);

    return (
        <AdminForumLayout 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
        >
            <div className="container mx-auto px-4 py-6">
                <ForumDashboardSection />
            </div>
        </AdminForumLayout>
    );
}