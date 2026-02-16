"use client";

import { useEffect, useState } from "react";
import { useAdminNews } from "@/hooks/useAdminNews";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
    Search, 
    Trash2, 
    Edit, 
    Eye,
    FileText,
    CheckCircle,
    XCircle
} from "lucide-react";
import { EditNewsModal } from "./EditNewsModal";
import { DeleteNewsModal } from "./DeleteNewsModal";
import { NewsDetailsModal } from "./NewsDetailsModal";
import { Skeleton } from "@/components/ui/skeleton";

export function NewsManagementSection() {
    const { 
        news, 
        loading, 
        pagination, 
        fetchNews, 
        bulkDeleteNews, 
        bulkUpdateStatus 
    } = useAdminNews();

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

    const handleSearch = (value: string) => {
        setFilters(prev => ({ ...prev, search: value, page: 1 }));
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ 
            ...prev, 
            [key]: value === "" ? undefined : value, 
            page: 1 
        }));
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedNews(news.map(n => n._id));
        } else {
            setSelectedNews([]);
        }
    };

    const handleSelectNews = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedNews(prev => [...prev, id]);
        } else {
            setSelectedNews(prev => prev.filter(nId => nId !== id));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedNews.length === 0) return;
        
        if (confirm(`Delete ${selectedNews.length} news articles?`)) {
            const success = await bulkDeleteNews(selectedNews);
            if (success) {
                setSelectedNews([]);
                fetchNews(filters);
            }
        }
    };

    const handleBulkPublish = async () => {
        if (selectedNews.length === 0) return;
        
        const success = await bulkUpdateStatus(selectedNews, "published");
        if (success) {
            setSelectedNews([]);
            fetchNews(filters);
        }
    };

    const handleBulkDraft = async () => {
        if (selectedNews.length === 0) return;
        
        const success = await bulkUpdateStatus(selectedNews, "draft");
        if (success) {
            setSelectedNews([]);
            fetchNews(filters);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search news..."
                        value={filters.search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Select value={filters.status || ""} onValueChange={(v) => handleFilterChange("status", v)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Status</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filters.category || ""} onValueChange={(v) => handleFilterChange("category", v)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Pilot">Pilot</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Announcement">Announcement</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {selectedNews.length > 0 && (
                <div className="flex gap-2 items-center p-4 bg-muted rounded-lg">
                    <span className="text-sm font-medium">
                        {selectedNews.length} selected
                    </span>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleBulkPublish}
                        className="ml-auto"
                    >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Publish
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleBulkDraft}
                    >
                        <FileText className="h-4 w-4 mr-2" />
                        Draft
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleBulkDelete}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </div>
            )}

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={selectedNews.length === news.length && news.length > 0}
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Views</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                </TableRow>
                            ))
                        ) : news.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                    No news found
                                </TableCell>
                            </TableRow>
                        ) : (
                            news.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedNews.includes(item._id)}
                                            onCheckedChange={(checked) => 
                                                handleSelectNews(item._id, checked as boolean)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium max-w-xs truncate">
                                        {item.title}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{item.category}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={item.status === "published" ? "default" : "secondary"}>
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{item.views || 0}</TableCell>
                                    <TableCell>{item.author?.name || "Unknown"}</TableCell>
                                    <TableCell>
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setViewingNews(item)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setEditingNews(item)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setDeletingNews(item)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing {news.length} of {pagination.total} news articles
                </p>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={filters.page === 1}
                        onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={filters.page >= pagination.pages}
                        onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {editingNews && (
                <EditNewsModal
                    news={editingNews}
                    onClose={() => setEditingNews(null)}
                    onSuccess={() => {
                        setEditingNews(null);
                        fetchNews(filters);
                    }}
                />
            )}

            {deletingNews && (
                <DeleteNewsModal
                    news={deletingNews}
                    onClose={() => setDeletingNews(null)}
                    onSuccess={() => {
                        setDeletingNews(null);
                        fetchNews(filters);
                    }}
                />
            )}

            {viewingNews && (
                <NewsDetailsModal
                    news={viewingNews}
                    onClose={() => setViewingNews(null)}
                />
            )}
        </div>
    );
}
