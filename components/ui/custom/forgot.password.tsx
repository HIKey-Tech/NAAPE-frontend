"use client";

import { useState } from "react";
import { NaapButton } from "@/components/ui/custom/button.naap";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            // Replace with real API integration
            await new Promise(res => setTimeout(res, 1300)); // Mock network delay
            setSubmitted(true);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-8 mt-12">
            <h2 className="text-2xl font-bold mb-1 text-center text-primary">Forgot Password</h2>
            <p className="text-gray-600 text-center mb-7 text-sm">
                Enter your email address and we’ll send you instructions to reset your password.
            </p>
            {submitted ? (
                <div className="text-green-600 text-center font-medium py-8">
                    If an account with that email exists, password reset instructions have been sent.
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label htmlFor="email" className="block mb-1 font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                            placeholder="you@email.com"
                        />
                    </div>
                    {error && (
                        <div className="text-red-600 text-sm">{error}</div>
                    )}
                    <NaapButton
                        type="submit"
                        className="w-full bg-primary text-white py-2 font-semibold text-base rounded-md hover:bg-primary/90 transition-shadow shadow"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </NaapButton>
                </form>
            )}
        </div>
    );
}
