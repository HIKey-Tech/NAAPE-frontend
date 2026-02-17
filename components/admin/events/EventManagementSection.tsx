"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useEvents, useDeleteEvent } from "@/hooks/useEvents";
import { EventCardProps } from "@/app/api/events/type";
import EditEventModal from "./EditEventModal";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillAlt, FaUsers, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";

interface EnhancedEvent extends EventCardProps { status?: EventStatus; }
enum EventStatus { DRAFT = 'draft', PUBLISHED = 'published', CANCELLED = 'cancelled', COMPLETED = 'completed' }
interface EventManagementSectionProps { onCreateEvent?: () => void; }
interface EventFilters { search: string; status: string; isPaid: string; dateRange: string; }

const statusConfig: Record<string, { className: string; icon: React.ElementType }> = {
    draft: { className: "bg-slate-100 text-slate-600", icon: FaClock },
    published: { className: "bg-emerald-50 text-emerald-700 border border-emerald-100", icon: FaCheckCircle },
    cancelled: { className: "bg-red-50 text-red-700 border border-red-100", icon: FaTimesCircle },
    completed: { className: "bg-primary/5 text-primary border border-primary/10", icon: FaCheckCircle },
};

const EventManagementSection: React.FC<EventManagementSectionProps> = ({ onCreateEvent }) => {
    const { data: events = [], isLoading, error, refetch } = useEvents();
    const deleteEventMutation = useDeleteEvent();
    const [filters, setFilters] = useState<EventFilters>({ search: '', status: 'all', isPaid: 'all', dateRange: 'all' });
    const [selectedEvent, setSelectedEvent] = useState<EnhancedEvent | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const getEventStatus = useCallback((event: EventCardProps): EventStatus => {
        const eventDate = new Date(event.date);
        return eventDate < new Date() ? EventStatus.COMPLETED : EventStatus.PUBLISHED;
    }, []);

    const enhancedEvents: EnhancedEvent[] = useMemo(() => events.map((event: EventCardProps) => ({ ...event, status: getEventStatus(event) })), [events, getEventStatus]);

    const filteredEvents = useMemo(() => {
        return enhancedEvents.filter(event => {
            if (filters.search) {
                const s = filters.search.toLowerCase();
                if (!event.title.toLowerCase().includes(s) && !event.location.toLowerCase().includes(s) && !(event.description?.toLowerCase().includes(s))) return false;
            }
            if (filters.status !== 'all' && event.status !== filters.status) return false;
            if (filters.isPaid !== 'all') { if (event.isPaid !== (filters.isPaid === 'paid')) return false; }
            if (filters.dateRange !== 'all') {
                const eventDate = new Date(event.date); const now = new Date();
                if (filters.dateRange === 'upcoming' && eventDate <= now) return false;
                if (filters.dateRange === 'past' && eventDate > now) return false;
                if (filters.dateRange === 'this-month') {
                    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                    if (eventDate < thisMonth || eventDate >= nextMonth) return false;
                }
            }
            return true;
        });
    }, [enhancedEvents, filters]);

    const eventStats = useMemo(() => {
        const total = enhancedEvents.length;
        const published = enhancedEvents.filter(e => e.status === EventStatus.PUBLISHED).length;
        const completed = enhancedEvents.filter(e => e.status === EventStatus.COMPLETED).length;
        const totalRevenue = enhancedEvents.filter(e => e.isPaid && e.payments).reduce((sum, e) => sum + (e.payments?.reduce((s, p) => p.status === 'successful' ? s + p.amount : s, 0) || 0), 0);
        return { total, published, completed, totalRevenue };
    }, [enhancedEvents]);

    const handleFilterChange = (key: keyof EventFilters, value: string) => setFilters(prev => ({ ...prev, [key]: value }));
    const handleEditEvent = (event: EnhancedEvent) => { setSelectedEvent(event); setIsEditModalOpen(true); };
    const handleDeleteEvent = async (eventId: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        try { await deleteEventMutation.mutateAsync(eventId); toast.success('Event deleted'); } catch (error: any) { toast.error(error.message || 'Failed to delete event'); }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><FaTimesCircle className="text-2xl text-red-400" /></div>
                <h3 className="text-lg font-bold text-slate-700 mb-2">Failed to load events</h3>
                <Button onClick={() => refetch()} variant="outline" className="rounded-xl">Try Again</Button>
            </div>
        );
    }

    const stats = [
        { label: "Total Events", value: eventStats.total, icon: FaCalendarAlt, iconClass: "text-primary bg-primary/5" },
        { label: "Active", value: eventStats.published, icon: FaCheckCircle, iconClass: "text-emerald-600 bg-emerald-50" },
        { label: "Completed", value: eventStats.completed, icon: FaUsers, iconClass: "text-primary bg-primary/5" },
        { label: "Revenue", value: `₦${eventStats.totalRevenue.toLocaleString()}`, icon: FaMoneyBillAlt, iconClass: "text-violet-600 bg-violet-50" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Event Management</h1>
                    <p className="text-slate-500 text-sm">Create, edit, and manage all events</p>
                </div>
                <Button onClick={onCreateEvent} className="bg-primary hover:bg-primary/90 rounded-xl text-sm font-bold shadow-md shadow-primary/20"><FaPlus className="w-3 h-3 mr-2" /> Create Event</Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.iconClass}`}><s.icon size={20} /></div>
                        <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{s.label}</p><p className="text-2xl font-black text-slate-800">{s.value}</p></div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input placeholder="Search events..." value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} className="pl-10 bg-slate-50 border-slate-200 rounded-xl focus:bg-white" />
                    </div>
                    <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}><SelectTrigger className="rounded-xl border-slate-200"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="published">Published</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent></Select>
                    <Select value={filters.isPaid} onValueChange={(v) => handleFilterChange('isPaid', v)}><SelectTrigger className="rounded-xl border-slate-200"><SelectValue placeholder="Type" /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="paid">Paid</SelectItem><SelectItem value="free">Free</SelectItem></SelectContent></Select>
                    <Select value={filters.dateRange} onValueChange={(v) => handleFilterChange('dateRange', v)}><SelectTrigger className="rounded-xl border-slate-200"><SelectValue placeholder="Date" /></SelectTrigger><SelectContent><SelectItem value="all">All Dates</SelectItem><SelectItem value="upcoming">Upcoming</SelectItem><SelectItem value="past">Past</SelectItem><SelectItem value="this-month">This Month</SelectItem></SelectContent></Select>
                </div>
            </div>

            {/* Events List */}
            <div className="space-y-4">
                {filteredEvents.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm text-center py-16">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"><FaCalendarAlt className="text-2xl text-slate-300" /></div>
                        <h3 className="text-lg font-bold text-slate-700 mb-2">No events found</h3>
                        <p className="text-sm text-slate-400 mb-4">{filters.search || filters.status !== 'all' ? 'Try adjusting your filters.' : 'Create your first event.'}</p>
                        {!filters.search && filters.status === 'all' && <Button onClick={onCreateEvent} className="bg-primary rounded-xl font-bold"><FaPlus className="w-3 h-3 mr-2" /> Create Event</Button>}
                    </div>
                ) : (
                    filteredEvents.map((event) => {
                        const eventDate = new Date(event.date);
                        const registeredCount = event.registeredUsers?.length || 0;
                        const revenue = event.payments?.reduce((sum, p) => p.status === 'successful' ? sum + p.amount : sum, 0) || 0;
                        const sc = statusConfig[event.status || 'published'];
                        const StatusIcon = sc.icon;
                        return (
                            <div key={event.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="lg:w-48 h-32 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                                        {event.imageUrl ? <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><FaCalendarAlt className="text-2xl text-slate-300" /></div>}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900 mb-1.5">{event.title}</h3>
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${sc.className}`}><StatusIcon size={10} /> {(event.status || 'published').charAt(0).toUpperCase() + (event.status || 'published').slice(1)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)} className="rounded-xl text-xs font-bold"><FaEdit className="w-3 h-3 mr-1" /> Edit</Button>
                                                <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(event.id)} className="rounded-xl text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50" disabled={deleteEventMutation.isPending}><FaTrash className="w-3 h-3 mr-1" /> Delete</Button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                                            <div className="flex items-center gap-2 text-slate-500"><FaCalendarAlt size={12} /> {format(eventDate, 'MMM dd, yyyy')}</div>
                                            <div className="flex items-center gap-2 text-slate-500"><FaMapMarkerAlt size={12} /> {event.location}</div>
                                            <div className="flex items-center gap-2 text-slate-500"><FaUsers size={12} /> {registeredCount} registered</div>
                                            <div className="flex items-center gap-2 text-slate-500"><FaMoneyBillAlt size={12} /> {event.isPaid ? `₦${event.price.toLocaleString()}` : 'Free'}</div>
                                        </div>
                                        {event.description && <p className="text-slate-500 text-sm line-clamp-2">{event.description}</p>}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {selectedEvent && <EditEventModal event={selectedEvent} isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedEvent(null); }} />}
        </div>
    );
};

export default EventManagementSection;