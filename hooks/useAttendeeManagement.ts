import { useState, useEffect, useCallback } from 'react';
import { 
    getEventsForAttendeeManagement, 
    getEventAttendees, 
    updateAttendeeAttendance as updateAttendeeAttendanceAPI,
    exportEventAttendees as exportEventAttendeesAPI
} from '@/app/api/events/events';
import { AttendeeData, EventSummary, AttendanceStatus, ExportFormat } from '@/components/admin/events/AttendeeManagementSection';
import { exportToExcel } from '@/lib/exportUtils';

interface UseAttendeeManagementReturn {
    events: EventSummary[];
    attendees: AttendeeData[];
    selectedEventId: string | null;
    loading: boolean;
    error: string | null;
    setSelectedEventId: (eventId: string | null) => void;
    refreshAttendees: () => Promise<void>;
    updateAttendeeAttendance: (attendeeId: string, status: AttendanceStatus) => Promise<void>;
    exportAttendees: (eventId: string, format: ExportFormat, filters?: any) => Promise<void>;
}

export function useAttendeeManagement(): UseAttendeeManagementReturn {
    const [events, setEvents] = useState<EventSummary[]>([]);
    const [attendees, setAttendees] = useState<AttendeeData[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch events summary on mount
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getEventsForAttendeeManagement();
                setEvents(response.events || []);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch events');
                console.error('Error fetching events:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Fetch attendees when event is selected
    const refreshAttendees = useCallback(async () => {
        if (!selectedEventId) {
            setAttendees([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await getEventAttendees(selectedEventId);
            setAttendees(response.attendees || []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch attendees');
            console.error('Error fetching attendees:', err);
        } finally {
            setLoading(false);
        }
    }, [selectedEventId]);

    useEffect(() => {
        refreshAttendees();
    }, [refreshAttendees]);

    // Update attendee attendance status
    const updateAttendeeAttendance = useCallback(async (attendeeId: string, status: AttendanceStatus) => {
        if (!selectedEventId) return;

        try {
            await updateAttendeeAttendanceAPI(selectedEventId, attendeeId, status);
            
            // Update local state
            setAttendees(prev => prev.map(attendee => 
                attendee.userId === attendeeId 
                    ? { ...attendee, attendanceStatus: status }
                    : attendee
            ));
        } catch (err: any) {
            setError(err.message || 'Failed to update attendance status');
            console.error('Error updating attendance:', err);
            throw err;
        }
    }, [selectedEventId]);

    // Export attendees with enhanced functionality
    const exportAttendees = useCallback(async (eventId: string, format: ExportFormat, filters?: any) => {
        try {
            if (format === ExportFormat.CSV) {
                // Use backend CSV export
                await exportEventAttendeesAPI(eventId, 'csv', filters);
            } else {
                // Use frontend Excel export with enhanced features
                const response = await exportEventAttendeesAPI(eventId, 'excel', filters);
                
                if (response.success && response.data) {
                    exportToExcel(response.data, {
                        filename: response.filename || `attendees_${eventId}.xlsx`,
                        sheetName: 'Event Attendees',
                        eventTitle: response.eventTitle,
                        totalAttendees: response.totalAttendees,
                        exportDate: response.exportDate
                    });
                }
            }
        } catch (err: any) {
            setError(err.message || 'Failed to export attendees');
            console.error('Error exporting attendees:', err);
            throw err;
        }
    }, []);

    // Handle event selection
    const handleEventSelect = useCallback((eventId: string | null) => {
        setSelectedEventId(eventId);
        setError(null);
    }, []);

    return {
        events,
        attendees,
        selectedEventId,
        loading,
        error,
        setSelectedEventId: handleEventSelect,
        refreshAttendees,
        updateAttendeeAttendance,
        exportAttendees
    };
}