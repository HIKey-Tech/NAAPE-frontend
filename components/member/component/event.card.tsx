"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePayForEvent, useGetStatus, useVerifyPayment } from "@/hooks/useEvents";
import { EventCardProps } from "@/app/api/events/type";

import {
    CalendarClock,
    MapPin,
    User2,
    Loader2,
    BadgeCheck,
    CheckCircle2,
    XCircle,
} from "lucide-react";

import { useAuth } from "@/context/authcontext";

const truncate = (text: string, max = 40) =>
    text.length > max ? text.slice(0, max - 1) + "…" : text;

const EVENT_ANIM_CLASS = "event-card-anim";

// -------------------------------
// CSS Injection (unchanged)
// -------------------------------
const MICRO_ANIMS_CSS = `
/* animation CSS */
.${EVENT_ANIM_CLASS} {
    opacity: 0;
    transform: translateY(28px) scale(0.97);
    transition:
        opacity 0.72s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.53s cubic-bezier(0.4, 0, 0.2, 1),
        box-shadow 0.20s cubic-bezier(.42,0,.58,1);
}
.${EVENT_ANIM_CLASS}.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
}
`;

let styleInjected = false;

function injectEventAnimCSS() {
    if (typeof window !== "undefined" && !styleInjected) {
        if (!document.getElementById("eventcard-anim-style")) {
            const s = document.createElement("style");
            s.id = "eventcard-anim-style";
            s.textContent = MICRO_ANIMS_CSS;
            document.head.appendChild(s);
            styleInjected = true;
        }
    }
}

// -------------------------------
// Format Helpers
// -------------------------------
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

const EventCard: React.FC<EventCardProps> = ({
    _id,
    id,
    title,
    date,
    location,
    imageUrl,
    description,
    price,
    currency,
    isPaid,
    createdBy,
    registeredUsers,
    payments,
    createdAt,
    updatedAt,
    className = "",
    registerLabel = "Register",
    disabled = false,
}) => {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [pressing, setPressing] = useState(false);
    const [badgePing, setBadgePing] = useState(false);
    const [showVerify, setShowVerify] = useState(false);
    const [txId, setTxId] = useState("");
    const [paymentLinkOpened, setPaymentLinkOpened] = useState(false);

    // For keeping a "local" UI registration state
    const [showRegisterLoading, setShowRegisterLoading] = useState(false);

    const router = useRouter();
    const payForEventMutation = usePayForEvent();
    const verifyPaymentMutation = useVerifyPayment();
    const { user } = useAuth();

    // -------------------------------
    // Payment Status
    // -------------------------------
    const {
        data: paymentStatus,
        isLoading: checkingStatus,
        refetch: refetchStatus,
    } = useGetStatus(id, user?.email || undefined);

    // -------------------------------
    // Animation CSS
    // -------------------------------
    useEffect(() => {
        injectEventAnimCSS();
        const card = cardRef.current;
        if (!card) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        card.classList.add("visible");
                        if (isPaid) setBadgePing(true);
                    }
                });
            },
            { threshold: 0.17 }
        );

        observer.observe(card);
        return () => observer.disconnect();
    }, [isPaid]);

    useEffect(() => {
        if (!badgePing) return;
        const t = setTimeout(() => setBadgePing(false), 1250);
        return () => clearTimeout(t);
    }, [badgePing]);

    // -------------------------------
    // Handle Payment
    // -------------------------------
    const handleRegister = () => {
        if (!id) return;

        if (!user?.name || !user?.email) {
            router.push("/login?redirect=/events/" + id);
            return;
        }

        // Don't disable the register button if paymentStatus?.paid, just prevent duplicate calls
        if (showRegisterLoading) return;

        setShowRegisterLoading(true);
        payForEventMutation.mutate(
            {
                eventId: id,
                
                // ONLY send guest details if user is not logged in
                ...user ,
                // guest: {
                //     name: guestName,
                //     email: guestEmail,
                // },
            },
            {
                onSuccess: (data: any) => {
                    setShowRegisterLoading(false);
                    const link = data?.paymentLink || data?.link || data?.url;
                    if (link) {
                        setPaymentLinkOpened(true);
                        setShowVerify(true);
                        window.open(link, "_blank");
                        console.log("Payment link opened:", link);
                    } else {
                        console.error("No payment link returned from server");
                    }
                },
                onError: () => {
                    setShowRegisterLoading(false);
                },
            }
        );
    };

    const handleVerifyPayment = () => {
        if (!txId.trim()) {
            alert("Enter a valid transaction ID");
            return;
        }

        verifyPaymentMutation.mutate(txId, {
            onSuccess: () => {
                refetchStatus();
                setTimeout(() => {
                    setShowVerify(false);
                    setTxId("");
                }, 1500);
            },
        });
    };

    const handleCardClick = () => {
        if (disabled) return;
        router.push(`/events/${id}`);
    };

    const isPaidByUser =
        paymentStatus?.paid === true ||
        paymentStatus?.status === "completed" ||
        paymentStatus?.status === "success";

    const isPaymentPending = paymentStatus?.status === "pending";

    const isCardClickable = !!id && !disabled;

    // Override: Show button after click if not paid yet (only block if local success)
    // The Register button should remain *until* a payment status change
    // So: always render the Register button if not paidByUser or pending

    // -------------------------------
    // UI
    // -------------------------------
    return (
        <div
            ref={cardRef}
            className={`${EVENT_ANIM_CLASS} ${pressing ? "pressing" : ""} bg-white border rounded-2xl shadow-sm
                overflow-hidden flex flex-col items-stretch min-h-[282px] hover:shadow-md transition cursor-pointer ${className}`}
            onClick={isCardClickable ? handleCardClick : undefined}
            onPointerDown={() => setPressing(true)}
            onPointerUp={() => setPressing(false)}
            onPointerLeave={() => setPressing(false)}
        >
            {/* Image */}
            <div className="relative w-full h-32 bg-[#F3F6FA] overflow-hidden">
                {imageUrl ? (
                    <img src={imageUrl} className="object-cover w-full h-full" />
                ) : (
                    <div className="flex w-full h-full items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}

                {isPaid && (
                    <div
                        className={`absolute top-3 right-3 px-3 py-1 rounded-full bg-[#fff3dd] border text-[#b18206] font-semibold text-xs ${badgePing ? "ping" : ""
                            }`}
                    >
                        <BadgeCheck size={14} />
                        Paid Event
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="px-5 pt-4 pb-5 flex flex-col h-full">
                {/* Date */}
                <div className="flex items-center gap-2 mb-1">
                    <CalendarClock size={15} className="stroke-gray-400" />
                    <span className="text-gray-600 font-semibold text-sm">
                        {formatEventDate(date)}
                    </span>
                    <span className="text-xs text-gray-400 italic">
                        {formatEventTime(date)}
                    </span>
                </div>

                {/* Title */}
                <div className="text-lg font-bold text-[#232a3c] mb-1.5">
                    {truncate(title, 48)}
                </div>

                {/* Location */}
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin size={15} className="stroke-gray-400 mr-1" />
                    {location || <span className="italic text-gray-400">TBA</span>}
                </div>

                {/* Description */}
                {description && (
                    <div className="text-sm text-gray-500 line-clamp-3 mb-2.5">
                        {description}
                    </div>
                )}

                <div className="flex justify-between mt-auto items-center">
                    {/* Price */}
                    <div>
                        <span className="font-bold text-[#5161ab]">
                            {isPaid && price > 0
                                ? `${currency === "NGN" ? "₦" : currency}${price}`
                                : "FREE"}
                        </span>
                        <div className="text-xs text-gray-400">
                            {isPaid && price > 0 ? "Ticket Price" : "Open Registration"}
                        </div>
                    </div>

                    {/* Button / Status */}
                    {isPaidByUser ? (
                        <div className="flex items-center gap-2 px-5 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 font-semibold">
                            <CheckCircle2 size={15} /> Paid
                        </div>
                    ) : isPaymentPending ? (
                        <div className="flex items-center gap=2 px-5 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 font-semibold">
                            <Loader2 size={15} className="animate-spin" /> Pending
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRegister();
                            }}
                            disabled={disabled || showRegisterLoading}
                            className="px-4 py-2 rounded-full bg-[#f7f8fc] border border-[#bfd6f5] text-[#2049a2] hover:bg-[#eff4fd]"
                        >
                            {showRegisterLoading ? "Loading..." : registerLabel}
                        </button>
                    )}
                </div>

                {showVerify && (
                    <div className="mt-3 flex gap-2">
                        <input
                            type="text"
                            value={txId}
                            onChange={(e) => setTxId(e.target.value)}
                            placeholder="Enter Transaction ID"
                            className="border px-3 py-1 rounded w-full"
                        />
                        <button
                            onClick={handleVerifyPayment}
                            className="px-3 py-1 bg-blue-600 text-white rounded"
                        >
                            Verify
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventCard;
