"use client";
import React from "react";
import { PublicationStatsSection } from "./PublicationStatsSection";
import { PublicationManagementSection } from "./PublicationManagementSection";

export const AdminPublicationsLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Publications Management</h1>
                    <p className="text-gray-600 mt-1">
                        Review, approve, and manage all publications from members
                    </p>
                </div>

                {/* Statistics */}
                <PublicationStatsSection />

                {/* Publications Table */}
                <PublicationManagementSection />
            </div>
        </div>
    );
};
