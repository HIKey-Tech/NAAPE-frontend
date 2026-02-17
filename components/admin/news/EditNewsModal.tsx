"use client";

import { useState } from "react";
import { useAdminNews } from "@/hooks/useAdminNews";
import { FaTimes } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditNewsModalProps {
    news: any;
    onClose: () => void;
    onSuccess: () => void;
}

export function EditNewsModal({ news, onClose, onSuccess }: EditNewsModalProps) {
    const { updateNews } = useAdminNews();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: news.title || "",
        content: news.content || "",
        category: news.category || "General",
        status: news.status || "draft",
        image: news.image || ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const success = await updateNews(news._id, formData);
        setLoading(false);
        if (success) onSuccess();
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">Edit News</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                        <FaTimes className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Title</label>
                        <Input value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} required className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Content</label>
                        <Textarea value={formData.content} onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))} rows={10} required className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Category</label>
                            <Select value={formData.category} onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}>
                                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Engineering">Engineering</SelectItem>
                                    <SelectItem value="Pilot">Pilot</SelectItem>
                                    <SelectItem value="General">General</SelectItem>
                                    <SelectItem value="Announcement">Announcement</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Status</label>
                            <Select value={formData.status} onValueChange={(v) => setFormData(prev => ({ ...prev, status: v }))}>
                                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Image URL</label>
                        <Input value={formData.image} onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))} placeholder="https://..." className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button type="button" variant="outline" onClick={onClose} className="rounded-xl font-bold border-slate-200">Cancel</Button>
                        <Button type="submit" disabled={loading} className="rounded-xl font-bold shadow-md shadow-primary/20">{loading ? "Saving..." : "Save Changes"}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
