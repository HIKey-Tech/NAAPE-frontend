"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsDashboardSection } from "./NewsDashboardSection";
import { NewsManagementSection } from "./NewsManagementSection";
import { NewsAnalyticsSection } from "./NewsAnalyticsSection";
import { CommentModerationSection } from "./CommentModerationSection";

export default function AdminNewsLayout() {
    const [activeTab, setActiveTab] = useState("dashboard");

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">News Management</h1>
                <p className="text-muted-foreground mt-2">
                    Manage news articles, analytics, and comment moderation
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="management">News Management</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="comments">Comment Moderation</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="space-y-6">
                    <NewsDashboardSection />
                </TabsContent>

                <TabsContent value="management" className="space-y-6">
                    <NewsManagementSection />
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                    <NewsAnalyticsSection />
                </TabsContent>

                <TabsContent value="comments" className="space-y-6">
                    <CommentModerationSection />
                </TabsContent>
            </Tabs>
        </div>
    );
}
