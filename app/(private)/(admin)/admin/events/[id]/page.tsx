"use client";
import { useSingleEvent, usePayForEvent } from "@/hooks/useEvents";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/authcontext";

// Animation and formatting logic inspired by EventCard
const EVENT_ANIM_CLASS = "event-card-anim";
const EVENT_ANIM_CSS = `
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
.${EVENT_ANIM_CLASS}:hover {
    transform: translateY(-4px) scale(1.025);
    box-shadow: 0 4px 18px rgba(30,41,59,0.11), 0 1.5px 6px rgba(30,41,59,0.08);
    transition:
        opacity 0.7s cubic-bezier(0.4,0,0.2,1),
        transform 0.17s cubic-bezier(.42,0,.58,1),
        box-shadow 0.19s cubic-bezier(.42,0,.58,1);
}
`;
// Shared one-time CSS injection (to keep animation consistent)
let styleInjected = false;
function injectEventAnimCSS() {
    if (typeof window !== "undefined" && !styleInjected) {
        if (!document.getElementById("eventcard-anim-style")) {
            const s = document.createElement("style");
            s.id = "eventcard-anim-style";
            s.textContent = EVENT_ANIM_CSS;
            document.head.appendChild(s);
            styleInjected = true;
        }
    }
}

// Formatting helpers from EventCard
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
    return d.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).toLowerCase();
}

// Fallback image
function FallbackImage({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center justify-center w-full h-56 bg-[#F3F6FA] rounded-xl mb-6 text-[#8ba2cc] text-5xl ${className}`}>
            <svg width="54" height="54" fill="none" viewBox="0 0 64 64">
                <rect width="64" height="64" rx="14" fill="#F3F6FA" />
                <circle cx="22" cy="26" r="5" fill="#D1DAE9" />
                <rect x="12" y="38" width="40" height="10" rx="2" fill="#DBE7F6" />
            </svg>
        </div>
    );
}

export default function AdminEventDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const { data: event, isLoading, isError } = useSingleEvent(id);
    const payForEventMutation = usePayForEvent();
    const [showImageError, setShowImageError] = useState(false);
    const { user } = useAuth();

    // Animation: fade-in on mount, like EventCard
    const cardRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        injectEventAnimCSS();
        const card = cardRef.current;
        if (!card) return;

        const prefersReducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion) {
            card.classList.add("visible");
            return;
        }

        let timer: ReturnType<typeof setTimeout> | null = null;
        const observer =
            typeof window !== "undefined" && "IntersectionObserver" in window
                ? new window.IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                timer = setTimeout(() => {
                                    card.classList.add("visible");
                                }, 40 + Math.random() * 110);
                            }
                        });
                    },
                    { threshold: 0.17 }
                )
                : null;
        if (observer) observer.observe(card);
        else card.classList.add("visible");
        return () => {
            if (observer) observer.disconnect();
            if (timer) clearTimeout(timer);
        };
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Error/fallback
    if (isError || !event) {
        return (
            <div className="flex justify-center items-center min-h-[300px] text-red-600">
                Unable to load event.
            </div>
        );
    }

    // Truncate title like card for layout
    const truncate = (text: string, max = 54) =>
        text.length > max ? text.slice(0, max - 1) + "…" : text;

    // Price/currency display logic from card
    const renderPrice =
        event.isPaid
            ? <>
                <span className="font-semibold text-[#4267E7]">
                    {event.currency === "NGN" ? "₦" : event.currency}
                    {event.price > 0 ? event.price.toLocaleString() : "?"}
                </span>
            </>
            : <span className="font-semibold text-[#5fad7f]">Free</span>;

    // Pay/Registration handler logic
    function handleRegister() {
        if (!id || payForEventMutation.isPending) return;

        // Validate user is authenticated and has required fields
        if (!user || !user.name || !user.email) {
            // This shouldn't happen in a private route, but handle gracefully
            router.push("/login");
            return;
        }

        payForEventMutation.mutate(
            {
                eventId: id,
                name: user.name,
                email: user.email
            },
            {
                onSuccess: (result: any) => {
                    // Chart payment/registration path, like EventCard
                    if (typeof result === "string") {
                        window.location.href = result;
                    } else if (result && typeof result.url === "string") {
                        window.location.href = result.url;
                    } else {
                        window.location.href = `/admin/events/${id}/payment-complete`;
                    }
                },
            }
        );
    }

    return (
        <div
            ref={cardRef}
            className={`
                ${EVENT_ANIM_CLASS}
                bg-white border border-[#E5EAF2] max-w-2xl mx-auto px-6 py-10 rounded-2xl shadow-md
                overflow-hidden flex flex-col items-stretch min-h-[380px]
                transition-shadow hover:shadow-md duration-200
            `}
            style={{ boxShadow: "0 1px 13px rgba(34,47,67,0.09)" }}
        >
            {/* Banner/Event Image */}
            <div className="relative w-full h-56 bg-[#F3F6FA] flex items-center justify-center overflow-hidden group mb-6 rounded-xl">
                {event.imageUrl && !showImageError ? (
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="object-cover w-full h-full mx-auto my-2 transition-transform duration-400 group-hover:scale-105 rounded-xl"
                        draggable={false}
                        onError={() => setShowImageError(true)}
                        loading="lazy"
                        style={{ transition: "transform 0.33s cubic-bezier(.42,0,.58,1)" }}
                    />
                ) : (
                    <FallbackImage />
                )}
            </div>

            {/* Main Title */}
            <div className="text-3xl font-extrabold text-[#222F43] mb-2 break-words">{truncate(event.title, 64)}</div>

            {/* Date & Location row */}
            <div className="flex flex-col sm:flex-row sm:space-x-6 text-base mb-2">
                <div className="flex items-center text-[#4267E7] mt-1">
                    <span className="inline-block align-middle mr-2">
                        <svg width="19" height="19" fill="none" viewBox="0 0 16 16">
                            <path fill="#B7BDC8" d="M12.94 10.617A6.001 6.001 0 1 1 14 8a5.98 5.98 0 0 1-1.06 2.617zm-1.268 1.505A4.997 4.997 0 0 0 13 8c0-2.763-2.237-5-5-5S3 5.237 3 8s2.237 5 5 5c1.123 0 2.17-.368 3.002-.878l.021-.014a.016.016 0 0 1 .016 0c.096-.079.205-.162.315-.245l.318-.241zM8.75 4a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 .334.626l2.5 1.667a.75.75 0 1 0 .832-1.252l-2.166-1.444V4z" />
                        </svg>
                    </span>
                    <span className="font-medium">
                        {event.date ? (
                            <>
                                {formatEventDate(event.date)}
                                <span className="ml-2 text-[#b2b9c6]">
                                    {` `}{formatEventTime(event.date)}
                                </span>
                            </>
                        ) : "—"}
                    </span>
                </div>
                <div className="flex items-center text-[#748095] mt-1">
                    <span className="inline-block align-middle mr-2">
                        <svg width="17" height="17" fill="none" viewBox="0 0 16 16">
                            <path fill="#B7BDC8" d="M8 2a4 4 0 0 0-4 4c0 2.157 2.267 5.184 3.284 6.41A1 1 0 0 0 8 13a1 1 0 0 0 .715-.59C9.733 11.185 12 8.158 12 6a4 4 0 0 0-4-4zm0 8.67C5.954 8.09 4 5.69 4 6a4 4 0 1 1 8 0c0 .31-1.954 2.09-4 4.67zm0-6.336a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm0 4.332a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                        </svg>
                    </span>
                    <span className="font-medium">{event.location || "—"}</span>
                </div>
            </div>

            {/* Description */}
            {event.description && (
                <div className="text-[15px] text-[#797f8d] font-normal leading-snug mb-2 mt-4">
                    {event.description}
                </div>
            )}

            {/* Price row */}
            <div className="flex items-center gap-2 mt-3 mb-5">
                {renderPrice}
            </div>

            {/* Registered users count */}
            {event.registeredUsers && (
                <div className="mt-2 text-xs text-[#8aa1cc] font-normal">
                    {event.registeredUsers.length === 0
                        ? "No registrations yet"
                        : `${event.registeredUsers.length} registered`}
                </div>
            )}

            {/* Registration/Pay Button */}
            <div className="mt-6 flex flex-col items-stretch gap-3">
                {payForEventMutation.isSuccess && (
                    <span className="text-green-700 bg-green-50 border border-green-200 rounded py-2 px-4 text-center font-medium shadow-sm transition-all">
                        Payment/Registration successful! Redirecting...
                    </span>
                )}
                {payForEventMutation.isError && (
                    <span className="text-[#D14343] bg-[#f6dad9] border border-[#ffc5c2] rounded py-2 px-4 text-center font-medium shadow transition-all">
                        {payForEventMutation.error instanceof Error
                            ? payForEventMutation.error.message
                            : "Failed to register/pay for this event."}
                    </span>
                )}
                <button
                    onClick={handleRegister}
                    disabled={!id || payForEventMutation.isPending}
                    className={`mt-2 px-7 py-2.5 border border-[#D5E3F7] rounded-md text-[#4267E7] bg-white font-medium text-[15px] transition-colors hover:bg-[#F2F7FF] focus:outline-none focus:ring-2 focus:ring-[#B2D7EF] active:bg-[#E7F1FF] shadow ${(!id || payForEventMutation.isPending) ? "opacity-60 cursor-not-allowed" : ""}`}
                    aria-label={`View details and register for ${event.title}`}
                >
                    {payForEventMutation.isPending ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin h-5 w-5 border-t-2 border-b-2 border-[#4267E7] rounded-full inline-block" />
                            Processing...
                        </span>
                    ) : event.isPaid && event.price > 0 ? (
                        `Pay and Register (${event.currency === "NGN" ? "₦" : event.currency}${event.price})`
                    ) : (
                        "Register for Event"
                    )}
                </button>
            </div>
        </div>
    );
}
