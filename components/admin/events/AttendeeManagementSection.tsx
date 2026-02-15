"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
    FaUsers, 
    FaCheckCircle, 
    FaExclamationTriangle, 
    FaDownload, 
    FaSearch, 
    FaFilter,
    FaUserCheck,
    FaUserTimes,
    FaEnvelope,
    FaPhone,
    FaCalendarCheck,
    FaSpinner,
    FaClock,
    FaTimes
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export enum AttendanceStatus {
    REGISTERED = 'registered',
    CHECKED_IN = 'checked_in',
    ATTENDED = 'attended',
    NO_SHOW = 'no_show'
}

export enum PaymentStatus {
    SUCCESSFUL = 'successful',
    PENDING = 'pending',
    FAILED = 'failed',
    FREE = 'free'
}

export enum ExportFormat {
    CSV = 'csv',
    EXCEL = 'excel'
}

export interface AttendeeData {
    userId: string;
    name: string;
    email: string;
    phone?: string;
    registrationDate: Date;
    paymentStatus: PaymentStatus;
    attendanceStatus: AttendanceStatus;
    profilePicture?: string;
    paymentAmount?: number;
    transactionId?: string;
    organization?: string;
    specialization?: string;
}

export interface EventSummary {
    _id: string;
    title: string;
    date: Date;
    location: string;
    attendeeCount: number;
    isPaid: boolean;
    price: number;
    currency: string;
}

interface AttendeeManagementSectionProps {
    selectedEventId: string | null;
    events: EventSummary[];
    attendees: AttendeeData[];
    onEventSelect: (eventId: string) => void;
    onExportAttendees: (eventId: string, format: ExportFormat, filters?: any) => Promise<void>;
    onUpdateAttendance: (attendeeId: string, status: AttendanceStatus) => Promise<void>;
    loading: boolean;
    error: string | null;
}

interface AttendeeFilters {
    search: string;
    paymentStatus: PaymentStatus | 'all';
    attendanceStatus: AttendanceStatus | 'all';
}

export function AttendeeManagementSection({
    selectedEventId,
    events,
    attendees,
    onEventSelect,
    onExportAttendees,
    onUpdateAttendance,
    loading,
    error
}: AttendeeManagementSectionProps) {
    const [filters, setFilters] = useState<AttendeeFilters>({
        search: '',
        paymentStatus: 'all',
        attendanceStatus: 'all'
    });
    const [exportLoading, setExportLoading] = useState(false);
    const [exportProgress, setExportProgress] = useState<string>('');

    // Get selected event details
    const selectedEvent = useMemo(() => 
        events.find(event => event._id === selectedEventId), 
        [events, selectedEventId]
    );

    // Filter attendees based on current filters
    const filteredAttendees = useMemo(() => {
        return attendees.filter(attendee => {
            const matchesSearch = !filters.search || 
                attendee.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                attendee.email.toLowerCase().includes(filters.search.toLowerCase()) ||
                (attendee.organization && attendee.organization.toLowerCase().includes(filters.search.toLowerCase()));
            
            const matchesPaymentStatus = filters.paymentStatus === 'all' || 
                attendee.paymentStatus === filters.paymentStatus;
            
            const matchesAttendanceStatus = filters.attendanceStatus === 'all' || 
                attendee.attendanceStatus === filters.attendanceStatus;

            return matchesSearch && matchesPaymentStatus && matchesAttendanceStatus;
        });
    }, [attendees, filters]);

    // Statistics for the selected event
    const eventStats = useMemo(() => {
        const total = attendees.length;
        const paid = attendees.filter(a => a.paymentStatus === PaymentStatus.SUCCESSFUL).length;
        const checkedIn = attendees.filter(a => a.attendanceStatus === AttendanceStatus.CHECKED_IN || a.attendanceStatus === AttendanceStatus.ATTENDED).length;
        const attended = attendees.filter(a => a.attendanceStatus === AttendanceStatus.ATTENDED).length;
        
        return { total, paid, checkedIn, attended };
    }, [attendees]);

    const handleExport = async (format: ExportFormat) => {
        if (!selectedEventId) return;
        
        setExportLoading(true);
        setExportProgress(`Preparing ${format.toUpperCase()} export...`);
        
        try {
            // Pass current filters to export function
            const exportFilters = {
                paymentStatus: filters.paymentStatus,
                attendanceStatus: filters.attendanceStatus,
                search: filters.search
            };
            
            setExportProgress(`Exporting ${filteredAttendees.length} attendees...`);
            await onExportAttendees(selectedEventId, format, exportFilters);
            setExportProgress(`${format.toUpperCase()} export completed successfully!`);
            
            // Clear progress after a short delay
            setTimeout(() => setExportProgress(''), 2000);
        } catch (error) {
            console.error('Export failed:', error);
            setExportProgress('Export failed. Please try again.');
            setTimeout(() => setExportProgress(''), 3000);
        } finally {
            setExportLoading(false);
        }
    };

    const handleAttendanceUpdate = async (attendeeId: string, status: AttendanceStatus) => {
        try {
            await onUpdateAttendance(attendeeId, status);
        } catch (error) {
            console.error('Attendance update failed:', error);
        }
    };

    const getPaymentStatusBadge = (status: PaymentStatus) => {
        const variants = {
            [PaymentStatus.SUCCESSFUL]: { variant: "default" as const, icon: FaCheckCircle, color: "text-green-600" },
            [PaymentStatus.PENDING]: { variant: "secondary" as const, icon: FaClock, color: "text-yellow-600" },
            [PaymentStatus.FAILED]: { variant: "destructive" as const, icon: FaTimes, color: "text-red-600" },
            [PaymentStatus.FREE]: { variant: "outline" as const, icon: FaCheckCircle, color: "text-blue-600" }
        };
        
        const config = variants[status];
        const Icon = config.icon;
        
        return (
            <Badge variant={config.variant} className="flex items-center gap-1">
                <Icon className={`w-3 h-3 ${config.color}`} />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const getAttendanceStatusBadge = (status: AttendanceStatus) => {
        const variants = {
            [AttendanceStatus.REGISTERED]: { variant: "secondary" as const, icon: FaUsers, color: "text-gray-600" },
            [AttendanceStatus.CHECKED_IN]: { variant: "default" as const, icon: FaUserCheck, color: "text-blue-600" },
            [AttendanceStatus.ATTENDED]: { variant: "default" as const, icon: FaCheckCircle, color: "text-green-600" },
            [AttendanceStatus.NO_SHOW]: { variant: "destructive" as const, icon: FaUserTimes, color: "text-red-600" }
        };
        
        const config = variants[status];
        const Icon = config.icon;
        
        return (
            <Badge variant={config.variant} className="flex items-center gap-1">
                <Icon className={`w-3 h-3 ${config.color}`} />
                {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
            </Badge>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <FaSpinner className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-lg">Loading attendee data...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Attendees</h3>
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FaUsers className="text-blue-600" />
                        Attendee Management
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Manage event attendees, track payments, and monitor attendance
                    </p>
                </div>
            </div>

            {/* Event Selection */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FaCalendarCheck className="text-blue-600" />
                        Select Event
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Select value={selectedEventId || ""} onValueChange={onEventSelect}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose an event to manage attendees" />
                        </SelectTrigger>
                        <SelectContent>
                            {events.map((event) => (
                                <SelectItem key={event._id} value={event._id}>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{event.title}</span>
                                        <span className="text-sm text-gray-500">
                                            {new Date(event.date).toLocaleDateString()} • {event.attendeeCount} attendees
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {selectedEvent && (
                <>
                    {/* Event Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Attendees</p>
                                        <p className="text-2xl font-bold text-gray-900">{eventStats.total}</p>
                                    </div>
                                    <FaUsers className="w-8 h-8 text-blue-600" />
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Paid</p>
                                        <p className="text-2xl font-bold text-green-600">{eventStats.paid}</p>
                                    </div>
                                    <FaCheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Checked In</p>
                                        <p className="text-2xl font-bold text-blue-600">{eventStats.checkedIn}</p>
                                    </div>
                                    <FaUserCheck className="w-8 h-8 text-blue-600" />
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Attended</p>
                                        <p className="text-2xl font-bold text-purple-600">{eventStats.attended}</p>
                                    </div>
                                    <FaCalendarCheck className="w-8 h-8 text-purple-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters and Export */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                <div className="flex flex-col md:flex-row gap-4 flex-1">
                                    <div className="relative flex-1">
                                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            placeholder="Search attendees by name, email, or organization..."
                                            value={filters.search}
                                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                            className="pl-10"
                                        />
                                    </div>
                                    
                                    <Select 
                                        value={filters.paymentStatus} 
                                        onValueChange={(value) => setFilters(prev => ({ ...prev, paymentStatus: value as PaymentStatus | 'all' }))}
                                    >
                                        <SelectTrigger className="w-full md:w-48">
                                            <SelectValue placeholder="Payment Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Payment Status</SelectItem>
                                            <SelectItem value={PaymentStatus.SUCCESSFUL}>Successful</SelectItem>
                                            <SelectItem value={PaymentStatus.PENDING}>Pending</SelectItem>
                                            <SelectItem value={PaymentStatus.FAILED}>Failed</SelectItem>
                                            <SelectItem value={PaymentStatus.FREE}>Free</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    
                                    <Select 
                                        value={filters.attendanceStatus} 
                                        onValueChange={(value) => setFilters(prev => ({ ...prev, attendanceStatus: value as AttendanceStatus | 'all' }))}
                                    >
                                        <SelectTrigger className="w-full md:w-48">
                                            <SelectValue placeholder="Attendance Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Attendance</SelectItem>
                                            <SelectItem value={AttendanceStatus.REGISTERED}>Registered</SelectItem>
                                            <SelectItem value={AttendanceStatus.CHECKED_IN}>Checked In</SelectItem>
                                            <SelectItem value={AttendanceStatus.ATTENDED}>Attended</SelectItem>
                                            <SelectItem value={AttendanceStatus.NO_SHOW}>No Show</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleExport(ExportFormat.CSV)}
                                        disabled={exportLoading || filteredAttendees.length === 0}
                                        className="flex items-center gap-2"
                                    >
                                        {exportLoading ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaDownload className="w-4 h-4" />}
                                        Export CSV
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleExport(ExportFormat.EXCEL)}
                                        disabled={exportLoading || filteredAttendees.length === 0}
                                        className="flex items-center gap-2"
                                    >
                                        {exportLoading ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaDownload className="w-4 h-4" />}
                                        Export Excel
                                    </Button>
                                </div>
                            </div>
                            
                            {/* Export Progress Indicator */}
                            {exportProgress && (
                                <div className="mt-2 text-sm text-blue-600 flex items-center gap-2">
                                    {exportLoading && <FaSpinner className="w-4 h-4 animate-spin" />}
                                    {exportProgress}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Attendees List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Attendees ({filteredAttendees.length})</span>
                                {filters.search || filters.paymentStatus !== 'all' || filters.attendanceStatus !== 'all' ? (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setFilters({ search: '', paymentStatus: 'all', attendanceStatus: 'all' })}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Clear Filters
                                    </Button>
                                ) : null}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {filteredAttendees.length === 0 ? (
                                <div className="text-center py-8">
                                    <FaUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No attendees found</h3>
                                    <p className="text-gray-500">
                                        {attendees.length === 0 
                                            ? "No one has registered for this event yet."
                                            : "Try adjusting your filters to see more results."
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredAttendees.map((attendee) => (
                                        <div key={attendee.userId} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <Avatar className="w-12 h-12">
                                                        <AvatarImage src={attendee.profilePicture} alt={attendee.name} />
                                                        <AvatarFallback className="bg-blue-100 text-blue-600">
                                                            {attendee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h4 className="font-semibold text-gray-900">{attendee.name}</h4>
                                                            {getPaymentStatusBadge(attendee.paymentStatus)}
                                                            {getAttendanceStatusBadge(attendee.attendanceStatus)}
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            <div className="flex items-center gap-1">
                                                                <FaEnvelope className="w-3 h-3" />
                                                                <span>{attendee.email}</span>
                                                            </div>
                                                            {attendee.phone && (
                                                                <div className="flex items-center gap-1">
                                                                    <FaPhone className="w-3 h-3" />
                                                                    <span>{attendee.phone}</span>
                                                                </div>
                                                            )}
                                                            {attendee.organization && (
                                                                <div className="flex items-center gap-1">
                                                                    <span className="font-medium">Org:</span>
                                                                    <span>{attendee.organization}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                                            <span>Registered: {new Date(attendee.registrationDate).toLocaleDateString()}</span>
                                                            {attendee.paymentAmount && (
                                                                <span>Amount: {selectedEvent.currency} {attendee.paymentAmount}</span>
                                                            )}
                                                            {attendee.transactionId && (
                                                                <span>TX: {attendee.transactionId}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    <Select
                                                        value={attendee.attendanceStatus}
                                                        onValueChange={(value) => handleAttendanceUpdate(attendee.userId, value as AttendanceStatus)}
                                                    >
                                                        <SelectTrigger className="w-40">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value={AttendanceStatus.REGISTERED}>Registered</SelectItem>
                                                            <SelectItem value={AttendanceStatus.CHECKED_IN}>Checked In</SelectItem>
                                                            <SelectItem value={AttendanceStatus.ATTENDED}>Attended</SelectItem>
                                                            <SelectItem value={AttendanceStatus.NO_SHOW}>No Show</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}

export default AttendeeManagementSection;