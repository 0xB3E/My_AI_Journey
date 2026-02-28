import { useState, useEffect, useRef, useCallback } from "react";

const SECTIONS = ["home", "about", "activity", "portfolio", "writings", "projects", "contact"];

function MouseGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  useEffect(() => { const h = (e) => setPos({ x: e.clientX, y: e.clientY }); window.addEventListener("mousemove", h); return () => window.removeEventListener("mousemove", h); }, []);
  return <div style={{ position: "fixed", top: pos.y - 200, left: pos.x - 200, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", pointerEvents: "none", zIndex: 1, transition: "top 0.1s ease-out, left 0.1s ease-out" }} />;
}

function FadeIn({ children, delay = 0, direction = "up" }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => { const el = ref.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.unobserve(el); } }, { threshold: 0.12 }); obs.observe(el); return () => obs.disconnect(); }, []);
  const t = { up: "translateY(40px)", down: "translateY(-40px)", left: "translateX(40px)", right: "translateX(-40px)" };
  return <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translate(0)" : t[direction], transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>{children}</div>;
}

function GlowCard({ children, style = {}, onClick }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hov, setHov] = useState(false);
  const [gp, setGp] = useState({ x: 50, y: 50 });
  const handleMove = useCallback((e) => { const r = ref.current?.getBoundingClientRect(); if (!r) return; setTilt({ x: ((e.clientX - r.left) / r.width - 0.5) * 12, y: ((e.clientY - r.top) / r.height - 0.5) * -12 }); setGp({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }, []);
  return (
    <div ref={ref} onMouseMove={handleMove} onMouseEnter={() => setHov(true)} onMouseLeave={() => { setHov(false); setTilt({ x: 0, y: 0 }); }} onClick={onClick}
      style={{ position: "relative", background: "rgba(15,18,35,0.7)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 16, padding: "28px 24px", transform: `perspective(800px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale(${hov ? 1.02 : 1})`, transition: hov ? "transform 0.1s ease" : "transform 0.4s ease", overflow: "hidden", backdropFilter: "blur(10px)", cursor: onClick ? "pointer" : "default", ...style }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: 16, pointerEvents: "none", background: hov ? `radial-gradient(circle at ${gp.x}% ${gp.y}%, rgba(99,102,241,0.2) 0%, transparent 60%)` : "none" }} />
      <div style={{ position: "absolute", top: -1, left: -1, right: -1, bottom: -1, borderRadius: 16, pointerEvents: "none", border: hov ? "1px solid rgba(99,102,241,0.4)" : "1px solid transparent", transition: "border 0.3s ease" }} />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
}

function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => { const c = canvasRef.current; if (!c) return; const ctx = c.getContext("2d"); let w = c.width = window.innerWidth, h = c.height = window.innerHeight * 8; const ps = Array.from({ length: 50 }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.5 + 0.5, dx: (Math.random() - 0.5) * 0.3, dy: (Math.random() - 0.5) * 0.3, o: Math.random() * 0.3 + 0.1 })); let id; const draw = () => { ctx.clearRect(0, 0, w, h); ps.forEach(p => { p.x += p.dx; p.y += p.dy; if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(129,140,248,${p.o})`; ctx.fill(); }); id = requestAnimationFrame(draw); }; draw(); const resize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight * 8; }; window.addEventListener("resize", resize); return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); }; }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

function Nav({ active }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? "rgba(5,5,20,0.85)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(99,102,241,0.1)" : "1px solid transparent", transition: "all 0.3s ease" }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800 }}><span style={{ background: "linear-gradient(135deg, #818cf8, #6366f1, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Iso</span></div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {SECTIONS.map((s) => (<button key={s} onClick={() => scrollTo(s)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: active === s ? "#818cf8" : "rgba(255,255,255,0.5)", transition: "color 0.3s ease", padding: "4px 0", borderBottom: active === s ? "1px solid #818cf8" : "1px solid transparent" }}>{s}</button>))}
      </div>
    </nav>
  );
}

function GitHubHeatmap() {
  const [hoveredDay, setHoveredDay] = useState(null);
  const today = new Date(2026, 1, 28);
  const startOfMonth = new Date(2026, 1, 1);
  const days = [];
  for (let d = new Date(startOfMonth); d <= today; d.setDate(d.getDate() + 1)) {
    const dow = d.getDay(), date = d.getDate();
    let commits = 0;
    if (dow > 0 && dow < 6) commits = Math.floor(Math.random() * 6) + 1;
    else commits = Math.random() > 0.4 ? Math.floor(Math.random() * 3) + 1 : 0;
    if (date === 28 || date === 15 || date === 10 || date === 22) commits = Math.floor(Math.random() * 4) + 5;
    if (date === 1) commits = 3;
    days.push({ date: new Date(d), commits, dayOfWeek: dow, dateNum: date });
  }
  const totalCommits = days.reduce((s, d) => s + d.commits, 0);
  const activeDays = days.filter(d => d.commits > 0).length;
  const maxStreak = (() => { let max = 0, cur = 0; days.forEach(d => { if (d.commits > 0) { cur++; max = Math.max(max, cur); } else cur = 0; }); return max; })();
  const getColor = (c) => c === 0 ? "rgba(255,255,255,0.04)" : c <= 2 ? "rgba(99,102,241,0.3)" : c <= 4 ? "rgba(99,102,241,0.55)" : c <= 6 ? "rgba(129,140,248,0.75)" : "rgba(167,139,250,0.95)";
  const weeks = [];
  let cw = [];
  for (let i = 0; i < days[0]?.dayOfWeek; i++) cw.push(null);
  days.forEach(d => { cw.push(d); if (d.dayOfWeek === 6) { weeks.push(cw); cw = []; } });
  if (cw.length > 0) weeks.push(cw);
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div>
      <div style={{ display: "flex", gap: 24, marginBottom: 24, flexWrap: "wrap" }}>
        {[{ label: "Total Contributions", value: totalCommits, icon: "\u{1F525}" }, { label: "Active Days", value: `${activeDays}/${days.length}`, icon: "\u{1F4C5}" }, { label: "Longest Streak", value: `${maxStreak} days`, icon: "\u26A1" }].map((s, i) => (
          <div key={i} style={{ flex: 1, minWidth: 120, background: "rgba(99,102,241,0.06)", borderRadius: 12, padding: "16px 20px", border: "1px solid rgba(99,102,241,0.1)" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#818cf8" }}>{s.value}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(15,18,35,0.5)", borderRadius: 12, padding: 20, border: "1px solid rgba(99,102,241,0.1)" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {dayLabels.map((l, i) => (<div key={i} style={{ height: 18, width: 28, display: "flex", alignItems: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{l}</div>))}
          </div>
          <div style={{ display: "flex", gap: 4, flex: 1 }}>
            {weeks.map((week, wi) => (
              <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                {week.map((day, di) => (<div key={di} onMouseEnter={() => day && setHoveredDay(day)} onMouseLeave={() => setHoveredDay(null)} style={{ height: 18, borderRadius: 3, background: day ? getColor(day.commits) : "transparent", transition: "all 0.2s ease", transform: hoveredDay === day ? "scale(1.4)" : "scale(1)", boxShadow: hoveredDay === day && day?.commits > 0 ? `0 0 12px ${getColor(day.commits)}` : "none" }} />))}
                {Array.from({ length: 7 - week.length }).map((_, i) => (<div key={`p-${i}`} style={{ height: 18 }} />))}
              </div>
            ))}
          </div>
        </div>
        {hoveredDay && (<div style={{ marginTop: 12, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.6)" }}><span style={{ color: "#818cf8" }}>Feb {hoveredDay.dateNum}</span> {"\u2014"} {hoveredDay.commits} contribution{hoveredDay.commits !== 1 ? "s" : ""}</div>)}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Less</span>
          {[0, 1, 3, 5, 7].map(c => (<div key={c} style={{ width: 14, height: 14, borderRadius: 3, background: getColor(c) }} />))}
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>More</span>
        </div>
      </div>
    </div>
  );
}

function StockPortfolio() {
  const [activeTab, setActiveTab] = useState("all");
  const [hoveredTicker, setHoveredTicker] = useState(null);
  const holdings = {
    stocks: [
      { ticker: "AAPL", name: "Apple Inc.", ytd: -2.6, price: 264.58, category: "Tech" },
      { ticker: "FCX", name: "Freeport-McMoRan", ytd: 12.2, price: 68.08, category: "Mining" },
      { ticker: "KRKNF", name: "Kraken Robotics", ytd: 15.8, price: 6.30, category: "Defense Tech" },
    ],
    etfs: [
      { ticker: "OIH", name: "VanEck Oil Services", ytd: 10.5, price: 313.63, category: "Energy" },
      { ticker: "XLE", name: "Energy Select SPDR", ytd: 19.1, price: 51.20, category: "Energy" },
      { ticker: "ACWX", name: "MSCI ACWI ex U.S.", ytd: 8.4, price: 57.80, category: "Int'l Equity" },
      { ticker: "IHE", name: "U.S. Pharmaceuticals", ytd: 9.7, price: 186.40, category: "Healthcare" },
      { ticker: "IVV", name: "Core S&P 500", ytd: -0.1, price: 602.50, category: "Large Cap" },
    ],
    crypto: [
      { ticker: "BTC", name: "Bitcoin", ytd: -29.5, price: 65883, category: "Layer 1" },
      { ticker: "ETH", name: "Ethereum", ytd: -42.4, price: 1929, category: "Layer 1" },
      { ticker: "LINK", name: "Chainlink", ytd: -62.2, price: 8.31, category: "Oracle" },
    ],
  };
  const all = activeTab === "all" ? [...holdings.stocks, ...holdings.etfs, ...holdings.crypto] : holdings[activeTab] || [];
  const avgYTD = all.reduce((s, h) => s + h.ytd, 0) / all.length;
  const winners = all.filter(h => h.ytd > 0).length;
  const losers = all.filter(h => h.ytd < 0).length;
  const tabs = [{ id: "all", label: "All", count: 11 }, { id: "stocks", label: "Stocks", count: 3 }, { id: "etfs", label: "ETFs", count: 5 }, { id: "crypto", label: "Crypto", count: 3 }];

  return (
    <div>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        {[{ label: "Avg YTD Return", value: `${avgYTD >= 0 ? "+" : ""}${avgYTD.toFixed(1)}%`, color: avgYTD >= 0 ? "#34d399" : "#f87171" }, { label: "Winners", value: winners, color: "#34d399" }, { label: "Losers", value: losers, color: "#f87171" }].map((s, i) => (
          <div key={i} style={{ flex: 1, minWidth: 100, background: "rgba(15,18,35,0.7)", borderRadius: 12, padding: "16px 20px", border: "1px solid rgba(99,102,241,0.1)", textAlign: "center" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {tabs.map(t => (<button key={t.id} onClick={() => setActiveTab(t.id)} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer", background: activeTab === t.id ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)", color: activeTab === t.id ? "#818cf8" : "rgba(255,255,255,0.4)", transition: "all 0.2s ease" }}>{t.label} <span style={{ opacity: 0.5 }}>({t.count})</span></button>))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {all.map((h, i) => (
          <FadeIn key={h.ticker} delay={i * 0.05}>
            <div onMouseEnter={() => setHoveredTicker(h.ticker)} onMouseLeave={() => setHoveredTicker(null)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderRadius: 12, background: hoveredTicker === h.ticker ? "rgba(99,102,241,0.08)" : "rgba(15,18,35,0.5)", border: `1px solid ${hoveredTicker === h.ticker ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.06)"}`, transition: "all 0.2s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: h.ytd >= 0 ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)", border: `1px solid ${h.ytd >= 0 ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"}`, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: h.ytd >= 0 ? "#34d399" : "#f87171" }}>{h.ytd >= 0 ? "\u2191" : "\u2193"}</div>
                <div><div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15 }}>{h.ticker}</div><div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{h.name}</div></div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <div style={{ textAlign: "right" }}><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>${h.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{h.category}</div></div>
                <div style={{ minWidth: 72, textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, color: h.ytd >= 0 ? "#34d399" : "#f87171" }}>{h.ytd >= 0 ? "+" : ""}{h.ytd.toFixed(1)}%</div>
                <div style={{ width: 60, height: 24, display: "flex", alignItems: "center" }}><div style={{ height: 6, borderRadius: 3, width: `${Math.min(Math.abs(h.ytd) / 65 * 100, 100)}%`, minWidth: 4, background: h.ytd >= 0 ? "linear-gradient(90deg, rgba(52,211,153,0.3), #34d399)" : "linear-gradient(90deg, rgba(248,113,113,0.3), #f87171)" }} /></div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
      <div style={{ marginTop: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>Data as of Feb 28, 2026 · For informational purposes only · Not financial advice</div>
    </div>
  );
}

function WritingsSection() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const articles = [
    { title: "Getting Started with AI: My First Week", date: "Coming Soon", tags: ["AI", "Beginner", "Learning"], description: "A first-hand account of what it's like to start learning AI tools from scratch.", status: "draft" },
    { title: "Why I'm Documenting My Coding Journey", date: "Coming Soon", tags: ["Reflection", "GitHub", "Growth"], description: "The benefits of learning in public and tracking your progress as a beginner.", status: "draft" },
    { title: "Building My Portfolio Site with Claude", date: "Coming Soon", tags: ["Web Dev", "AI", "React"], description: "How I used AI assistance to build a polished portfolio site as a coding beginner.", status: "draft" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {articles.map((a, i) => (
        <FadeIn key={i} delay={i * 0.1}>
          <div onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} style={{ display: "flex", gap: 20, padding: 24, borderRadius: 16, background: hoveredIdx === i ? "rgba(99,102,241,0.06)" : "rgba(15,18,35,0.5)", border: `1px solid ${hoveredIdx === i ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.08)"}`, transition: "all 0.3s ease", cursor: "pointer" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 48, fontWeight: 800, lineHeight: 1, background: hoveredIdx === i ? "linear-gradient(135deg, #818cf8, #c084fc)" : "linear-gradient(135deg, rgba(129,140,248,0.2), rgba(192,132,252,0.2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", transition: "all 0.3s ease", minWidth: 50 }}>{String(i + 1).padStart(2, "0")}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, padding: "3px 10px", borderRadius: 10, background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)", textTransform: "uppercase", letterSpacing: 1 }}>Coming Soon</span>
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 6, color: hoveredIdx === i ? "#fff" : "rgba(255,255,255,0.85)", transition: "color 0.3s ease" }}>{a.title}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: 10 }}>{a.description}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {a.tags.map(t => (<span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, padding: "3px 10px", borderRadius: 10, background: "rgba(99,102,241,0.08)", color: "rgba(129,140,248,0.7)", border: "1px solid rgba(99,102,241,0.12)" }}>{t}</span>))}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", fontSize: 20, color: hoveredIdx === i ? "#818cf8" : "rgba(255,255,255,0.15)", transform: hoveredIdx === i ? "translateX(4px)" : "translateX(0)", transition: "all 0.3s ease" }}>{"\u2192"}</div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

function SocialIcon({ svg, url, label }) {
  const [isHov, setIsHov] = useState(false);
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" aria-label={label}
      onMouseEnter={() => setIsHov(true)} onMouseLeave={() => setIsHov(false)}
      style={{ color: isHov ? "#818cf8" : "rgba(255,255,255,0.4)", transition: "all 0.3s ease", transform: isHov ? "translateY(-4px) scale(1.15)" : "translateY(0) scale(1)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", filter: isHov ? "drop-shadow(0 0 12px rgba(129,140,248,0.4))" : "none" }}>
      {svg}
    </a>
  );
}

export default function Portfolio() {
  const [active, setActive] = useState("home");
  useEffect(() => { const h = () => { for (const id of [...SECTIONS].reverse()) { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < window.innerHeight / 2) { setActive(id); break; } } }; window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const sec = { position: "relative", zIndex: 2, maxWidth: 920, margin: "0 auto", padding: "120px 24px" };
  const hd = { fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: -1 };
  const gr = { background: "linear-gradient(135deg, #818cf8, #6366f1, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" };
  const sub = { color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.7 };
  const lb = { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: 3, color: "rgba(129,140,248,0.5)", textTransform: "uppercase", marginBottom: 12 };

  return (
    <div style={{ background: "#050514", color: "#fff", minHeight: "100vh", position: "relative", overflowX: "hidden", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}body{background:#050514}::selection{background:rgba(99,102,241,0.4);color:#fff}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#050514}::-webkit-scrollbar-thumb{background:rgba(99,102,241,0.3);border-radius:3px}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}@keyframes pulse-glow{0%,100%{box-shadow:0 0 20px rgba(99,102,241,0.2)}50%{box-shadow:0 0 40px rgba(99,102,241,0.4)}}`}</style>
      <MouseGlow /><Particles /><Nav active={active} />

      {/* HERO */}
      <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: "10%", left: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", animation: "float 8s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "10%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)", animation: "float 10s ease-in-out infinite 2s", pointerEvents: "none" }} />
        <div style={{ textAlign: "center", position: "relative", zIndex: 2, padding: "0 24px" }}>
          <FadeIn><div style={{ ...lb, marginBottom: 20 }}>Enter the realm</div></FadeIn>
          <FadeIn delay={0.15}><h1 style={{ ...hd, fontSize: "clamp(40px, 7vw, 80px)", lineHeight: 1.05, marginBottom: 24 }}>I'm <span style={gr}>Iso</span></h1></FadeIn>
          <FadeIn delay={0.3}><p style={{ ...sub, fontSize: 18, maxWidth: 560, margin: "0 auto 36px", fontStyle: "italic", color: "rgba(255,255,255,0.65)" }}>No spellbook. No rules. Just a wild mage loose on the internet {"\u2014"} explore at your own risk.</p></FadeIn>
          <FadeIn delay={0.45}><div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })} style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15, padding: "14px 32px", borderRadius: 50, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", animation: "pulse-glow 3s ease-in-out infinite" }}>Who is Iso?</button>
            <button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })} style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15, padding: "14px 32px", borderRadius: 50, cursor: "pointer", background: "transparent", color: "#818cf8", border: "1px solid rgba(99,102,241,0.3)" }}>See My Work</button>
          </div></FadeIn>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={sec}>
        <FadeIn><div style={lb}>Who is Iso</div><h2 style={{ ...hd, fontSize: "clamp(28px, 4vw, 44px)", marginBottom: 12 }}>The full <span style={gr}>character sheet.</span></h2><p style={{ ...sub, marginBottom: 32, maxWidth: 700 }}>Part mage, part investor, part gamer, part builder. Dedicated to the stoic path of lifelong learning {"\u2014"} always growing, never finished.</p></FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {[
            { icon: "\u{1F9D9}\u200D\u2642\uFE0F", title: "The Wild Mage", desc: "No spellbook, no class restrictions. I learn what interests me, build what excites me, and share what I discover. AI, code, markets, games \u2014 it all feeds the same fire." },
            { icon: "\u{1F4DA}", title: "The Student", desc: "Rooted in stoic philosophy and a deep commitment to lifelong learning. Every day is a chance to get 1% better. The obstacle is the way, and the journey never ends." },
            { icon: "\u{1F4C8}", title: "The Investor", desc: "My investment philosophy is built on fundamental analysis \u2014 understanding what a business actually does, what it's worth, and why. I dig into balance sheets, not hype cycles." },
            { icon: "\u{1F3AE}", title: "The Gamer", desc: "Gaming is where strategy meets creativity. Whether it's RPGs, competitive shooters, or indie gems \u2014 games taught me how to think in systems, adapt, and never stop leveling up." },
            { icon: "\u{1F6E0}\uFE0F", title: "The Builder", desc: "Learning to code so I can bring ideas to life. HTML, CSS, JavaScript, Python, and AI tools \u2014 assembling the toolkit piece by piece, project by project." },
            { icon: "\u{1F30D}", title: "The Explorer", desc: "Curiosity is the compass. From decentralized finance to subsea robotics to the next great indie game \u2014 if it's interesting, I'm going down the rabbit hole." },
          ].map((c, i) => (
            <FadeIn key={i} delay={0.08 * (i + 1)} direction={i % 2 === 0 ? "left" : "right"}><GlowCard><div style={{ fontSize: 28, marginBottom: 12 }}>{c.icon}</div><h3 style={{ ...hd, fontSize: 18, marginBottom: 8 }}>{c.title}</h3><p style={sub}>{c.desc}</p></GlowCard></FadeIn>
          ))}
        </div>
      </section>

      {/* GITHUB ACTIVITY */}
      <section id="activity" style={sec}>
        <FadeIn><div style={lb}>GitHub Activity</div><h2 style={{ ...hd, fontSize: "clamp(28px, 4vw, 44px)", marginBottom: 8 }}>Proof of <span style={gr}>work.</span></h2><p style={{ ...sub, marginBottom: 32 }}>My GitHub contributions for February 2026. Hover over the squares to see daily activity.</p></FadeIn>
        <FadeIn delay={0.2}><GitHubHeatmap /></FadeIn>
      </section>

      {/* STOCK PORTFOLIO */}
      <section id="portfolio" style={sec}>
        <FadeIn><div style={lb}>Investment Portfolio</div><h2 style={{ ...hd, fontSize: "clamp(28px, 4vw, 44px)", marginBottom: 8 }}>Where my money <span style={gr}>works.</span></h2><p style={{ ...sub, marginBottom: 32 }}>YTD performance across stocks, ETFs, and crypto. Fundamental analysis first {"\u2014"} long on energy, defense tech, and decentralized infrastructure.</p></FadeIn>
        <FadeIn delay={0.2}><StockPortfolio /></FadeIn>
      </section>

      {/* WRITINGS */}
      <section id="writings" style={sec}>
        <FadeIn><div style={lb}>Writings</div><h2 style={{ ...hd, fontSize: "clamp(28px, 4vw, 44px)", marginBottom: 8 }}>Thoughts & <span style={gr}>lessons.</span></h2><p style={{ ...sub, marginBottom: 32 }}>Blog posts and articles about what I'm learning. New posts coming soon.</p></FadeIn>
        <FadeIn delay={0.2}><WritingsSection /></FadeIn>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={sec}>
        <FadeIn><div style={lb}>Projects</div><h2 style={{ ...hd, fontSize: "clamp(28px, 4vw, 44px)", marginBottom: 40 }}>Things I've <span style={gr}>built.</span></h2></FadeIn>
        {[{ icon: "\u{1F4D3}", title: "My_AI_Journey", label: "GITHUB REPO", desc: "A GitHub repository documenting my learning journey into AI tools and coding.", tags: ["Markdown", "GitHub", "Documentation"], gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)" }, { icon: "\u{1F310}", title: "This Portfolio Site", label: "WEB PROJECT", desc: "A portfolio with scroll animations, mouse-reactive glow, stock tracker, and GitHub activity heatmap.", tags: ["React", "CSS", "Animations", "JavaScript"], gradient: "linear-gradient(135deg, #8b5cf6, #c084fc)" }].map((p, i) => (
          <FadeIn key={i} delay={0.1 * (i + 1)}><GlowCard style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: p.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{p.icon}</div>
              <div><h3 style={{ ...hd, fontSize: 18 }}>{p.title}</h3><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(129,140,248,0.5)" }}>{p.label}</span></div>
            </div>
            <p style={{ ...sub, marginBottom: 16 }}>{p.desc}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{p.tags.map(t => <span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, padding: "4px 12px", borderRadius: 20, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "rgba(129,140,248,0.8)" }}>{t}</span>)}</div>
          </GlowCard></FadeIn>
        ))}
        <FadeIn delay={0.3}><GlowCard><div style={{ textAlign: "center", padding: "20px 0" }}><div style={{ fontSize: 36, marginBottom: 12 }}>{"\u{1F52E}"}</div><h3 style={{ ...hd, fontSize: 18, marginBottom: 8 }}>More Coming Soon</h3><p style={sub}>I'm learning every day. New projects will appear here as I build them.</p></div></GlowCard></FadeIn>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ ...sec, paddingBottom: 60 }}>
        <FadeIn><div style={{ textAlign: "center" }}><div style={lb}>Connect</div><h2 style={{ ...hd, fontSize: "clamp(28px, 4vw, 44px)", marginBottom: 16 }}>Find me in <span style={gr}>the wild.</span></h2><p style={{ ...sub, maxWidth: 450, margin: "0 auto 40px" }}>Always open to connecting with fellow learners, builders, and adventurers.</p></div></FadeIn>
        <FadeIn delay={0.2}><div style={{ display: "flex", gap: 32, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
          <SocialIcon label="X" url="https://x.com" svg={<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>} />
          <SocialIcon label="Instagram" url="https://instagram.com" svg={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>} />
          <SocialIcon label="GitHub" url="https://github.com/0xB3E" svg={<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>} />
        </div></FadeIn>
      </section>

      <footer style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "40px 24px", borderTop: "1px solid rgba(99,102,241,0.1)" }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.25)" }}>Built with curiosity & Claude {"\u2014"} Iso {"\u00A9"} 2025</p>
      </footer>
    </div>
  );
}
