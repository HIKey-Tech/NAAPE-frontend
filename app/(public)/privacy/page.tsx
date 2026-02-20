import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#f7fafc] to-[#e4ecfa] py-8 pt-32 md:pt-40 px-4 flex flex-col items-center">
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
          Privacy Policy
        </h1>
        <p className="text-lg text-[#4b5563] mb-7">
          <span className="font-medium text-[#2852b4]">Last updated: May 2024</span>
        </p>
        <p className="text-[#44485d] mb-8 text-base md:text-lg">
          The National Association of Aircraft Pilots & Engineers (NAAPE) is committed to protecting the privacy and security of our members and website visitors. This Privacy Policy details the types of information we collect, how we use it, and the steps we take to protect your personal data.
        </p>

        <section className="mb-7">
          <h2 className="font-semibold text-2xl mb-2 text-[#2852B4]">1. Information We Collect</h2>
          <ul className="list-disc pl-6 text-[#374151] space-y-1">
            <li><strong>Personal Details:</strong> Name, professional title, email address, phone number.</li>
            <li><strong>Membership Data:</strong> Certification status, payment history, and event registrations.</li>
            <li><strong>Usage Data:</strong> Information about how you navigate and interact with our platform.</li>
          </ul>
        </section>

        <section className="mb-7">
          <h2 className="font-semibold text-2xl mb-2 text-[#2852B4]">2. How We Use Your Information</h2>
          <p className="text-[#374151]">
            We process your information to manage memberships, facilitate event registrations, provide industry news and updates, and ensure compliance with aviation and association guidelines.
          </p>
        </section>

        <section className="mb-7">
          <h2 className="font-semibold text-2xl mb-2 text-[#2852B4]">3. Data Sharing</h2>
          <p className="text-[#374151]">
            NAAPE does not sell or rent your personal data to third parties. We may share necessary information with trusted partners and service providers explicitly to facilitate association activities and events.
          </p>
        </section>

        <section className="mb-7">
          <h2 className="font-semibold text-2xl mb-2 text-[#2852B4]">4. Contact Us</h2>
          <p className="text-[#374151]">
            If you have questions about this policy or the handling of your data, please contact us at <a href="mailto:privacy@naape.ng" className="underline text-[#2852B4]">privacy@naape.ng</a>.
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
            href="/terms"
            className="text-[#2852B4] underline font-medium text-sm hover:text-[#162e63] transition"
          >
            View Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
