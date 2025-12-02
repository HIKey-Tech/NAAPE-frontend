"use client";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function TermsOfServicePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#f7fafc] to-[#e4ecfa] py-8 px-4 flex flex-col items-center">
      {/* Decorative blurred shapes */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 w-64 h-64 bg-[#dde6f655] rounded-full blur-3xl opacity-60 -translate-x-1/2 -translate-y-1/2"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 w-72 h-72 bg-[#90abf933] rounded-full blur-2xl opacity-40 translate-x-1/3 translate-y-1/3"
      />
      <div className="w-full max-w-3xl bg-white/95 rounded-2xl shadow-2xl p-7 md:p-10 z-10 relative backdrop-blur-md">
        <div className="mb-8 flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#21409a] hover:text-[#183b6e] transition-colors font-medium text-sm"
          >
            <FaArrowLeft />
            <span>Back to Home</span>
          </Link>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1c263b] mb-3 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-lg text-[#4b5563] mb-7">
          <span className="font-medium text-[#2852b4]">Last updated: May 2024</span>
        </p>
        <p className="text-[#44485d] mb-8 text-base md:text-lg">
          Welcome to NAAPE! These Terms of Service (&quot;Terms&quot;) govern your use of the NAAPE application, website, and related services (collectively, the &quot;Service&quot;) provided by the National Association of Aircraft Pilots and Engineers. By accessing or using our Service, you agree to these Terms. Please read them carefully.
        </p>
        <section className="mb-7">
          <h2 className="font-semibold text-2xl mb-2 text-[#2852B4]">1. Acceptance of Terms</h2>
          <p className="text-[#374151]">
            By accessing or using the Service, you agree to be bound by these Terms and all applicable laws and regulations. If you do not agree with any part of these Terms, you may not use our Service.
          </p>
        </section>
        <section className="mb-7">
          <h2 className="font-semibold text-2xl mb-2 text-[#2852B4]">2. Eligibility</h2>
          <p className="text-[#374151]">
            You must be at least 18 years old and legally competent to enter into this agreement. By using NAAPE, you represent and warrant that you meet all eligibility requirements.
          </p>
        </section>
        <section className="mb-7">
          <h2 className="font-semibold text-2xl mb-2 text-[#2852B4]">3. Membership &amp; Account Registration</h2>
          <ul className="list-disc pl-6 text-[#374151] space-y-1">
            <li>
              Certain features require you to register for a NAAPE account.
            </li>
            <li>
              You agree to provide true, accurate, and complete registration information and keep it up to date.
            </li>
            <li>
              You are solely responsible for any activity under your account. Please maintain the confidentiality of your password.
            </li>
          </ul>
        </section>
        <section className="mb-7">
          <h2 className="font-semibold text-2xl mb-2 text-[#2852B4]">4. Acceptable Use</h2>
          <ul className="list-disc pl-6 text-[#374151] space-y-1">
            <li>Do not use the Service for any unlawful, abusive, harmful, or fraudulent purpose.</li>
            <li>Do not attempt to probe, scan, or test the vulnerability of the Service or its related systems.</li>
            <li>Do not interfere with or disrupt the operation of the Service or others’ enjoyment of it.</li>
            <li>Respect the NAAPE community and all its members at all times.</li>
          </ul>
        </section>
        <section className="mb-7">
          <h2 className="font-semibold text-2xl mb-2 text-[#2852B4]">5. Intellectual Property</h2>
          <p className="text-[#374151]">
            All Service content, including but not limited to text, graphics, logos, software, and visual design, is the exclusive property of NAAPE or its licensors. You may not reproduce, publish, modify, or create derivative works without prior written consent.
          </p>
        </section>
        <section className="mb-7">
          <h2 className="font-semibold text-2xl mb-2 text-[#2852B4]">6. Termination &amp; Suspension</h2>
          <p className="text-[#374151]">
            NAAPE reserves the right to suspend or terminate your access to the Service, with or without notice, if you violate these Terms or behave in a manner deemed harmful, abusive, or disruptive to the Service or its users.
          </p>
        </section>
        <section className="mb-7">
          <h2 className="font-semibold text-2xl mb-2 text-[#2852B4]">7. Limitation of Liability</h2>
          <p className="text-[#374151]">
            The Service is provided &quot;as is&quot; without warranties of any kind. NAAPE will not be liable for any indirect, incidental, special, or consequential damages, or loss of data, arising out of your use of the Service.
          </p>
        </section>
        <section className="mb-7">
          <h2 className="font-semibold text-2xl mb-2 text-[#2852B4]">8. Changes to Terms</h2>
          <p className="text-[#374151]">
            We may revise these Terms periodically. If there are material changes, we will post an updated version here with a new effective date. By continuing to use the Service, you agree to any new or modified Terms.
          </p>
        </section>
        <section className="mb-7">
          <h2 className="font-semibold text-2xl mb-2 text-[#2852B4]">9. Contact</h2>
          <p className="text-[#374151]">
            If you have questions or concerns regarding these Terms, please contact us at <a href="mailto:support@naape.org.ng" className="underline text-[#2852B4]">support@naape.org.ng</a>.
          </p>
        </section>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white bg-[#2852B4] px-6 py-3 rounded-lg shadow-md font-semibold hover:bg-[#183b6e] hover:scale-[1.03] transition"
          >
            <FaArrowLeft className="text-lg" />
            Return to Home
          </Link>
          <Link
            href="/privacy-policy"
            className="text-[#2852B4] underline font-medium text-sm hover:text-[#162e63] transition"
          >
            View Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
