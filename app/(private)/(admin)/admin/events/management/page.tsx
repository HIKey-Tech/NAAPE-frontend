"use client";

import { AdminEventsLayout, EventSection } from "@/components/admin/events/AdminEventsLayout";
import EventManagementSection from "@/components/admin/events/EventManagementSection";
import CreateEvent from "@/components/admin/event/create.event";
import { useState } from "react";

export default function EventManagementPage() {
    const [activeSection, setActiveSection] = useState<EventSection>(EventSection.MANAGEMENT);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const handleCreateEvent = () => {
        setShowCreateForm(true);
    };

    const handleBackToList = () => {
        setShowCreateForm(false);
    };

    return (
        <AdminEventsLayout 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
        >
            <div className="px-4 sm:px-6 py-4 bg-white w-full min-h-screen">
                {showCreateForm ? (
                    <div>
                        <div className="mb-4">
                            <button
                                onClick={handleBackToList}
                                className="text-primary hover:text-primary/80 font-medium flex items-center gap-2"
                            >
                                ← Back to Event Management
                            </button>
                        </div>
                        <CreateEvent />
                    </div>
                ) : (
                    <EventManagementSection onCreateEvent={handleCreateEvent} />
                )}
            </div>
        </AdminEventsLayout>
    );
}