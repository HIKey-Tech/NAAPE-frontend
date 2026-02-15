"use client";

import { AdminEventsLayout, EventSection } from "@/components/admin/events/AdminEventsLayout";
import { EventCommunicationsSection } from "@/components/admin/events/EventCommunicationsSection";
import { useEventCommunications } from "@/hooks/useEventCommunications";
import { useEvents } from "@/hooks/useEvents";
import { useState, useEffect } from "react";
import { toast } from "sonner";

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
    const events = eventsQuery.data || [];

    // Log any errors with events loading
    if (eventsQuery.error) {
        console.error("Failed to load events:", eventsQuery.error);
    }

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
            toast.success("Email sent successfully!", {
                description: `Email sent to ${emailData.sendToAll ? 'all attendees' : `${emailData.recipients?.length || 0} recipients`}`,
                duration: 5000,
            });
        } catch (error: any) {
            toast.error("Failed to send email", {
                description: error.message || "An error occurred while sending the email",
                duration: 5000,
            });
            console.error("Failed to send email:", error);
        }
    };

    const handleSaveTemplate = async (template: any) => {
        try {
            await saveTemplate(template);
            toast.success("Template saved successfully!", {
                description: `Template "${template.name}" has been created`,
                duration: 4000,
            });
        } catch (error: any) {
            toast.error("Failed to save template", {
                description: error.message || "An error occurred while saving the template",
                duration: 5000,
            });
            console.error("Failed to save template:", error);
        }
    };

    const handleUpdateTemplate = async (id: string, template: any) => {
        try {
            await updateTemplate(id, template);
            toast.success("Template updated successfully!", {
                description: `Template has been updated`,
                duration: 4000,
            });
        } catch (error: any) {
            toast.error("Failed to update template", {
                description: error.message || "An error occurred while updating the template",
                duration: 5000,
            });
            console.error("Failed to update template:", error);
        }
    };

    const handleDeleteTemplate = async (id: string) => {
        try {
            await deleteTemplate(id);
            toast.success("Template deleted successfully!", {
                description: "The template has been removed",
                duration: 4000,
            });
        } catch (error: any) {
            toast.error("Failed to delete template", {
                description: error.message || "An error occurred while deleting the template",
                duration: 5000,
            });
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