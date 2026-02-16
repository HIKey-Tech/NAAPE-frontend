"use client";

import React, { useState } from "react";
import { AdminForumLayout, ForumSection } from "@/components/admin/forum/AdminForumLayout";
import CategoryManagementSection from "@/components/admin/forum/CategoryManagementSection";

export default function ForumCategoriesPage() {
    const [activeSection, setActiveSection] = useState<ForumSection>(ForumSection.CATEGORIES);

    return (
        <AdminForumLayout 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
        >
            <div className="container mx-auto px-4 py-6">
                <CategoryManagementSection />
            </div>
        </AdminForumLayout>
    );
}