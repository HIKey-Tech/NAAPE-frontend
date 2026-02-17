"use client";

import React, { useState } from "react";
import { FaTimes, FaSpinner, FaExclamationTriangle, FaTrash, FaArrowRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from "@/hooks/useCategoryManagement";

interface DeleteCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (categoryId: string, options?: { migrateTo?: string; deleteThreads?: boolean }) => Promise<boolean>;
    category: Category;
    categories: Category[];
    isLoading: boolean;
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({ isOpen, onClose, onConfirm, category, categories, isLoading }) => {
    const [deleteOption, setDeleteOption] = useState<'migrate' | 'delete'>('migrate');
    const [migrationTarget, setMigrationTarget] = useState<string>('');

    const hasThreads = category.threadCount > 0;
    const availableCategories = categories.filter(cat => cat.isActive);

    const handleConfirm = async () => {
        let options: { migrateTo?: string; deleteThreads?: boolean } = {};
        if (hasThreads) {
            if (deleteOption === 'delete') options.deleteThreads = true;
            else if (deleteOption === 'migrate' && migrationTarget) options.migrateTo = migrationTarget;
            else if (deleteOption === 'migrate' && !migrationTarget) return;
        }
        const success = await onConfirm(category._id, options);
        if (success) onClose();
    };

    const handleClose = () => { if (!isLoading) onClose(); };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <h2 className="text-lg font-black text-red-600 flex items-center gap-2"><FaExclamationTriangle className="w-4 h-4" /> Delete Category</h2>
                    <button onClick={handleClose} disabled={isLoading} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"><FaTimes className="w-3 h-3 text-slate-500" /></button>
                </div>
                <div className="p-5 space-y-5">
                    {/* Category Info */}
                    <div className="bg-slate-50 p-4 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-sm text-slate-800">{category.name}</h3>
                            {category.icon && <span className="text-lg">{category.icon}</span>}
                            {!category.isActive && <span className="inline-flex px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold">Inactive</span>}
                        </div>
                        <p className="text-xs text-slate-500 mb-3">{category.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="flex justify-between"><span className="text-slate-400">Threads:</span><span className="font-bold text-slate-600">{category.threadCount}</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">Replies:</span><span className="font-bold text-slate-600">{category.replyCount}</span></div>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                        <div className="flex items-start gap-3">
                            <FaExclamationTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                            <div>
                                <h4 className="font-bold text-xs text-red-800 mb-1">This action cannot be undone</h4>
                                <p className="text-xs text-red-600">Deleting this category will permanently remove it.{hasThreads && " You must decide what to do with existing threads."}</p>
                            </div>
                        </div>
                    </div>

                    {/* Thread Handling Options */}
                    {hasThreads && (
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">What should happen to {category.threadCount} thread{category.threadCount !== 1 ? 's' : ''}?</h4>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <input type="radio" id="migrate" name="deleteOption" value="migrate" checked={deleteOption === 'migrate'} onChange={e => setDeleteOption(e.target.value as 'migrate')} disabled={isLoading} className="mt-1" />
                                    <div className="flex-1">
                                        <Label htmlFor="migrate" className="font-bold text-sm text-emerald-700">Move threads to another category (Recommended)</Label>
                                        <p className="text-xs text-slate-500 mt-1">All threads will be moved to the selected category and remain accessible.</p>
                                        {deleteOption === 'migrate' && (
                                            <div className="mt-3">
                                                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Destination</Label>
                                                <Select value={migrationTarget} onValueChange={setMigrationTarget} disabled={isLoading}>
                                                    <SelectTrigger className="mt-1 rounded-xl border-slate-200"><SelectValue placeholder="Choose a category..." /></SelectTrigger>
                                                    <SelectContent>{availableCategories.map(cat => (
                                                        <SelectItem key={cat._id} value={cat._id}><div className="flex items-center gap-2">{cat.icon && <span>{cat.icon}</span>}<span>{cat.name}</span><span className="text-xs text-slate-400">({cat.threadCount} threads)</span></div></SelectItem>
                                                    ))}</SelectContent>
                                                </Select>
                                                {availableCategories.length === 0 && <p className="text-xs text-red-500 mt-1">No other active categories available for migration.</p>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <input type="radio" id="delete" name="deleteOption" value="delete" checked={deleteOption === 'delete'} onChange={e => setDeleteOption(e.target.value as 'delete')} disabled={isLoading} className="mt-1" />
                                    <div className="flex-1">
                                        <Label htmlFor="delete" className="font-bold text-sm text-red-700">Delete all threads permanently</Label>
                                        <p className="text-xs text-slate-500 mt-1">All threads and their replies will be permanently deleted. This cannot be undone.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Summary */}
                    {hasThreads && (
                        <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl">
                            <h4 className="font-bold text-xs text-primary/90 mb-2">Summary:</h4>
                            <div className="text-xs text-primary space-y-1">
                                <div className="flex items-center gap-2">Category "{category.name}" will be deleted <FaTrash className="w-2.5 h-2.5" /></div>
                                {deleteOption === 'migrate' && migrationTarget && (
                                    <div className="flex items-center gap-2">{category.threadCount} thread{category.threadCount !== 1 ? 's' : ''} will be moved to <FaArrowRight className="w-2.5 h-2.5" /><span className="font-bold">{availableCategories.find(cat => cat._id === migrationTarget)?.name}</span></div>
                                )}
                                {deleteOption === 'delete' && (
                                    <div className="flex items-center gap-2 text-red-700">{category.threadCount} thread{category.threadCount !== 1 ? 's' : ''} and {category.replyCount} repl{category.replyCount !== 1 ? 'ies' : 'y'} will be deleted <FaTrash className="w-2.5 h-2.5" /></div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading} className="rounded-xl font-bold">Cancel</Button>
                        <Button type="button" variant="destructive" onClick={handleConfirm} disabled={isLoading || (hasThreads && deleteOption === 'migrate' && !migrationTarget) || (hasThreads && deleteOption === 'migrate' && availableCategories.length === 0)} className="rounded-xl font-bold">
                            {isLoading && <FaSpinner className="w-3 h-3 mr-2 animate-spin" />}
                            Delete Category
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteCategoryModal;