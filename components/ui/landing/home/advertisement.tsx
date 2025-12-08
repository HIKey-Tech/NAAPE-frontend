import React, { useState } from "react";

const CONTACT_EMAIL = "info@naape.org.ng";

// "Primary only" rewrite: Use only primary color (here #ff004e) for UI, headings, text, and links.
const PRIMARY = "#ff004e";

export default function AdvertisementSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function createMailtoLink() {
    const subject = encodeURIComponent("Advertising/Partnership Inquiry via Website");
    const body = encodeURIComponent(
      `Name: ${form.name}\nOrganization: ${form.organization}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );
    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    window.location.href = createMailtoLink();
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 500);
  }

  return (
    <section
      style={{
        maxWidth: 640,
        margin: "48px auto",
        padding: "32px 28px",
        background: "#fff",
        borderRadius: 18,
        border: `2px solid ${PRIMARY}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2
        style={{
          fontSize: 32,
          fontWeight: 800,
          letterSpacing: 0.18,
          color: PRIMARY,
          margin: 0,
          marginBottom: 8,
        }}
      >
        Advertise With NAAP Plan
      </h2>
      <div
        style={{
          fontSize: 16.7,
          color: PRIMARY,
          fontWeight: 600,
          marginBottom: 18,
          textAlign: "center",
          maxWidth: 470,
        }}
      >
        Are you an <span style={{ fontWeight: 800 }}>organization, brand, or company</span> seeking to showcase your products, services, or events to our vibrant, engaged community?
        <br />
        Partner with us and grow your reach!
      </div>
      <ul
        style={{
          color: PRIMARY,
          fontSize: 15.5,
          fontWeight: 600,
          paddingLeft: 23,
          marginBottom: 22,
          alignSelf: "stretch",
        }}
      >
        <li style={{ marginBottom: 6 }}>
          Featured banner placement
        </li>
        <li style={{ marginBottom: 6 }}>
          Sponsored posts and announcements
        </li>
        <li>
          Customized outreach packages
        </li>
      </ul>
      <div
        style={{
          width: "100%",
          maxWidth: 485,
          marginBottom: 23,
          background: "#fff",
          borderRadius: 14,
          boxShadow: `0 1.5px 10px ${PRIMARY}12`,
          padding: "18px 22px 13px 22px",
          border: `1.2px solid ${PRIMARY}`,
        }}
      >
        <h3
          style={{
            fontSize: 17.5,
            fontWeight: 800,
            color: PRIMARY,
            marginBottom: 15,
            letterSpacing: 0.1,
            marginTop: 0,
          }}
        >
          Quick Inquiry Form
        </h3>
        {submitted ? (
          <div style={{ color: PRIMARY, fontWeight: 700, padding: "12px 0" }}>
            Thank you! Your inquiry is being processed via your email client.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <input
              name="name"
              type="text"
              required
              minLength={2}
              maxLength={50}
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              style={{
                padding: "10px 12px",
                fontSize: 15.3,
                borderRadius: 7,
                border: `1.1px solid ${PRIMARY}`,
                marginBottom: 3,
                color: PRIMARY,
              }}
              disabled={submitting}
            />
            <input
              name="organization"
              type="text"
              required
              minLength={2}
              maxLength={60}
              value={form.organization}
              onChange={handleChange}
              placeholder="Organization / Company"
              style={{
                padding: "10px 12px",
                fontSize: 15.3,
                borderRadius: 7,
                border: `1.1px solid ${PRIMARY}`,
                marginBottom: 3,
                color: PRIMARY,
              }}
              disabled={submitting}
            />
            <input
              name="email"
              type="email"
              required
              maxLength={90}
              value={form.email}
              onChange={handleChange}
              placeholder="Contact Email"
              style={{
                padding: "10px 12px",
                fontSize: 15.3,
                borderRadius: 7,
                border: `1.1px solid ${PRIMARY}`,
                marginBottom: 3,
                color: PRIMARY,
              }}
              disabled={submitting}
            />
            <textarea
              name="message"
              required
              minLength={10}
              maxLength={700}
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us about your advertising/partnership interests..."
              style={{
                padding: "10px 12px",
                fontSize: 15.3,
                borderRadius: 7,
                border: `1.1px solid ${PRIMARY}`,
                minHeight: 80,
                resize: "vertical",
                marginBottom: 3,
                color: PRIMARY,
              }}
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting || !form.name || !form.email || !form.organization || !form.message}
              style={{
                background: PRIMARY,
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                border: "none",
                borderRadius: 8,
                padding: "10px 0",
                marginTop: 2,
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.7 : 1,
                transition: "background 0.18s",
                letterSpacing: 0.13,
              }}
            >
              {submitting ? "Sending..." : "Send Request Email"}
            </button>
          </form>
        )}
        <div style={{ fontSize: 13.2, color: PRIMARY, textAlign: "center", marginTop: 10 }}>
          Submitting will prompt your device's email client with all details filled in.
        </div>
      </div>
      <div
        style={{
          fontSize: 15,
          color: PRIMARY,
          marginBottom: 23,
          textAlign: "center",
        }}
      >
        For all advertisement & partnership inquiries, send us an email:<br />
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          style={{
            color: PRIMARY,
            fontWeight: 700,
            fontSize: 16.7,
            letterSpacing: 0.1,
            textDecoration: "underline",
            wordBreak: "break-all",
          }}
        >
          {CONTACT_EMAIL}
        </a>
      </div>
      <div
        style={{
          fontSize: 13.9,
          color: PRIMARY,
          borderTop: `1.1px solid ${PRIMARY}44`,
          paddingTop: 8,
          textAlign: "center",
          letterSpacing: 0.01,
        }}
      >
        We look forward to collaborating and bringing new opportunities to our network!
      </div>
    </section>
  );
}
