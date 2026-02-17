"use client";

import React, { useState, useEffect } from "react";
import { FaTimes, FaSpinner } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreateCategoryData, Category } from "@/hooks/useCategoryManagement";

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateCategoryData) => Promise<Category | null>;
    isLoading: boolean;
    title: string;
    initialData?: Category;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSubmit, isLoading, title, initialData }) => {
    const [formData, setFormData] = useState({ name: '', description: '', icon: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (initialData) setFormData({ name: initialData.name, description: initialData.description, icon: initialData.icon || '' });
        else setFormData({ name: '', description: '', icon: '' });
        setErrors({});
    }, [initialData, isOpen]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Category name is required';
        else if (formData.name.trim().length > 100) newErrors.name = 'Must be 100 characters or less';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        else if (formData.description.trim().length > 500) newErrors.description = 'Must be 500 characters or less';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        const slug = formData.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
        const result = await onSubmit({ name: formData.name.trim(), description: formData.description.trim(), slug, icon: formData.icon.trim() || undefined, order: initialData?.order || 0 });
        if (result) onClose();
    };

    const handleClose = () => { if (!isLoading) onClose(); };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <h2 className="text-lg font-black text-slate-900">{title}</h2>
                    <button onClick={handleClose} disabled={isLoading} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"><FaTimes className="w-3 h-3 text-slate-500" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Category Name *</Label>
                        <Input value={formData.name} onChange={e => handleInputChange('name', e.target.value)} placeholder="Enter category name" disabled={isLoading} className={`rounded-xl border-slate-200 bg-slate-50 focus:bg-white ${errors.name ? 'border-red-400' : ''}`} />
                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Description *</Label>
                        <Textarea value={formData.description} onChange={e => handleInputChange('description', e.target.value)} placeholder="Enter category description" disabled={isLoading} rows={3} className={`rounded-xl border-slate-200 bg-slate-50 focus:bg-white ${errors.description ? 'border-red-400' : ''}`} />
                        {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                        <p className="text-[10px] text-slate-400">{formData.description.length}/500 characters</p>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Icon (Optional)</Label>
                        <Input value={formData.icon} onChange={e => handleInputChange('icon', e.target.value)} placeholder="📚 (emoji or icon)" disabled={isLoading} maxLength={10} className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                        <p className="text-[10px] text-slate-400">Emoji or short icon text for the category</p>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading} className="rounded-xl font-bold">Cancel</Button>
                        <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 rounded-xl font-bold shadow-md shadow-primary/20">
                            {isLoading && <FaSpinner className="w-3 h-3 mr-2 animate-spin" />}
                            {initialData ? 'Update Category' : 'Create Category'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;