"use client";

import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { verifyPayment } from "@/app/api/events/events";

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

        verifyPayment(transactionId)
            .then((res) => {
                setState(res.status);
            })
            .catch(() => setState("pending"));
    }, [transactionId]);

    const icons = {
        loading: <Loader2 className="animate-spin text-blue-500" size={60} />,
        pending: <Loader2 className="animate-spin text-yellow-500" size={60} />,
        success: <CheckCircle2 className="text-green-600" size={74} />,
        failed: <XCircle className="text-red-600" size={74} />,
    };

    const messages = {
        loading: "Verifying your payment...",
        pending: "Payment is being confirmed. Please wait...",
        success: "Payment successful! You're registered 🎉",
        failed: "Payment failed or was cancelled.",
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            {icons[state]}
            <h2 className="text-2xl font-bold mt-4">{messages[state]}</h2>
        </div>
    );
}
