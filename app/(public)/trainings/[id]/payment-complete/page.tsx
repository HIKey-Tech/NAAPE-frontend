"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { verifyTrainingPayment } from "@/app/api/trainings/trainings";

function PaymentCompleteInner() {
    const params = useParams();
    const searchParams = useSearchParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const transactionId = searchParams.get("transaction_id");
    const flwStatus = searchParams.get("status");

    const [state, setState] = useState<{ status: "loading" | "success" | "failed"; message?: string }>({
        status: "loading"
    });

    useEffect(() => {
        if (!transactionId || flwStatus === "cancelled") {
            setState({ status: "failed", message: "Payment was cancelled or no transaction reference was found." });
            return;
        }
        verifyTrainingPayment(transactionId)
            .then((res) => {
                if (res.status === "successful") {
                    setState({ status: "success", message: "A confirmation email with your training details has been sent to you." });
                } else {
                    setState({ status: "failed", message: res.message || "Payment verification failed." });
                }
            })
            .catch((err) => {
                setState({
                    status: "failed",
                    message: err?.response?.data?.message || "Payment verification failed. Please contact support if you were charged."
                });
            });
    }, [transactionId, flwStatus]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 max-w-md w-full p-10 text-center">
                {state.status === "loading" && (
                    <>
                        <Loader2 className="animate-spin text-primary mx-auto mb-5" size={56} />
                        <h1 className="text-xl font-bold text-slate-900 mb-2">Verifying your payment...</h1>
                        <p className="text-slate-500">This should only take a moment.</p>
                    </>
                )}
                {state.status === "success" && (
                    <>
                        <CheckCircle2 className="text-green-600 mx-auto mb-5" size={64} />
                        <h1 className="text-xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
                        <p className="text-slate-500 mb-6">{state.message}</p>
                        <Link href={`/trainings/${id}`} className="text-primary font-semibold hover:underline">
                            Back to training
                        </Link>
                    </>
                )}
                {state.status === "failed" && (
                    <>
                        <XCircle className="text-red-600 mx-auto mb-5" size={64} />
                        <h1 className="text-xl font-bold text-slate-900 mb-2">Payment Failed</h1>
                        <p className="text-slate-500 mb-4">{state.message}</p>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-600 mb-6 text-left">
                            <p className="font-semibold text-slate-800 mb-1">Refund enquiries</p>
                            <p>
                                WhatsApp:{" "}
                                <a href="https://wa.me/2349132508804" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    +234 913 250 8804
                                </a>
                            </p>
                            <p>
                                Email:{" "}
                                <a href="mailto:support@naape.ng" className="text-primary hover:underline">
                                    support@naape.ng
                                </a>
                            </p>
                        </div>
                        <Link href={`/trainings/${id}`} className="text-primary font-semibold hover:underline">
                            Try again
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default function TrainingPaymentCompletePage() {
    return (
        <Suspense fallback={null}>
            <PaymentCompleteInner />
        </Suspense>
    );
}
