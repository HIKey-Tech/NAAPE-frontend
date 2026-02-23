"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaMoon, FaSun, FaUser, FaLock, FaBell } from "react-icons/fa";
import { useAuth } from "@/context/authcontext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SettingsPage({ basePath }: { basePath: string }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { user } = useAuth();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="p-8 text-center text-slate-500">Loading settings...</div>;
    }

    const isDark = theme === "dark";

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your account preferences and application settings.</p>
            </div>

            <div className="grid gap-6">
                {/* Appearance Menu */}
                <Card className="border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-0 gap-0">
                    <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 pt-6 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            {isDark ? <FaMoon className="text-primary" /> : <FaSun className="text-primary" />}
                            Appearance
                        </CardTitle>
                        <CardDescription>
                            Customize how NAAPE looks on your device.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-slate-800 dark:text-slate-200">Theme Preference</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Switch between light and dark mode.</p>
                            </div>

                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={() => setTheme("light")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${!isDark ? "bg-white text-primary shadow-sm ring-1 ring-slate-900/5" : "text-slate-500 hover:text-slate-700"}`}
                                >
                                    <FaSun size={14} />
                                    Light Theme Active
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Settings */}
                <Card className="border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-0 gap-0">
                    <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 pt-6 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FaUser className="text-primary" />
                            Account Profile
                        </CardTitle>
                        <CardDescription>
                            Manage your personal information and profile settings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-5 space-y-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                            <div>
                                <h3 className="font-semibold text-slate-800 dark:text-slate-200">Personal Information</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Update your name, bio, and other public information.</p>
                            </div>
                            <Link href={`${basePath}/profile`}>
                                <Button variant="outline" className="dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                                    Edit Profile
                                </Button>
                            </Link>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="font-semibold text-slate-800 dark:text-slate-200">Public Profile Link</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Share this link to show your professional profile to others.</p>
                                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-600 dark:text-slate-400 break-all">
                                    {typeof window !== 'undefined' ? `${window.location.origin}/dashboard/members/${user?.profileSlug || user?._id}` : `/dashboard/members/${user?.profileSlug || user?._id}`}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                    onClick={() => {
                                        const url = `${window.location.origin}/dashboard/members/${user?.profileSlug || user?._id}`;
                                        navigator.clipboard.writeText(url);
                                        alert("Link copied to clipboard!");
                                    }}
                                >
                                    Copy Link
                                </Button>
                                <Link href={`/dashboard/members/${user?.profileSlug || user?._id}`}>
                                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                                        View Profile
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Security Settings */}
                <Card className="border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-0 gap-0">
                    <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 pt-6 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FaLock className="text-primary" />
                            Security
                        </CardTitle>
                        <CardDescription>
                            Ensure your account stays secure.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-5">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
                            <div>
                                <h3 className="font-semibold text-slate-800 dark:text-slate-200">Change Password</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Update your password regularly to keep your account safe.</p>
                            </div>
                            <Button variant="outline" className="dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700" onClick={() => alert("Password reset link sent to your email.")}>
                                Change Password
                            </Button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded-full">
                                    <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">Two-Factor Authentication</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Add an extra layer of security</p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg">Coming soon</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card className="border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-0 gap-0">
                    <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 pt-6 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FaBell className="text-primary" />
                            Notifications
                        </CardTitle>
                        <CardDescription>
                            Manage the alerts and emails you receive.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-slate-800 dark:text-slate-200">Email Notifications</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Receive important updates via email.</p>
                            </div>

                            {/* Simple Switch */}
                            <button
                                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${notificationsEnabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default SettingsPage;
