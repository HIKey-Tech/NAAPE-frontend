"use client";

import { AdminEventsLayout, EventSection } from "@/components/admin/events/AdminEventsLayout";
import AttendeeManagementSection from "@/components/admin/events/AttendeeManagementSection";
import { useAttendeeManagement } from "@/hooks/useAttendeeManagement";
import { useState } from "react";

export default function AttendeeManagementPage() {
    const [activeSection, setActiveSection] = useState<EventSection>(EventSection.ATTENDEES);
    
    const {
        events,
        attendees,
        selectedEventId,
        loading,
        error,
        setSelectedEventId,
        refreshAttendees,
        updateAttendeeAttendance,
        exportAttendees
    } = useAttendeeManagement();

    return (
        <AdminEventsLayout 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
        >
            <div className="px-4 sm:px-6 py-4 bg-white w-full">
                <AttendeeManagementSection
                    selectedEventId={selectedEventId}
                    events={events}
                    attendees={attendees}
                    onEventSelect={setSelectedEventId}
                    onExportAttendees={exportAttendees}
                    onUpdateAttendance={updateAttendeeAttendance}
                    loading={loading}
                    error={error}
                />
            </div>
        </AdminEventsLayout>
    );
}