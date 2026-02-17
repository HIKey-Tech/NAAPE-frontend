"use client";

import React, { useState, useEffect } from "react";
import { useUpdateEvent } from "@/hooks/useEvents";
import { EventCardProps } from "@/app/api/events/type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { FaTimes, FaSpinner } from "react-icons/fa";

interface EditEventModalProps { event: EventCardProps; isOpen: boolean; onClose: () => void; }

const EditEventModal: React.FC<EditEventModalProps> = ({ event, isOpen, onClose }) => {
    const updateEventMutation = useUpdateEvent();
    const [formData, setFormData] = useState({
        title: event.title, date: new Date(event.date).toISOString().split('T')[0],
        location: event.location, description: event.description || '',
        price: event.price.toString(), currency: event.currency || 'NGN', isPaid: event.isPaid,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(event.imageUrl || '');

    useEffect(() => {
        if (isOpen) {
            setFormData({ title: event.title, date: new Date(event.date).toISOString().split('T')[0], location: event.location, description: event.description || '', price: event.price.toString(), currency: event.currency || 'NGN', isPaid: event.isPaid });
            setImagePreview(event.imageUrl || ''); setImageFile(null);
        }
    }, [event, isOpen]);

    const handleInputChange = (field: string, value: string | boolean) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { setImageFile(file); const reader = new FileReader(); reader.onload = (e) => setImagePreview(e.target?.result as string); reader.readAsDataURL(file); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.location.trim()) { toast.error('Title and location are required'); return; }
        try {
            const submitData = new FormData();
            submitData.append('title', formData.title); submitData.append('date', formData.date);
            submitData.append('location', formData.location); submitData.append('description', formData.description);
            submitData.append('price', formData.price); submitData.append('currency', formData.currency);
            submitData.append('isPaid', formData.isPaid.toString());
            if (imageFile) submitData.append('image', imageFile);
            await updateEventMutation.mutateAsync({ eventId: event.id, data: submitData });
            toast.success('Event updated successfully'); onClose();
        } catch (error: any) { toast.error(error.message || 'Failed to update event'); }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl border border-slate-100">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                    <h2 className="text-xl font-black text-slate-900">Edit Event</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"><FaTimes className="w-3 h-3 text-slate-500" /></button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Image */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Event Image</Label>
                        {imagePreview && (
                            <div className="w-full h-48 bg-slate-100 rounded-xl overflow-hidden">
                                <img src={imagePreview} alt="Event preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <Input type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer rounded-xl border-slate-200" />
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Event Title *</Label>
                        <Input value={formData.title} onChange={e => handleInputChange('title', e.target.value)} placeholder="Enter event title" required className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Event Date *</Label>
                        <Input type="date" value={formData.date} onChange={e => handleInputChange('date', e.target.value)} required className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Location *</Label>
                        <Input value={formData.location} onChange={e => handleInputChange('location', e.target.value)} placeholder="Enter event location" required className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Description</Label>
                        <Textarea value={formData.description} onChange={e => handleInputChange('description', e.target.value)} placeholder="Enter event description" rows={4} className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                    </div>

                    {/* Payment Settings */}
                    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="isPaid" checked={formData.isPaid} onChange={e => handleInputChange('isPaid', e.target.checked)} className="rounded border-slate-300 text-primary focus:ring-primary" />
                            <Label htmlFor="isPaid" className="text-sm font-bold text-slate-700">This is a paid event</Label>
                        </div>
                        {formData.isPaid && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Price *</Label>
                                    <Input type="number" value={formData.price} onChange={e => handleInputChange('price', e.target.value)} placeholder="0" min="0" step="0.01" required={formData.isPaid} className="rounded-xl border-slate-200 bg-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Currency</Label>
                                    <Select value={formData.currency} onValueChange={v => handleInputChange('currency', v)}>
                                        <SelectTrigger className="rounded-xl border-slate-200"><SelectValue /></SelectTrigger>
                                        <SelectContent><SelectItem value="NGN">NGN (₦)</SelectItem><SelectItem value="USD">USD ($)</SelectItem><SelectItem value="EUR">EUR (€)</SelectItem><SelectItem value="GBP">GBP (£)</SelectItem></SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button type="button" variant="outline" onClick={onClose} className="rounded-xl font-bold">Cancel</Button>
                        <Button type="submit" disabled={updateEventMutation.isPending} className="bg-primary hover:bg-primary/90 rounded-xl font-bold shadow-md shadow-primary/20">
                            {updateEventMutation.isPending ? <><FaSpinner className="w-3 h-3 animate-spin mr-2" /> Updating...</> : 'Update Event'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEventModal;