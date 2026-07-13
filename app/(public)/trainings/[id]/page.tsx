"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useSingleTraining } from "@/hooks/useTrainings";
import RegisterTrainingModal from "@/components/trainings/register-training-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Video, Users, Share2, Check, Clock } from "lucide-react";
import { toast } from "sonner";

function formatDate(date: string) {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}
function formatTime(date: string) {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: true });
}

export default function TrainingDetailPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const { data: training, isLoading, isError } = useSingleTraining(id);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title: training?.title, url });
                return;
            } catch {
                // user cancelled — fall through to clipboard
            }
        }
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Link copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (isError || !training) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center text-center px-4">
                <div>
                    <p className="text-xl font-bold text-slate-900 mb-2">Training not found</p>
                    <p className="text-slate-500">This training may have been removed or the link is invalid.</p>
                </div>
            </div>
        );
    }

    const price = training.isPaid
        ? `${training.currency === "NGN" ? "₦" : training.currency}${training.price.toLocaleString()}`
        : "Free";
    const closed = training.registrationClosed || training.isFull;

    return (
        <div className="min-h-screen bg-gray-50 w-full pt-28 pb-16 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                <div className="relative h-64 bg-slate-100">
                    {training.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={training.imageUrl} alt={training.title} className="object-cover w-full h-full" />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-slate-300">
                            {training.type === "online" ? <Video size={56} /> : <MapPin size={56} />}
                        </div>
                    )}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className={training.type === "online" ? "bg-blue-600" : "bg-emerald-600"}>
                            {training.type === "online" ? "Online" : "In-Person"}
                        </Badge>
                        <Badge className={training.isPaid ? "bg-amber-600" : "bg-slate-600"}>{price}</Badge>
                    </div>
                </div>

                <div className="p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{training.title}</h1>
                        <Button variant="outline" size="sm" onClick={handleShare} className="shrink-0">
                            {copied ? <Check size={16} /> : <Share2 size={16} />}
                            <span className="hidden sm:inline ml-1">{copied ? "Copied" : "Share"}</span>
                        </Button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 text-slate-700 mb-6">
                        <div className="flex items-center gap-2">
                            <Calendar size={18} className="text-primary" />
                            <span>{formatDate(training.date)} · {formatTime(training.date)}</span>
                        </div>
                        {training.type === "in-person" ? (
                            <div className="flex items-center gap-2">
                                <MapPin size={18} className="text-primary" />
                                <span>{training.address}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Video size={18} className="text-primary" />
                                <span>Meeting link sent after registration</span>
                            </div>
                        )}
                        {training.registrationDeadline && (
                            <div className="flex items-center gap-2">
                                <Clock size={18} className="text-primary" />
                                <span>Register by {formatDate(training.registrationDeadline)}</span>
                            </div>
                        )}
                        {training.maxCapacity ? (
                            <div className="flex items-center gap-2">
                                <Users size={18} className="text-primary" />
                                <span>
                                    {training.isFull
                                        ? <span className="text-red-600 font-semibold">Fully booked</span>
                                        : `${training.spotsRemaining} of ${training.maxCapacity} spots remaining`}
                                </span>
                            </div>
                        ) : null}
                    </div>

                    {training.description && (
                        <p className="text-slate-600 leading-relaxed mb-8 whitespace-pre-line">{training.description}</p>
                    )}

                    <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <p className="text-sm text-slate-500">
                                {training.registeredCount
                                    ? `${training.registeredCount} registered`
                                    : "Be the first to register"}
                            </p>
                            <p className="text-2xl font-bold text-slate-900">{price}</p>
                            {training.memberPrice != null && training.isPaid && (
                                <p className="text-xs text-slate-500">
                                    Member rate: {training.currency === "NGN" ? "₦" : training.currency}
                                    {training.memberPrice.toLocaleString()}
                                </p>
                            )}
                        </div>
                        {closed ? (
                            <div className="text-red-700 bg-red-50 border border-red-200 rounded-md py-2.5 px-5 font-medium">
                                {training.isFull ? "Training is full" : "Registration closed"}
                            </div>
                        ) : (
                            <Button size="lg" className="px-8" onClick={() => setIsModalOpen(true)}>
                                {training.isPaid ? `Register (${price})` : "Register for free"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <RegisterTrainingModal
                training={training}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
