import React, { useState } from "react";
import { FaBullhorn, FaAward, FaRegEnvelopeOpen, FaPaperPlane } from "react-icons/fa";

const CONTACT_EMAIL = "info@naape.org.ng";
/**
 * Uses CSS var(--primary) as primary. Fallback to #ff004e if not available.
 */
const PRIMARY = "var(--primary, #ff004e)";

function Feature({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 13, marginBottom: 17,
      background: "rgba(255,255,255,0.95)",
      borderRadius: 9, padding: "12px 16px"
      // no shadow here
    }}>
      <span style={{
        background: PRIMARY,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        color: "#fff",
        fontSize: 20,
        width: 40,
        height: 40
        // no shadow here
      }}>
        {icon}
      </span>
      <div>
        <div style={{
          fontWeight: 700, color: PRIMARY, fontSize: 16, marginBottom: 2, letterSpacing: 0.04
        }}>{title}</div>
        <div style={{ fontSize: 14.7, color: "#2a2a2a" }}>{children}</div>
      </div>
    </div>
  )
}

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
        maxWidth: 700,
        margin: "44px auto",
        padding: "28px 0 36px 0",
        background: "#fff",
        borderRadius: 22,
        border: `2.2px solid ${PRIMARY}`,
        // boxShadow removed
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decorative top wave */}
      <svg
        width="100%" height={54}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          zIndex: 1,
        }}
        viewBox="0 0 375 54" fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0 54C97.5 0 278 88 375 17V0H0V54Z"
          fill="var(--primary, #ff004e)"
          fillOpacity="0.13"
        />
      </svg>
      <div style={{ position: "relative", zIndex: 3, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            background: PRIMARY, // no gradient here
            borderRadius: "50%",
            // boxShadow removed
            marginTop: -22,
            marginBottom: 12,
            border: `2.2px solid var(--primary, #ff004e)`,
          }}
        >
          <FaBullhorn color="#fff" size={30} /* filter left for the icon shadow, since it's not a gradient or box-shadow on the parent */ style={{ filter: "drop-shadow(0 3px 10px #a00)" }} />
        </span>
        <h2
          style={{
            fontSize: 35,
            fontWeight: 900,
            letterSpacing: 0.22,
            color: PRIMARY,
            margin: 0,
            marginBottom: 7,
            textAlign: "center"
            // gradient removed: no background, no text gradient
          }}
        >
          Advertise With <span style={{ letterSpacing: 0.25 }}>NAAP Plan</span>
        </h2>
        <div
          style={{
            fontSize: 17.3,
            color: "#262626",
            fontWeight: 500,
            marginBottom: 23,
            textAlign: "center",
            maxWidth: 520,
            lineHeight: 1.55,
          }}
        >
          <span style={{ color: PRIMARY, fontWeight: 700 }}>Partner with us</span> to showcase your <span style={{ fontWeight: 800, color: PRIMARY }}>brand, events, or services</span> to
          our vibrant, engaged community. <span style={{ fontWeight: 600, color: PRIMARY }}>Expand your reach</span> through our unique, rewarding digital experience.
        </div>

        {/* Features */}
        <div
          style={{
            width: "100%",
            maxWidth: 570,
            marginBottom: 28,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 20px",
            position: "relative",
          }}
        >
          <Feature icon={<FaAward size={20} />} title="Banner Placement">
            Prominent placement for your brand with eye-catching banners and dedicated slots.
          </Feature>
          <Feature icon={<FaRegEnvelopeOpen size={20} />} title="Sponsored Posts">
            Share announcements and stories with our nationwide network.
          </Feature>
          <Feature icon={<FaPaperPlane size={20} />} title="Custom Packages">
            Tailored outreach plans to fit your marketing goals and maximize engagement.
          </Feature>
          <Feature icon={<FaBullhorn size={18} />} title="Amplified Reach">
            Leverage our platform to access a dynamic professional audience.
          </Feature>
        </div>

        {/* Form Box */}
        <div
          style={{
            width: "100%",
            maxWidth: 490,
            marginBottom: 30,
            background: "#fff",
            borderRadius: 17,
            // boxShadow removed
            padding: "19px 24px 15px 24px",
            border: `1.5px solid ${PRIMARY}`,
            position: "relative"
          }}
        >
          <h3
            style={{
              fontSize: 18.6,
              fontWeight: 800,
              color: PRIMARY,
              marginBottom: 13,
              letterSpacing: 0.12,
              marginTop: 0,
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <FaRegEnvelopeOpen color="var(--primary, #ff004e)" style={{ marginRight: 3 }} />{" "}
            Quick Inquiry Form
          </h3>
          <div
            style={{
              width: 34,
              height: 3.6,
              background: PRIMARY,
              borderRadius: 6,
              margin: "0 0 11px 0",
              opacity: 0.18,
            }}
          />
          {submitted ? (
            <div style={{
              color: PRIMARY, fontWeight: 800, padding: "16px 0",
              textAlign: "center", fontSize: 17.3, display: "flex", flexDirection: "column", alignItems: "center", gap: 7
            }}>
              <FaPaperPlane size={26} color="var(--primary, #ff004e)" style={{ marginBottom: 2 }} />
              <span>Thank you! Your inquiry is being processed <br />via your email client.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
              <div style={{ display: "flex", gap: 13 }}>
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
                    flex: 1,
                    padding: "11px 12px",
                    fontSize: 15.5,
                    borderRadius: 7,
                    border: `1.12px solid ${PRIMARY}`,
                    color: PRIMARY,
                    background: "#fff",
                    fontWeight: 500,
                    transition: "box-shadow 0.19s",
                    // boxShadow stays for input focus, for slight input accessibility, but can be removed if needed
                  }}
                  disabled={submitting}
                  autoComplete="off"
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
                    flex: 1,
                    padding: "11px 12px",
                    fontSize: 15.5,
                    borderRadius: 7,
                    border: `1.12px solid ${PRIMARY}`,
                    color: PRIMARY,
                    background: "#fff",
                    fontWeight: 500,
                    // boxShadow stays for input focus
                  }}
                  disabled={submitting}
                  autoComplete="off"
                />
              </div>
              <input
                name="email"
                type="email"
                required
                maxLength={90}
                value={form.email}
                onChange={handleChange}
                placeholder="Contact Email"
                style={{
                  padding: "11px 12px",
                  fontSize: 15.6,
                  borderRadius: 7,
                  border: `1.12px solid ${PRIMARY}`,
                  marginBottom: 0,
                  color: PRIMARY,
                  background: "#fff",
                  fontWeight: 500,
                  // boxShadow stays for input focus
                }}
                disabled={submitting}
                autoComplete="off"
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
                  padding: "12px 13px",
                  fontSize: 15.5,
                  borderRadius: 7,
                  border: `1.12px solid ${PRIMARY}`,
                  minHeight: 92,
                  resize: "vertical",
                  color: PRIMARY,
                  background: "#fff",
                  fontWeight: 500,
                  // boxShadow stays for input focus
                }}
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={submitting || !form.name || !form.email || !form.organization || !form.message}
                style={{
                  background: PRIMARY,
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: 16.4,
                  border: "none",
                  borderRadius: 8,
                  padding: "11px 0",
                  marginTop: 3,
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.66 : 1,
                  transition: "background 0.18s, opacity 0.18s",
                  letterSpacing: 0.09,
                  // boxShadow removed from button
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  justifyContent: "center"
                }}
              >
                <FaPaperPlane style={{
                  opacity: submitting ? 0.75 : 1,
                  animation: submitting ? "flywave 1.2s infinite alternate ease-in" : undefined
                }} />
                {submitting ? "Sending..." : "Send Inquiry"}
              </button>
            </form>
          )}
          <div style={{ fontSize: 13.5, color: PRIMARY, textAlign: "center", marginTop: 9, opacity: 0.77 }}>
            Submitting opens your email app with all details pre-filled.
          </div>
        </div>

        {/* Direct email */}
        <div
          style={{
            fontSize: 15.7,
            color: "#262626",
            marginBottom: 19,
            textAlign: "center",
            background: "var(--primary, #ff004e)1a",
            borderRadius: 7,
            padding: "9px 18px 8px 18px",
            // boxShadow removed
            maxWidth: 440,
            border: `1.2px dashed ${PRIMARY}`,
            fontWeight: 500
          }}
        >
          For all advertisement & partnership inquiries,{" "}
          <span style={{ fontWeight: 600 }}>
            email us at
          </span>
          :&nbsp;
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            style={{
              color: PRIMARY,
              fontWeight: 900,
              fontSize: 16.3,
              letterSpacing: 0.13,
              textDecoration: "underline",
              wordBreak: "break-all",
              transition: "color 0.17s"
            }}
          >
            {CONTACT_EMAIL}
          </a>
        </div>
        <div
          style={{
            fontSize: 14,
            color: PRIMARY,
            borderTop: `1.12px solid ${PRIMARY}33`,
            paddingTop: 10,
            textAlign: "center",
            letterSpacing: 0.01,
            opacity: 0.92,
            maxWidth: 420,
            margin: "0 auto",
            marginBottom: 5
          }}
        >
          <span style={{ fontWeight: 700 }}>Let's create lasting impact</span>{" "}
          and unlock new opportunities together!
        </div>
      </div>
      {/* Subtle floating icon decoration - bottom right */}
      <FaAward
        size={64}
        color="var(--primary, #ff004e)"
        style={{
          opacity: 0.10,
          position: "absolute",
          bottom: 10,
          right: 22,
          zIndex: 1,
          pointerEvents: "none"
        }}
      />
      {/* Decorative shape/fade at bottom */}
      <svg width="120" height="27"
        viewBox="0 0 120 27"
        style={{
          position: "absolute",
          left: "32px",
          bottom: 0,
          zIndex: 1,
          opacity: 0.18
        }}>
        <ellipse cx="60" cy="32" rx="59" ry="30" fill="var(--primary, #ff004e)" />
      </svg>
      {/* Keyframe for sending animation (injected) */}
      <style>{`
        @keyframes flywave {
          from { transform: translateY(0) rotate(-7deg);}
          to { transform: translateY(-8px) rotate(13deg);}
        }
      `}</style>
    </section>
  );
}
