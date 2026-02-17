"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    FaEnvelope,
    FaPaperPlane,
    FaUsers,
    FaHistory,
    FaSpinner,
    FaCheckCircle,
    FaExclamationCircle,
    FaClock
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
            setSubject("");
            setContent("");
            setShowHistory(true);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to send email");
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-primary/5 text-primary rounded-xl">
                        <FaEnvelope size={20} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Communications</h1>
                </div>
                <p className="text-slate-500 ml-[52px]">Send emails to all members.</p>
            </div>

            {/* Member Count Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-5">
                <div className="p-3.5 bg-primary/5 text-primary rounded-xl">
                    <FaUsers size={24} />
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Active Members</p>
                    <p className="text-3xl font-black text-slate-800 tracking-tight mt-0.5">
                        {loading ? "..." : memberCount.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Compose Email */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="p-6 border-b border-slate-50">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <FaPaperPlane className="text-primary" size={16} /> Compose Email
                    </h2>
                </div>
                <div className="p-6 space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Subject</label>
                        <Input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Enter email subject"
                            disabled={sending}
                            className="bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Message</label>
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter your message content..."
                            rows={10}
                            disabled={sending}
                            className="bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10"
                        />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-primary bg-primary/5 px-4 py-3 rounded-xl border border-primary/10">
                        <FaUsers size={14} />
                        <span className="font-medium">This email will be sent to all <strong>{memberCount}</strong> active members</span>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowHistory(!showHistory)}
                            disabled={sending}
                            className="rounded-xl border-slate-200 text-slate-600"
                        >
                            <FaHistory className="mr-2" size={14} />
                            {showHistory ? "Hide" : "Show"} History
                        </Button>
                        <Button
                            onClick={handleSendEmail}
                            disabled={!subject.trim() || !content.trim() || sending}
                            className="rounded-xl bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
                        >
                            {sending ? <FaSpinner className="mr-2 animate-spin" size={14} /> : <FaPaperPlane className="mr-2" size={14} />}
                            {sending ? "Sending..." : "Send to All Members"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Communication History */}
            {showHistory && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="p-6 border-b border-slate-50">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <FaHistory className="text-slate-400" size={16} /> History
                        </h2>
                    </div>
                    <div className="p-6">
                        {loading ? (
                            <div className="flex items-center justify-center py-12 text-slate-400">
                                <FaSpinner className="animate-spin text-xl" />
                            </div>
                        ) : communicationHistory.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaHistory className="text-xl text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-700 mb-1">No History Yet</h3>
                                <p className="text-sm text-slate-400">Your sent emails will appear here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {communicationHistory.map((comm) => (
                                    <div key={comm._id} className="rounded-xl border border-slate-100 p-5 hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm text-slate-800 truncate">{comm.subject}</h4>
                                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{comm.content}</p>
                                            </div>
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${comm.deliveryStatus === 'delivered'
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                    : comm.deliveryStatus === 'failed'
                                                        ? 'bg-red-50 text-red-700 border border-red-100'
                                                        : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {comm.deliveryStatus === 'delivered' && <FaCheckCircle size={10} />}
                                                {comm.deliveryStatus === 'failed' && <FaExclamationCircle size={10} />}
                                                {comm.deliveryStatus}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-3 flex-wrap">
                                            <span className="flex items-center gap-1"><FaUsers size={10} /> {comm.recipients.length} recipients</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1"><FaClock size={10} /> {new Date(comm.sentAt).toLocaleString()}</span>
                                            <span>•</span>
                                            <span>By {comm.sentBy?.name || 'Unknown'}</span>
                                        </div>
                                        {comm.errorMessage && (
                                            <div className="mt-3 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100">{comm.errorMessage}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
