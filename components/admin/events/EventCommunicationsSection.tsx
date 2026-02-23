"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FaEnvelope, FaPaperPlane, FaUsers, FaFilter, FaFileAlt, FaHistory, FaEye, FaEdit, FaTrash, FaPlus, FaSave, FaSpinner } from "react-icons/fa";

interface AttendeeData { userId: string; name: string; email: string; phone?: string; registrationDate: Date; paymentStatus: 'successful' | 'pending' | 'failed'; attendanceStatus: 'registered' | 'checked_in' | 'attended' | 'no_show'; profilePicture?: string; }
interface EmailTemplate { id: string; name: string; subject: string; content: string; type: TemplateType; variables: string[]; createdAt: Date; updatedAt: Date; }
enum TemplateType { REMINDER = 'reminder', UPDATE = 'update', CONFIRMATION = 'confirmation', CANCELLATION = 'cancellation' }
interface BulkEmailData { eventId: string; recipients: string[]; subject: string; content: string; templateId?: string; sendToAll: boolean; filters?: RecipientFilters; }
interface RecipientFilters { paymentStatus?: string[]; attendanceStatus?: string[]; }
interface CommunicationHistory { id: string; eventId: string; type: 'email' | 'sms' | 'push'; subject: string; content: string; recipients: string[]; sentBy: string; sentAt: Date; deliveryStatus: 'sent' | 'delivered' | 'failed' | 'pending'; templateUsed?: string; }

interface EventCommunicationsSectionProps {
    selectedEventId: string | null; attendees: AttendeeData[]; templates: EmailTemplate[]; communicationHistory: CommunicationHistory[];
    onEventSelect: (eventId: string) => void; onSendEmail: (emailData: BulkEmailData) => Promise<void>;
    onSaveTemplate: (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    onUpdateTemplate: (id: string, template: Partial<EmailTemplate>) => Promise<void>;
    onDeleteTemplate: (id: string) => Promise<void>; loading?: boolean; events?: Array<{ _id: string; title: string; date: Date }>;
}

const deliveryBadge: Record<string, string> = { delivered: "bg-emerald-50 text-emerald-700", sent: "bg-primary/5 text-primary", pending: "bg-amber-50 text-amber-700", failed: "bg-red-50 text-red-700" };
const paymentBadge: Record<string, string> = { successful: "bg-emerald-50 text-emerald-700", pending: "bg-amber-50 text-amber-700", failed: "bg-red-50 text-red-700" };
const typeBadge: Record<string, string> = { reminder: "bg-primary/5 text-primary", update: "bg-violet-50 text-violet-700", confirmation: "bg-emerald-50 text-emerald-700", cancellation: "bg-red-50 text-red-700" };

export function EventCommunicationsSection({ selectedEventId, attendees, templates, communicationHistory, onEventSelect, onSendEmail, onSaveTemplate, onUpdateTemplate, onDeleteTemplate, loading = false, events = [] }: EventCommunicationsSectionProps) {
    const [activeTab, setActiveTab] = useState("compose");
    const [emailData, setEmailData] = useState<Partial<BulkEmailData>>({ subject: "", content: "", sendToAll: true, recipients: [], filters: {} });
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [recipientFilters, setRecipientFilters] = useState<RecipientFilters>({});
    const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
    const [newTemplate, setNewTemplate] = useState<Partial<EmailTemplate>>({ name: "", subject: "", content: "", type: TemplateType.REMINDER, variables: [] });
    const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
    const [sending, setSending] = useState(false);

    const filteredAttendees = useMemo(() => attendees.filter(a => {
        if (recipientFilters.paymentStatus?.length && !recipientFilters.paymentStatus.includes(a.paymentStatus)) return false;
        if (recipientFilters.attendanceStatus?.length && !recipientFilters.attendanceStatus.includes(a.attendanceStatus)) return false;
        return true;
    }), [attendees, recipientFilters]);

    useEffect(() => { if (emailData.sendToAll || false) setSelectedRecipients(filteredAttendees.map(a => a.email)); }, [filteredAttendees, emailData.sendToAll]);

    const applyTemplate = (templateId: string) => { const t = templates.find(t => t.id === templateId); if (t) setEmailData(p => ({ ...p, subject: t.subject, content: t.content, templateId: t.id })); };

    const handleSendEmail = async () => {
        if (!selectedEventId || !emailData.subject || !emailData.content) return;
        setSending(true);
        try {
            await onSendEmail({ eventId: selectedEventId, recipients: emailData.sendToAll ? filteredAttendees.map(a => a.email) : selectedRecipients, subject: emailData.subject, content: emailData.content, templateId: selectedTemplate || undefined, sendToAll: emailData.sendToAll || false, filters: recipientFilters });
            setEmailData({ subject: "", content: "", sendToAll: true, recipients: [], filters: {} }); setSelectedTemplate(""); setRecipientFilters({});
            setTimeout(() => setActiveTab("history"), 1000);
        } catch { } finally { setSending(false); }
    };

    const handleSaveTemplate = async () => {
        if (!newTemplate.name || !newTemplate.subject || !newTemplate.content) return;
        try {
            await onSaveTemplate({ name: newTemplate.name, subject: newTemplate.subject, content: newTemplate.content, type: newTemplate.type || TemplateType.REMINDER, variables: extractVariables(newTemplate.content || "") });
            setNewTemplate({ name: "", subject: "", content: "", type: TemplateType.REMINDER, variables: [] });
            setTimeout(() => setActiveTab("templates"), 500);
        } catch { }
    };

    const extractVariables = (content: string): string[] => { const m = content.match(/\{\{(\w+)\}\}/g); return m ? m.map(x => x.slice(2, -2)) : []; };

    const resetTemplateForm = () => { setNewTemplate({ name: "", subject: "", content: "", type: TemplateType.REMINDER, variables: [] }); setActiveTab("templates"); };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div><h2 className="text-2xl font-black text-slate-900">Event Communications</h2><p className="text-slate-500 text-sm">Send notifications and updates to attendees</p></div>
                <Select value={selectedEventId || ""} onValueChange={onEventSelect}>
                    <SelectTrigger className="w-full sm:w-64 rounded-xl border-slate-200"><SelectValue placeholder="Select an event" /></SelectTrigger>
                    <SelectContent>{events.map(e => <SelectItem key={e._id} value={e._id}>{e.title}</SelectItem>)}</SelectContent>
                </Select>
            </div>

            {!selectedEventId ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm text-center py-16">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"><FaEnvelope className="text-2xl text-slate-300" /></div>
                    <h3 className="text-lg font-bold text-slate-700 mb-2">Select an Event</h3>
                    <p className="text-sm text-slate-400">Choose an event to manage communications</p>
                </div>
            ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="flex w-full overflow-x-auto bg-slate-100 rounded-xl p-1 gap-1">
                        {[{ v: "compose", icon: FaEnvelope, l: "Compose" }, { v: "templates", icon: FaFileAlt, l: "Templates" }, { v: "new-template", icon: FaPlus, l: "New" }, { v: "recipients", icon: FaUsers, l: "Recipients" }, { v: "history", icon: FaHistory, l: "History" }].map(t => (
                            <TabsTrigger key={t.v} value={t.v} className="flex items-center gap-1.5 rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap flex-1 min-w-0 justify-center"><t.icon size={12} />{t.l}</TabsTrigger>
                        ))}
                    </TabsList>

                    {/* Compose */}
                    <TabsContent value="compose" className="space-y-4">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                            <div className="flex items-center gap-2"><div className="p-2 bg-primary/5 rounded-xl"><FaPaperPlane className="text-primary" size={14} /></div><h3 className="text-sm font-black text-slate-700">Compose Email</h3></div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Template (Optional)</label>
                                <Select value={selectedTemplate} onValueChange={v => { setSelectedTemplate(v); if (v) applyTemplate(v); }}>
                                    <SelectTrigger className="rounded-xl border-slate-200"><SelectValue placeholder="Choose a template" /></SelectTrigger>
                                    <SelectContent>{templates.map(t => <SelectItem key={t.id} value={t.id}>{t.name} ({t.type})</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Subject</label>
                                <Input value={emailData.subject || ""} onChange={e => setEmailData(p => ({ ...p, subject: e.target.value }))} placeholder="Enter email subject" className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Message</label>
                                <Textarea value={emailData.content || ""} onChange={e => setEmailData(p => ({ ...p, content: e.target.value }))} placeholder="Enter your message. Use {{eventTitle}}, {{userName}}, etc." rows={8} className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                                <p className="text-[10px] text-slate-400">Variables: {"{{eventTitle}}"}, {"{{eventDate}}"}, {"{{eventLocation}}"}, {"{{userName}}"}, {"{{userEmail}}"}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="sendToAll" checked={emailData.sendToAll || false} onCheckedChange={c => setEmailData(p => ({ ...p, sendToAll: !!c }))} />
                                <label htmlFor="sendToAll" className="text-sm text-slate-700">Send to all attendees ({filteredAttendees.length})</label>
                            </div>
                            {!emailData.sendToAll && <p className="text-xs text-slate-400">{selectedRecipients.length} recipients selected. Use Recipients tab to pick.</p>}
                            <div className="flex justify-end">
                                <Button onClick={handleSendEmail} disabled={!emailData.subject || !emailData.content || sending} className="bg-primary hover:bg-primary/90 rounded-xl font-bold shadow-md shadow-primary/20">
                                    {sending ? <><FaSpinner className="w-3 h-3 animate-spin mr-2" /> Sending...</> : <><FaPaperPlane size={12} className="mr-2" /> Send Email</>}
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Templates */}
                    <TabsContent value="templates" className="space-y-4">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2"><div className="p-2 bg-violet-50 rounded-xl"><FaFileAlt className="text-violet-600" size={14} /></div><h3 className="text-sm font-black text-slate-700">Email Templates</h3></div>
                                <Button size="sm" onClick={() => setActiveTab("new-template")} className="bg-primary rounded-xl text-xs font-bold shadow-md shadow-primary/20"><FaPlus size={10} className="mr-1" /> New</Button>
                            </div>
                            {templates.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"><FaFileAlt className="text-2xl text-slate-300" /></div>
                                    <h3 className="text-lg font-bold text-slate-700 mb-2">No Templates</h3>
                                    <p className="text-sm text-slate-400 mb-4">Create your first template</p>
                                    <Button onClick={() => setActiveTab("new-template")} className="bg-primary rounded-xl font-bold"><FaPlus size={10} className="mr-1" /> Create</Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {templates.map(t => (
                                        <div key={t.id} className="border border-slate-100 rounded-xl p-4 hover:bg-slate-50/50 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-sm text-slate-800">{t.name}</h4>
                                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${typeBadge[t.type] || "bg-slate-100 text-slate-600"}`}>{t.type}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button size="sm" variant="ghost" onClick={() => { setSelectedTemplate(t.id); applyTemplate(t.id); setActiveTab("compose"); }} className="text-xs h-7 px-2"><FaEye size={10} className="mr-1" /> Use</Button>
                                                    <Button size="sm" variant="ghost" onClick={() => setEditingTemplate(t.id)} className="text-xs h-7 px-2"><FaEdit size={10} /></Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild><Button size="sm" variant="ghost" className="text-xs h-7 px-2 text-red-500 hover:text-red-700"><FaTrash size={10} /></Button></AlertDialogTrigger>
                                                        <AlertDialogContent className="rounded-2xl">
                                                            <AlertDialogHeader><AlertDialogTitle>Delete Template</AlertDialogTitle><AlertDialogDescription>Delete "{t.name}"? This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                                            <AlertDialogFooter><AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel><AlertDialogAction onClick={() => onDeleteTemplate(t.id)} className="bg-red-600 hover:bg-red-700 rounded-xl">Delete</AlertDialogAction></AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500 mb-1">{t.subject}</p>
                                            <p className="text-[10px] text-slate-400 truncate">{t.content}</p>
                                            {t.variables.length > 0 && <div className="mt-2 flex flex-wrap gap-1">{t.variables.map((v, i) => <span key={i} className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">{v}</span>)}</div>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* New Template */}
                    <TabsContent value="new-template" className="space-y-4">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                            <h3 className="text-sm font-black text-slate-700">Create New Template</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5"><label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Name</label><Input value={newTemplate.name || ""} onChange={e => setNewTemplate(p => ({ ...p, name: e.target.value }))} placeholder="Template name" className="rounded-xl border-slate-200 bg-slate-50" /></div>
                                <div className="space-y-1.5"><label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Type</label>
                                    <Select value={newTemplate.type} onValueChange={v => setNewTemplate(p => ({ ...p, type: v as TemplateType }))}>
                                        <SelectTrigger className="rounded-xl border-slate-200"><SelectValue /></SelectTrigger>
                                        <SelectContent><SelectItem value={TemplateType.REMINDER}>Reminder</SelectItem><SelectItem value={TemplateType.UPDATE}>Update</SelectItem><SelectItem value={TemplateType.CONFIRMATION}>Confirmation</SelectItem><SelectItem value={TemplateType.CANCELLATION}>Cancellation</SelectItem></SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-1.5"><label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Subject</label><Input value={newTemplate.subject || ""} onChange={e => setNewTemplate(p => ({ ...p, subject: e.target.value }))} placeholder="Email subject" className="rounded-xl border-slate-200 bg-slate-50" /></div>
                            <div className="space-y-1.5"><label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Content</label><Textarea value={newTemplate.content || ""} onChange={e => setNewTemplate(p => ({ ...p, content: e.target.value }))} placeholder="Use {{variable}} for dynamic content" rows={6} className="rounded-xl border-slate-200 bg-slate-50" /></div>
                            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                                <Button variant="outline" onClick={resetTemplateForm} className="rounded-xl font-bold">Cancel</Button>
                                <Button onClick={handleSaveTemplate} disabled={!newTemplate.name || !newTemplate.subject || !newTemplate.content} className="bg-primary rounded-xl font-bold shadow-md shadow-primary/20"><FaSave size={10} className="mr-1" /> Save</Button>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Recipients */}
                    <TabsContent value="recipients" className="space-y-4">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                            <div className="flex items-center gap-2"><div className="p-2 bg-primary/5 rounded-xl"><FaUsers className="text-primary" size={14} /></div><h3 className="text-sm font-black text-slate-700">Recipients ({filteredAttendees.length})</h3></div>
                            {/* Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1"><FaFilter size={10} /> Payment</label>
                                    {['successful', 'pending', 'failed'].map(s => (
                                        <div key={s} className="flex items-center space-x-2">
                                            <Checkbox id={`pay-${s}`} checked={recipientFilters.paymentStatus?.includes(s) || false} onCheckedChange={c => setRecipientFilters(p => ({ ...p, paymentStatus: c ? [...(p.paymentStatus || []), s] : (p.paymentStatus || []).filter(x => x !== s) }))} />
                                            <label htmlFor={`pay-${s}`} className="text-xs capitalize text-slate-600">{s}</label>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Attendance</label>
                                    {['registered', 'checked_in', 'attended', 'no_show'].map(s => (
                                        <div key={s} className="flex items-center space-x-2">
                                            <Checkbox id={`att-${s}`} checked={recipientFilters.attendanceStatus?.includes(s) || false} onCheckedChange={c => setRecipientFilters(p => ({ ...p, attendanceStatus: c ? [...(p.attendanceStatus || []), s] : (p.attendanceStatus || []).filter(x => x !== s) }))} />
                                            <label htmlFor={`att-${s}`} className="text-xs capitalize text-slate-600">{s.replace('_', ' ')}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Attendee List */}
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Attendees</p>
                                <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setSelectedRecipients(filteredAttendees.map(a => a.email))} className="rounded-xl text-xs font-bold">Select All</Button><Button size="sm" variant="outline" onClick={() => setSelectedRecipients([])} className="rounded-xl text-xs font-bold">Clear</Button></div>
                            </div>
                            <div className="max-h-96 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-50">
                                {filteredAttendees.length === 0 ? (
                                    <div className="text-center py-12"><div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3"><FaUsers className="text-xl text-slate-300" /></div><p className="text-xs text-slate-400">No attendees match filters</p></div>
                                ) : filteredAttendees.map(a => (
                                    <div key={a.userId} className="flex items-center space-x-3 p-3 hover:bg-slate-50/50 transition-colors">
                                        <Checkbox checked={selectedRecipients.includes(a.email)} onCheckedChange={c => setSelectedRecipients(p => c ? [...p, a.email] : p.filter(e => e !== a.email))} />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2"><span className="text-sm font-bold text-slate-800">{a.name}</span><span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${paymentBadge[a.paymentStatus] || "bg-slate-100 text-slate-600"}`}>{a.paymentStatus}</span></div>
                                            <p className="text-xs text-slate-400">{a.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* History */}
                    <TabsContent value="history" className="space-y-4">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <div className="flex items-center gap-2 mb-4"><div className="p-2 bg-slate-100 rounded-xl"><FaHistory className="text-slate-500" size={14} /></div><h3 className="text-sm font-black text-slate-700">Communication History</h3></div>
                            {communicationHistory.length === 0 ? (
                                <div className="text-center py-12"><div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"><FaHistory className="text-2xl text-slate-300" /></div><h3 className="text-lg font-bold text-slate-700 mb-2">No Communications</h3><p className="text-sm text-slate-400">History will appear here after sending</p></div>
                            ) : (
                                <div className="space-y-3">
                                    {communicationHistory.map(c => (
                                        <div key={c.id} className="border border-slate-100 rounded-xl p-4 hover:bg-slate-50/50 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2"><FaEnvelope className="text-slate-400" size={12} /><h4 className="font-bold text-sm text-slate-800">{c.subject}</h4><span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${deliveryBadge[c.deliveryStatus] || "bg-slate-100 text-slate-600"}`}>{c.deliveryStatus}</span></div>
                                                <span className="text-xs text-slate-400">{new Date(c.sentAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mb-1">Sent to {c.recipients.length} recipients</p>
                                            <p className="text-[10px] text-slate-400 truncate">{c.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}