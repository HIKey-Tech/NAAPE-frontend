"use client";

import React, { useMemo, useState } from "react";
import { FaCalculator, FaCheckCircle, FaCreditCard, FaHeart, FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import { useContributionPayment } from "@/hooks/useContributions";

const PERCENTAGES = [2, 2.5, 3];

export default function MembershipSubscription() {
  const [salary, setSalary] = useState("");
  const [percentage, setPercentage] = useState(2);
  const { initializePayment, isPending } = useContributionPayment();
  const amount = useMemo(() => {
    const value = Number(salary.replace(/[^0-9.]/g, ""));
    return Number.isFinite(value) && value > 0 ? Math.round(value * percentage) / 100 : 0;
  }, [salary, percentage]);
  const formattedAmount = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 2 }).format(amount);

  const handlePayment = async () => {
    const numericSalary = Number(salary.replace(/[^0-9.]/g, ""));
    if (!numericSalary || numericSalary <= 0) {
      toast.error("Enter a valid monthly salary first.");
      return;
    }
    try {
      const result = await initializePayment({ salary: numericSalary, percentage });
      window.location.href = result.checkoutUrl;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Unable to start payment.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/70 to-white dark:from-[#0a0d14] dark:to-[#0f121b] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary ring-8 ring-primary/5"><FaHeart size={25} /></div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Member Contribution</h1>
          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-500 dark:text-slate-400">Calculate and make your voluntary monthly NAAPE contribution based on your salary.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <section className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-[#0a0d14] dark:shadow-none sm:p-9">
            <div className="mb-7 flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><FaCalculator /></div><div><h2 className="text-xl font-black text-slate-900 dark:text-white">Calculate your amount</h2><p className="text-sm text-slate-500 dark:text-slate-400">Salary × contribution percentage</p></div></div>
            <label className="mb-3 block text-xs font-black uppercase tracking-widest text-slate-400">Monthly salary</label>
            <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 dark:border-slate-700 dark:bg-slate-800/50"><span className="text-xl font-black text-primary">₦</span><input value={salary} onChange={e => setSalary(e.target.value)} inputMode="decimal" placeholder="Enter your monthly salary" className="w-full bg-transparent px-3 py-4 text-base font-bold text-slate-900 outline-none placeholder:text-slate-400 dark:text-white" /></div>
            <label className="mb-3 mt-7 block text-xs font-black uppercase tracking-widest text-slate-400">Contribution percentage</label>
            <div className="grid grid-cols-3 gap-3">{PERCENTAGES.map(option => <button key={option} type="button" onClick={() => setPercentage(option)} className={`rounded-2xl border py-4 text-base font-black transition-all ${percentage === option ? "border-primary bg-primary text-white shadow-lg shadow-primary/20" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-primary/40 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"}`}>{option}%</button>)}</div>
            <button type="button" onClick={handlePayment} disabled={isPending || amount <= 0} className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-4 text-base font-black text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none dark:disabled:bg-slate-800">{isPending ? <FaSpinner className="animate-spin" /> : <FaCreditCard />} {isPending ? "Opening secure payment..." : "Make contribution"}</button>
            <p className="mt-4 text-center text-[10px] font-black uppercase tracking-[.18em] text-slate-400">Securely processed by Flutterwave</p>
          </section>

          <aside className="rounded-[2rem] bg-primary p-7 text-white shadow-xl shadow-primary/20 sm:p-9">
            <p className="text-xs font-black uppercase tracking-[.18em] text-white/65">Estimated monthly amount</p>
            <p className="mt-4 break-words text-4xl font-black tracking-tight sm:text-5xl">{formattedAmount}</p>
            <div className="my-8 h-px bg-white/15" />
            <div className="space-y-4 text-sm leading-6 text-white/80"><p className="flex gap-3"><FaCheckCircle className="mt-1 shrink-0 text-white" /> Contributions are voluntary.</p><p className="flex gap-3"><FaCheckCircle className="mt-1 shrink-0 text-white" /> Every member keeps full access to the NAAPE platform.</p><p className="flex gap-3"><FaCheckCircle className="mt-1 shrink-0 text-white" /> This payment does not unlock Premium or digital content.</p></div>
            <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm font-semibold">{formattedAmount} = {percentage}% of your monthly salary</div>
          </aside>
        </div>
      </div>
    </div>
  );
}
