"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { useResetPassword } from "@/hooks/use-resetPassword";

interface ResetPasswordProps {
    token: string;
}

export default function ResetPassword({ token }: ResetPasswordProps) {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [localError, setLocalError] = useState<string>("");

    const { mutate: resetPassword, isPending, isSuccess } = useResetPassword();

    // Check if token is valid
    if (!token || token === "undefined") {
        return (
            <div className="max-w-md mx-auto bg-white shadow-sm border border-slate-100 rounded-2xl p-8 mt-12">
                <h2 className="text-2xl font-bold mb-1 text-center text-red-600">Invalid Reset Link</h2>
                <p className="text-slate-500 text-center mb-7 text-sm">
                    This password reset link is invalid. Please request a new one.
                </p>
                <button
                    onClick={() => router.push("/forgot-password")}
                    className="w-full bg-primary text-white py-2.5 font-bold text-base rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all"
                >
                    Request New Link
                </button>
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError("");

        if (password.length < 6) {
            setLocalError("Password must be at least 6 characters long");
            return;
        }

        if (password !== confirmPassword) {
            setLocalError("Passwords do not match");
            return;
        }

        resetPassword(
            { token, password },
            {
                onSuccess: () => {
                    setTimeout(() => {
                        router.push("/login");
                    }, 2000);
                },
                onError: (err: any) => {
                    setLocalError(
                        err?.response?.data?.message ||
                        err?.message ||
                        "Failed to reset password. The link may have expired."
                    );
                },
            }
        );
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-sm border border-slate-100 rounded-2xl p-8 mt-12">
            <h2 className="text-2xl font-bold mb-1 text-center text-primary">Reset Password</h2>
            <p className="text-slate-500 text-center mb-7 text-sm">
                Enter your new password below.
            </p>
            {isSuccess ? (
                <div className="text-emerald-600 text-center font-bold py-8 bg-emerald-50 rounded-xl">
                    Password reset successful! Redirecting to login...
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label htmlFor="password" className="block mb-1.5 text-xs font-bold text-slate-400 uppercase tracking-wide">
                            New Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            disabled={isPending}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                            placeholder="Enter new password"
                            minLength={6}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block mb-1.5 text-xs font-bold text-slate-400 uppercase tracking-wide">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            disabled={isPending}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                            placeholder="Confirm new password"
                            minLength={6}
                        />
                    </div>
                    {localError && (
                        <div className="text-red-600 text-sm font-medium">
                            {localError}
                        </div>
                    )}
                    <NaapButton
                        type="submit"
                        className="w-full bg-primary text-white py-2.5 font-bold text-base rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all"
                        disabled={isPending}
                    >
                        {isPending ? "Resetting..." : "Reset Password"}
                    </NaapButton>
                </form>
            )}
        </div>
    );
}
