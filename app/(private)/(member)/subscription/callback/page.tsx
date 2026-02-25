"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function SubscriptionCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<"processing" | "success" | "failed">("processing");
  const [message, setMessage] = useState("Processing your payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Flutterwave returns ?status=successful|failed&tx_ref=...&transaction_id=...
        const params = new URLSearchParams(window.location.search);
        const paymentStatus = params.get("status");
        const transactionId = params.get("transaction_id");

        if (paymentStatus !== "successful" || !transactionId) {
          setStatus("failed");
          setMessage("Payment was not successful. Please try again.");
          setTimeout(() => router.replace("/subscription"), 3000);
          return;
        }

        // Verify payment with backend
        const response = await api.get(`/payments/subscription/verify?transaction_id=${transactionId}`);

        if (response.data.status === "successful") {
          setStatus("success");
          setMessage(
            response.data.alreadyProcessed
              ? "Payment already processed. Redirecting..."
              : "Payment successful! Your subscription is now active. Redirecting..."
          );

          // Check for stored redirect URL
          let redirectUrl = localStorage.getItem("postSubscriptionRedirect");
          if (redirectUrl) {
            localStorage.removeItem("postSubscriptionRedirect");

            // Validate that the redirect path is a safe internal route
            if (!redirectUrl.startsWith("/") || redirectUrl.startsWith("//") || redirectUrl.startsWith("\\")) {
              redirectUrl = "/dashboard";
            }

            setTimeout(() => router.replace(redirectUrl as string), 2000);
          } else {
            setTimeout(() => router.replace("/dashboard"), 2000);
          }
        } else {
          setStatus("failed");
          setMessage("Payment verification failed. Please contact support.");
          setTimeout(() => router.replace("/subscription"), 3000);
        }
      } catch (error: any) {
        console.error("Payment verification error:", error);
        setStatus("failed");
        setMessage(
          error.response?.data?.message ||
          "An error occurred while verifying your payment. Please contact support."
        );
        setTimeout(() => router.replace("/subscription"), 3000);
      }
    };

    verifyPayment();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950">
      <div className="bg-white dark:bg-card p-8 rounded-lg shadow-xl max-w-md w-full mx-4 border border-transparent dark:border-border">
        <div className="text-center">
          {status === "processing" && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-primary mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-2">Processing Payment</h2>
              <p className="text-gray-600 dark:text-slate-400">{message}</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="bg-green-100 dark:bg-green-900/20 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 dark:text-slate-400">{message}</p>
            </>
          )}

          {status === "failed" && (
            <>
              <div className="bg-red-100 dark:bg-red-900/20 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Payment Failed</h2>
              <p className="text-gray-600 dark:text-slate-400">{message}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
