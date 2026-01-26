"use client";

import { verifyEventPayment } from "@/app/api/events/events";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type State = "loading" | "success" | "failed" | "pending";

export default function PaymentComplete() {
    const params = useSearchParams();
    const transactionId = params.get("transaction_id");

    const [state, setState] = useState<State>("loading");

    useEffect(() => {
        if (!transactionId) {
            setState("failed");
            return;
        }

        verifyEventPayment(transactionId)
            .then((res) => {
                if (res.status === "success") setState("success");
                else if (res.status === "pending") setState("pending");
                else setState("failed");
            })
            .catch(() => setState("failed"));
    }, [transactionId]);

    const icons = {
        loading: <Loader2 className="animate-spin text-blue-500" size={56} />,
        success: <CheckCircle2 className="text-green-600" size={72} />,
        failed: <XCircle className="text-red-600" size={72} />,
        pending: <Loader2 className="animate-spin text-yellow-500" size={56} />,
    };

    const messages = {
        loading: "Verifying your payment…",
        success: "Payment successful! You’re registered 🎉",
        failed: "Payment failed or was cancelled.",
        pending: "Payment is still processing. Please refresh shortly.",
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            {icons[state]}
            <h2 className="text-2xl font-bold mt-5">{messages[state]}</h2>

            {state === "failed" && (
                <a
                    href="/dashboard/events"
                    className="mt-6 px-6 py-2 bg-primary text-white rounded-lg"
                >
                    Try Again
                </a>
            )}
        </div>
    );
}
