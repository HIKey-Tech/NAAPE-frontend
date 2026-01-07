"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SubscriptionCallback() {
  const router = useRouter();

  useEffect(() => {
    // Flutterwave returns ?status=successful|failed&tx_ref=...
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const txRef = params.get("tx_ref");

    if (status === "successful") {
      alert("Payment successful!");
      // Optional: call backend to verify transaction and activate subscription
    } else {
      alert("Payment failed or cancelled.");
    }

    router.replace("/dashboard"); // redirect user somewhere meaningful
  }, [router]);

  return <p>Processing payment…</p>;
}
