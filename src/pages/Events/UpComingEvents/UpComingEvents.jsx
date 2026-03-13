import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router";
import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Sparkles,
  DollarSign,
} from "lucide-react";

/* ── Font injection ─────────────────────────── */
const useFont = () => {
  useEffect(() => {
    if (document.getElementById("ue-font")) return;
    const l = document.createElement("link");
    l.id = "ue-font";
    l.href =
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800&family=Outfit:wght@300;400;500;600&display=swap";
    l.rel = "stylesheet";
    document.head.appendChild(l);
  }, []);
};

const STYLES = `
  .font-bricolage { font-family:'Bricolage Grotesque',sans-serif; }
  .font-outfit    { font-family:'Outfit',sans-serif; }

  @keyframes ueFadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  .ue-fadein { animation: ueFadeUp 0.45s cubic-bezier(.22,1,.36,1) both; }

  /* card hover — child element zoom */
  .ev-card { transition: transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s cubic-bezier(.22,1,.36,1), border-color .2s; }
  .ev-card:hover { transform: translateY(-6px); box-shadow: 0 28px 70px rgba(79,70,229,0.13); border-color: rgba(79,70,229,0.2) !important; }
  .ev-card:hover .ev-bar { opacity:1 !important; }

  /* register button */
  .reg-btn { transition: background .22s, transform .2s, box-shadow .2s; }
  .reg-btn:hover { background:#4f46e5 !important; transform:translateY(-1px); box-shadow:0 8px 28px rgba(79,70,229,0.28); }
  .reg-btn:active { transform:scale(0.98); }

  /* meta icon hover */
  .meta-row:hover .meta-icon-cal  { background:#eef2ff !important; color:#4f46e5 !important; }
  .meta-row:hover .meta-icon-pin  { background:#fef2f2 !important; color:#dc2626 !important; }
  .meta-row:hover .meta-icon-host { background:#f0fdf4 !important; color:#16a34a !important; }
  .meta-row:hover .meta-icon-fee  { background:#fffbeb !important; color:#d97706 !important; }
`;

const evBarColors = [
  "linear-gradient(90deg,#4f46e5,#818cf8)",
  "linear-gradient(90deg,#f97316,#fb923c)",
  "linear-gradient(90deg,#16a34a,#4ade80)",
  "linear-gradient(90deg,#db2777,#f472b6)",
  "linear-gradient(90deg,#0369a1,#38bdf8)",
  "linear-gradient(90deg,#9333ea,#c084fc)",
];

export const UpComingEvents = () => {
  useFont();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/events`);
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  /* same helper — untouched logic */
  const isEventFree = (event) => {
    const eventFee = Number(event.eventFee) || 0;
    return !event.isPaid || eventFee === 0;
  };

  /* ── Loading ──────────────────────────────── */
  if (loading)
    return (
      <div className="max-w-[1488px] mx-auto font-outfit bg-[#fafaf8] min-h-screen px-6 md:px-10 py-12">
        <style>{STYLES}</style>
        {/* header skeleton */}
        <div className="mb-10">
          <div className="w-16 h-3 rounded-full bg-gray-200 animate-pulse mb-3" />
          <div className="w-56 h-9 rounded-xl bg-gray-200 animate-pulse mb-2" />
          <div className="w-36 h-4 rounded-lg bg-gray-200 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-[360px] bg-gray-100 rounded-[22px] animate-pulse"
            />
          ))}
        </div>
      </div>
    );

  /* ── Empty ────────────────────────────────── */
  if (events.length === 0)
    return (
      <div className="font-outfit bg-[#fafaf8] min-h-screen flex flex-col items-center justify-center gap-4 px-6">
        <style>{STYLES}</style>
        <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-violet-100 to-pink-100 flex items-center justify-center">
          <Sparkles size={32} className="text-purple-400" />
        </div>
        <h3 className="font-bricolage font-bold text-[#1a1a2e] text-xl">
          No events yet
        </h3>
        <p className="text-gray-400 text-sm">
          Check back soon — exciting events are on the way.
        </p>
      </div>
    );

  /* ── Main ─────────────────────────────────── */
  return (
    <div className="font-outfit bg-[#fafaf8] min-h-screen px-6 md:px-10 py-12">
      <style>{STYLES}</style>
      <div style={{ maxWidth: "1488px" }} className="mx-auto">
        {/* ── PAGE HEADER ──────────────────────── */}
        <div className="mb-10 ue-fadein">
          <p className="text-[0.67rem] font-bold tracking-[0.18em] text-orange-500 uppercase mb-2">
            What's on
          </p>
          <h1
            className="font-bricolage font-extrabold text-[#1a1a2e] leading-none"
            style={{
              fontSize: "clamp(2rem,5vw,3.2rem)",
              letterSpacing: "-0.04em",
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
          </h1>
          <p className="text-gray-400 mt-2.5 text-sm">
            {events.length} event{events.length !== 1 ? "s" : ""} coming up
          </p>
        </div>

        {/* ── GRID ─────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev, idx) => {
            const isFree = isEventFree(ev);
            const eventFee = Number(ev.eventFee) || 0;
            const date = new Date(ev.eventDate);

            return (
              <div
                key={ev._id}
                className="ev-card ue-fadein bg-white rounded-[22px] border border-gray-100 overflow-hidden flex flex-col"
                style={{
                  boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
                  animationDelay: `${idx * 0.05}s`,
                }}
              >
                {/* color bar */}
                <div
                  className="ev-bar h-1 opacity-70 shrink-0"
                  style={{ background: evBarColors[idx % evBarColors.length] }}
                />

                <div className="p-6 flex flex-col flex-1 gap-4">
                  {/* ── TOP: title + fee badge ──── */}
                  <div className="flex items-start justify-between gap-3">
                    <h2
                      className="font-bricolage font-bold text-[#1a1a2e] leading-tight"
                      style={{ fontSize: "1.08rem", letterSpacing: "-0.02em" }}
                    >
                      {ev.title}
                    </h2>
                    <span
                      className={`shrink-0 px-3 py-1 rounded-full text-[0.62rem] font-extrabold uppercase tracking-[0.08em] border
                      ${
                        isFree
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {isFree ? "Free" : `$${eventFee}`}
                    </span>
                  </div>

                  {/* ── DESCRIPTION ──────────────── */}
                  {ev.description && (
                    <p className="text-gray-400 text-[0.82rem] leading-[1.65] line-clamp-2">
                      {ev.description}
                    </p>
                  )}

                  {/* ── META LIST ────────────────── */}
                  <div className="flex flex-col gap-2.5 flex-1">
                    {/* date */}
                    <div className="meta-row flex items-center gap-3 cursor-default">
                      <div className="meta-icon-cal w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 transition-all duration-200">
                        <Calendar size={14} className="text-gray-400" />
                      </div>
                      <span className="text-[0.8rem] font-medium text-gray-600">
                        {date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {" · "}
                        {date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* location */}
                    {ev.location && (
                      <div className="meta-row flex items-center gap-3 cursor-default">
                        <div className="meta-icon-pin w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 transition-all duration-200">
                          <MapPin size={14} className="text-gray-400" />
                        </div>
                        <span className="text-[0.8rem] font-medium text-gray-600 truncate">
                          {ev.location}
                        </span>
                      </div>
                    )}

                    {/* host */}
                    <div className="meta-row flex items-center gap-3 cursor-default">
                      <div className="meta-icon-host w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 transition-all duration-200">
                        <Users size={14} className="text-gray-400" />
                      </div>
                      <span className="text-[0.8rem] font-medium text-gray-600">
                        Hosted by{" "}
                        <span className="text-indigo-600 font-semibold">
                          {ev.clubName}
                        </span>
                        {ev.maxAttendees && (
                          <span className="text-gray-400 ml-1.5">
                            · {ev.maxAttendees} max
                          </span>
                        )}
                      </span>
                    </div>

                    {/* fee (paid only) */}
                    {!isFree && (
                      <div className="meta-row flex items-center gap-3 cursor-default">
                        <div className="meta-icon-fee w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 transition-all duration-200">
                          <DollarSign size={14} className="text-gray-400" />
                        </div>
                        <span className="text-[0.8rem] font-medium text-gray-600">
                          Registration fee:{" "}
                          <span className="text-amber-700 font-bold">
                            ${eventFee}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ── REGISTER BUTTON ──────────── */}
                  <NavLink
                    to={`/events/${ev._id}`}
                    className="reg-btn mt-2 flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bricolage font-bold text-white text-[0.88rem] no-underline"
                    style={{ background: "#1a1a2e" }}
                  >
                    {isFree ? "Register for Free" : `Register — $${eventFee}`}
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </NavLink>
                </div>
              </div>
            );
          })}
        </div>
      </div>{" "}
    </div>
  );
};
