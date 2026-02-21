"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EventCardProps } from "@/app/api/events/type";
import { payForEvent, verifyPayment, getStatus } from "@/app/api/events/events";
import { CalendarClock, MapPin, User2, Loader2, BadgeCheck, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/context/authcontext";

const truncate = (text: string, max = 40) =>
    text.length > max ? text.slice(0, max - 1) + "…" : text;

function formatEventDate(date: string | Date) {
    let d = typeof date === "string" ? new Date(date) : date;
    if (!(d instanceof Date) || isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function formatEventTime(date: string | Date) {
    let d = typeof date === "string" ? new Date(date) : date;
    if (!(d instanceof Date) || isNaN(d.getTime())) return "";
    return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase();
}

const EventCard: React.FC<EventCardProps & { onCardClick?: () => void; isAdmin?: boolean }> = ({
    _id, id, title, date, location, imageUrl, description, price, currency, isPaid, createdBy,
    registeredUsers, payments, createdAt, updatedAt, maxCapacity, currentCapacity, isFull,
    spotsRemaining, className = "", registerLabel = "Register", disabled = false, onCardClick, isAdmin = false,
}) => {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [showVerify, setShowVerify] = useState(false);
    const [txId, setTxId] = useState("");
    const [showRegisterLoading, setShowRegisterLoading] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<any | null>(null);
    const [statusError, setStatusError] = useState<string | null>(null);

    const router = useRouter();
    const { user } = useAuth();

    const fetchPaymentStatus = async () => {
        if (!id) return;
        setCheckingStatus(true);
        setStatusError(null);
        try {
            const status = await getStatus(id);
            setPaymentStatus(status);
        } catch (err: any) {
            setPaymentStatus(null);
            setStatusError(err?.message || "Could not check payment status");
        } finally {
            setCheckingStatus(false);
        }
    };

    useEffect(() => {
        if (id && user) fetchPaymentStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, user]);

    const handleRegister = async () => {
        if (!id) return;
        if (!user || user.role === "guest") { router.push(`/register?event=${id}`); return; }
        if (!user?._id) { router.push("/login?redirect=/events/" + id); return; }
        if (showRegisterLoading) return;

        setShowRegisterLoading(true);
        try {
            const data = await payForEvent(id);
            setShowRegisterLoading(false);
            const link = data?.link;
            if (link) {
                setShowVerify(true);
                window.open(link, "_blank");
            } else {
                fetchPaymentStatus();
                setShowVerify(false);
            }
        } catch { setShowRegisterLoading(false); }
    };

    const handleVerifyPayment = async () => {
        if (!txId.trim()) { alert("Enter a valid transaction ID"); return; }
        try {
            await verifyPayment(txId);
            fetchPaymentStatus();
            setTimeout(() => { setShowVerify(false); setTxId(""); }, 1500);
        } catch { }
    };

    const handleCardClick = () => { if (!disabled && onCardClick) onCardClick(); };

    const isPaidByUser = paymentStatus?.paid === true || paymentStatus?.status === "completed" || paymentStatus?.status === "success";
    const isRegisteredFree = paymentStatus?.registered === true && !isPaid;
    const isPaymentPending = paymentStatus?.status === "pending";
    const isCardClickable = !!id && !disabled;

    return (
        <div
            ref={cardRef}
            className={`bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm overflow-hidden flex flex-col min-h-[300px] hover:shadow-lg transition-all group cursor-pointer ${className}`}
            onClick={isCardClickable ? handleCardClick : undefined}
        >
            {/* Image */}
            <div className="relative w-full h-36 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                ) : (
                    <div className="flex w-full h-full items-center justify-center text-slate-300 dark:text-slate-600 text-sm font-medium">No Image</div>
                )}
                {isPaid && (
                    <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-bold text-xs">
                        <BadgeCheck size={14} /> Paid
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="px-5 pt-4 pb-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                    <CalendarClock size={14} className="text-slate-400 dark:text-slate-500" />
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{formatEventDate(date)}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{formatEventTime(date)}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1.5 group-hover:text-primary transition-colors leading-snug">
                    {truncate(title, 48)}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <MapPin size={13} className="text-slate-400 dark:text-slate-500" />
                    {location || <span className="italic text-slate-400 dark:text-slate-600">TBA</span>}
                </div>

                {description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">{description}</p>
                )}

                {maxCapacity && (
                    <div className="flex items-center gap-2 mb-3 text-xs">
                        <User2 size={13} className="text-slate-400 dark:text-slate-500" />
                        <span className={`font-bold ${isFull ? 'text-red-600 dark:text-red-400' : spotsRemaining && spotsRemaining <= 5 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'}`}>
                            {isFull ? (
                                <span className="inline-flex items-center gap-1"><XCircle size={12} /> Full</span>
                            ) : (
                                `${spotsRemaining} spot${spotsRemaining === 1 ? '' : 's'} left`
                            )}
                        </span>
                        <span className="text-slate-400">• {currentCapacity || registeredUsers?.length || 0}/{maxCapacity}</span>
                    </div>
                )}

                <div className="flex justify-between mt-auto items-center pt-2 border-t border-slate-50 dark:border-slate-800/60">
                    <div>
                        <span className="font-black text-lg text-primary dark:text-blue-400">
                            {isPaid && price > 0 ? `${currency === "NGN" ? "₦" : currency}${price.toLocaleString()}` : "FREE"}
                        </span>
                        <div className="text-xs text-slate-400 dark:text-slate-500">{isPaid && price > 0 ? "Ticket" : "Open"}</div>
                    </div>

                    {isFull && !isPaidByUser && !isRegisteredFree ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 border border-red-100 text-red-600 font-bold text-xs">
                            <XCircle size={14} /> Full
                        </span>
                    ) : isPaidByUser ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold text-xs">
                            <CheckCircle2 size={14} /> Registered
                        </span>
                    ) : isRegisteredFree ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/5 border border-primary/10 text-primary font-bold text-xs">
                            <CheckCircle2 size={14} /> Registered
                        </span>
                    ) : isPaymentPending ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 font-bold text-xs">
                            <Loader2 size={14} className="animate-spin" /> Pending
                        </span>
                    ) : !isAdmin ? (
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleRegister(); }}
                            disabled={disabled || showRegisterLoading || isFull}
                            className="px-5 py-2 rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {isFull ? "Full" : showRegisterLoading ? "Loading..." : registerLabel}
                        </button>
                    ) : null}
                </div>

                {showVerify && (
                    <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <input
                            type="text"
                            value={txId}
                            onChange={(e) => setTxId(e.target.value)}
                            placeholder="Transaction ID"
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
                        />
                        <button onClick={handleVerifyPayment} className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors">
                            Verify
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventCard;
