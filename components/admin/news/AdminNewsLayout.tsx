"use client";

import { useState } from "react";
import { FaChartLine, FaNewspaper, FaChartBar, FaComments } from "react-icons/fa";
import { NewsDashboardSection } from "./NewsDashboardSection";
import { NewsManagementSection } from "./NewsManagementSection";
import { NewsAnalyticsSection } from "./NewsAnalyticsSection";
import { CommentModerationSection } from "./CommentModerationSection";

const tabs = [
    { id: "dashboard", label: "Dashboard", icon: FaChartLine },
    { id: "management", label: "News Management", icon: FaNewspaper },
    { id: "analytics", label: "Analytics", icon: FaChartBar },
    { id: "comments", label: "Comment Moderation", icon: FaComments },
];

export default function AdminNewsLayout() {
    const [activeTab, setActiveTab] = useState("dashboard");

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">News Management</h1>
                <p className="text-slate-500 mt-1">Manage news articles, analytics, and comment moderation</p>
            </div>

            {/* Modern Tab Switcher */}
            <div className="bg-slate-100/80 rounded-2xl p-1.5 inline-flex gap-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${activeTab === tab.id
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div>
                {activeTab === "dashboard" && <NewsDashboardSection />}
                {activeTab === "management" && <NewsManagementSection />}
                {activeTab === "analytics" && <NewsAnalyticsSection />}
                {activeTab === "comments" && <CommentModerationSection />}
            </div>
        </div>
    );
}
