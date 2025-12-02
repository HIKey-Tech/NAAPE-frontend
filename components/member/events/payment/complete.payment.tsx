"use client";

import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const icons = {
    success: <CheckCircle2 className="text-green-600 drop-shadow-lg mb-5" size={74} strokeWidth={1.08} aria-hidden="true" />,
    error: <XCircle className="text-red-600 drop-shadow-lg mb-5" size={74} strokeWidth={1.08} aria-hidden="true" />,
    loading: <Loader2 className="animate-spin text-blue-500 mb-5" size={60} strokeWidth={1.22} aria-hidden="true" />,
};

const messages = {
    success: (eventName: string) => ({
        title: "Payment Successful!",
        subtitle: (
            <>
                Thank you for registering and completing your payment for{" "}
                <span className="font-semibold text-primary">{eventName}</span>.
                <br />
                We look forward to seeing you at the event. An email with the confirmation details has been sent to you.
            </>
        ),
    }),
    error: (eventName: string) => ({
        title: "Payment Failed",
        subtitle: (
            <>
                Unfortunately, your payment for{" "}
                <span className="font-semibold text-primary">{eventName}</span> did not go through.<br />
                Please try again, or contact support if you need assistance.
            </>
        ),
    }),
    loading: () => ({
        title: "Processing Payment...",
        subtitle: (
            <>Hang tight! We're verifying your payment details. This should only take a moment.</>
        ),
    }),
};

export default function PaymentComplete({ eventName = "the event" }: { eventName?: string }) {
    const params = useSearchParams();
    const status = params.get("status");
    const [isReady, setIsReady] = useState(false);

    // Simulate a loader for a short moment for better UX polish
    useEffect(() => {
        // small loading if there's no status yet (SSR/SSG navigation)
        if (!status) {
            setIsReady(false);
            const t = setTimeout(() => setIsReady(true), 420); // short, snappy
            return () => clearTimeout(t);
        } else {
            setIsReady(true);
        }
    }, [status]);

    let state: "success" | "error" | "loading";
    if (!isReady || status === null) {
        state = "loading";
    } else if (status !== "success") {
        state = "error";
    } else {
        state = "success";
    }

    const { title, subtitle } =
        state === "success" || state === "error"
            ? messages[state](eventName)
            : messages["loading"]();

    return (
        <div className="flex flex-col items-center justify-center min-h-[55vh] py-12 px-4">
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={state}
                    initial={{ scale: 0.75, opacity: 0, y: 22 }}
                    animate={{ scale: 1, opacity: 1, rotate: [0, 10, -7, 0], y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 35 }}
                    transition={{
                        type: "spring",
                        stiffness: 405,
                        damping: 23,
                        duration: 0.8,
                    }}
                >
                    {icons[state]}
                </motion.div>
            </AnimatePresence>
            <motion.h2
                className={`text-3xl font-extrabold mb-3 text-center ${
                    state === "success"
                        ? "text-green-800"
                        : state === "error"
                        ? "text-red-800"
                        : "text-blue-700"
                }`}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.12, type: "spring", stiffness: 60, damping: 14 }}
            >
                {title}
            </motion.h2>
            <motion.p
                className="text-base sm:text-lg text-slate-700 mb-8 text-center max-w-xl"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.21, type: "spring", stiffness: 60, damping: 13 }}
            >
                {subtitle}
            </motion.p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-2">
                {state === "success" && (
                    <Link
                        href="/dashboard/events"
                        prefetch
                        className="inline-block px-6 py-2.5 bg-primary text-white rounded-lg font-semibold shadow-md hover:bg-primary/95 focus:ring-2 focus:ring-primary/50 transition-all duration-150 active:scale-[0.99]"
                        aria-label="View My Events"
                    >
                        View My Events
                    </Link>
                )}
                {(state === "error" || state === "success") && (
                    <Link
                        href="/dashboard"
                        prefetch
                        className="inline-block px-6 py-2.5 bg-slate-100 text-slate-800 rounded-lg font-semibold shadow-md hover:bg-slate-200 focus:ring-2 focus:ring-slate-200/90 transition-all duration-150 active:scale-[0.99]"
                        aria-label="Go to Dashboard"
                    >
                        Go to Dashboard
                    </Link>
                )}
                {state === "error" && (
                    <Link
                        href="/dashboard/events"
                        prefetch
                        className="inline-block px-6 py-2.5 bg-primary text-white rounded-lg font-semibold shadow-md hover:bg-primary/95 focus:ring-2 focus:ring-primary/60 transition-all duration-150 active:scale-[0.99]"
                        aria-label="Try Payment Again"
                    >
                        Try Again
                    </Link>
                )}
            </div>
            <div className="mt-9 text-center">
                <span className="text-sm text-slate-500">
                    Need assistance?{" "}
                    <Link
                        href="/support"
                        className="underline text-primary hover:text-primary/90 font-medium transition-colors duration-100"
                        aria-label="Contact Support"
                    >
                        Contact Support
                    </Link>
                </span>
            </div>
        </div>
    );
}
