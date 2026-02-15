"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
    FaEnvelope, 
    FaPaperPlane, 
    FaUsers, 
    FaFilter, 
    FaFileAlt,
    FaHistory,
    FaEye,
    FaEdit,
    FaTrash,
    FaPlus,
    FaSave,
    FaSpinner
} from "react-icons/fa";

// Types based on design document
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

enum TemplateType {
    REMINDER = 'reminder',
    UPDATE = 'update',
    CONFIRMATION = 'confirmation',
    CANCELLATION = 'cancellation'
}

interface BulkEmailData {
    eventId: string;
    recipients: string[];
    subject: string;
    content: string;
    templateId?: string;
    sendToAll: boolean;
    filters?: RecipientFilters;
}

interface RecipientFilters {
    paymentStatus?: string[];
    attendanceStatus?: string[];
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

interface EventCommunicationsSectionProps {
    selectedEventId: string | null;
    attendees: AttendeeData[];
    templates: EmailTemplate[];
    communicationHistory: CommunicationHistory[];
    onEventSelect: (eventId: string) => void;
    onSendEmail: (emailData: BulkEmailData) => Promise<void>;
    onSaveTemplate: (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    onUpdateTemplate: (id: string, template: Partial<EmailTemplate>) => Promise<void>;
    onDeleteTemplate: (id: string) => Promise<void>;
    loading?: boolean;
    events?: Array<{ _id: string; title: string; date: Date }>;
}

export function EventCommunicationsSection({
    selectedEventId,
    attendees,
    templates,
    communicationHistory,
    onEventSelect,
    onSendEmail,
    onSaveTemplate,
    onUpdateTemplate,
    onDeleteTemplate,
    loading = false,
    events = []
}: EventCommunicationsSectionProps) {
    const [activeTab, setActiveTab] = useState("compose");
    const [emailData, setEmailData] = useState<Partial<BulkEmailData>>({
        subject: "",
        content: "",
        sendToAll: true,
        recipients: [],
        filters: {}
    });
    const [selectedTemplate, setSelectedTemplate] = useState<string>("");
    const [recipientFilters, setRecipientFilters] = useState<RecipientFilters>({});
    const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
    const [newTemplate, setNewTemplate] = useState<Partial<EmailTemplate>>({
        name: "",
        subject: "",
        content: "",
        type: TemplateType.REMINDER,
        variables: []
    });
    const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
    const [sending, setSending] = useState(false);

    // Filter attendees based on current filters
    const filteredAttendees = useMemo(() => {
        return attendees.filter(attendee => {
            if (recipientFilters.paymentStatus?.length && 
                !recipientFilters.paymentStatus.includes(attendee.paymentStatus)) {
                return false;
            }
            if (recipientFilters.attendanceStatus?.length && 
                !recipientFilters.attendanceStatus.includes(attendee.attendanceStatus)) {
                return false;
            }
            return true;
        });
    }, [attendees, recipientFilters]);

    // Update recipients when filters change
    useEffect(() => {
        if (emailData.sendToAll || false) {
            setSelectedRecipients(filteredAttendees.map(a => a.email));
        }
    }, [filteredAttendees, emailData.sendToAll]);

    // Apply template to email composition
    const applyTemplate = (templateId: string) => {
        const template = templates.find(t => t.id === templateId);
        if (template) {
            setEmailData(prev => ({
                ...prev,
                subject: template.subject,
                content: template.content,
                templateId: template.id
            }));
        }
    };

    // Handle sending email
    const handleSendEmail = async () => {
        if (!selectedEventId || !emailData.subject || !emailData.content) {
            return;
        }

        setSending(true);
        try {
            await onSendEmail({
                eventId: selectedEventId,
                recipients: emailData.sendToAll ? filteredAttendees.map(a => a.email) : selectedRecipients,
                subject: emailData.subject,
                content: emailData.content,
                templateId: selectedTemplate || undefined,
                sendToAll: emailData.sendToAll || false,
                filters: recipientFilters
            });
            
            // Reset form
            setEmailData({
                subject: "",
                content: "",
                sendToAll: true,
                recipients: [],
                filters: {}
            });
            setSelectedTemplate("");
            setRecipientFilters({});
            
            // Switch to history tab to show the sent email
            setTimeout(() => {
                setActiveTab("history");
            }, 1000);
            
        } catch (error) {
            console.error("Failed to send email:", error);
        } finally {
            setSending(false);
        }
    };

    // Handle saving template
    const handleSaveTemplate = async () => {
        if (!newTemplate.name || !newTemplate.subject || !newTemplate.content) {
            return;
        }

        try {
            await onSaveTemplate({
                name: newTemplate.name,
                subject: newTemplate.subject,
                content: newTemplate.content,
                type: newTemplate.type || TemplateType.REMINDER,
                variables: extractVariables(newTemplate.content || "")
            });
            
            // Reset form and switch back to templates tab
            setNewTemplate({
                name: "",
                subject: "",
                content: "",
                type: TemplateType.REMINDER,
                variables: []
            });
            
            // Switch back to templates tab
            setTimeout(() => {
                setActiveTab("templates");
            }, 500);
            
        } catch (error) {
            console.error("Failed to save template:", error);
        }
    };

    // Extract variables from template content
    const extractVariables = (content: string): string[] => {
        const matches = content.match(/\{\{(\w+)\}\}/g);
        return matches ? matches.map(match => match.slice(2, -2)) : [];
    };

    // Substitute variables in content
    const substituteVariables = (content: string, eventData?: any, userData?: any): string => {
        let result = content;
        
        // Event variables
        if (eventData) {
            result = result.replace(/\{\{eventTitle\}\}/g, eventData.title || '');
            result = result.replace(/\{\{eventDate\}\}/g, eventData.date ? new Date(eventData.date).toLocaleDateString() : '');
            result = result.replace(/\{\{eventLocation\}\}/g, eventData.location || '');
        }
        
        // User variables
        if (userData) {
            result = result.replace(/\{\{userName\}\}/g, userData.name || '');
            result = result.replace(/\{\{userEmail\}\}/g, userData.email || '');
        }
        
        return result;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Event Communications</h2>
                    <p className="text-gray-600">Send notifications and updates to event attendees</p>
                </div>
                
                {/* Event Selection */}
                <div className="flex items-center gap-4">
                    <Select value={selectedEventId || ""} onValueChange={onEventSelect}>
                        <SelectTrigger className="w-64">
                            <SelectValue placeholder="Select an event" />
                        </SelectTrigger>
                        <SelectContent>
                            {events.map((event) => (
                                <SelectItem key={event._id} value={event._id}>
                                    {event.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {!selectedEventId ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FaEnvelope className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Event</h3>
                        <p className="text-gray-500 text-center">
                            Choose an event from the dropdown above to start managing communications.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="compose" className="flex items-center gap-2">
                            <FaEnvelope className="h-4 w-4" />
                            Compose
                        </TabsTrigger>
                        <TabsTrigger value="templates" className="flex items-center gap-2">
                            <FaFileAlt className="h-4 w-4" />
                            Templates
                        </TabsTrigger>
                        <TabsTrigger value="new-template" className="flex items-center gap-2">
                            <FaPlus className="h-4 w-4" />
                            New Template
                        </TabsTrigger>
                        <TabsTrigger value="recipients" className="flex items-center gap-2">
                            <FaUsers className="h-4 w-4" />
                            Recipients
                        </TabsTrigger>
                        <TabsTrigger value="history" className="flex items-center gap-2">
                            <FaHistory className="h-4 w-4" />
                            History
                        </TabsTrigger>
                    </TabsList>

                    {/* Compose Email Tab */}
                    <TabsContent value="compose" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FaPaperPlane className="h-5 w-5" />
                                    Compose Email
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Template Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Use Template (Optional)</label>
                                    <Select value={selectedTemplate} onValueChange={(value) => {
                                        setSelectedTemplate(value);
                                        if (value) applyTemplate(value);
                                    }}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a template" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {templates.map((template) => (
                                                <SelectItem key={template.id} value={template.id}>
                                                    {template.name} ({template.type})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Subject */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Subject</label>
                                    <Input
                                        value={emailData.subject || ""}
                                        onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                                        placeholder="Enter email subject"
                                    />
                                </div>

                                {/* Content */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Message Content</label>
                                    <Textarea
                                        value={emailData.content || ""}
                                        onChange={(e) => setEmailData(prev => ({ ...prev, content: e.target.value }))}
                                        placeholder="Enter your message content. Use double braces for variables like eventTitle, eventDate, userName."
                                        rows={8}
                                    />
                                    <p className="text-xs text-gray-500">
                                        Available variables: {"{"}{"{"} eventTitle {"}"}{"}"},  {"{"}{"{"} eventDate {"}"}{"}"},  {"{"}{"{"} eventLocation {"}"}{"}"},  {"{"}{"{"} userName {"}"}{"}"},  {"{"}{"{"} userEmail {"}"}{"}"} 
                                    </p>
                                </div>

                                {/* Recipient Options */}
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="sendToAll"
                                            checked={emailData.sendToAll || false}
                                            onCheckedChange={(checked) => 
                                                setEmailData(prev => ({ ...prev, sendToAll: !!checked }))
                                            }
                                        />
                                        <label htmlFor="sendToAll" className="text-sm font-medium">
                                            Send to all attendees ({filteredAttendees.length})
                                        </label>
                                    </div>

                                    {!emailData.sendToAll && (
                                        <div className="text-sm text-gray-600">
                                            {selectedRecipients.length} recipients selected. 
                                            Use the Recipients tab to select specific attendees.
                                        </div>
                                    )}
                                </div>

                                {/* Send Button */}
                                <div className="flex justify-end">
                                    <Button 
                                        onClick={handleSendEmail}
                                        disabled={!emailData.subject || !emailData.content || sending}
                                        className="flex items-center gap-2"
                                    >
                                        {sending ? (
                                            <FaSpinner className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <FaPaperPlane className="h-4 w-4" />
                                        )}
                                        {sending ? "Sending..." : "Send Email"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    {/* Templates Tab */}
                    <TabsContent value="templates" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <FaFileAlt className="h-5 w-5" />
                                        Email Templates
                                    </span>
                                    <Button 
                                        onClick={() => setActiveTab("new-template")}
                                        size="sm"
                                        className="flex items-center gap-2"
                                    >
                                        <FaPlus className="h-4 w-4" />
                                        New Template
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {templates.length === 0 ? (
                                        <div className="text-center py-8">
                                            <FaFileAlt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Templates Yet</h3>
                                            <p className="text-gray-500 mb-4">Create your first email template to get started.</p>
                                            <Button onClick={() => setActiveTab("new-template")}>
                                                <FaPlus className="h-4 w-4 mr-2" />
                                                Create Template
                                            </Button>
                                        </div>
                                    ) : (
                                        templates.map((template) => (
                                            <div key={template.id} className="border rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="font-medium">{template.name}</h4>
                                                        <Badge variant="secondary">{template.type}</Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                setSelectedTemplate(template.id);
                                                                applyTemplate(template.id);
                                                                setActiveTab("compose");
                                                            }}
                                                        >
                                                            <FaEye className="h-4 w-4 mr-1" />
                                                            Use
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => setEditingTemplate(template.id)}
                                                        >
                                                            <FaEdit className="h-4 w-4" />
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                >
                                                                    <FaTrash className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Delete Template</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure you want to delete "{template.name}"? This action cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => onDeleteTemplate(template.id)}
                                                                        className="bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
                                                <p className="text-xs text-gray-500 truncate">{template.content}</p>
                                                {template.variables.length > 0 && (
                                                    <div className="mt-2">
                                                        <span className="text-xs text-gray-500">Variables: </span>
                                                        {template.variables.map((variable, index) => (
                                                            <Badge key={index} variant="outline" className="text-xs mr-1">
                                                                {variable}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* New Template Form */}
                        {activeTab === "new-template" && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Create New Template</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Template Name</label>
                                            <Input
                                                value={newTemplate.name || ""}
                                                onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                                                placeholder="Enter template name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Template Type</label>
                                            <Select 
                                                value={newTemplate.type} 
                                                onValueChange={(value) => setNewTemplate(prev => ({ ...prev, type: value as TemplateType }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={TemplateType.REMINDER}>Reminder</SelectItem>
                                                    <SelectItem value={TemplateType.UPDATE}>Update</SelectItem>
                                                    <SelectItem value={TemplateType.CONFIRMATION}>Confirmation</SelectItem>
                                                    <SelectItem value={TemplateType.CANCELLATION}>Cancellation</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Subject</label>
                                        <Input
                                            value={newTemplate.subject || ""}
                                            onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                                            placeholder="Enter email subject"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Content</label>
                                        <Textarea
                                            value={newTemplate.content || ""}
                                            onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                                            placeholder="Enter template content. Use double braces for variables like eventTitle, eventDate, userName."
                                            rows={6}
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button 
                                            variant="outline" 
                                            onClick={() => {
                                                setActiveTab("templates");
                                                setNewTemplate({
                                                    name: "",
                                                    subject: "",
                                                    content: "",
                                                    type: TemplateType.REMINDER,
                                                    variables: []
                                                });
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button 
                                            onClick={handleSaveTemplate}
                                            disabled={!newTemplate.name || !newTemplate.subject || !newTemplate.content}
                                            className="flex items-center gap-2"
                                        >
                                            <FaSave className="h-4 w-4" />
                                            Save Template
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* New Template Tab */}
                    <TabsContent value="new-template" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Create New Template</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Template Name</label>
                                        <Input
                                            value={newTemplate.name || ""}
                                            onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="Enter template name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Template Type</label>
                                        <Select 
                                            value={newTemplate.type} 
                                            onValueChange={(value) => setNewTemplate(prev => ({ ...prev, type: value as TemplateType }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={TemplateType.REMINDER}>Reminder</SelectItem>
                                                <SelectItem value={TemplateType.UPDATE}>Update</SelectItem>
                                                <SelectItem value={TemplateType.CONFIRMATION}>Confirmation</SelectItem>
                                                <SelectItem value={TemplateType.CANCELLATION}>Cancellation</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Subject</label>
                                    <Input
                                        value={newTemplate.subject || ""}
                                        onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                                        placeholder="Enter email subject"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Content</label>
                                    <Textarea
                                        value={newTemplate.content || ""}
                                        onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                                        placeholder="Enter template content. Use double braces for variables like eventTitle, eventDate, userName."
                                        rows={6}
                                    />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => {
                                            setActiveTab("templates");
                                            setNewTemplate({
                                                name: "",
                                                subject: "",
                                                content: "",
                                                type: TemplateType.REMINDER,
                                                variables: []
                                            });
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        onClick={handleSaveTemplate}
                                        disabled={!newTemplate.name || !newTemplate.subject || !newTemplate.content}
                                        className="flex items-center gap-2"
                                    >
                                        <FaSave className="h-4 w-4" />
                                        Save Template
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Recipients Tab */}
                    <TabsContent value="recipients" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FaUsers className="h-5 w-5" />
                                    Manage Recipients ({filteredAttendees.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Filters */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <FaFilter className="h-4 w-4" />
                                            Payment Status
                                        </label>
                                        <div className="space-y-2">
                                            {['successful', 'pending', 'failed'].map((status) => (
                                                <div key={status} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`payment-${status}`}
                                                        checked={recipientFilters.paymentStatus?.includes(status) || false}
                                                        onCheckedChange={(checked) => {
                                                            setRecipientFilters(prev => ({
                                                                ...prev,
                                                                paymentStatus: checked
                                                                    ? [...(prev.paymentStatus || []), status]
                                                                    : (prev.paymentStatus || []).filter(s => s !== status)
                                                            }));
                                                        }}
                                                    />
                                                    <label htmlFor={`payment-${status}`} className="text-sm capitalize">
                                                        {status}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Attendance Status</label>
                                        <div className="space-y-2">
                                            {['registered', 'checked_in', 'attended', 'no_show'].map((status) => (
                                                <div key={status} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`attendance-${status}`}
                                                        checked={recipientFilters.attendanceStatus?.includes(status) || false}
                                                        onCheckedChange={(checked) => {
                                                            setRecipientFilters(prev => ({
                                                                ...prev,
                                                                attendanceStatus: checked
                                                                    ? [...(prev.attendanceStatus || []), status]
                                                                    : (prev.attendanceStatus || []).filter(s => s !== status)
                                                            }));
                                                        }}
                                                    />
                                                    <label htmlFor={`attendance-${status}`} className="text-sm capitalize">
                                                        {status.replace('_', ' ')}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Attendee List */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">Attendees</h4>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setSelectedRecipients(filteredAttendees.map(a => a.email))}
                                            >
                                                Select All
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setSelectedRecipients([])}
                                            >
                                                Clear All
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="max-h-96 overflow-y-auto border rounded-lg">
                                        {filteredAttendees.length === 0 ? (
                                            <div className="p-8 text-center">
                                                <FaUsers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-500">No attendees match the current filters.</p>
                                            </div>
                                        ) : (
                                            filteredAttendees.map((attendee) => (
                                                <div key={attendee.userId} className="flex items-center space-x-3 p-3 border-b last:border-b-0">
                                                    <Checkbox
                                                        checked={selectedRecipients.includes(attendee.email)}
                                                        onCheckedChange={(checked) => {
                                                            setSelectedRecipients(prev => 
                                                                checked
                                                                    ? [...prev, attendee.email]
                                                                    : prev.filter(email => email !== attendee.email)
                                                            );
                                                        }}
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">{attendee.name}</span>
                                                            <Badge 
                                                                variant={attendee.paymentStatus === 'successful' ? 'default' : 'secondary'}
                                                                className="text-xs"
                                                            >
                                                                {attendee.paymentStatus}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-gray-500">{attendee.email}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FaHistory className="h-5 w-5" />
                                    Communication History
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {communicationHistory.length === 0 ? (
                                        <div className="text-center py-8">
                                            <FaHistory className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Communications Yet</h3>
                                            <p className="text-gray-500">Email history will appear here once you start sending communications.</p>
                                        </div>
                                    ) : (
                                        communicationHistory.map((comm) => (
                                            <div key={comm.id} className="border rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <FaEnvelope className="h-4 w-4 text-gray-500" />
                                                        <h4 className="font-medium">{comm.subject}</h4>
                                                        <Badge 
                                                            variant={comm.deliveryStatus === 'delivered' ? 'default' : 'secondary'}
                                                        >
                                                            {comm.deliveryStatus}
                                                        </Badge>
                                                    </div>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(comm.sentAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    Sent to {comm.recipients.length} recipients
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">{comm.content}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}