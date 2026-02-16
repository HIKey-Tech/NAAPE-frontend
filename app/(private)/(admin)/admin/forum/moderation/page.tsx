"use client";

import React, { useState } from "react";
import { AdminForumLayout, ForumSection } from "@/components/admin/forum/AdminForumLayout";
import ThreadModerationSection from "@/components/admin/forum/ThreadModerationSection";

export default function ForumModerationPage() {
    const [activeSection, setActiveSection] = useState<ForumSection>(ForumSection.MODERATION);

    return (
        <AdminForumLayout 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
        >
            <div className="container mx-auto px-4 py-6">
                <ThreadModerationSection />
            </div>
        </AdminForumLayout>
    );
}