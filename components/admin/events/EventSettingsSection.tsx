"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save, RotateCcw, Settings, Users, Clock, Shield, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface EventSettings {
    eventId: string;
    maxCapacity?: number;
    isPremiumOnly: boolean;
    registrationDeadline?: Date;
    allowWaitlist: boolean;
    requireApproval: boolean;
    customFields: CustomField[];
    notifications: NotificationSettings;
    version?: number;
    lastModified?: Date;
    lastModifiedBy?: string;
}

export interface CustomField {
    id: string;
    name: string;
    type: FieldType;
    required: boolean;
    options?: string[];
}

export enum FieldType {
    TEXT = 'text',
    EMAIL = 'email',
    PHONE = 'phone',
    SELECT = 'select',
    CHECKBOX = 'checkbox',
    TEXTAREA = 'textarea'
}

export interface NotificationSettings {
    sendReminders: boolean;
    reminderDays: number[];
    sendUpdates: boolean;
    sendConfirmations: boolean;
}

interface EventSummary {
    _id: string;
    title: string;
    date: Date;
    registeredCount: number;
    isPaid: boolean;
    price: number;
}

interface EventSettingsSectionProps {
    events: EventSummary[];
    selectedEventId: string | null;
    eventSettings: EventSettings | null;
    onEventSelect: (eventId: string) => void;
    onUpdateSettings: (settings: EventSettings) => Promise<void>;
    loading: boolean;
    saving: boolean;
}

interface SettingsHistory {
    id: string;
    settings: EventSettings;
    timestamp: Date;
    description: string;
}

const defaultSettings: Omit<EventSettings, 'eventId'> = {
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

export function EventSettingsSection({
    events,
    selectedEventId,
    eventSettings,
    onEventSelect,
    onUpdateSettings,
    loading,
    saving
}: EventSettingsSectionProps) {
    const [localSettings, setLocalSettings] = useState<EventSettings | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [newReminderDay, setNewReminderDay] = useState<string>("");
    const [settingsHistory, setSettingsHistory] = useState<SettingsHistory[]>([]);
    const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
    const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
    const [conflictDetected, setConflictDetected] = useState(false);

    const selectedEvent = events.find(e => e._id === selectedEventId);
    const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Update local settings when eventSettings changes
    useEffect(() => {
        if (eventSettings) {
            setLocalSettings(eventSettings);
            setHasChanges(false);
            setValidationErrors({});
            setConflictDetected(false);
            
            // Add to history if it's a new version
            if (eventSettings.version && eventSettings.lastModified) {
                const historyEntry: SettingsHistory = {
                    id: `${eventSettings.eventId}-${eventSettings.version}`,
                    settings: { ...eventSettings },
                    timestamp: eventSettings.lastModified,
                    description: `Settings version ${eventSettings.version}`
                };
                
                setSettingsHistory(prev => {
                    const exists = prev.find(h => h.id === historyEntry.id);
                    if (!exists) {
                        return [historyEntry, ...prev].slice(0, 10);
                    }
                    return prev;
                });
            }
        } else if (selectedEventId) {
            const defaults = {
                ...defaultSettings,
                eventId: selectedEventId
            };
            setLocalSettings(defaults);
            setHasChanges(false);
            setValidationErrors({});
            setConflictDetected(false);
            setSettingsHistory([]);
        }
    }, [eventSettings, selectedEventId]);

    // Auto-save functionality
    useEffect(() => {
        if (autoSaveEnabled && hasChanges && localSettings && !saving) {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
            
            autoSaveTimeoutRef.current = setTimeout(() => {
                handleAutoSave();
            }, 3000);
        }
        
        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, [hasChanges, localSettings, autoSaveEnabled, saving]);

    const handleAutoSave = async () => {
        if (!localSettings || !hasChanges) return;
        
        const errors = validateSettings(localSettings);
        if (Object.keys(errors).length > 0) {
            return;
        }
        
        try {
            await handleSaveSettings(true);
        } catch (error) {
            console.error('Auto-save failed:', error);
        }
    };

    const updateLocalSettings = (updates: Partial<EventSettings>) => {
        if (!localSettings) return;
        
        const newSettings = { ...localSettings, ...updates };
        setLocalSettings(newSettings);
        setHasChanges(true);
        
        const newErrors = { ...validationErrors };
        Object.keys(updates).forEach(key => {
            delete newErrors[key];
        });
        setValidationErrors(newErrors);
    };

    const validateSettings = (settings: EventSettings): Record<string, string> => {
        const errors: Record<string, string> = {};
        
        if (settings.maxCapacity !== undefined && settings.maxCapacity < 1) {
            errors.maxCapacity = "Capacity must be at least 1";
        }
        
        if (settings.registrationDeadline && settings.registrationDeadline < new Date()) {
            errors.registrationDeadline = "Registration deadline cannot be in the past";
        }
        
        if (selectedEvent && settings.registrationDeadline && settings.registrationDeadline > selectedEvent.date) {
            errors.registrationDeadline = "Registration deadline cannot be after event date";
        }
        
        return errors;
    };

    const handleSaveSettings = async (isAutoSave: boolean = false) => {
        if (!localSettings) return;
        
        const errors = validateSettings(localSettings);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            if (!isAutoSave) {
                toast.error("Please fix validation errors before saving");
            }
            return;
        }
        
        try {
            const settingsToSave = {
                ...localSettings,
                version: (localSettings.version || 0) + 1,
                lastModified: new Date()
            };
            
            await onUpdateSettings(settingsToSave);
            setHasChanges(false);
            setLastSaveTime(new Date());
            
            if (!isAutoSave) {
                toast.success("Event settings saved successfully");
            }
            
            const historyEntry: SettingsHistory = {
                id: `${settingsToSave.eventId}-${settingsToSave.version}`,
                settings: { ...settingsToSave },
                timestamp: settingsToSave.lastModified,
                description: isAutoSave ? 'Auto-saved' : 'Manual save'
            };
            
            setSettingsHistory(prev => [historyEntry, ...prev].slice(0, 10));
            
        } catch (error: any) {
            if (error.message.includes('conflict') || error.message.includes('version')) {
                setConflictDetected(true);
                if (!isAutoSave) {
                    toast.error("Settings were modified by another user. Please refresh and try again.");
                }
            } else {
                if (!isAutoSave) {
                    toast.error("Failed to save event settings");
                }
            }
            console.error("Error saving settings:", error);
        }
    };

    const handleManualSave = () => handleSaveSettings(false);

    const handleResetSettings = () => {
        if (eventSettings) {
            setLocalSettings(eventSettings);
        } else if (selectedEventId) {
            setLocalSettings({
                ...defaultSettings,
                eventId: selectedEventId
            });
        }
        setHasChanges(false);
        setValidationErrors({});
        setConflictDetected(false);
    };

    const handleRollbackToVersion = (historyEntry: SettingsHistory) => {
        setLocalSettings({ ...historyEntry.settings });
        setHasChanges(true);
        setValidationErrors({});
        setConflictDetected(false);
        toast.success(`Rolled back to ${historyEntry.description}`);
    };

    const refreshSettings = async () => {
        if (selectedEventId) {
            try {
                await onEventSelect(selectedEventId);
                setConflictDetected(false);
                toast.success("Settings refreshed successfully");
            } catch (error) {
                toast.error("Failed to refresh settings");
            }
        }
    };

    const addReminderDay = () => {
        if (!localSettings || !newReminderDay) return;
        
        const day = parseInt(newReminderDay);
        if (isNaN(day) || day < 1) {
            toast.error("Please enter a valid number of days");
            return;
        }
        
        if (localSettings.notifications.reminderDays.includes(day)) {
            toast.error("This reminder day already exists");
            return;
        }
        
        updateLocalSettings({
            notifications: {
                ...localSettings.notifications,
                reminderDays: [...localSettings.notifications.reminderDays, day].sort((a, b) => b - a)
            }
        });
        setNewReminderDay("");
    };

    const removeReminderDay = (day: number) => {
        if (!localSettings) return;
        
        updateLocalSettings({
            notifications: {
                ...localSettings.notifications,
                reminderDays: localSettings.notifications.reminderDays.filter(d => d !== day)
            }
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading event settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Settings className="h-6 w-6 text-blue-600" />
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Event Settings</h2>
                    <p className="text-gray-600">Configure event-specific parameters and restrictions</p>
                </div>
            </div>

            {/* Event Selection */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Select Event
                    </CardTitle>
                    <CardDescription>
                        Choose an event to configure its settings
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Select value={selectedEventId || ""} onValueChange={onEventSelect}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an event to configure" />
                        </SelectTrigger>
                        <SelectContent>
                            {events.map((event) => (
                                <SelectItem key={event._id} value={event._id}>
                                    <div className="flex items-center justify-between w-full">
                                        <span>{event.title}</span>
                                        <div className="flex items-center gap-2 ml-4">
                                            <Badge variant="outline">
                                                {event.registeredCount} registered
                                            </Badge>
                                            {event.isPaid && (
                                                <Badge variant="secondary">
                                                    ${event.price}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* Settings Configuration */}
            {selectedEventId && localSettings && (
                <div className="space-y-6">
                    {/* Basic Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Basic Settings
                            </CardTitle>
                            <CardDescription>
                                Configure capacity and access restrictions
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Max Capacity */}
                            <div className="space-y-2">
                                <Label htmlFor="maxCapacity">Maximum Capacity</Label>
                                <Input
                                    id="maxCapacity"
                                    type="number"
                                    min="1"
                                    placeholder="No limit"
                                    value={localSettings.maxCapacity || ""}
                                    onChange={(e) => updateLocalSettings({
                                        maxCapacity: e.target.value ? parseInt(e.target.value) : undefined
                                    })}
                                    className={validationErrors.maxCapacity ? "border-red-500" : ""}
                                />
                                {validationErrors.maxCapacity && (
                                    <p className="text-sm text-red-600">{validationErrors.maxCapacity}</p>
                                )}
                                <p className="text-sm text-gray-600">
                                    Leave empty for unlimited capacity. Current registrations: {selectedEvent?.registeredCount || 0}
                                </p>
                            </div>

                            {/* Premium Only */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isPremiumOnly"
                                    checked={localSettings.isPremiumOnly}
                                    onCheckedChange={(checked) => updateLocalSettings({
                                        isPremiumOnly: checked as boolean
                                    })}
                                />
                                <Label htmlFor="isPremiumOnly" className="text-sm font-medium">
                                    Restrict to premium members only
                                </Label>
                            </div>

                            {/* Allow Waitlist */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="allowWaitlist"
                                    checked={localSettings.allowWaitlist}
                                    onCheckedChange={(checked) => updateLocalSettings({
                                        allowWaitlist: checked as boolean
                                    })}
                                />
                                <Label htmlFor="allowWaitlist" className="text-sm font-medium">
                                    Allow waitlist when capacity is reached
                                </Label>
                            </div>

                            {/* Require Approval */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="requireApproval"
                                    checked={localSettings.requireApproval}
                                    onCheckedChange={(checked) => updateLocalSettings({
                                        requireApproval: checked as boolean
                                    })}
                                />
                                <Label htmlFor="requireApproval" className="text-sm font-medium">
                                    Require admin approval for registration
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Registration Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Registration Settings
                            </CardTitle>
                            <CardDescription>
                                Configure registration deadlines and requirements
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Registration Deadline */}
                            <div className="space-y-2">
                                <Label>Registration Deadline</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !localSettings.registrationDeadline && "text-muted-foreground",
                                                validationErrors.registrationDeadline && "border-red-500"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {localSettings.registrationDeadline ? (
                                                format(localSettings.registrationDeadline, "PPP")
                                            ) : (
                                                <span>No deadline set</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={localSettings.registrationDeadline}
                                            onSelect={(date) => updateLocalSettings({
                                                registrationDeadline: date
                                            })}
                                            disabled={(date) => date < new Date()}
                                            initialFocus
                                        />
                                        {localSettings.registrationDeadline && (
                                            <div className="p-3 border-t">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => updateLocalSettings({
                                                        registrationDeadline: undefined
                                                    })}
                                                    className="w-full"
                                                >
                                                    Clear deadline
                                                </Button>
                                            </div>
                                        )}
                                    </PopoverContent>
                                </Popover>
                                {validationErrors.registrationDeadline && (
                                    <p className="text-sm text-red-600">{validationErrors.registrationDeadline}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notification Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Settings</CardTitle>
                            <CardDescription>
                                Configure automatic notifications for this event
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Basic Notifications */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="sendConfirmations"
                                        checked={localSettings.notifications.sendConfirmations}
                                        onCheckedChange={(checked) => updateLocalSettings({
                                            notifications: {
                                                ...localSettings.notifications,
                                                sendConfirmations: checked as boolean
                                            }
                                        })}
                                    />
                                    <Label htmlFor="sendConfirmations" className="text-sm font-medium">
                                        Send registration confirmations
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="sendUpdates"
                                        checked={localSettings.notifications.sendUpdates}
                                        onCheckedChange={(checked) => updateLocalSettings({
                                            notifications: {
                                                ...localSettings.notifications,
                                                sendUpdates: checked as boolean
                                            }
                                        })}
                                    />
                                    <Label htmlFor="sendUpdates" className="text-sm font-medium">
                                        Send event updates and changes
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="sendReminders"
                                        checked={localSettings.notifications.sendReminders}
                                        onCheckedChange={(checked) => updateLocalSettings({
                                            notifications: {
                                                ...localSettings.notifications,
                                                sendReminders: checked as boolean
                                            }
                                        })}
                                    />
                                    <Label htmlFor="sendReminders" className="text-sm font-medium">
                                        Send event reminders
                                    </Label>
                                </div>
                            </div>

                            {/* Reminder Days */}
                            {localSettings.notifications.sendReminders && (
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">Reminder Schedule</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {localSettings.notifications.reminderDays.map((day) => (
                                            <Badge key={day} variant="secondary" className="flex items-center gap-1">
                                                {day} day{day !== 1 ? 's' : ''} before
                                                <button
                                                    onClick={() => removeReminderDay(day)}
                                                    className="ml-1 hover:text-red-600"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            min="1"
                                            placeholder="Days before event"
                                            value={newReminderDay}
                                            onChange={(e) => setNewReminderDay(e.target.value)}
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addReminderDay}
                                            disabled={!newReminderDay}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Auto-save and History Controls */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Save Options</span>
                                <div className="flex items-center gap-4 text-sm">
                                    {lastSaveTime && (
                                        <span className="text-gray-600">
                                            Last saved: {format(lastSaveTime, "HH:mm:ss")}
                                        </span>
                                    )}
                                    {autoSaveEnabled && hasChanges && (
                                        <span className="text-blue-600 flex items-center gap-1">
                                            <div className="animate-pulse w-2 h-2 bg-blue-600 rounded-full"></div>
                                            Auto-saving...
                                        </span>
                                    )}
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Auto-save toggle */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-sm font-medium">Auto-save changes</Label>
                                    <p className="text-xs text-gray-600">Automatically save changes after 3 seconds</p>
                                </div>
                                <Checkbox
                                    checked={autoSaveEnabled}
                                    onCheckedChange={(checked) => setAutoSaveEnabled(checked as boolean)}
                                />
                            </div>

                            {/* Conflict warning */}
                            {conflictDetected && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-medium text-yellow-800">Settings Conflict Detected</h4>
                                            <p className="text-xs text-yellow-700">Another user has modified these settings</p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={refreshSettings}
                                        >
                                            Refresh
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Settings History */}
                            {settingsHistory.length > 0 && (
                                <div>
                                    <Label className="text-sm font-medium">Recent Changes</Label>
                                    <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                                        {settingsHistory.slice(0, 5).map((entry) => (
                                            <div key={entry.id} className="flex items-center justify-between text-xs bg-gray-50 rounded p-2">
                                                <div>
                                                    <span className="font-medium">{entry.description}</span>
                                                    <span className="text-gray-600 ml-2">
                                                        {format(entry.timestamp, "MMM d, HH:mm")}
                                                    </span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRollbackToVersion(entry)}
                                                    className="text-xs h-6 px-2"
                                                >
                                                    Restore
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            onClick={handleResetSettings}
                            disabled={!hasChanges || saving}
                        >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reset Changes
                        </Button>
                        
                        <div className="flex gap-2">
                            {conflictDetected && (
                                <Button
                                    variant="outline"
                                    onClick={refreshSettings}
                                    disabled={saving}
                                >
                                    Refresh Settings
                                </Button>
                            )}
                            
                            <Button
                                onClick={handleManualSave}
                                disabled={(!hasChanges && !conflictDetected) || saving}
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        {conflictDetected ? "Force Save" : "Save Settings"}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* No Event Selected */}
            {!selectedEventId && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Settings className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Event Selected</h3>
                        <p className="text-gray-600 text-center">
                            Select an event from the dropdown above to configure its settings
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}