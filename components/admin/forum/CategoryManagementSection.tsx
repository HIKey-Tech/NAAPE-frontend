"use client";

import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaGripVertical, FaEye, FaEyeSlash, FaComments, FaReply, FaSyncAlt, FaExclamationTriangle, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import useCategoryManagement, { Category, CreateCategoryData, UpdateCategoryData } from "@/hooks/useCategoryManagement";
import CategoryModal from "@/components/admin/forum/CategoryModal";
import DeleteCategoryModal from "@/components/admin/forum/DeleteCategoryModal";

const CategoryManagementSection: React.FC = () => {
    const { categories, isLoading, isCreating, isUpdating, isDeleting, isReordering, error, fetchCategories, createCategory, updateCategory, deleteCategory, reorderCategories, getCategoriesWithCounts } = useCategoryManagement();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
    const [draggedCategory, setDraggedCategory] = useState<Category | null>(null);
    const categoriesWithCounts = getCategoriesWithCounts();

    const handleCreateCategory = async (data: CreateCategoryData): Promise<Category | null> => await createCategory(data);
    const handleUpdateCategory = async (data: CreateCategoryData): Promise<Category | null> => { if (!editingCategory) return null; return await updateCategory(editingCategory._id, { name: data.name, description: data.description, slug: data.slug, icon: data.icon, order: data.order }); };

    const handleToggleActive = async (category: Category) => { await updateCategory(category._id, { isActive: !category.isActive }); };
    const handleMoveUp = async (category: Category) => { const i = categories.findIndex(c => c._id === category._id); if (i > 0) { const orders = categories.map((c, idx) => ({ id: c._id, order: idx === i ? categories[i - 1].order : idx === i - 1 ? category.order : c.order })); await reorderCategories(orders); } };
    const handleMoveDown = async (category: Category) => { const i = categories.findIndex(c => c._id === category._id); if (i < categories.length - 1) { const orders = categories.map((c, idx) => ({ id: c._id, order: idx === i ? categories[i + 1].order : idx === i + 1 ? category.order : c.order })); await reorderCategories(orders); } };

    const handleDragStart = (e: React.DragEvent, category: Category) => { setDraggedCategory(category); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", category._id); if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.opacity = "0.5"; };
    const handleDragEnd = (e: React.DragEvent) => { if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.opacity = "1"; setDraggedCategory(null); };
    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
    const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); if (e.currentTarget instanceof HTMLElement) e.currentTarget.classList.add("border-primary/40", "bg-primary/5"); };
    const handleDragLeave = (e: React.DragEvent) => { if (e.currentTarget instanceof HTMLElement && !e.currentTarget.contains(e.relatedTarget as Node)) e.currentTarget.classList.remove("border-primary/40", "bg-primary/5"); };
    const handleDrop = async (e: React.DragEvent, targetCategory: Category) => {
        e.preventDefault(); if (e.currentTarget instanceof HTMLElement) e.currentTarget.classList.remove("border-primary/40", "bg-primary/5");
        if (!draggedCategory || draggedCategory._id === targetCategory._id) { setDraggedCategory(null); return; }
        const di = categories.findIndex(c => c._id === draggedCategory._id); const ti = categories.findIndex(c => c._id === targetCategory._id);
        if (di === -1 || ti === -1) { setDraggedCategory(null); return; }
        const nc = [...categories]; const [removed] = nc.splice(di, 1); nc.splice(ti, 0, removed);
        await reorderCategories(nc.map((c, i) => ({ id: c._id, order: i + 1 }))); setDraggedCategory(null);
    };

    if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
    if (error) return (
        <div className="flex items-center justify-center h-64"><div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><FaExclamationTriangle className="text-2xl text-red-400" /></div>
            <p className="text-sm text-red-500 mb-4">{error}</p>
            <Button onClick={fetchCategories} variant="outline" className="rounded-xl font-bold"><FaSyncAlt className="w-3 h-3 mr-2" /> Retry</Button>
        </div></div>
    );

    const stats = [
        { label: "Total Categories", value: categories.length, sub: `${categories.filter(c => c.isActive).length} active`, icon: FaComments, iconClass: "text-primary bg-primary/5" },
        { label: "Total Threads", value: categoriesWithCounts.reduce((s, c) => s + (c.threadCount || 0), 0), sub: "Across all categories", icon: FaComments, iconClass: "text-emerald-600 bg-emerald-50" },
        { label: "Total Replies", value: categoriesWithCounts.reduce((s, c) => s + (c.replyCount || 0), 0), sub: "Across all categories", icon: FaReply, iconClass: "text-violet-600 bg-violet-50" },
        { label: "Most Active", value: (() => { const m = categoriesWithCounts.filter(c => (c.totalPosts || 0) > 0).sort((a, b) => (b.totalPosts || 0) - (a.totalPosts || 0))[0]; return m ? (m.name.length > 12 ? m.name.substring(0, 12) + '...' : m.name) : 'None'; })(), sub: (() => { const m = categoriesWithCounts.filter(c => (c.totalPosts || 0) > 0).sort((a, b) => (b.totalPosts || 0) - (a.totalPosts || 0))[0]; return m ? `${m.totalPosts || 0} posts` : 'No activity'; })(), icon: FaComments, iconClass: "text-amber-600 bg-amber-50" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div><h1 className="text-2xl font-black text-slate-900">Category Management</h1><p className="text-slate-500 text-sm">Create, edit, and organize forum categories</p></div>
                <div className="flex gap-2">
                    <Button onClick={fetchCategories} disabled={isLoading} variant="outline" size="sm" className="rounded-xl font-bold"><FaSyncAlt className={`w-3 h-3 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh</Button>
                    <Button onClick={() => setShowCreateModal(true)} disabled={isCreating} size="sm" className="bg-primary rounded-xl font-bold shadow-md shadow-primary/20"><FaPlus className="w-3 h-3 mr-2" /> Create</Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {stats.map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconClass}`}><s.icon size={16} /></div>
                        <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{s.label}</p><p className="text-xl font-black text-slate-800">{s.value}</p><p className="text-[10px] text-slate-400">{s.sub}</p></div>
                    </div>
                ))}
            </div>

            {/* Categories List */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative">
                {isReordering && (
                    <div className="absolute inset-0 bg-white/75 flex items-center justify-center z-10 rounded-2xl">
                        <div className="text-center"><div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" /><p className="text-xs text-slate-500">Reordering...</p></div>
                    </div>
                )}
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-700">Categories <span className="inline-flex ml-2 px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[10px] font-bold">{categories.length}</span></h3>
                </div>
                <div className="p-5">
                    {categories.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"><FaComments className="text-2xl text-slate-300" /></div>
                            <h3 className="text-lg font-bold text-slate-700 mb-2">No categories yet</h3>
                            <p className="text-sm text-slate-400 mb-4">Create your first forum category to get started.</p>
                            <Button onClick={() => setShowCreateModal(true)} className="bg-primary rounded-xl font-bold"><FaPlus className="w-3 h-3 mr-2" /> Create</Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {categoriesWithCounts.map((category, index) => (
                                <div key={category._id}
                                    className={`flex flex-wrap items-center gap-3 sm:gap-4 p-4 border rounded-xl transition-all duration-200 ${draggedCategory?._id === category._id ? 'bg-primary/5 border-primary/20 shadow-lg scale-[1.02]' : 'bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200'} ${!category.isActive ? 'opacity-60' : ''}`}
                                    draggable={!isReordering} onDragStart={e => !isReordering && handleDragStart(e, category)} onDragEnd={handleDragEnd}
                                    onDragOver={!isReordering ? handleDragOver : undefined} onDragEnter={!isReordering ? handleDragEnter : undefined}
                                    onDragLeave={!isReordering ? handleDragLeave : undefined} onDrop={!isReordering ? e => handleDrop(e, category) : undefined}
                                >
                                    <div className={`cursor-move text-slate-300 hover:text-slate-500 transition-colors ${isReordering ? 'cursor-not-allowed opacity-50' : ''}`}><FaGripVertical className="w-3.5 h-3.5" /></div>
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-xs font-bold text-slate-400">#{category.order}</span>
                                        <div className="flex flex-col gap-0.5">
                                            <Button size="sm" variant="ghost" className="h-5 w-5 p-0" onClick={() => handleMoveUp(category)} disabled={index === 0 || isReordering}><FaArrowUp className="w-2.5 h-2.5" /></Button>
                                            <Button size="sm" variant="ghost" className="h-5 w-5 p-0" onClick={() => handleMoveDown(category)} disabled={index === categories.length - 1 || isReordering}><FaArrowDown className="w-2.5 h-2.5" /></Button>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-sm text-slate-800 truncate">{category.name}</h3>
                                            {!category.isActive && <span className="inline-flex px-2 py-0.5 rounded-full bg-slate-200 text-slate-500 text-[10px] font-bold">Inactive</span>}
                                            {category.icon && <span className="text-lg">{category.icon}</span>}
                                        </div>
                                        <p className="text-xs text-slate-500 truncate mb-1">{category.description}</p>
                                        <div className="flex items-center gap-4 text-[10px] text-slate-400">
                                            <span>Slug: {category.slug}</span>
                                            <span>Created: {format(new Date(category.createdAt), 'MMM dd, yyyy')}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-xs">
                                        {[{ val: category.threadCount, label: "Threads" }, { val: category.replyCount, label: "Replies" }, { val: category.totalPosts, label: "Total" }].map(s => (
                                            <div key={s.label} className="text-center"><div className="font-bold text-slate-700">{s.val}</div><div className="text-slate-400 text-[10px]">{s.label}</div></div>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button size="sm" variant="ghost" onClick={() => handleToggleActive(category)} disabled={isUpdating} className="h-8 w-8 p-0">
                                            {category.isActive ? <FaEye className="w-3.5 h-3.5 text-emerald-600" /> : <FaEyeSlash className="w-3.5 h-3.5 text-slate-400" />}
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={() => setEditingCategory(category)} disabled={isUpdating} className="h-8 w-8 p-0"><FaEdit className="w-3.5 h-3.5 text-primary" /></Button>
                                        <Button size="sm" variant="ghost" onClick={() => setDeletingCategory(category)} disabled={isDeleting} className="h-8 w-8 p-0"><FaTrash className="w-3.5 h-3.5 text-red-500" /></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showCreateModal && <CategoryModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSubmit={handleCreateCategory} isLoading={isCreating} title="Create New Category" />}
            {editingCategory && <CategoryModal isOpen={!!editingCategory} onClose={() => setEditingCategory(null)} onSubmit={handleUpdateCategory} isLoading={isUpdating} title="Edit Category" initialData={editingCategory} />}
            {deletingCategory && <DeleteCategoryModal isOpen={!!deletingCategory} onClose={() => setDeletingCategory(null)} onConfirm={deleteCategory} category={deletingCategory} categories={categories.filter(c => c._id !== deletingCategory._id)} isLoading={isDeleting} />}
        </div>
    );
};

export default CategoryManagementSection;