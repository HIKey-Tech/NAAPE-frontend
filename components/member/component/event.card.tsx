"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EventCardProps } from "@/app/api/events/type";
import {
    payForEvent,
    verifyPayment,
    getStatus
} from "@/app/api/events/events";

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

const EventCard: React.FC<EventCardProps & { onCardClick?: () => void }> = ({
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
    onCardClick,
}) => {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [pressing, setPressing] = useState(false);
    const [badgePing, setBadgePing] = useState(false);
    const [showVerify, setShowVerify] = useState(false);
    const [txId, setTxId] = useState("");
    const [paymentLinkOpened, setPaymentLinkOpened] = useState(false);
    const [showRegisterLoading, setShowRegisterLoading] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<any | null>(null);
    const [statusError, setStatusError] = useState<string | null>(null);

    const router = useRouter();
    const { user } = useAuth();

    // -------------------------------
    // Payment Status (now local call)
    // -------------------------------
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

    // refetch payment status (used after verify, etc)
    const refetchStatus = fetchPaymentStatus;

    useEffect(() => {
        if (id && user) {
            fetchPaymentStatus();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, user]);

    // -------------------------------
    // Animation CSS
    // -------------------------------
    useEffect(() => {
        injectEventAnimCSS();
        const card = cardRef.current;
        if (!card) return;

        // If already visible, don't re-animate
        if (card.classList.contains("visible")) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        card.classList.add("visible");
                    }
                });
            },
            { threshold: 0.17 }
        );

        observer.observe(card);
        return () => observer.disconnect();
    }, []); // Remove isPaid dependency

    // Separate effect for badge ping
    useEffect(() => {
        if (isPaid) {
            setBadgePing(true);
        }
    }, [isPaid]);

    useEffect(() => {
        if (!badgePing) return;
        const t = setTimeout(() => setBadgePing(false), 1250);
        return () => clearTimeout(t);
    }, [badgePing]);

    // -------------------------------
    // Handle Payment/Registration
    // -------------------------------
    const handleRegister = async () => {
        if (!id) return;

        if (!user || user.role === "guest") {
            router.push(`/register?event=${id}`);
            return;
        }
        if (!user?._id) {
            router.push("/login?redirect=/events/" + id);
            return;
        }
        if (showRegisterLoading) return;

        setShowRegisterLoading(true);
        try {
            const data = await payForEvent(id);
            setShowRegisterLoading(false);
            const link = data?.link;
            if (link) {
                setPaymentLinkOpened(true);
                setShowVerify(true);
                window.open(link, "_blank");
                console.log("Payment link opened:", link);
            } else {
                // free event (registered)
                fetchPaymentStatus();
                setShowVerify(false);
            }
        } catch (error: any) {
            setShowRegisterLoading(false);
        }
    };

    const handleVerifyPayment = async () => {
        if (!txId.trim()) {
            alert("Enter a valid transaction ID");
            return;
        }

        try {
            await verifyPayment(txId);
            fetchPaymentStatus();
            setTimeout(() => {
                setShowVerify(false);
                setTxId("");
            }, 1500);
        } catch (e: any) {
            // error handling could be improved if needed
        }
    };

    const handleCardClick = () => {
        console.log("Card clicked! Disabled:", disabled, "onCardClick exists:", !!onCardClick); // Debug
        if (disabled) return;
        // Trigger modal open via callback prop
        if (onCardClick) {
            console.log("Calling onCardClick"); // Debug
            onCardClick();
        } else {
            console.log("No onCardClick callback provided!"); // Debug
        }
    };

    const isPaidByUser =
        paymentStatus?.paid === true ||
        paymentStatus?.status === "completed" ||
        paymentStatus?.status === "success";

    const isPaymentPending = paymentStatus?.status === "pending";
    const isCardClickable = !!id && !disabled;

    // Debug log
    console.log("EventCard render:", { 
        id, 
        title: title?.substring(0, 20), 
        disabled, 
        isCardClickable,
        hasOnCardClick: !!onCardClick 
    });

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
