import { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import {
  Calendar, Users, TrendingUp, AlertTriangle, Check, X, Search,
  Bell, Settings, LayoutDashboard, BarChart2, ArrowRight,
  Zap, Bot, DollarSign, Phone, Mail, Moon, Sun,
  Plus, Edit, Trash2, Download, Send, RefreshCw, Menu,
  ChevronLeft, ChevronRight, MessageSquare
} from "lucide-react";

// ─── HOOK ────────────────────────────────────────────────────────────────────

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const SERVICES = ["Hair Cut", "Color Treatment", "Deep Tissue Massage", "Consulting Session", "Personal Training", "Therapy Session", "Blowout", "Facial"];

const CLIENTS = [
  { id: 1, name: "Amara Osei", avatar: "AO", appointments: 14, lastVisit: "Jun 7", noShows: 0, riskScore: 12, email: "amara@example.com", phone: "+1 555-0101", service: "Hair Cut" },
  { id: 2, name: "James Whitfield", avatar: "JW", appointments: 8, lastVisit: "May 29", noShows: 2, riskScore: 74, email: "james@example.com", phone: "+1 555-0102", service: "Consulting" },
  { id: 3, name: "Priya Nair", avatar: "PN", appointments: 22, lastVisit: "Jun 5", noShows: 1, riskScore: 28, email: "priya@example.com", phone: "+1 555-0103", service: "Therapy" },
  { id: 4, name: "Marcus Bell", avatar: "MB", appointments: 6, lastVisit: "Apr 15", noShows: 3, riskScore: 89, email: "marcus@example.com", phone: "+1 555-0104", service: "Training" },
  { id: 5, name: "Sophie Laurent", avatar: "SL", appointments: 19, lastVisit: "Jun 9", noShows: 0, riskScore: 8, email: "sophie@example.com", phone: "+1 555-0105", service: "Color" },
  { id: 6, name: "Kwame Asante", avatar: "KA", appointments: 11, lastVisit: "Jun 1", noShows: 1, riskScore: 41, email: "kwame@example.com", phone: "+1 555-0106", service: "Massage" },
  { id: 7, name: "Elena Vasquez", avatar: "EV", appointments: 31, lastVisit: "Jun 8", noShows: 0, riskScore: 5, email: "elena@example.com", phone: "+1 555-0107", service: "Facial" },
  { id: 8, name: "Raj Patel", avatar: "RP", appointments: 4, lastVisit: "May 10", noShows: 2, riskScore: 68, email: "raj@example.com", phone: "+1 555-0108", service: "Consulting" },
];

const APPTS = [
  { id: 1, client: "Amara Osei", service: "Hair Cut", time: "9:00 AM", duration: 60, risk: false, status: "confirmed", color: "#C9963F" },
  { id: 2, client: "James Whitfield", service: "Consulting", time: "10:30 AM", duration: 45, risk: true, status: "confirmed", color: "#7C6A8E" },
  { id: 3, client: "Priya Nair", service: "Therapy Session", time: "11:30 AM", duration: 60, risk: false, status: "confirmed", color: "#4A8A7C" },
  { id: 4, client: "Marcus Bell", service: "Personal Training", time: "1:00 PM", duration: 60, risk: true, status: "pending", color: "#8E4A4A" },
  { id: 5, client: "Sophie Laurent", service: "Color Treatment", time: "2:30 PM", duration: 90, risk: false, status: "confirmed", color: "#4A6A8E" },
  { id: 6, client: "Elena Vasquez", service: "Facial", time: "4:00 PM", duration: 60, risk: false, status: "confirmed", color: "#6A8E4A" },
];

const REVENUE_DATA = Array.from({ length: 14 }, (_, i) => ({
  day: `Jun ${i + 1}`,
  revenue: Math.floor(Math.random() * 800 + 400),
}));

const HEATMAP_DATA = [
  { hour: "8AM", Mon: 3, Tue: 5, Wed: 4, Thu: 6, Fri: 8, Sat: 9, Sun: 2 },
  { hour: "10AM", Mon: 7, Tue: 8, Wed: 9, Thu: 7, Fri: 10, Sat: 10, Sun: 4 },
  { hour: "12PM", Mon: 5, Tue: 6, Wed: 5, Thu: 8, Fri: 9, Sat: 8, Sun: 3 },
  { hour: "2PM", Mon: 8, Tue: 7, Wed: 8, Thu: 9, Fri: 10, Sat: 7, Sun: 5 },
  { hour: "4PM", Mon: 9, Tue: 10, Wed: 9, Thu: 10, Fri: 10, Sat: 6, Sun: 3 },
  { hour: "6PM", Mon: 6, Tue: 7, Wed: 6, Thu: 8, Fri: 7, Sat: 4, Sun: 2 },
];

const PRICING = [
  { slot: "Friday 4:00 PM", current: "$85", suggested: "$98", lift: "+15.3%" },
  { slot: "Saturday 10:00 AM", current: "$85", suggested: "$102", lift: "+20.0%" },
  { slot: "Monday 9:00 AM", current: "$85", suggested: "$72", lift: "-15.3%" },
  { slot: "Tuesday 1:00 PM", current: "$65", suggested: "$75", lift: "+15.4%" },
  { slot: "Wednesday 3:00 PM", current: "$65", suggested: "$56", lift: "-13.8%" },
  { slot: "Thursday 5:00 PM", current: "$85", suggested: "$95", lift: "+11.8%" },
];

const CHAT_INIT = [
  { role: "ai", text: "Hi! I'm the FlowSense booking assistant. What service are you looking for today?" },
  { role: "user", text: "I need a haircut Saturday afternoon, around 2 or 3pm" },
  { role: "ai", text: "I have openings Saturday at 2:00 PM and 3:30 PM with Alex. Both are 45 minutes. Which works?" },
  { role: "user", text: "3:30 works perfectly" },
  { role: "ai", text: "Saturday Jun 13 at 3:30 PM — Hair Cut, $85. A $20 deposit is required. What's your name and email?" },
];

// ─── TOKENS ───────────────────────────────────────────────────────────────────

const T = {
  bg: "#0F0E0D", surface: "#161511", surfaceAlt: "#1C1B17", surfaceHover: "#222019",
  border: "#2A2820", borderLight: "#3A3830",
  gold: "#C9963F", goldLight: "#E5B86A", goldDim: "#8A6428",
  ivory: "#F0EBE1", ivoryDim: "#B8B0A4", ivoryMuted: "#706860",
  slate: "#2A3040", risk: "#D94040", safe: "#4A9A6A", info: "#4A7AAA",
};

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
  html { font-size: 16px; }
  body {
    background:${T.bg}; color:${T.ivory};
    font-family:'DM Sans',sans-serif; font-weight:400; line-height:1.6;
    -webkit-font-smoothing:antialiased; overflow-x:hidden;
  }
  ::-webkit-scrollbar { width:4px; height:4px; }
  ::-webkit-scrollbar-track { background:${T.surface}; }
  ::-webkit-scrollbar-thumb { background:${T.goldDim}; border-radius:2px; }
  .serif { font-family:'Playfair Display',serif; }

  @keyframes goldPulse {
    0%,100% { box-shadow:0 0 0 0 rgba(201,150,63,0); }
    50%      { box-shadow:0 0 14px 3px rgba(201,150,63,0.18), 0 0 28px 6px rgba(201,150,63,0.07); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position:-200px 0; }
    100% { background-position:calc(200px + 100%) 0; }
  }
  @keyframes dotBounce {
    0%,80%,100% { transform:scale(0.55); opacity:0.35; }
    40%         { transform:scale(1);    opacity:1; }
  }
  .ai-card {
    animation:goldPulse 3s ease-in-out infinite;
    border:1px solid rgba(201,150,63,0.28) !important;
  }
  .fade-in { animation:fadeUp 0.35s ease both; }
  .skeleton {
    background:linear-gradient(90deg,${T.surface} 25%,${T.surfaceAlt} 50%,${T.surface} 75%);
    background-size:200px 100%; animation:shimmer 1.5s infinite; border-radius:4px;
  }
  .btn-gold {
    background:${T.gold}; color:${T.bg}; border:none;
    padding:10px 22px; border-radius:6px;
    font-family:'DM Sans',sans-serif; font-weight:600; font-size:14px;
    cursor:pointer; transition:background .2s,transform .1s; letter-spacing:.02em;
    white-space:nowrap;
  }
  .btn-gold:hover  { background:${T.goldLight}; transform:translateY(-1px); }
  .btn-gold:active { transform:translateY(0); }
  .btn-ghost {
    background:transparent; color:${T.ivoryDim};
    border:1px solid ${T.border}; padding:10px 22px; border-radius:6px;
    font-family:'DM Sans',sans-serif; font-weight:500; font-size:14px;
    cursor:pointer; transition:all .2s; white-space:nowrap;
  }
  .btn-ghost:hover { border-color:${T.gold}; color:${T.gold}; }
  .btn-icon {
    background:${T.surfaceAlt}; color:${T.ivoryDim};
    border:1px solid ${T.border}; width:36px; height:36px; border-radius:6px;
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:all .2s; flex-shrink:0;
  }
  .btn-icon:hover { border-color:${T.gold}; color:${T.gold}; background:${T.surfaceHover}; }
  .nav-link {
    color:${T.ivoryDim}; text-decoration:none; font-size:14px; font-weight:500;
    padding:6px 12px; border-radius:6px; cursor:pointer;
    transition:all .2s; white-space:nowrap;
  }
  .nav-link:hover  { color:${T.ivory}; background:${T.surfaceAlt}; }
  .nav-link.active { color:${T.gold}; background:rgba(201,150,63,.08); }
  .card {
    background:${T.surface}; border:1px solid ${T.border};
    border-radius:10px; padding:20px; transition:border-color .2s;
  }
  .card:hover { border-color:${T.borderLight}; }
  .risk-h { background:rgba(217,64,64,.12);   color:#F07070; border:1px solid rgba(217,64,64,.25);  padding:2px 8px; border-radius:4px; font-size:11px; font-weight:600; }
  .risk-m { background:rgba(201,150,63,.12);  color:${T.goldLight}; border:1px solid rgba(201,150,63,.25); padding:2px 8px; border-radius:4px; font-size:11px; font-weight:600; }
  .risk-l { background:rgba(74,154,106,.12);  color:#6ABE8A; border:1px solid rgba(74,154,106,.25); padding:2px 8px; border-radius:4px; font-size:11px; font-weight:600; }
  input, select, textarea {
    background:${T.surfaceAlt}; border:1px solid ${T.border};
    color:${T.ivory}; padding:10px 14px; border-radius:6px;
    font-family:'DM Sans',sans-serif; font-size:14px; outline:none;
    transition:border-color .2s; width:100%;
  }
  input:focus, select:focus, textarea:focus { border-color:${T.gold}; }
  input::placeholder, textarea::placeholder { color:${T.ivoryMuted}; }
  .dot-t span {
    display:inline-block; width:6px; height:6px; border-radius:50%;
    background:${T.gold}; margin:0 2px;
    animation:dotBounce 1.4s infinite ease-in-out;
  }
  .dot-t span:nth-child(2) { animation-delay:.2s; }
  .dot-t span:nth-child(3) { animation-delay:.4s; }
  .page-enter { animation:fadeUp .32s ease both; }

  /* ── RESPONSIVE HELPERS ── */
  .hide-mobile  { display:initial; }
  .show-mobile  { display:none; }
  @media (max-width:767px) {
    .hide-mobile { display:none !important; }
    .show-mobile { display:flex !important; }
    .card { padding:14px; }
    .btn-gold, .btn-ghost { padding:9px 16px; font-size:13px; }
  }
`;

// ─── UTILITY ──────────────────────────────────────────────────────────────────

function RiskBadge({ score }) {
  if (score >= 65) return <span className="risk-h">High</span>;
  if (score >= 35) return <span className="risk-m">Med</span>;
  return <span className="risk-l">Low</span>;
}

function Avatar({ initials, size = 32, bg = T.slate }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: bg, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * .35, fontWeight: 600, color: T.ivory, border: `1px solid ${T.borderLight}`
    }}>{initials}</div>
  );
}

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className={`card${accent ? " ai-card" : ""}`} style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ color: T.ivoryMuted, fontSize: 11, fontWeight: 500, letterSpacing: ".04em" }}>{label}</div>
        <Icon size={15} color={accent ? T.gold : T.ivoryMuted} />
      </div>
      <div className="serif" style={{ fontSize: 28, fontWeight: 700, color: accent ? T.gold : T.ivory, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: T.ivoryMuted, marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

// ─── TOP NAV ──────────────────────────────────────────────────────────────────

function TopNav({ active, setPage, dark, setDark }) {
  const isMobile = useIsMobile();
  const [menuOpen, setMenu] = useState(false);

  const links = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "clients", label: "Clients", icon: Users },
    { id: "insights", label: "AI Insights", icon: BarChart2 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav style={{
      background: T.surface, borderBottom: `1px solid ${T.border}`,
      padding: "0 16px", display: "flex", alignItems: "center",
      height: 56, position: "sticky", top: 0, zIndex: 200, gap: 8
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginRight: 8 }}
        onClick={() => { setPage("landing"); setMenu(false); }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: T.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Zap size={14} color={T.bg} />
        </div>
        <span className="serif" style={{ fontSize: 15, fontWeight: 700 }}>FlowSense</span>
      </div>

      {/* Desktop links */}
      {!isMobile && (
        <div style={{ display: "flex", gap: 2, flex: 1, overflowX: "auto" }}>
          {links.map(l => (
            <span key={l.id} className={`nav-link${active === l.id ? " active" : ""}`} onClick={() => setPage(l.id)}>
              {l.label}
            </span>
          ))}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
        <button className="btn-icon" onClick={() => setDark(!dark)}>
          {dark ? <Sun size={13} /> : <Moon size={13} />}
        </button>
        {!isMobile && <button className="btn-icon"><Bell size={13} /></button>}
        {!isMobile && <Avatar initials="OW" size={30} bg={T.goldDim} />}
        {isMobile && (
          <button className="btn-icon" onClick={() => setMenu(o => !o)}>
            <Menu size={15} />
          </button>
        )}
      </div>

      {/* Mobile dropdown */}
      {isMobile && menuOpen && (
        <div style={{
          position: "fixed", top: 56, left: 0, right: 0, bottom: 0,
          background: `${T.bg}F4`, zIndex: 199, display: "flex", flexDirection: "column",
          padding: "8px 0", borderTop: `1px solid ${T.border}`
        }}>
          {links.map(l => (
            <div key={l.id}
              onClick={() => { setPage(l.id); setMenu(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "14px 20px", cursor: "pointer",
                background: active === l.id ? "rgba(201,150,63,.07)" : "transparent",
                color: active === l.id ? T.gold : T.ivoryDim,
                borderBottom: `1px solid ${T.border}`, fontSize: 15, fontWeight: 500
              }}>
              <l.icon size={16} /> {l.label}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── LANDING ──────────────────────────────────────────────────────────────────

function Landing({ setPage }) {
  const isMobile = useIsMobile();
  const [activeF, setActiveF] = useState(0);
  const [navOpen, setNavOpen] = useState(false);

  // Helper function to handle smooth scrolling safely
  const scrollToSection = (id) => {
    setNavOpen(false); // Close mobile menu if open
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const competitors = [
    { name: "Calendly", price: "$10–$16/mo", flaw: "Meetings only. No payments or service logic." },
    { name: "Acuity", price: "$20–$46/mo", flaw: "Owned by Squarespace. Rigid, limited AI." },
    { name: "Square Appts", price: "$0–$69/mo", flaw: "Payment-first. Poor customization." },
    { name: "Setmore", price: "$0–$12/mo", flaw: "Feature-basic. No real AI." },
    { name: "Zoho Bookings", price: "$6/mo", flaw: "Clunky UX. No predictive features." },
  ];

  const features = [
    { icon: Bot, title: "Conversational AI Booking", desc: "Clients book via website widget, WhatsApp, or SMS in plain language. The AI handles availability, service selection, and rescheduling in real time." },
    { icon: AlertTriangle, title: "No-Show Prediction Engine", desc: "Flags high-risk bookings using client history, service type, and time patterns. Auto-sends targeted reminders or requires a deposit before confirmation." },
    { icon: TrendingUp, title: "Dynamic Pricing", desc: "Recommends 10–20% price increases on peak slots and discounts for slow periods. Revenue optimization without touching a spreadsheet." },
    { icon: RefreshCw, title: "Smart Waitlist Management", desc: "When a slot opens, re-books the best-matched waitlisted client based on service fit — not just queue position." },
    { icon: MessageSquare, title: "Post-Appointment Follow-Up", desc: "Sends personalized thank-you messages, care tips, and review requests tailored to the specific service received." },
  ];

  const plans = [
    { name: "Starter", price: "$19", features: ["AI chat booking", "Online payments", "Automated reminders", "Basic analytics"], cta: "Start Free Trial", hi: false },
    { name: "Pro", price: "$39", features: ["Everything in Starter", "No-show prediction", "Smart waitlist AI", "Client risk scores"], cta: "Start Free Trial", hi: true },
    { name: "Premium", price: "$79", features: ["Everything in Pro", "Dynamic pricing AI", "WhatsApp + SMS", "Custom branding"], cta: "Book a Demo", hi: false },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>

      {/* Marketing Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "14px 16px" : "14px 48px",
        borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0,
        background: `${T.bg}EE`, backdropFilter: "blur(10px)", zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 6, background: T.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={14} color={T.bg} />
          </div>
          <span className="serif" style={{ fontSize: 17, fontWeight: 700 }}>FlowSense AI</span>
        </div>
        {isMobile ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-gold" style={{ padding: "7px 14px", fontSize: 12 }} onClick={() => setPage("dashboard")}>Try Free</button>
            <button className="btn-icon" onClick={() => setNavOpen(o => !o)}><Menu size={14} /></button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {/* Added onClick actions targeting section IDs */}
            <span className="nav-link" onClick={() => scrollToSection("features")}>Features</span>
            <span className="nav-link" onClick={() => scrollToSection("pricing")}>Pricing</span>
            <span className="nav-link" onClick={() => scrollToSection("about")}>About</span>
            <button className="btn-ghost" style={{ padding: "8px 16px" }} onClick={() => setPage("dashboard")}>Sign In</button>
            <button className="btn-gold" onClick={() => setPage("dashboard")}>Start Free Trial</button>
          </div>
        )}
      </nav>

      {/* Mobile nav sheet */}
      {isMobile && navOpen && (
        <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "8px 0" }}>
          <div onClick={() => scrollToSection("features")} style={{ padding: "12px 20px", color: T.ivoryDim, fontSize: 15, borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}>Features</div>
          <div onClick={() => scrollToSection("pricing")} style={{ padding: "12px 20px", color: T.ivoryDim, fontSize: 15, borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}>Pricing</div>
          <div onClick={() => scrollToSection("about")} style={{ padding: "12px 20px", color: T.ivoryDim, fontSize: 15, borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}>About</div>
          <div style={{ padding: "12px 20px" }}>
            <button className="btn-gold" style={{ width: "100%", textAlign: "center" }} onClick={() => setPage("dashboard")}>Start Free Trial</button>
          </div>
        </div>
      )}

      {/* Hero / About Context Target */}
      <section id="about" style={{
        minHeight: "88vh", display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", textAlign: "center",
        padding: isMobile ? "60px 16px 40px" : "80px 24px",
        background: "radial-gradient(ellipse 80% 55% at 50% 0%,rgba(201,150,63,.07) 0%,transparent 70%)"
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(201,150,63,.08)", border: "1px solid rgba(201,150,63,.2)",
          borderRadius: 20, padding: "4px 14px", fontSize: 11, color: T.gold,
          fontWeight: 600, letterSpacing: ".06em", marginBottom: 28
        }}>
          <Zap size={10} /> AI-NATIVE SCHEDULING
        </div>
        <h1 className="serif" style={{
          fontSize: isMobile ? 32 : "clamp(44px,7vw,88px)",
          fontWeight: 700, lineHeight: 1.1, maxWidth: 860, marginBottom: 20
        }}>
          Book, pay, show up —<br />
          <span style={{ color: T.gold, fontStyle: "italic" }}>without touching a calendar.</span>
        </h1>
        <p style={{ fontSize: isMobile ? 14 : 17, color: T.ivoryDim, maxWidth: 520, marginBottom: 36, lineHeight: 1.75 }}>
          Service businesses lose 5–10 hours every week to scheduling chaos. FlowSense ends that automatically.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
          <button className="btn-gold" style={{ padding: "13px 28px", fontSize: 14, width: isMobile ? "100%" : "auto" }} onClick={() => setPage("dashboard")}>
            Start Free — No Credit Card
          </button>
          <button className="btn-ghost" style={{ padding: "13px 22px", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: isMobile ? "100%" : "auto" }}
            onClick={() => setPage("widget")}>
            See Booking Widget <ArrowRight size={13} />
          </button>
        </div>
        <div style={{ display: "flex", gap: isMobile ? 16 : 40, marginTop: 52, flexWrap: "wrap", justifyContent: "center" }}>
          {[["2,400+", "Businesses"], ["$18M+", "Revenue Booked"], ["94%", "Fewer No-Shows"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center", minWidth: isMobile ? "100px" : "auto" }}>
              <div className="serif" style={{ fontSize: isMobile ? 24 : 32, fontWeight: 700, color: T.gold }}>{v}</div>
              <div style={{ fontSize: 11, color: T.ivoryMuted }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Competitors Segment */}
      <section style={{ padding: isMobile ? "48px 16px" : "72px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: T.gold, fontWeight: 600, letterSpacing: ".1em", marginBottom: 10 }}>THE COMPETITION</div>
          <h2 className="serif" style={{ fontSize: isMobile ? 26 : 40, fontWeight: 700, lineHeight: 1.2 }}>Everyone else built for meetings.</h2>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 12
        }}>
          {competitors.map(c => (
            <div key={c.name} className="card" style={{ padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                <X size={13} color={T.risk} />
              </div>
              <div style={{ fontSize: 11, color: T.gold, marginBottom: 6 }}>{c.price}</div>
              <div style={{ fontSize: 12, color: T.ivoryMuted, lineHeight: 1.5 }}>{c.flaw}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{ marginTop: 16, border: "1px solid rgba(201,150,63,.3)", background: "rgba(201,150,63,.04)", textAlign: "center", padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <Check size={15} color={T.gold} />
            <span className="serif" style={{ fontSize: 16, fontWeight: 600 }}>FlowSense AI — $19–$79/mo</span>
          </div>
          <div style={{ fontSize: 13, color: T.ivoryDim, lineHeight: 1.4 }}>AI-native. Payments built in. Predictive engine. No per-client fees.</div>
        </div>
      </section>

      {/* Features Target */}
      <section id="features" style={{ padding: isMobile ? "48px 16px" : "72px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: T.gold, fontWeight: 600, letterSpacing: ".1em", marginBottom: 10 }}>FIVE CORE CAPABILITIES</div>
          <h2 className="serif" style={{ fontSize: isMobile ? 26 : 40, fontWeight: 700, lineHeight: 1.2 }}>Intelligence at every step.</h2>
        </div>

        {isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {features.map((f, i) => (
              <div key={i} className="card" style={{ padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(201,150,63,.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <f.icon size={16} color={T.gold} />
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{f.title}</span>
                </div>
                <p style={{ fontSize: 13, color: T.ivoryDim, lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 260, flexShrink: 0 }}>
              {features.map((f, i) => (
                <div key={i} onClick={() => setActiveF(i)} className="card"
                  style={{
                    cursor: "pointer", padding: "12px 14px",
                    border: `1px solid ${activeF === i ? "rgba(201,150,63,.4)" : T.border}`,
                    background: activeF === i ? "rgba(201,150,63,.06)" : T.surface,
                    display: "flex", alignItems: "center", gap: 10
                  }}>
                  <f.icon size={15} color={activeF === i ? T.gold : T.ivoryMuted} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: activeF === i ? T.ivory : T.ivoryDim }}>{f.title}</span>
                </div>
              ))}
            </div>
            <div className="card ai-card" style={{ flex: 1, padding: 32 }}>
              {(() => {
                const f = features[activeF]; return (
                  <>
                    <div style={{ width: 46, height: 46, borderRadius: 10, background: "rgba(201,150,63,.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                      <f.icon size={20} color={T.gold} />
                    </div>
                    <h3 className="serif" style={{ fontSize: 24, fontWeight: 700, marginBottom: 14 }}>{f.title}</h3>
                    <p style={{ fontSize: 15, color: T.ivoryDim, lineHeight: 1.8 }}>{f.desc}</p>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </section>

      {/* Pricing Target */}
      <section id="pricing" style={{ padding: isMobile ? "48px 16px" : "72px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: T.gold, fontWeight: 600, letterSpacing: ".1em", marginBottom: 10 }}>PRICING</div>
          <h2 className="serif" style={{ fontSize: isMobile ? 26 : 40, fontWeight: 700, lineHeight: 1.2 }}>Simple, flat pricing.</h2>
          <p style={{ color: T.ivoryDim, marginTop: 10, fontSize: 14 }}>No per-client fees. No lock-in. Cancel any time.</p>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: 20,
          alignItems: "start"
        }}>
          {plans.map(p => (
            <div key={p.name} className={`card${p.hi ? " ai-card" : ""}`}
              style={{
                padding: 24, border: `1px solid ${p.hi ? "rgba(201,150,63,.4)" : T.border}`,
                background: p.hi ? "rgba(201,150,63,.04)" : T.surface,
                position: "relative", transform: p.hi && !isMobile ? "translateY(-8px)" : "none",
                marginTop: p.hi && isMobile ? 12 : 0
              }}>
              {p.hi && (
                <div style={{
                  position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)",
                  background: T.gold, color: T.bg, fontSize: 10, fontWeight: 700,
                  padding: "3px 14px", borderRadius: 10, letterSpacing: ".06em"
                }}>MOST POPULAR</div>
              )}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: T.ivoryMuted, marginBottom: 6, fontWeight: 500 }}>{p.name}</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
                  <span className="serif" style={{ fontSize: 40, fontWeight: 700, color: p.hi ? T.gold : T.ivory }}>{p.price}</span>
                  <span style={{ color: T.ivoryMuted, fontSize: 13, paddingBottom: 6 }}>/mo</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: T.ivoryDim }}>
                    <Check size={12} color={T.gold} style={{ flexShrink: 0 }} /> <span style={{ lineHeight: 1.3 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button className={p.hi ? "btn-gold" : "btn-ghost"} style={{ width: "100%", textAlign: "center", padding: "11px" }}
                onClick={() => setPage("dashboard")}>
                {p.hi ? "Start Free Trial" : p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        padding: isMobile ? "56px 16px" : "72px 48px", textAlign: "center",
        background: "linear-gradient(180deg,transparent,rgba(201,150,63,.04))"
      }}>
        <h2 className="serif" style={{ fontSize: isMobile ? 24 : 46, fontWeight: 700, marginBottom: 18, lineHeight: 1.2 }}>
          Your schedule shouldn't run your business.
        </h2>
        <p style={{ color: T.ivoryDim, fontSize: 14, marginBottom: 32, maxWidth: 460, margin: "0 auto 32px", lineHeight: 1.6 }}>
          Set up in under 10 minutes. Starts filling your calendar on day one.
        </p>
        <button className="btn-gold" style={{ padding: "14px 36px", fontSize: 15, width: isMobile ? "100%" : "auto" }} onClick={() => setPage("dashboard")}>
          Get Started Free
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${T.border}`,
        padding: isMobile ? "24px 16px" : "28px 48px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexDirection: isMobile ? "column" : "row", gap: 16
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 4, background: T.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={11} color={T.bg} />
          </div>
          <span className="serif" style={{ fontWeight: 600, fontSize: 14 }}>FlowSense AI</span>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          {["Privacy", "Terms", "Support"].map(l => <span key={l} style={{ fontSize: 12, color: T.ivoryMuted, cursor: "pointer" }}>{l}</span>)}
        </div>
        <div style={{ fontSize: 12, color: T.ivoryMuted }}>© 2026 FlowSense AI</div>
      </footer>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

function Dashboard() {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1100); return () => clearTimeout(t); }, []);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM"];

  const blocks = [
    { day: 0, slot: 0, client: "Amara O.", service: "Hair Cut", color: T.gold, risk: false },
    { day: 0, slot: 2, client: "Priya N.", service: "Therapy", color: "#4A8A7C", risk: false },
    { day: 1, slot: 1, client: "James W.", service: "Consult", color: "#7C6A8E", risk: true },
    { day: 1, slot: 4, client: "Marcus B.", service: "Training", color: "#8E4A4A", risk: true },
    { day: 2, slot: 0, client: "Sophie L.", service: "Color", color: "#4A6A8E", risk: false },
    { day: 3, slot: 2, client: "Kwame A.", service: "Massage", color: "#8E7A4A", risk: false },
    { day: 4, slot: 0, client: "Amara O.", service: "Blowout", color: T.gold, risk: false },
    { day: 4, slot: 3, client: "Elena V.", service: "Facial", color: "#6A8E4A", risk: false },
  ];

  return (
    <div style={{ padding: isMobile ? "16px" : "28px", maxWidth: 1300, margin: "0 auto" }}>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {loading
          ? Array(4).fill(0).map((_, i) => <div key={i} style={{ height: 90, borderRadius: 10 }} className="skeleton" />)
          : <>
            <StatCard icon={Calendar} label="Today's Appts" value="6" sub="2 pending" />
            <StatCard icon={DollarSign} label="Revenue Today" value="$486" sub="+12% vs last week" accent />
            <StatCard icon={AlertTriangle} label="Risk Alerts" value="3" sub="Deposits recommended" />
            <StatCard icon={Users} label="On Waitlist" value="7" sub="2 match open slots" accent />
          </>
        }
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 300px", gap: 16 }}>

        {/* Calendar */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="serif" style={{ fontSize: 14, fontWeight: 600 }}>Week of June 9–15</span>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="btn-icon" style={{ width: 30, height: 30 }}><ChevronLeft size={13} /></button>
              <button className="btn-icon" style={{ width: 30, height: 30 }}><ChevronRight size={13} /></button>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: `52px repeat(7,1fr)`, minWidth: isMobile ? 520 : 0 }}>
              <div style={{ background: T.surfaceAlt }} />
              {weekDays.map((d, i) => (
                <div key={d} style={{
                  padding: "8px 4px", textAlign: "center", borderLeft: `1px solid ${T.border}`,
                  background: i === 1 ? "rgba(201,150,63,.05)" : T.surfaceAlt,
                  fontSize: 11, color: i === 1 ? T.gold : T.ivoryMuted, fontWeight: 500
                }}>
                  <div>{d}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: i === 1 ? T.gold : T.ivory }}>{9 + i}</div>
                </div>
              ))}
              {hours.map((h, hi) => weekDays.map((d, di) => {
                const first = hi === 0 && di === 0;
                const block = blocks.find(b => b.day === di && b.slot === hi);
                return first ? [
                  <div key={`lbl${hi}`} style={{ padding: "0 6px", display: "flex", alignItems: "center", height: 52, fontSize: 10, color: T.ivoryMuted, borderTop: `1px solid ${T.border}` }}>{h}</div>,
                  <div key={`${h}${d}`} style={{ height: 52, borderLeft: `1px solid ${T.border}`, borderTop: `1px solid ${T.border}`, padding: 3, background: di === 1 ? "rgba(201,150,63,.02)" : "transparent" }}>
                    {block && <ApptBlock b={block} />}
                  </div>
                ] : [
                  ...(di === 0 ? [<div key={`lbl${hi}${di}`} style={{ padding: "0 6px", display: "flex", alignItems: "center", height: 52, fontSize: 10, color: T.ivoryMuted, borderTop: `1px solid ${T.border}` }}></div>] : []),
                  <div key={`${h}${d}`} style={{ height: 52, borderLeft: `1px solid ${T.border}`, borderTop: `1px solid ${T.border}`, padding: 3, background: di === 1 ? "rgba(201,150,63,.02)" : "transparent" }}>
                    {block && <ApptBlock b={block} />}
                  </div>
                ];
              }).flat())}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* AI Insights */}
          <div className="card ai-card">
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
              <Bot size={13} color={T.gold} />
              <span style={{ fontSize: 12, color: T.gold, fontWeight: 600, letterSpacing: ".04em" }}>AI INSIGHTS</span>
            </div>
            {[
              { icon: TrendingUp, text: "Friday 4PM at 94% booking rate — +15% pricing is ready.", c: T.gold },
              { icon: AlertTriangle, text: "3 appointments tomorrow flagged high risk.", c: T.risk },
              { icon: Users, text: "2 waitlisted clients match Tuesday 2PM opening.", c: T.info },
            ].map((ins, i) => (
              <div key={i} style={{ display: "flex", gap: 9, padding: "9px 11px", borderRadius: 7, background: `${ins.c}0D`, border: `1px solid ${ins.c}22`, marginBottom: i < 2 ? 8 : 0 }}>
                <ins.icon size={12} color={ins.c} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 12, color: T.ivoryDim, lineHeight: 1.55 }}>{ins.text}</span>
              </div>
            ))}
          </div>

          {/* Today's schedule */}
          <div className="card" style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12 }}>Today's Schedule</div>
            {loading
              ? Array(4).fill(0).map((_, i) => <div key={i} style={{ height: 42, borderRadius: 6, marginBottom: 8 }} className="skeleton" />)
              : APPTS.slice(0, 5).map(a => (
                <div key={a.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "8px 10px", borderRadius: 7, marginBottom: 7,
                  background: T.surfaceAlt, border: `1px solid ${a.risk ? T.risk + "33" : T.border}`
                }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ width: 3, height: 28, borderRadius: 2, background: a.color, flexShrink: 0 }} />
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
              ))
            }
          </div>
        </div>
      </div>

      {/* Activity feed */}
      <div className="card" style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 14 }}>Recent Activity</div>
        {[
          { av: "EV", client: "Elena Vasquez", action: "Booked Facial via WhatsApp", time: "12 min ago" },
          { av: "SL", client: "Sophie Laurent", action: "Paid $85 deposit — Color Treatment confirmed", time: "34 min ago" },
          { av: "AO", client: "Amara Osei", action: "Left a 5-star review after Hair Cut", time: "1 hr ago" },
          { av: "MB", client: "Marcus Bell", action: "AI flagged high no-show risk — reminder sent", time: "2 hrs ago" },
        ].map((a, i, arr) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : "none", flexWrap: "wrap" }}>
            <Avatar initials={a.av} size={30} />
            <div style={{ flex: 1, minWidth: 140 }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{a.client}</span>
              <span style={{ fontSize: 13, color: T.ivoryDim }}> — {a.action}</span>
            </div>
            <span style={{ fontSize: 11, color: T.ivoryMuted, flexShrink: 0 }}>{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ApptBlock({ b }) {
  return (
    <div style={{
      background: `${b.color}22`, border: `1px solid ${b.color}55`,
      borderRadius: 4, padding: "3px 5px", height: "100%", cursor: "pointer",
      position: "relative", overflow: "hidden"
    }}>
      <div style={{ fontSize: 9, color: b.color, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.client}</div>
      <div style={{ fontSize: 8, color: T.ivoryMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.service}</div>
      {b.risk && <div style={{ position: "absolute", top: 2, right: 2, width: 5, height: 5, borderRadius: "50%", background: T.risk }} />}
    </div>
  );
}

// ─── WIDGET ───────────────────────────────────────────────────────────────────

function Widget() {
  const isMobile = useIsMobile();
  const [step, setStep] = useState(0);
  const [msgs, setMsgs] = useState(CHAT_INIT);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [selService, setSelService] = useState("");
  const [selDate, setSelDate] = useState(null);
  const [selTime, setSelTime] = useState("");
  const chatRef = useRef(null);

  const steps = ["Chat", "Service", "Date & Time", "Details", "Payment", "Confirmed"];
  const times = ["9:00 AM", "10:30 AM", "11:00 AM", "1:00 PM", "2:30 PM", "3:30 PM", "4:00 PM", "5:00 PM"];
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(2026, 5, 10 + i);
    return { day: d.getDate(), label: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][d.getDay()], full: `${d.getDate()} Jun` };
  });

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs]);

  const send = () => {
    if (!input.trim()) return;
    setMsgs(m => [...m, { role: "user", text: input }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(m => [...m, { role: "ai", text: "I've found a perfect slot. Let's lock in the details — tap Continue." }]);
      setTimeout(() => setStep(1), 500);
    }, 1500);
  };

  return (
    <div style={{ padding: isMobile ? "16px" : "40px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {!isMobile && (
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: T.gold, fontWeight: 600, letterSpacing: ".1em", marginBottom: 8 }}>BOOKING WIDGET PREVIEW</div>
          <h2 className="serif" style={{ fontSize: 30, fontWeight: 700 }}>Embeddable on any website.</h2>
          <p style={{ color: T.ivoryDim, marginTop: 8, fontSize: 13 }}>What your clients see. Conversational. Fully automated.</p>
        </div>
      )}

      <div style={{
        width: "100%", maxWidth: 440,
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden",
        boxShadow: `0 20px 60px rgba(0,0,0,.5)`
      }}>
        {/* Header */}
        <div style={{ padding: "14px 18px", background: T.surfaceAlt, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: T.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bot size={14} color={T.bg} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>FlowSense Booking</div>
            <div style={{ fontSize: 10, color: T.safe, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.safe, display: "inline-block" }} />
              Online now
            </div>
          </div>
        </div>
        {/* Progress */}
        <div style={{ padding: "10px 16px", display: "flex", gap: 4, borderBottom: `1px solid ${T.border}` }}>
          {steps.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 2, borderRadius: 1, background: i <= step ? T.gold : T.border, transition: "background .3s" }} />
          ))}
        </div>
        {/* Body */}
        <div style={{ height: 340, overflowY: "auto", padding: "14px 16px" }} ref={step === 0 ? chatRef : null}>

          {step === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "82%", padding: "9px 13px",
                    borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                    background: m.role === "user" ? T.gold : T.surfaceAlt,
                    color: m.role === "user" ? T.bg : T.ivory,
                    fontSize: 13, lineHeight: 1.5
                  }}>{m.text}</div>
                </div>
              ))}
              {typing && (
                <div style={{ display: "flex" }}>
                  <div style={{ padding: "9px 13px", borderRadius: "12px 12px 12px 2px", background: T.surfaceAlt }} className="dot-t">
                    <span /><span /><span />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="fade-in">
              <div style={{ fontSize: 13, color: T.ivoryDim, marginBottom: 14 }}>Select a service</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {SERVICES.map(s => (
                  <div key={s} onClick={() => setSelService(s)} style={{
                    padding: "11px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12,
                    border: `1px solid ${selService === s ? T.gold : T.border}`,
                    background: selService === s ? "rgba(201,150,63,.08)" : T.surfaceAlt,
                    color: selService === s ? T.gold : T.ivoryDim, transition: "all .15s"
                  }}>{s}</div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="fade-in">
              <div style={{ fontSize: 13, color: T.ivoryDim, marginBottom: 12 }}>Choose a date</div>
              <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 14 }}>
                {days.map(d => (
                  <div key={d.full} onClick={() => setSelDate(d.full)} style={{
                    flexShrink: 0, width: 44, textAlign: "center", padding: "7px 0", borderRadius: 7, cursor: "pointer",
                    border: `1px solid ${selDate === d.full ? T.gold : T.border}`,
                    background: selDate === d.full ? "rgba(201,150,63,.08)" : T.surfaceAlt
                  }}>
                    <div style={{ fontSize: 9, color: T.ivoryMuted }}>{d.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: selDate === d.full ? T.gold : T.ivory }}>{d.day}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 13, color: T.ivoryDim, marginBottom: 10 }}>Choose a time</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
                {times.map(t => (
                  <div key={t} onClick={() => setSelTime(t)} style={{
                    padding: "7px 2px", textAlign: "center", borderRadius: 6, cursor: "pointer",
                    border: `1px solid ${selTime === t ? T.gold : T.border}`,
                    background: selTime === t ? "rgba(201,150,63,.08)" : T.surfaceAlt,
                    fontSize: 11, color: selTime === t ? T.gold : T.ivoryDim
                  }}>{t}</div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              <div style={{ fontSize: 13, color: T.ivoryDim, marginBottom: 4 }}>Your details</div>
              <input placeholder="Full name" />
              <input placeholder="Email address" type="email" />
              <input placeholder="Phone number" type="tel" />
            </div>
          )}

          {step === 4 && (
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ padding: 13, borderRadius: 8, background: T.surfaceAlt, border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 11, color: T.ivoryMuted, marginBottom: 4 }}>Booking Summary</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{selService || "Hair Cut"}</div>
                <div style={{ fontSize: 12, color: T.ivoryDim }}>{selDate || "Sat, Jun 13"} at {selTime || "3:30 PM"}</div>
                <div style={{ marginTop: 9, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: T.ivoryDim }}>Deposit</span>
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
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(74,154,106,.12)", border: `1px solid ${T.safe}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Check size={22} color={T.safe} />
              </div>
              <div>
                <div className="serif" style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Booking Confirmed</div>
                <div style={{ fontSize: 13, color: T.ivoryDim, lineHeight: 1.65 }}>
                  {selService || "Hair Cut"} on {selDate || "Sat, Jun 13"} at {selTime || "3:30 PM"}.<br />
                  Confirmation sent to your email.
                </div>
              </div>
              <button className="btn-ghost" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <Download size={12} /> Add to Calendar
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${T.border}`, background: T.surfaceAlt }}>
          {step === 0 ? (
            <div style={{ display: "flex", gap: 8 }}>
              <input placeholder="Type your request..." value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()} style={{ flex: 1, padding: "8px 11px", fontSize: 13 }} />
              <button className="btn-gold" style={{ padding: "8px 12px", flexShrink: 0 }} onClick={send}><Send size={13} /></button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              {step > 0 && step < 5 && <button className="btn-ghost" style={{ padding: "8px 16px" }} onClick={() => setStep(s => s - 1)}>Back</button>}
              {step < 5 && (
                <button className="btn-gold" style={{ padding: "8px 20px", marginLeft: "auto" }} onClick={() => setStep(s => s + 1)}>
                  {step === 4 ? "Confirm & Pay" : "Continue"}
                </button>
              )}
              {step === 5 && (
                <button className="btn-ghost" style={{ width: "100%" }} onClick={() => { setStep(0); setSelService(""); setSelDate(null); setSelTime(""); }}>
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

// ─── CLIENTS ──────────────────────────────────────────────────────────────────

function Clients() {
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [sel, setSel] = useState(null);
  const [risk, setRisk] = useState("all");
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 800); return () => clearTimeout(t); }, []);

  const filtered = CLIENTS.filter(c => {
    const ms = c.name.toLowerCase().includes(search.toLowerCase()) || c.service.toLowerCase().includes(search.toLowerCase());
    const mr = risk === "all" || (risk === "high" && c.riskScore >= 65) || (risk === "med" && c.riskScore >= 35 && c.riskScore < 65) || (risk === "low" && c.riskScore < 35);
    return ms && mr;
  });

  const hist = [
    { date: "Jun 7", service: "Hair Cut", paid: "$85", status: "completed" },
    { date: "May 22", service: "Blowout", paid: "$65", status: "completed" },
    { date: "May 8", service: "Color Treatment", paid: "$120", status: "completed" },
    { date: "Apr 24", service: "Hair Cut", paid: "$85", status: "no-show" },
  ];

  return (
    <div style={{ padding: isMobile ? "14px" : "28px", maxWidth: 1300, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <h2 className="serif" style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700 }}>Clients</h2>
          <div style={{ fontSize: 12, color: T.ivoryMuted }}>8 total</div>
        </div>
        <button className="btn-gold" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={13} /> {isMobile ? "Add" : "Add Client"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
          <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: T.ivoryMuted }} />
          <input placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 32, fontSize: 13 }} />
        </div>
        <select value={risk} onChange={e => setRisk(e.target.value)} style={{ width: isMobile ? "100%" : 140, fontSize: 13 }}>
          <option value="all">All Risk</option>
          <option value="high">High Risk</option>
          <option value="med">Med Risk</option>
          <option value="low">Low Risk</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: sel && !isMobile ? "1fr 280px" : "1fr", gap: 16, alignItems: "start" }}>

        {/* Mobile: card list / Desktop: table */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              {Array(5).fill(0).map((_, i) => <div key={i} style={{ height: 46, borderRadius: 6 }} className="skeleton" />)}
            </div>
          ) : isMobile ? (
            <div>
              {filtered.map((c, i) => (
                <div key={c.id} onClick={() => setSel(sel?.id === c.id ? null : c)}
                  style={{
                    padding: "12px 14px", display: "flex", alignItems: "center", gap: 12,
                    borderBottom: i < filtered.length - 1 ? `1px solid ${T.border}` : "none",
                    background: sel?.id === c.id ? T.surfaceAlt : "transparent", cursor: "pointer"
                  }}>
                  <Avatar initials={c.avatar} size={36} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: T.ivoryMuted }}>{c.service} · {c.appointments} appts</div>
                  </div>
                  <RiskBadge score={c.riskScore} />
                </div>
              ))}
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Client</th><th>Appts</th><th>Last Visit</th><th>No-Shows</th><th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} onClick={() => setSel(sel?.id === c.id ? null : c)}
                    style={{ background: sel?.id === c.id ? T.surfaceAlt : "transparent" }}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar initials={c.avatar} size={28} />
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 13 }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: T.ivoryMuted }}>{c.service}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: T.ivoryDim, fontSize: 13 }}>{c.appointments}</td>
                    <td style={{ color: T.ivoryDim, fontSize: 13 }}>{c.lastVisit}</td>
                    <td style={{ fontSize: 13 }}>{c.noShows > 0 ? <span style={{ color: T.risk, fontWeight: 500 }}>{c.noShows}</span> : <span style={{ color: T.safe }}>0</span>}</td>
                    <td><RiskBadge score={c.riskScore} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail panel */}
        {sel && (
          <div className="card fade-in" style={{ position: isMobile ? "static" : "sticky", top: 72 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Client Profile</div>
              <button className="btn-icon" style={{ width: 26, height: 26 }} onClick={() => setSel(null)}><X size={12} /></button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${T.border}` }}>
              <Avatar initials={sel.avatar} size={42} bg={T.goldDim} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{sel.name}</div>
                <RiskBadge score={sel.riskScore} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 14 }}>
              {[{ Icon: Mail, v: sel.email }, { Icon: Phone, v: sel.phone }].map(({ Icon, v }) => (
                <div key={v} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: T.ivoryDim }}>
                  <Icon size={11} color={T.ivoryMuted} /> {v}
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
              {[["Appts", sel.appointments], ["No-Shows", sel.noShows], ["Risk", `${sel.riskScore}%`]].map(([l, v]) => (
                <div key={l} style={{ textAlign: "center", padding: 8, background: T.surfaceAlt, borderRadius: 6, border: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{v}</div>
                  <div style={{ fontSize: 10, color: T.ivoryMuted }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: T.ivoryMuted, marginBottom: 8 }}>History</div>
            {hist.map((h, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 10px", background: T.surfaceAlt, borderRadius: 6, border: `1px solid ${T.border}`, marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{h.service}</div>
                  <div style={{ fontSize: 10, color: T.ivoryMuted }}>{h.date}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: T.gold }}>{h.paid}</div>
                  <div style={{ fontSize: 10, color: h.status === "no-show" ? T.risk : T.safe }}>{h.status}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 12, fontSize: 12, color: T.ivoryDim, lineHeight: 1.6, background: "rgba(201,150,63,.05)", padding: 10, borderRadius: 6, border: "1px solid rgba(201,150,63,.15)" }}>
              Prefers morning slots. Responds well to WhatsApp reminders. High review response rate.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── INSIGHTS ─────────────────────────────────────────────────────────────────

function Insights() {
  const isMobile = useIsMobile();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const noShowData = [
    { name: "Mon", v: 8 }, { name: "Tue", v: 12 }, { name: "Wed", v: 5 },
    { name: "Thu", v: 15 }, { name: "Fri", v: 22 }, { name: "Sat", v: 18 }, { name: "Sun", v: 7 },
  ];

  return (
    <div style={{ padding: isMobile ? "14px" : "28px", maxWidth: 1300, margin: "0 auto" }}>
      <div style={{ marginBottom: 22 }}>
        <h2 className="serif" style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700 }}>AI Insights & Analytics</h2>
        <p style={{ color: T.ivoryDim, fontSize: 13, marginTop: 4 }}>30-day performance overview.</p>
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Revenue — Last 14 Days</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: T.ivoryMuted }} />
              <YAxis tick={{ fontSize: 9, fill: T.ivoryMuted }} width={38} />
              <Tooltip contentStyle={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 11 }} />
              <Line type="monotone" dataKey="revenue" stroke={T.gold} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card ai-card">
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
            <Bot size={12} color={T.gold} /><span style={{ fontSize: 12, fontWeight: 600, color: T.gold }}>No-Show Risk by Day</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={noShowData}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: T.ivoryMuted }} />
              <YAxis tick={{ fontSize: 9, fill: T.ivoryMuted }} width={28} />
              <Tooltip contentStyle={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 11 }} />
              <Bar dataKey="v" radius={[3, 3, 0, 0]}>
                {noShowData.map((d, i) => <Cell key={i} fill={d.v > 18 ? T.risk : d.v > 12 ? T.gold : T.safe} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Booking Demand Heatmap</div>
        <div style={{ overflowX: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: `50px repeat(7,1fr)`, gap: 3, minWidth: 380 }}>
            <div />
            {days.map(d => <div key={d} style={{ textAlign: "center", fontSize: 11, color: T.ivoryMuted, paddingBottom: 4, fontWeight: 500 }}>{d}</div>)}
            {HEATMAP_DATA.map(row => [
              <div key={row.hour} style={{ fontSize: 10, color: T.ivoryMuted, display: "flex", alignItems: "center" }}>{row.hour}</div>,
              ...days.map(d => (
                <div key={d} style={{
                  height: 32, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
                  background: `rgba(201,150,63,${row[d] / 10})`,
                  fontSize: 10, color: row[d] > 6 ? T.ivory : T.ivoryDim, fontWeight: row[d] > 8 ? 600 : 400
                }}>{row[d]}</div>
              ))
            ])}
          </div>
        </div>
      </div>

      {/* Pricing table — scrollable on mobile */}
      <div className="card ai-card" style={{ marginBottom: 16, overflowX: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
          <Bot size={12} color={T.gold} /><span style={{ fontSize: 12, fontWeight: 600, color: T.gold }}>Dynamic Pricing Suggestions</span>
        </div>
        <table style={{ minWidth: 380 }}>
          <thead>
            <tr>
              <th>Slot</th><th>Current</th><th>AI Price</th><th>Lift</th><th></th>
            </tr>
          </thead>
          <tbody>
            {PRICING.map((p, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500, fontSize: 13 }}>{p.slot}</td>
                <td style={{ color: T.ivoryDim, fontSize: 13 }}>{p.current}</td>
                <td style={{ color: T.gold, fontWeight: 600, fontSize: 13 }}>{p.suggested}</td>
                <td><span style={{ color: p.lift.startsWith("+") ? T.safe : T.risk, fontWeight: 600, fontSize: 12 }}>{p.lift}</span></td>
                <td><button className="btn-ghost" style={{ padding: "3px 10px", fontSize: 11 }}>Apply</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Follow-up metrics */}
      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Post-Appointment Follow-Up</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 12 }}>
          {[
            { l: "Messages Sent", v: "342", s: "Last 30 days" },
            { l: "Open Rate", v: "87%", s: "+4% vs prior month" },
            { l: "Review Requests", v: "198", s: "Sent automatically" },
            { l: "Review Conversion", v: "31%", s: "Industry avg: 12%" },
          ].map(m => (
            <div key={m.l} style={{ padding: 14, background: T.surfaceAlt, borderRadius: 8, border: `1px solid ${T.border}` }}>
              <div className="serif" style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: T.gold }}>{m.v}</div>
              <div style={{ fontSize: 12, fontWeight: 500, marginTop: 4 }}>{m.l}</div>
              <div style={{ fontSize: 11, color: T.ivoryMuted }}>{m.s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── APPOINTMENTS PAGE ────────────────────────────────────────────────────────

function Appointments({ setPage }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ padding: isMobile ? "14px" : "28px", maxWidth: 1300, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h2 className="serif" style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700 }}>Appointments</h2>
          <div style={{ fontSize: 12, color: T.ivoryMuted }}>June 2026</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-ghost" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }} onClick={() => setPage("widget")}>
            <Bot size={12} /> Widget
          </button>
          <button className="btn-gold" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={13} /> New
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 7 }}>
            <button className="btn-icon" style={{ width: 30, height: 30 }}><ChevronLeft size={13} /></button>
            <button className="btn-icon" style={{ width: 30, height: 30 }}><ChevronRight size={13} /></button>
          </div>
          <div style={{ fontSize: 12, color: T.ivoryDim }}>June 9–15, 2026</div>
        </div>

        {isMobile ? (
          <div>
            {APPTS.map((a, i) => (
              <div key={a.id} style={{ padding: "12px 14px", borderBottom: i < APPTS.length - 1 ? `1px solid ${T.border}` : "none", display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 3, height: 36, borderRadius: 2, background: a.color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{a.client}</span>
                    <span style={{ fontSize: 12, color: T.gold, fontWeight: 500 }}>{a.time}</span>
                  </div>
                  <div style={{ fontSize: 12, color: T.ivoryMuted }}>{a.service} · {a.duration}m</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4,
                      background: a.status === "confirmed" ? "rgba(74,154,106,.12)" : "rgba(201,150,63,.12)",
                      color: a.status === "confirmed" ? "#6ABE8A" : T.goldLight,
                      border: `1px solid ${a.status === "confirmed" ? "rgba(74,154,106,.25)" : "rgba(201,150,63,.25)"}`
                    }}>{a.status}</span>
                    {a.risk && <span className="risk-h">High Risk</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ minWidth: 560 }}>
              <thead>
                <tr><th>Time</th><th>Client</th><th>Service</th><th>Duration</th><th>Status</th><th>Risk</th><th></th></tr>
              </thead>
              <tbody>
                {APPTS.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 500, color: T.gold, fontSize: 13 }}>{a.time}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Avatar initials={a.client.split(" ").map(n => n[0]).join("")} size={24} />
                        <span style={{ fontSize: 13 }}>{a.client}</span>
                      </div>
                    </td>
                    <td style={{ color: T.ivoryDim, fontSize: 13 }}>{a.service}</td>
                    <td style={{ color: T.ivoryDim, fontSize: 13 }}>{a.duration}m</td>
                    <td>
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                        background: a.status === "confirmed" ? "rgba(74,154,106,.12)" : "rgba(201,150,63,.12)",
                        color: a.status === "confirmed" ? "#6ABE8A" : T.goldLight,
                        border: `1px solid ${a.status === "confirmed" ? "rgba(74,154,106,.25)" : "rgba(201,150,63,.25)"}`
                      }}>{a.status}</span>
                    </td>
                    <td>{a.risk ? <span className="risk-h">High</span> : <span className="risk-l">Low</span>}</td>
                    <td>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button className="btn-icon" style={{ width: 28, height: 28 }}><Edit size={11} /></button>
                        <button className="btn-icon" style={{ width: 28, height: 28 }}><Trash2 size={11} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────

function SettingsPage() {
  const isMobile = useIsMobile();
  const [saved, setSaved] = useState(false);
  const sections = [
    {
      title: "Business Profile", fields: [
        { l: "Business Name", p: "Lumière Studio", t: "text" },
        { l: "Contact Email", p: "hello@lumiere.studio", t: "email" },
        { l: "Phone", p: "+1 555-0100", t: "tel" },
      ]
    },
    {
      title: "Booking Preferences", fields: [
        { l: "Booking Window (days ahead)", p: "30", t: "number" },
        { l: "Minimum Notice (hours)", p: "24", t: "number" },
        { l: "Default Deposit", p: "$20", t: "text" },
      ]
    },
    {
      title: "AI Features", fields: [
        { l: "No-Show Risk Threshold (%)", p: "65", t: "number" },
        { l: "Peak Pricing Increase Limit (%)", p: "20", t: "number" },
      ]
    },
  ];

  return (
    <div style={{ padding: isMobile ? "14px" : "28px", maxWidth: 700, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 className="serif" style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700 }}>Settings</h2>
        <p style={{ color: T.ivoryDim, fontSize: 13, marginTop: 4 }}>Manage your business profile and preferences.</p>
      </div>
      {sections.map(s => (
        <div key={s.title} className="card" style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.gold, marginBottom: 14 }}>{s.title}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {s.fields.map(f => (
              <div key={f.l}>
                <div style={{ fontSize: 11, color: T.ivoryMuted, marginBottom: 5 }}>{f.l}</div>
                <input type={f.t} placeholder={f.p} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button className="btn-ghost">Cancel</button>
        <button className="btn-gold" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
          {saved ? "Saved ✓" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("landing");
  const [dark, setDark] = useState(true);
  const isApp = page !== "landing";

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight: "100vh", background: T.bg }}>
        {isApp && <TopNav active={page} setPage={setPage} dark={dark} setDark={setDark} />}
        <div key={page} className="page-enter">
          {page === "landing" && <Landing setPage={setPage} />}
          {page === "dashboard" && <Dashboard />}
          {page === "widget" && <Widget />}
          {page === "clients" && <Clients />}
          {page === "insights" && <Insights />}
          {page === "appointments" && <Appointments setPage={setPage} />}
          {page === "settings" && <SettingsPage />}
        </div>
      </div>
    </>
  );
}