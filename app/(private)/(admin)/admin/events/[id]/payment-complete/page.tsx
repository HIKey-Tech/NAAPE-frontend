"use client";

import { useParams, useSearchParams } from "next/navigation";
import PaymentComplete from "@/components/member/events/payment/complete.payment";
import { useEffect, useState } from "react";
import { getSingleEvent } from "@/app/api/events/events";

export default function AdminEventPaymentCompletePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const { id } = params as { id?: string };
    const [eventName, setEventName] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (searchParams.get("eventName")) {
            setEventName(searchParams.get("eventName") || undefined);
        } else if (id) {
            // Fetch event title (name)
            getSingleEvent(id)
                .then((event) => {
                    setEventName(event?.title || undefined);
                })
                .catch(() => setEventName(undefined));
        }
    }, [id, searchParams]);

    return <PaymentComplete eventName={eventName} />;
}
