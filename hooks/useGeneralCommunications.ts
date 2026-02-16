"use client";

import { useState, useCallback } from "react";
import axios from "@/lib/axios";

interface CommunicationHistory {
    _id: string;
    type: 'email' | 'sms' | 'push';
    subject: string;
    content: string;
    recipients: string[];
    sentBy: {
        _id: string;
        name: string;
        email: string;
    };
    sentAt: Date;
    deliveryStatus: 'sent' | 'delivered' | 'failed' | 'pending';
    errorMessage?: string;
}

interface UseGeneralCommunicationsReturn {
    communicationHistory: CommunicationHistory[];
    memberCount: number;
    loading: boolean;
    sending: boolean;
    error: string | null;
    
    fetchCommunicationHistory: () => Promise<void>;
    fetchMemberCount: () => Promise<void>;
    sendBulkEmail: (subject: string, content: string) => Promise<void>;
}

export function useGeneralCommunications(): UseGeneralCommunicationsReturn {
    const [communicationHistory, setCommunicationHistory] = useState<CommunicationHistory[]>([]);
    const [memberCount, setMemberCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch communication history
    const fetchCommunicationHistory = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.get('/admin/communications/history');
            setCommunicationHistory(response.data.communications || []);
        } catch (err: any) {
            console.error("Failed to fetch communication history:", err);
            setError(err.response?.data?.message || "Failed to fetch communication history");
            setCommunicationHistory([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch member count
    const fetchMemberCount = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.get('/admin/communications/member-count');
            setMemberCount(response.data.count || 0);
        } catch (err: any) {
            console.error("Failed to fetch member count:", err);
            setError(err.response?.data?.message || "Failed to fetch member count");
            setMemberCount(0);
        } finally {
            setLoading(false);
        }
    }, []);

    // Send bulk email
    const sendBulkEmail = async (subject: string, content: string) => {
        setSending(true);
        setError(null);
        
        try {
            const response = await axios.post('/admin/communications/send-bulk-email', {
                subject,
                content
            });
            
            // Refresh communication history after sending
            await fetchCommunicationHistory();
            
            return response.data;
        } catch (err: any) {
            console.error("Failed to send bulk email:", err);
            setError(err.response?.data?.message || "Failed to send bulk email");
            throw err;
        } finally {
            setSending(false);
        }
    };

    return {
        communicationHistory,
        memberCount,
        loading,
        sending,
        error,
        fetchCommunicationHistory,
        fetchMemberCount,
        sendBulkEmail
    };
}
