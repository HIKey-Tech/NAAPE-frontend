"use client";

import { useState } from "react";
import { useMyProfile, useUpdateMyProfile, useUpdateMyPassword } from "@/hooks/useProfile";
import { MdEdit, MdSave, MdCancel, MdOutlineCheckCircle, MdErrorOutline } from "react-icons/md";
import { NaapButton } from "./button.naap";

/**
 * Primary color CSS classnames and variables are defined here for maintainability and easy theme changes.
 * These constants are used throughout the component to ensure color consistency.
 */
const PRIMARY_TEXT = "text-primary";
const PRIMARY_BG = "bg-primary";
const PRIMARY_BG_LIGHT = "bg-primary-50";
// The class for hover background using primary tone
const PRIMARY_BG_HOVER = "hover:bg-primary-100";
const PRIMARY_FOCUS = "focus:border-primary";

// ProfileData shape corresponds to the user data returned from the backend.
interface ProfileData {
    _id: string;
    name: string;
    email: string;
    role: string;
    specialization?: string;
    experience?: number;
    organization?: string;
    licenseNumber?: string;
    createdAt: string;
    profileImage?: string;
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

    // Local UI state for editable fields
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState<Partial<ProfileData>>({});
    const [picPreview, setPicPreview] = useState<string | undefined>();
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [passwordFields, setPasswordFields] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordStatus, setPasswordStatus] = useState<"success" | "error" | null>(null);

    // Enter edit mode and populate form with profile data
    function startEditing() {
        setForm({
            name: profile?.name ?? "",
            specialization: profile?.specialization ?? "",
            experience: profile?.experience ?? undefined,
            organization: profile?.organization ?? "",
            licenseNumber: profile?.licenseNumber ?? "",
        });
        setPicPreview(undefined);
        setEditMode(true);
    }

    // Handle form changes for input fields
    function handleFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === "experience" ? Number(value) : value,
        }));
    }

    // Handle profile image (avatar) file change for previews
    function handlePicChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            setPicPreview(URL.createObjectURL(e.target.files[0]));
            setForm(prev => ({ ...prev, profileImage: URL.createObjectURL(e.target.files![0]) }));
        }
    }

    // Reset form and exit edit mode
    function cancelEditing() {
        setEditMode(false);
        setForm({});
    }

    // Submit the profile update
    function saveProfile() {
        const payload = { ...form };
        updateProfile.mutate(payload, {
            onSuccess: () => setEditMode(false),
        });
    }

    // Handle password field changes
    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setPasswordFields(prev => ({ ...prev, [name]: value }));
    }

    // Handle password form submission logic, including frontend validation
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

    // Loading state UI
    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div
                    className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2"
                    style={{ borderColor: "var(--primary)" }}
                />
                <span className="ml-3 text-lg">Loading profile...</span>
            </div>
        );
    }

    // Error states for request errors or missing profile data
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
        <div className="p-6 space-y-7 max-w-full mx-auto">
            {/* Header with edit button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <span>My Profile</span>
                    {!editMode && (
                        <button
                            className={`text-base bg-[var(--primary-50,#f0f5ff)] hover:bg-[var(--primary-100,#e2eaff)] rounded px-2 py-1 flex items-center gap-1 ${PRIMARY_TEXT}`}
                            onClick={startEditing}
                            type="button"
                        >
                            <MdEdit /> Edit
                        </button>
                    )}
                </h1>
                {editMode && (
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className="flex items-center px-3 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white gap-2"
                            onClick={saveProfile}
                            disabled={updateProfile.isPending}
                        >
                            <MdSave />
                            Save
                        </button>
                        <button
                            type="button"
                            className="flex items-center px-3 py-1.5 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 gap-2"
                            onClick={cancelEditing}
                            disabled={updateProfile.isPending}
                        >
                            <MdCancel />
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            {/* Profile avatar and summary */}
            <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row gap-8 items-center">
                <div className="relative">
                    <img
                        src={picPreview || profile.profileImage || "/default-avatar.png"}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4"
                        style={{ borderColor: "var(--primary-100, #f0f5ff)" }}
                    />
                    {editMode && (
                        <label
                            className="absolute bottom-0 right-0 p-1 rounded-full cursor-pointer transition-colors"
                            style={{
                                backgroundColor: "var(--primary)",
                                transition: "background 0.2s",
                            }}
                            title="Change Picture"
                        >
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePicChange}
                            />
                            <MdEdit className="text-white text-xl" />
                        </label>
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex flex-col gap-1">
                        {editMode ? (
                            <input
                                name="name"
                                value={form.name ?? ""}
                                onChange={handleFieldChange}
                                className="text-2xl font-semibold border-b-2 focus:outline-none transition py-1"
                                style={{
                                    borderBottomColor: "var(--primary-200, #d2e0f7)",
                                }}
                                disabled={updateProfile.isPending}
                            />
                        ) : (
                            <h2 className="text-2xl font-semibold">{profile.name}</h2>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-gray-600">{profile.email}</span>
                            <span
                                className="px-3 py-1 text-sm rounded-md capitalize ml-2"
                                style={{
                                    background: "var(--primary-50,#f0f5ff)",
                                    color: "var(--primary)",
                                }}
                            >
                                {profile.role}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Professional Details Section */}
            <div className="bg-white shadow-lg rounded-2xl p-6">
                <h3
                    className="text-xl font-semibold mb-4"
                    style={{ color: "var(--primary)" }}
                >
                    Professional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 items-center">
                    <div>
                        <label className="block text-sm font-bold mb-1">Specialization</label>
                        {editMode ? (
                            <input
                                name="specialization"
                                value={form.specialization ?? ""}
                                onChange={handleFieldChange}
                                className="input input-bordered w-full py-1"
                                placeholder="Your Specialization"
                                style={{ borderColor: "var(--primary-200, #d2e0f7)" }}
                                disabled={updateProfile.isPending}
                            />
                        ) : (
                            <p>{profile.specialization || <span className="text-gray-400 italic">—</span>}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Experience</label>
                        {editMode ? (
                            <input
                                name="experience"
                                type="number"
                                min={0}
                                value={form.experience ?? ""}
                                onChange={handleFieldChange}
                                className="input input-bordered w-full py-1"
                                placeholder="Years"
                                style={{ borderColor: "var(--primary-200, #d2e0f7)" }}
                                disabled={updateProfile.isPending}
                            />
                        ) : (
                            <p>{profile.experience ? `${profile.experience} years` : <span className="text-gray-400 italic">—</span>}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Organization</label>
                        {editMode ? (
                            <input
                                name="organization"
                                value={form.organization ?? ""}
                                onChange={handleFieldChange}
                                className="input input-bordered w-full py-1"
                                placeholder="Organization"
                                style={{ borderColor: "var(--primary-200, #d2e0f7)" }}
                                disabled={updateProfile.isPending}
                            />
                        ) : (
                            <p>{profile.organization || <span className="text-gray-400 italic">—</span>}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">License Number</label>
                        {editMode ? (
                            <input
                                name="licenseNumber"
                                value={form.licenseNumber ?? ""}
                                onChange={handleFieldChange}
                                className="input input-bordered w-full py-1"
                                placeholder="License Number"
                                style={{ borderColor: "var(--primary-200, #d2e0f7)" }}
                                disabled={updateProfile.isPending}
                            />
                        ) : (
                            <p>{profile.licenseNumber || <span className="text-gray-400 italic">—</span>}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Membership Details Section */}
            <div className="bg-white shadow-lg rounded-2xl p-6">
                <h3
                    className="text-xl font-semibold mb-4"
                    style={{ color: "var(--primary)" }}
                >
                    Membership Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <div>
                        <strong>Member Since:</strong>{" "}
                        <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                        <strong>Member ID:</strong>{" "}
                        <span className="font-mono tracking-wider">{profile._id}</span>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            {profile.stats && (
                <div className="bg-white shadow-lg rounded-2xl p-6">
                    <h3
                        className="text-xl font-semibold mb-4"
                        style={{ color: "var(--primary)" }}
                    >
                        My Publications Stats
                    </h3>
                    <div className="flex flex-col md:flex-row gap-4">
                        <StatBox color="blue" title="Total" value={profile.stats.total} />
                        <StatBox color="green" title="Approved" value={profile.stats.approved} />
                        <StatBox color="yellow" title="Pending" value={profile.stats.pending} />
                    </div>
                </div>
            )}

            {/* Password change & logout controls */}
            <div className="flex flex-wrap gap-4 pt-4 items-center">
                {!showPasswordFields && (
                    <NaapButton
                        variant="ghost"
                        className="border shadow-sm"
                        style={{
                            color: "var(--primary)",
                            borderColor: "var(--primary-100, #f0f5ff)",
                        }}
                        onClick={() => setShowPasswordFields(true)}
                        type="button"
                    >
                        Change Password
                    </NaapButton>
                )}
                <NaapButton
                    variant="primary"
                    className="bg-red-600 hover:bg-red-700 text-white shadow-md"
                    style={{
                        backgroundColor: "var(--destructive)",
                        color: "#fff",
                    }}
                    type="button"
                >
                    Logout
                </NaapButton>
            </div>

            {/* Change Password Modal/Card */}
            {showPasswordFields && (
                <form
                    onSubmit={handlePasswordSubmit}
                    className="max-w-5xl p-6 bg-white border rounded-xl shadow-lg space-y-4 animate-fade-in-up"
                >
                    <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--primary)" }}>
                        Change Password
                    </h3>

                    <div>
                        <label className="block mb-1 font-semibold">Current Password</label>
                        <input
                            type="password"
                            name="oldPassword"
                            value={passwordFields.oldPassword}
                            onChange={handlePasswordChange}
                            className="w-full border px-3 py-2 rounded"
                            style={{
                                borderColor: "var(--primary-200, #d2e0f7)",
                                outlineColor: "var(--primary)",
                            }}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordFields.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full border px-3 py-2 rounded"
                            style={{
                                borderColor: "var(--primary-200, #d2e0f7)",
                                outlineColor: "var(--primary)",
                            }}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordFields.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full border px-3 py-2 rounded"
                            style={{
                                borderColor: "var(--primary-200, #d2e0f7)",
                                outlineColor: "var(--primary)",
                            }}
                            required
                        />
                    </div>
                    <div className="flex items-center gap-4 mt-3">
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
                </form>
            )}
        </div>
    );
}

/**
 * StatBox displays a single statistics tile (Total, Approved, Pending) using color schemes.
 * "blue" uses the primary color, others fallback to standard tailwind colors.
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
            className={`flex-1 rounded-lg border ${colorMap[color]} p-4 text-center shadow min-w-[150px]`}
        >
            <div className="text-5xl font-black">{value}</div>
            <div className="mt-1 text-base font-semibold">{title}</div>
        </div>
    );
}
