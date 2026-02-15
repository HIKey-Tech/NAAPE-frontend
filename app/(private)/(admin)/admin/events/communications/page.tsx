"use client";

import { AdminEventsLayout, EventSection } from "@/components/admin/events/AdminEventsLayout";
import { EventCommunicationsSection } from "@/components/admin/events/EventCommunicationsSection";
import { useEventCommunications } from "@/hooks/useEventCommunications";
import { useEvents } from "@/hooks/useEvents";
import { useState, useEffect } from "react";

export default function EventCommunicationsPage() {
    const [activeSection, setActiveSection] = useState<EventSection>(EventSection.COMMUNICATIONS);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    
    const {
        attendees,
        templates,
        communicationHistory,
        loading,
        error,
        fetchAttendees,
        fetchCommunicationHistory,
        sendBulkEmail,
        saveTemplate,
        updateTemplate,
        deleteTemplate
    } = useEventCommunications();
    
    const eventsQuery = useEvents();
    const events = eventsQuery.data?.events || [];

    // Load events on mount - they're automatically loaded by the query

    // Load attendees and communication history when event is selected
    useEffect(() => {
        if (selectedEventId) {
            fetchAttendees(selectedEventId);
            fetchCommunicationHistory(selectedEventId);
        }
    }, [selectedEventId]);

    const handleEventSelect = (eventId: string) => {
        setSelectedEventId(eventId);
    };

    const handleSendEmail = async (emailData: any) => {
        try {
            await sendBulkEmail(emailData);
            // Show success message or notification here
        } catch (error) {
            // Show error message or notification here
            console.error("Failed to send email:", error);
        }
    };

    const handleSaveTemplate = async (template: any) => {
        try {
            await saveTemplate(template);
            // Show success message or notification here
        } catch (error) {
            // Show error message or notification here
            console.error("Failed to save template:", error);
        }
    };

    const handleUpdateTemplate = async (id: string, template: any) => {
        try {
            await updateTemplate(id, template);
            // Show success message or notification here
        } catch (error) {
            // Show error message or notification here
            console.error("Failed to update template:", error);
        }
    };

    const handleDeleteTemplate = async (id: string) => {
        try {
            await deleteTemplate(id);
            // Show success message or notification here
        } catch (error) {
            // Show error message or notification here
            console.error("Failed to delete template:", error);
        }
    };

    return (
        <AdminEventsLayout 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
        >
            <div className="px-4 sm:px-6 py-4 bg-white w-full">
                <EventCommunicationsSection
                    selectedEventId={selectedEventId}
                    attendees={attendees}
                    templates={templates}
                    communicationHistory={communicationHistory}
                    onEventSelect={handleEventSelect}
                    onSendEmail={handleSendEmail}
                    onSaveTemplate={handleSaveTemplate}
                    onUpdateTemplate={handleUpdateTemplate}
                    onDeleteTemplate={handleDeleteTemplate}
                    loading={loading}
                    events={events}
                />
            </div>
        </AdminEventsLayout>
    );
}