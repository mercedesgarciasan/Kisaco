import { useState } from "react";
import {
  MapPin, Clock, Users, Bell, Star, Search,
  ChevronRight, ArrowLeft, MessageCircle, Calendar,
  Map, BookOpen, Check, Plus, User, Compass,
  Edit, Coffee, Mic, Award, Bookmark, Zap,
  Navigation, Heart, Share2, X, Hash
} from "lucide-react";

// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────
const C = {
  bg:       "#09090F",
  surface:  "#0F0F1A",
  card:     "#16162A",
  elevated: "#1E1E35",
  border:   "#242440",
  primary:  "#7C6EFA",
  teal:     "#2DD4BF",
  coral:    "#FF6B6B",
  green:    "#4ADE80",
  amber:    "#FBBF24",
  text:     "#F0F0FF",
  muted:    "#7878A0",
  dim:      "#44445A",
};

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const INTERESTS = ["Product", "Design", "AI / ML", "Startups", "Fintech", "Engineering", "Marketing", "Data", "Growth", "Leadership", "B2B SaaS", "Mobile"];

const SCHEDULE = [
  { id: 1, time: "09:00", end: "09:45", title: "Opening Keynote", speaker: "Ana Pérez", room: "Main Stage", type: "keynote", live: false, next: false, duration: 45 },
  { id: 2, time: "10:00", end: "10:45", title: "AI in Product Design", speaker: "Carlos Ríos", room: "Hall A", type: "talk", live: true, next: false, duration: 45 },
  { id: 3, time: "10:45", end: "11:30", title: "Building Inclusive Products", speaker: "Mia Torres", room: "Hall B", type: "talk", live: false, next: true, duration: 45 },
  { id: 4, time: "12:00", end: "13:00", title: "Lunch & Networking", speaker: null, room: "Terrace", type: "break", live: false, next: false, duration: 60 },
  { id: 5, time: "13:00", end: "13:30", title: "1:1 with Juan Méndez", speaker: "Juan Méndez", room: "Table 12", type: "meeting", live: false, next: false, duration: 30 },
  { id: 6, time: "14:30", end: "16:00", title: "Workshop: Design Systems at Scale", speaker: "Valentina Cruz", room: "Workshop Room", type: "workshop", live: false, next: false, duration: 90 },
  { id: 7, time: "16:30", end: "17:15", title: "Closing Panel: Future of Product", speaker: "Multiple", room: "Main Stage", type: "panel", live: false, next: false, duration: 45 },
];

const PEOPLE = [
  { id: 1, name: "Juan Méndez", role: "CPO at Lemon Cash", initials: "JM", tags: ["Product", "Fintech"], mutual: 3, online: true, bio: "Building the future of finance in LATAM. Former Mercado Pago.", color: "#7C6EFA" },
  { id: 2, name: "Valentina Cruz", role: "Head of Design at Mercado", initials: "VC", tags: ["Design", "AI / ML"], mutual: 1, online: true, bio: "Design systems nerd. I believe great UX is a product moat.", color: "#2DD4BF" },
  { id: 3, name: "Lucas Herrero", role: "Founder at Nowports", initials: "LH", tags: ["Startups", "B2B SaaS"], mutual: 5, online: false, bio: "Logistics + software. Making trade work for everyone in LATAM.", color: "#FBBF24" },
  { id: 4, name: "Sofía Ramírez", role: "Product Designer", initials: "SR", tags: ["AI / ML", "Design"], mutual: 2, online: true, bio: "Designing AI-native products. Obsessed with motion and interaction.", color: "#FF6B6B" },
  { id: 5, name: "Diego Vega", role: "VP Product at Auth0", initials: "DV", tags: ["Product", "Engineering"], mutual: 4, online: false, bio: "10 years shipping developer tools. Security should be invisible.", color: "#4ADE80" },
];

const SIDE_EVENTS = [
  { id: 1, host: "Lemon Cash", title: "Fintech Founders Dinner", time: "Tonight · 20:00", location: "Casa Cavia", attendees: 24, invited: true },
  { id: 2, host: "Mercado Libre", title: "Design Leaders Breakfast", time: "Apr 15 · 08:30", location: "Palermo Soho", attendees: 18, invited: false },
];

// ─── REUSABLE COMPONENTS ─────────────────────────────────────────────────────

function Pill({ label, active, small, color }) {
  const c = color || C.primary;
  return (
    <span style={{
      display: "inline-block",
      padding: small ? "3px 9px" : "5px 12px",
      borderRadius: 20,
      fontSize: small ? 10 : 12,
      fontWeight: 600,
      background: active ? `${c}20` : `${C.elevated}`,
      color: active ? c : C.muted,
      border: `1px solid ${active ? c + "50" : C.border}`,
      letterSpacing: "0.01em",
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

function Avatar({ initials, size = 42, color = C.primary }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: size * 0.35,
      background: `${color}20`,
      border: `2px solid ${color}50`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: color, fontWeight: 800,
      fontSize: size * 0.3,
      flexShrink: 0, letterSpacing: "-0.02em",
    }}>
      {initials}
    </div>
  );
}

function OnlineIndicator({ size = 10, card }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size,
      background: C.green,
      border: `${size > 8 ? 2 : 1.5}px solid ${card || C.card}`,
    }} />
  );
}

function Btn({ children, onClick, variant = "primary", style: s, size = "md" }) {
  const pad = size === "sm" ? "7px 16px" : size === "xs" ? "5px 12px" : "13px 20px";
  const fs = size === "sm" ? 13 : size === "xs" ? 11 : 15;
  const bg = variant === "primary" ? C.primary
    : variant === "ghost" ? "transparent"
    : variant === "teal" ? `${C.teal}20`
    : variant === "danger" ? `${C.coral}20`
    : `${C.primary}15`;
  const col = variant === "primary" ? "#fff"
    : variant === "teal" ? C.teal
    : variant === "danger" ? C.coral
    : C.primary;
  const bdr = variant === "ghost" ? `1.5px solid ${C.border}`
    : variant === "teal" ? `1px solid ${C.teal}40`
    : variant === "danger" ? `1px solid ${C.coral}40`
    : variant === "primary" ? "none"
    : `1px solid ${C.primary}40`;

  return (
    <button onClick={onClick} style={{
      padding: pad, borderRadius: 12,
      background: bg, color: col,
      border: bdr,
      fontWeight: 700, fontSize: fs,
      cursor: "pointer", display: "inline-flex",
      alignItems: "center", justifyContent: "center",
      gap: 6, fontFamily: "inherit",
      ...s,
    }}>
      {children}
    </button>
  );
}

function StatusBar({ transparent }) {
  return (
    <div style={{
      height: 44, display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 24px",
      flexShrink: 0,
      background: transparent ? "transparent" : C.bg,
    }}>
      <span style={{ color: C.text, fontSize: 13, fontWeight: 700, letterSpacing: "0.02em" }}>9:41</span>
      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 12 }}>
          {[4, 7, 10, 12].map((h, i) => (
            <div key={i} style={{ width: 3, height: h, borderRadius: 1.5, background: i < 3 ? C.text : C.dim }} />
          ))}
        </div>
        <div style={{ width: 20, height: 11, border: `1.5px solid ${C.muted}`, borderRadius: 3, position: "relative", display: "flex", alignItems: "center", padding: "0 2px" }}>
          <div style={{ flex: 1, height: 5, borderRadius: 1, background: C.text }} />
          <div style={{ position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)", width: 2.5, height: 5, background: C.muted, borderRadius: "0 1px 1px 0" }} />
        </div>
      </div>
    </div>
  );
}

function BottomNav({ active, onSelect, mode }) {
  const items = mode === "event"
    ? [{ id: "now", Icon: Zap, label: "Now" }, { id: "schedule", Icon: Calendar, label: "Schedule" }, { id: "map", Icon: Map, label: "Map" }, { id: "network", Icon: Users, label: "Network" }]
    : [{ id: "home", Icon: Compass, label: "Home" }, { id: "discover", Icon: Users, label: "Discover" }, { id: "schedule", Icon: Calendar, label: "Schedule" }, { id: "profile", Icon: User, label: "Profile" }];

  return (
    <div style={{
      background: `${C.surface}EE`,
      backdropFilter: "blur(24px)",
      borderTop: `1px solid ${C.border}`,
      display: "flex", flexShrink: 0,
      paddingBottom: 20, paddingTop: 6,
    }}>
      {items.map(({ id, Icon, label }) => {
        const isActive = active === id;
        return (
          <button key={id} onClick={() => onSelect(id)} style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", gap: 4,
            background: "none", border: "none", cursor: "pointer",
            padding: "4px 0",
          }}>
            <div style={{
              width: 38, height: 34, borderRadius: 11,
              background: isActive ? `${C.primary}22` : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon size={17} color={isActive ? C.primary : C.muted} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? C.primary : C.muted }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function BackButton({ onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 36, height: 36, borderRadius: 10,
      background: C.card, border: `1px solid ${C.border}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", flexShrink: 0,
    }}>
      <ArrowLeft size={17} color={C.text} />
    </button>
  );
}

// ─── SCREEN: SPLASH ──────────────────────────────────────────────────────────
function SplashScreen({ onNext }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 28px 48px" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0 }}>
        {/* Glow orb */}
        <div style={{
          width: 120, height: 120, borderRadius: 36,
          background: `linear-gradient(145deg, ${C.primary}, #A78BFA)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 32,
          boxShadow: `0 0 0 1px ${C.primary}40, 0 0 60px ${C.primary}40, 0 0 120px ${C.primary}25`,
        }}>
          <Compass size={52} color="#fff" strokeWidth={1.5} />
        </div>
        <h1 style={{ color: C.text, fontSize: 42, fontWeight: 900, margin: "0 0 10px", letterSpacing: "-1.5px", textAlign: "center" }}>
          nexus
        </h1>
        <p style={{ color: C.muted, fontSize: 16, textAlign: "center", lineHeight: 1.6, margin: "0 0 48px", maxWidth: 260 }}>
          Connect with the right people at the right moment — before, during, and after events.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button onClick={onNext} style={{
          width: "100%", padding: "15px 20px", borderRadius: 16,
          background: "#fff", color: "#111",
          border: "none", fontWeight: 700, fontSize: 15,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
          cursor: "pointer", fontFamily: "inherit",
          boxShadow: "0 2px 20px rgba(255,255,255,0.08)",
        }}>
          <svg width="20" height="20" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
        <p style={{ color: C.dim, fontSize: 11, textAlign: "center", margin: 0, lineHeight: 1.5 }}>
          By continuing you accept our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

// ─── SCREEN: ONBOARDING ──────────────────────────────────────────────────────
function OnboardingScreen({ onNext }) {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState([]);
  const toggle = (tag) => setSelected(s => s.includes(tag) ? s.filter(t => t !== tag) : [...s, tag]);

  if (step === 2) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 24px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <BackButton onClick={() => setStep(1)} />
          <div style={{ flex: 1, display: "flex", gap: 4 }}>
            <div style={{ flex: 1, height: 3, borderRadius: 2, background: C.primary }} />
            <div style={{ flex: 1, height: 3, borderRadius: 2, background: C.primary }} />
          </div>
        </div>
        <h2 style={{ color: C.text, fontSize: 26, fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.5px" }}>Connect your calendar</h2>
        <p style={{ color: C.muted, fontSize: 14, margin: "0 0 28px", lineHeight: 1.6 }}>We'll block time for talks you care about and your scheduled 1:1s.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "auto" }}>
          {[{ name: "Google Calendar", color: "#4285F4" }, { name: "Outlook Calendar", color: "#0078D4" }, { name: "Apple Calendar", color: "#FFFFFF" }].map(cal => (
            <button key={cal.name} style={{
              padding: "16px 18px", borderRadius: 14,
              background: C.card, border: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", gap: 14,
              cursor: "pointer", width: "100%", textAlign: "left", fontFamily: "inherit",
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${cal.color}20`, border: `1px solid ${cal.color}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Calendar size={18} color={cal.color} />
              </div>
              <span style={{ color: C.text, fontWeight: 600, fontSize: 15, flex: 1 }}>{cal.name}</span>
              <ChevronRight size={16} color={C.muted} />
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 28 }}>
          <Btn onClick={onNext} style={{ width: "100%" }}>Set up my schedule</Btn>
          <Btn variant="ghost" onClick={onNext} style={{ width: "100%", color: C.muted }}>Skip for now</Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 24px 40px" }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 28 }}>
        <div style={{ flex: 1, height: 3, borderRadius: 2, background: C.primary }} />
        <div style={{ flex: 1, height: 3, borderRadius: 2, background: C.border }} />
      </div>
      <h2 style={{ color: C.text, fontSize: 26, fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.5px" }}>What are you into?</h2>
      <p style={{ color: C.muted, fontSize: 14, margin: "0 0 24px", lineHeight: 1.6 }}>Select topics you care about — we'll match you with the right talks and people.</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginBottom: 28 }}>
        {INTERESTS.map(tag => {
          const on = selected.includes(tag);
          return (
            <button key={tag} onClick={() => toggle(tag)} style={{
              padding: "9px 16px", borderRadius: 22,
              background: on ? `${C.primary}20` : C.card,
              color: on ? C.primary : C.muted,
              border: `1.5px solid ${on ? C.primary + "60" : C.border}`,
              fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              {on && <Check size={12} />}{tag}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: "auto" }}>
        <Btn onClick={() => setStep(2)} style={{ width: "100%", opacity: selected.length < 2 ? 0.45 : 1 }}>
          Continue → {selected.length > 0 ? `(${selected.length} selected)` : ""}
        </Btn>
      </div>
    </div>
  );
}

// ─── SCREEN: HOME ────────────────────────────────────────────────────────────
function HomeScreen({ nav, setPerson }) {
  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {/* Header */}
      <div style={{ padding: "10px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ color: C.muted, fontSize: 13, margin: "0 0 2px" }}>Good morning,</p>
          <h2 style={{ color: C.text, fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: "-0.3px" }}>Mercedes 👋</h2>
        </div>
        <div style={{ position: "relative" }}>
          <button style={{ width: 40, height: 40, borderRadius: 12, background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Bell size={18} color={C.muted} />
          </button>
          <div style={{ position: "absolute", top: 8, right: 8, width: 7, height: 7, borderRadius: 4, background: C.coral, border: `1.5px solid ${C.bg}` }} />
        </div>
      </div>

      {/* Event Banner */}
      <div style={{ margin: "0 20px 20px" }}>
        <div style={{
          borderRadius: 22, padding: "20px",
          background: "linear-gradient(145deg, #12103A 0%, #0C0A28 100%)",
          border: `1.5px solid ${C.primary}35`,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: `${C.primary}10` }} />
          <div style={{ position: "absolute", bottom: -40, left: 40, width: 100, height: 100, borderRadius: "50%", background: `${C.teal}08` }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
              <Pill label="4 days away" active small />
              <Pill label="✓ Registered" small />
            </div>
            <h3 style={{ color: C.text, fontSize: 22, fontWeight: 800, margin: "0 0 5px", letterSpacing: "-0.4px" }}>Product Summit 2026</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 16 }}>
              <MapPin size={12} color={C.muted} />
              <span style={{ color: C.muted, fontSize: 13 }}>Apr 14–16 · Centro Cultural Kirchner, BA</span>
            </div>
            <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
              {[{ Icon: Users, label: "1,240 attending" }, { Icon: Mic, label: "32 talks" }, { Icon: Coffee, label: "18 1:1 slots" }].map(({ Icon, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Icon size={12} color={C.teal} />
                  <span style={{ color: C.muted, fontSize: 12 }}>{label}</span>
                </div>
              ))}
            </div>
            <Btn onClick={() => nav("event-detail")} size="sm">Explore event →</Btn>
          </div>
        </div>
      </div>

      {/* Side Events */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: 0 }}>Side Events</h3>
          <span style={{ color: C.muted, fontSize: 12 }}>Members only</span>
        </div>
        {SIDE_EVENTS.map(se => (
          <div key={se.id} style={{ marginBottom: 10, padding: "14px", borderRadius: 16, background: C.card, border: `1px solid ${se.invited ? C.amber + "40" : C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div>
                <div style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{se.title}</div>
                <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>Hosted by {se.host}</div>
              </div>
              {se.invited && <span style={{ background: `${C.amber}20`, color: C.amber, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 8, flexShrink: 0, marginLeft: 8 }}>INVITED</span>}
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 10 }}>
                {[{ Icon: Clock, t: se.time }, { Icon: MapPin, t: se.location }, { Icon: Users, t: `${se.attendees} guests` }].map(({ Icon, t }) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Icon size={11} color={C.dim} />
                    <span style={{ color: C.muted, fontSize: 11 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            {se.invited && (
              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <Btn size="xs" style={{ flex: 1 }}>Accept</Btn>
                <Btn size="xs" variant="ghost" style={{ flex: 1, color: C.muted, border: `1px solid ${C.border}` }}>Decline</Btn>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* People to connect */}
      <div style={{ padding: "0 20px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: 0 }}>People to connect with</h3>
          <button onClick={() => nav("pre-event")} style={{ background: "none", border: "none", color: C.primary, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>See all</button>
        </div>
        {PEOPLE.slice(0, 3).map(p => (
          <div key={p.id} onClick={() => { setPerson(p); nav("person-profile"); }} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "13px 14px", borderRadius: 16,
            background: C.card, border: `1px solid ${C.border}`,
            marginBottom: 8, cursor: "pointer",
          }}>
            <div style={{ position: "relative" }}>
              <Avatar initials={p.initials} size={44} color={p.color} />
              {p.online && <div style={{ position: "absolute", bottom: 1, right: 1 }}><OnlineIndicator card={C.card} /></div>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{p.name}</div>
              <div style={{ color: C.muted, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 5 }}>{p.role}</div>
              <div style={{ display: "flex", gap: 5 }}>
                {p.tags.slice(0, 2).map(t => <Pill key={t} label={t} active small color={p.color} />)}
              </div>
            </div>
            <ChevronRight size={15} color={C.dim} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SCREEN: EVENT DETAIL ────────────────────────────────────────────────────
function EventDetailScreen({ goBack }) {
  const [tab, setTab] = useState("schedule");
  const tabs = ["schedule", "speakers", "1:1s"];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "10px 20px 14px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <BackButton onClick={goBack} />
        <h2 style={{ color: C.text, fontSize: 17, fontWeight: 700, margin: 0, flex: 1 }}>Product Summit 2026</h2>
        <Bookmark size={19} color={C.muted} style={{ cursor: "pointer" }} />
      </div>

      {/* Stats row */}
      <div style={{ margin: "0 20px 14px", padding: "16px", borderRadius: 18, background: C.card, border: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 50, height: 50, borderRadius: 14, background: `linear-gradient(145deg, ${C.primary}, #A78BFA)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Award size={24} color="#fff" />
          </div>
          <div>
            <div style={{ color: C.text, fontWeight: 700, fontSize: 15 }}>Apr 14–16, 2026</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              <MapPin size={12} color={C.muted} />
              <span style={{ color: C.muted, fontSize: 13 }}>CCK, Buenos Aires</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
          {[{ v: "32", l: "Talks" }, { v: "48", l: "Speakers" }, { v: "1.2K", l: "Attendees" }, { v: "18", l: "1:1 Slots" }].map(({ v, l }) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ color: C.primary, fontSize: 20, fontWeight: 800 }}>{v}</div>
              <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, padding: "0 20px 14px", flexShrink: 0 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "7px 18px", borderRadius: 22,
            background: tab === t ? C.primary : C.card,
            color: tab === t ? "#fff" : C.muted,
            border: `1px solid ${tab === t ? C.primary : C.border}`,
            fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
          }}>
            {t === "1:1s" ? "1:1 Slots" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Schedule */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 24px" }}>
        {tab === "schedule" && SCHEDULE.map(item => (
          <div key={item.id} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 48, textAlign: "right", paddingTop: 13, flexShrink: 0 }}>
              <span style={{ color: C.muted, fontSize: 12, fontWeight: 600 }}>{item.time}</span>
            </div>
            <div style={{ width: 2, background: item.live ? C.coral : item.next ? C.primary : C.border, borderRadius: 1, position: "relative", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", width: 9, height: 9, borderRadius: 5, background: item.live ? C.coral : item.next ? C.primary : C.dim, border: `2px solid ${C.bg}` }} />
            </div>
            <div style={{
              flex: 1, padding: "11px 14px", borderRadius: 14,
              background: item.live ? `${C.coral}0D` : item.next ? `${C.primary}0D` : C.card,
              border: `1px solid ${item.live ? C.coral + "40" : item.next ? C.primary + "35" : C.border}`,
              marginBottom: 2,
            }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 5 }}>
                {item.live && <span style={{ fontSize: 10, fontWeight: 700, color: C.coral, background: `${C.coral}20`, padding: "2px 7px", borderRadius: 7 }}>● LIVE NOW</span>}
                {item.next && <span style={{ fontSize: 10, fontWeight: 700, color: C.primary, background: `${C.primary}20`, padding: "2px 7px", borderRadius: 7 }}>NEXT UP</span>}
              </div>
              <div style={{ color: C.text, fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{item.title}</div>
              {item.speaker && <div style={{ color: C.muted, fontSize: 12, marginBottom: 4 }}>{item.speaker}</div>}
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <MapPin size={10} color={C.dim} />
                  <span style={{ color: C.dim, fontSize: 11 }}>{item.room}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={10} color={C.dim} />
                  <span style={{ color: C.dim, fontSize: 11 }}>{item.duration}min</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {tab === "speakers" && PEOPLE.map(p => (
          <div key={p.id} style={{ display: "flex", gap: 14, padding: "14px", borderRadius: 16, background: C.card, border: `1px solid ${C.border}`, marginBottom: 10 }}>
            <Avatar initials={p.initials} size={50} color={p.color} />
            <div style={{ flex: 1 }}>
              <div style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{p.name}</div>
              <div style={{ color: C.muted, fontSize: 12, marginBottom: 6 }}>{p.role}</div>
              <div style={{ display: "flex", gap: 5 }}>
                {p.tags.map(t => <Pill key={t} label={t} active small color={p.color} />)}
              </div>
            </div>
            <Btn size="xs" variant="outline">Follow</Btn>
          </div>
        ))}

        {tab === "1:1s" && (
          <div>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>Book a 30-min slot with speakers and fellow attendees. Remaining slots are open for scheduling.</p>
            {SCHEDULE.filter(s => s.type === "meeting").map(item => (
              <div key={item.id} style={{ padding: "14px", borderRadius: 16, background: `${C.teal}0D`, border: `1px solid ${C.teal}30`, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: C.teal, fontWeight: 700, fontSize: 13 }}>{item.time} – {item.end}</span>
                  <span style={{ background: `${C.green}20`, color: C.green, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 7 }}>BOOKED</span>
                </div>
                <div style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{item.title}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                  <MapPin size={11} color={C.muted} />
                  <span style={{ color: C.muted, fontSize: 12 }}>{item.room}</span>
                </div>
              </div>
            ))}
            <div style={{ padding: "14px", borderRadius: 16, background: C.card, border: `1px dashed ${C.border}`, textAlign: "center" }}>
              <span style={{ color: C.muted, fontSize: 13 }}>5 open slots available · </span>
              <button style={{ background: "none", border: "none", color: C.primary, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Browse →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SCREEN: PRE-EVENT NETWORKING ────────────────────────────────────────────
function PreEventScreen({ goBack, setPerson, nav }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Product", "Design", "AI / ML", "Startups"];

  const filtered = PEOPLE.filter(p =>
    (filter === "All" || p.tags.includes(filter)) &&
    (query === "" || p.name.toLowerCase().includes(query.toLowerCase()) || p.role.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "10px 20px 14px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <BackButton onClick={goBack} />
          <h2 style={{ color: C.text, fontSize: 17, fontWeight: 700, margin: 0, flex: 1 }}>Attendees</h2>
          <span style={{ color: C.muted, fontSize: 13 }}>1,240</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 14px", marginBottom: 12 }}>
          <Search size={15} color={C.muted} />
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, role, or company..."
            style={{ background: "none", border: "none", color: C.text, fontSize: 14, flex: 1, outline: "none", fontFamily: "inherit" }}
          />
        </div>
        <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 2 }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "5px 14px", borderRadius: 20, flexShrink: 0,
              background: filter === f ? C.primary : C.card,
              color: filter === f ? "#fff" : C.muted,
              border: `1px solid ${filter === f ? C.primary : C.border}`,
              fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "inherit",
            }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 24px" }}>
        {filtered.map(p => (
          <div key={p.id} style={{
            display: "flex", gap: 12, alignItems: "center",
            padding: "14px", borderRadius: 18, background: C.card,
            border: `1px solid ${C.border}`, marginBottom: 10, cursor: "pointer",
          }} onClick={() => { setPerson(p); nav("person-profile"); }}>
            <div style={{ position: "relative" }}>
              <Avatar initials={p.initials} size={50} color={p.color} />
              {p.online && <div style={{ position: "absolute", bottom: 2, right: 2 }}><OnlineIndicator size={11} card={C.card} /></div>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{p.name}</div>
              <div style={{ color: C.muted, fontSize: 12, marginBottom: 6 }}>{p.role}</div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
                {p.tags.map(t => <Pill key={t} label={t} active small color={p.color} />)}
                <span style={{ color: C.dim, fontSize: 11 }}>{p.mutual} mutual</span>
              </div>
            </div>
            <button onClick={e => { e.stopPropagation(); }} style={{
              padding: "8px 12px", borderRadius: 11,
              background: `${C.primary}18`, border: `1px solid ${C.primary}40`,
              color: C.primary, fontWeight: 700, fontSize: 12, cursor: "pointer", flexShrink: 0, fontFamily: "inherit",
            }}>
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SCREEN: PERSON PROFILE ──────────────────────────────────────────────────
function PersonProfileScreen({ person, goBack }) {
  const [status, setStatus] = useState("idle"); // idle | sent | connected
  if (!person) return null;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "10px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <BackButton onClick={goBack} />
          <button style={{ width: 36, height: 36, borderRadius: 10, background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Share2 size={15} color={C.muted} />
          </button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "12px 24px 24px" }}>
        <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
          <Avatar initials={person.initials} size={88} color={person.color} />
          {person.online && (
            <div style={{ position: "absolute", bottom: 4, right: 4, width: 16, height: 16, borderRadius: 8, background: C.green, border: `3px solid ${C.bg}` }} />
          )}
        </div>
        <h2 style={{ color: C.text, fontSize: 24, fontWeight: 800, margin: "0 0 5px", letterSpacing: "-0.4px" }}>{person.name}</h2>
        <p style={{ color: C.muted, fontSize: 14, margin: "0 0 14px" }}>{person.role}</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {person.tags.map(t => <Pill key={t} label={t} active color={person.color} />)}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", margin: "0 20px 16px", background: C.card, borderRadius: 18, border: `1px solid ${C.border}` }}>
        {[{ v: person.mutual, l: "Mutual Connections" }, { v: person.tags.length, l: "Shared Interests" }].map(({ v, l }, i) => (
          <div key={l} style={{ flex: 1, textAlign: "center", padding: "14px 8px", borderRight: i === 0 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ color: person.color, fontSize: 24, fontWeight: 800 }}>{v}</div>
            <div style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Bio */}
      <div style={{ margin: "0 20px 14px", padding: "14px 16px", background: C.card, borderRadius: 16, border: `1px solid ${C.border}` }}>
        <div style={{ color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>About</div>
        <p style={{ color: C.text, fontSize: 13, lineHeight: 1.65, margin: 0 }}>{person.bio}</p>
      </div>

      {/* Socials */}
      <div style={{ display: "flex", gap: 10, margin: "0 20px 24px" }}>
        {[{ l: "LinkedIn", c: "#0A66C2" }, { l: "Twitter", c: "#1DA1F2" }, { l: "Website", c: C.muted }].map(s => (
          <button key={s.l} style={{ flex: 1, padding: "10px 8px", borderRadius: 12, background: `${s.c}15`, border: `1px solid ${s.c}30`, color: s.c, fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
            {s.l}
          </button>
        ))}
      </div>

      {/* CTAs */}
      <div style={{ padding: "0 20px 36px", display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={() => setStatus(status === "sent" ? "connected" : "sent")} style={{
          width: "100%", padding: "15px",
          borderRadius: 16,
          background: status === "idle" ? C.primary : status === "sent" ? `${C.amber}20` : `${C.green}20`,
          color: status === "idle" ? "#fff" : status === "sent" ? C.amber : C.green,
          border: status === "idle" ? "none" : `1.5px solid ${status === "sent" ? C.amber + "60" : C.green + "60"}`,
          fontWeight: 700, fontSize: 15, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit",
        }}>
          {status === "idle" && <><Plus size={18} /> Request 1:1 Meeting</>}
          {status === "sent" && <><Clock size={18} /> Request Pending…</>}
          {status === "connected" && <><Check size={18} /> 1:1 Confirmed!</>}
        </button>
        <button style={{
          width: "100%", padding: "15px", borderRadius: 16,
          background: "transparent", color: C.primary,
          border: `1.5px solid ${C.primary}40`,
          fontWeight: 700, fontSize: 15, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit",
        }}>
          <MessageCircle size={18} /> Send Message
        </button>
      </div>
    </div>
  );
}

// ─── SCREEN: EVENT NOW ───────────────────────────────────────────────────────
function EventNowScreen({ nav }) {
  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {/* Header */}
      <div style={{ padding: "8px 20px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ color: C.muted, fontSize: 12, margin: "0 0 2px", letterSpacing: "0.03em" }}>APR 14, 2026 · DAY 1 OF 3</p>
          <h2 style={{ color: C.text, fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: "-0.3px" }}>Product Summit</h2>
        </div>
        <div style={{ position: "relative" }}>
          <button style={{ width: 40, height: 40, borderRadius: 12, background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Bell size={18} color={C.muted} />
          </button>
          <div style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: 4, background: C.coral, border: `1.5px solid ${C.bg}` }} />
        </div>
      </div>

      {/* HAPPENING NOW */}
      <div style={{ margin: "0 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: C.coral }} />
          <span style={{ color: C.coral, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>Happening Now</span>
        </div>
        <div style={{
          borderRadius: 22, padding: "20px",
          background: "linear-gradient(145deg, #260A10 0%, #180812 100%)",
          border: `2px solid ${C.coral}35`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ background: `${C.coral}25`, color: C.coral, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 8 }}>TALK · HALL A</span>
            <span style={{ color: C.muted, fontSize: 12 }}>10:00 – 10:45</span>
          </div>
          <h3 style={{ color: C.text, fontSize: 20, fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.3px", lineHeight: 1.2 }}>AI in Product Design</h3>
          <p style={{ color: C.muted, fontSize: 13, margin: "0 0 16px" }}>Carlos Ríos · Head of AI, MercadoLibre</p>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ flex: 1, height: 5, borderRadius: 3, background: `${C.coral}20` }}>
              <div style={{ width: "35%", height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${C.coral}, #FF9A9A)` }} />
            </div>
            <span style={{ color: C.coral, fontSize: 12, fontWeight: 700 }}>29 min left</span>
          </div>
        </div>
      </div>

      {/* NEXT UP */}
      <div style={{ margin: "0 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: C.primary }} />
          <span style={{ color: C.primary, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>Up Next · in 16 min</span>
        </div>
        <div style={{
          borderRadius: 16, padding: "16px 18px",
          background: `${C.primary}0A`,
          border: `1.5px solid ${C.primary}30`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ background: `${C.primary}20`, color: C.primary, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 8 }}>TALK · HALL B</span>
            <span style={{ color: C.muted, fontSize: 12 }}>10:45</span>
          </div>
          <h4 style={{ color: C.text, fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>Building Inclusive Products</h4>
          <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>Mia Torres · 45 min</p>
        </div>
      </div>

      {/* MY SCHEDULE */}
      <div style={{ padding: "0 20px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: 0 }}>My Schedule Today</h3>
          <button style={{ background: "none", border: "none", color: C.primary, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Full schedule</button>
        </div>
        {SCHEDULE.filter(s => [3, 5, 6].includes(s.id)).map(item => (
          <div key={item.id} style={{
            display: "flex", gap: 12, alignItems: "center",
            padding: "12px 14px", borderRadius: 14,
            background: C.card, border: `1px solid ${C.border}`, marginBottom: 8,
          }}>
            <div style={{ width: 44, flexShrink: 0, textAlign: "center" }}>
              <div style={{ color: item.type === "meeting" ? C.teal : C.primary, fontSize: 13, fontWeight: 800 }}>{item.time}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>{item.title}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                <MapPin size={11} color={C.dim} />
                <span style={{ color: C.muted, fontSize: 12 }}>{item.room}</span>
              </div>
            </div>
            {item.type === "meeting" && (
              <button onClick={() => nav("meeting-notes")} style={{
                padding: "6px 12px", borderRadius: 10,
                background: `${C.teal}18`, border: `1px solid ${C.teal}35`,
                color: C.teal, fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit",
              }}>
                Open
              </button>
            )}
          </div>
        ))}
      </div>

      {/* NEARBY */}
      <div style={{ padding: "0 20px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: 0 }}>Connect Nearby</h3>
          <span style={{ color: C.green, fontSize: 12, fontWeight: 700 }}>● 3 close to you</span>
        </div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
          {PEOPLE.filter(p => p.online).map(p => (
            <div key={p.id} style={{ flexShrink: 0, width: 96, padding: "14px 10px", borderRadius: 18, background: C.card, border: `1px solid ${C.border}`, textAlign: "center" }}>
              <div style={{ position: "relative", display: "inline-block", marginBottom: 8 }}>
                <Avatar initials={p.initials} size={46} color={p.color} />
                <div style={{ position: "absolute", bottom: 1, right: 1 }}><OnlineIndicator size={10} card={C.card} /></div>
              </div>
              <div style={{ color: C.text, fontSize: 12, fontWeight: 700, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name.split(" ")[0]}</div>
              <div style={{ color: C.muted, fontSize: 10, marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.role.split(" ")[0]}</div>
              <button style={{ width: "100%", padding: "5px 0", borderRadius: 8, background: `${C.primary}20`, border: "none", color: C.primary, fontWeight: 700, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN: MAP ─────────────────────────────────────────────────────────────
function MapScreen() {
  const [selected, setSelected] = useState(null);

  const rooms = [
    { id: 1, name: "Main Stage", x: 28, y: 10, w: 244, h: 72, color: C.coral, live: true, current: "Opening Keynote" },
    { id: 2, name: "Hall A", x: 28, y: 106, w: 112, h: 66, color: C.primary, live: true, current: "AI in Product Design" },
    { id: 3, name: "Hall B", x: 160, y: 106, w: 112, h: 66, color: C.primary, live: false, current: "Building Inclusive Products (next)" },
    { id: 4, name: "Workshop", x: 28, y: 196, w: 112, h: 58, color: C.teal, live: false, current: "Design Systems at Scale (14:30)" },
    { id: 5, name: "1:1 Zone", x: 160, y: 196, w: 112, h: 58, color: C.amber, live: false, current: "Open 1:1 slots available" },
    { id: 6, name: "Terrace", x: 80, y: 278, w: 140, h: 44, color: C.muted, live: false, current: "Lunch & Networking (12:00)" },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "10px 20px 14px", flexShrink: 0 }}>
        <h2 style={{ color: C.text, fontSize: 18, fontWeight: 800, margin: "0 0 3px" }}>Venue Map</h2>
        <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>Centro Cultural Kirchner · Floor 2</p>
      </div>

      <div style={{ margin: "0 20px 14px", borderRadius: 20, overflow: "hidden", background: C.card, border: `1px solid ${C.border}`, padding: 16, flexShrink: 0 }}>
        <svg viewBox="0 0 300 340" style={{ width: "100%", height: "auto", display: "block" }}>
          <rect x="14" y="4" width="272" height="332" rx="14" fill="#0C0C1E" stroke={C.border} strokeWidth="1" />
          {rooms.map(r => (
            <g key={r.id} onClick={() => setSelected(selected?.id === r.id ? null : r)} style={{ cursor: "pointer" }}>
              <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="10"
                fill={selected?.id === r.id ? r.color + "35" : r.color + "12"}
                stroke={r.live ? r.color : selected?.id === r.id ? r.color : r.color + "45"}
                strokeWidth={r.live ? 2 : 1} />
              <text x={r.x + r.w / 2} y={r.y + r.h / 2 + (r.live ? -6 : 5)} textAnchor="middle"
                fill={selected?.id === r.id ? r.color : r.color + "CC"} fontSize="10" fontWeight="700" fontFamily="system-ui, sans-serif">
                {r.name}
              </text>
              {r.live && (
                <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 9} textAnchor="middle"
                  fill={r.color} fontSize="8.5" fontFamily="system-ui, sans-serif">
                  ● LIVE
                </text>
              )}
            </g>
          ))}
          {/* You are here */}
          <circle cx="195" cy="255" r="6" fill={C.primary} />
          <circle cx="195" cy="255" r="10" fill="none" stroke={C.primary} strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="195" y="278" textAnchor="middle" fill={C.primary} fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">YOU</text>
          {/* Entrance */}
          <text x="154" y="328" textAnchor="middle" fill={C.dim} fontSize="8" fontFamily="system-ui, sans-serif">▼  ENTRANCE</text>
        </svg>
      </div>

      {selected ? (
        <div style={{ margin: "0 20px", padding: "14px 16px", borderRadius: 16, background: selected.color + "15", border: `1px solid ${selected.color}40` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ color: selected.color, fontWeight: 800, fontSize: 16 }}>{selected.name}</span>
            {selected.live && <span style={{ background: selected.color + "25", color: selected.color, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 7 }}>● LIVE</span>}
          </div>
          <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>{selected.current}</p>
        </div>
      ) : (
        <div style={{ margin: "0 20px", padding: "12px 16px", borderRadius: 14, background: C.card, border: `1px solid ${C.border}`, textAlign: "center" }}>
          <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>Tap a room to see what's happening</p>
        </div>
      )}
    </div>
  );
}

// ─── SCREEN: MEETING NOTES ───────────────────────────────────────────────────
function MeetingNotesScreen({ goBack }) {
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const [starred, setStarred] = useState(false);
  const person = PEOPLE[0];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "10px 20px 14px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <BackButton onClick={goBack} />
        <h2 style={{ color: C.text, fontSize: 17, fontWeight: 700, margin: 0, flex: 1 }}>1:1 Meeting</h2>
        <span style={{ color: C.muted, fontSize: 13 }}>13:00 · Table 12</span>
      </div>

      <div style={{ margin: "0 20px 16px", padding: "16px", borderRadius: 18, background: C.card, border: `1px solid ${C.border}`, display: "flex", gap: 14, alignItems: "center", flexShrink: 0 }}>
        <Avatar initials={person.initials} size={56} color={person.color} />
        <div>
          <div style={{ color: C.text, fontWeight: 800, fontSize: 17 }}>{person.name}</div>
          <div style={{ color: C.muted, fontSize: 13, marginBottom: 7 }}>{person.role}</div>
          <div style={{ display: "flex", gap: 5 }}>
            {person.tags.map(t => <Pill key={t} label={t} active small color={person.color} />)}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: "0 20px", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 10 }}>
          <Edit size={14} color={C.primary} />
          <span style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>Meeting Notes</span>
          <span style={{ color: C.dim, fontSize: 12, marginLeft: 4 }}>Private · only visible to you</span>
        </div>
        <textarea
          value={notes}
          onChange={e => { setNotes(e.target.value); setSaved(false); }}
          placeholder={"What did you discuss?\n\nKey takeaways, action items, follow-ups…"}
          style={{
            width: "100%", height: 160,
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 16, padding: "14px 16px",
            color: C.text, fontSize: 13, lineHeight: 1.65,
            resize: "none", outline: "none",
            fontFamily: "inherit", boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
          {["Great conversation", "Potential deal", "Follow up needed", "Reconnect at next event"].map(tag => (
            <button key={tag} onClick={() => { setNotes(n => n + (n ? "\n• " : "• ") + tag); setSaved(false); }} style={{
              padding: "5px 11px", borderRadius: 20,
              background: C.elevated, border: `1px solid ${C.border}`,
              color: C.muted, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>
              + {tag}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 20px 32px", display: "flex", gap: 10, flexShrink: 0 }}>
        <button onClick={() => setStarred(!starred)} style={{
          width: 46, height: 46, borderRadius: 13, flexShrink: 0,
          background: starred ? `${C.amber}20` : C.card,
          border: `1px solid ${starred ? C.amber + "50" : C.border}`,
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}>
          <Star size={18} color={starred ? C.amber : C.muted} fill={starred ? C.amber : "none"} />
        </button>
        <button onClick={() => setSaved(true)} style={{
          flex: 1, padding: "13px",
          borderRadius: 14,
          background: saved ? `${C.green}20` : C.primary,
          border: saved ? `1.5px solid ${C.green}50` : "none",
          color: saved ? C.green : "#fff",
          fontWeight: 700, fontSize: 15, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit",
        }}>
          {saved ? <><Check size={16} /> Saved!</> : <><BookOpen size={16} /> Save Notes</>}
        </button>
      </div>
    </div>
  );
}

// ─── SCREEN: POST-EVENT ──────────────────────────────────────────────────────
function PostEventScreen() {
  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ padding: "10px 20px 18px" }}>
        <h2 style={{ color: C.text, fontSize: 22, fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.4px" }}>Day 1 Recap</h2>
        <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>Product Summit 2026 · April 14</p>
      </div>

      {/* Follow-ups */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14 }}>
          <Zap size={15} color={C.primary} />
          <h3 style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: 0 }}>Follow Up on Your 1:1s</h3>
        </div>
        {PEOPLE.slice(0, 2).map(p => (
          <div key={p.id} style={{ marginBottom: 12, padding: "16px", borderRadius: 18, background: `${C.primary}08`, border: `1px solid ${C.primary}22` }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <Avatar initials={p.initials} size={42} color={p.color} />
              <div>
                <div style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                <div style={{ color: C.muted, fontSize: 12 }}>You met today · 1:1 @ Table 12</div>
              </div>
            </div>
            <div style={{ background: C.card, borderRadius: 12, padding: "11px 13px", marginBottom: 12 }}>
              <p style={{ color: C.muted, fontSize: 13, margin: 0, lineHeight: 1.55 }}>
                How did your conversation go? Would you like to send a follow-up or schedule a next call?
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn size="sm" style={{ flex: 1 }}>Message {p.name.split(" ")[0]}</Btn>
              <Btn size="sm" variant="ghost" style={{ flex: 1, border: `1px solid ${C.border}`, color: C.muted }}>Later</Btn>
            </div>
          </div>
        ))}
      </div>

      {/* Session digests */}
      <div style={{ padding: "0 20px 32px" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14 }}>
          <BookOpen size={15} color={C.teal} />
          <h3 style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: 0 }}>Sessions You Missed</h3>
        </div>
        {[
          { title: "Building Inclusive Products", speaker: "Mia Torres · Hall B", summary: "Accessible design as a market differentiator — 3 key frameworks shared, including the POUR model and contrast audit tools." },
          { title: "Design Systems at Scale", speaker: "Valentina Cruz · Workshop Room", summary: "Token architecture, multi-brand support, and migration strategies from legacy design systems. Figma Variables deep dive." },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: 12, padding: "16px", borderRadius: 18, background: C.card, border: `1px solid ${C.border}` }}>
            <div style={{ color: C.text, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{s.title}</div>
            <div style={{ color: C.muted, fontSize: 12, marginBottom: 10 }}>{s.speaker}</div>
            <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: "0 0 12px" }}>{s.summary}</p>
            <button style={{ background: "none", border: "none", color: C.primary, fontWeight: 700, fontSize: 13, cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
              Read full digest →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DEMO MODE SWITCHER ──────────────────────────────────────────────────────
function DemoBar({ mode, setMode, setScreen, setTab }) {
  return (
    <div style={{
      display: "flex", gap: 6, padding: "5px 14px",
      background: C.surface, borderBottom: `1px solid ${C.border}`,
      alignItems: "center", flexShrink: 0,
    }}>
      <span style={{ color: C.dim, fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", marginRight: 2 }}>DEMO</span>
      {[
        { id: "pre", label: "Pre-Event", color: C.primary, screen: "home", tab: "home" },
        { id: "event", label: "During Event", color: C.coral, screen: "event-now", tab: "now" },
        { id: "post", label: "Post-Event", color: C.teal, screen: "post-event", tab: "home" },
      ].map(({ id, label, color, screen, tab }) => (
        <button key={id} onClick={() => { setMode(id); setScreen(screen); setTab(tab); }} style={{
          padding: "3px 10px", borderRadius: 8,
          background: mode === id ? color + "25" : "transparent",
          border: `1px solid ${mode === id ? color + "60" : C.border}`,
          color: mode === id ? color : C.dim,
          fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
        }}>
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("splash");
  const [tab, setTab] = useState("home");
  const [mode, setMode] = useState("pre"); // pre | event | post
  const [person, setPerson] = useState(null);

  const nav = (s) => setScreen(s);

  const handleTab = (id) => {
    setTab(id);
    if (mode === "event") {
      if (id === "now") nav("event-now");
      else if (id === "schedule") nav("event-detail");
      else if (id === "map") nav("event-map");
      else if (id === "network") nav("pre-event");
    } else {
      if (id === "home") nav("home");
      else if (id === "discover") nav("pre-event");
      else if (id === "schedule") nav("event-detail");
      else if (id === "profile") nav("home");
    }
  };

  const goBack = () => {
    const map = {
      "event-detail": "home",
      "pre-event": "home",
      "person-profile": "pre-event",
      "event-map": "event-now",
      "meeting-notes": "event-now",
      "post-event": "event-now",
    };
    nav(map[screen] || "home");
  };

  const isShell = !["splash", "onboarding"].includes(screen);
  const hideNav = ["meeting-notes", "person-profile"].includes(screen);

  const renderScreen = () => {
    switch (screen) {
      case "splash":       return <SplashScreen onNext={() => nav("onboarding")} />;
      case "onboarding":   return <OnboardingScreen onNext={() => { setMode("pre"); nav("home"); }} />;
      case "home":         return <HomeScreen nav={nav} setPerson={setPerson} />;
      case "event-detail": return <EventDetailScreen goBack={goBack} />;
      case "pre-event":    return <PreEventScreen goBack={goBack} setPerson={setPerson} nav={nav} />;
      case "person-profile": return <PersonProfileScreen person={person} goBack={goBack} />;
      case "event-now":    return <EventNowScreen nav={nav} />;
      case "event-map":    return <MapScreen />;
      case "meeting-notes": return <MeetingNotesScreen goBack={goBack} />;
      case "post-event":   return <PostEventScreen />;
      default:             return <HomeScreen nav={nav} setPerson={setPerson} />;
    }
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", background: "#030307",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Segoe UI', sans-serif",
      padding: "20px",
    }}>
      {/* Phone frame */}
      <div style={{
        width: 390, height: 844,
        background: C.bg, borderRadius: 52,
        border: "8px solid #1A1A30",
        boxShadow: `0 0 0 1px #26264A, 0 40px 100px rgba(0,0,0,0.9), 0 0 80px ${C.primary}20`,
        display: "flex", flexDirection: "column",
        overflow: "hidden", position: "relative",
      }}>
        <StatusBar />

        {isShell && (
          <DemoBar mode={mode} setMode={setMode} setScreen={setScreen} setTab={setTab} />
        )}

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {renderScreen()}
        </div>

        {isShell && !hideNav && (
          <BottomNav active={tab} onSelect={handleTab} mode={mode === "event" ? "event" : "pre"} />
        )}
      </div>
    </div>
  );
}
