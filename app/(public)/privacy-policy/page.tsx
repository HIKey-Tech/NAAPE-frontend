"use client";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function PrivacyPolicyPage() {
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
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#1c263b] tracking-tight drop-shadow-md">
          Privacy Policy
        </h1>
        <p className="text-base md:text-lg text-[#6380b6] mb-8">
          Last updated:&nbsp;
          <span className="font-semibold text-[#2852B4]">May 2024</span>
        </p>
        <section className="mb-7">
          <h2 className="font-semibold text-xl mb-2 text-[#2852B4]">Introduction</h2>
          <p className="text-[#4B4B55]">
            The National Association of Aircraft Pilots and Engineers ("NAAPE", "we", "us") is committed to safeguarding your privacy. This Privacy Policy explains how we collect, use, disclose, and secure your personal information when you interact with our website and services. We operate in accordance with national and international data protection standards.
          </p>
        </section>
        <section className="mb-7">
          <h2 className="font-semibold text-xl mb-2 text-[#2852B4]">Information We Collect</h2>
          <ul className="list-disc ml-6 text-[#4B4B55] space-y-2">
            <li>
              <span className="font-semibold">Personal Details:</span> Name, email address, phone number, professional qualifications.
            </li>
            <li>
              <span className="font-semibold">Membership Information:</span> Credentials, certifications, membership status, payment details.
            </li>
            <li>
              <span className="font-semibold">Usage Data:</span> Pages visited, interactions, IP address, browser and device information.
            </li>
            <li>
              <span className="font-semibold">Cookies & Analytics:</span> To enhance user experience and measure website performance.
            </li>
          </ul>
        </section>
        <section className="mb-7">
          <h2 className="font-semibold text-xl mb-2 text-[#2852B4]">How We Use Your Information</h2>
          <ul className="list-disc ml-6 text-[#4B4B55] space-y-2">
            <li>Processing membership applications and account management</li>
            <li>Sending essential updates, newsletters, event information, and regulatory announcements</li>
            <li>Responding to your inquiries and providing support</li>
            <li>Improving our website, services, and overall member experience</li>
            <li>Complying with legal, regulatory, and organizational requirements</li>
          </ul>
        </section>
        <section className="mb-7">
          <h2 className="font-semibold text-xl mb-2 text-[#2852B4]">How We Protect Your Data</h2>
          <p className="text-[#4B4B55]">
            We maintain strong organizational and technical safeguards to protect your information from unauthorized access, loss, or misuse. These measures include secure servers, encryption, access controls, and routine security assessments.
          </p>
        </section>
        <section className="mb-7">
          <h2 className="font-semibold text-xl mb-2 text-[#2852B4]">Your Rights</h2>
          <ul className="list-disc ml-6 text-[#4B4B55] space-y-2">
            <li>You have the right to access and correct your personal information at any time.</li>
            <li>You may request deletion of your personal data, subject to applicable law.</li>
            <li>You may opt out of communications and data processing for marketing purposes.</li>
          </ul>
        </section>
        <section className="mb-7">
          <h2 className="font-semibold text-xl mb-2 text-[#2852B4]">Third-Party Services</h2>
          <p className="text-[#4B4B55]">
            We partner with trusted third parties (for example, payment processors and analytics tools) who are contractually obligated to maintain strict confidentiality and data protection standards. We do not sell your personal data.
          </p>
        </section>
        <section className="mb-7">
          <h2 className="font-semibold text-xl mb-2 text-[#2852B4]">Policy Updates</h2>
          <p className="text-[#4B4B55]">
            We may periodically review and revise this Privacy Policy to reflect changes to our practices or for compliance reasons. Please check back regularly to stay informed.
          </p>
        </section>
        <section className="mb-7">
          <h2 className="font-semibold text-xl mb-2 text-[#2852B4]">Contact Us</h2>
          <p className="text-[#4B4B55]">
            If you have questions, concerns, or requests regarding your privacy or this policy, please contact our Data Protection Officer:&nbsp;
            <a
              className="text-[#21409a] underline hover:text-[#283e72] transition"
              href="mailto:info@naape.org"
            >
              info@naape.org
            </a>
            .
          </p>
        </section>
        <footer className="text-xs text-[#8ea0c0] mt-10">
          &copy; {new Date().getFullYear()} NAAPE. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
