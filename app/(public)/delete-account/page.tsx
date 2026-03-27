"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowLeft, FaExclamationTriangle, FaTrash, FaLock } from "react-icons/fa";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export default function DeleteAccountPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isGoogleUser, setIsGoogleUser] = useState(false);
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        if (token && userStr) {
            setIsLoggedIn(true);
            try {
                const user = JSON.parse(userStr);
                if (user.authProvider === "google" || user.googleId) {
                    setIsGoogleUser(true);
                }
            } catch {}
        }
        setChecking(false);
    }, []);

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!isGoogleUser && !password) {
            setError("Please enter your password to confirm deletion.");
            return;
        }
        if (confirm !== "DELETE") {
            setError('Please type DELETE to confirm.');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${BASE_URL}/api/v1/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { password },
            });

            // Clear local storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            document.cookie = "token=; Max-Age=0; path=/;";

            setSuccess(true);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to delete account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (checking) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#f7fafc] to-[#e4ecfa] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#2852B4] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-[#f7fafc] to-[#e4ecfa] py-8 pt-32 md:pt-40 px-4 flex flex-col items-center">
            <div aria-hidden className="pointer-events-none absolute top-0 left-0 w-64 h-64 bg-[#fde68a33] rounded-full blur-3xl opacity-60 -translate-x-1/2 -translate-y-1/2" />
            <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 w-72 h-72 bg-[#fca5a533] rounded-full blur-2xl opacity-40 translate-x-1/3 translate-y-1/3" />

            <div className="w-full max-w-2xl bg-white/95 rounded-2xl shadow-2xl p-7 md:p-10 z-10 relative backdrop-blur-md">
                <div className="mb-8 flex items-center gap-2">
                    <Link href="/" className="inline-flex items-center gap-2 text-[#21409a] hover:text-[#183b6e] transition-colors font-medium text-sm">
                        <FaArrowLeft />
                        <span>Back to Home</span>
                    </Link>
                </div>

                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaTrash className="text-red-600 text-lg" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#1c263b] tracking-tight">Delete Account</h1>
                </div>

                <p className="text-[#44485d] mb-6 text-base">
                    You can permanently delete your NAAPE account and all associated personal data using this page. This action is <strong>irreversible</strong>.
                </p>

                {/* What gets deleted */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-8">
                    <div className="flex items-start gap-3">
                        <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <h2 className="font-semibold text-red-800 mb-2">What will be deleted:</h2>
                            <ul className="text-sm text-red-700 space-y-1 list-disc ml-4">
                                <li>Your profile information and photo</li>
                                <li>Login credentials and authentication data</li>
                                <li>Notifications and personal data</li>
                                <li>All data associated with your account</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {success ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-[#1c263b] mb-2">Account Deleted</h2>
                        <p className="text-[#44485d] mb-6">Your account and personal data have been permanently removed from our systems.</p>
                        <Link href="/" className="inline-flex items-center gap-2 text-white bg-[#2852B4] px-6 py-3 rounded-lg shadow-md font-semibold hover:bg-[#183b6e] transition">
                            Return to Home
                        </Link>
                    </div>
                ) : !isLoggedIn ? (
                    <div>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
                            <div className="flex items-start gap-3">
                                <FaLock className="text-blue-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h2 className="font-semibold text-blue-800 mb-1">Sign in required</h2>
                                    <p className="text-sm text-blue-700">You need to be logged in to delete your account. Sign in first, then return to this page or go to Settings in your dashboard.</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link href="/login?redirect=/delete-account" className="inline-flex items-center justify-center gap-2 text-white bg-[#2852B4] px-6 py-3 rounded-lg shadow-md font-semibold hover:bg-[#183b6e] transition">
                                Sign In to Continue
                            </Link>
                            <a href="mailto:support@naape.ng?subject=Account Deletion Request" className="inline-flex items-center justify-center gap-2 text-[#2852B4] border border-[#2852B4] px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                                Email Support Instead
                            </a>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleDelete} className="space-y-5">
                        {!isGoogleUser && (
                            <div>
                                <label className="block text-sm font-semibold text-[#1c263b] mb-2">
                                    Confirm your password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your current password"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-[#1c263b] text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                                />
                            </div>
                        )}

                        {isGoogleUser && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                                You signed up with Google. No password confirmation is needed, but this action is permanent.
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-[#1c263b] mb-2">
                                Type <span className="font-mono text-red-600 bg-red-50 px-1 rounded">DELETE</span> to confirm
                            </label>
                            <input
                                type="text"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                placeholder="Type DELETE"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-[#1c263b] text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 text-white bg-red-600 px-6 py-3 rounded-lg shadow-md font-semibold hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <FaTrash />
                                )}
                                Permanently Delete My Account
                            </button>
                            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 text-[#2852B4] border border-[#2852B4] px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                                Cancel
                            </Link>
                        </div>
                    </form>
                )}

                <div className="mt-8 pt-6 border-t border-slate-100 text-sm text-[#6b7280]">
                    Need help? Contact us at{" "}
                    <a href="mailto:support@naape.ng" className="text-[#2852B4] hover:underline">support@naape.ng</a>
                </div>
            </div>
        </div>
    );
}
