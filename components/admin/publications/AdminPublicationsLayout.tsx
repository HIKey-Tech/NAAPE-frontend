"use client";
import React from "react";
import { PublicationStatsSection } from "./PublicationStatsSection";
import { PublicationManagementSection } from "./PublicationManagementSection";

export const AdminPublicationsLayout: React.FC = () => {
    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Publications Management</h1>
                    <p className="text-slate-500 mt-1">Review, approve, and manage all publications from members</p>
                </div>

                {/* Statistics */}
                <PublicationStatsSection />

                {/* Publications Table */}
                <PublicationManagementSection />
            </div>
        </div>
    );
};
