"use client";

import React, { useEffect, useState } from "react";
import { X, CalendarClock, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EventCardProps } from "@/app/api/events/type";
import { useAuth } from "@/context/authcontext";
import { useRouter } from "next/navigation";

interface EventDetailsModalProps {
    event: EventCardProps | null;
    isOpen: boolean;
    onClose: () => void;
    onRegister: (eventId: string) => void;
    isRegistering?: boolean;
    paymentStatus?: any;
    showVerify?: boolean;
    onVerifyPayment?: (txId: string) => void;
}

function formatEventDate(date: string | Date) {
    let d = typeof date === "string" ? new Date(date) : date;
    if (!(d instanceof Date) || isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function formatEventTime(date: string | Date) {
    let d = typeof date === "string" ? new Date(date) : date;
    if (!(d instanceof Date) || isNaN(d.getTime())) return "";
    return d
        .toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        })
        .toLowerCase();
}

export function EventDetailsModal({
    event,
    isOpen,
    onClose,
    onRegister,
    isRegistering = false,
    paymentStatus,
    showVerify = false,
    onVerifyPayment,
}: EventDetailsModalProps) {
    const [txId, setTxId] = useState("");
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!event) return null;

    const isPaidByUser =
        paymentStatus?.paid === true ||
        paymentStatus?.status === "completed" ||
        paymentStatus?.status === "success";

    const isRegisteredFree = paymentStatus?.registered === true && !event.isPaid;
    const isPaymentPending = paymentStatus?.status === "pending";

    const handleRegisterClick = () => {
        if (!user || user.role === "guest") {
            router.push(`/register?event=${event.id || event._id}`);
            return;
        }
        if (!user?._id) {
            router.push(`/login?redirect=/events/${event.id || event._id}`);
            return;
        }
        onRegister(event.id || event._id || "");
    };

    const handleVerify = () => {
        if (onVerifyPayment && txId.trim()) {
            onVerifyPayment(txId);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, type: "spring" as const, damping: 25 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-colors z-10"
                                aria-label="Close modal"
                            >
                                <X size={18} className="text-slate-600" />
                            </button>

                            {/* Event Image */}
                            <div className="relative w-full h-64 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden rounded-t-2xl">
                                {event.imageUrl ? (
                                    <img
                                        src={event.imageUrl}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-slate-300">
                                        <svg width="80" height="80" fill="none" viewBox="0 0 64 64">
                                            <rect width="64" height="64" rx="14" fill="#e2e8f0" />
                                            <circle cx="22" cy="26" r="5" fill="#cbd5e1" />
                                            <rect x="12" y="38" width="40" height="10" rx="2" fill="#94a3b8" />
                                        </svg>
                                    </div>
                                )}
                                {event.isPaid && (
                                    <div className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs shadow-sm">
                                        💳 Paid Event
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                {/* Title */}
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                    {event.title}
                                </h2>

                                {/* Date & Time */}
                                <div className="flex items-center gap-2 text-slate-700 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <CalendarClock size={16} className="text-primary" />
                                    </div>
                                    <span className="font-bold text-sm">
                                        {formatEventDate(event.date)}
                                    </span>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-slate-500 text-sm">
                                        {formatEventTime(event.date)}
                                    </span>
                                </div>

                                {/* Location */}
                                <div className="flex items-center gap-2 text-slate-700 mb-6">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <MapPin size={16} className="text-primary" />
                                    </div>
                                    <span className="font-medium text-sm">
                                        {event.location || "Location TBA"}
                                    </span>
                                </div>

                                {/* Description */}
                                {event.description && (
                                    <div className="mb-6">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                                            About This Event
                                        </h3>
                                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                                            {event.description}
                                        </p>
                                    </div>
                                )}

                                {/* Price */}
                                <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                                            Ticket Price
                                        </span>
                                        <span className="text-2xl font-bold text-primary">
                                            {event.isPaid && event.price > 0
                                                ? `${event.currency === "NGN" ? "₦" : event.currency}${event.price.toLocaleString()}`
                                                : "FREE"}
                                        </span>
                                    </div>
                                </div>

                                {/* Registration Status */}
                                {isPaidByUser && (
                                    <div className="mb-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                                        <CheckCircle2 size={20} className="text-emerald-600" />
                                        <span className="text-emerald-800 font-bold text-sm">
                                            ✓ You have registered and paid for this event
                                        </span>
                                    </div>
                                )}

                                {isRegisteredFree && !isPaidByUser && (
                                    <div className="mb-4 p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-center gap-3">
                                        <CheckCircle2 size={20} className="text-primary" />
                                        <span className="text-primary font-bold text-sm">
                                            ✓ You are registered for this free event
                                        </span>
                                    </div>
                                )}

                                {isPaymentPending && (
                                    <div className="mb-4 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3">
                                        <Loader2 size={20} className="text-amber-600 animate-spin" />
                                        <span className="text-amber-800 font-bold text-sm">
                                            Payment pending verification
                                        </span>
                                    </div>
                                )}

                                {/* Verify Payment Section */}
                                {showVerify && (
                                    <div className="mb-4 p-4 bg-primary/5 border border-primary/10 rounded-xl">
                                        <p className="text-sm text-slate-700 mb-3">
                                            Payment window opened. Enter your transaction ID to verify:
                                        </p>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={txId}
                                                onChange={(e) => setTxId(e.target.value)}
                                                placeholder="Transaction ID"
                                                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                                            />
                                            <button
                                                onClick={handleVerify}
                                                className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 shadow-md shadow-primary/20 transition-all"
                                            >
                                                Verify
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Register Button */}
                                {!isPaidByUser && !isRegisteredFree && !isPaymentPending && (
                                    <button
                                        onClick={handleRegisterClick}
                                        disabled={isRegistering}
                                        className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 hover:shadow-xl"
                                    >
                                        {isRegistering ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Loader2 size={20} className="animate-spin" />
                                                Processing...
                                            </span>
                                        ) : event.isPaid && event.price > 0 ? (
                                            `Register & Pay ${event.currency === "NGN" ? "₦" : event.currency}${event.price.toLocaleString()}`
                                        ) : (
                                            "Register for Free"
                                        )}
                                    </button>
                                )}

                                {/* Registered Users Count */}
                                {event.registeredUsers && event.registeredUsers.length > 0 && (
                                    <div className="mt-4 text-center text-sm text-slate-400">
                                        {event.registeredUsers.length} {event.registeredUsers.length === 1 ? 'person has' : 'people have'} registered
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
