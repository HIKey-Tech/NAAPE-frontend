"use client";

import React, { useState, useEffect } from "react";
import { FaTrash, FaUpload, FaImages } from "react-icons/fa";
import api from "@/lib/axios";

interface GalleryImage {
    _id: string;
    url: string;
    caption: string;
    category: string;
    createdAt: string;
}

export default function AdminGalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    // Form state
    const [files, setFiles] = useState<File[]>([]);
    const [category, setCategory] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [caption, setCaption] = useState("");

    const fetchGallery = async () => {
        try {
            const { data } = await api.get("/gallery");
            setImages(data.rawImages || []);
            const cats = data.data.map((d: any) => d.title) as string[];
            setCategories(cats);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchGallery();
    }, []);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length === 0) return alert("Please select at least one file.");

        const targetCategory = newCategory.trim() || category;
        if (!targetCategory) return alert("Please select or create a category.");

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("images", file);
        });
        formData.append("category", targetCategory);
        if (caption) formData.append("caption", caption);

        setIsUploading(true);
        try {
            await api.post("/gallery", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            setFiles([]);
            setCategory("");
            setNewCategory("");
            setCaption("");
            await fetchGallery();
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this image?")) return;
        try {
            await api.delete(`/gallery/${id}`);
            await fetchGallery();
        } catch (error) {
            console.error(error);
            alert("Failed to delete image.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-2">
                <FaImages className="text-primary" /> Manage Gallery
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
                    <h2 className="text-xl font-bold mb-4">Upload New Image(s)</h2>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1">Image(s)</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setFiles(Array.from(e.target.files));
                                    }
                                }}
                                className="w-full text-sm border border-slate-200 rounded p-2"
                                required
                            />
                            {files.length > 0 && (
                                <p className="text-xs text-slate-500 mt-1">{files.length} file(s) selected.</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1">Category</label>
                            {categories.length > 0 && (
                                <select
                                    className="w-full text-sm border border-slate-200 rounded p-2 mb-2"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="">-- Select Existing Category --</option>
                                    {categories.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            )}
                            <input
                                type="text"
                                placeholder="Or create new category"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="w-full text-sm border border-slate-200 rounded p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1">Caption (Optional)</label>
                            <input
                                type="text"
                                placeholder="Image caption"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                className="w-full text-sm border border-slate-200 rounded p-2"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isUploading || files.length === 0}
                            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded w-full flex items-center justify-center gap-2 transition disabled:opacity-50"
                        >
                            {isUploading ? "Uploading..." : <><FaUpload /> Upload Image(s)</>}
                        </button>
                    </form>
                </div>

                {/* Images Grid */}
                <div className="lg:col-span-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {images.map((img) => (
                            <div key={img._id} className="relative group rounded-xl overflow-hidden shadow-sm border border-slate-100 bg-white">
                                <img src={img.url} alt={img.caption || img.category} className="w-full h-40 object-cover" />
                                <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-white text-xs font-bold truncate">{img.category}</p>
                                    {img.caption && <p className="text-white/80 text-xs truncate">{img.caption}</p>}
                                </div>
                                <button
                                    onClick={() => handleDelete(img._id)}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        ))}
                        {images.length === 0 && (
                            <div className="col-span-1 sm:col-span-3 text-center py-12 text-slate-500">
                                No images found in the gallery.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
