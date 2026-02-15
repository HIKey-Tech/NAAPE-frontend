"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useEvents, useCreateEvent } from "@/hooks/useEvents";
import { EventCardProps } from "@/app/api/events/type";
import { 
    FaPlus, 
    FaSearch, 
    FaFilter, 
    FaEdit, 
    FaTrash, 
    FaEye,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaMoneyBillAlt,
    FaUsers,
    FaCheckCircle,
    FaTimesCircle,
    FaClock
} from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";

// Enhanced Event interface with status
interface EnhancedEvent extends EventCardProps {
    status?: EventStatus;
}

enum EventStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published', 
    CANCELLED = 'cancelled',
    COMPLETED = 'completed'
}

interface EventManagementSectionProps {
    onCreateEvent?: () => void;
}

interface EventFilters {
    search: string;
    status: string;
    isPaid: string;
    dateRange: string;
}

const EventManagementSection: React.FC<EventManagementSectionProps> = ({ onCreateEvent }) => {
    const { data: events = [], isLoading, error, refetch } = useEvents();
    const [filters, setFilters] = useState<EventFilters>({
        search: '',
        status: 'all',
        isPaid: 'all',
        dateRange: 'all'
    });
    const [selectedEvent, setSelectedEvent] = useState<EnhancedEvent | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Determine event status based on date and other factors
    const getEventStatus = useCallback((event: EventCardProps): EventStatus => {
        const eventDate = new Date(event.date);
        const now = new Date();
        
        // If event date has passed, it's completed
        if (eventDate < now) {
            return EventStatus.COMPLETED;
        }
        
        // For now, assume all future events are published
        // In a real implementation, you'd have a status field in the database
        return EventStatus.PUBLISHED;
    }, []);

    // Enhanced events with status
    const enhancedEvents: EnhancedEvent[] = useMemo(() => {
        return events.map((event: EventCardProps) => ({
            ...event,
            status: getEventStatus(event)
        }));
    }, [events, getEventStatus]);

    // Filter events based on current filters
    const filteredEvents = useMemo(() => {
        return enhancedEvents.filter(event => {
            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const matchesSearch = 
                    event.title.toLowerCase().includes(searchLower) ||
                    event.location.toLowerCase().includes(searchLower) ||
                    (event.description && event.description.toLowerCase().includes(searchLower));
                
                if (!matchesSearch) return false;
            }

            // Status filter
            if (filters.status !== 'all' && event.status !== filters.status) {
                return false;
            }

            // Paid/Free filter
            if (filters.isPaid !== 'all') {
                const isPaidFilter = filters.isPaid === 'paid';
                if (event.isPaid !== isPaidFilter) return false;
            }

            // Date range filter
            if (filters.dateRange !== 'all') {
                const eventDate = new Date(event.date);
                const now = new Date();
                
                switch (filters.dateRange) {
                    case 'upcoming':
                        if (eventDate <= now) return false;
                        break;
                    case 'past':
                        if (eventDate > now) return false;
                        break;
                    case 'this-month':
                        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                        if (eventDate < thisMonth || eventDate >= nextMonth) return false;
                        break;
                }
            }

            return true;
        });
    }, [enhancedEvents, filters]);

    // Event statistics
    const eventStats = useMemo(() => {
        const total = enhancedEvents.length;
        const published = enhancedEvents.filter(e => e.status === EventStatus.PUBLISHED).length;
        const completed = enhancedEvents.filter(e => e.status === EventStatus.COMPLETED).length;
        const cancelled = enhancedEvents.filter(e => e.status === EventStatus.CANCELLED).length;
        const totalRevenue = enhancedEvents
            .filter(e => e.isPaid && e.payments)
            .reduce((sum, e) => {
                const eventRevenue = e.payments?.reduce((eventSum, payment) => {
                    return payment.status === 'successful' ? eventSum + payment.amount : eventSum;
                }, 0) || 0;
                return sum + eventRevenue;
            }, 0);

        return { total, published, completed, cancelled, totalRevenue };
    }, [enhancedEvents]);

    const handleFilterChange = (key: keyof EventFilters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleEditEvent = (event: EnhancedEvent) => {
        setSelectedEvent(event);
        setIsEditModalOpen(true);
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            return;
        }

        try {
            // TODO: Implement delete event API call
            toast.success('Event deleted successfully');
            refetch();
        } catch (error) {
            toast.error('Failed to delete event');
        }
    };

    const getStatusBadge = (status: EventStatus) => {
        const statusConfig = {
            [EventStatus.DRAFT]: { color: 'bg-gray-100 text-gray-800', icon: FaClock },
            [EventStatus.PUBLISHED]: { color: 'bg-green-100 text-green-800', icon: FaCheckCircle },
            [EventStatus.CANCELLED]: { color: 'bg-red-100 text-red-800', icon: FaTimesCircle },
            [EventStatus.COMPLETED]: { color: 'bg-blue-100 text-blue-800', icon: FaCheckCircle }
        };

        const config = statusConfig[status];
        const IconComponent = config.icon;

        return (
            <Badge className={`${config.color} flex items-center gap-1`}>
                <IconComponent className="w-3 h-3" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 mb-4">Failed to load events</p>
                <Button onClick={() => refetch()} variant="outline">
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Create Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
                    <p className="text-gray-600">Create, edit, and manage all association events</p>
                </div>
                <Button 
                    onClick={onCreateEvent}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                >
                    <FaPlus className="w-4 h-4" />
                    Create Event
                </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Events</p>
                                <p className="text-2xl font-bold text-gray-900">{eventStats.total}</p>
                            </div>
                            <FaCalendarAlt className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Events</p>
                                <p className="text-2xl font-bold text-green-600">{eventStats.published}</p>
                            </div>
                            <FaCheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-blue-600">{eventStats.completed}</p>
                            </div>
                            <FaUsers className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    ₦{eventStats.totalRevenue.toLocaleString()}
                                </p>
                            </div>
                            <FaMoneyBillAlt className="w-8 h-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search events..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Status Filter */}
                        <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Paid/Free Filter */}
                        <Select value={filters.isPaid} onValueChange={(value) => handleFilterChange('isPaid', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="paid">Paid Events</SelectItem>
                                <SelectItem value="free">Free Events</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Date Range Filter */}
                        <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by date" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Dates</SelectItem>
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                <SelectItem value="past">Past Events</SelectItem>
                                <SelectItem value="this-month">This Month</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Events List */}
            <div className="space-y-4">
                {filteredEvents.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <FaCalendarAlt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
                            <p className="text-gray-600 mb-4">
                                {filters.search || filters.status !== 'all' || filters.isPaid !== 'all' || filters.dateRange !== 'all'
                                    ? 'No events match your current filters.'
                                    : 'Get started by creating your first event.'
                                }
                            </p>
                            {(!filters.search && filters.status === 'all' && filters.isPaid === 'all' && filters.dateRange === 'all') && (
                                <Button onClick={onCreateEvent} className="bg-primary hover:bg-primary/90">
                                    <FaPlus className="w-4 h-4 mr-2" />
                                    Create Your First Event
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    filteredEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onEdit={() => handleEditEvent(event)}
                            onDelete={() => handleDeleteEvent(event.id)}
                            getStatusBadge={getStatusBadge}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

// Event Card Component
interface EventCardComponentProps {
    event: EnhancedEvent;
    onEdit: () => void;
    onDelete: () => void;
    getStatusBadge: (status: EventStatus) => React.JSX.Element;
}

const EventCard: React.FC<EventCardComponentProps> = ({ event, onEdit, onDelete, getStatusBadge }) => {
    const eventDate = new Date(event.date);
    const registeredCount = event.registeredUsers?.length || 0;
    const revenue = event.payments?.reduce((sum, payment) => {
        return payment.status === 'successful' ? sum + payment.amount : sum;
    }, 0) || 0;

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Event Image */}
                    <div className="lg:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                        {event.imageUrl ? (
                            <img 
                                src={event.imageUrl} 
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <FaCalendarAlt className="w-8 h-8 text-gray-400" />
                            </div>
                        )}
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
                                {event.status && getStatusBadge(event.status)}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={onEdit}>
                                    <FaEdit className="w-4 h-4 mr-1" />
                                    Edit
                                </Button>
                                <Button variant="outline" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700">
                                    <FaTrash className="w-4 h-4 mr-1" />
                                    Delete
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <FaCalendarAlt className="w-4 h-4" />
                                <span>{format(eventDate, 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <FaMapMarkerAlt className="w-4 h-4" />
                                <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <FaUsers className="w-4 h-4" />
                                <span>{registeredCount} registered</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <FaMoneyBillAlt className="w-4 h-4" />
                                <span>
                                    {event.isPaid 
                                        ? `₦${event.price.toLocaleString()} (₦${revenue.toLocaleString()} revenue)`
                                        : 'Free'
                                    }
                                </span>
                            </div>
                        </div>

                        {event.description && (
                            <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default EventManagementSection;