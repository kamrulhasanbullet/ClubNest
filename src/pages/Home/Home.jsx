import { useQuery } from "@tanstack/react-query";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  FaSearch,
  FaUsers,
  FaCalendarAlt,
  FaCreditCard,
  FaArrowRight,
  FaCheckCircle,
  FaBolt,
  FaShieldAlt,
  FaGlobe,
  FaStar,
  FaMapMarkerAlt,
  FaFire,
} from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import { HomeIcon } from "lucide-react";

/* ── FONT INJECTION ──────────────────────────── */
const FontLoader = () => {
  useEffect(() => {
    const l = document.createElement("link");
    l.href =
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,700;12..96,800&family=Outfit:wght@300;400;500;600&display=swap";
    l.rel = "stylesheet";
    document.head.appendChild(l);
  }, []);
  return null;
};

/* ── FETCH ──────────────────────────────────── */
const fetchAllClubs = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/clubs`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

const fetchStats = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/stats`);
    if (!res.ok) return { totalMembers: 0 };
    return res.json();
  } catch {
    return { totalMembers: 0 };
  }
};

const fetchEvents = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/events`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

/* ── ANIMATED COUNTER ───────────────────────── */
const Counter = ({ to, duration = 1800 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration, bounce: 0 });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (isInView) mv.set(to);
  }, [isInView, to, mv]);
  useEffect(() => spring.on("change", (v) => setVal(Math.floor(v))), [spring]);
  return <span ref={ref}>{val.toLocaleString()}</span>;
};

/* ── CYCLING HEADLINE ───────────────────────── */
const words = [
  "Photography",
  "Technology",
  "Fitness",
  "Music",
  "Cooking",
  "Sports",
];
const CycleWord = () => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % words.length), 2500);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      key={i}
      style={{
        background: "linear-gradient(135deg, #4f46e5 0%, #f97316 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        display: "inline-block",
        animation: "wordSlide 0.5s cubic-bezier(.22,1,.36,1) forwards",
      }}
    >
      {words[i]}
    </span>
  );
};

/* ── TICKER ITEM ────────────────────────────── */
const TickerItem = ({ text }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      paddingRight: 40,
      whiteSpace: "nowrap",
    }}
  >
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#f97316",
        flexShrink: 0,
      }}
    />
    {text}
  </span>
);

/* ── DATA ───────────────────────────────────── */
const categories = [
  { name: "Photography", icon: "📸", color: "#fef3c7", accent: "#d97706" },
  { name: "Technology", icon: "💻", color: "#ede9fe", accent: "#7c3aed" },
  { name: "Sports", icon: "⚽", color: "#dcfce7", accent: "#16a34a" },
  { name: "Books", icon: "📚", color: "#fce7f3", accent: "#db2777" },
  { name: "Music", icon: "🎵", color: "#dbeafe", accent: "#2563eb" },
  { name: "Cooking", icon: "🍳", color: "#ffedd5", accent: "#ea580c" },
  { name: "Art", icon: "🎨", color: "#f0fdf4", accent: "#15803d" },
  { name: "Fitness", icon: "💪", color: "#fef2f2", accent: "#dc2626" },
  { name: "Gaming", icon: "🎮", color: "#f3e8ff", accent: "#9333ea" },
  { name: "Travel", icon: "✈️", color: "#e0f2fe", accent: "#0369a1" },
];

const steps = [
  {
    num: "01",
    icon: FaSearch,
    title: "Discover Clubs",
    desc: "Search hundreds of communities by category, location, or membership type.",
  },
  {
    num: "02",
    icon: FaUsers,
    title: "Join & Connect",
    desc: "One-click membership — free or paid. Instant access to your community.",
  },
  {
    num: "03",
    icon: FaCalendarAlt,
    title: "Attend Events",
    desc: "RSVP to exclusive events and build real friendships that last.",
  },
  {
    num: "04",
    icon: FaCreditCard,
    title: "Seamless Payments",
    desc: "Secure Stripe-powered transactions. Pay once, enjoy always.",
  },
];

const features = [
  {
    icon: FaBolt,
    label: "Instant Discovery",
    desc: "Smart search with filters — find the right club in seconds.",
    color: "#f97316",
  },
  {
    icon: FaShieldAlt,
    label: "Verified Clubs",
    desc: "Every club is admin-reviewed before going live.",
    color: "#4f46e5",
  },
  {
    icon: FaGlobe,
    label: "Role-Based Access",
    desc: "Admin, Manager, Member — each with tailored dashboards.",
    color: "#16a34a",
  },
  {
    icon: FaCheckCircle,
    label: "Stripe Payments",
    desc: "World-class payment infrastructure for paid memberships.",
    color: "#db2777",
  },
];

const testimonials = [
  {
    name: "Aryan Hossain",
    role: "Photography Club Member",
    stars: 5,
    text: "Found my tribe through ClubNest. The photography community here is incredibly welcoming.",
    avatar: "AH",
    color: "#4f46e5",
  },
  {
    name: "Nadia Islam",
    role: "Tech Club Manager",
    stars: 5,
    text: "Managing my club is effortless. Events, members, payments — everything in one place.",
    avatar: "NI",
    color: "#f97316",
  },
  {
    name: "Rifat Chowdhury",
    role: "Fitness Enthusiast",
    stars: 5,
    text: "Joined 3 clubs in one week. The UI is so clean and the whole process just works.",
    avatar: "RC",
    color: "#16a34a",
  },
];

/* MAIN COMPONENT */
export const Home = () => {
  const navigate = useNavigate();

  const { data: allClubs = [], isLoading } = useQuery({
    queryKey: ["allClubs"],
    queryFn: fetchAllClubs,
  });
  const { data: allEvents = [] } = useQuery({
    queryKey: ["allEvents"],
    queryFn: fetchEvents,
  });

  const approvedClubs = allClubs.filter((c) => c.status === "approved");

  const featuredClubs = [...approvedClubs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);
  const freeClubs = approvedClubs.filter(
    (c) => !c.membershipFee || c.membershipFee === 0,
  ).length;

  const { data: stats = { totalMembers: 0 } } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
  });

  const upcomingEvents = allEvents.filter(
    (e) => new Date(e.eventDate) > new Date(),
  );

  const dynamicStats = [
    {
      label: "Active Clubs",
      value: approvedClubs.length || 120,
      suffix: "+",
      icon: "🏛️",
    },
    { label: "Members", value: stats.totalMembers || 8400, suffix: "+", icon: "👥" },
    {
      label: "Upcoming Events",
      value: upcomingEvents.length || 340,
      suffix: "+",
      icon: "📅",
    },
    { label: "Free Clubs", value: freeClubs || 60, suffix: "+", icon: "🎁" },
  ];

  const tickerTexts = [
    `${approvedClubs.length || "100+"} clubs now live`,
    `${upcomingEvents.length || "50+"} upcoming events`,
    "Admin-verified communities only",
    "Stripe-secured payments",
    "Join free in 60 seconds",
    "3 powerful role types",
  ];

  return (
    <>
      <FontLoader />
      <style>{`
        @keyframes wordSlide {
          from { opacity:0; transform:translateY(14px) rotate(-1deg); }
          to   { opacity:1; transform:translateY(0) rotate(0); }
        }
        @keyframes ticker {
          0%   { transform:translateX(0); }
          100% { transform:translateX(-50%); }
        }
        @keyframes floatY {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-10px); }
        }
        .font-bricolage { font-family:'Bricolage Grotesque',sans-serif; }
        .font-outfit    { font-family:'Outfit',sans-serif; }
        .step-card:hover  { transform:translateY(-5px); box-shadow:0 24px 64px rgba(79,70,229,0.12)!important; }
        .club-card:hover  { box-shadow:0 20px 56px rgba(79,70,229,0.13)!important; border-color:rgba(79,70,229,0.25)!important; }
        .club-card:hover .club-img { transform:scale(1.07)!important; }
        .cat-card:hover   { transform:translateY(-5px)!important; box-shadow:0 12px 36px rgba(0,0,0,0.08)!important; }
        .feat-card:hover  { transform:translateY(-3px); box-shadow:0 16px 48px rgba(0,0,0,0.07)!important; }
        .testi-card:hover { transform:translateY(-4px)!important; box-shadow:0 16px 48px rgba(0,0,0,0.07)!important; }
        .ev-card:hover    { transform:translateY(-5px)!important; box-shadow:0 20px 56px rgba(79,70,229,0.1)!important; border-color:rgba(79,70,229,0.2)!important; }
        .swiper-button-next,.swiper-button-prev { color:#4f46e5!important; background:white; border-radius:50%; width:44px!important; height:44px!important; box-shadow:0 4px 20px rgba(0,0,0,0.12); border:1px solid rgba(79,70,229,0.15); }
        .swiper-button-next::after,.swiper-button-prev::after { font-size:13px!important; font-weight:900!important; }
        ::-webkit-scrollbar { display:none; }
      `}</style>

      <div
        className="font-outfit"
        style={{ background: "#fafaf8", color: "#1a1a2e", overflowX: "hidden" }}
      >
        {/* ── TICKER ─────────────────────────────── */}
        <div
          style={{
            background: "#1a1a2e",
            overflow: "hidden",
            padding: "10px 0",
          }}
        >
          <div
            style={{
              display: "flex",
              animation: "ticker 26s linear infinite",
              width: "max-content",
            }}
          >
            {[...tickerTexts, ...tickerTexts].map((t, i) => (
              <TickerItem
                key={i}
                text={
                  <span
                    style={{
                      color: "#cbd5e1",
                      fontSize: "0.77rem",
                      fontWeight: 500,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {t}
                  </span>
                }
              />
            ))}
          </div>
        </div>

        {/* ── HERO ───────────────────────────────── */}
        <section
          style={{
            background:
              "linear-gradient(160deg,#fafaf8 0%,#f0edff 55%,#fff8f2 100%)",
            minHeight: "94vh",
            display: "flex",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* decorative blobs */}
          <div
            style={{
              position: "absolute",
              top: -140,
              right: -140,
              width: 650,
              height: 650,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(79,70,229,0.08) 0%,transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -100,
              left: -100,
              width: 450,
              height: 450,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(249,115,22,0.07) 0%,transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 80,
              right: "8%",
              width: 260,
              height: 260,
              borderRadius: "42% 58% 52% 48%/50% 44% 56% 50%",
              background:
                "linear-gradient(135deg,rgba(79,70,229,0.07),rgba(249,115,22,0.07))",
              animation: "floatY 6s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />

          <div className="container mx-auto px-6 py-28 relative z-10">
            <div
              style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}
            >
              {/* eyebrow pill */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 28,
                  background: "white",
                  border: "1px solid rgba(79,70,229,0.18)",
                  borderRadius: 100,
                  padding: "6px 18px 6px 8px",
                  boxShadow: "0 2px 20px rgba(79,70,229,0.08)",
                }}
              >
                <span
                  style={{
                    background: "linear-gradient(135deg,#4f46e5,#f97316)",
                    borderRadius: 100,
                    padding: "3px 12px",
                    fontSize: "0.67rem",
                    fontWeight: 700,
                    color: "white",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  New
                </span>
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: "#6b7280",
                    fontWeight: 500,
                  }}
                >
                  Role-based dashboards now live →
                </span>
              </motion.div>

              {/* headline */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-bricolage"
                style={{
                  fontSize: "clamp(3rem, 7.5vw, 6.2rem)",
                  fontWeight: 800,
                  lineHeight: 1.02,
                  letterSpacing: "-0.045em",
                  marginBottom: 26,
                }}
              >
                Find your
                <br />
                <CycleWord />
                <br />
                <span
                  style={{
                    fontWeight: 300,
                    fontSize: "0.62em",
                    color: "#9ca3af",
                    fontStyle: "italic",
                  }}
                >
                  community.
                </span>
              </motion.h1>

              {/* sub */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{
                  fontSize: "1.08rem",
                  color: "#6b7280",
                  lineHeight: 1.75,
                  maxWidth: 480,
                  margin: "0 auto 40px",
                }}
              >
                Join local clubs, attend curated events, and connect with people
                who share your exact passions — all in one place.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Link
                  to="/clubs"
                  className="font-bricolage"
                  style={{
                    background: "#1a1a2e",
                    color: "white",
                    fontWeight: 700,
                    padding: "15px 38px",
                    borderRadius: 16,
                    fontSize: "0.95rem",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 10px 36px rgba(26,26,46,0.22)",
                    transition: "all 0.22s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#4f46e5";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#1a1a2e";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Explore Clubs <FaArrowRight size={13} />
                </Link>
                <Link
                  to="/register"
                  style={{
                    background: "white",
                    color: "#4f46e5",
                    fontWeight: 600,
                    padding: "15px 32px",
                    borderRadius: 16,
                    fontSize: "0.95rem",
                    textDecoration: "none",
                    border: "1.5px solid rgba(79,70,229,0.25)",
                    boxShadow: "0 4px 16px rgba(79,70,229,0.1)",
                    transition: "all 0.22s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#4f46e5";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(79,70,229,0.25)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Create Your Club
                </Link>
              </motion.div>

              {/* trust row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: 20,
                  marginTop: 48,
                  fontSize: "0.78rem",
                  color: "#9ca3af",
                }}
              >
                {[
                  "✓  Free to join",
                  "✓  Admin-verified clubs",
                  "✓  Stripe-secured",
                  "✓  3 role types",
                ].map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── DYNAMIC STATS ──────────────────────── */}
        <section
          style={{
            background: "white",
            borderTop: "1px solid #f3f4f6",
            borderBottom: "1px solid #f3f4f6",
          }}
        >
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {dynamicStats.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  style={{
                    padding: "36px 24px",
                    textAlign: "center",
                    borderRight: i < 3 ? "1px solid #f3f4f6" : "none",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>
                    {s.icon}
                  </div>
                  <div
                    className="font-bricolage"
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      color: "#1a1a2e",
                      marginBottom: 4,
                    }}
                  >
                    <Counter to={s.value} />
                    {s.suffix}
                  </div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "#9ca3af",
                      fontWeight: 600,
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                    }}
                  >
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURED CLUBS ─────────────────────── */}
        <section style={{ padding: "96px 0", background: "#fafaf8" }}>
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: 44,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "0.67rem",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    color: "#f97316",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Community
                </p>
                <h2
                  className="font-bricolage"
                  style={{
                    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    color: "#1a1a2e",
                  }}
                >
                  Latest{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg,#4f46e5,#f97316)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Approved
                  </span>{" "}
                  Clubs
                </h2>
              </div>
              <Link
                to="/clubs"
                style={{
                  color: "#4f46e5",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                View all <FaArrowRight size={11} />
              </Link>
            </motion.div>

            {isLoading ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                  gap: 20,
                }}
              >
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: 300,
                      borderRadius: 20,
                      background: "#f3f4f6",
                      animation: "pulse 1.5s ease-in-out infinite",
                    }}
                  />
                ))}
              </div>
            ) : featuredClubs.length ? (
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                autoplay={{ delay: 3500, pauseOnMouseEnter: true }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 },
                }}
                style={{ paddingBottom: 12 }}
              >
                {featuredClubs.map((club, idx) => (
                  <SwiperSlide key={club._id}>
                    <motion.div
                      className="club-card"
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.04 }}
                      style={{
                        background: "white",
                        borderRadius: 20,
                        overflow: "hidden",
                        border: "1px solid #f3f4f6",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
                        transition: "all 0.25s",
                      }}
                    >
                      <div
                        style={{
                          height: 190,
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        {club.bannerImage ? (
                          <img
                            className="club-img"
                            src={club.bannerImage}
                            alt={club.clubName}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.4s",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              background:
                                "linear-gradient(135deg,#ede9fe,#fce7f3)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "3rem",
                            }}
                          >
                            <HomeIcon />
                          </div>
                        )}
                        <div
                          style={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            background:
                              club.membershipFee > 0 ? "#fef3c7" : "#dcfce7",
                            color:
                              club.membershipFee > 0 ? "#b45309" : "#15803d",
                            border: `1px solid ${club.membershipFee > 0 ? "#fcd34d" : "#86efac"}`,
                            borderRadius: 100,
                            padding: "3px 11px",
                            fontSize: "0.63rem",
                            fontWeight: 700,
                          }}
                        >
                          {club.membershipFee > 0
                            ? `$${club.membershipFee}`
                            : "FREE"}
                        </div>
                        {club.membersCount > 0 && (
                          <div
                            style={{
                              position: "absolute",
                              bottom: 12,
                              left: 12,
                              background: "rgba(255,255,255,0.92)",
                              backdropFilter: "blur(8px)",
                              borderRadius: 100,
                              padding: "3px 10px",
                              fontSize: "0.63rem",
                              fontWeight: 600,
                              color: "#374151",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <FaUsers size={9} style={{ color: "#4f46e5" }} />{" "}
                            {club.membersCount} members
                          </div>
                        )}
                      </div>
                      <div style={{ padding: "18px 20px 22px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 6,
                          }}
                        >
                          <h3
                            className="font-bricolage"
                            style={{
                              fontWeight: 700,
                              fontSize: "0.98rem",
                              color: "#1a1a2e",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              flex: 1,
                              marginRight: 8,
                            }}
                          >
                            {club.clubName}
                          </h3>
                          {club.location && (
                            <span
                              style={{
                                fontSize: "0.63rem",
                                color: "#9ca3af",
                                display: "flex",
                                alignItems: "center",
                                gap: 3,
                                flexShrink: 0,
                              }}
                            >
                              <FaMapMarkerAlt size={8} />
                              {club.location.split(",")[0]}
                            </span>
                          )}
                        </div>
                        <p
                          style={{
                            fontSize: "0.78rem",
                            color: "#9ca3af",
                            lineHeight: 1.5,
                            marginBottom: 16,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {club.description}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.67rem",
                              background: "#f3f4f6",
                              color: "#6b7280",
                              padding: "3px 9px",
                              borderRadius: 6,
                              fontWeight: 600,
                            }}
                          >
                            {club.category}
                          </span>
                          <Link
                            to={`/clubs/${club._id}`}
                            style={{
                              color: "#4f46e5",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              textDecoration: "none",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            View <FaArrowRight size={9} />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "80px 0",
                  color: "#9ca3af",
                }}
              >
                No clubs yet.{" "}
                <Link to="/register" style={{ color: "#4f46e5" }}>
                  Create the first one →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── HOW IT WORKS ───────────────────────── */}
        <section style={{ padding: "96px 0", background: "white" }}>
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ textAlign: "center", marginBottom: 56 }}
            >
              <p
                style={{
                  fontSize: "0.67rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  color: "#f97316",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Process
              </p>
              <h2
                className="font-bricolage"
                style={{
                  fontSize: "clamp(1.8rem,4vw,2.8rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: "#1a1a2e",
                }}
              >
                How ClubNest{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg,#4f46e5,#f97316)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  works
                </span>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-4 gap-6">
              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.09 }}
                  className="step-card"
                  style={{
                    background: "#fafaf8",
                    border: "1px solid #f3f4f6",
                    borderRadius: 20,
                    padding: "28px 24px",
                    transition: "all 0.25s",
                    position: "relative",
                  }}
                >
                  <div
                    className="font-bricolage"
                    style={{
                      fontSize: "3.5rem",
                      fontWeight: 800,
                      letterSpacing: "-0.06em",
                      color: "rgba(79,70,229,0.1)",
                      lineHeight: 1,
                      marginBottom: 16,
                    }}
                  >
                    {s.num}
                  </div>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 14,
                      background: "linear-gradient(135deg,#ede9fe,#ddd6fe)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                    }}
                  >
                    <s.icon style={{ color: "#4f46e5", fontSize: "1rem" }} />
                  </div>
                  <h3
                    className="font-bricolage"
                    style={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "#1a1a2e",
                      marginBottom: 8,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.81rem",
                      color: "#9ca3af",
                      lineHeight: 1.65,
                    }}
                  >
                    {s.desc}
                  </p>
                  {i < 3 && (
                    <div
                      style={{
                        display: "none",
                        position: "absolute",
                        top: 52,
                        right: -14,
                        zIndex: 10,
                        background: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "50%",
                        width: 28,
                        height: 28,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      className="md:flex"
                    >
                      <FaArrowRight size={10} style={{ color: "#4f46e5" }} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ─────────────────────────── */}
        <section
          style={{
            padding: "80px 0",
            background: "#fafaf8",
            overflow: "hidden",
          }}
        >
          <div className="container mx-auto px-6 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "0.67rem",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    color: "#f97316",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Explore
                </p>
                <h2
                  className="font-bricolage"
                  style={{
                    fontSize: "clamp(1.8rem,4vw,2.4rem)",
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    color: "#1a1a2e",
                  }}
                >
                  Browse by{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg,#4f46e5,#f97316)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Category
                  </span>
                </h2>
              </div>
              <Link
                to="/clubs"
                style={{
                  color: "#4f46e5",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  textDecoration: "none",
                }}
              >
                All categories →
              </Link>
            </motion.div>
          </div>
          <div
            style={{
              overflowX: "auto",
              paddingLeft: "max(24px,calc((100vw - 1200px)/2))",
              paddingRight: 24,
              paddingBottom: 8,
              scrollbarWidth: "none",
            }}
          >
            <div style={{ display: "flex", gap: 14, width: "max-content" }}>
              {categories.map((cat, i) => {
                const catCount = approvedClubs.filter(
                  (c) => c.category === cat.name,
                ).length;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="cat-card"
                    onClick={() =>
                      navigate(
                        `/clubs?category=${encodeURIComponent(cat.name)}`,
                      )
                    }
                    style={{
                      background: cat.color,
                      border: `1.5px solid ${cat.accent}22`,
                      borderRadius: 18,
                      padding: "22px 24px",
                      cursor: "pointer",
                      transition: "all 0.22s",
                      textAlign: "center",
                      minWidth: 128,
                      boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
                    }}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: 10 }}>
                      {cat.icon}
                    </div>
                    <div
                      className="font-bricolage"
                      style={{
                        fontWeight: 700,
                        fontSize: "0.86rem",
                        color: "#1a1a2e",
                        marginBottom: 4,
                      }}
                    >
                      {cat.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.68rem",
                        color: cat.accent,
                        fontWeight: 700,
                      }}
                    >
                      {catCount > 0 ? `${catCount} clubs` : "Explore →"}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── UPCOMING EVENTS — NEW Dynamic ──────── */}
        <section style={{ padding: "96px 0", background: "white" }}>
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: 44,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "0.67rem",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    color: "#f97316",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Live Now
                </p>
                <h2
                  className="font-bricolage"
                  style={{
                    fontSize: "clamp(1.8rem,4vw,2.8rem)",
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    color: "#1a1a2e",
                  }}
                >
                  Upcoming{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg,#4f46e5,#f97316)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Events
                  </span>
                </h2>
              </div>
              <Link
                to="/events"
                style={{
                  color: "#4f46e5",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                View all events <FaArrowRight size={11} />
              </Link>
            </motion.div>

            {upcomingEvents.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "64px 0",
                  background: "#fafaf8",
                  borderRadius: 20,
                  border: "1px solid #f3f4f6",
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>📅</div>
                <p style={{ color: "#9ca3af", fontWeight: 500 }}>
                  No upcoming events yet.
                </p>
                <p
                  style={{
                    color: "#d1d5db",
                    fontSize: "0.84rem",
                    marginTop: 4,
                  }}
                >
                  Check back soon or create a club to host events.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {upcomingEvents.slice(0, 6).map((ev, i) => {
                  const isFree =
                    !ev.isPaid || !ev.eventFee || Number(ev.eventFee) === 0;
                  const date = new Date(ev.eventDate);
                  const colors = [
                    "linear-gradient(90deg,#4f46e5,#818cf8)",
                    "linear-gradient(90deg,#f97316,#fb923c)",
                    "linear-gradient(90deg,#16a34a,#4ade80)",
                  ];
                  return (
                    <motion.div
                      key={ev._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      className="ev-card"
                      style={{
                        background: "#fafaf8",
                        border: "1px solid #f3f4f6",
                        borderRadius: 20,
                        overflow: "hidden",
                        transition: "all 0.25s",
                      }}
                    >
                      <div style={{ height: 5, background: colors[i % 3] }} />
                      <div style={{ padding: "22px 24px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 14,
                          }}
                        >
                          <span
                            style={{
                              background: isFree ? "#dcfce7" : "#fef3c7",
                              color: isFree ? "#15803d" : "#b45309",
                              border: `1px solid ${isFree ? "#86efac" : "#fcd34d"}`,
                              borderRadius: 100,
                              padding: "3px 11px",
                              fontSize: "0.63rem",
                              fontWeight: 700,
                            }}
                          >
                            {isFree ? "FREE" : `$${ev.eventFee}`}
                          </span>
                          {ev.maxAttendees && (
                            <span
                              style={{
                                fontSize: "0.67rem",
                                color: "#9ca3af",
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <FaUsers size={9} /> {ev.registeredCount || 0}/
                              {ev.maxAttendees}
                            </span>
                          )}
                        </div>
                        <h3
                          className="font-bricolage"
                          style={{
                            fontWeight: 700,
                            fontSize: "1.05rem",
                            color: "#1a1a2e",
                            marginBottom: 8,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {ev.title}
                        </h3>
                        <p
                          style={{
                            fontSize: "0.78rem",
                            color: "#9ca3af",
                            lineHeight: 1.55,
                            marginBottom: 16,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {ev.description}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 7,
                            marginBottom: 18,
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.74rem",
                              color: "#6b7280",
                              display: "flex",
                              alignItems: "center",
                              gap: 7,
                            }}
                          >
                            <FaCalendarAlt
                              size={10}
                              style={{ color: "#4f46e5" }}
                            />
                            {date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}{" "}
                            ·{" "}
                            {date.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {ev.location && (
                            <span
                              style={{
                                fontSize: "0.74rem",
                                color: "#6b7280",
                                display: "flex",
                                alignItems: "center",
                                gap: 7,
                              }}
                            >
                              <FaMapMarkerAlt
                                size={10}
                                style={{ color: "#f97316" }}
                              />{" "}
                              {ev.location}
                            </span>
                          )}
                          <span
                            style={{
                              fontSize: "0.74rem",
                              color: "#6b7280",
                              display: "flex",
                              alignItems: "center",
                              gap: 7,
                            }}
                          >
                            <FaFire size={10} style={{ color: "#16a34a" }} />{" "}
                            Hosted by {ev.clubName}
                          </span>
                        </div>
                        <Link
                          to={`/events/${ev._id}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                            background: "#1a1a2e",
                            color: "white",
                            padding: "11px 0",
                            borderRadius: 12,
                            fontSize: "0.82rem",
                            fontWeight: 700,
                            textDecoration: "none",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#4f46e5")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "#1a1a2e")
                          }
                        >
                          {isFree
                            ? "Register Free"
                            : `Register — $${ev.eventFee}`}{" "}
                          <FaArrowRight size={10} />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── WHY CLUBNEST — Dark break ──────────── */}
        <section
          style={{
            padding: "96px 0",
            background: "#1a1a2e",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: "80vw",
              height: "80vh",
              background:
                "radial-gradient(ellipse,rgba(79,70,229,0.1) 0%,transparent 65%)",
              pointerEvents: "none",
            }}
          />
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <p
                  style={{
                    fontSize: "0.67rem",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    color: "#f97316",
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  Platform
                </p>
                <h2
                  className="font-bricolage"
                  style={{
                    fontSize: "clamp(2rem,4vw,3.2rem)",
                    fontWeight: 800,
                    letterSpacing: "-0.05em",
                    color: "white",
                    lineHeight: 1.08,
                    marginBottom: 20,
                  }}
                >
                  Everything a club
                  <br />
                  needs, in{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg,#818cf8,#f97316)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    one place.
                  </span>
                </h2>
                <p
                  style={{
                    color: "#6b7280",
                    lineHeight: 1.75,
                    maxWidth: 400,
                    marginBottom: 36,
                    fontSize: "0.94rem",
                  }}
                >
                  ClubNest gives Admins, Club Managers, and Members a
                  purpose-built experience — clean role-based tools with zero
                  bloat.
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Link
                    to="/register"
                    style={{
                      background: "white",
                      color: "#1a1a2e",
                      padding: "13px 28px",
                      borderRadius: 14,
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transition: "all 0.22s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#4f46e5";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.color = "#1a1a2e";
                    }}
                  >
                    Get Started Free <FaArrowRight size={12} />
                  </Link>
                  <Link
                    to="/clubs"
                    style={{
                      color: "#9ca3af",
                      padding: "13px 24px",
                      borderRadius: 14,
                      fontWeight: 600,
                      fontSize: "0.88rem",
                      textDecoration: "none",
                      border: "1px solid rgba(255,255,255,0.1)",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.3)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.1)")
                    }
                  >
                    Browse Clubs
                  </Link>
                </div>
              </motion.div>
              <div className="grid grid-cols-2 gap-4">
                {features.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="feat-card"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 18,
                      padding: "22px 20px",
                      transition: "all 0.25s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.07)";
                      e.currentTarget.style.borderColor = `${f.color}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.04)";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.07)";
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: `${f.color}18`,
                        border: `1px solid ${f.color}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 14,
                      }}
                    >
                      <f.icon style={{ color: f.color }} />
                    </div>
                    <h3
                      className="font-bricolage"
                      style={{
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: "white",
                        marginBottom: 6,
                      }}
                    >
                      {f.label}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#6b7280",
                        lineHeight: 1.6,
                      }}
                    >
                      {f.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── ROLE SHOWCASE — NEW ─────────────────── */}
        <section style={{ padding: "96px 0", background: "#fafaf8" }}>
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ textAlign: "center", marginBottom: 52 }}
            >
              <p
                style={{
                  fontSize: "0.67rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  color: "#f97316",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Roles
              </p>
              <h2
                className="font-bricolage"
                style={{
                  fontSize: "clamp(1.8rem,4vw,2.8rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: "#1a1a2e",
                }}
              >
                Built for{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg,#4f46e5,#f97316)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  everyone
                </span>
              </h2>
              <p
                style={{ color: "#9ca3af", marginTop: 10, fontSize: "0.94rem" }}
              >
                Three roles, one platform.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  role: "Admin",
                  emoji: "🛡️",
                  color: "#dc2626",
                  bg: "#fef2f2",
                  border: "#fecaca",
                  perks: [
                    "Approve & reject clubs",
                    "Manage all users & roles",
                    "View all payments",
                    "Membership analytics",
                  ],
                },
                {
                  role: "Club Manager",
                  emoji: "🏢",
                  color: "#4f46e5",
                  bg: "#eef2ff",
                  border: "#c7d2fe",
                  perks: [
                    "Create & edit clubs",
                    "Manage club members",
                    "Host & manage events",
                    "View registrations & payments",
                  ],
                },
                {
                  role: "Member",
                  emoji: "🙋",
                  color: "#16a34a",
                  bg: "#f0fdf4",
                  border: "#bbf7d0",
                  perks: [
                    "Browse & join clubs",
                    "Free & paid memberships",
                    "Register for events",
                    "Personal payment history",
                  ],
                },
              ].map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    background: r.bg,
                    border: `1.5px solid ${r.border}`,
                    borderRadius: 22,
                    padding: "30px 28px",
                    transition: "transform 0.22s, box-shadow 0.22s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = `0 20px 60px ${r.color}18`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ fontSize: "2.3rem", marginBottom: 14 }}>
                    {r.emoji}
                  </div>
                  <h3
                    className="font-bricolage"
                    style={{
                      fontWeight: 800,
                      fontSize: "1.2rem",
                      color: r.color,
                      marginBottom: 18,
                    }}
                  >
                    {r.role}
                  </h3>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {r.perks.map((p, j) => (
                      <li
                        key={j}
                        style={{
                          fontSize: "0.84rem",
                          color: "#374151",
                          lineHeight: 2.1,
                          display: "flex",
                          alignItems: "center",
                          gap: 9,
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: r.color,
                            flexShrink: 0,
                          }}
                        />
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ───────────────────────── */}
        <section style={{ padding: "96px 0", background: "white" }}>
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ textAlign: "center", marginBottom: 52 }}
            >
              <p
                style={{
                  fontSize: "0.67rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  color: "#f97316",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Stories
              </p>
              <h2
                className="font-bricolage"
                style={{
                  fontSize: "clamp(1.8rem,4vw,2.8rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: "#1a1a2e",
                }}
              >
                What members{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg,#4f46e5,#f97316)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  say
                </span>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="testi-card"
                  style={{
                    background: "#fafaf8",
                    border: "1px solid #f3f4f6",
                    borderRadius: 22,
                    padding: "30px",
                    transition: "all 0.25s",
                  }}
                >
                  <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                    {[...Array(t.stars)].map((_, j) => (
                      <FaStar
                        key={j}
                        style={{ color: "#f59e0b", fontSize: "0.78rem" }}
                      />
                    ))}
                  </div>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#374151",
                      lineHeight: 1.7,
                      marginBottom: 22,
                      fontStyle: "italic",
                    }}
                  >
                    "{t.text}"
                  </p>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg,${t.color}cc,${t.color}66)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.73rem",
                        fontWeight: 800,
                        color: "white",
                        fontFamily: "Bricolage Grotesque,sans-serif",
                      }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <div
                        className="font-bricolage"
                        style={{
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          color: "#1a1a2e",
                        }}
                      >
                        {t.name}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                        {t.role}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ──────────────────────────── */}
        <section
          style={{
            padding: "100px 0",
            background: "linear-gradient(160deg,#f0edff 0%,#fff8f2 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -100,
              right: -100,
              width: 500,
              height: 500,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(79,70,229,0.09) 0%,transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -80,
              left: -80,
              width: 420,
              height: 420,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(249,115,22,0.07) 0%,transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p
                style={{
                  fontSize: "0.67rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  color: "#f97316",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                Start Today
              </p>
              <h2
                className="font-bricolage"
                style={{
                  fontSize: "clamp(2.5rem,6vw,4.5rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.05em",
                  color: "#1a1a2e",
                  lineHeight: 1.05,
                  marginBottom: 20,
                }}
              >
                Your community
                <br />
                is{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg,#4f46e5,#f97316)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  waiting for you.
                </span>
              </h2>
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "1rem",
                  maxWidth: 400,
                  margin: "0 auto 44px",
                  lineHeight: 1.7,
                }}
              >
                Sign up free, browse clubs, join in minutes. No credit card
                required.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Link
                  to="/register"
                  className="font-bricolage"
                  style={{
                    background: "#1a1a2e",
                    color: "white",
                    fontWeight: 700,
                    padding: "16px 44px",
                    borderRadius: 16,
                    fontSize: "1rem",
                    textDecoration: "none",
                    boxShadow: "0 12px 40px rgba(26,26,46,0.18)",
                    transition: "all 0.22s",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#4f46e5";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#1a1a2e";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Join ClubNest Free <FaArrowRight />
                </Link>
                <Link
                  to="/clubs"
                  style={{
                    color: "#4f46e5",
                    fontWeight: 600,
                    padding: "16px 36px",
                    borderRadius: 16,
                    fontSize: "0.95rem",
                    textDecoration: "none",
                    border: "1.5px solid rgba(79,70,229,0.3)",
                    background: "white",
                    transition: "all 0.22s",
                    boxShadow: "0 4px 16px rgba(79,70,229,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#4f46e5";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(79,70,229,0.3)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Browse Clubs
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};
