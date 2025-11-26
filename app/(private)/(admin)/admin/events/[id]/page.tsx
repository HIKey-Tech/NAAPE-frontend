"use client";
import { useRegisterEvent, useSingleEvent } from "@/hooks/useEvents";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaImage } from "react-icons/fa";

export default function EventDetailsPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const { data: event, isLoading, isError } = useSingleEvent(id);
    const registerMutation = useRegisterEvent();
    const [showImageError, setShowImageError] = useState(false);

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    if (isError || !event) return (
        <div className="flex justify-center items-center min-h-[300px] text-red-600">
            Unable to load event.
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto px-6 py-10 bg-white rounded-2xl shadow-md">
            <div className="relative">
                {event.imageUrl && !showImageError ? (
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-56 object-cover rounded-xl mb-6 shadow transition-all"
                        onError={() => setShowImageError(true)}
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-56 bg-gray-50 rounded-xl mb-6 text-gray-300 text-6xl">
                        <FaImage />
                    </div>
                )}
                {/* Optionally, you can place an 'Edit' button or badge for admin panel use here */}
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{event.title}</h1>

            <div className="flex flex-col sm:flex-row sm:space-x-6 text-base mb-2">
                <div className="flex items-center text-blue-700 mt-1">
                    <FaCalendarAlt className="mr-2" />
                    <span className="font-medium">
                        {event.date &&
                            (() => {
                                // Try formatting date nicely
                                const maybeDate = new Date(event.date);
                                return isNaN(maybeDate as any)
                                    ? event.date
                                    : maybeDate.toLocaleDateString(undefined, {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    });
                            })()
                        }
                    </span>
                </div>
                <div className="flex items-center text-gray-700 mt-1">
                    <FaMapMarkerAlt className="mr-2" />
                    <span className="font-medium">
                        {event.location}
                    </span>
                </div>
            </div>

            {event.description && (
                <>
                    <div className="border-t border-gray-200 my-6"></div>
                    <div className="prose max-w-none text-gray-800 text-base leading-relaxed">
                        {event.description}
                    </div>
                </>
            )}

            <div className="mt-8 flex flex-col items-stretch gap-3">
                {registerMutation.isSuccess && (
                    <span className="text-green-700 bg-green-50 border border-green-200 rounded py-2 px-4 text-center font-medium shadow-sm transition-all">
                        Registered successfully!
                    </span>
                )}
                {registerMutation.isError && (
                    <span className="text-[#D14343] bg-[#f6dad9] border border-[#ffc5c2] rounded py-2 px-4 text-center font-medium shadow transition-all">
                        {registerMutation.error instanceof Error
                            ? registerMutation.error.message
                            : "Failed to register for this event."}
                    </span>
                )}
                <button
                    onClick={() => {
                        if (typeof id === "string" && !registerMutation.isPending) {
                            registerMutation.mutate({ id });
                        }
                    }}
                    disabled={registerMutation.isPending}
                    className={`mt-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-2.5 rounded-lg shadow font-semibold text-[15px] transition-all focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                    {registerMutation.isPending ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full" />
                            Registering...
                        </span>
                    ) : (
                        "Register for Event"
                    )}
                </button>
            </div>
        </div>
    );
}
