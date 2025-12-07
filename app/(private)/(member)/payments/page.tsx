"use client";
import React from "react";
import PaymentHistory from "@/components/member/component/payment.history";

export default function PaymentsPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f5f7fc", paddingBottom: 56 }}>
      <PaymentHistory />
    </main>
  );
}
