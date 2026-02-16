"use client";

import React, { useState, useEffect } from "react";
import { FaTimes, FaSpinner } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateCategoryData, UpdateCategoryData, Category } from "@/hooks/useCategoryManagement";

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateCategoryData) => Promise<Category | null>;
    isLoading: boolean;
    title: string;
    initialData?: Category;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading,
    title,
    initialData
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        slug: '',
        icon: '',
        order: 0
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isAutoSlug, setIsAutoSlug] = useState(true);

    // Initialize form data
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                description: initialData.description,
                slug: initialData.slug,
                icon: initialData.icon || '',
                order: initialData.order
            });
            setIsAutoSlug(false);
        } else {
            setFormData({
                name: '',
                description: '',
                slug: '',
                icon: '',
                order: 0
            });
            setIsAutoSlug(true);
        }
        setErrors({});
    }, [initialData, isOpen]);

    // Auto-generate slug from name
    useEffect(() => {
        if (isAutoSlug && formData.name) {
            const slug = formData.name
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.name, isAutoSlug]);

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }

        // Disable auto-slug if user manually edits slug
        if (field === 'slug') {
            setIsAutoSlug(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Category name is required';
        } else if (formData.name.trim().length > 100) {
            newErrors.name = 'Category name must be 100 characters or less';
        }

        // Description validation
        if (!formData.description.trim()) {
            newErrors.description = 'Category description is required';
        } else if (formData.description.trim().length > 500) {
            newErrors.description = 'Category description must be 500 characters or less';
        }

        // Slug validation
        if (!formData.slug.trim()) {
            newErrors.slug = 'Category slug is required';
        } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
            newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
        }

        // Order validation
        if (formData.order < 0) {
            newErrors.order = 'Order must be a non-negative number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const submitData = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            slug: formData.slug.trim(),
            icon: formData.icon.trim() || undefined,
            order: formData.order
        };

        const result = await onSubmit(submitData);
        if (result) {
            onClose();
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="h-8 w-8 p-0"
                    >
                        <FaTimes className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Category Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Category Name *</Label>
                            <Input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter category name"
                                disabled={isLoading}
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Category Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Enter category description"
                                disabled={isLoading}
                                rows={3}
                                className={errors.description ? 'border-red-500' : ''}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-600">{errors.description}</p>
                            )}
                            <p className="text-xs text-gray-500">
                                {formData.description.length}/500 characters
                            </p>
                        </div>

                        {/* Category Slug */}
                        <div className="space-y-2">
                            <Label htmlFor="slug">URL Slug *</Label>
                            <Input
                                id="slug"
                                type="text"
                                value={formData.slug}
                                onChange={(e) => handleInputChange('slug', e.target.value)}
                                placeholder="category-url-slug"
                                disabled={isLoading}
                                className={errors.slug ? 'border-red-500' : ''}
                            />
                            {errors.slug && (
                                <p className="text-sm text-red-600">{errors.slug}</p>
                            )}
                            <p className="text-xs text-gray-500">
                                Used in URLs. Only lowercase letters, numbers, and hyphens allowed.
                                {isAutoSlug && " (Auto-generated from name)"}
                            </p>
                        </div>

                        {/* Category Icon */}
                        <div className="space-y-2">
                            <Label htmlFor="icon">Icon (Optional)</Label>
                            <Input
                                id="icon"
                                type="text"
                                value={formData.icon}
                                onChange={(e) => handleInputChange('icon', e.target.value)}
                                placeholder="📚 (emoji or icon)"
                                disabled={isLoading}
                                maxLength={10}
                            />
                            <p className="text-xs text-gray-500">
                                Emoji or short icon text to display with the category
                            </p>
                        </div>

                        {/* Display Order */}
                        <div className="space-y-2">
                            <Label htmlFor="order">Display Order</Label>
                            <Input
                                id="order"
                                type="number"
                                min="0"
                                value={formData.order}
                                onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
                                placeholder="0"
                                disabled={isLoading}
                                className={errors.order ? 'border-red-500' : ''}
                            />
                            {errors.order && (
                                <p className="text-sm text-red-600">{errors.order}</p>
                            )}
                            <p className="text-xs text-gray-500">
                                Lower numbers appear first. Leave as 0 to add at the end.
                            </p>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading && <FaSpinner className="w-4 h-4 mr-2 animate-spin" />}
                                {initialData ? 'Update Category' : 'Create Category'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CategoryModal;