"use client";

import { useState } from "react";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { useForgotPassword } from "@/hooks/use-forgotPassword";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [localError, setLocalError] = useState<string>("");

    const { mutate: forgotPassword, isPending, error } = useForgotPassword();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError("");
        forgotPassword(
            { email },
            {
                onSuccess: () => {
                    setSubmitted(true);
                },
                onError: (err: any) => {
                    setLocalError(
                        err?.response?.data?.message ||
                        err?.message ||
                        "Something went wrong. Please try again."
                    );
                },
            }
        );
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-sm border border-slate-100 rounded-2xl p-8 mt-12">
            <h2 className="text-2xl font-bold mb-1 text-center text-primary">Forgot Password</h2>
            <p className="text-slate-500 text-center mb-7 text-sm">
                Enter your email address and we'll send you instructions to reset your password.
            </p>
            {submitted ? (
                <div className="text-emerald-600 text-center font-bold py-8 bg-emerald-50 rounded-xl">
                    If an account with that email exists, password reset instructions have been sent.
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label htmlFor="email" className="block mb-1.5 text-xs font-bold text-slate-400 uppercase tracking-wide">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            disabled={isPending}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                            placeholder="you@email.com"
                        />
                    </div>
                    {(localError || (error && typeof error === "object" && "message" in error)) && (
                        <div className="text-red-600 text-sm font-medium">
                            {localError ||
                                (typeof error?.message === "string"
                                    ? error.message
                                    : "Something went wrong. Please try again.")}
                        </div>
                    )}
                    <NaapButton
                        type="submit"
                        className="w-full bg-primary text-white py-2.5 font-bold text-base rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all"
                        disabled={isPending}
                    >
                        {isPending ? "Sending..." : "Send Reset Link"}
                    </NaapButton>
                </form>
            )}
        </div>
    );
}
