"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save, RotateCcw, Settings, Users, Clock, Shield, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { FaSpinner } from "react-icons/fa";

export interface EventSettings { eventId: string; maxCapacity?: number; isPremiumOnly: boolean; registrationDeadline?: Date; allowWaitlist: boolean; requireApproval: boolean; customFields: CustomField[]; notifications: NotificationSettings; version?: number; lastModified?: Date; lastModifiedBy?: string; }
export interface CustomField { id: string; name: string; type: FieldType; required: boolean; options?: string[]; }
export enum FieldType { TEXT = 'text', EMAIL = 'email', PHONE = 'phone', SELECT = 'select', CHECKBOX = 'checkbox', TEXTAREA = 'textarea' }
export interface NotificationSettings { sendReminders: boolean; reminderDays: number[]; sendUpdates: boolean; sendConfirmations: boolean; }
interface EventSummary { _id: string; title: string; date: Date; registeredCount: number; isPaid: boolean; price: number; }
interface EventSettingsSectionProps { events: EventSummary[]; selectedEventId: string | null; eventSettings: EventSettings | null; onEventSelect: (eventId: string) => void; onUpdateSettings: (settings: EventSettings) => Promise<void>; loading: boolean; saving: boolean; }
interface SettingsHistory { id: string; settings: EventSettings; timestamp: Date; description: string; }

const defaultSettings: Omit<EventSettings, 'eventId'> = { maxCapacity: undefined, isPremiumOnly: false, registrationDeadline: undefined, allowWaitlist: false, requireApproval: false, customFields: [], notifications: { sendReminders: true, reminderDays: [7, 1], sendUpdates: true, sendConfirmations: true }, version: 1, lastModified: new Date() };

export function EventSettingsSection({ events, selectedEventId, eventSettings, onEventSelect, onUpdateSettings, loading, saving }: EventSettingsSectionProps) {
    const [localSettings, setLocalSettings] = useState<EventSettings | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [newReminderDay, setNewReminderDay] = useState("");
    const [settingsHistory, setSettingsHistory] = useState<SettingsHistory[]>([]);
    const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
    const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
    const [conflictDetected, setConflictDetected] = useState(false);
    const selectedEvent = events.find(e => e._id === selectedEventId);
    const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (eventSettings) {
            setLocalSettings(eventSettings); setHasChanges(false); setValidationErrors({}); setConflictDetected(false);
            if (eventSettings.version && eventSettings.lastModified) {
                const entry: SettingsHistory = { id: `${eventSettings.eventId}-${eventSettings.version}`, settings: { ...eventSettings }, timestamp: eventSettings.lastModified, description: `Version ${eventSettings.version}` };
                setSettingsHistory(prev => { const exists = prev.find(h => h.id === entry.id); return exists ? prev : [entry, ...prev].slice(0, 10); });
            }
        } else if (selectedEventId) {
            setLocalSettings({ ...defaultSettings, eventId: selectedEventId }); setHasChanges(false); setValidationErrors({}); setConflictDetected(false); setSettingsHistory([]);
        }
    }, [eventSettings, selectedEventId]);

    useEffect(() => {
        if (autoSaveEnabled && hasChanges && localSettings && !saving) {
            if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
            autoSaveTimeoutRef.current = setTimeout(() => handleAutoSave(), 3000);
        }
        return () => { if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current); };
    }, [hasChanges, localSettings, autoSaveEnabled, saving]);

    const handleAutoSave = async () => { if (!localSettings || !hasChanges) return; const errors = validateSettings(localSettings); if (Object.keys(errors).length > 0) return; try { await handleSaveSettings(true); } catch { } };
    const updateLocalSettings = (updates: Partial<EventSettings>) => { if (!localSettings) return; setLocalSettings({ ...localSettings, ...updates }); setHasChanges(true); const errs = { ...validationErrors }; Object.keys(updates).forEach(k => delete errs[k]); setValidationErrors(errs); };
    const validateSettings = (s: EventSettings): Record<string, string> => { const e: Record<string, string> = {}; if (s.maxCapacity !== undefined && s.maxCapacity < 1) e.maxCapacity = "Must be at least 1"; if (s.registrationDeadline && s.registrationDeadline < new Date()) e.registrationDeadline = "Cannot be in the past"; if (selectedEvent && s.registrationDeadline && s.registrationDeadline > selectedEvent.date) e.registrationDeadline = "Cannot be after event date"; return e; };

    const handleSaveSettings = async (isAutoSave = false) => {
        if (!localSettings) return;
        const errors = validateSettings(localSettings);
        if (Object.keys(errors).length > 0) { setValidationErrors(errors); if (!isAutoSave) toast.error("Fix validation errors"); return; }
        try {
            const toSave = { ...localSettings, version: (localSettings.version || 0) + 1, lastModified: new Date() };
            await onUpdateSettings(toSave); setHasChanges(false); setLastSaveTime(new Date());
            if (!isAutoSave) toast.success("Settings saved");
            setSettingsHistory(prev => [{ id: `${toSave.eventId}-${toSave.version}`, settings: { ...toSave }, timestamp: toSave.lastModified, description: isAutoSave ? 'Auto-saved' : 'Manual save' }, ...prev].slice(0, 10));
        } catch (error: any) {
            if (error.message?.includes('conflict') || error.message?.includes('version')) { setConflictDetected(true); if (!isAutoSave) toast.error("Settings modified by another user"); }
            else if (!isAutoSave) toast.error("Failed to save");
        }
    };

    const handleResetSettings = () => { if (eventSettings) setLocalSettings(eventSettings); else if (selectedEventId) setLocalSettings({ ...defaultSettings, eventId: selectedEventId }); setHasChanges(false); setValidationErrors({}); setConflictDetected(false); };
    const handleRollback = (entry: SettingsHistory) => { setLocalSettings({ ...entry.settings }); setHasChanges(true); setValidationErrors({}); setConflictDetected(false); toast.success(`Rolled back to ${entry.description}`); };
    const refreshSettings = async () => { if (selectedEventId) { try { await onEventSelect(selectedEventId); setConflictDetected(false); toast.success("Refreshed"); } catch { toast.error("Failed to refresh"); } } };
    const addReminderDay = () => { if (!localSettings || !newReminderDay) return; const day = parseInt(newReminderDay); if (isNaN(day) || day < 1) { toast.error("Enter a valid number"); return; } if (localSettings.notifications.reminderDays.includes(day)) { toast.error("Already exists"); return; } updateLocalSettings({ notifications: { ...localSettings.notifications, reminderDays: [...localSettings.notifications.reminderDays, day].sort((a, b) => b - a) } }); setNewReminderDay(""); };
    const removeReminderDay = (day: number) => { if (!localSettings) return; updateLocalSettings({ notifications: { ...localSettings.notifications, reminderDays: localSettings.notifications.reminderDays.filter(d => d !== day) } }); };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/5 text-primary rounded-xl"><Settings size={20} /></div>
                <div><h2 className="text-2xl font-black text-slate-900">Event Settings</h2><p className="text-slate-500 text-sm">Configure event-specific parameters</p></div>
            </div>

            {/* Event Selection */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Select Event</p>
                <Select value={selectedEventId || ""} onValueChange={onEventSelect}>
                    <SelectTrigger className="w-full rounded-xl border-slate-200"><SelectValue placeholder="Select an event to configure" /></SelectTrigger>
                    <SelectContent>{events.map(e => <SelectItem key={e._id} value={e._id}><span className="font-medium">{e.title}</span> <span className="text-slate-400 ml-2 text-xs">{e.registeredCount} registered{e.isPaid ? ` • $${e.price}` : ''}</span></SelectItem>)}</SelectContent>
                </Select>
            </div>

            {selectedEventId && localSettings ? (
                <div className="space-y-6">
                    {/* Basic Settings */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-5">
                        <div className="flex items-center gap-2"><Shield size={16} className="text-primary" /><h3 className="text-sm font-black text-slate-700">Basic Settings</h3></div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Maximum Capacity</Label>
                            <Input type="number" min="1" placeholder="No limit" value={localSettings.maxCapacity || ""} onChange={e => updateLocalSettings({ maxCapacity: e.target.value ? parseInt(e.target.value) : undefined })} className={cn("rounded-xl border-slate-200 bg-slate-50", validationErrors.maxCapacity && "border-red-400")} />
                            {validationErrors.maxCapacity && <p className="text-xs text-red-500">{validationErrors.maxCapacity}</p>}
                            <p className="text-xs text-slate-400">Leave empty for unlimited. Current: {selectedEvent?.registeredCount || 0}</p>
                        </div>
                        <div className="space-y-3">
                            {[{ id: "isPremiumOnly", label: "Restrict to premium members", checked: localSettings.isPremiumOnly, key: "isPremiumOnly" },
                            { id: "allowWaitlist", label: "Allow waitlist when full", checked: localSettings.allowWaitlist, key: "allowWaitlist" },
                            { id: "requireApproval", label: "Require admin approval", checked: localSettings.requireApproval, key: "requireApproval" }
                            ].map(item => (
                                <div key={item.id} className="flex items-center space-x-3">
                                    <Checkbox id={item.id} checked={item.checked} onCheckedChange={checked => updateLocalSettings({ [item.key]: checked as boolean })} />
                                    <Label htmlFor={item.id} className="text-sm text-slate-700">{item.label}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Registration Deadline */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                        <div className="flex items-center gap-2"><Clock size={16} className="text-primary" /><h3 className="text-sm font-black text-slate-700">Registration</h3></div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Deadline</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal rounded-xl border-slate-200", !localSettings.registrationDeadline && "text-muted-foreground", validationErrors.registrationDeadline && "border-red-400")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />{localSettings.registrationDeadline ? format(localSettings.registrationDeadline, "PPP") : "No deadline set"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={localSettings.registrationDeadline} onSelect={date => updateLocalSettings({ registrationDeadline: date })} disabled={date => date < new Date()} initialFocus />
                                    {localSettings.registrationDeadline && <div className="p-3 border-t"><Button variant="outline" size="sm" onClick={() => updateLocalSettings({ registrationDeadline: undefined })} className="w-full rounded-xl">Clear</Button></div>}
                                </PopoverContent>
                            </Popover>
                            {validationErrors.registrationDeadline && <p className="text-xs text-red-500">{validationErrors.registrationDeadline}</p>}
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-5">
                        <h3 className="text-sm font-black text-slate-700">Notifications</h3>
                        <div className="space-y-3">
                            {[{ id: "sendConfirmations", label: "Registration confirmations", checked: localSettings.notifications.sendConfirmations, key: "sendConfirmations" },
                            { id: "sendUpdates", label: "Event updates", checked: localSettings.notifications.sendUpdates, key: "sendUpdates" },
                            { id: "sendReminders", label: "Event reminders", checked: localSettings.notifications.sendReminders, key: "sendReminders" }
                            ].map(item => (
                                <div key={item.id} className="flex items-center space-x-3">
                                    <Checkbox id={item.id} checked={item.checked} onCheckedChange={checked => updateLocalSettings({ notifications: { ...localSettings.notifications, [item.key]: checked as boolean } })} />
                                    <Label htmlFor={item.id} className="text-sm text-slate-700">{item.label}</Label>
                                </div>
                            ))}
                        </div>
                        {localSettings.notifications.sendReminders && (
                            <div className="space-y-3 pt-3 border-t border-slate-100">
                                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Reminder Schedule</Label>
                                <div className="flex flex-wrap gap-2">
                                    {localSettings.notifications.reminderDays.map(day => (
                                        <span key={day} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold">
                                            {day} day{day !== 1 ? 's' : ''} before<button onClick={() => removeReminderDay(day)} className="ml-1 hover:text-red-600"><X size={12} /></button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2"><Input type="number" min="1" placeholder="Days before event" value={newReminderDay} onChange={e => setNewReminderDay(e.target.value)} className="flex-1 rounded-xl border-slate-200 bg-slate-50" /><Button type="button" variant="outline" size="sm" onClick={addReminderDay} disabled={!newReminderDay} className="rounded-xl"><Plus size={14} /></Button></div>
                            </div>
                        )}
                    </div>

                    {/* Save Options */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-700">Save Options</h3>
                            <div className="flex items-center gap-3 text-xs">
                                {lastSaveTime && <span className="text-slate-400">Last saved: {format(lastSaveTime, "HH:mm:ss")}</span>}
                                {autoSaveEnabled && hasChanges && <span className="text-primary flex items-center gap-1"><div className="animate-pulse w-1.5 h-1.5 bg-primary rounded-full" />Auto-saving...</span>}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div><Label className="text-sm text-slate-700">Auto-save changes</Label><p className="text-xs text-slate-400">Saves after 3s of inactivity</p></div>
                            <Checkbox checked={autoSaveEnabled} onCheckedChange={checked => setAutoSaveEnabled(checked as boolean)} />
                        </div>
                        {conflictDetected && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
                                <div><h4 className="text-xs font-bold text-amber-800">Conflict Detected</h4><p className="text-[10px] text-amber-600">Settings modified by another user</p></div>
                                <Button variant="outline" size="sm" onClick={refreshSettings} className="rounded-xl text-xs">Refresh</Button>
                            </div>
                        )}
                        {settingsHistory.length > 0 && (
                            <div><Label className="text-xs font-bold text-slate-400 uppercase tracking-wide">History</Label>
                                <div className="mt-2 space-y-1 max-h-28 overflow-y-auto">{settingsHistory.slice(0, 5).map(entry => (
                                    <div key={entry.id} className="flex items-center justify-between text-xs bg-slate-50 rounded-xl p-2.5">
                                        <div><span className="font-bold text-slate-600">{entry.description}</span><span className="text-slate-400 ml-2">{format(entry.timestamp, "MMM d, HH:mm")}</span></div>
                                        <Button variant="ghost" size="sm" onClick={() => handleRollback(entry)} className="text-[10px] h-6 px-2 text-primary">Restore</Button>
                                    </div>
                                ))}</div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <Button variant="outline" onClick={handleResetSettings} disabled={!hasChanges || saving} className="rounded-xl font-bold"><RotateCcw size={14} className="mr-2" /> Reset</Button>
                        <div className="flex gap-2">
                            {conflictDetected && <Button variant="outline" onClick={refreshSettings} disabled={saving} className="rounded-xl font-bold">Refresh</Button>}
                            <Button onClick={() => handleSaveSettings(false)} disabled={(!hasChanges && !conflictDetected) || saving} className="bg-primary hover:bg-primary/90 rounded-xl font-bold shadow-md shadow-primary/20">
                                {saving ? <><FaSpinner className="w-3 h-3 animate-spin mr-2" /> Saving...</> : <><Save size={14} className="mr-2" /> {conflictDetected ? "Force Save" : "Save Settings"}</>}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : !selectedEventId ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm text-center py-16">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"><Settings className="text-2xl text-slate-300" /></div>
                    <h3 className="text-lg font-bold text-slate-700 mb-2">No Event Selected</h3>
                    <p className="text-sm text-slate-400">Select an event from the dropdown above</p>
                </div>
            ) : null}
        </div>
    );
}