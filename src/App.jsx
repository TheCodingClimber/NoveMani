import { useState, useEffect, useRef } from "react";
 
const ACCENT = "#FF4D00";
const BG = "#0C0C0C";
const BG_CARD = "#141414";
const TEXT = "#E0E0E0";
const TEXT_DIM = "#666666";
const BORDER = "#1E1E1E";
const MONO = "'IBM Plex Mono', 'Courier New', monospace";
const SANS = "'Space Grotesk', 'Helvetica Neue', sans-serif";
 
function ScanLines() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.03,
      backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
    }} />
  );
}
 
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "1rem 2rem",
      background: scrolled ? "rgba(12,12,12,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? `1px solid ${BORDER}` : "1px solid transparent",
      transition: "all 0.3s",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{
          fontFamily: MONO, fontSize: 13, color: ACCENT,
          fontWeight: 700, letterSpacing: 0,
        }}>[</span>
        <span style={{
          fontFamily: MONO, fontSize: 13, color: TEXT,
          fontWeight: 500, letterSpacing: 2, textTransform: "uppercase",
        }}>Nove Mani</span>
        <span style={{
          fontFamily: MONO, fontSize: 13, color: ACCENT, fontWeight: 700,
        }}>]</span>
      </div>
      <a href="#contact" style={{
        fontFamily: MONO, fontSize: 11, letterSpacing: 1,
        textTransform: "uppercase", color: BG, textDecoration: "none",
        fontWeight: 600, padding: "0.5rem 1.25rem",
        background: ACCENT, transition: "all 0.2s",
      }}
        onMouseEnter={e => e.target.style.opacity = "0.85"}
        onMouseLeave={e => e.target.style.opacity = "1"}
      >Get in touch →</a>
    </nav>
  );
}
 
function Hero() {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 150); }, []);
  const tick = { fontFamily: MONO, fontSize: 11, color: TEXT_DIM, letterSpacing: 1 };
  return (
    <section style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center", padding: "0 2rem", maxWidth: 1200, margin: "0 auto",
    }}>
      <div style={{
        display: "flex", gap: "2rem", marginBottom: "2rem",
        opacity: vis ? 1 : 0, transition: "opacity 0.6s ease 0.2s",
      }}>
        <span style={tick}>EST. 2024</span>
        <span style={tick}>PRIVATELY HELD</span>
      </div>
      <h1 style={{
        fontFamily: SANS, fontSize: "clamp(3rem, 7vw, 6rem)",
        fontWeight: 700, lineHeight: 0.95, color: TEXT, margin: 0,
        letterSpacing: -3,
        opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(40px)",
        transition: "all 0.8s ease 0.3s",
      }}>
        WE DON'T<br />
        TALK ABOUT<br />
        <span style={{ color: ACCENT, WebkitTextStroke: "0px" }}>GOVERNANCE.</span>
      </h1>
      <div style={{
        marginTop: "2.5rem", maxWidth: 500,
        borderLeft: `3px solid ${ACCENT}`, paddingLeft: "1.5rem",
        opacity: vis ? 1 : 0, transition: "opacity 0.6s ease 0.8s",
      }}>
        <p style={{ fontFamily: MONO, fontSize: 13, lineHeight: 1.8, color: TEXT_DIM, margin: 0 }}>
          We enforce it. Every entity, every dollar, every deployment — governed
          with documented decision-making, audited records, and formal authority
          structures. Not handshakes. Not group texts. Infrastructure.
        </p>
      </div>
    </section>
  );
}
 
function StatBar() {
  const stats = [
    { val: "4", label: "Entities" },
    { val: "0", label: "Outside Investors" },
    { val: "100%", label: "Self-Funded" },
    { val: "∞", label: "Time Horizon" },
  ];
  return (
    <section style={{
      borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`,
      display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
    }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          padding: "2rem", textAlign: "center",
          borderRight: i < 3 ? `1px solid ${BORDER}` : "none",
        }}>
          <div style={{
            fontFamily: SANS, fontSize: 36, fontWeight: 700,
            color: i === 3 ? ACCENT : TEXT, lineHeight: 1,
          }}>{s.val}</div>
          <div style={{
            fontFamily: MONO, fontSize: 10, letterSpacing: 2,
            textTransform: "uppercase", color: TEXT_DIM, marginTop: "0.5rem",
          }}>{s.label}</div>
        </div>
      ))}
    </section>
  );
}
 
function Entities() {
  const [hovered, setHovered] = useState(null);
  const list = [
    { tag: "TECH", name: "M20R1", desc: "NVIDIA deep learning servers. Full-stack AI infrastructure. Governed platform operations." },
    { tag: "INFRA", name: "CA1RN", desc: "Physical infrastructure. Network security. Systems we racked, wired, and hardened ourselves." },
    { tag: "CODE", name: "Sovereign Nexus", desc: "Full-stack software delivery into governed environments. Audit trails. Cryptographic validation." },
    { tag: "PRODUCT", name: "Aletheos", desc: "Command-grade operations console. State integrity. Cryptographic audit. Real-time enforcement." },
  ];
  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "6rem 2rem" }}>
      <div style={{
        fontFamily: MONO, fontSize: 10, letterSpacing: 3,
        textTransform: "uppercase", color: ACCENT, marginBottom: "3rem",
      }}>// PORTFOLIO</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {list.map((e, i) => (
          <div key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "grid", gridTemplateColumns: "80px 220px 1fr",
              gap: "2rem", alignItems: "center",
              padding: "1.5rem 1.5rem",
              borderBottom: `1px solid ${BORDER}`,
              background: hovered === i ? "rgba(255,77,0,0.04)" : "transparent",
              cursor: "default", transition: "background 0.2s",
            }}
          >
            <span style={{
              fontFamily: MONO, fontSize: 10, letterSpacing: 2,
              color: ACCENT, padding: "4px 8px",
              border: `1px solid ${ACCENT}`, textAlign: "center",
            }}>{e.tag}</span>
            <span style={{
              fontFamily: SANS, fontSize: 22, fontWeight: 600, color: TEXT,
            }}>{e.name}</span>
            <span style={{
              fontFamily: MONO, fontSize: 12, color: TEXT_DIM, lineHeight: 1.6,
            }}>{e.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
 
function Manifesto() {
  const lines = [
    "Our leadership came from job sites, server rooms, and late-night code sessions.",
    "The CEO ran the electrical at our first facility.",
    "The COO manages every dollar that moves through our accounts.",
    "Our technology leads rack their own servers and write their own code.",
    "That is not a marketing story. That is how we operate.",
  ];
  return (
    <section style={{
      maxWidth: 1200, margin: "0 auto", padding: "6rem 2rem",
      borderTop: `1px solid ${BORDER}`,
    }}>
      <div style={{
        fontFamily: MONO, fontSize: 10, letterSpacing: 3,
        textTransform: "uppercase", color: ACCENT, marginBottom: "3rem",
      }}>// WHO WE ARE</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {lines.map((line, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "baseline", gap: "1.5rem",
            padding: "0.75rem 0",
          }}>
            <span style={{
              fontFamily: MONO, fontSize: 10, color: TEXT_DIM,
              minWidth: 24, textAlign: "right",
            }}>{String(i + 1).padStart(2, "0")}</span>
            <span style={{
              fontFamily: SANS, fontSize: i === lines.length - 1 ? 20 : 17,
              color: i === lines.length - 1 ? TEXT : TEXT_DIM,
              fontWeight: i === lines.length - 1 ? 600 : 400,
              lineHeight: 1.6,
            }}>{line}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
 
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [focused, setFocused] = useState(null);
  const inputBase = (field) => ({
    width: "100%", padding: "1rem",
    fontFamily: MONO, fontSize: 13,
    background: BG_CARD, border: `1px solid ${focused === field ? ACCENT : BORDER}`,
    color: TEXT, outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  });
  return (
    <section id="contact" style={{
      maxWidth: 1200, margin: "0 auto", padding: "6rem 2rem 8rem",
      borderTop: `1px solid ${BORDER}`,
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>
        <div>
          <div style={{
            fontFamily: MONO, fontSize: 10, letterSpacing: 3,
            textTransform: "uppercase", color: ACCENT, marginBottom: "2rem",
          }}>// CONTACT</div>
          <h2 style={{
            fontFamily: SANS, fontSize: 32, fontWeight: 700,
            color: TEXT, margin: "0 0 1rem 0", lineHeight: 1.2,
          }}>Direct line.</h2>
          <p style={{
            fontFamily: MONO, fontSize: 12, lineHeight: 1.8,
            color: TEXT_DIM, margin: 0,
          }}>
            No sales funnel. No demo request queue.<br />
            If you have something real to discuss, send it.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            placeholder="NAME_" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
            style={inputBase("name")}
          />
          <input
            placeholder="EMAIL_" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
            style={inputBase("email")}
          />
          <textarea
            placeholder="MESSAGE_" rows={4} value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
            onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
            style={{ ...inputBase("message"), resize: "vertical", fontFamily: MONO }}
          />
          <button style={{
            alignSelf: "flex-start", padding: "0.75rem 2.5rem",
            background: ACCENT, border: "none",
            color: BG, fontFamily: MONO, fontSize: 11,
            letterSpacing: 2, textTransform: "uppercase",
            fontWeight: 600, cursor: "pointer", transition: "opacity 0.2s",
          }}
            onMouseEnter={e => e.target.style.opacity = "0.85"}
            onMouseLeave={e => e.target.style.opacity = "1"}
          >TRANSMIT →</button>
        </div>
      </div>
    </section>
  );
}
 
function Footer() {
  return (
    <footer style={{
      maxWidth: 1200, margin: "0 auto", padding: "2rem",
      borderTop: `1px solid ${BORDER}`,
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <span style={{ fontFamily: MONO, fontSize: 11, color: TEXT_DIM }}>
        © {new Date().getFullYear()} NOVE MANI LLC
      </span>
      <span style={{ fontFamily: MONO, fontSize: 10, color: TEXT_DIM, letterSpacing: 2 }}>
        BUILT. OWNED. GOVERNED.
      </span>
    </footer>
  );
}
 
export default function NoveManiOptionB() {
  return (
    <div style={{ background: BG, color: TEXT, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <ScanLines />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Nav />
        <Hero />
        <StatBar />
        <Entities />
        <Manifesto />
        <ContactForm />
        <Footer />
      </div>
    </div>
  );
}