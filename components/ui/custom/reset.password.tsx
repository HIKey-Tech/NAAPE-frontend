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
            <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-8 mt-12">
                <h2 className="text-2xl font-bold mb-1 text-center text-red-600">Invalid Reset Link</h2>
                <p className="text-gray-600 text-center mb-7 text-sm">
                    This password reset link is invalid. Please request a new one.
                </p>
                <button
                    onClick={() => router.push("/forgot-password")}
                    className="w-full bg-primary text-white py-2 font-semibold text-base rounded-md hover:bg-primary/90 transition-shadow shadow"
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
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-8 mt-12">
            <h2 className="text-2xl font-bold mb-1 text-center text-primary">Reset Password</h2>
            <p className="text-gray-600 text-center mb-7 text-sm">
                Enter your new password below.
            </p>
            {isSuccess ? (
                <div className="text-green-600 text-center font-medium py-8">
                    Password reset successful! Redirecting to login...
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
                            New Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            disabled={isPending}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                            placeholder="Enter new password"
                            minLength={6}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block mb-1 font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            disabled={isPending}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                            placeholder="Confirm new password"
                            minLength={6}
                        />
                    </div>
                    {localError && (
                        <div className="text-red-600 text-sm">
                            {localError}
                        </div>
                    )}
                    <NaapButton
                        type="submit"
                        className="w-full bg-primary text-white py-2 font-semibold text-base rounded-md hover:bg-primary/90 transition-shadow shadow"
                        disabled={isPending}
                    >
                        {isPending ? "Resetting..." : "Reset Password"}
                    </NaapButton>
                </form>
            )}
        </div>
    );
}
