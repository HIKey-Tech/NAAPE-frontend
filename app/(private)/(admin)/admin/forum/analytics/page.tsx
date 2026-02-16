"use client";

import React, { useState } from "react";
import { AdminForumLayout, ForumSection } from "@/components/admin/forum/AdminForumLayout";
import ForumAnalyticsSection from "@/components/admin/forum/ForumAnalyticsSection";

export default function ForumAnalyticsPage() {
    const [activeSection, setActiveSection] = useState<ForumSection>(ForumSection.ANALYTICS);

    return (
        <AdminForumLayout 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
        >
            <div className="container mx-auto px-4 py-6">
                <ForumAnalyticsSection />
            </div>
        </AdminForumLayout>
    );
}