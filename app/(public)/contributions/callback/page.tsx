"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function ContributionCallbackPage() {
  const [message, setMessage] = useState("Confirming your contribution...");
  useEffect(() => {
    const transactionId = new URLSearchParams(window.location.search).get("transaction_id");
    if (!transactionId) { setMessage("No payment reference was supplied."); return; }
    api.get(`/payments/contributions/verify?transaction_id=${encodeURIComponent(transactionId)}`)
      .then(() => setMessage("Your contribution was recorded successfully."))
      .catch(() => setMessage("We could not confirm this payment yet. Please check your payment history shortly."));
  }, []);
  return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6"><div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-xl"><h1 className="text-2xl font-black text-slate-900">Member Contribution</h1><p className="mt-4 text-slate-500">{message}</p></div></main>;
}
