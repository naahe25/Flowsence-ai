import { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import {
  Calendar, Users, TrendingUp, AlertTriangle, Clock, ChevronRight,
  Star, MessageSquare, CreditCard, Check, X, Search, Filter, Bell,
  Settings, LayoutDashboard, BarChart2, ChevronDown, ArrowRight,
  Zap, Shield, Bot, DollarSign, User, Phone, Mail, Moon, Sun,
  Plus, Edit, Trash2, Download, Send, RefreshCw, Menu, LogOut,
  ChevronLeft, Info, Activity, Inbox, List, Grid
} from "lucide-react";

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

const SERVICES = ["Hair Cut", "Color Treatment", "Deep Tissue Massage", "Consulting Session", "Personal Training", "Therapy Session", "Blowout", "Facial"];

const CLIENTS = [
  { id: 1, name: "Amara Osei", avatar: "AO", appointments: 14, lastVisit: "2026-06-07", noShows: 0, riskScore: 12, email: "amara@example.com", phone: "+1 555-0101", service: "Hair Cut" },
  { id: 2, name: "James Whitfield", avatar: "JW", appointments: 8, lastVisit: "2026-05-29", noShows: 2, riskScore: 74, email: "james@example.com", phone: "+1 555-0102", service: "Consulting Session" },
  { id: 3, name: "Priya Nair", avatar: "PN", appointments: 22, lastVisit: "2026-06-05", noShows: 1, riskScore: 28, email: "priya@example.com", phone: "+1 555-0103", service: "Therapy Session" },
  { id: 4, name: "Marcus Bell", avatar: "MB", appointments: 6, lastVisit: "2026-04-15", noShows: 3, riskScore: 89, email: "marcus@example.com", phone: "+1 555-0104", service: "Personal Training" },
  { id: 5, name: "Sophie Laurent", avatar: "SL", appointments: 19, lastVisit: "2026-06-09", noShows: 0, riskScore: 8, email: "sophie@example.com", phone: "+1 555-0105", service: "Color Treatment" },
  { id: 6, name: "Kwame Asante", avatar: "KA", appointments: 11, lastVisit: "2026-06-01", noShows: 1, riskScore: 41, email: "kwame@example.com", phone: "+1 555-0106", service: "Deep Tissue Massage" },
  { id: 7, name: "Elena Vasquez", avatar: "EV", appointments: 31, lastVisit: "2026-06-08", noShows: 0, riskScore: 5, email: "elena@example.com", phone: "+1 555-0107", service: "Facial" },
  { id: 8, name: "Raj Patel", avatar: "RP", appointments: 4, lastVisit: "2026-05-10", noShows: 2, riskScore: 68, email: "raj@example.com", phone: "+1 555-0108", service: "Consulting Session" },
];

const APPOINTMENTS_TODAY = [
  { id: 1, client: "Amara Osei", service: "Hair Cut", time: "9:00 AM", duration: 60, risk: false, status: "confirmed", color: "#C9963F" },
  { id: 2, client: "James Whitfield", service: "Consulting Session", time: "10:30 AM", duration: 45, risk: true, status: "confirmed", color: "#7C6A8E" },
  { id: 3, client: "Priya Nair", service: "Therapy Session", time: "11:30 AM", duration: 60, risk: false, status: "confirmed", color: "#4A8A7C" },
  { id: 4, client: "Marcus Bell", service: "Personal Training", time: "1:00 PM", duration: 60, risk: true, status: "pending", color: "#8E4A4A" },
  { id: 5, client: "Sophie Laurent", service: "Color Treatment", time: "2:30 PM", duration: 90, risk: false, status: "confirmed", color: "#4A6A8E" },
  { id: 6, client: "Elena Vasquez", service: "Facial", time: "4:00 PM", duration: 60, risk: false, status: "confirmed", color: "#6A8E4A" },
];

const REVENUE_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: `Jun ${i + 1}`,
  revenue: Math.floor(Math.random() * 800 + 400),
  appointments: Math.floor(Math.random() * 8 + 3),
}));

const HEATMAP_DATA = [
  { hour: "8AM", Mon: 3, Tue: 5, Wed: 4, Thu: 6, Fri: 8, Sat: 9, Sun: 2 },
  { hour: "10AM", Mon: 7, Tue: 8, Wed: 9, Thu: 7, Fri: 10, Sat: 10, Sun: 4 },
  { hour: "12PM", Mon: 5, Tue: 6, Wed: 5, Thu: 8, Fri: 9, Sat: 8, Sun: 3 },
  { hour: "2PM", Mon: 8, Tue: 7, Wed: 8, Thu: 9, Fri: 10, Sat: 7, Sun: 5 },
  { hour: "4PM", Mon: 9, Tue: 10, Wed: 9, Thu: 10, Fri: 10, Sat: 6, Sun: 3 },
  { hour: "6PM", Mon: 6, Tue: 7, Wed: 6, Thu: 8, Fri: 7, Sat: 4, Sun: 2 },
];

const PRICING_SUGGESTIONS = [
  { slot: "Friday 4:00 PM", current: "$85", suggested: "$98", lift: "+15.3%" },
  { slot: "Saturday 10:00 AM", current: "$85", suggested: "$102", lift: "+20.0%" },
  { slot: "Monday 9:00 AM", current: "$85", suggested: "$72", lift: "-15.3%" },
  { slot: "Tuesday 1:00 PM", current: "$65", suggested: "$75", lift: "+15.4%" },
  { slot: "Wednesday 3:00 PM", current: "$65", suggested: "$56", lift: "-13.8%" },
  { slot: "Thursday 5:00 PM", current: "$85", suggested: "$95", lift: "+11.8%" },
];

const CHAT_MESSAGES = [
  { role: "ai", text: "Hi! I'm the FlowSense booking assistant. What service are you looking to book today?" },
  { role: "user", text: "I need a haircut Saturday afternoon, around 2 or 3pm" },
  { role: "ai", text: "Great! I have openings this Saturday at 2:00 PM and 3:30 PM with Alex. Both slots take about 45 minutes. Do either of those work for you?" },
  { role: "user", text: "3:30 works perfectly" },
  { role: "ai", text: "Perfect. Saturday June 13 at 3:30 PM — Hair Cut with Alex, 45 min, $85. A $20 deposit is required to confirm. Can I get your name and email to finalize this?" },
];

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────

const T = {
  bg: "#0F0E0D",
  surface: "#161511",
  surfaceAlt: "#1C1B17",
  surfaceHover: "#222019",
  border: "#2A2820",
  borderLight: "#3A3830",
  gold: "#C9963F",
  goldLight: "#E5B86A",
  goldDim: "#8A6428",
  ivory: "#F0EBE1",
  ivoryDim: "#B8B0A4",
  ivoryMuted: "#706860",
  slate: "#2A3040",
  risk: "#D94040",
  safe: "#4A9A6A",
  info: "#4A7AAA",
  purple: "#8A6AAA",
};

// ─── GLOBAL STYLES ─────────────────────────────────────────────────────────

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    background: ${T.bg};
    color: ${T.ivory};
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: ${T.surface}; }
  ::-webkit-scrollbar-thumb { background: ${T.goldDim}; border-radius: 2px; }

  .serif { font-family: 'Playfair Display', serif; }

  @keyframes goldPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(201, 150, 63, 0.0), 0 0 0 0 rgba(201, 150, 63, 0.0); }
    50% { box-shadow: 0 0 12px 2px rgba(201, 150, 63, 0.18), 0 0 24px 4px rgba(201, 150, 63, 0.08); }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes shimmer {
    0% { background-position: -200px 0; }
    100% { background-position: calc(200px + 100%) 0; }
  }

  @keyframes dotPulse {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40% { transform: scale(1); opacity: 1; }
  }

  .ai-card {
    animation: goldPulse 3s ease-in-out infinite;
    border: 1px solid rgba(201, 150, 63, 0.25) !important;
  }

  .fade-in { animation: fadeInUp 0.4s ease both; }

  .skeleton {
    background: linear-gradient(90deg, ${T.surface} 25%, ${T.surfaceAlt} 50%, ${T.surface} 75%);
    background-size: 200px 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
  }

  .btn-gold {
    background: ${T.gold};
    color: ${T.bg};
    border: none;
    padding: 10px 22px;
    border-radius: 6px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    letter-spacing: 0.02em;
  }
  .btn-gold:hover { background: ${T.goldLight}; transform: translateY(-1px); }
  .btn-gold:active { transform: translateY(0); }

  .btn-ghost {
    background: transparent;
    color: ${T.ivoryDim};
    border: 1px solid ${T.border};
    padding: 10px 22px;
    border-radius: 6px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-ghost:hover { border-color: ${T.gold}; color: ${T.gold}; }

  .btn-icon {
    background: ${T.surfaceAlt};
    color: ${T.ivoryDim};
    border: 1px solid ${T.border};
    width: 36px; height: 36px;
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .btn-icon:hover { border-color: ${T.gold}; color: ${T.gold}; background: ${T.surfaceHover}; }

  .nav-link {
    color: ${T.ivoryDim};
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .nav-link:hover { color: ${T.ivory}; background: ${T.surfaceAlt}; }
  .nav-link.active { color: ${T.gold}; background: rgba(201,150,63,0.08); }

  .card {
    background: ${T.surface};
    border: 1px solid ${T.border};
    border-radius: 10px;
    padding: 20px;
    transition: border-color 0.2s;
  }
  .card:hover { border-color: ${T.borderLight}; }

  .risk-badge-high { background: rgba(217,64,64,0.12); color: #F07070; border: 1px solid rgba(217,64,64,0.25); padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
  .risk-badge-med { background: rgba(201,150,63,0.12); color: ${T.goldLight}; border: 1px solid rgba(201,150,63,0.25); padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
  .risk-badge-low { background: rgba(74,154,106,0.12); color: #6ABE8A; border: 1px solid rgba(74,154,106,0.25); padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }

  input, select, textarea {
    background: ${T.surfaceAlt};
    border: 1px solid ${T.border};
    color: ${T.ivory};
    padding: 10px 14px;
    border-radius: 6px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
  }
  input:focus, select:focus, textarea:focus { border-color: ${T.gold}; }
  input::placeholder { color: ${T.ivoryMuted}; }

  table { width: 100%; border-collapse: collapse; }
  thead th {
    color: ${T.ivoryMuted};
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 10px 16px;
    text-align: left;
    border-bottom: 1px solid ${T.border};
  }
  tbody tr {
    border-bottom: 1px solid ${T.border};
    cursor: pointer;
    transition: background 0.15s;
  }
  tbody tr:hover { background: ${T.surfaceAlt}; }
  tbody tr:last-child { border-bottom: none; }
  tbody td { padding: 12px 16px; font-size: 14px; color: ${T.ivory}; }

  .dot-typing span {
    display: inline-block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: ${T.gold};
    margin: 0 2px;
    animation: dotPulse 1.4s infinite ease-in-out;
  }
  .dot-typing span:nth-child(2) { animation-delay: 0.2s; }
  .dot-typing span:nth-child(3) { animation-delay: 0.4s; }

  .page-enter { animation: fadeInUp 0.35s ease both; }

  :root {
    --gold: ${T.gold};
    --bg: ${T.bg};
    --surface: ${T.surface};
    --ivory: ${T.ivory};
  }
`;

// ─── UTILITY COMPONENTS ────────────────────────────────────────────────────

function RiskBadge({ score }) {
  if (score >= 65) return <span className="risk-badge-high">High Risk</span>;
  if (score >= 35) return <span className="risk-badge-med">Med Risk</span>;
  return <span className="risk-badge-low">Low Risk</span>;
}

function Avatar({ initials, size = 32, bg = T.slate }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg, display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 600, color: T.ivory, flexShrink: 0,
      border: `1px solid ${T.borderLight}`
    }}>
      {initials}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, accent = false }) {
  return (
    <div className={`card ${accent ? "ai-card" : ""}`} style={{ flex: 1, minWidth: 140 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ color: T.ivoryMuted, fontSize: 12, fontWeight: 500, letterSpacing: "0.04em" }}>{label}</div>
        <div style={{ color: accent ? T.gold : T.ivoryMuted }}>
          <Icon size={16} />
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 600, color: accent ? T.gold : T.ivory, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: T.ivoryMuted, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function TopNav({ activePage, setPage, darkMode, setDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pages = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "clients", label: "Clients", icon: Users },
    { id: "insights", label: "AI Insights", icon: BarChart2 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav style={{
      background: T.surface, borderBottom: `1px solid ${T.border}`,
      padding: "0 24px", display: "flex", alignItems: "center",
      height: 56, position: "sticky", top: 0, zIndex: 100, gap: 8
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 24, cursor: "pointer" }}
        onClick={() => setPage("landing")}>
        <div style={{
          width: 28, height: 28, borderRadius: 6, background: T.gold,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Zap size={14} color={T.bg} />
        </div>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: T.ivory }}>
          FlowSense
        </span>
      </div>

      <div style={{ display: "flex", gap: 2, flex: 1, overflowX: "auto" }}>
        {pages.map(p => (
          <span key={p.id} className={`nav-link ${activePage === p.id ? "active" : ""}`}
            onClick={() => setPage(p.id)}>
            {p.label}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button className="btn-icon" onClick={() => setDarkMode(!darkMode)} title="Toggle theme">
          {darkMode ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <button className="btn-icon">
          <Bell size={14} />
        </button>
        <Avatar initials="OW" size={32} bg={T.goldDim} />
      </div>
    </nav>
  );
}

// ─── PAGE 1: LANDING ───────────────────────────────────────────────────────

function LandingPage({ setPage }) {
  const [activeFeature, setActiveFeature] = useState(0);

  const competitors = [
    { name: "Calendly", price: "$10–$16/mo", flaw: "Meetings only. No payments, no service customization." },
    { name: "Acuity", price: "$20–$46/mo", flaw: "Owned by Squarespace. Limited AI, rigid workflows." },
    { name: "Square Appts", price: "$0–$69/mo", flaw: "Payment-first. Poor customization and client comms." },
    { name: "Setmore", price: "$0–$12/mo", flaw: "Feature-basic. No real AI of any kind." },
    { name: "Zoho Bookings", price: "$6/mo", flaw: "Clunky UX. Minimal AI, no predictive features." },
  ];

  const features = [
    {
      icon: Bot, title: "Conversational AI Booking",
      desc: "Clients book via website widget, WhatsApp, or SMS in plain language. The AI handles availability, service selection, and rescheduling in real time — no forms, no friction."
    },
    {
      icon: AlertTriangle, title: "No-Show Prediction Engine",
      desc: "Flags high-risk bookings using client history, service type, and time patterns. Automatically sends targeted reminders or requires a deposit before confirmation."
    },
    {
      icon: TrendingUp, title: "Dynamic Pricing",
      desc: "Recommends 10–20% price increases on peak slots and strategic discounts for slow periods. Revenue optimization without touching a single spreadsheet."
    },
    {
      icon: RefreshCw, title: "Smart Waitlist Management",
      desc: "When a slot opens, FlowSense re-books the best-matched waitlisted client based on service fit — not just queue position. Every cancellation becomes a fill."
    },
    {
      icon: MessageSquare, title: "Post-Appointment Follow-Up",
      desc: "Sends personalized thank-you messages, care tips, and review requests tailored to the service received. Automated, but never generic."
    },
  ];

  const plans = [
    {
      name: "Starter", price: "$19", period: "/mo",
      features: ["AI chat booking", "Online payments", "Automated reminders", "Basic analytics", "Email support"],
      cta: "Start Free Trial", highlight: false
    },
    {
      name: "Pro", price: "$39", period: "/mo",
      features: ["Everything in Starter", "No-show prediction engine", "Smart waitlist AI", "Client risk scores", "Priority support"],
      cta: "Most Popular", highlight: true
    },
    {
      name: "Premium", price: "$79", period: "/mo",
      features: ["Everything in Pro", "Dynamic pricing AI", "Full WhatsApp + SMS", "Custom branding", "Dedicated onboarding"],
      cta: "Book a Demo", highlight: false
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>

      {/* Top Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 48px", borderBottom: `1px solid ${T.border}`,
        position: "sticky", top: 0, background: `${T.bg}EE`, backdropFilter: "blur(10px)", zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 7, background: T.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={16} color={T.bg} />
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>FlowSense AI</span>
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {["Features", "Pricing", "About"].map(l => (
            <span key={l} style={{ color: T.ivoryDim, fontSize: 14, cursor: "pointer", fontWeight: 500 }}
              className="nav-link">{l}</span>
          ))}
          <button className="btn-ghost" style={{ padding: "8px 18px" }} onClick={() => setPage("dashboard")}>Sign In</button>
          <button className="btn-gold" onClick={() => setPage("dashboard")}>Start Free Trial</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: "90vh", display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", textAlign: "center", padding: "80px 24px",
        background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,150,63,0.07) 0%, transparent 70%)`
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,150,63,0.08)",
          border: `1px solid rgba(201,150,63,0.2)`, borderRadius: 20, padding: "4px 14px",
          fontSize: 12, color: T.gold, fontWeight: 600, letterSpacing: "0.06em", marginBottom: 32
        }}>
          <Zap size={10} /> AI-NATIVE SCHEDULING PLATFORM
        </div>
        <h1 className="serif" style={{ fontSize: "clamp(40px, 7vw, 88px)", fontWeight: 700, lineHeight: 1.05, maxWidth: 900, marginBottom: 24 }}>
          Book, pay, show up —<br />
          <span style={{ color: T.gold, fontStyle: "italic" }}>without touching a calendar.</span>
        </h1>
        <p style={{ fontSize: 18, color: T.ivoryDim, maxWidth: 560, marginBottom: 40, lineHeight: 1.7 }}>
          Service businesses lose 5–10 hours every week to scheduling back-and-forth, no-shows, and manual payment chasing. FlowSense ends that.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <button className="btn-gold" style={{ padding: "14px 32px", fontSize: 15 }} onClick={() => setPage("dashboard")}>
            Start Free Trial — No Credit Card
          </button>
          <button className="btn-ghost" style={{ padding: "14px 28px", fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}
            onClick={() => setPage("widget")}>
            <span>See Booking Widget</span> <ArrowRight size={14} />
          </button>
        </div>
        <div style={{ display: "flex", gap: 32, marginTop: 56, flexWrap: "wrap", justifyContent: "center" }}>
          {[["2,400+", "Businesses"], ["$18M+", "Revenue Booked"], ["94%", "Fewer No-Shows"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div className="serif" style={{ fontSize: 32, fontWeight: 700, color: T.gold }}>{val}</div>
              <div style={{ fontSize: 13, color: T.ivoryMuted }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Competitor Comparison */}
      <section style={{ padding: "80px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: T.gold, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 12 }}>THE COMPETITION</div>
          <h2 className="serif" style={{ fontSize: 40, fontWeight: 700 }}>Everyone else built for meetings.</h2>
          <p style={{ color: T.ivoryDim, marginTop: 12, fontSize: 15 }}>FlowSense was built from the ground up for service businesses.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {competitors.map(c => (
            <div key={c.name} className="card" style={{ position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: T.border }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{c.name}</div>
                <X size={14} color={T.risk} />
              </div>
              <div style={{ fontSize: 12, color: T.gold, marginBottom: 8 }}>{c.price}</div>
              <div style={{ fontSize: 13, color: T.ivoryMuted, lineHeight: 1.5 }}>{c.flaw}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{ marginTop: 20, border: `1px solid rgba(201,150,63,0.3)`, background: "rgba(201,150,63,0.04)", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
            <Check size={16} color={T.gold} />
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600 }}>FlowSense AI — $19–$79/mo</span>
          </div>
          <div style={{ color: T.ivoryDim, fontSize: 14 }}>AI-native. Payments built in. Predictive engine. No per-client fees. Built specifically for service professionals.</div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: T.gold, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 12 }}>FIVE CORE CAPABILITIES</div>
          <h2 className="serif" style={{ fontSize: 40, fontWeight: 700 }}>Intelligence built into every step.</h2>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 280, flexShrink: 0 }}>
            {features.map((f, i) => (
              <div key={i} onClick={() => setActiveFeature(i)} className="card"
                style={{
                  cursor: "pointer", padding: "14px 16px",
                  border: `1px solid ${activeFeature === i ? "rgba(201,150,63,0.4)" : T.border}`,
                  background: activeFeature === i ? "rgba(201,150,63,0.06)" : T.surface,
                  display: "flex", alignItems: "center", gap: 12
                }}>
                <div style={{ color: activeFeature === i ? T.gold : T.ivoryMuted }}>
                  <f.icon size={16} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: activeFeature === i ? T.ivory : T.ivoryDim }}>
                  {f.title}
                </span>
              </div>
            ))}
          </div>
          <div className="card ai-card" style={{ flex: 1, padding: 36, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {(() => {
              const f = features[activeFeature];
              return (
                <>
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: "rgba(201,150,63,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                    <f.icon size={22} color={T.gold} />
                  </div>
                  <h3 className="serif" style={{ fontSize: 26, fontWeight: 700, marginBottom: 16 }}>{f.title}</h3>
                  <p style={{ fontSize: 15, color: T.ivoryDim, lineHeight: 1.8 }}>{f.desc}</p>
                </>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: "80px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: T.gold, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 12 }}>PRICING</div>
          <h2 className="serif" style={{ fontSize: 40, fontWeight: 700 }}>Simple, flat pricing.</h2>
          <p style={{ color: T.ivoryDim, marginTop: 12, fontSize: 15 }}>No per-client fees. No payment lock-in. Cancel any time.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {plans.map(p => (
            <div key={p.name} className={`card ${p.highlight ? "ai-card" : ""}`}
              style={{
                padding: 28,
                border: p.highlight ? `1px solid rgba(201,150,63,0.4)` : `1px solid ${T.border}`,
                background: p.highlight ? "rgba(201,150,63,0.04)" : T.surface,
                position: "relative", transform: p.highlight ? "translateY(-8px)" : "none"
              }}>
              {p.highlight && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  background: T.gold, color: T.bg, fontSize: 10, fontWeight: 700,
                  padding: "3px 14px", borderRadius: 10, letterSpacing: "0.06em"
                }}>MOST POPULAR</div>
              )}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, color: T.ivoryMuted, marginBottom: 8, fontWeight: 500 }}>{p.name}</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
                  <span className="serif" style={{ fontSize: 44, fontWeight: 700, color: p.highlight ? T.gold : T.ivory }}>{p.price}</span>
                  <span style={{ color: T.ivoryMuted, fontSize: 14, paddingBottom: 8 }}>{p.period}</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: T.ivoryDim }}>
                    <Check size={13} color={T.gold} /> {f}
                  </div>
                ))}
              </div>
              <button className={p.highlight ? "btn-gold" : "btn-ghost"} style={{ width: "100%", padding: "12px", textAlign: "center" }}
                onClick={() => setPage("dashboard")}>
                {p.highlight ? "Start Free Trial" : p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        padding: "80px 48px", textAlign: "center",
        background: `linear-gradient(180deg, transparent, rgba(201,150,63,0.04))`
      }}>
        <h2 className="serif" style={{ fontSize: 48, fontWeight: 700, marginBottom: 20 }}>
          Your schedule shouldn't run your business.
        </h2>
        <p style={{ color: T.ivoryDim, fontSize: 16, marginBottom: 36, maxWidth: 500, margin: "0 auto 36px" }}>
          Set up in under 10 minutes. FlowSense learns your business and starts filling your calendar on day one.
        </p>
        <button className="btn-gold" style={{ padding: "16px 40px", fontSize: 16 }} onClick={() => setPage("dashboard")}>
          Get Started Free
        </button>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${T.border}`, padding: "32px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 24, height: 24, borderRadius: 5, background: T.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={12} color={T.bg} />
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>FlowSense AI</span>
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {["Privacy", "Terms", "Support", "Status"].map(l => (
            <span key={l} style={{ fontSize: 13, color: T.ivoryMuted, cursor: "pointer" }}>{l}</span>
          ))}
        </div>
        <div style={{ fontSize: 13, color: T.ivoryMuted }}>© 2026 FlowSense AI</div>
      </footer>
    </div>
  );
}

// ─── PAGE 2: DASHBOARD ─────────────────────────────────────────────────────

function DashboardPage({ setPage }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => { setTimeout(() => setLoading(false), 1200); }, []);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM"];

  const apptBlocks = [
    { day: 1, slot: 0, client: "Amara O.", service: "Hair Cut", color: T.gold, risk: false },
    { day: 1, slot: 2, client: "Priya N.", service: "Therapy", color: "#4A8A7C", risk: false },
    { day: 2, slot: 1, client: "James W.", service: "Consulting", color: "#7C6A8E", risk: true },
    { day: 2, slot: 4, client: "Marcus B.", service: "Training", color: "#8E4A4A", risk: true },
    { day: 3, slot: 0, client: "Sophie L.", service: "Color", color: "#4A6A8E", risk: false },
    { day: 3, slot: 3, client: "Elena V.", service: "Facial", color: "#6A8E4A", risk: false },
    { day: 4, slot: 2, client: "Kwame A.", service: "Massage", color: "#8E7A4A", risk: false },
    { day: 4, slot: 5, client: "Raj P.", service: "Consulting", color: "#7C6A8E", risk: true },
    { day: 5, slot: 0, client: "Amara O.", service: "Blowout", color: T.gold, risk: false },
    { day: 5, slot: 3, client: "Sophie L.", service: "Color", color: "#4A6A8E", risk: false },
    { day: 5, slot: 6, client: "Elena V.", service: "Facial", color: "#6A8E4A", risk: false },
  ];

  return (
    <div style={{ padding: "28px 28px", maxWidth: 1300, margin: "0 auto" }}>

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} style={{ flex: 1, minWidth: 140, height: 100, borderRadius: 10 }} className="skeleton" />
          ))
        ) : (
          <>
            <StatCard icon={Calendar} label="Today's Appointments" value="6" sub="2 confirmed pending" />
            <StatCard icon={DollarSign} label="Revenue Today" value="$486" sub="+12% vs last week" accent />
            <StatCard icon={AlertTriangle} label="High Risk Alerts" value="3" sub="Deposits recommended" />
            <StatCard icon={Users} label="On Waitlist" value="7" sub="2 match open slots" accent />
          </>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>

        {/* Calendar */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="serif" style={{ fontSize: 16, fontWeight: 600 }}>Week of June 9–15</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-icon"><ChevronLeft size={14} /></button>
              <button className="btn-icon"><ChevronRight size={14} /></button>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "60px repeat(7, 1fr)", minWidth: 600 }}>
              <div style={{ background: T.surfaceAlt }} />
              {weekDays.map((d, i) => (
                <div key={d} style={{
                  padding: "10px 4px", textAlign: "center", borderLeft: `1px solid ${T.border}`,
                  background: i === 1 ? "rgba(201,150,63,0.05)" : T.surfaceAlt,
                  fontSize: 12, color: i === 1 ? T.gold : T.ivoryMuted, fontWeight: 500
                }}>
                  <div>{d}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: i === 1 ? T.gold : T.ivory }}>{9 + i}</div>
                </div>
              ))}
              {hours.map((h, hi) => (
                <>
                  <div key={`h${hi}`} style={{ padding: "0 8px", display: "flex", alignItems: "center", height: 56, fontSize: 11, color: T.ivoryMuted, borderTop: `1px solid ${T.border}` }}>
                    {h}
                  </div>
                  {weekDays.map((d, di) => {
                    const appt = apptBlocks.find(a => a.day === di && a.slot === hi);
                    return (
                      <div key={`${h}${d}`} style={{
                        height: 56, borderLeft: `1px solid ${T.border}`, borderTop: `1px solid ${T.border}`,
                        padding: 3, position: "relative",
                        background: di === 1 ? "rgba(201,150,63,0.02)" : "transparent"
                      }}>
                        {appt && (
                          <div style={{
                            background: `${appt.color}22`, border: `1px solid ${appt.color}55`,
                            borderRadius: 4, padding: "3px 6px", height: "100%", cursor: "pointer",
                            transition: "opacity 0.2s", position: "relative", overflow: "hidden"
                          }}>
                            <div style={{ fontSize: 10, color: appt.color, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {appt.client}
                            </div>
                            <div style={{ fontSize: 9, color: T.ivoryMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {appt.service}
                            </div>
                            {appt.risk && (
                              <div style={{ position: "absolute", top: 2, right: 2, width: 6, height: 6, borderRadius: "50%", background: T.risk }} />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* AI Insights */}
          <div className="card ai-card">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Bot size={14} color={T.gold} />
              <span style={{ fontSize: 13, color: T.gold, fontWeight: 600, letterSpacing: "0.04em" }}>AI INSIGHTS</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { icon: TrendingUp, text: "Friday 4PM slots at 94% booking rate — +15% pricing is ready.", color: T.gold },
                { icon: AlertTriangle, text: "3 appointments tomorrow flagged high risk. Deposits recommended.", color: T.risk },
                { icon: Users, text: "2 waitlisted clients match your Tuesday 2PM opening.", color: T.info },
              ].map((ins, i) => (
                <div key={i} style={{
                  display: "flex", gap: 10, padding: "10px 12px", borderRadius: 7,
                  background: `${ins.color}0D`, border: `1px solid ${ins.color}22`
                }}>
                  <ins.icon size={13} color={ins.color} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 12, color: T.ivoryDim, lineHeight: 1.5 }}>{ins.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Appointments */}
          <div className="card" style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.ivory, marginBottom: 14 }}>Today's Schedule</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} style={{ height: 44, borderRadius: 6 }} className="skeleton" />
                ))
              ) : APPOINTMENTS_TODAY.slice(0, 5).map(a => (
                <div key={a.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "8px 10px", borderRadius: 7, background: T.surfaceAlt,
                  border: `1px solid ${a.risk ? T.risk + "33" : T.border}`
                }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ width: 3, height: 30, borderRadius: 2, background: a.color, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{a.client}</div>
                      <div style={{ fontSize: 11, color: T.ivoryMuted }}>{a.service}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: T.ivoryDim }}>{a.time}</div>
                    {a.risk && <span style={{ fontSize: 10, color: T.risk }}>⚠ Risk</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card" style={{ marginTop: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.ivory, marginBottom: 16 }}>Recent Client Activity</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { client: "Elena Vasquez", action: "Booked Facial via WhatsApp", time: "12 min ago", avatar: "EV" },
            { client: "Sophie Laurent", action: "Paid $85 deposit — Color Treatment confirmed", time: "34 min ago", avatar: "SL" },
            { client: "Amara Osei", action: "Left a 5-star review after Hair Cut", time: "1 hr ago", avatar: "AO" },
            { client: "Marcus Bell", action: "AI flagged as high no-show risk — reminder sent", time: "2 hrs ago", avatar: "MB" },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: i < 3 ? `1px solid ${T.border}` : "none" }}>
              <Avatar initials={a.avatar} size={32} />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{a.client}</span>
                <span style={{ fontSize: 13, color: T.ivoryDim }}> — {a.action}</span>
              </div>
              <span style={{ fontSize: 12, color: T.ivoryMuted, flexShrink: 0 }}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE 3: BOOKING WIDGET ────────────────────────────────────────────────

function WidgetPage() {
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState(CHAT_MESSAGES);
  const [inputVal, setInputVal] = useState("");
  const [typing, setTyping] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const chatRef = useRef(null);

  const steps = ["Chat", "Service", "Date & Time", "Your Details", "Payment", "Confirmed"];
  const times = ["9:00 AM", "10:30 AM", "11:00 AM", "1:00 PM", "2:30 PM", "3:30 PM", "4:00 PM", "5:00 PM"];

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = () => {
    if (!inputVal.trim()) return;
    const newMsgs = [...messages, { role: "user", text: inputVal }];
    setMessages(newMsgs);
    setInputVal("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { role: "ai", text: "I've found the perfect slot for you. Let's confirm the details — tap Next to continue." }]);
      setTimeout(() => setStep(1), 600);
    }, 1600);
  };

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(2026, 5, 10 + i);
    return { day: d.getDate(), label: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()], full: `${d.getDate()} Jun` };
  });

  return (
    <div style={{ padding: "40px 24px", display: "flex", flexDirection: "column", alignItems: "center", minHeight: "calc(100vh - 56px)" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: T.gold, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 8 }}>BOOKING WIDGET PREVIEW</div>
        <h2 className="serif" style={{ fontSize: 32, fontWeight: 700 }}>Embeddable on any website.</h2>
        <p style={{ color: T.ivoryDim, marginTop: 8, fontSize: 14 }}>This is what your clients see. Fully conversational, fully automated.</p>
      </div>

      <div style={{
        width: "100%", maxWidth: 460,
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 16, overflow: "hidden",
        boxShadow: `0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px ${T.border}`
      }}>
        {/* Widget Header */}
        <div style={{
          padding: "16px 20px", background: T.surfaceAlt, borderBottom: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", gap: 10
        }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: T.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bot size={16} color={T.bg} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>FlowSense Booking</div>
            <div style={{ fontSize: 11, color: T.safe, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.safe, display: "inline-block" }} />
              Online now
            </div>
          </div>
        </div>

        {/* Step Indicators */}
        <div style={{ padding: "12px 20px", display: "flex", gap: 4, borderBottom: `1px solid ${T.border}` }}>
          {steps.map((s, i) => (
            <div key={s} style={{ flex: 1, height: 2, borderRadius: 1, background: i <= step ? T.gold : T.border, transition: "background 0.3s" }} />
          ))}
        </div>

        {/* Step Content */}
        <div style={{ height: 380, overflowY: "auto", padding: "16px 20px" }} ref={step === 0 ? chatRef : null}>
          {step === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "80%", padding: "10px 14px", borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                    background: m.role === "user" ? T.gold : T.surfaceAlt,
                    color: m.role === "user" ? T.bg : T.ivory,
                    fontSize: 13, lineHeight: 1.5
                  }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div style={{ display: "flex" }}>
                  <div style={{ padding: "10px 14px", borderRadius: "12px 12px 12px 2px", background: T.surfaceAlt }} className="dot-typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="fade-in">
              <div style={{ fontSize: 14, color: T.ivoryDim, marginBottom: 16 }}>Select your service</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {SERVICES.map(s => (
                  <div key={s} onClick={() => setSelectedService(s)} style={{
                    padding: "12px 14px", borderRadius: 8, cursor: "pointer",
                    border: `1px solid ${selectedService === s ? T.gold : T.border}`,
                    background: selectedService === s ? "rgba(201,150,63,0.08)" : T.surfaceAlt,
                    fontSize: 13, color: selectedService === s ? T.gold : T.ivoryDim,
                    transition: "all 0.15s"
                  }}>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="fade-in">
              <div style={{ fontSize: 14, color: T.ivoryDim, marginBottom: 14 }}>Choose a date</div>
              <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 16 }}>
                {days.map(d => (
                  <div key={d.full} onClick={() => setSelectedDate(d.full)} style={{
                    flexShrink: 0, width: 48, textAlign: "center", padding: "8px 0", borderRadius: 8, cursor: "pointer",
                    border: `1px solid ${selectedDate === d.full ? T.gold : T.border}`,
                    background: selectedDate === d.full ? "rgba(201,150,63,0.08)" : T.surfaceAlt
                  }}>
                    <div style={{ fontSize: 10, color: T.ivoryMuted }}>{d.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: selectedDate === d.full ? T.gold : T.ivory }}>{d.day}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 14, color: T.ivoryDim, marginBottom: 12 }}>Choose a time</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {times.map(t => (
                  <div key={t} onClick={() => setSelectedTime(t)} style={{
                    padding: "8px 4px", textAlign: "center", borderRadius: 6, cursor: "pointer",
                    border: `1px solid ${selectedTime === t ? T.gold : T.border}`,
                    background: selectedTime === t ? "rgba(201,150,63,0.08)" : T.surfaceAlt,
                    fontSize: 12, color: selectedTime === t ? T.gold : T.ivoryDim
                  }}>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 14, color: T.ivoryDim, marginBottom: 4 }}>Almost there — your details</div>
              <input placeholder="Full name" />
              <input placeholder="Email address" type="email" />
              <input placeholder="Phone number" type="tel" />
            </div>
          )}

          {step === 4 && (
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ padding: "14px", borderRadius: 8, background: T.surfaceAlt, border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 12, color: T.ivoryMuted, marginBottom: 4 }}>Booking Summary</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{selectedService || "Hair Cut"}</div>
                <div style={{ fontSize: 13, color: T.ivoryDim }}>{selectedDate || "Sat, Jun 13"} at {selectedTime || "3:30 PM"}</div>
                <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: T.ivoryDim }}>Deposit required</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.gold }}>$20.00</span>
                </div>
              </div>
              <input placeholder="Card number" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input placeholder="MM / YY" />
                <input placeholder="CVC" />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", gap: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(74,154,106,0.12)", border: `1px solid ${T.safe}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Check size={24} color={T.safe} />
              </div>
              <div>
                <div className="serif" style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Booking Confirmed</div>
                <div style={{ fontSize: 14, color: T.ivoryDim, lineHeight: 1.6 }}>
                  {selectedService || "Hair Cut"} on {selectedDate || "Sat, Jun 13"} at {selectedTime || "3:30 PM"}.<br />
                  A confirmation has been sent to your email.
                </div>
              </div>
              <button className="btn-ghost" style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                <Download size={13} /> Add to Calendar
              </button>
            </div>
          )}
        </div>

        {/* Widget Footer */}
        <div style={{ padding: "14px 20px", borderTop: `1px solid ${T.border}`, background: T.surfaceAlt }}>
          {step === 0 ? (
            <div style={{ display: "flex", gap: 8 }}>
              <input
                placeholder="Type your request..."
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                style={{ flex: 1, padding: "8px 12px", fontSize: 13 }}
              />
              <button className="btn-gold" style={{ padding: "8px 14px", flexShrink: 0 }} onClick={sendMessage}>
                <Send size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
              {step > 0 && step < 5 && (
                <button className="btn-ghost" style={{ padding: "9px 18px" }} onClick={() => setStep(s => s - 1)}>Back</button>
              )}
              {step < 5 && (
                <button className="btn-gold" style={{ padding: "9px 24px", marginLeft: "auto" }} onClick={() => setStep(s => s + 1)}>
                  {step === 4 ? "Confirm & Pay" : "Continue"}
                </button>
              )}
              {step === 5 && (
                <button className="btn-ghost" style={{ width: "100%" }} onClick={() => { setStep(0); setSelectedService(""); setSelectedDate(null); setSelectedTime(""); }}>
                  Book Another
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE 4: CLIENTS ───────────────────────────────────────────────────────

function ClientsPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [riskFilter, setRiskFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  useEffect(() => { setTimeout(() => setLoading(false), 900); }, []);

  const filtered = CLIENTS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.service.toLowerCase().includes(search.toLowerCase());
    const matchRisk = riskFilter === "all" || (riskFilter === "high" && c.riskScore >= 65) || (riskFilter === "med" && c.riskScore >= 35 && c.riskScore < 65) || (riskFilter === "low" && c.riskScore < 35);
    return matchSearch && matchRisk;
  });

  const clientHistory = [
    { date: "Jun 7", service: "Hair Cut", paid: "$85", status: "completed" },
    { date: "May 22", service: "Blowout", paid: "$65", status: "completed" },
    { date: "May 8", service: "Color Treatment", paid: "$120", status: "completed" },
    { date: "Apr 24", service: "Hair Cut", paid: "$85", status: "no-show" },
  ];

  return (
    <div style={{ padding: "28px", display: "flex", gap: 20, maxWidth: 1300, margin: "0 auto" }}>

      {/* Main Table */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 className="serif" style={{ fontSize: 24, fontWeight: 700 }}>Clients</h2>
            <div style={{ fontSize: 13, color: T.ivoryMuted }}>8 total</div>
          </div>
          <button className="btn-gold" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={14} /> Add Client
          </button>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.ivoryMuted }} />
            <input placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 34 }} />
          </div>
          <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} style={{ width: 150 }}>
            <option value="all">All Risk Levels</option>
            <option value="high">High Risk</option>
            <option value="med">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              {Array(5).fill(0).map((_, i) => <div key={i} style={{ height: 48, borderRadius: 6 }} className="skeleton" />)}
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Appointments</th>
                  <th>Last Visit</th>
                  <th>No-Shows</th>
                  <th>Risk Score</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} onClick={() => setSelected(c)} style={{ background: selected?.id === c.id ? T.surfaceAlt : "transparent" }}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar initials={c.avatar} size={28} />
                        <div>
                          <div style={{ fontWeight: 500 }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: T.ivoryMuted }}>{c.service}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: T.ivoryDim }}>{c.appointments}</td>
                    <td style={{ color: T.ivoryDim, fontSize: 13 }}>{c.lastVisit}</td>
                    <td>
                      {c.noShows > 0 ? (
                        <span style={{ color: T.risk, fontWeight: 500 }}>{c.noShows}</span>
                      ) : (
                        <span style={{ color: T.safe }}>0</span>
                      )}
                    </td>
                    <td><RiskBadge score={c.riskScore} /></td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: 40, color: T.ivoryMuted }}>
                      <Users size={28} style={{ opacity: 0.3, marginBottom: 8, display: "block", margin: "0 auto 8px" }} />
                      No clients match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Side Panel */}
      {selected && (
        <div className="card fade-in" style={{ width: 300, flexShrink: 0, height: "fit-content", position: "sticky", top: 80 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.ivory }}>Client Profile</div>
            <button className="btn-icon" style={{ width: 26, height: 26 }} onClick={() => setSelected(null)}>
              <X size={12} />
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${T.border}` }}>
            <Avatar initials={selected.avatar} size={44} bg={T.goldDim} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{selected.name}</div>
              <RiskBadge score={selected.riskScore} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {[
              { icon: Mail, val: selected.email },
              { icon: Phone, val: selected.phone },
            ].map(({ icon: Icon, val }) => (
              <div key={val} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: T.ivoryDim }}>
                <Icon size={12} color={T.ivoryMuted} /> {val}
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
            {[
              { label: "Appts", val: selected.appointments },
              { label: "No-Shows", val: selected.noShows },
              { label: "Risk", val: `${selected.riskScore}%` }
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center", padding: 8, background: T.surfaceAlt, borderRadius: 6, border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: T.ivory }}>{s.val}</div>
                <div style={{ fontSize: 10, color: T.ivoryMuted }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: T.ivoryMuted, marginBottom: 8 }}>Appointment History</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {clientHistory.map((h, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 10px", background: T.surfaceAlt, borderRadius: 6, border: `1px solid ${T.border}` }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{h.service}</div>
                  <div style={{ fontSize: 11, color: T.ivoryMuted }}>{h.date}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: T.gold }}>{h.paid}</div>
                  <div style={{ fontSize: 10, color: h.status === "no-show" ? T.risk : T.safe }}>{h.status}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, color: T.ivoryMuted, marginBottom: 8 }}>AI Notes</div>
            <div style={{ fontSize: 12, color: T.ivoryDim, lineHeight: 1.6, background: "rgba(201,150,63,0.05)", padding: 10, borderRadius: 6, border: `1px solid rgba(201,150,63,0.15)` }}>
              Prefers morning slots. Responds well to WhatsApp reminders. High review response rate. Last service feedback was positive — noted sensitivity to heat styling.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PAGE 5: INSIGHTS ──────────────────────────────────────────────────────

function InsightsPage() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = ["8AM", "10AM", "12PM", "2PM", "4PM", "6PM"];

  const getHeatColor = (val) => {
    const opacity = val / 10;
    return `rgba(201, 150, 63, ${opacity})`;
  };

  const noShowData = [
    { name: "Mon", value: 8 }, { name: "Tue", value: 12 }, { name: "Wed", value: 5 },
    { name: "Thu", value: 15 }, { name: "Fri", value: 22 }, { name: "Sat", value: 18 }, { name: "Sun", value: 7 }
  ];

  return (
    <div style={{ padding: "28px", maxWidth: 1300, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 className="serif" style={{ fontSize: 28, fontWeight: 700 }}>AI Insights & Analytics</h2>
        <p style={{ color: T.ivoryDim, fontSize: 14, marginTop: 4 }}>30-day performance overview. Powered by FlowSense AI.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* Revenue Chart */}
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Revenue — Last 30 Days</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={REVENUE_DATA.slice(-14)}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: T.ivoryMuted }} />
              <YAxis tick={{ fontSize: 10, fill: T.ivoryMuted }} />
              <Tooltip contentStyle={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke={T.gold} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* No-Show Risk */}
        <div className="card ai-card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Bot size={13} color={T.gold} />
            <span style={{ fontSize: 13, fontWeight: 600, color: T.gold }}>No-Show Risk by Day</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={noShowData}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: T.ivoryMuted }} />
              <YAxis tick={{ fontSize: 10, fill: T.ivoryMuted }} />
              <Tooltip contentStyle={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12 }} />
              <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                {noShowData.map((entry, i) => (
                  <Cell key={i} fill={entry.value > 18 ? T.risk : entry.value > 12 ? T.gold : T.safe} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Booking Demand Heatmap</div>
        <div style={{ overflowX: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "60px repeat(7, 1fr)", gap: 4, minWidth: 500 }}>
            <div />
            {days.map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: 12, color: T.ivoryMuted, paddingBottom: 6, fontWeight: 500 }}>{d}</div>
            ))}
            {HEATMAP_DATA.map(row => (
              <>
                <div key={row.hour} style={{ fontSize: 11, color: T.ivoryMuted, display: "flex", alignItems: "center" }}>{row.hour}</div>
                {days.map(d => (
                  <div key={d} style={{
                    height: 36, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
                    background: getHeatColor(row[d]),
                    fontSize: 11, color: row[d] > 6 ? T.ivory : T.ivoryDim, fontWeight: row[d] > 8 ? 600 : 400
                  }}>
                    {row[d]}
                  </div>
                ))}
              </>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Table */}
      <div className="card ai-card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Bot size={13} color={T.gold} />
          <span style={{ fontSize: 13, fontWeight: 600, color: T.gold }}>Dynamic Pricing Suggestions</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Time Slot</th>
              <th>Current Price</th>
              <th>AI Recommended</th>
              <th>Revenue Lift</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {PRICING_SUGGESTIONS.map((p, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{p.slot}</td>
                <td style={{ color: T.ivoryDim }}>{p.current}</td>
                <td style={{ color: T.gold, fontWeight: 600 }}>{p.suggested}</td>
                <td>
                  <span style={{ color: p.lift.startsWith("+") ? T.safe : T.risk, fontWeight: 600, fontSize: 12 }}>{p.lift}</span>
                </td>
                <td>
                  <button className="btn-ghost" style={{ padding: "4px 12px", fontSize: 12 }}>Apply</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Follow-up Performance */}
      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Post-Appointment Follow-Up Performance</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
          {[
            { label: "Messages Sent", val: "342", sub: "Last 30 days" },
            { label: "Open Rate", val: "87%", sub: "+4% vs prior month" },
            { label: "Review Requests", val: "198", sub: "Sent automatically" },
            { label: "Review Conversion", val: "31%", sub: "Industry avg: 12%" },
          ].map(m => (
            <div key={m.label} style={{ padding: 16, background: T.surfaceAlt, borderRadius: 8, border: `1px solid ${T.border}` }}>
              <div className="serif" style={{ fontSize: 28, fontWeight: 700, color: T.gold }}>{m.val}</div>
              <div style={{ fontSize: 12, fontWeight: 500, marginTop: 4 }}>{m.label}</div>
              <div style={{ fontSize: 11, color: T.ivoryMuted }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: APPOINTMENTS ────────────────────────────────────────────────────

function AppointmentsPage({ setPage }) {
  return (
    <div style={{ padding: "28px", maxWidth: 1300, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 className="serif" style={{ fontSize: 28, fontWeight: 700 }}>Appointments</h2>
          <div style={{ fontSize: 13, color: T.ivoryMuted }}>June 2026</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }} onClick={() => setPage("widget")}>
            <Bot size={13} /> AI Booking Widget
          </button>
          <button className="btn-gold" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={13} /> New Appointment
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-icon"><ChevronLeft size={14} /></button>
            <button className="btn-icon"><ChevronRight size={14} /></button>
          </div>
          <div style={{ fontSize: 13, color: T.ivoryDim }}>June 9–15, 2026</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Client</th>
              <th>Service</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Risk</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {APPOINTMENTS_TODAY.map(a => (
              <tr key={a.id}>
                <td style={{ fontWeight: 500, color: T.gold }}>{a.time}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Avatar initials={a.client.split(" ").map(n => n[0]).join("")} size={26} />
                    {a.client}
                  </div>
                </td>
                <td style={{ color: T.ivoryDim }}>{a.service}</td>
                <td style={{ color: T.ivoryDim }}>{a.duration}m</td>
                <td>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                    background: a.status === "confirmed" ? "rgba(74,154,106,0.12)" : "rgba(201,150,63,0.12)",
                    color: a.status === "confirmed" ? "#6ABE8A" : T.goldLight,
                    border: `1px solid ${a.status === "confirmed" ? "rgba(74,154,106,0.25)" : "rgba(201,150,63,0.25)"}`
                  }}>
                    {a.status}
                  </span>
                </td>
                <td>
                  {a.risk ? <span className="risk-badge-high">High</span> : <span className="risk-badge-low">Low</span>}
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn-icon"><Edit size={12} /></button>
                    <button className="btn-icon"><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── PAGE: SETTINGS ────────────────────────────────────────────────────────

function SettingsPage() {
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ padding: "28px", maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h2 className="serif" style={{ fontSize: 28, fontWeight: 700 }}>Settings</h2>
        <p style={{ color: T.ivoryDim, fontSize: 14, marginTop: 4 }}>Manage your business profile and preferences.</p>
      </div>

      {[
        {
          title: "Business Profile",
          fields: [
            { label: "Business Name", placeholder: "Lumière Studio", type: "text" },
            { label: "Contact Email", placeholder: "hello@lumiere.studio", type: "email" },
            { label: "Phone", placeholder: "+1 555-0100", type: "tel" },
          ]
        },
        {
          title: "Booking Preferences",
          fields: [
            { label: "Booking Window (days ahead)", placeholder: "30", type: "number" },
            { label: "Minimum Notice (hours)", placeholder: "24", type: "number" },
            { label: "Default Deposit Amount", placeholder: "$20", type: "text" },
          ]
        },
        {
          title: "AI Features",
          fields: [
            { label: "No-Show Risk Threshold (%)", placeholder: "65", type: "number" },
            { label: "Peak Pricing Increase Limit (%)", placeholder: "20", type: "number" },
          ]
        }
      ].map(section => (
        <div key={section.title} className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: T.gold }}>{section.title}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {section.fields.map(f => (
              <div key={f.label}>
                <div style={{ fontSize: 12, color: T.ivoryMuted, marginBottom: 6 }}>{f.label}</div>
                <input type={f.type} placeholder={f.placeholder} />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <button className="btn-ghost">Cancel</button>
        <button className="btn-gold" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
          {saved ? "Saved ✓" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("landing");
  const [darkMode, setDarkMode] = useState(true);

  const isApp = page !== "landing";

  return (
    <>
      <style>{globalCSS}</style>
      <div style={{ minHeight: "100vh", background: T.bg }}>
        {isApp && (
          <TopNav activePage={page} setPage={setPage} darkMode={darkMode} setDarkMode={setDarkMode} />
        )}
        <div key={page} className="page-enter">
          {page === "landing" && <LandingPage setPage={setPage} />}
          {page === "dashboard" && <DashboardPage setPage={setPage} />}
          {page === "widget" && <WidgetPage />}
          {page === "clients" && <ClientsPage />}
          {page === "insights" && <InsightsPage />}
          {page === "appointments" && <AppointmentsPage setPage={setPage} />}
          {page === "settings" && <SettingsPage />}
        </div>
      </div>
    </>
  );
}