"use client";

import React, { useState } from "react";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaGripVertical,
    FaEye,
    FaEyeSlash,
    FaComments,
    FaReply,
    FaSyncAlt,
    FaExclamationTriangle,
    FaArrowUp,
    FaArrowDown
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import useCategoryManagement, { Category, CreateCategoryData, UpdateCategoryData } from "@/hooks/useCategoryManagement";
import CategoryModal from "@/components/admin/forum/CategoryModal";
import DeleteCategoryModal from "@/components/admin/forum/DeleteCategoryModal";

const CategoryManagementSection: React.FC = () => {
    const {
        categories,
        isLoading,
        isCreating,
        isUpdating,
        isDeleting,
        isReordering,
        error,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        getCategoriesWithCounts
    } = useCategoryManagement();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
    const [draggedCategory, setDraggedCategory] = useState<Category | null>(null);

    const categoriesWithCounts = getCategoriesWithCounts();

    const handleCreateCategory = async (data: CreateCategoryData): Promise<Category | null> => {
        return await createCategory(data);
    };

    const handleUpdateCategory = async (data: CreateCategoryData): Promise<Category | null> => {
        if (!editingCategory) return null;
        // Convert CreateCategoryData to UpdateCategoryData for the update call
        const updateData: UpdateCategoryData = {
            name: data.name,
            description: data.description,
            slug: data.slug,
            icon: data.icon,
            order: data.order
        };
        return await updateCategory(editingCategory._id, updateData);
    };

    const handleCreateCategoryClick = () => {
        setShowCreateModal(true);
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
    };

    const handleDeleteCategory = (category: Category) => {
        setDeletingCategory(category);
    };

    const handleToggleActive = async (category: Category) => {
        await updateCategory(category._id, {
            isActive: !category.isActive
        });
    };

    const handleMoveUp = async (category: Category) => {
        const currentIndex = categories.findIndex(cat => cat._id === category._id);
        if (currentIndex > 0) {
            const newOrders = categories.map((cat, index) => {
                if (index === currentIndex) {
                    return { id: cat._id, order: categories[currentIndex - 1].order };
                } else if (index === currentIndex - 1) {
                    return { id: cat._id, order: category.order };
                }
                return { id: cat._id, order: cat.order };
            });
            await reorderCategories(newOrders);
        }
    };

    const handleMoveDown = async (category: Category) => {
        const currentIndex = categories.findIndex(cat => cat._id === category._id);
        if (currentIndex < categories.length - 1) {
            const newOrders = categories.map((cat, index) => {
                if (index === currentIndex) {
                    return { id: cat._id, order: categories[currentIndex + 1].order };
                } else if (index === currentIndex + 1) {
                    return { id: cat._id, order: category.order };
                }
                return { id: cat._id, order: cat.order };
            });
            await reorderCategories(newOrders);
        }
    };

    // Drag and drop handlers
    const handleDragStart = (e: React.DragEvent, category: Category) => {
        setDraggedCategory(category);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", category._id);
        
        // Add visual feedback
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.opacity = "0.5";
        }
    };

    const handleDragEnd = (e: React.DragEvent) => {
        // Reset visual feedback
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.opacity = "1";
        }
        setDraggedCategory(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        // Add visual feedback for drop target
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.classList.add("border-blue-400", "bg-blue-50");
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        // Remove visual feedback when leaving drop target
        if (e.currentTarget instanceof HTMLElement && !e.currentTarget.contains(e.relatedTarget as Node)) {
            e.currentTarget.classList.remove("border-blue-400", "bg-blue-50");
        }
    };

    const handleDrop = async (e: React.DragEvent, targetCategory: Category) => {
        e.preventDefault();
        
        // Remove visual feedback
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.classList.remove("border-blue-400", "bg-blue-50");
        }
        
        if (!draggedCategory || draggedCategory._id === targetCategory._id) {
            setDraggedCategory(null);
            return;
        }

        const draggedIndex = categories.findIndex(cat => cat._id === draggedCategory._id);
        const targetIndex = categories.findIndex(cat => cat._id === targetCategory._id);

        if (draggedIndex === -1 || targetIndex === -1) {
            setDraggedCategory(null);
            return;
        }

        // Create new order array
        const newCategories = [...categories];
        const [removed] = newCategories.splice(draggedIndex, 1);
        newCategories.splice(targetIndex, 0, removed);

        // Generate new orders
        const newOrders = newCategories.map((cat, index) => ({
            id: cat._id,
            order: index + 1
        }));

        await reorderCategories(newOrders);
        setDraggedCategory(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading categories...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 mb-4">Error loading categories: {error}</p>
                    <Button onClick={fetchCategories} variant="outline">
                        <FaSyncAlt className="w-4 h-4 mr-2" />
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
                    <p className="text-gray-600">Create, edit, and organize forum categories</p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        onClick={fetchCategories} 
                        disabled={isLoading}
                        variant="outline"
                        size="sm"
                    >
                        <FaSyncAlt className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button 
                        onClick={handleCreateCategoryClick}
                        disabled={isCreating}
                        size="sm"
                    >
                        <FaPlus className="w-4 h-4 mr-2" />
                        Create Category
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
                        <FaComments className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{categories.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {categories.filter(cat => cat.isActive).length} active
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Threads</CardTitle>
                        <FaComments className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {categoriesWithCounts.reduce((sum, cat) => sum + (cat.threadCount || 0), 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Across all categories
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Replies</CardTitle>
                        <FaReply className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {categoriesWithCounts.reduce((sum, cat) => sum + (cat.replyCount || 0), 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Across all categories
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Most Active</CardTitle>
                        <FaComments className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {(() => {
                                const mostActive = categoriesWithCounts
                                    .filter(cat => (cat.totalPosts || 0) > 0)
                                    .sort((a, b) => (b.totalPosts || 0) - (a.totalPosts || 0))[0];
                                return mostActive 
                                    ? (mostActive.name.length > 12 ? mostActive.name.substring(0, 12) + '...' : mostActive.name)
                                    : 'None';
                            })()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {(() => {
                                const mostActive = categoriesWithCounts
                                    .filter(cat => (cat.totalPosts || 0) > 0)
                                    .sort((a, b) => (b.totalPosts || 0) - (a.totalPosts || 0))[0];
                                return mostActive ? `${mostActive.totalPosts || 0} posts` : 'No activity';
                            })()}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Categories List */}
            <Card className="relative">
                {isReordering && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600">Reordering categories...</p>
                        </div>
                    </div>
                )}
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FaComments className="w-5 h-5" />
                        Categories
                        <Badge variant="secondary" className="ml-2">
                            {categories.length}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {categories.length === 0 ? (
                        <div className="text-center py-12">
                            <FaComments className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
                            <p className="text-gray-600 mb-4">Create your first forum category to get started.</p>
                            <Button onClick={handleCreateCategoryClick}>
                                <FaPlus className="w-4 h-4 mr-2" />
                                Create Category
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {categoriesWithCounts.map((category, index) => (
                                <div
                                    key={category._id}
                                    className={`flex items-center gap-4 p-4 border rounded-lg transition-all duration-200 ${
                                        draggedCategory?._id === category._id 
                                            ? 'bg-blue-50 border-blue-200 shadow-lg transform scale-105' 
                                            : 'bg-white hover:bg-gray-50 hover:shadow-md'
                                    } ${!category.isActive ? 'opacity-60' : ''}`}
                                    draggable={!isReordering}
                                    onDragStart={(e) => !isReordering && handleDragStart(e, category)}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={!isReordering ? handleDragOver : undefined}
                                    onDragEnter={!isReordering ? handleDragEnter : undefined}
                                    onDragLeave={!isReordering ? handleDragLeave : undefined}
                                    onDrop={!isReordering ? (e) => handleDrop(e, category) : undefined}
                                >
                                    {/* Drag Handle */}
                                    <div 
                                        className={`cursor-move text-gray-400 hover:text-gray-600 transition-colors p-1 rounded ${
                                            isReordering ? 'cursor-not-allowed opacity-50' : ''
                                        }`}
                                        title="Drag to reorder"
                                    >
                                        <FaGripVertical className="w-4 h-4" />
                                    </div>

                                    {/* Order */}
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-sm font-medium text-gray-500">#{category.order}</span>
                                        <div className="flex flex-col gap-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-6 w-6 p-0"
                                                onClick={() => handleMoveUp(category)}
                                                disabled={index === 0 || isReordering}
                                            >
                                                <FaArrowUp className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-6 w-6 p-0"
                                                onClick={() => handleMoveDown(category)}
                                                disabled={index === categories.length - 1 || isReordering}
                                            >
                                                <FaArrowDown className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Category Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-medium text-gray-900 truncate">
                                                {category.name}
                                            </h3>
                                            {!category.isActive && (
                                                <Badge variant="secondary">Inactive</Badge>
                                            )}
                                            {category.icon && (
                                                <span className="text-lg">{category.icon}</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 truncate mb-2">
                                            {category.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>Slug: {category.slug}</span>
                                            <span>Created: {format(new Date(category.createdAt), 'MMM dd, yyyy')}</span>
                                        </div>
                                    </div>

                                    {/* Statistics */}
                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="text-center">
                                            <div className="font-medium text-gray-900">{category.threadCount}</div>
                                            <div className="text-gray-500">Threads</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-medium text-gray-900">{category.replyCount}</div>
                                            <div className="text-gray-500">Replies</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-medium text-gray-900">{category.totalPosts}</div>
                                            <div className="text-gray-500">Total</div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleToggleActive(category)}
                                            disabled={isUpdating}
                                            title={category.isActive ? "Deactivate category" : "Activate category"}
                                        >
                                            {category.isActive ? (
                                                <FaEye className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <FaEyeSlash className="w-4 h-4 text-gray-400" />
                                            )}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleEditCategory(category)}
                                            disabled={isUpdating}
                                        >
                                            <FaEdit className="w-4 h-4 text-blue-600" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDeleteCategory(category)}
                                            disabled={isDeleting}
                                        >
                                            <FaTrash className="w-4 h-4 text-red-600" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modals */}
            {showCreateModal && (
                <CategoryModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateCategory}
                    isLoading={isCreating}
                    title="Create New Category"
                />
            )}

            {editingCategory && (
                <CategoryModal
                    isOpen={!!editingCategory}
                    onClose={() => setEditingCategory(null)}
                    onSubmit={handleUpdateCategory}
                    isLoading={isUpdating}
                    title="Edit Category"
                    initialData={editingCategory}
                />
            )}

            {deletingCategory && (
                <DeleteCategoryModal
                    isOpen={!!deletingCategory}
                    onClose={() => setDeletingCategory(null)}
                    onConfirm={deleteCategory}
                    category={deletingCategory}
                    categories={categories.filter(cat => cat._id !== deletingCategory._id)}
                    isLoading={isDeleting}
                />
            )}
        </div>
    );
};

export default CategoryManagementSection;