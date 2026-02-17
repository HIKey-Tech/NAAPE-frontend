"use client";

import { useEffect, useState } from "react";
import { useAdminNews } from "@/hooks/useAdminNews";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FaSearch, FaTrash, FaEdit, FaEye, FaFileAlt, FaCheckCircle, FaTimesCircle, FaNewspaper, FaFilter } from "react-icons/fa";
import { EditNewsModal } from "./EditNewsModal";
import { DeleteNewsModal } from "./DeleteNewsModal";
import { NewsDetailsModal } from "./NewsDetailsModal";

export function NewsManagementSection() {
    const { news, loading, pagination, fetchNews, bulkDeleteNews, bulkUpdateStatus } = useAdminNews();

    const [selectedNews, setSelectedNews] = useState<string[]>([]);
    const [filters, setFilters] = useState<{
        search: string;
        status?: "draft" | "published";
        category?: "Engineering" | "Pilot" | "General" | "Announcement";
        sortBy: string;
        order: "asc" | "desc";
        page: number;
        limit: number;
    }>({
        search: "",
        status: undefined,
        category: undefined,
        sortBy: "createdAt",
        order: "desc",
        page: 1,
        limit: 10
    });

    const [editingNews, setEditingNews] = useState<any>(null);
    const [deletingNews, setDeletingNews] = useState<any>(null);
    const [viewingNews, setViewingNews] = useState<any>(null);

    useEffect(() => {
        fetchNews(filters);
    }, [filters, fetchNews]);

    const handleSearch = (value: string) => setFilters(prev => ({ ...prev, search: value, page: 1 }));
    const handleFilterChange = (key: string, value: string) => setFilters(prev => ({ ...prev, [key]: value === "" ? undefined : value, page: 1 }));

    const handleSelectAll = (checked: boolean) => { if (checked) setSelectedNews(news.map((n: any) => n._id)); else setSelectedNews([]); };
    const handleSelectNews = (id: string, checked: boolean) => { if (checked) setSelectedNews(p => [...p, id]); else setSelectedNews(p => p.filter(nId => nId !== id)); };

    const handleBulkDelete = async () => {
        if (selectedNews.length === 0) return;
        if (confirm(`Delete ${selectedNews.length} news articles?`)) {
            const success = await bulkDeleteNews(selectedNews);
            if (success) { setSelectedNews([]); fetchNews(filters); }
        }
    };

    const handleBulkPublish = async () => {
        if (selectedNews.length === 0) return;
        const success = await bulkUpdateStatus(selectedNews, "published");
        if (success) { setSelectedNews([]); fetchNews(filters); }
    };

    const handleBulkDraft = async () => {
        if (selectedNews.length === 0) return;
        const success = await bulkUpdateStatus(selectedNews, "draft");
        if (success) { setSelectedNews([]); fetchNews(filters); }
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 p-5 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center"><FaFilter className="w-4 h-4 text-slate-500" /></div>
                    <h3 className="text-base font-bold text-slate-900">Filters</h3>
                </div>
                <div className="p-5">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <Input placeholder="Search news..." value={filters.search} onChange={(e) => handleSearch(e.target.value)} className="pl-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                        </div>
                        <Select value={filters.status || "all"} onValueChange={(v) => handleFilterChange("status", v === "all" ? "" : v)}>
                            <SelectTrigger className="w-[180px] rounded-xl border-slate-200 bg-slate-50"><SelectValue placeholder="All Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filters.category || "all"} onValueChange={(v) => handleFilterChange("category", v === "all" ? "" : v)}>
                            <SelectTrigger className="w-[180px] rounded-xl border-slate-200 bg-slate-50"><SelectValue placeholder="All Categories" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="Engineering">Engineering</SelectItem>
                                <SelectItem value="Pilot">Pilot</SelectItem>
                                <SelectItem value="General">General</SelectItem>
                                <SelectItem value="Announcement">Announcement</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedNews.length > 0 && (
                <div className="flex gap-2 items-center p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <span className="text-sm font-bold text-slate-700">{selectedNews.length} selected</span>
                    <div className="ml-auto flex gap-2">
                        <Button size="sm" variant="outline" onClick={handleBulkPublish} className="rounded-xl font-bold border-slate-200">
                            <FaCheckCircle className="w-3.5 h-3.5 mr-2" />Publish
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleBulkDraft} className="rounded-xl font-bold border-slate-200">
                            <FaFileAlt className="w-3.5 h-3.5 mr-2" />Draft
                        </Button>
                        <Button size="sm" variant="destructive" onClick={handleBulkDelete} className="rounded-xl font-bold shadow-md shadow-red-600/20">
                            <FaTrash className="w-3.5 h-3.5 mr-2" />Delete
                        </Button>
                    </div>
                </div>
            )}

            {/* News List */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center"><FaNewspaper className="w-4 h-4 text-primary" /></div>
                        <h3 className="text-base font-bold text-slate-900">News Articles</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">{pagination.total}</span>
                    </div>
                    {news.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Checkbox checked={selectedNews.length === news.length && news.length > 0} onCheckedChange={handleSelectAll} />
                            <span className="text-sm text-slate-500">Select All</span>
                        </div>
                    )}
                </div>
                <div className="p-5">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
                                <p className="text-slate-500 text-sm">Loading news...</p>
                            </div>
                        </div>
                    ) : news.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4"><FaNewspaper className="w-8 h-8 text-slate-300" /></div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">No news found</h3>
                            <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {news.map((item) => (
                                <div key={item._id} className="rounded-xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all duration-200">
                                    <div className="flex items-center gap-4 p-4">
                                        <Checkbox checked={selectedNews.includes(item._id)} onCheckedChange={(checked) => handleSelectNews(item._id, checked as boolean)} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                                <span className="font-bold text-slate-900 text-sm truncate">{item.title}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">{item.category}</span>
                                                <span className={`px-2 py-0.5 rounded-full font-bold ${item.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{item.status}</span>
                                                <span className="text-slate-300">•</span>
                                                <span><FaEye className="w-3 h-3 inline mr-0.5" />{item.views || 0}</span>
                                                <span className="text-slate-300">•</span>
                                                <span>{item.author?.name || "Unknown"}</span>
                                                <span className="text-slate-300">•</span>
                                                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => setViewingNews(item)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-primary transition-colors" title="View"><FaEye className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => setEditingNews(item)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-amber-500 transition-colors" title="Edit"><FaEdit className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => setDeletingNews(item)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors" title="Delete"><FaTrash className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                            <p className="text-sm text-slate-500">Showing {news.length} of {pagination.total} articles</p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" disabled={filters.page === 1} onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))} className="rounded-xl font-bold border-slate-200">Previous</Button>
                                <Button variant="outline" size="sm" disabled={filters.page >= pagination.pages} onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))} className="rounded-xl font-bold border-slate-200">Next</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {editingNews && <EditNewsModal news={editingNews} onClose={() => setEditingNews(null)} onSuccess={() => { setEditingNews(null); fetchNews(filters); }} />}
            {deletingNews && <DeleteNewsModal news={deletingNews} onClose={() => setDeletingNews(null)} onSuccess={() => { setDeletingNews(null); fetchNews(filters); }} />}
            {viewingNews && <NewsDetailsModal news={viewingNews} onClose={() => setViewingNews(null)} />}
        </div>
    );
}
