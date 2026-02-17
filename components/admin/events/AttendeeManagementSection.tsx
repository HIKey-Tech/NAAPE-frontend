"use client";

import React, { useState, useMemo } from "react";
import { FaUsers, FaCheckCircle, FaExclamationTriangle, FaDownload, FaSearch, FaUserCheck, FaUserTimes, FaEnvelope, FaPhone, FaCalendarCheck, FaSpinner, FaClock, FaTimes } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export enum AttendanceStatus { REGISTERED = 'registered', CHECKED_IN = 'checked_in', ATTENDED = 'attended', NO_SHOW = 'no_show' }
export enum PaymentStatus { SUCCESSFUL = 'successful', PENDING = 'pending', FAILED = 'failed', FREE = 'free' }
export enum ExportFormat { CSV = 'csv', EXCEL = 'excel' }

export interface AttendeeData {
    userId: string; name: string; email: string; phone?: string; registrationDate: Date;
    paymentStatus: PaymentStatus; attendanceStatus: AttendanceStatus; profilePicture?: string;
    paymentAmount?: number; transactionId?: string; organization?: string; specialization?: string;
}

export interface EventSummary { _id: string; title: string; date: Date; location: string; attendeeCount: number; isPaid: boolean; price: number; currency: string; }

interface AttendeeManagementSectionProps {
    selectedEventId: string | null; events: EventSummary[]; attendees: AttendeeData[];
    onEventSelect: (eventId: string) => void; onExportAttendees: (eventId: string, format: ExportFormat, filters?: any) => Promise<void>;
    onUpdateAttendance: (attendeeId: string, status: AttendanceStatus) => Promise<void>; loading: boolean; error: string | null;
}

interface AttendeeFilters { search: string; paymentStatus: PaymentStatus | 'all'; attendanceStatus: AttendanceStatus | 'all'; }

const paymentBadge: Record<string, string> = {
    successful: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    pending: "bg-amber-50 text-amber-700 border border-amber-100",
    failed: "bg-red-50 text-red-700 border border-red-100",
    free: "bg-primary/5 text-primary border border-primary/10",
};
const attendanceBadge: Record<string, string> = {
    registered: "bg-slate-100 text-slate-600",
    checked_in: "bg-primary/5 text-primary border border-primary/10",
    attended: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    no_show: "bg-red-50 text-red-700 border border-red-100",
};

export function AttendeeManagementSection({ selectedEventId, events, attendees, onEventSelect, onExportAttendees, onUpdateAttendance, loading, error }: AttendeeManagementSectionProps) {
    const [filters, setFilters] = useState<AttendeeFilters>({ search: '', paymentStatus: 'all', attendanceStatus: 'all' });
    const [exportLoading, setExportLoading] = useState(false);
    const [exportProgress, setExportProgress] = useState('');

    const selectedEvent = useMemo(() => events.find(e => e._id === selectedEventId), [events, selectedEventId]);

    const filteredAttendees = useMemo(() => attendees.filter(a => {
        const matchesSearch = !filters.search || a.name.toLowerCase().includes(filters.search.toLowerCase()) || a.email.toLowerCase().includes(filters.search.toLowerCase());
        return matchesSearch && (filters.paymentStatus === 'all' || a.paymentStatus === filters.paymentStatus) && (filters.attendanceStatus === 'all' || a.attendanceStatus === filters.attendanceStatus);
    }), [attendees, filters]);

    const eventStats = useMemo(() => ({
        total: attendees.length,
        paid: attendees.filter(a => a.paymentStatus === PaymentStatus.SUCCESSFUL).length,
        checkedIn: attendees.filter(a => a.attendanceStatus === AttendanceStatus.CHECKED_IN || a.attendanceStatus === AttendanceStatus.ATTENDED).length,
        attended: attendees.filter(a => a.attendanceStatus === AttendanceStatus.ATTENDED).length,
    }), [attendees]);

    const handleExport = async (format: ExportFormat) => {
        if (!selectedEventId) return;
        setExportLoading(true); setExportProgress(`Preparing ${format.toUpperCase()} export...`);
        try {
            await onExportAttendees(selectedEventId, format, { paymentStatus: filters.paymentStatus, attendanceStatus: filters.attendanceStatus, search: filters.search });
            setExportProgress('Export completed!'); setTimeout(() => setExportProgress(''), 2000);
        } catch { setExportProgress('Export failed.'); setTimeout(() => setExportProgress(''), 3000); }
        finally { setExportLoading(false); }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (error) return (
        <div className="text-center py-20">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><FaExclamationTriangle className="text-2xl text-red-400" /></div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">Error Loading Attendees</h3>
            <p className="text-sm text-red-500">{error}</p>
        </div>
    );

    const statCards = [
        { label: "Total", value: eventStats.total, iconClass: "text-primary bg-primary/5", icon: FaUsers },
        { label: "Paid", value: eventStats.paid, iconClass: "text-emerald-600 bg-emerald-50", icon: FaCheckCircle },
        { label: "Checked In", value: eventStats.checkedIn, iconClass: "text-primary bg-primary/5", icon: FaUserCheck },
        { label: "Attended", value: eventStats.attended, iconClass: "text-violet-600 bg-violet-50", icon: FaCalendarCheck },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <div className="p-2.5 bg-primary/5 text-primary rounded-xl"><FaUsers size={20} /></div>Attendee Management
                </h2>
                <p className="text-slate-500 text-sm ml-[52px]">Manage attendees, track payments, and monitor attendance</p>
            </div>

            {/* Event Selection */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Select Event</p>
                <Select value={selectedEventId || ""} onValueChange={onEventSelect}>
                    <SelectTrigger className="w-full rounded-xl border-slate-200"><SelectValue placeholder="Choose an event" /></SelectTrigger>
                    <SelectContent>{events.map(e => (<SelectItem key={e._id} value={e._id}><span className="font-medium">{e.title}</span> <span className="text-slate-400 ml-2 text-xs">{new Date(e.date).toLocaleDateString()} • {e.attendeeCount} attendees</span></SelectItem>))}</SelectContent>
                </Select>
            </div>

            {selectedEvent && (<>
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map(s => (
                        <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.iconClass}`}><s.icon size={20} /></div>
                            <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{s.label}</p><p className="text-2xl font-black text-slate-800">{s.value}</p></div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                    <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                        <div className="flex flex-col md:flex-row gap-3 flex-1">
                            <div className="relative flex-1"><FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" /><Input placeholder="Search attendees..." value={filters.search} onChange={e => setFilters(p => ({ ...p, search: e.target.value }))} className="pl-10 bg-slate-50 border-slate-200 rounded-xl" /></div>
                            <Select value={filters.paymentStatus} onValueChange={v => setFilters(p => ({ ...p, paymentStatus: v as any }))}><SelectTrigger className="w-full md:w-48 rounded-xl border-slate-200"><SelectValue placeholder="Payment" /></SelectTrigger><SelectContent><SelectItem value="all">All Payments</SelectItem><SelectItem value="successful">Successful</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="failed">Failed</SelectItem><SelectItem value="free">Free</SelectItem></SelectContent></Select>
                            <Select value={filters.attendanceStatus} onValueChange={v => setFilters(p => ({ ...p, attendanceStatus: v as any }))}><SelectTrigger className="w-full md:w-48 rounded-xl border-slate-200"><SelectValue placeholder="Attendance" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="registered">Registered</SelectItem><SelectItem value="checked_in">Checked In</SelectItem><SelectItem value="attended">Attended</SelectItem><SelectItem value="no_show">No Show</SelectItem></SelectContent></Select>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => handleExport(ExportFormat.CSV)} disabled={exportLoading || !filteredAttendees.length} className="rounded-xl text-xs font-bold">{exportLoading ? <FaSpinner className="w-3 h-3 animate-spin mr-1" /> : <FaDownload className="w-3 h-3 mr-1" />} CSV</Button>
                            <Button variant="outline" onClick={() => handleExport(ExportFormat.EXCEL)} disabled={exportLoading || !filteredAttendees.length} className="rounded-xl text-xs font-bold">{exportLoading ? <FaSpinner className="w-3 h-3 animate-spin mr-1" /> : <FaDownload className="w-3 h-3 mr-1" />} Excel</Button>
                        </div>
                    </div>
                    {exportProgress && <div className="mt-2 text-xs text-primary font-bold flex items-center gap-2">{exportLoading && <FaSpinner className="w-3 h-3 animate-spin" />}{exportProgress}</div>}
                </div>

                {/* Attendees */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-sm font-black text-slate-700">Attendees ({filteredAttendees.length})</h3>
                        {(filters.search || filters.paymentStatus !== 'all' || filters.attendanceStatus !== 'all') && <Button variant="ghost" size="sm" onClick={() => setFilters({ search: '', paymentStatus: 'all', attendanceStatus: 'all' })} className="text-primary text-xs font-bold">Clear Filters</Button>}
                    </div>
                    {filteredAttendees.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"><FaUsers className="text-2xl text-slate-300" /></div>
                            <h3 className="text-lg font-bold text-slate-700 mb-2">No attendees found</h3>
                            <p className="text-sm text-slate-400">{attendees.length === 0 ? "No registrations yet." : "Try adjusting your filters."}</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {filteredAttendees.map(attendee => (
                                <div key={attendee.userId} className="p-5 hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-11 h-11"><AvatarImage src={attendee.profilePicture} /><AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">{attendee.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback></Avatar>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-slate-800 text-sm">{attendee.name}</h4>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${paymentBadge[attendee.paymentStatus]}`}>{attendee.paymentStatus}</span>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${attendanceBadge[attendee.attendanceStatus]}`}>{attendee.attendanceStatus.replace('_', ' ')}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1"><FaEnvelope size={10} /> {attendee.email}</span>
                                                    {attendee.phone && <span className="flex items-center gap-1"><FaPhone size={10} /> {attendee.phone}</span>}
                                                    {attendee.organization && <span>• {attendee.organization}</span>}
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-0.5">
                                                    <span>Registered: {new Date(attendee.registrationDate).toLocaleDateString()}</span>
                                                    {attendee.paymentAmount && <span>Amount: {selectedEvent.currency} {attendee.paymentAmount}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <Select value={attendee.attendanceStatus} onValueChange={v => onUpdateAttendance(attendee.userId, v as AttendanceStatus)}>
                                            <SelectTrigger className="w-36 rounded-xl border-slate-200 text-xs"><SelectValue /></SelectTrigger>
                                            <SelectContent><SelectItem value="registered">Registered</SelectItem><SelectItem value="checked_in">Checked In</SelectItem><SelectItem value="attended">Attended</SelectItem><SelectItem value="no_show">No Show</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </>)}
        </div>
    );
}

export default AttendeeManagementSection;