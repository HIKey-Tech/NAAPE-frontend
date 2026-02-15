"use client";

import { AdminEventsLayout, EventSection } from "@/components/admin/events/AdminEventsLayout";
import { EventSettingsSection } from "@/components/admin/events/EventSettingsSection";
import { useEventSettings } from "@/hooks/useEventSettings";
import { useState, useEffect } from "react";

export default function EventSettingsPage() {
    const [activeSection, setActiveSection] = useState<EventSection>(EventSection.SETTINGS);
    const {
        events,
        selectedEventId,
        eventSettings,
        loading,
        saving,
        error,
        loadEvents,
        selectEvent,
        updateSettings,
        setError
    } = useEventSettings();

    // Load events on component mount
    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    // Handle event selection
    const handleEventSelect = async (eventId: string) => {
        try {
            await selectEvent(eventId);
        } catch (err) {
            console.error('Error selecting event:', err);
        }
    };

    // Handle settings update
    const handleUpdateSettings = async (settings: any) => {
        try {
            await updateSettings(settings);
        } catch (err) {
            console.error('Error updating settings:', err);
            throw err; // Re-throw to let the component handle the error
        }
    };

    return (
        <AdminEventsLayout 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
        >
            <div className="px-4 sm:px-6 py-4 bg-white w-full">
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
                        <p className="text-red-700">{error}</p>
                        <button
                            onClick={() => setError(null)}
                            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                <EventSettingsSection
                    events={events}
                    selectedEventId={selectedEventId}
                    eventSettings={eventSettings}
                    onEventSelect={handleEventSelect}
                    onUpdateSettings={handleUpdateSettings}
                    loading={loading}
                    saving={saving}
                />
            </div>
        </AdminEventsLayout>
    );
}