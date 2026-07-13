"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, User } from "@/context/authcontext";
import { useRegisterForTraining } from "@/hooks/useTrainings";
import { Training } from "@/app/api/trainings/trainings";
import api from "@/lib/axios";
import { CheckCircle2, Loader2 } from "lucide-react";

type Step = "choice" | "login" | "guest" | "confirm" | "done";

export default function RegisterTrainingModal({
    training,
    isOpen,
    onClose
}: {
    training: Training;
    isOpen: boolean;
    onClose: () => void;
}) {
    const { user, login } = useAuth();
    const registerMutation = useRegisterForTraining();

    // Logged-in users skip straight to confirm
    const [step, setStep] = useState<Step>("choice");
    const effectiveStep: Step = user && (step === "choice" || step === "login") ? "confirm" : step;

    const [guest, setGuest] = useState({ name: "", email: "", phone: "" });
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [loginLoading, setLoginLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState("");

    const priceLabel = training.isPaid
        ? `${training.currency === "NGN" ? "₦" : training.currency}${(user && training.memberPrice ? training.memberPrice : training.price).toLocaleString()}`
        : "Free";

    const reset = () => {
        setStep("choice");
        setError(null);
        setSuccessMessage("");
        registerMutation.reset();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const submitRegistration = (payload: { trainingId: string; name?: string; email?: string; phone?: string }) => {
        setError(null);
        registerMutation.mutate(payload, {
            onSuccess: (result: any) => {
                if (result.link) {
                    // Paid: hand off to Flutterwave checkout
                    window.location.href = result.link;
                } else {
                    setSuccessMessage(result.message || "Registered successfully. Check your email for confirmation.");
                    setStep("done");
                }
            },
            onError: (err: any) => {
                setError(err?.response?.data?.message || err?.message || "Registration failed. Please try again.");
            }
        });
    };

    const handleGuestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!guest.name.trim() || !guest.email.trim()) {
            setError("Name and email are required");
            return;
        }
        submitRegistration({ trainingId: training._id, ...guest });
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoginLoading(true);
        try {
            const res = await api.post("/auth/login", credentials);
            const userData: User = {
                _id: res.data._id,
                name: res.data.name,
                email: res.data.email,
                role: res.data.role ?? "member",
                profile: res.data.profile,
            };
            login(userData, res.data.token);
            setStep("confirm");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Login failed. Check your credentials.");
        } finally {
            setLoginLoading(false);
        }
    };

    const isPending = registerMutation.isPending;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Register for {training.title}</DialogTitle>
                    <DialogDescription>
                        {training.isPaid ? `Fee: ${priceLabel}` : "This training is free"}
                        {training.isPaid && user && training.memberPrice ? " (member rate)" : ""}
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</div>
                )}

                {effectiveStep === "choice" && (
                    <div className="space-y-3 py-2">
                        <p className="text-sm font-medium text-slate-700">Are you an existing NAAPE member?</p>
                        <Button className="w-full" onClick={() => setStep("login")}>
                            Yes, log in to register
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => setStep("guest")}>
                            No, continue as guest
                        </Button>
                    </div>
                )}

                {effectiveStep === "login" && (
                    <form onSubmit={handleLoginSubmit} className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="reg-email">Email</Label>
                            <Input
                                id="reg-email"
                                type="email"
                                required
                                value={credentials.email}
                                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reg-password">Password</Label>
                            <Input
                                id="reg-password"
                                type="password"
                                required
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loginLoading}>
                            {loginLoading ? <Loader2 className="animate-spin" size={16} /> : "Log in & continue"}
                        </Button>
                        <button
                            type="button"
                            className="w-full text-sm text-slate-500 hover:text-slate-700"
                            onClick={() => setStep("choice")}
                        >
                            Back
                        </button>
                    </form>
                )}

                {effectiveStep === "guest" && (
                    <form onSubmit={handleGuestSubmit} className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="guest-name">Full name</Label>
                            <Input
                                id="guest-name"
                                required
                                value={guest.name}
                                onChange={(e) => setGuest({ ...guest, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="guest-email">Email</Label>
                            <Input
                                id="guest-email"
                                type="email"
                                required
                                value={guest.email}
                                onChange={(e) => setGuest({ ...guest, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="guest-phone">Phone (optional)</Label>
                            <Input
                                id="guest-phone"
                                type="tel"
                                value={guest.phone}
                                onChange={(e) => setGuest({ ...guest, phone: e.target.value })}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending
                                ? <Loader2 className="animate-spin" size={16} />
                                : training.isPaid ? `Continue to payment (${priceLabel})` : "Register for free"}
                        </Button>
                        <button
                            type="button"
                            className="w-full text-sm text-slate-500 hover:text-slate-700"
                            onClick={() => setStep("choice")}
                        >
                            Back
                        </button>
                    </form>
                )}

                {effectiveStep === "confirm" && user && (
                    <div className="space-y-4 py-2">
                        <div className="bg-slate-50 rounded-lg p-4 text-sm space-y-1">
                            <p><span className="font-medium">Name:</span> {user.name}</p>
                            <p><span className="font-medium">Email:</span> {user.email}</p>
                            <p className="text-xs text-slate-500 pt-1">Your member details will be used for this registration.</p>
                        </div>
                        <Button
                            className="w-full"
                            disabled={isPending}
                            onClick={() => submitRegistration({ trainingId: training._id })}
                        >
                            {isPending
                                ? <Loader2 className="animate-spin" size={16} />
                                : training.isPaid ? `Pay & register (${priceLabel})` : "Register for free"}
                        </Button>
                    </div>
                )}

                {effectiveStep === "done" && (
                    <div className="flex flex-col items-center text-center py-6 space-y-3">
                        <CheckCircle2 className="text-green-600" size={48} />
                        <p className="font-semibold text-slate-900">You&apos;re registered!</p>
                        <p className="text-sm text-slate-500">{successMessage}</p>
                        <Button variant="outline" onClick={handleClose}>Close</Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
