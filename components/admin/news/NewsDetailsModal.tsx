"use client";

import { FaTimes, FaEye, FaComments, FaUser, FaCalendarAlt } from "react-icons/fa";

interface NewsDetailsModalProps {
    news: any;
    onClose: () => void;
}

export function NewsDetailsModal({ news, onClose }: NewsDetailsModalProps) {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">News Details</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                        <FaTimes className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Title & Badges */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{news.title}</h2>
                        <div className="flex gap-2 mt-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${news.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                }`}>{news.status}</span>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">{news.category}</span>
                        </div>
                    </div>

                    {/* Image */}
                    {news.image && (
                        <div className="rounded-xl overflow-hidden border border-slate-100">
                            <img src={news.image} alt={news.title} className="w-full h-64 object-cover" />
                        </div>
                    )}

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { icon: FaEye, label: "Views", value: news.views || 0, bg: "bg-purple-50", ic: "text-purple-500" },
                            { icon: FaComments, label: "Comments", value: news.commentsCount || 0, bg: "bg-pink-50", ic: "text-pink-500" },
                            { icon: FaUser, label: "Author", value: news.author?.name || "Unknown", bg: "bg-primary/5", ic: "text-primary" },
                            { icon: FaCalendarAlt, label: "Created", value: new Date(news.createdAt).toLocaleDateString(), bg: "bg-emerald-50", ic: "text-emerald-500" },
                        ].map((s, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}><s.icon className={`w-3.5 h-3.5 ${s.ic}`} /></div>
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-400">{s.label}</p>
                                    <p className="font-bold text-sm text-slate-900 truncate">{s.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Content */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Content</h3>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">{news.content}</p>
                        </div>
                    </div>

                    {/* Last Edited */}
                    {news.lastEditedAt && (
                        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100">
                            Last edited on {new Date(news.lastEditedAt).toLocaleString()}
                            {news.lastEditedBy && ` by ${news.lastEditedBy.name}`}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
