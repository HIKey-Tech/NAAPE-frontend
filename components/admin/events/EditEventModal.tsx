"use client";

import React, { useState, useEffect } from "react";
import { useUpdateEvent } from "@/hooks/useEvents";
import { EventCardProps } from "@/app/api/events/type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { FaTimes, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillAlt, FaImage } from "react-icons/fa";

interface EditEventModalProps {
    event: EventCardProps;
    isOpen: boolean;
    onClose: () => void;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ event, isOpen, onClose }) => {
    const updateEventMutation = useUpdateEvent();
    const [formData, setFormData] = useState({
        title: event.title,
        date: new Date(event.date).toISOString().split('T')[0],
        location: event.location,
        description: event.description || '',
        price: event.price.toString(),
        currency: event.currency || 'NGN',
        isPaid: event.isPaid,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(event.imageUrl || '');

    useEffect(() => {
        if (isOpen) {
            setFormData({
                title: event.title,
                date: new Date(event.date).toISOString().split('T')[0],
                location: event.location,
                description: event.description || '',
                price: event.price.toString(),
                currency: event.currency || 'NGN',
                isPaid: event.isPaid,
            });
            setImagePreview(event.imageUrl || '');
            setImageFile(null);
        }
    }, [event, isOpen]);

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.title.trim() || !formData.location.trim()) {
            toast.error('Title and location are required');
            return;
        }

        try {
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('date', formData.date);
            submitData.append('location', formData.location);
            submitData.append('description', formData.description);
            submitData.append('price', formData.price);
            submitData.append('currency', formData.currency);
            submitData.append('isPaid', formData.isPaid.toString());
            
            if (imageFile) {
                submitData.append('image', imageFile);
            }

            await updateEventMutation.mutateAsync({
                eventId: event.id,
                data: submitData
            });

            toast.success('Event updated successfully');
            onClose();
        } catch (error: any) {
            console.error('Update event error:', error);
            toast.error(error.message || 'Failed to update event');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-bold">Edit Event</CardTitle>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <FaTimes className="w-4 h-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Event Image */}
                        <div className="space-y-2">
                            <Label htmlFor="image">Event Image</Label>
                            <div className="flex flex-col gap-2">
                                {imagePreview && (
                                    <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                                        <img 
                                            src={imagePreview} 
                                            alt="Event preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Event Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Event Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                placeholder="Enter event title"
                                required
                            />
                        </div>

                        {/* Event Date */}
                        <div className="space-y-2">
                            <Label htmlFor="date">Event Date *</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => handleInputChange('date', e.target.value)}
                                required
                            />
                        </div>

                        {/* Event Location */}
                        <div className="space-y-2">
                            <Label htmlFor="location">Location *</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                placeholder="Enter event location"
                                required
                            />
                        </div>

                        {/* Event Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Enter event description"
                                rows={4}
                            />
                        </div>

                        {/* Payment Settings */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="isPaid"
                                    checked={formData.isPaid}
                                    onChange={(e) => handleInputChange('isPaid', e.target.checked)}
                                    className="rounded"
                                />
                                <Label htmlFor="isPaid">This is a paid event</Label>
                            </div>

                            {formData.isPaid && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price *</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => handleInputChange('price', e.target.value)}
                                            placeholder="0"
                                            min="0"
                                            step="0.01"
                                            required={formData.isPaid}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="currency">Currency</Label>
                                        <Select 
                                            value={formData.currency} 
                                            onValueChange={(value) => handleInputChange('currency', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="NGN">NGN (₦)</SelectItem>
                                                <SelectItem value="USD">USD ($)</SelectItem>
                                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                                <SelectItem value="GBP">GBP (£)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={updateEventMutation.isPending}
                                className="bg-primary hover:bg-primary/90"
                            >
                                {updateEventMutation.isPending ? 'Updating...' : 'Update Event'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditEventModal;