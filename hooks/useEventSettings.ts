import { useState, useCallback } from 'react';
import { getEventsForAttendeeManagement, getEventSettings, updateEventSettings } from '@/app/api/events/events';
import { EventSettings } from '@/components/admin/events/EventSettingsSection';

interface EventSummary {
    _id: string;
    title: string;
    date: Date;
    registeredCount: number;
    isPaid: boolean;
    price: number;
}

export function useEventSettings() {
    const [events, setEvents] = useState<EventSummary[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [eventSettings, setEventSettings] = useState<EventSettings | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load events list
    const loadEvents = useCallback(async () => {
        console.log('loadEvents called');
        setLoading(true);
        setError(null);
        try {
            console.log('Calling getEventsForAttendeeManagement...');
            const response = await getEventsForAttendeeManagement();
            console.log('Events API response:', response);
            
            if (response.success) {
                const eventsData = response.data || [];
                console.log('Setting events:', eventsData);
                setEvents(eventsData);
            } else {
                console.error('API response not successful:', response);
                throw new Error(response.message || 'Failed to load events');
            }
        } catch (err: any) {
            console.error('Error in loadEvents:', err);
            setError(err.message || 'Failed to load events');
        } finally {
            setLoading(false);
        }
    }, []);

    // Load settings for a specific event
    const loadEventSettings = useCallback(async (eventId: string) => {
        if (!eventId) return;
        
        setLoading(true);
        setError(null);
        try {
            const response = await getEventSettings(eventId);
            if (response.success && response.data) {
                setEventSettings(response.data);
            } else {
                // If no settings exist, create default settings
                const defaultSettings: EventSettings = {
                    eventId,
                    maxCapacity: undefined,
                    isPremiumOnly: false,
                    registrationDeadline: undefined,
                    allowWaitlist: false,
                    requireApproval: false,
                    customFields: [],
                    notifications: {
                        sendReminders: true,
                        reminderDays: [7, 1],
                        sendUpdates: true,
                        sendConfirmations: true
                    },
                    version: 1,
                    lastModified: new Date()
                };
                setEventSettings(defaultSettings);
            }
        } catch (err: any) {
            // If settings don't exist (404), create default settings
            if (err.message.includes('404') || err.message.includes('not found')) {
                const defaultSettings: EventSettings = {
                    eventId,
                    maxCapacity: undefined,
                    isPremiumOnly: false,
                    registrationDeadline: undefined,
                    allowWaitlist: false,
                    requireApproval: false,
                    customFields: [],
                    notifications: {
                        sendReminders: true,
                        reminderDays: [7, 1],
                        sendUpdates: true,
                        sendConfirmations: true
                    },
                    version: 1,
                    lastModified: new Date()
                };
                setEventSettings(defaultSettings);
            } else {
                setError(err.message || 'Failed to load event settings');
                console.error('Error loading event settings:', err);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // Select an event and load its settings
    const selectEvent = useCallback(async (eventId: string) => {
        setSelectedEventId(eventId);
        await loadEventSettings(eventId);
    }, [loadEventSettings]);

    // Update event settings
    const updateSettings = useCallback(async (settings: EventSettings) => {
        setSaving(true);
        setError(null);
        try {
            const response = await updateEventSettings(settings.eventId, settings);
            if (response.success) {
                setEventSettings(settings);
                return response;
            } else {
                throw new Error(response.message || 'Failed to update settings');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to update settings');
            throw err;
        } finally {
            setSaving(false);
        }
    }, []);

    return {
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
    };
}