"use client";

import { useState } from "react";
import {
    useMyProfile,
    useUpdateMyProfile,
    useUpdateMyPassword,
} from "@/hooks/useProfile";
import { useSubscriptionStatus } from "@/hooks/useSubscription";
import { useAuth } from "@/context/authcontext";
import {
    MdEdit,
    MdSave,
    MdCancel,
    MdOutlineCheckCircle,
    MdErrorOutline,
    MdOutlineSettings,
    MdOutlineLockReset,
    MdLogout,
    MdOutlineAlternateEmail,
    MdOutlinePerson,
    MdBadge,
    MdOutlineWorkOutline,
    MdOutlineBusinessCenter,
    MdCreditCard,
    MdDateRange,
    MdOutlineVisibility,
    MdOutlineVisibilityOff,
    MdClose,
    MdPhone,
    MdDescription,
    MdSchool,
    MdVerified
} from "react-icons/md";
import { FaCrown, FaUserTie, FaBuilding } from "react-icons/fa";
import { NaapButton } from "./button.naap";
import { toast } from "sonner";
import { LogoutDialog } from "@/components/ui/logout-dialog";
import Image from "next/image";

// --- Types ---
export interface ProfileData {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "editor" | "member";
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    profile: {
        image?: {
            url: string;
            publicId: string;
        } | string;
        specialization?: string;
        bio?: string;
        organization?: string;
        phone?: string;
    };
    professional: {
        licenseNumber?: string;
        licenseDocument?: string;
        yearsOfExperience?: number;
        certifications?: string[];
    };
    stats?: {
        total: number;
        approved: number;
        pending: number;
    };
}

// --- Components ---

function SectionCard({ children, title, icon: Icon, action }: { children: React.ReactNode, title: string, icon?: React.ElementType, action?: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    {Icon && <div className="p-2 bg-slate-50 text-slate-500 rounded-lg"><Icon size={20} /></div>}
                    <h3 className="font-bold text-lg text-slate-800">{title}</h3>
                </div>
                {action}
            </div>
            {children}
        </div>
    );
}

function DetailRow({ label, value, icon: Icon, href }: { label: string, value: React.ReactNode, icon?: React.ElementType, href?: string }) {
    if (!value && value !== 0) return null;
    return (
        <div className="flex items-start gap-4 py-2">
            {Icon && <Icon className="text-slate-400 mt-1 shrink-0" size={18} />}
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
                {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline truncate block">
                        {value}
                    </a>
                ) : (
                    <div className="text-sm font-medium text-slate-800 break-words">{value}</div>
                )}
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

function InputField({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder,
    icon: Icon
}: {
    label: string,
    name: string,
    value: any,
    onChange: any,
    type?: string,
    placeholder?: string,
    icon?: React.ElementType
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                {Icon && <Icon />} {label}
            </label>
            {type === 'textarea' ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none min-h-[100px] text-sm"
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm"
                />
            )}
        </div>
    );
}

// --- Main Page Component ---

export default function ProfilePage() {
    const { data: profile, isLoading, error } = useMyProfile();
    const { data: subscriptionStatus } = useSubscriptionStatus();
    const updateProfile = useUpdateMyProfile();
    const updatePassword = useUpdateMyPassword();
    const { setAuthenticatedUser, user: authUser, token, logout } = useAuth();

    // State
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState<Partial<ProfileData>>({});
    const [picPreview, setPicPreview] = useState<string | undefined>();
    const [imageFile, setImageFile] = useState<File | null>(null);

    // UI State
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [showPersonalSettings, setShowPersonalSettings] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    // Password Form State
    const [passwordFields, setPasswordFields] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
    const [passwordStatus, setPasswordStatus] = useState<"success" | "error" | null>(null);
    const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });

    // Helpers
    function getProfileImage(p: ProfileData) {
        if (!p) return undefined;
        if (p.profile?.image) {
            if (typeof p.profile.image === "string") return p.profile.image;
            if ("publicId" in p.profile.image && p.profile.image.publicId) return p.profile.image.url;
        }
        return undefined;
    }

    function getInitials(name?: string) {
        if (!name) return "U";
        return name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]?.toUpperCase() || "").join("");
    }

    function startEditing() {
        setForm({
            name: profile?.name ?? "",
            profile: {
                specialization: profile?.profile?.specialization ?? "",
                organization: profile?.profile?.organization ?? "",
                bio: profile?.profile?.bio ?? "",
                phone: profile?.profile?.phone ?? "",
            },
            professional: {
                licenseNumber: profile?.professional?.licenseNumber ?? "",
                licenseDocument: profile?.professional?.licenseDocument ?? "",
                yearsOfExperience: profile?.professional?.yearsOfExperience,
                certifications: Array.isArray(profile?.professional?.certifications) ? [...profile.professional.certifications] : [],
            },
        });
        setPicPreview(undefined);
        setImageFile(null);
        setEditMode(true);
    }

    function handleFieldChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        if (name.startsWith("profile.")) {
            const key = name.split(".")[1];
            setForm((prev) => ({ ...prev, profile: { ...prev.profile, [key]: value } }));
        } else if (name.startsWith("professional.")) {
            const key = name.split(".")[1];
            setForm((prev) => ({ ...prev, professional: { ...prev.professional, [key]: key === "yearsOfExperience" ? (value === "" ? undefined : Number(value)) : value } }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    }

    function handleCertificationsChange(index: number, val: string) {
        setForm((prev) => {
            const list = [...(prev.professional?.certifications || [])];
            list[index] = val;
            return { ...prev, professional: { ...prev.professional, certifications: list } };
        });
    }

    function addCertification() {
        setForm((prev) => ({ ...prev, professional: { ...prev.professional, certifications: [...(prev.professional?.certifications || []), ""] } }));
    }

    function removeCertification(index: number) {
        setForm((prev) => {
            const list = [...(prev.professional?.certifications || [])];
            list.splice(index, 1);
            return { ...prev, professional: { ...prev.professional, certifications: list } };
        });
    }

    function cancelEditing() {
        setEditMode(false);
        setForm({});
        setImageFile(null);
        setPicPreview(undefined);
    }

    function saveProfile() {
        const formData = new FormData();
        if (form.name) formData.append("name", form.name);

        if (form.profile) {
            const { image, ...cleanProfile } = form.profile as any;
            const sanitized = Object.fromEntries(Object.entries(cleanProfile).filter(([_, v]) => v !== undefined && v !== null && v !== ""));
            if (Object.keys(sanitized).length > 0) formData.append("profile", JSON.stringify(sanitized));
        }

        if (form.professional) {
            const sanitized = { ...form.professional, certifications: form.professional.certifications?.filter(Boolean) || [] };
            const clean = Object.fromEntries(Object.entries(sanitized).filter(([_, v]) => v !== undefined && v !== null && v !== ""));
            if (Object.keys(clean).length > 0) formData.append("professional", JSON.stringify(clean));
        }

        if (imageFile) formData.append("image", imageFile);

        const profileData: any = {};
        formData.forEach((value, key) => { profileData[key] = value; });

        updateProfile.mutate(profileData, {
            onSuccess: (response) => {
                setEditMode(false);
                toast.success("Profile updated successfully");
                if (response?.data && authUser && token) {
                    setAuthenticatedUser({ ...authUser, name: response.data.name || authUser.name, profile: response.data.profile }, token);
                }
            },
            onError: (err: any) => toast.error(err?.message || "Profile update failed"),
        });
    }

    function handlePasswordSubmit(e: React.FormEvent) {
        e.preventDefault();
        setPasswordStatus(null);
        if (passwordFields.newPassword !== passwordFields.confirmPassword) {
            setPasswordStatus("error");
            toast.error("Passwords do not match");
            return;
        }
        updatePassword.mutate({ ...passwordFields }, {
            onSuccess: () => {
                setPasswordFields({ oldPassword: "", newPassword: "", confirmPassword: "" });
                setPasswordStatus("success");
                toast.success("Password changed successfully");
                setTimeout(() => setShowPasswordFields(false), 1500);
            },
            onError: (error: any) => {
                setPasswordStatus("error");
                toast.error(error?.message || "Failed to update password");
            },
        });
    }

    function handleLogoutClick() {
        setShowLogoutDialog(true);
        setShowPersonalSettings(false);
    }

    // --- Render ---

    if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center font-medium text-slate-500 animate-pulse">Loading profile...</div>;
    if (error || !profile) return <div className="min-h-[50vh] flex items-center justify-center text-red-500 font-medium">Failed to load profile.</div>;

    const imageUrl = picPreview || getProfileImage(profile as ProfileData);
    const initials = getInitials(profile.name);

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 space-y-8 min-h-screen bg-slate-50">

            {/* --- HEADER / HERO --- */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/10 to-blue-50/50 -z-10" />

                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 pt-4">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center text-4xl font-bold text-slate-300 overflow-hidden relative">
                            {imageUrl ? (
                                <img src={imageUrl} alt={profile.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center">{initials}</div>
                            )}

                            {editMode && (
                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                                    <MdEdit className="text-white text-2xl" />
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setImageFile(e.target.files[0]);
                                            setPicPreview(URL.createObjectURL(e.target.files[0]));
                                        }
                                    }} />
                                </label>
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
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{profile.name}</h1>
                                <div className="flex items-center gap-2 justify-center md:justify-start text-slate-500 font-medium mt-1">
                                    <MdOutlineAlternateEmail size={16} />
                                    <span>{profile.email}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-3 flex-wrap justify-center md:justify-start">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wide">
                                        {profile.role}
                                    </span>
                                    {(subscriptionStatus?.hasSubscription && subscriptionStatus?.status === "active") && (
                                        <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                                            <FaCrown size={10} />
                                            {subscriptionStatus.tier === "premium" ? "Premium" : "Subscribed"}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                {!editMode ? (
                                    <>
                                        <button onClick={startEditing} className="px-5 py-2.5 rounded-xl bg-slate-50 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors border border-slate-200">
                                            Edit Profile
                                        </button>
                                        <button onClick={() => {
                                            const roleStr = typeof profile.role === "string" ? profile.role.trim().toLowerCase() : "";
                                            if (roleStr === "admin") {
                                                window.location.href = "/admin/settings";
                                            } else {
                                                window.location.href = "/settings";
                                            }
                                        }} className="p-2.5 rounded-xl bg-white text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm">
                                            <MdOutlineSettings size={20} />
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex gap-2">
                                        <button onClick={cancelEditing} className="px-5 py-2.5 rounded-xl bg-white text-slate-600 font-bold text-sm border border-slate-200 hover:bg-slate-50">
                                            Cancel
                                        </button>
                                        <button onClick={saveProfile} className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/20 hover:bg-blue-700">
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CONTENT GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COL: Personal & Stats */}
                <div className="space-y-8">
                    {/* Stats */}
                    {profile.stats && (
                        <SectionCard title="Publication Stats" icon={MdCreditCard}>
                            <div className="grid grid-cols-3 gap-3">
                                <StatCard label="Total" value={profile.stats.total} colorClass="bg-blue-50 text-blue-700 border-blue-100" />
                                <StatCard label="Approved" value={profile.stats.approved} colorClass="bg-emerald-50 text-emerald-700 border-emerald-100" />
                                <StatCard label="Pending" value={profile.stats.pending} colorClass="bg-amber-50 text-amber-700 border-amber-100" />
                            </div>
                        </SectionCard>
                    )}

                    {/* Membership Info */}
                    <SectionCard title="Membership Details" icon={MdBadge}>
                        <div className="space-y-4">
                            <DetailRow label="Member Since" value={new Date(profile.createdAt).toLocaleDateString()} icon={MdDateRange} />
                            <DetailRow label="Member ID" value={<span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">{profile._id}</span>} icon={MdBadge} />
                            <DetailRow label="Status" value={profile.isVerified ? "Verified" : "Unverified"} icon={MdOutlineCheckCircle} />
                            <div className="pt-4 mt-2 border-t border-slate-50">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Subscription</h4>
                                {subscriptionStatus?.hasSubscription ? (
                                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                                        <p className="text-sm font-bold text-amber-800">{subscriptionStatus.planName || "Active Plan"}</p>
                                        <p className="text-xs text-amber-600 mt-1">Expires: {new Date(subscriptionStatus.endDate!).toLocaleDateString()}</p>
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                                        <p className="text-sm font-medium text-slate-500 mb-2">Basic Membership</p>
                                        <a href="/subscription" className="text-xs font-bold text-primary hover:underline">Upgrade to Premium</a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </SectionCard>
                </div>

                {/* RIGHT COL: Detailed Form Info */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Personal Information */}
                    <SectionCard title="Personal Information" icon={MdOutlinePerson}>
                        {editMode ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2"><InputField label="Full Name" name="name" value={form.name} onChange={handleFieldChange} icon={MdOutlinePerson} /></div>
                                <InputField label="Phone" name="profile.phone" value={form.profile?.phone} onChange={handleFieldChange} icon={MdPhone} />
                                <InputField label="Organization" name="profile.organization" value={form.profile?.organization} onChange={handleFieldChange} icon={FaBuilding} />
                                <div className="col-span-2"><InputField label="Bio" name="profile.bio" value={form.profile?.bio} onChange={handleFieldChange} type="textarea" placeholder="Tell us about yourself..." icon={MdDescription} /></div>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                    <DetailRow label="Full Name" value={profile.name} icon={MdOutlinePerson} />
                                    <DetailRow label="Email" value={profile.email} icon={MdOutlineAlternateEmail} />
                                    <DetailRow label="Phone" value={profile.profile?.phone} icon={MdPhone} />
                                    <DetailRow label="Organization" value={profile.profile?.organization} icon={FaBuilding} />
                                </div>
                                <div className="pt-4 border-t border-slate-50">
                                    <DetailRow label="Bio" value={profile.profile?.bio || <span className="text-slate-400 italic">No bio added yet.</span>} />
                                </div>
                            </div>
                        )}
                    </SectionCard>

                    {/* Professional Details */}
                    <SectionCard title="Professional Details" icon={MdOutlineWorkOutline}>
                        {editMode ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label="Specialization" name="profile.specialization" value={form.profile?.specialization} onChange={handleFieldChange} icon={FaUserTie} />
                                    <InputField label="Years Experience" name="professional.yearsOfExperience" value={form.professional?.yearsOfExperience} onChange={handleFieldChange} type="number" icon={MdDateRange} />
                                    <InputField label="License Number" name="professional.licenseNumber" value={form.professional?.licenseNumber} onChange={handleFieldChange} icon={MdCreditCard} />
                                    <InputField label="License Document URL" name="professional.licenseDocument" value={form.professional?.licenseDocument} onChange={handleFieldChange} placeholder="https://..." icon={MdDescription} />
                                </div>

                                <div className="pt-4 border-t border-slate-50">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2 mb-3">
                                        <MdSchool /> Certifications
                                    </label>
                                    <div className="space-y-3">
                                        {form.professional?.certifications?.map((cert, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input
                                                    value={cert}
                                                    onChange={(e) => handleCertificationsChange(i, e.target.value)}
                                                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:border-primary focus:outline-none"
                                                    placeholder="Certification Name"
                                                />
                                                <button onClick={() => removeCertification(i)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <MdClose />
                                                </button>
                                            </div>
                                        ))}
                                        <button onClick={addCertification} className="text-sm font-bold text-primary hover:text-blue-700 py-2">
                                            + Add Certification
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                    <DetailRow label="Specialization" value={profile.profile?.specialization} icon={FaUserTie} />
                                    <DetailRow label="Experience" value={profile.professional?.yearsOfExperience ? `${profile.professional.yearsOfExperience} Years` : null} icon={MdDateRange} />
                                    <DetailRow label="License Number" value={profile.professional?.licenseNumber} icon={MdCreditCard} />
                                    <DetailRow label="License Document" value="View Document" href={profile.professional?.licenseDocument} icon={MdDescription} />
                                </div>
                                <div className="pt-4 border-t border-slate-50">
                                    <DetailRow
                                        label="Certifications"
                                        icon={MdSchool}
                                        value={
                                            profile.professional?.certifications?.length ? (
                                                <ul className="list-disc list-inside space-y-1 mt-1 text-slate-600">
                                                    {profile.professional.certifications.map((c: string, i: number) => <li key={i}>{c}</li>)}
                                                </ul>
                                            ) : <span className="text-slate-400 italic">No certifications listed.</span>
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    </SectionCard>

                </div>
            </div>

            {/* --- SETTINGS DRAWER --- */}
            {showPersonalSettings && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowPersonalSettings(false)} />
                    <div className="relative w-full max-w-sm bg-white h-full shadow-2xl p-8 flex flex-col animate-in slide-in-from-right duration-200">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-slate-800">Settings</h2>
                            <button onClick={() => setShowPersonalSettings(false)} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full"><MdClose /></button>
                        </div>

                        <div className="space-y-6 flex-1">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Account</h3>
                                <div className="space-y-2">
                                    <button onClick={() => { setShowPasswordFields(true); setShowPersonalSettings(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-left transition-colors text-slate-700 font-medium">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MdOutlineLockReset size={18} /></div>
                                        Change Password
                                    </button>
                                    <button onClick={() => { startEditing(); setShowPersonalSettings(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-left transition-colors text-slate-700 font-medium">
                                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><MdEdit size={18} /></div>
                                        Edit Profile
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Session</h3>
                                <button onClick={handleLogoutClick} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-left transition-colors text-red-600 font-medium">
                                    <div className="p-2 bg-red-100 text-red-600 rounded-lg"><MdLogout size={18} /></div>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODALS --- */}
            {showPasswordFields && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPasswordFields(false)} />
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative z-10 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-800">Change Password</h3>
                            <button onClick={() => setShowPasswordFields(false)} className="text-slate-400 hover:text-slate-600"><MdClose size={20} /></button>
                        </div>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <InputField label="Current Password" name="oldPassword" type="password" value={passwordFields.oldPassword} onChange={(e: any) => setPasswordFields(p => ({ ...p, oldPassword: e.target.value }))} />
                            <InputField label="New Password" name="newPassword" type="password" value={passwordFields.newPassword} onChange={(e: any) => setPasswordFields(p => ({ ...p, newPassword: e.target.value }))} />
                            <InputField label="Confirm Password" name="confirmPassword" type="password" value={passwordFields.confirmPassword} onChange={(e: any) => setPasswordFields(p => ({ ...p, confirmPassword: e.target.value }))} />
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setShowPasswordFields(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                                <button type="submit" disabled={updatePassword.isPending} className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-blue-700 shadow-md shadow-primary/20 disabled:opacity-50">
                                    {updatePassword.isPending ? "Updating..." : "Update Password"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <LogoutDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog} onConfirm={() => { logout(); setShowLogoutDialog(false); }} />
        </div>
    );
}

