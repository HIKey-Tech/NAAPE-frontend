"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";

export interface Category {
    _id: string;
    name: string;
    description: string;
    slug: string;
    icon?: string;
    order: number;
    isActive: boolean;
    threadCount: number;
    replyCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategoryData {
    name: string;
    description: string;
    slug: string;
    icon?: string;
    order?: number;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
    isActive?: boolean;
}

export interface CategoryOrder {
    id: string;
    order: number;
}

const useCategoryManagement = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isReordering, setIsReordering] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch all categories
    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axios.get("/api/v1/admin/forum/categories");
            setCategories(response.data.data);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to fetch categories";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Create new category
    const createCategory = async (categoryData: CreateCategoryData): Promise<Category | null> => {
        try {
            setIsCreating(true);
            setError(null);
            const response = await axios.post("/api/v1/admin/forum/categories", categoryData);
            const newCategory = response.data.data;
            setCategories(prev => [...prev, newCategory].sort((a, b) => a.order - b.order));
            toast.success("Category created successfully");
            return newCategory;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to create category";
            setError(errorMessage);
            toast.error(errorMessage);
            return null;
        } finally {
            setIsCreating(false);
        }
    };

    // Update category
    const updateCategory = async (categoryId: string, updateData: UpdateCategoryData): Promise<Category | null> => {
        try {
            setIsUpdating(true);
            setError(null);
            const response = await axios.put(`/api/v1/admin/forum/categories/${categoryId}`, updateData);
            const updatedCategory = response.data.data;
            setCategories(prev => 
                prev.map(cat => cat._id === categoryId ? updatedCategory : cat)
                    .sort((a, b) => a.order - b.order)
            );
            toast.success("Category updated successfully");
            return updatedCategory;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to update category";
            setError(errorMessage);
            toast.error(errorMessage);
            return null;
        } finally {
            setIsUpdating(false);
        }
    };

    // Delete category
    const deleteCategory = async (categoryId: string, options?: { migrateTo?: string; deleteThreads?: boolean }): Promise<boolean> => {
        try {
            setIsDeleting(true);
            setError(null);
            await axios.delete(`/api/v1/admin/forum/categories/${categoryId}`, {
                data: options
            });
            setCategories(prev => prev.filter(cat => cat._id !== categoryId));
            toast.success("Category deleted successfully");
            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to delete category";
            setError(errorMessage);
            toast.error(errorMessage);
            return false;
        } finally {
            setIsDeleting(false);
        }
    };

    // Reorder categories
    const reorderCategories = async (categoryOrders: CategoryOrder[]): Promise<boolean> => {
        try {
            setIsReordering(true);
            setError(null);
            const response = await axios.patch("/api/v1/admin/forum/categories/reorder", {
                categoryOrders
            });
            const updatedCategories = response.data.data;
            setCategories(updatedCategories);
            toast.success("Categories reordered successfully");
            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to reorder categories";
            setError(errorMessage);
            toast.error(errorMessage);
            return false;
        } finally {
            setIsReordering(false);
        }
    };

    // Generate slug from name
    const generateSlug = (name: string): string => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    };

    // Validate category data
    const validateCategoryData = (data: CreateCategoryData | UpdateCategoryData): string[] => {
        const errors: string[] = [];
        
        if ('name' in data && data.name !== undefined) {
            if (!data.name || data.name.trim().length === 0) {
                errors.push("Category name is required");
            } else if (data.name.trim().length > 100) {
                errors.push("Category name must be 100 characters or less");
            }
        }

        if ('description' in data && data.description !== undefined) {
            if (!data.description || data.description.trim().length === 0) {
                errors.push("Category description is required");
            } else if (data.description.trim().length > 500) {
                errors.push("Category description must be 500 characters or less");
            }
        }

        if ('slug' in data && data.slug !== undefined) {
            if (!data.slug || data.slug.trim().length === 0) {
                errors.push("Category slug is required");
            } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
                errors.push("Category slug can only contain lowercase letters, numbers, and hyphens");
            }
        }

        if ('order' in data && data.order !== undefined) {
            if (data.order < 0) {
                errors.push("Category order must be a non-negative number");
            }
        }

        return errors;
    };

    // Check if slug is unique
    const isSlugUnique = (slug: string, excludeId?: string): boolean => {
        return !categories.some(cat => 
            cat.slug === slug && cat._id !== excludeId
        );
    };

    // Get category by ID
    const getCategoryById = (categoryId: string): Category | undefined => {
        return categories.find(cat => cat._id === categoryId);
    };

    // Get categories with thread counts
    const getCategoriesWithCounts = () => {
        return categories.map(category => ({
            ...category,
            totalPosts: category.threadCount + category.replyCount
        }));
    };

    // Load categories on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    return {
        // State
        categories,
        isLoading,
        isCreating,
        isUpdating,
        isDeleting,
        isReordering,
        error,

        // Actions
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,

        // Utilities
        generateSlug,
        validateCategoryData,
        isSlugUnique,
        getCategoryById,
        getCategoriesWithCounts,

        // Computed
        hasCategories: categories.length > 0,
        activeCategories: categories.filter(cat => cat.isActive),
        inactiveCategories: categories.filter(cat => !cat.isActive)
    };
};

export default useCategoryManagement;