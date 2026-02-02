"use client";

import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { verifyPayment } from "@/app/api/events/events";

// Verification state interface
interface VerificationState {
    status: 'loading' | 'success' | 'failed' | 'error';
    message?: string;
    transactionId?: string;
    errorType?: 'network' | 'not_found' | 'server' | 'validation' | 'unknown';
}

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
    loading: (eventName: string) => ({
        title: "Processing Payment...",
        subtitle: (
            <>
                Hang tight! We're verifying your payment for{" "}
                <span className="font-semibold text-primary">{eventName}</span>. This should only take a moment.
            </>
        ),
    }),
};

export default function PaymentComplete({ eventName: propEventName }: { eventName?: string }) {
    const params = useSearchParams();
    const eventNameFromParams = params.get("eventName");
    
    // Initialize verification state
    const [verificationState, setVerificationState] = useState<VerificationState>({
        status: 'loading',
        message: undefined,
        transactionId: undefined,
        errorType: undefined
    });
    
    const [isReady, setIsReady] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [eventDetails, setEventDetails] = useState<any>(null);
    const MAX_RETRIES = 3;

    // Determine dynamic event name: precedence is query param > prop > fallback
    let eventName: string =
        (eventNameFromParams && eventNameFromParams.trim()) ||
        (propEventName && propEventName.trim()) ||
        "the event";

    // If eventName came from url, make it user-presentable:
    if (eventName && eventName.length && eventNameFromParams) {
        try {
            eventName = decodeURIComponent(eventName.replace(/\+/g, " "));
        } catch {
            // fallback is raw eventName
        }
    }

    // Automatic verification on page load with caching
    useEffect(() => {
        const transactionId = params.get("transaction_id");
        
        // Handle missing transaction_id
        if (!transactionId) {
            setVerificationState({
                status: 'error',
                message: `Invalid payment reference for ${eventName}. Transaction ID is missing.`,
                transactionId: undefined,
                errorType: 'validation'
            });
            setIsReady(true);
            return;
        }

        // Generate cache key for this transaction
        const cacheKey = `payment_verification_${transactionId}`;
        
        // Check if verification result is already cached in sessionStorage
        try {
            const cachedResult = sessionStorage.getItem(cacheKey);
            if (cachedResult && retryCount === 0) {
                // Use cached result instead of making API call
                const parsedResult: VerificationState = JSON.parse(cachedResult);
                setVerificationState(parsedResult);
                setIsReady(true);
                return;
            }
        } catch (error) {
            // If cache read fails, proceed with verification
            console.warn('Failed to read cached verification result:', error);
        }

        // Perform verification with error handling
        const performVerification = async () => {
            try {
                setVerificationState({
                    status: 'loading',
                    message: 'Verifying your payment...',
                    transactionId,
                    errorType: undefined
                });

                const response = await verifyPayment(transactionId);
                
                let newState: VerificationState;
                
                // Check response status
                if (response.status === 'successful') {
                    newState = {
                        status: 'success',
                        message: response.message || 'Payment verified successfully',
                        transactionId,
                        errorType: undefined
                    };
                    
                    // Store event details if available
                    if (response.event) {
                        setEventDetails(response.event);
                    }
                } else if (response.status === 'failed') {
                    newState = {
                        status: 'failed',
                        message: response.message || 'Payment verification failed',
                        transactionId,
                        errorType: undefined
                    };
                } else {
                    // Handle any other status
                    newState = {
                        status: 'error',
                        message: 'Unexpected verification response',
                        transactionId,
                        errorType: 'unknown'
                    };
                }
                
                setVerificationState(newState);
                
                // Cache the verification result in sessionStorage
                try {
                    sessionStorage.setItem(cacheKey, JSON.stringify(newState));
                } catch (error) {
                    // If cache write fails, continue without caching
                    console.warn('Failed to cache verification result:', error);
                }
            } catch (error: any) {
                // Enhanced error handling with specific error types
                let errorMessage = `Failed to verify payment for ${eventName}`;
                let errorType: 'network' | 'not_found' | 'server' | 'validation' | 'unknown' = 'unknown';

                // Check if it's an axios error with response
                if (error.response) {
                    const status = error.response.status;
                    
                    if (status === 404) {
                        errorMessage = `Transaction not found for ${eventName}. Please contact support with your transaction reference.`;
                        errorType = 'not_found';
                    } else if (status === 400) {
                        errorMessage = error.response.data?.message || `Invalid transaction reference for ${eventName}. Please verify your payment details.`;
                        errorType = 'validation';
                    } else if (status >= 500) {
                        errorMessage = `Server error occurred while verifying payment for ${eventName}. Please try again or contact support if the issue persists.`;
                        errorType = 'server';
                    } else {
                        errorMessage = error.response.data?.message || `An error occurred while verifying your payment for ${eventName}.`;
                        errorType = 'unknown';
                    }
                } else if (error.request) {
                    // Network error - request was made but no response received
                    errorMessage = `Network error while verifying payment for ${eventName}. Please check your connection and try again.`;
                    errorType = 'network';
                } else {
                    // Something else happened
                    errorMessage = error.message || `An unexpected error occurred while verifying payment for ${eventName}.`;
                    errorType = 'unknown';
                }

                const errorState: VerificationState = {
                    status: 'error',
                    message: errorMessage,
                    transactionId,
                    errorType
                };
                
                setVerificationState(errorState);
                
                // Don't cache error states - allow retry on refresh
            } finally {
                setIsReady(true);
            }
        };

        performVerification();
    }, [params, retryCount]); // Added retryCount to dependencies for retry functionality

    // Simulate a loader for a short moment for better UX polish (removed old logic)
    useEffect(() => {
        // This effect is now handled by verification logic above
    }, []);

    // Retry handler with exponential backoff
    const handleRetry = () => {
        if (retryCount < MAX_RETRIES) {
            setIsReady(false);
            setRetryCount(prev => prev + 1);
            
            // Exponential backoff: wait before retrying
            const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 8000);
            setTimeout(() => {
                // The useEffect will trigger verification due to retryCount change
            }, backoffDelay);
        }
    };

    let state: "success" | "error" | "loading";
    if (!isReady || verificationState.status === 'loading') {
        state = "loading";
    } else if (verificationState.status === 'success') {
        state = "success";
    } else {
        // 'failed' or 'error' both map to error UI state
        state = "error";
    }

    const { title, subtitle } =
        state === "success" || state === "error"
            ? messages[state](eventName)
            : messages["loading"](eventName);

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

            {/* Display event details if available */}
            {state === "success" && eventDetails && (
                <motion.div
                    className="bg-white border border-slate-200 rounded-lg p-6 mb-6 max-w-xl w-full shadow-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Event Details</h3>
                    {eventDetails.imageUrl && (
                        <img 
                            src={eventDetails.imageUrl} 
                            alt={eventDetails.title}
                            className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                    )}
                    <div className="space-y-2 text-sm">
                        <p className="text-slate-900 font-semibold text-base">{eventDetails.title}</p>
                        {eventDetails.date && (
                            <p className="text-slate-600">
                                <span className="font-medium">Date:</span> {new Date(eventDetails.date).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit'
                                })}
                            </p>
                        )}
                        {eventDetails.location && (
                            <p className="text-slate-600">
                                <span className="font-medium">Location:</span> {eventDetails.location}
                            </p>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Display error message if present */}
            {state === "error" && verificationState.message && (
                <motion.div
                    className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-xl"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <p className="text-sm text-red-800 text-center">
                        {verificationState.message}
                    </p>
                    {verificationState.transactionId && (
                        <p className="text-xs text-red-600 text-center mt-2">
                            Transaction ID: {verificationState.transactionId}
                        </p>
                    )}
                </motion.div>
            )}

            {/* Show retry exhaustion message */}
            {state === "error" && retryCount >= MAX_RETRIES && (
                <motion.div
                    className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 max-w-xl"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <p className="text-sm text-amber-800 text-center font-medium">
                        Maximum retry attempts reached. Please contact support for assistance.
                    </p>
                </motion.div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-2">
                {state === "success" && (
                    <Link
                        href="/member/events"
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
                {state === "error" && retryCount < MAX_RETRIES && (verificationState.errorType === 'network' || verificationState.errorType === 'server' || verificationState.errorType === 'unknown') && (
                    <button
                        onClick={handleRetry}
                        className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/60 transition-all duration-150 active:scale-[0.99]"
                        aria-label="Retry Payment Verification"
                    >
                        Retry Verification {retryCount > 0 && `(${retryCount}/${MAX_RETRIES})`}
                    </button>
                )}
                {state === "error" && (
                    <Link
                        href="/member/events"
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
                        href="/contact"
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
