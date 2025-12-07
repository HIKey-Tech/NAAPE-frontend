import React, { useRef, useEffect } from "react";
import { LuTimer, LuCircleDot, LuBadgeCheck } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Status configuration object to provide visual and descriptive feedback
 * for each certification status in a detailed manner.
 */
const STATUS_CONFIG: Record<
    "pending" | "ongoing" | "completed",
    {
        label: string;
        text: string;
        bg: string;
        icon: React.ReactNode;
        desc: string;
        detail: string;
        tip?: string;
        iconColor: string;
    }
> = {
    ongoing: {
        label: "Ongoing",
        text: "text-[#FFA000]",
        bg: "bg-[#FFF7E0]",
        icon: <LuTimer className="text-[#FFA000]" aria-label="Ongoing" />,
        iconColor: "#FFA000",
        desc: "You are actively progressing through this certification.",
        detail:
            "This certification is currently underway. Be sure to complete all required modules and assessments before the expiration date. Track your progress and continue learning.",
        tip: "Check your course portal often for new materials, deadlines, and feedback from instructors."
    },
    completed: {
        label: "Completed",
        text: "text-[#43B047]",
        bg: "bg-[#E6F5EA]",
        icon: <LuBadgeCheck className="text-[#43B047]" aria-label="Completed" />,
        iconColor: "#43B047",
        desc: "Congratulations! You have successfully completed this certification.",
        detail:
            "This certification has been awarded to you. Be proud of your accomplishment! Download your certificate and update your records or CV to reflect your achievement.",
        tip: "Consider sharing your new credentials with your professional network."
    },
    pending: {
        label: "Pending",
        text: "text-[#AEBFD3]",
        bg: "bg-[#F1F2F6]",
        icon: <LuCircleDot className="text-[#AEBFD3]" aria-label="Pending" />,
        iconColor: "#AEBFD3",
        desc: "Certification not started yet. Prepare to begin soon!",
        detail:
            "This certification is awaiting your initiation. Familiarize yourself with the syllabus and key prerequisites to get a head start when the enrollment period begins.",
        tip: "You may want to set reminders or mark important dates in your calendar."
    },
};

type CertCardProps = {
    title: string;
    startDate: string;
    description: string;
    status: "ongoing" | "completed" | "pending";
    progress?: number;
    className?: string;
};

/**
 * Helper to truncate long descriptions and append an ellipsis.
 */
function truncate(text: string, max = 140): string {
    if (!text) return "";
    return text.length > max ? text.slice(0, max - 1).trimEnd() + "…" : text;
}

// CSS constants for entry animation and hover effect
const CARD_ANIMATION_CLASS = "cert-card-anim";
const CARD_ANIMATION_CSS = `
.${CARD_ANIMATION_CLASS} {
    opacity: 0;
    transform: translateY(28px) scale(0.97);
    transition:
        opacity 0.72s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.53s cubic-bezier(0.4, 0, 0.2, 1);
}
.${CARD_ANIMATION_CLASS}.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
}
.${CARD_ANIMATION_CLASS}:hover {
    transform: translateY(-5px) scale(1.035);
    box-shadow: 0 4px 18px rgba(30,41,59,0.11), 0 1.5px 6px rgba(30,41,59,0.08);
    transition:
        opacity 0.7s cubic-bezier(0.4,0,0.2,1),
        transform 0.17s cubic-bezier(.42,0,.58,1),
        box-shadow 0.19s cubic-bezier(.42,0,.58,1);
}
`;

let styleInjected = false;
function injectCardAnimCSS() {
    if (typeof window !== "undefined" && !styleInjected) {
        if (!document.getElementById("certcard-anim-style")) {
            const s = document.createElement("style");
            s.id = "certcard-anim-style";
            s.textContent = CARD_ANIMATION_CSS;
            document.head.appendChild(s);
            styleInjected = true;
        }
    }
}

/**
 * Micro interaction animation configs for framer-motion.
 */
const iconVariants = {
    initial: { scale: 0.9, rotate: 0 },
    hover: (color: string) => ({
        scale: 1.13,
        rotate: [0, 12, -12, 0],
        boxShadow: `0 0 0 2px ${color}44`,
        transition: {
            type: "spring",
            stiffness: 420,
            damping: 19,
        },
    }),
    tap: (color: string) => ({
        scale: 0.93,
        boxShadow: `0 0 0 1px ${color}76`,
        transition: { type: "spring", stiffness: 430, damping: 17 },
    }),
};

const pillVariants = {
    initial: { scale: 1, boxShadow: "0 0px 0px transparent" },
    hover: { scale: 1.03, boxShadow: "0 4px 18px #E5EAF266" },
    tap: { scale: 0.97, boxShadow: "0 2px 7px #E5EAF299" },
};

const CertCard: React.FC<CertCardProps> = ({
    title,
    startDate,
    description,
    status,
    progress,
    className = "",
}) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = React.useState(false);

    useEffect(() => {
        injectCardAnimCSS();
        const card = cardRef.current;
        if (!card) return;
        const prefersReducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) {
            setVisible(true);
            return;
        }
        let observer: IntersectionObserver | undefined;
        observer = new window.IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer?.disconnect();
                }
            },
            { threshold: 0.18 }
        );
        observer.observe(card);
        return () => {
            observer?.disconnect();
        };
    }, []);

    return (
        <div
            ref={cardRef}
            className={`${CARD_ANIMATION_CLASS} ${visible ? "visible" : ""} rounded-2xl border border-[#E5EAF2] shadow-sm bg-white w-full max-w-full px-6 py-5 flex flex-col gap-6 transition-shadow hover:shadow-md duration-200 ${className}`}
            style={{ boxShadow: "0 1px 6px rgba(30,41,59,0.06)" }}
        >
            {/* Header Section */}
            <div className="mb-0 flex items-start gap-4">
                {/* Status Icon with animation */}
                <motion.span
                    className={`rounded-xl flex items-center justify-center w-12 h-12 text-[28px] select-none ${cfg.bg}`}
                    title={cfg.label}
                    variants={iconVariants as any}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    custom={cfg.iconColor}
                    transition={{ type: "spring", damping: 23 }}
                >
                    {cfg.icon}
                </motion.span>
                {/* Title & Start Info */}
                <div className="flex flex-col flex-1 min-w-0 justify-center">
                    <div className="font-extrabold text-[1.22rem] text-[#222F43] leading-snug mb-1.5 line-clamp-2 break-words">
                        {title}
                    </div>
                    <div className="flex items-center gap-2 text-[1rem] text-[#7C8CA7] font-medium select-none" aria-label={`Start date: ${startDate}`}>
                        <span className="flex items-center">
                            <svg width="17" height="17" fill="none" viewBox="0 0 16 16" className="align-middle mr-0.5">
                                <path fill="#B7BDC8" d="M12.94 10.617A6.001 6.001 0 1 1 14 8a5.98 5.98 0 0 1-1.06 2.617zm-1.268 1.505A4.997 4.997 0 0 0 13 8c0-2.763-2.237-5-5-5S3 5.237 3 8s2.237 5 5 5c1.123 0 2.17-.368 3.002-.878l.021-.014a.016.016 0 0 1 .016 0c.096-.079.205-.162.315-.245l.318-.241zM8.75 4a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 .334.626l2.5 1.667a.75.75 0 1 0 .832-1.252l-2.166-1.444V4z"/>
                            </svg>
                        </span>
                        <span className="truncate">
                            <strong className="font-semibold text-[#4B5A75]">Start Date:</strong> {startDate}
                        </span>
                    </div>
                </div>
            </div>
            {/* Description */}
            <div className="text-[15.4px] text-[#223142] font-normal leading-snug mb-0 break-words line-clamp-4 px-0">
                {truncate(description, 160)}
            </div>
            {/* Status/Progress/Detail Section: improved alignment and micro animations */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full pt-2 gap-3 sm:gap-2">
                {/* Status and Progress micro animated pill */}
                <motion.div
                    className={`
                        inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[15.2px] font-semibold whitespace-nowrap
                        ${cfg.text} ${cfg.bg}
                    `}
                    style={{ minWidth: 125, letterSpacing: "0.01em", alignSelf: "flex-start" }}
                    title={
                        cfg.label +
                        (status === "ongoing" && progress !== undefined
                            ? ` - Progress: ${progress}%`
                            : "")
                    }
                    variants={pillVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                >
                    {/* Animated status icon */}
                    <motion.span
                        className="text-[19px] mr-1.5 flex items-center"
                        variants={iconVariants as any}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        custom={cfg.iconColor}
                        transition={{ type: "spring", damping: 21 }}
                        aria-hidden="true"
                    >
                        {cfg.icon}
                    </motion.span>
                    <span>{cfg.label}</span>
                    {status === "ongoing" && typeof progress === "number" && (
                        <motion.span 
                            className="ml-2 text-[#7E8AA5] font-semibold tabular-nums"
                            animate={{ scale: [1,1.13,1], color: ["#7E8AA5", cfg.iconColor, "#7E8AA5"] }}
                            transition={{ duration: 0.88, repeat: 1 }}
                        >{progress}%</motion.span>
                    )}
                </motion.div>
                {/* Detail, tip micro fade-in */}
                <div
                    className="flex-1 min-w-[120px] pl-1 ml-auto flex flex-col items-end gap-1 justify-center sm:items-end sm:justify-center"
                    style={{ alignItems: "flex-end" }}
                >
                    <AnimatePresence>
                        <motion.span
                            key="desc"
                            className="text-xs text-[#6D799A] font-semibold opacity-90 text-right"
                            title={cfg.detail}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.32, type: "spring", stiffness: 290 }}
                        >
                            {cfg.desc}
                        </motion.span>
                        {cfg.detail && (
                            <motion.span
                                key="detail"
                                className="mt-0.5 text-xs text-[#8A99B7] leading-normal text-right"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ delay: 0.09, duration: 0.32, type: "spring", stiffness: 225 }}
                            >
                                {cfg.detail}
                            </motion.span>
                        )}
                        {cfg.tip && (
                            <motion.span
                                key="tip"
                                className="mt-0 text-xs italic text-[#B7BDC8] text-right flex items-center justify-end"
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 16 }}
                                transition={{ delay: 0.19, duration: 0.27 }}
                            >
                                <span className="mr-1" aria-hidden="true">💡</span>{cfg.tip}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default CertCard;
