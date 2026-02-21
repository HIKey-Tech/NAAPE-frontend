"use client";

import React, { useState } from "react";
import { usePublicProfile } from "@/hooks/useProfile";
import {
    MdOutlineAlternateEmail,
    MdOutlinePerson,
    MdBadge,
    MdOutlineWorkOutline,
    MdDateRange,
    MdVerified,
    MdPhone,
    MdDescription,
    MdSchool,
    MdShare,
    MdContentCopy
} from "react-icons/md";
import { FaUserTie, FaBuilding } from "react-icons/fa";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface PublicProfileProps {
    userId: string;
}

function SectionCard({ children, title, icon: Icon }: { children: React.ReactNode, title: string, icon?: React.ElementType }) {
    return (
        <div className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm p-6 sm:p-8 h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    {Icon && <div className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg"><Icon size={20} /></div>}
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{title}</h3>
                </div>
            </div>
            {children}
        </div>
    );
}

function DetailRow({ label, value, icon: Icon }: { label: string, value: React.ReactNode, icon?: React.ElementType }) {
    if (!value && value !== 0) return null;
    return (
        <div className="flex items-start gap-4 py-2">
            {Icon && <Icon className="text-slate-400 mt-1 shrink-0" size={18} />}
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
                <div className="text-sm font-medium text-slate-800 dark:text-slate-200 break-words">{value}</div>
            </div>
        </div>
    );
}

function StatCard({ label, value, colorClass }: { label: string, value: number, colorClass: string }) {
    return (
        <div className={`rounded-xl p-4 flex flex-col items-center justify-center border ${colorClass}`}>
            <span className="text-2xl font-black mb-1">{value}</span>
            <span className="text-xs font-bold uppercase tracking-wide opacity-80">{label}</span>
        </div>
    );
}

const PublicProfile: React.FC<PublicProfileProps> = ({ userId }) => {
    const { data: profile, isLoading, error } = usePublicProfile(userId);
    const [isCopying, setIsCopying] = useState(false);

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setIsCopying(true);
            toast.success("Profile link copied to clipboard!");
            setTimeout(() => setIsCopying(false), 2000);
        }).catch(() => {
            toast.error("Failed to copy link");
        });
    };

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 space-y-8 min-h-screen flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-8 bg-slate-200 dark:bg-slate-800 w-48 rounded" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 w-32 rounded" />
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 min-h-[50vh] flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-900/10 flex items-center justify-center mb-4">
                    <span className="text-4xl">👤</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Member not found</h3>
                <p className="text-slate-500 max-w-xs">The profile you're looking for might have been removed or the link is incorrect.</p>
            </div>
        );
    }

    const initials = profile.name.split(" ").filter(Boolean).slice(0, 2).map((n: string) => n[0]?.toUpperCase() || "").join("");
    const imageUrl = profile.profile?.image?.url;

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 space-y-8 min-h-screen bg-slate-50/50 dark:bg-transparent">
            {/* Header / Hero */}
            <motion.div
                className="bg-white dark:bg-card rounded-3xl border border-slate-100 dark:border-border shadow-sm p-8 relative overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/10 to-blue-50/50 dark:to-transparent -z-10" />

                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 pt-4">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="w-32 h-32 rounded-full border-4 border-white dark:border-card shadow-lg bg-white dark:bg-slate-800 flex items-center justify-center text-4xl font-bold text-slate-300 dark:text-slate-600 overflow-hidden relative">
                            {imageUrl ? (
                                <img src={imageUrl} alt={profile.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">{initials}</div>
                            )}
                        </div>
                        {profile.isVerified && (
                            <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 rounded-full border-2 border-white shadow-sm" title="Verified Member">
                                <MdVerified size={14} />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left mb-2">
                        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{profile.name}</h1>
                                <div className="flex items-center gap-2 justify-center md:justify-start text-slate-500 dark:text-slate-400 font-medium mt-1">
                                    <MdOutlineAlternateEmail size={16} />
                                    <span>{profile.email}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-3 flex-wrap justify-center md:justify-start">
                                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wide">
                                        {profile.role}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                                >
                                    {isCopying ? <MdContentCopy /> : <MdShare />}
                                    {isCopying ? "Link Copied!" : "Share Profile"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Meta */}
                <div className="space-y-8">
                    {/* Stats */}
                    <SectionCard title="Experience Stats" icon={MdBadge}>
                        <div className="grid grid-cols-1 gap-4">
                            <StatCard
                                label="Approved Publications"
                                value={profile.stats?.approved || 0}
                                colorClass="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800"
                            />
                        </div>
                    </SectionCard>

                    {/* Basic Info */}
                    <SectionCard title="Contact Information" icon={MdOutlinePerson}>
                        <div className="space-y-4">
                            <DetailRow label="Phone" value={profile.profile?.phone || "N/A"} icon={MdPhone} />
                            <DetailRow label="Organization" value={profile.profile?.organization || "N/A"} icon={FaBuilding} />
                            <DetailRow label="Specialization" value={profile.profile?.specialization || "N/A"} icon={FaUserTie} />
                        </div>
                    </SectionCard>
                </div>

                {/* Right Column: Bio & Professional */}
                <div className="lg:col-span-2 space-y-8">
                    <SectionCard title="Professional Biography" icon={MdDescription}>
                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                {profile.profile?.bio || `${profile.name} is a valued member of NAAPE.`}
                            </p>
                        </div>
                    </SectionCard>

                    <SectionCard title="Professional Background" icon={MdOutlineWorkOutline}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                            <DetailRow label="Years of Experience" value={profile.professional?.yearsOfExperience ? `${profile.professional.yearsOfExperience} Years` : "N/A"} icon={MdDateRange} />
                            <DetailRow label="License Number" value={profile.professional?.licenseNumber || "Hidden"} icon={MdBadge} />
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/50">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
                                <MdSchool className="text-primary" />
                                Certifications
                            </h4>
                            {profile.professional?.certifications && profile.professional.certifications.length > 0 ? (
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {profile.professional.certifications.map((cert: string, i: number) => (
                                        <li key={i} className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                            {cert}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-slate-500 italic">No certifications listed.</p>
                            )}
                        </div>
                    </SectionCard>
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;
