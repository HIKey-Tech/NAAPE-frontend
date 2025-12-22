"use client";

import { useState } from "react";
import {
    useMyProfile,
    useUpdateMyProfile,
    useUpdateMyPassword,
} from "@/hooks/useProfile";
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
} from "react-icons/md";
import { NaapButton } from "./button.naap";
import { toast } from "sonner";

const PRIMARY_TEXT = "text-primary";

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

export default function ProfilePage() {
    const { data: profile, isLoading, error } = useMyProfile();
    const updateProfile = useUpdateMyProfile();
    const updatePassword = useUpdateMyPassword();

    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState<Partial<ProfileData>>({});
    const [picPreview, setPicPreview] = useState<string | undefined>();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [showPersonalSettings, setShowPersonalSettings] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const [passwordFields, setPasswordFields] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordStatus, setPasswordStatus] = useState<"success" | "error" | null>(null);
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false,
    });

    function getProfileImage(p: ProfileData) {
        if (!p) return undefined;
        if (p.profile?.image) {
            if (typeof p.profile.image === "string") return p.profile.image;
            // if ("url" in p.profile.image && p.profile.image.url) return p.profile.image.url;
            if ("publicId" in p.profile.image && p.profile.image.publicId) return p.profile.image.url;
        }
        return undefined;
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
                yearsOfExperience:
                    profile?.professional?.yearsOfExperience ??
                    undefined,
                certifications: Array.isArray(profile?.professional?.certifications)
                    ? [...profile.professional.certifications]
                    : [],
            },
        });
        setPicPreview(undefined);
        setImageFile(null);
        setEditMode(true);
    }

    function handleFieldChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value } = e.target;
        if (name.startsWith("profile.")) {
            const key = name.split(".")[1];
            setForm((prev) => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    [key]: value,
                },
            }));
        } else if (name.startsWith("professional.")) {
            const key = name.split(".")[1];
            setForm((prev) => ({
                ...prev,
                professional: {
                    ...prev.professional,
                    [key]:
                        key === "yearsOfExperience"
                            ? (value === "" ? undefined : Number(value))
                            : value,
                },
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    }

    function handleCertificationsChange(index: number, val: string) {
        setForm((prev) => {
            const currentCerts = Array.isArray(prev.professional?.certifications)
                ? [...(prev.professional!.certifications as string[] ?? [])]
                : [];
            currentCerts[index] = val;
            return {
                ...prev,
                professional: {
                    ...prev.professional,
                    certifications: currentCerts,
                },
            };
        });
    }

    function addCertification() {
        setForm((prev) => {
            const certs = Array.isArray(prev.professional?.certifications)
                ? [...(prev.professional!.certifications as string[] ?? [])]
                : [];
            certs.push("");
            return {
                ...prev,
                professional: {
                    ...prev.professional,
                    certifications: certs,
                },
            };
        });
    }

    function removeCertification(index: number) {
        setForm((prev) => {
            const certs = Array.isArray(prev.professional?.certifications)
                ? [...(prev.professional!.certifications as string[] ?? [])]
                : [];
            certs.splice(index, 1);
            return {
                ...prev,
                professional: {
                    ...prev.professional,
                    certifications: certs,
                },
            };
        });
    }

    function handlePicChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];
        setImageFile(file);
        setPicPreview(URL.createObjectURL(file));
    }

    function cancelEditing() {
        setEditMode(false);
        setForm({});
        setImageFile(null);
        setPicPreview(undefined);
    }

    // --- saveProfile IMPLEMENTATION (flattening replaced) ---
    function saveProfile() {
        const formData = new FormData();

        if (form.name) {
            formData.append("name", form.name);
        }

        if (form.profile) {
            formData.append("profile", JSON.stringify(form.profile));
        }

        if (form.professional) {
            formData.append(
                "professional",
                JSON.stringify({
                    ...form.professional,
                    certifications: form.professional.certifications?.filter(Boolean) || [],
                })
            );
        }

        if (imageFile) {
            formData.append("image", imageFile);
        }

        // Convert FormData back to a plain object for updateProfile
        const profileData: any = {};
        formData.forEach((value, key) => {
            profileData[key] = value;
        });

        updateProfile.mutate(profileData, {
            onSuccess: () => {
                setEditMode(false);
                toast.success("Profile updated!");
            },
            onError: (err: any) => {
                toast.error(err?.message || "Profile update failed");
            },
        });
    }
    // --- end saveProfile implementation ---

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setPasswordFields((prev) => ({ ...prev, [name]: value }));
    }

    function handlePasswordSubmit(e: React.FormEvent) {
        e.preventDefault();
        setPasswordStatus(null);

        if (passwordFields.newPassword !== passwordFields.confirmPassword) {
            setPasswordStatus("error");
            return;
        }
        updatePassword.mutate(
            {
                oldPassword: passwordFields.oldPassword,
                newPassword: passwordFields.newPassword,
            },
            {
                onSuccess: () => {
                    setPasswordFields({
                        oldPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                    });
                    setPasswordStatus("success");
                    setTimeout(() => setShowPasswordFields(false), 1500);
                },
                onError: () => {
                    setPasswordStatus("error");
                },
            }
        );
    }

    function toggleShowPassword(type: "old" | "new" | "confirm") {
        setShowPasswords((prev) => ({
            ...prev,
            [type]: !prev[type],
        }));
    }

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div
                    className="animate-spin rounded-full h-10 w-10 border border-2"
                    style={{ borderColor: "var(--primary)" }}
                />
                <span className="ml-3 text-lg">Loading profile...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-5 text-red-500 flex items-center gap-2">
                <MdErrorOutline className="text-2xl" /> Failed to load profile. Please try again later.
            </div>
        );
    }
    if (!profile) {
        return (
            <div className="p-5 text-red-500 flex items-center gap-2">
                <MdErrorOutline className="text-2xl" /> Profile data not available.
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-2 lg:px-0 relative">
            {/* HERO */}
            <section className="relative flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden border mb-8">
                {/* Avatar + Details */}
                <div className="flex flex-col items-center justify-center py-8 px-8 min-w-[280px] relative bg-gradient-to-b from-[var(--primary-100,#f0f5ff)] via-white to-white">
                    <div className="relative group mb-4 w-40 flex justify-center">
                        <img
                            src={
                                picPreview ||
                                getProfileImage(profile as ProfileData) ||
                                "/default-avatar.png"
                            }
                            alt="Profile"
                            className="w-36 h-36 rounded-full object-cover border-[5px] shadow"
                            style={{ borderColor: "var(--primary-200, #d2e0f7)" }}
                        />
                        {editMode && (
                            <label
                                className="absolute right-2 bottom-2 p-2 flex items-center justify-center rounded-full bg-[var(--primary)] text-white cursor-pointer group-hover:scale-110 transition-transform shadow-md"
                                title="Change Picture"
                                tabIndex={0}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePicChange}
                                />
                                <MdEdit className="text-xl" />
                            </label>
                        )}
                    </div>
                    <div className="flex flex-col items-center text-center w-full max-w-xs">
                        {editMode ? (
                            <input
                                name="name"
                                value={form.name ?? ""}
                                onChange={handleFieldChange}
                                className="text-2xl font-bold border-b-2 focus:outline-none transition px-2 py-1 bg-transparent w-full text-center"
                                style={{ borderBottomColor: "var(--primary-300,#bad1f9)" }}
                                disabled={updateProfile.isPending}
                                autoFocus
                            />
                        ) : (
                            <h2 className="text-2xl font-bold flex items-center gap-2 justify-center w-full truncate">
                                <MdOutlinePerson className="text-primary text-xl opacity-80 shrink-0" />
                                <span className="truncate">{profile.name}</span>
                            </h2>
                        )}
                        <div className={`mt-2 flex items-center justify-center gap-2 ${showEmail ? "" : "opacity-60"} w-full`}>
                            <MdOutlineAlternateEmail className="shrink-0" />
                            <span className="truncate">
                                {showEmail ? (
                                    <span className="font-mono text-sm">{profile.email}</span>
                                ) : (
                                    <span className="italic text-gray-500">Hidden for privacy</span>
                                )}
                            </span>
                            <button
                                className="ml-1 underline text-xs whitespace-nowrap"
                                onClick={() => setShowEmail((v) => !v)}
                                type="button"
                            >
                                {showEmail ? "Hide" : "Show"}
                            </button>
                        </div>
                        <span
                            className="inline-flex mt-2 items-center gap-2 bg-[var(--primary-50,#f0f5ff)] text-[var(--primary)] rounded-2xl px-3 py-0.5 text-base capitalize font-semibold"
                        >
                            <MdBadge />
                            {profile.role}
                        </span>
                    </div>
                </div>
                {/* Action bar at top right - always consistently aligned */}
                <div className="absolute top-6 right-6 flex gap-2 sm:gap-3 z-20 items-center">
                    {!editMode && (
                        <NaapButton
                            className={`!text-base rounded-lg border border-[var(--primary-400,#82b2f9)] bg-[var(--primary-50,#f0f5ff)] hover:bg-[var(--primary-100,#dde8fc)] ${PRIMARY_TEXT} hover:!text-[#0e274b] transition-colors px-5 py-2`}
                            onClick={startEditing}
                            type="button"
                            icon={<MdEdit />}
                        >
                            Edit
                        </NaapButton>
                    )}
                    <NaapButton
                        className={`rounded-lg border border-[var(--primary-400,#82b2f9)] bg-[var(--primary-50,#f0f5ff)] hover:bg-[var(--primary-100,#dde8fc)] ${PRIMARY_TEXT} hover:!text-[#0e274b] px-5 py-2 flex items-center gap-2 transition-colors`}
                        onClick={() => setShowPersonalSettings((v) => !v)}
                        icon={<MdOutlineSettings />}
                        type="button"
                    >
                        Settings
                    </NaapButton>
                    {editMode && (
                        <>
                            <NaapButton
                                variant="primary"
                                className={
                                    `rounded-lg font-semibold shadow-sm px-6 py-2.5 transition-colors
                                    ${PRIMARY_TEXT} 
                                    bg-gradient-to-tr from-blue-500 via-blue-600 to-blue-700 
                                    hover:from-blue-600 hover:to-blue-800 
                                    focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 
                                    border border-blue-500`
                                }
                                icon={<MdSave className="text-white text-lg" />}
                                onClick={saveProfile}
                                disabled={updateProfile.isPending}
                            >
                                <span className="text-white">Save</span>
                            </NaapButton>
                            <NaapButton
                                className={
                                    `rounded-lg font-semibold px-6 py-2.5 border 
                                    border-gray-300 bg-gradient-to-tr from-gray-100 via-white to-gray-200 
                                    hover:bg-gray-200 hover:border-gray-400 
                                    text-gray-700 transition-colors shadow-sm 
                                    focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400`
                                }
                                icon={<MdCancel className="text-gray-600 text-lg" />}
                                onClick={cancelEditing}
                                disabled={updateProfile.isPending}
                            >
                                <span>Cancel</span>
                            </NaapButton>
                        </>
                    )}
                </div>
            </section>

            {/* Settings drawer (overlay style for personal controls & settings) */}
            {showPersonalSettings &&
                <div
                    className="fixed inset-0 flex justify-end items-stretch z-[1000] bg-black/30 animate-fade-in"
                    onClick={() => setShowPersonalSettings(false)}
                >
                    <div
                        className="bg-white h-full w-full max-w-xs sm:max-w-sm p-7 flex flex-col gap-5 border-l relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            className="absolute right-4 top-4 text-2xl opacity-60 hover:opacity-100"
                            onClick={() => setShowPersonalSettings(false)}
                            title="Close"
                            type="button"
                        >
                            &times;
                        </button>
                        <div>
                            <div className="uppercase text-xs tracking-wider font-bold text-gray-400 mb-1">
                                Quick Controls
                            </div>
                            <div className="flex flex-col gap-2">
                                <NaapButton
                                    icon={<MdOutlineLockReset />}
                                    variant="ghost"
                                    className="justify-start"
                                    onClick={() => {
                                        setShowPasswordFields(true);
                                        setShowPersonalSettings(false);
                                    }}
                                >
                                    Change Password
                                </NaapButton>
                                <NaapButton
                                    icon={<MdEdit />}
                                    variant="ghost"
                                    className="justify-start"
                                    onClick={() => {
                                        setShowPersonalSettings(false);
                                        startEditing();
                                    }}
                                >
                                    Edit Profile
                                </NaapButton>
                                <NaapButton
                                    icon={<MdLogout />}
                                    variant="ghost"
                                    className="justify-start text-red-700"
                                    style={{ color: "var(--destructive)" }}
                                >
                                    Logout
                                </NaapButton>
                            </div>
                        </div>
                        <div>
                            <div className="uppercase text-xs tracking-wider font-bold text-gray-400 mb-1">
                                Preferences
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={showEmail}
                                        onChange={() => setShowEmail(v => !v)}
                                        className="accent-[var(--primary)]"
                                    />
                                    <span>Show Email on Profile</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {/* Personal Details */}
            <section className="grid md:grid-cols-2 gap-7 mb-8">
                <div className="bg-white rounded-2xl border px-6 py-6 flex flex-col gap-6">
                    <h3 className="font-bold text-lg text-[var(--primary)] flex items-center gap-2 mb-3">
                        <MdOutlinePerson className="text-xl" />
                        Personal Info
                    </h3>
                    <div className="space-y-3">
                        <FormDetailRow
                            icon={<MdOutlinePerson />}
                            label="Full Name"
                            editing={editMode}
                            value={profile.name}
                            field="name"
                            form={form}
                            onChange={handleFieldChange}
                            editable
                            disabled={updateProfile.isPending}
                        />
                        <FormDetailRow
                            icon={<MdOutlineAlternateEmail />}
                            label="Email Address"
                            value={profile.email}
                            editing={false}
                        />
                        <FormDetailRow
                            icon={<MdOutlineBusinessCenter />}
                            label="Organization"
                            editing={editMode}
                            value={profile.profile?.organization}
                            field="profile.organization"
                            form={form}
                            onChange={handleFieldChange}
                            editable
                            disabled={updateProfile.isPending}
                        />
                        <FormDetailRow
                            icon={<>📞</>}
                            label="Phone"
                            editing={editMode}
                            value={profile.profile?.phone}
                            field="profile.phone"
                            form={form}
                            onChange={handleFieldChange}
                            editable
                            disabled={updateProfile.isPending}
                        />
                        <FormDetailRow
                            icon={<>📝</>}
                            label="Bio"
                            editing={editMode}
                            value={profile.profile?.bio}
                            field="profile.bio"
                            form={form}
                            onChange={handleFieldChange}
                            editable
                            type="textarea"
                            disabled={updateProfile.isPending}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-2xl border px-6 py-6 flex flex-col gap-6">
                    <h3 className="font-bold text-lg text-[var(--primary)] flex items-center gap-2 mb-3">
                        <MdOutlineWorkOutline className="text-xl" />
                        Professional Details
                    </h3>
                    <div className="space-y-3">
                        <FormDetailRow
                            icon={<MdOutlineWorkOutline />}
                            label="Specialization"
                            editing={editMode}
                            value={profile.profile?.specialization}
                            field="profile.specialization"
                            form={form}
                            onChange={handleFieldChange}
                            editable
                            disabled={updateProfile.isPending}
                        />
                        <FormDetailRow
                            icon={<MdCreditCard />}
                            label="License #"
                            editing={editMode}
                            value={profile.professional?.licenseNumber}
                            field="professional.licenseNumber"
                            form={form}
                            onChange={handleFieldChange}
                            editable
                            disabled={updateProfile.isPending}
                        />
                        <FormDetailRow
                            icon={<MdOutlineWorkOutline />}
                            label="Years of Experience"
                            editing={editMode}
                            value={
                                profile.professional?.yearsOfExperience !== undefined &&
                                    profile.professional?.yearsOfExperience !== null
                                    ? `${profile.professional.yearsOfExperience} years`
                                    : ''
                            }
                            field="professional.yearsOfExperience"
                            form={form}
                            onChange={handleFieldChange}
                            editable
                            type="number"
                            disabled={updateProfile.isPending}
                        />
                        {editMode ? (
                            <div className="flex items-start gap-3">
                                <div className="opacity-50 text-lg">🎓</div>
                                <div className="w-32 text-sm font-bold text-gray-700 mt-1">Certifications</div>
                                <div className="flex-1 flex flex-col gap-2">
                                    {Array.isArray(form.professional?.certifications) &&
                                        form.professional.certifications.length > 0 ? (
                                        form.professional.certifications.map((cert: string, idx: number) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <input
                                                    name={`certification_${idx}`}
                                                    className="input input-bordered flex-1 py-1 px-2 text-base border border-[var(--primary-200,#d2e0f7)] rounded-lg"
                                                    disabled={updateProfile.isPending}
                                                    value={cert}
                                                    onChange={e => handleCertificationsChange(idx, e.target.value)}
                                                    placeholder={`Certification #${idx + 1}`}
                                                />
                                                <button
                                                    type="button"
                                                    className="text-red-600 text-2xl ml-1"
                                                    onClick={() => removeCertification(idx)}
                                                    title="Remove certification"
                                                    tabIndex={-1}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 italic">—</span>
                                    )}
                                    <button
                                        type="button"
                                        className="text-primary mt-2 underline text-sm"
                                        onClick={addCertification}
                                    >
                                        + Add certification
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <FormDetailRow
                                icon={<>🎓</>}
                                label="Certifications"
                                editing={false}
                                value={
                                    Array.isArray(profile.professional?.certifications) &&
                                    profile.professional?.certifications.length
                                    ? (
                                        <ul className="list-disc ml-6">
                                            {(profile.professional.certifications as string[]).map((c: string, idx: number) => (
                                                <li key={idx}>{c}</li>
                                            ))}
                                        </ul>
                                    )
                                    : <span className="text-gray-400 italic">—</span>
                                }
                            />
                        )}
                        <FormDetailRow
                            icon={<MdOutlineBusinessCenter />}
                            label="License Document"
                            editing={editMode}
                            value={
                                profile.professional?.licenseDocument
                                    ? (
                                        <a
                                            href={profile.professional.licenseDocument}
                                            className="underline text-blue-600"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View Document
                                        </a>
                                    ) : undefined
                            }
                            field="professional.licenseDocument"
                            form={form}
                            onChange={handleFieldChange}
                            editable
                            disabled={updateProfile.isPending}
                        />
                    </div>
                </div>
            </section>

            {/* Membership and Stats */}
            <section className="grid md:grid-cols-2 gap-7 mb-8">
                <div className="bg-white rounded-2xl border px-6 py-6 flex flex-col gap-4">
                    <h3 className="font-bold text-lg text-[var(--primary)] flex items-center gap-2 mb-3">
                        <MdDateRange className="text-xl" />
                        Membership & IDs
                    </h3>
                    <div className="grid grid-cols-1  gap-3 text-base">
                        <DetailPair label="Member Since" value={new Date(profile.createdAt).toLocaleDateString()} />
                        <DetailPair label="Member ID" value={<span className="pr-4 font-mono tracking-wide">{profile._id}</span>} />
                        <DetailPair label="Role" value={profile.role} />
                        <DetailPair label="Verified" value={profile.isVerified ? "Yes" : "No"} />
                    </div>
                </div>
                {profile.stats && (
                    <div className="bg-white rounded-2xl border px-6 py-6">
                        <h3 className="font-bold text-lg text-[var(--primary)] flex items-center gap-2 mb-3">
                            My Publication Stats
                        </h3>
                        <div className="flex gap-4 mt-2">
                            <StatBox color="blue" title="Total" value={profile.stats.total} />
                            <StatBox color="green" title="Approved" value={profile.stats.approved} />
                            <StatBox color="yellow" title="Pending" value={profile.stats.pending} />
                        </div>
                    </div>
                )}
            </section>

            {/* Controls (now as a regular block at the end, not sticky, to prevent overlap) */}
            <section
                className="bg-opacity-80 py-6 z-10 flex flex-wrap gap-4 items-center border-t"
            >
                {!showPasswordFields && (
                    <NaapButton
                        variant="ghost"
                        className="border"
                        style={{
                            color: "var(--primary)",
                            borderColor: "var(--primary-100, #f0f5ff)",
                        }}
                        onClick={() => setShowPasswordFields(true)}
                        type="button"
                        icon={<MdOutlineLockReset />}
                    >
                        Change Password
                    </NaapButton>
                )}
                <NaapButton
                    variant="primary"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    style={{
                        backgroundColor: "var(--destructive)",
                        color: "#fff",
                    }}
                    type="button"
                    icon={<MdLogout />}
                >
                    Logout
                </NaapButton>
            </section>

            {/* Change Password Modal */}
            {showPasswordFields && (
                <form
                    onSubmit={handlePasswordSubmit}
                    className="fixed inset-0 bg-black/40 z-[1100] flex items-center justify-center animate-fade-in"
                >
                    <div className="max-w-md w-full p-8 bg-white border border-[var(--primary-100,#f0f5ff)] rounded-2xl space-y-5 relative"
                        onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--primary)] mb-2">
                            <MdOutlineLockReset />
                            Change Password
                        </h3>
                        <button
                            className="absolute right-5 top-5 text-2xl opacity-50 hover:opacity-100"
                            onClick={() => { setShowPasswordFields(false); setPasswordStatus(null); }}
                            type="button"
                            title="Close"
                        >
                            &times;
                        </button>
                        <div>
                            <label className="block mb-1 font-semibold">Current Password</label>
                            <div className="relative">
                                <input
                                    type={showPasswords.old ? "text" : "password"}
                                    name="oldPassword"
                                    value={passwordFields.oldPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full border px-3 py-2 rounded pr-10"
                                    style={{
                                        borderColor: "var(--primary-200, #d2e0f7)",
                                        outlineColor: "var(--primary)",
                                    }}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute top-1/2 right-2 -translate-y-1/2 text-lg opacity-60 hover:opacity-80"
                                    onClick={() => toggleShowPassword("old")}
                                    tabIndex={-1}
                                >
                                    {showPasswords.old
                                        ? <MdOutlineVisibilityOff />
                                        : <MdOutlineVisibility />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPasswords.new ? "text" : "password"}
                                    name="newPassword"
                                    value={passwordFields.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full border px-3 py-2 rounded pr-10"
                                    style={{
                                        borderColor: "var(--primary-200, #d2e0f7)",
                                        outlineColor: "var(--primary)",
                                    }}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute top-1/2 right-2 -translate-y-1/2 text-lg opacity-60 hover:opacity-80"
                                    onClick={() => toggleShowPassword("new")}
                                    tabIndex={-1}
                                >
                                    {showPasswords.new
                                        ? <MdOutlineVisibilityOff />
                                        : <MdOutlineVisibility />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Confirm New Password</label>
                            <div className="relative">
                                <input
                                    type={showPasswords.confirm ? "text" : "password"}
                                    name="confirmPassword"
                                    value={passwordFields.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full border px-3 py-2 rounded pr-10"
                                    style={{
                                        borderColor: "var(--primary-200, #d2e0f7)",
                                        outlineColor: "var(--primary)",
                                    }}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute top-1/2 right-2 -translate-y-1/2 text-lg opacity-60 hover:opacity-80"
                                    onClick={() => toggleShowPassword("confirm")}
                                    tabIndex={-1}
                                >
                                    {showPasswords.confirm
                                        ? <MdOutlineVisibilityOff />
                                        : <MdOutlineVisibility />}
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                            <NaapButton
                                type="submit"
                                icon={<MdSave />}
                                iconPosition="left"
                                variant="primary"
                                loading={updatePassword.isPending}
                                loadingText="Saving..."
                                disabled={updatePassword.isPending}
                            >
                                Change Password
                            </NaapButton>
                            <NaapButton
                                type="button"
                                icon={<MdCancel />}
                                iconPosition="left"
                                variant="ghost"
                                className="px-4 py-1.5"
                                onClick={() => {
                                    setPasswordFields({
                                        oldPassword: "",
                                        newPassword: "",
                                        confirmPassword: "",
                                    });
                                    setShowPasswordFields(false);
                                    setPasswordStatus(null);
                                }}
                                disabled={updatePassword.isPending}
                            >
                                Cancel
                            </NaapButton>
                            {passwordStatus === "success" && (
                                <span className="flex items-center text-green-700 gap-1 ml-2">
                                    <MdOutlineCheckCircle />
                                    Updated!
                                </span>
                            )}
                            {passwordStatus === "error" && (
                                <span className="flex items-center text-red-600 gap-1 ml-2">
                                    <MdErrorOutline />
                                    Error: Passwords don't match or update failed.
                                </span>
                            )}
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}

/**
 * DetailPair shows a label-value pair in a flexible format.
 */
function DetailPair({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-3">
            <span className="w-32 text-gray-500 font-medium">{label}:</span>
            <span className="">{value}</span>
        </div>
    );
}

/**
 * FormDetailRow for profile sections – editable or readonly
 * Recognizes dot notation for nested fields in `form` prop.
 */
function FormDetailRow({
    icon,
    label,
    value,
    editing,
    field,
    form,
    onChange,
    editable,
    type,
    disabled,
}: {
    icon: React.ReactNode;
    label: string;
    value: any;
    editing?: boolean;
    field?: string;
    form?: Record<string, any>;
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    editable?: boolean;
    type?: string;
    disabled?: boolean;
}) {
    function getFormFieldValue(form: any, field?: string) {
        if (!form || !field) return "";
        const keys = field.split(".");
        let v = form;
        for (const k of keys) {
            if (v && typeof v === "object" && k in v) {
                v = v[k];
            } else {
                return "";
            }
        }
        return v ?? "";
    }

    if (editing && editable && field && typeof onChange === "function") {
        if (type === "textarea") {
            return (
                <div className="flex items-center gap-3">
                    <div className="opacity-50 text-lg">{icon}</div>
                    <div className="w-32 text-sm font-bold text-gray-700">{label}</div>
                    <textarea
                        name={field}
                        value={getFormFieldValue(form, field)}
                        onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
                        placeholder={label}
                        className="input input-bordered flex-1 py-1 px-2 text-base border border-[var(--primary-200,#d2e0f7)] rounded-lg min-h-[60px]"
                        disabled={disabled}
                    />
                </div>
            );
        }
        return (
            <div className="flex items-center gap-3">
                <div className="opacity-50 text-lg">{icon}</div>
                <div className="w-32 text-sm font-bold text-gray-700">{label}</div>
                <input
                    name={field}
                    value={getFormFieldValue(form, field)}
                    onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
                    type={type || "text"}
                    placeholder={label}
                    className="input input-bordered flex-1 py-1 px-2 text-base border border-[var(--primary-200,#d2e0f7)] rounded-lg"
                    disabled={disabled}
                />
            </div>
        );
    }
    return (
        <div className="flex items-center gap-3">
            <div className="opacity-50 text-lg">{icon}</div>
            <div className="w-32 text-sm font-bold text-gray-700">{label}</div>
            <span className="text-base">
                {typeof value !== "undefined" && value !== null && value !== ""
                    ? value
                    : <span className="text-gray-400 italic">—</span>}
            </span>
        </div>
    );
}

/**
 * StatBox displays a single statistics tile (Total, Approved, Pending).
 */
function StatBox({
    color,
    title,
    value,
}: {
    color: "blue" | "green" | "yellow";
    title: string;
    value: any;
}) {
    const colorMap: Record<string, string> = {
        blue: "bg-[var(--primary-50,#f0f5ff)] text-[var(--primary,#1a73e8)] border-[var(--primary-100,#e2eaff)]",
        green: "bg-green-100 text-green-800 border-green-200",
        yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return (
        <div
            className={`flex flex-col justify-center items-center rounded-xl border ${colorMap[color]} p-5 text-center min-w-[120px]`}
        >
            <div className="text-4xl font-black">{value}</div>
            <div className="mt-1 text-sm font-semibold">{title}</div>
        </div>
    );
}
