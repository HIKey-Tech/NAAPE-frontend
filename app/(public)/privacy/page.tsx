import React from "react";
import SubHeroSection from "@/components/ui/custom/sub.hero.section";

export default function PrivacyPolicyPage() {
  return (
    <main className="w-full min-h-screen bg-slate-50">
      <SubHeroSection
        heading="Privacy Policy"
        subheading="Learn how NAAPE collects, uses, and protects your personal information."
        imageSrc="/images/plane.jpg"
        imageAlt="Privacy Policy Header"
        containerClassName="w-full bg-white flex flex-col md:flex-row items-center justify-center pt-32 md:pt-40 pb-10 px-4 md:px-6 border-b border-slate-100"
      />
      <section className="max-w-4xl mx-auto px-6 py-16 text-slate-700 leading-relaxed font-medium">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
        <p className="mb-8">
          The National Association of Aircraft Pilots & Engineers (NAAPE) is committed to protecting the privacy and security of our members and website visitors. This Privacy Policy details the types of information we collect, how we use it, and the steps we take to protect your personal data.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
        <ul className="list-disc pl-6 mb-8 space-y-2">
          <li><strong>Personal Details:</strong> Name, professional title, email address, phone number.</li>
          <li><strong>Membership Data:</strong> Certification status, payment history, and event registrations.</li>
          <li><strong>Usage Data:</strong> Information about how you navigate and interact with our platform.</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
        <p className="mb-8">
          We process your information to manage memberships, facilitate event registrations, provide industry news and updates, and ensure compliance with aviation and association guidelines.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Sharing</h2>
        <p className="mb-8">
          NAAPE does not sell or rent your personal data to third parties. We may share necessary information with trusted partners and service providers explicitly to facilitate association activities and events.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Contact Us</h2>
        <p>
          If you have questions about this policy or the handling of your data, please contact us at privacy@naape.ng.
        </p>
      </section>
    </main>
  );
}
