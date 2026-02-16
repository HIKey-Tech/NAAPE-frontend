"use client";

import React, { useState } from "react";
import { FaTimes, FaSpinner, FaExclamationTriangle, FaTrash, FaArrowRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/hooks/useCategoryManagement";

interface DeleteCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (categoryId: string, options?: { migrateTo?: string; deleteThreads?: boolean }) => Promise<boolean>;
    category: Category;
    categories: Category[]; // Other categories for migration
    isLoading: boolean;
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    category,
    categories,
    isLoading
}) => {
    const [deleteOption, setDeleteOption] = useState<'migrate' | 'delete'>('migrate');
    const [migrationTarget, setMigrationTarget] = useState<string>('');

    const hasThreads = category.threadCount > 0;
    const availableCategories = categories.filter(cat => cat.isActive);

    const handleConfirm = async () => {
        let options: { migrateTo?: string; deleteThreads?: boolean } = {};

        if (hasThreads) {
            if (deleteOption === 'delete') {
                options.deleteThreads = true;
            } else if (deleteOption === 'migrate' && migrationTarget) {
                options.migrateTo = migrationTarget;
            } else if (deleteOption === 'migrate' && !migrationTarget) {
                // Don't proceed if migration is selected but no target is chosen
                return;
            }
        }

        const success = await onConfirm(category._id, options);
        if (success) {
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
            <Card className="w-full max-w-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg font-semibold text-red-600 flex items-center gap-2">
                        <FaExclamationTriangle className="w-5 h-5" />
                        Delete Category
                    </CardTitle>
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
                <CardContent className="space-y-6">
                    {/* Category Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-gray-900">{category.name}</h3>
                            {category.icon && <span className="text-lg">{category.icon}</span>}
                            {!category.isActive && <Badge variant="secondary">Inactive</Badge>}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Threads:</span>
                                <span className="font-medium">{category.threadCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Replies:</span>
                                <span className="font-medium">{category.replyCount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                            <FaExclamationTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                            <div>
                                <h4 className="font-medium text-red-800 mb-1">
                                    This action cannot be undone
                                </h4>
                                <p className="text-sm text-red-700">
                                    Deleting this category will permanently remove it from the system.
                                    {hasThreads && " You must decide what to do with the existing threads."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Thread Handling Options */}
                    {hasThreads && (
                        <div className="space-y-4">
                            <h4 className="font-medium text-gray-900">
                                What should happen to the {category.threadCount} thread{category.threadCount !== 1 ? 's' : ''} in this category?
                            </h4>

                            <div className="space-y-3">
                                {/* Migration Option */}
                                <div className="flex items-start gap-3">
                                    <input
                                        type="radio"
                                        id="migrate"
                                        name="deleteOption"
                                        value="migrate"
                                        checked={deleteOption === 'migrate'}
                                        onChange={(e) => setDeleteOption(e.target.value as 'migrate')}
                                        disabled={isLoading}
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <Label htmlFor="migrate" className="font-medium text-green-700">
                                            Move threads to another category (Recommended)
                                        </Label>
                                        <p className="text-sm text-gray-600 mt-1">
                                            All threads will be moved to the selected category and remain accessible.
                                        </p>
                                        
                                        {deleteOption === 'migrate' && (
                                            <div className="mt-3">
                                                <Label htmlFor="migrationTarget" className="text-sm">
                                                    Select destination category:
                                                </Label>
                                                <Select
                                                    value={migrationTarget}
                                                    onValueChange={setMigrationTarget}
                                                    disabled={isLoading}
                                                >
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue placeholder="Choose a category..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {availableCategories.map((cat) => (
                                                            <SelectItem key={cat._id} value={cat._id}>
                                                                <div className="flex items-center gap-2">
                                                                    {cat.icon && <span>{cat.icon}</span>}
                                                                    <span>{cat.name}</span>
                                                                    <span className="text-xs text-gray-500">
                                                                        ({cat.threadCount} threads)
                                                                    </span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                
                                                {availableCategories.length === 0 && (
                                                    <p className="text-sm text-red-600 mt-1">
                                                        No other active categories available for migration.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Delete Option */}
                                <div className="flex items-start gap-3">
                                    <input
                                        type="radio"
                                        id="delete"
                                        name="deleteOption"
                                        value="delete"
                                        checked={deleteOption === 'delete'}
                                        onChange={(e) => setDeleteOption(e.target.value as 'delete')}
                                        disabled={isLoading}
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <Label htmlFor="delete" className="font-medium text-red-700">
                                            Delete all threads permanently
                                        </Label>
                                        <p className="text-sm text-gray-600 mt-1">
                                            All threads and their replies will be permanently deleted. This cannot be undone.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Summary */}
                    {hasThreads && (
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-800 mb-2">Summary:</h4>
                            <div className="text-sm text-blue-700 space-y-1">
                                <div className="flex items-center gap-2">
                                    <span>Category "{category.name}" will be deleted</span>
                                    <FaTrash className="w-3 h-3" />
                                </div>
                                {deleteOption === 'migrate' && migrationTarget && (
                                    <div className="flex items-center gap-2">
                                        <span>{category.threadCount} thread{category.threadCount !== 1 ? 's' : ''} will be moved to</span>
                                        <FaArrowRight className="w-3 h-3" />
                                        <span className="font-medium">
                                            {availableCategories.find(cat => cat._id === migrationTarget)?.name}
                                        </span>
                                    </div>
                                )}
                                {deleteOption === 'delete' && (
                                    <div className="flex items-center gap-2 text-red-700">
                                        <span>{category.threadCount} thread{category.threadCount !== 1 ? 's' : ''} and {category.replyCount} repl{category.replyCount !== 1 ? 'ies' : 'y'} will be deleted</span>
                                        <FaTrash className="w-3 h-3" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

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
                            type="button"
                            variant="destructive"
                            onClick={handleConfirm}
                            disabled={
                                isLoading || 
                                (hasThreads && deleteOption === 'migrate' && !migrationTarget) ||
                                (hasThreads && deleteOption === 'migrate' && availableCategories.length === 0)
                            }
                        >
                            {isLoading && <FaSpinner className="w-4 h-4 mr-2 animate-spin" />}
                            Delete Category
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DeleteCategoryModal;