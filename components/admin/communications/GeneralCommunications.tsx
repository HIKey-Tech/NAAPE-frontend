"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    FaEnvelope, 
    FaPaperPlane, 
    FaUsers, 
    FaHistory,
    FaSpinner,
    FaCheckCircle,
    FaExclamationCircle
} from "react-icons/fa";
import { useGeneralCommunications } from "@/hooks/useGeneralCommunications";
import { toast } from "sonner";

export function GeneralCommunications() {
    const {
        communicationHistory,
        memberCount,
        loading,
        sending,
        error,
        fetchCommunicationHistory,
        fetchMemberCount,
        sendBulkEmail
    } = useGeneralCommunications();

    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        fetchMemberCount();
        fetchCommunicationHistory();
    }, [fetchMemberCount, fetchCommunicationHistory]);

    const handleSendEmail = async () => {
        if (!subject.trim() || !content.trim()) {
            toast.error("Please fill in both subject and message");
            return;
        }

        try {
            await sendBulkEmail(subject, content);
            toast.success("Email sent successfully to all members!");
            
            // Reset form
            setSubject("");
            setContent("");
            
            // Show history
            setShowHistory(true);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to send email");
        }
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-gray-900">Communications</h1>
                <p className="text-gray-600">Send emails to all members</p>
            </div>

            {/* Member Count Card */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="flex items-center gap-4 py-6">
                    <div className="p-3 bg-blue-500 rounded-full">
                        <FaUsers className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Total Active Members</p>
                        <p className="text-3xl font-bold text-gray-900">
                            {loading ? "..." : memberCount.toLocaleString()}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Compose Email Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FaEnvelope className="h-5 w-5" />
                        Compose Email
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Subject */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Subject</label>
                        <Input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Enter email subject"
                            disabled={sending}
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Message</label>
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter your message content..."
                            rows={10}
                            disabled={sending}
                        />
                    </div>

                    {/* Recipient Info */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                        <FaUsers className="h-4 w-4" />
                        <span>
                            This email will be sent to all {memberCount} active members
                        </span>
                    </div>

                    {/* Send Button */}
                    <div className="flex justify-end gap-3">
                        <Button 
                            variant="outline"
                            onClick={() => setShowHistory(!showHistory)}
                            disabled={sending}
                        >
                            <FaHistory className="h-4 w-4 mr-2" />
                            {showHistory ? "Hide" : "Show"} History
                        </Button>
                        <Button 
                            onClick={handleSendEmail}
                            disabled={!subject.trim() || !content.trim() || sending}
                            className="flex items-center gap-2"
                        >
                            {sending ? (
                                <FaSpinner className="h-4 w-4 animate-spin" />
                            ) : (
                                <FaPaperPlane className="h-4 w-4" />
                            )}
                            {sending ? "Sending..." : "Send to All Members"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Communication History */}
            {showHistory && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FaHistory className="h-5 w-5" />
                            Communication History
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <FaSpinner className="h-8 w-8 animate-spin text-gray-400" />
                            </div>
                        ) : communicationHistory.length === 0 ? (
                            <div className="text-center py-8">
                                <FaHistory className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No History Yet</h3>
                                <p className="text-gray-500">
                                    Your sent emails will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {communicationHistory.map((comm) => (
                                    <div 
                                        key={comm._id} 
                                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{comm.subject}</h4>
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                    {comm.content}
                                                </p>
                                            </div>
                                            <Badge 
                                                variant={
                                                    comm.deliveryStatus === 'delivered' ? 'default' :
                                                    comm.deliveryStatus === 'failed' ? 'destructive' :
                                                    'secondary'
                                                }
                                                className="ml-4"
                                            >
                                                {comm.deliveryStatus === 'delivered' && (
                                                    <FaCheckCircle className="h-3 w-3 mr-1" />
                                                )}
                                                {comm.deliveryStatus === 'failed' && (
                                                    <FaExclamationCircle className="h-3 w-3 mr-1" />
                                                )}
                                                {comm.deliveryStatus}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                                            <span>
                                                Sent by: {comm.sentBy?.name || 'Unknown'}
                                            </span>
                                            <span>•</span>
                                            <span>
                                                Recipients: {comm.recipients.length}
                                            </span>
                                            <span>•</span>
                                            <span>
                                                {new Date(comm.sentAt).toLocaleString()}
                                            </span>
                                        </div>
                                        {comm.errorMessage && (
                                            <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                                                {comm.errorMessage}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
