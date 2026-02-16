"use client";

import React, { useState } from "react";
import { AdminForumLayout, ForumSection } from "@/components/admin/forum/AdminForumLayout";
import ReportManagementSection from "@/components/admin/forum/ReportManagementSection";

export default function ForumReportsPage() {
    const [activeSection, setActiveSection] = useState<ForumSection>(ForumSection.REPORTS);

    return (
        <AdminForumLayout 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
        >
            <div className="container mx-auto px-4 py-6">
                <ReportManagementSection />
            </div>
        </AdminForumLayout>
    );
}