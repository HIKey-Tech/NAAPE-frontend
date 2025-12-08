import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePayForEvent } from "@/hooks/useEvents";
import { EventCardProps } from "@/app/api/events/type";

import { CalendarClock, MapPin, User2, Loader2, BadgeCheck } from "lucide-react";

const truncate = (text: string, max = 40) =>
    text.length > max ? text.slice(0, max - 1) + "…" : text;

const EVENT_ANIM_CLASS = "event-card-anim";
const MICRO_ANIMS_CSS = `
/* Styles omitted for brevity, unchanged */
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
.${EVENT_ANIM_CLASS}:hover,
.${EVENT_ANIM_CLASS}.pressing {
    transform: translateY(-4px) scale(1.025);
    box-shadow: 0 4px 18px rgba(30,41,59,0.11), 0 1.5px 6px rgba(30,41,59,0.08);
    transition:
        opacity 0.7s cubic-bezier(0.4,0,0.2,1),
        transform 0.17s cubic-bezier(.42,0,.58,1),
        box-shadow 0.19s cubic-bezier(.42,0,.58,1);
}
.${EVENT_ANIM_CLASS}.pressing {
    transform: translateY(2px) scale(0.97);
    box-shadow: 0 1px 7px rgba(30,41,59,0.08);
    transition:
        transform 0.08s cubic-bezier(0.44,0,0.75,1),
        box-shadow 0.12s cubic-bezier(.42,0,.58,1);
}
@keyframes button-wave {
    0% { transform: rotate(0deg); }
    27% { transform: rotate(7deg); }
    53% { transform: rotate(-10deg);}
    80% { transform: rotate(4deg);}
    100% { transform: rotate(0deg);}
}
.event-action-btn:hover .micro-wave,
.event-action-btn:focus .micro-wave {
    animation: button-wave 0.66s cubic-bezier(0.66,0,0.34,1.06) 1;
}
@keyframes paid-badge-ping {
    0% { box-shadow: 0 0 0 0 #ffeacc70; }
    80% { box-shadow: 0 0 0 8px #ffeacc01; }
    100% { box-shadow: 0 0 0 0 #ffeacc01; }
}
.event-paid-badge.ping {
    animation: paid-badge-ping 1.2s cubic-bezier(0.39,0,0.6,1) 1;
}
.event-image-wrap:hover img,
.event-image-wrap:focus img {
    transform: scale(1.045) rotate(-0.15deg);
    transition: transform 0.36s cubic-bezier(0.32,0,0.8,1);
}
.event-image-wrap img {
    transition: transform 0.29s cubic-bezier(0.7,0,0.2,1);
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

const EventCard: React.FC<EventCardProps> = ({
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
    payments, // this is the payments prop passed in, to display on UI
    createdAt,
    updatedAt,
    className = "",
    registerLabel = "Register",
    disabled = false,
}) => {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [pressing, setPressing] = useState(false);
    const [badgePing, setBadgePing] = useState(false);
    const router = useRouter();
    const payForEventMutation = usePayForEvent();

    // CSS and mount animations
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
                                    if (isPaid) setBadgePing(true);
                                }, 40 + Math.random() * 110);
                            }
                        });
                    },
                    { threshold: 0.17 }
                )
                : null;
        if (observer) observer.observe(card);
        else {
            card.classList.add("visible");
            if (isPaid) setBadgePing(true);
        }
        return () => {
            if (observer) observer.disconnect();
            if (timer) clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        if (!badgePing) return;
        const timer = setTimeout(() => setBadgePing(false), 1250);
        return () => clearTimeout(timer);
    }, [badgePing]);

    const handlePointerDown = (e: React.PointerEvent) => {
        if (!isCardClickable) return;
        setPressing(true);
    };
    const handlePointerUp = (e: React.PointerEvent) => {
        setPressing(false);
    };
    const handlePointerLeave = (e: React.PointerEvent) => {
        setPressing(false);
    };

    // Updated handleRegister to not pass onSuccess in the mutation variables,
    // but instead supply onSuccess as the second argument to mutate().
    const handleRegister = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!id) return false;
        payForEventMutation.mutate(
            {
                eventId: id,
                name: "",
                email: ""
            },
            {
                onSuccess: (result: any) => {
                    if (typeof result === "string") {
                        window.location.href = result;
                    } else if (result && typeof result.url === "string") {
                        window.location.href = result.url;
                    } else {
                        window.location.href = `/events/${id}`;
                    }
                }
            }
        );
        return true;
    };

    const handleCardClick = (e: React.MouseEvent) => {
        if (!id) return;
        router.push(`/events/${id}`);
    };

    const isCardClickable = !!id && !disabled;

    const colors = {
        primary: "text-[#232a3c]",
        subtitle: "text-[#5161ab]",
        muted: "text-[#8ba2cc]",
        date: "text-[#888DA9]",
        time: "text-[#B2B9C6]",
        description: "text-[#868EAB]",
        location: "text-[#99ACCC]",
        tba: "text-[#c5c8cf]",
        border: "border-[#E5EAF2]",
        imageBg: "bg-[#F3F6FA]",
        button: "text-[#2049a2] bg-[#f7f8fc] border-[#bfd6f5]",
        buttonHover: "hover:bg-[#eff4fd]",
        buttonActive: "active:bg-[#d7e5fb]",
        buttonFocus: "focus:ring-[#bfd6f5]",
        buttonShadow: "shadow-sm",
        disabled: "opacity-60 cursor-not-allowed",
        free: "text-[#25a244]",
        metaLabel: "text-[#C9AA5B]",
        paidPill: "bg-[#fff3dd] text-[#b18206] border-[#ffeaaf]",
        regUser: "text-[#8ba2cc]",
        creator: "text-[#b0b6c6]",
        createdMeta: "text-[#C7D0DF]",
    };

    const fontSizes = {
        title: "text-lg md:text-[20px]",
        subtitle: "text-[13.5px]",
        location: "text-[14.5px]",
        description: "text-sm",
        price: "text-[15px]",
        registration: "text-xs",
        meta: "text-[11px]",
    };

    const locationDisplay = location
        ? <span className="truncate max-w-[70%]">{location}</span>
        : <span className={`italic ${colors.tba}`}>TBA</span>;

    const regCount = registeredUsers?.length || 0;
    const regText = regCount === 0
        ? "No registrations yet"
        : `${regCount} registered`;

    let creatorStr = "";
    if (createdBy) {
        if (typeof createdBy === "object" && "name" in createdBy) {
            creatorStr = `by ${createdBy ?? "[Creator]"}`;
        } else if (typeof createdBy === "string") {
            creatorStr = `by ${createdBy.slice(0, 20)}${createdBy.length > 20 ? "…" : ""}`;
        }
    }

    // ---- UI rendering ----
    return (
        <div
            ref={cardRef}
            className={`
                ${EVENT_ANIM_CLASS}
                ${pressing ? "pressing" : ""}
                bg-white ${colors.border} border rounded-2xl shadow-sm
                overflow-hidden flex flex-col items-stretch min-h-[282px] max-h-[500px]
                transition-shadow hover:shadow-md duration-200
                ${isCardClickable ? "cursor-pointer" : "cursor-not-allowed"}
                ${className}
            `}
            style={{ boxShadow: "0 1px 8px rgba(34,47,67,0.09)" }}
            tabIndex={isCardClickable ? 0 : -1}
            role="button"
            onClick={isCardClickable ? handleCardClick : undefined}
            onKeyDown={(e) => {
                if (!isCardClickable) return;
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardClick(e as any);
                }
            }}
            aria-label={`View event details for ${title}`}
            aria-disabled={!isCardClickable}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
        >
            {/* Banner/Event Image */}
            <div
                className={`relative w-full h-32 ${colors.imageBg} flex items-center justify-center overflow-hidden group event-image-wrap`}
                tabIndex={-1}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="object-cover w-full h-full mx-auto my-1.5 rounded-t-2xl select-none"
                        draggable={false}
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#C1C9DF] font-semibold text-lg">
                        No Image
                    </div>
                )}
                {isPaid && (
                    <div
                        className={`absolute top-3 right-3 inline-flex items-center gap-2 px-3 py-1 ${colors.paidPill} rounded-full shadow font-semibold text-xs border select-none z-10 event-paid-badge${badgePing ? " ping" : ""}`}
                    >
                        <BadgeCheck size={14} strokeWidth={2.3} className="mr-1" />
                        Paid Event
                    </div>
                )}
            </div>
            {/* Event Content */}
            <div className="flex flex-col flex-1 px-5 pt-4 pb-5 h-full">
                {/* Date */}
                <div className={`flex items-center gap-2 mb-1`}>
                    <span className="inline-block align-middle">
                        <CalendarClock size={15} className="stroke-[#B7BDC8]" strokeWidth={2} />
                    </span>
                    <span className={`${fontSizes.subtitle} ${colors.date} font-semibold`}>
                        {formatEventDate(date)}
                    </span>
                    <span className={`text-xs ${colors.time} font-medium italic ml-1`}>
                        {formatEventTime(date)}
                    </span>
                </div>
                {/* Title */}
                <div className={`${fontSizes.title} font-bold ${colors.primary} leading-snug mb-1.5 line-clamp-2 break-words`}>
                    {truncate(title, 48)}
                </div>
                {/* Location */}
                <div className={`flex items-center ${fontSizes.location} ${colors.location} font-medium gap-1.5 mb-2`}>
                    <span className="inline-block align-middle">
                        <MapPin size={15} className="stroke-[#B7BDC8]" strokeWidth={2} />
                    </span>
                    {locationDisplay}
                </div>
                {/* Description */}
                {description && (
                    <div className={`${fontSizes.description} ${colors.description} font-normal leading-snug line-clamp-3 mb-2.5`} title={description}>
                        {description}
                    </div>
                )}
                <div className="flex items-center justify-between mt-auto gap-4">
                    {/* Price/Free */}
                    <div className="flex flex-col justify-center">
                        <span className={`${fontSizes.price} font-bold ${isPaid && price > 0 ? colors.subtitle : colors.free}`}>
                            {isPaid && price > 0 ? (
                                <>
                                    {currency === "NGN" ? "₦" : currency}{price?.toLocaleString?.() ?? "?"}
                                </>
                            ) : (
                                "FREE"
                            )}
                        </span>
                        <span className={`${fontSizes.registration} text-[#BCCBE5] font-medium mt-1`}>
                            {isPaid && price > 0 ? "Ticket Price" : "Open Registration"}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={handleRegister}
                        disabled={disabled || !id || payForEventMutation.isPending}
                        className={`
                            flex items-center gap-2
                            px-5 py-1.5 rounded-full border ${colors.button}
                            font-semibold ${fontSizes.price}
                            ${colors.buttonHover} ${colors.buttonActive}
                            transition-all duration-150 event-action-btn
                            ${colors.buttonShadow} ${colors.buttonFocus}
                            focus:outline-none
                            ${disabled || !id || payForEventMutation.isPending ? colors.disabled : "cursor-pointer"}
                        `}
                        aria-label={`View details and register for ${title}`}
                        tabIndex={0}
                        onMouseDown={e => e.stopPropagation()}
                    >
                        {payForEventMutation.isPending
                            ? (
                                <>
                                    <Loader2 className="animate-spin shrink-0" size={17} strokeWidth={2.1} />
                                    <span>Processing…</span>
                                </>
                            )
                            : isPaid && price > 0
                                ? (
                                    <>
                                        <BadgeCheck className="shrink-0 micro-wave" size={15} strokeWidth={2.2} />
                                        <span>
                                            {registerLabel}
                                            <span className="ml-1 opacity-90 font-normal">
                                                ({currency === "NGN" ? "₦" : currency}{price})
                                            </span>
                                        </span>
                                    </>
                                )
                                : (
                                    <>
                                        <User2 className="shrink-0 micro-wave" size={15} strokeWidth={2.1} />
                                        <span>{registerLabel}</span>
                                    </>
                                )
                        }
                    </button>
                </div>
                {/* Registered Users */}
                {(registeredUsers || createdBy) && (
                    <div className="flex justify-between items-center mt-3">
                        {registeredUsers && (
                            <div className="flex items-center gap-1.5">
                                <User2 size={13.3} strokeWidth={2} className="stroke-[#BDCAE1]" />
                                <span className={`text-xs ${colors.regUser} font-medium`}>
                                    {regText}
                                </span>
                            </div>
                        )}
                        {/* Created By, for extra detail */}
                        {creatorStr && (
                            <span className={`text-xs ${colors.creator} font-normal italic truncate max-w-[58%]`} title={creatorStr}>
                                {creatorStr}
                            </span>
                        )}
                    </div>
                )}
                {/* --- BEGIN UI for payments prop (lines 272-276) --- */}
                {payments && Array.isArray(payments) && payments.length > 0 && (
                    <div className="mt-2 mb-1.5">
                        <div className="text-[11.5px] text-[#C9AA5B] font-semibold mb-1">Recent Payments</div>
                        <ul className="max-h-[54px] overflow-auto pr-1">
                            {payments.slice(0,3).map((payment: any, idx: number) => (
                                <li key={payment.id ?? idx} className="flex items-center gap-2 text-xs text-[#8ba2cc]">
                                    <span className="inline-block font-semibold">{payment.user?.name || payment.user?.email || "User"}</span>
                                    <span className="opacity-60 ml-1">paid</span>
                                    <span className="font-bold text-[#5161ab]">
                                        {payment.currency === "NGN" ? "₦" : payment.currency}{payment.amount?.toLocaleString?.() ?? payment.amount ?? "?"}
                                    </span>
                                    <span className="ml-1 text-[#b0b6c6]">{payment.date ? formatEventDate(payment.date) : ""}</span>
                                </li>
                            ))}
                            {payments.length > 3 && (
                                <li className="text-xs italic text-[#C1C9DF] mt-1">
                                    ...and {payments.length-3} more
                                </li>
                            )}
                        </ul>
                    </div>
                )}
                {/* --- END UI for payments prop --- */}
                {/* Created/Updated at as a caption */}
                {(createdAt || updatedAt) && (
                    <div className={`mt-2 ${fontSizes.meta} ${colors.createdMeta} font-light flex items-center gap-4`}>
                        {createdAt && (
                            <span title={`Created: ${new Date(createdAt).toLocaleString()}`}>
                                Created: {formatEventDate(createdAt)}
                            </span>
                        )}
                        {updatedAt && (
                            <span title={`Last updated: ${new Date(updatedAt).toLocaleString()}`}>
                                Updated: {formatEventDate(updatedAt)}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventCard;
