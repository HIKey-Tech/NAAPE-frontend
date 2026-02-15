"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "@/lib/axios";

// Types
enum TemplateType {
    REMINDER = 'reminder',
    UPDATE = 'update',
    CONFIRMATION = 'confirmation',
    CANCELLATION = 'cancellation'
}

interface AttendeeData {
    userId: string;
    name: string;
    email: string;
    phone?: string;
    registrationDate: Date;
    paymentStatus: 'successful' | 'pending' | 'failed';
    attendanceStatus: 'registered' | 'checked_in' | 'attended' | 'no_show';
    profilePicture?: string;
}

interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    content: string;
    type: TemplateType;
    variables: string[];
    createdAt: Date;
    updatedAt: Date;
}

interface BulkEmailData {
    eventId: string;
    recipients: string[];
    subject: string;
    content: string;
    templateId?: string;
    sendToAll: boolean;
    filters?: {
        paymentStatus?: string[];
        attendanceStatus?: string[];
    };
}

interface CommunicationHistory {
    id: string;
    eventId: string;
    type: 'email' | 'sms' | 'push';
    subject: string;
    content: string;
    recipients: string[];
    sentBy: string;
    sentAt: Date;
    deliveryStatus: 'sent' | 'delivered' | 'failed' | 'pending';
    templateUsed?: string;
}

interface UseEventCommunicationsReturn {
    attendees: AttendeeData[];
    templates: EmailTemplate[];
    communicationHistory: CommunicationHistory[];
    loading: boolean;
    error: string | null;
    
    // Functions
    fetchAttendees: (eventId: string) => Promise<void>;
    fetchTemplates: () => Promise<void>;
    fetchCommunicationHistory: (eventId: string) => Promise<void>;
    sendBulkEmail: (emailData: BulkEmailData) => Promise<void>;
    saveTemplate: (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateTemplate: (id: string, template: Partial<EmailTemplate>) => Promise<void>;
    deleteTemplate: (id: string) => Promise<void>;
}

export function useEventCommunications(): UseEventCommunicationsReturn {
    const [attendees, setAttendees] = useState<AttendeeData[]>([]);
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [communicationHistory, setCommunicationHistory] = useState<CommunicationHistory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch attendees for a specific event
    const fetchAttendees = useCallback(async (eventId: string) => {
        if (!eventId) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.get(`/admin/events/${eventId}/attendees`);
            
            // Transform the response data to match our interface
            const transformedAttendees: AttendeeData[] = response.data.attendees.map((attendee: any) => ({
                userId: attendee.userId || attendee._id,
                name: attendee.name,
                email: attendee.email,
                phone: attendee.profile?.phone,
                registrationDate: new Date(attendee.registrationDate || attendee.createdAt),
                paymentStatus: attendee.paymentStatus || 'pending',
                attendanceStatus: attendee.attendanceStatus || 'registered',
                profilePicture: attendee.profile?.image?.url
            }));
            
            setAttendees(transformedAttendees);
        } catch (err: any) {
            console.error("Failed to fetch attendees:", err);
            setError(err.response?.data?.message || "Failed to fetch attendees");
            setAttendees([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch email templates
    const fetchTemplates = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.get('/admin/email-templates');
            setTemplates(response.data.templates || []);
        } catch (err: any) {
            console.error("Failed to fetch templates:", err);
            setError(err.response?.data?.message || "Failed to fetch templates");
            setTemplates([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch communication history for a specific event
    const fetchCommunicationHistory = useCallback(async (eventId: string) => {
        if (!eventId) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.get(`/admin/events/${eventId}/communications`);
            setCommunicationHistory(response.data.communications || []);
        } catch (err: any) {
            console.error("Failed to fetch communication history:", err);
            setError(err.response?.data?.message || "Failed to fetch communication history");
            setCommunicationHistory([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Send bulk email
    const sendBulkEmail = async (emailData: BulkEmailData) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post('/admin/events/send-bulk-email', emailData);
            
            // Refresh communication history after sending
            if (emailData.eventId) {
                await fetchCommunicationHistory(emailData.eventId);
            }
            
            return response.data;
        } catch (err: any) {
            console.error("Failed to send bulk email:", err);
            setError(err.response?.data?.message || "Failed to send bulk email");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Save new template
    const saveTemplate = async (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post('/admin/email-templates', template);
            
            // Add the new template to the list
            setTemplates(prev => [...prev, response.data.template]);
            
            return response.data;
        } catch (err: any) {
            console.error("Failed to save template:", err);
            setError(err.response?.data?.message || "Failed to save template");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update existing template
    const updateTemplate = async (id: string, template: Partial<EmailTemplate>) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.put(`/admin/email-templates/${id}`, template);
            
            // Update the template in the list
            setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...response.data.template } : t));
            
            return response.data;
        } catch (err: any) {
            console.error("Failed to update template:", err);
            setError(err.response?.data?.message || "Failed to update template");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete template
    const deleteTemplate = async (id: string) => {
        setLoading(true);
        setError(null);
        
        try {
            await axios.delete(`/admin/email-templates/${id}`);
            
            // Remove the template from the list
            setTemplates(prev => prev.filter(t => t.id !== id));
        } catch (err: any) {
            console.error("Failed to delete template:", err);
            setError(err.response?.data?.message || "Failed to delete template");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Load templates on mount
    useEffect(() => {
        fetchTemplates();
    }, []);

    return {
        attendees,
        templates,
        communicationHistory,
        loading,
        error,
        fetchAttendees,
        fetchTemplates,
        fetchCommunicationHistory,
        sendBulkEmail,
        saveTemplate,
        updateTemplate,
        deleteTemplate
    };
}