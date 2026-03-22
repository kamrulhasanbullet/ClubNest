import { use, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { NavLink } from "react-router";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import {
  Users,
  Building2,
  CalendarDays,
  CreditCard,
  ArrowUpRight,
  UserCheck,
  ClipboardList,
  CalendarCheck,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

export const ManageUsers = () => {
  const { user } = use(AuthContext);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (user) {
      user.getIdToken().then((idToken) => setToken(idToken));
    }
  }, [user]);

  const { data: summary = {}, isLoading } = useQuery({
    queryKey: ["manager-summary", user?.email],
    enabled: !!user?.email && !!token,
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/manager/summary?email=${user.email}`,
        { headers: { authorization: `Bearer ${token}` } },
      );
      return res.data;
    },
  });

  const {
    totalClubs = 0,
    totalMembers = 0,
    totalEvents = 0,
    totalPayments = 0,
  } = summary;

  /* ── Skeleton ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#060810] px-4 sm:px-8 py-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[520px] h-[420px] rounded-full bg-linear-to-bl from-blue-600 to-violet-700 opacity-6 blur-[110px] pointer-events-none" />
        <div className="relative z-10 max-w-[1440px] mx-auto space-y-8">
          {/* header */}
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="h-2 w-28 rounded-full bg-white/6 animate-pulse" />
              <div className="h-9 w-64 rounded-2xl bg-white/6 animate-pulse" />
            </div>
          </div>
          {/* stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 0.75, 0.55, 0.35].map((op, i) => (
              <div
                key={i}
                className="bg-white/3 border border-white/6 rounded-2xl p-5 space-y-5 animate-pulse"
                style={{ opacity: op }}
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/8" />
                  <div className="w-4 h-4 rounded bg-white/4" />
                </div>
                <div className="space-y-2">
                  <div className="h-8 w-14 rounded-lg bg-white/8" />
                  <div className="h-2 w-20 rounded-full bg-white/4" />
                </div>
              </div>
            ))}
          </div>
          {/* links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 0.7, 0.5, 0.35].map((op, i) => (
              <div
                key={i}
                className="bg-white/3 border border-white/6 rounded-2xl p-5 h-28 animate-pulse"
                style={{ opacity: op }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Clubs",
      value: totalClubs,
      icon: Building2,
      iconBg: "bg-blue-500/15 border-blue-500/20",
      iconColor: "text-blue-400",
      hoverBorder: "hover:border-blue-500/30",
      hoverShadow: "hover:shadow-[0_0_30px_rgba(79,127,255,0.08)]",
      blob: "bg-blue-500/8",
    },
    {
      title: "Total Members",
      value: totalMembers,
      icon: Users,
      iconBg: "bg-violet-500/15 border-violet-500/20",
      iconColor: "text-violet-400",
      hoverBorder: "hover:border-violet-500/30",
      hoverShadow: "hover:shadow-[0_0_30px_rgba(139,92,246,0.08)]",
      blob: "bg-violet-500/8",
    },
    {
      title: "Total Events",
      value: totalEvents,
      icon: CalendarDays,
      iconBg: "bg-cyan-500/15 border-cyan-500/20",
      iconColor: "text-cyan-400",
      hoverBorder: "hover:border-cyan-500/30",
      hoverShadow: "hover:shadow-[0_0_30px_rgba(6,182,212,0.08)]",
      blob: "bg-cyan-500/8",
    },
    {
      title: "Total Payments",
      value: `$${Number(totalPayments).toLocaleString()}`,
      icon: CreditCard,
      iconBg: "bg-emerald-500/15 border-emerald-500/20",
      iconColor: "text-emerald-400",
      hoverBorder: "hover:border-emerald-500/30",
      hoverShadow: "hover:shadow-[0_0_30px_rgba(52,211,153,0.08)]",
      blob: "bg-emerald-500/8",
    },
  ];

  const quickLinks = [
    {
      title: "My Clubs",
      description: "View & edit your clubs",
      to: "/dashboard/manager/my-clubs",
      icon: Building2,
      iconBg: "bg-blue-500/15 border-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      title: "Club Members",
      description: "See members of your clubs",
      to: "/dashboard/manager/club-members",
      icon: UserCheck,
      iconBg: "bg-violet-500/15 border-violet-500/20",
      iconColor: "text-violet-400",
    },
    {
      title: "Events Management",
      description: "Manage events for your clubs",
      to: "/dashboard/manager/events",
      icon: CalendarDays,
      iconBg: "bg-cyan-500/15 border-cyan-500/20",
      iconColor: "text-cyan-400",
    },
    {
      title: "Event Registrations",
      description: "View registrations per event",
      to: "/dashboard/manager/event-registrations",
      icon: ClipboardList,
      iconBg: "bg-emerald-500/15 border-emerald-500/20",
      iconColor: "text-emerald-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#060810] text-white px-4 sm:px-8 py-8 space-y-8 relative overflow-hidden">
      <Helmet>
        <title>Club Manager - ClubNest</title>
      </Helmet>

      {/* ── Aurora bg ── */}
      <div className="absolute top-0 right-0 w-[520px] h-[420px] rounded-full bg-linear-to-bl from-blue-600 to-violet-700 opacity-6 blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-linear-to-tr from-cyan-500 to-blue-600 opacity-5 blur-[100px] pointer-events-none" />

      {/* ── Grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto space-y-8">
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-violet-400 mb-2">
              Club Manager Dashboard
            </p>
            <h1 className="text-[34px] sm:text-[42px] font-light font-serif leading-tight text-[#f0f4ff]">
              Welcome back,{" "}
              <em className="italic text-[#c4b5fd]">
                {user?.displayName?.split(" ")[0] || "Manager"}
              </em>
            </h1>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statCards.map(
            ({
              title,
              value,
              icon: Icon,
              iconBg,
              iconColor,
              hoverBorder,
              hoverShadow,
              blob,
            }) => (
              <div
                key={title}
                className={`relative group bg-white/3 border border-white/8 rounded-2xl p-5 overflow-hidden transition-all duration-300 ${hoverBorder} ${hoverShadow}`}
              >
                <div
                  className={`absolute top-0 right-0 w-28 h-28 ${blob} rounded-full blur-2xl pointer-events-none`}
                />
                <div className="flex items-start justify-between mb-5">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center ${iconBg}`}
                  >
                    <Icon size={17} className={iconColor} />
                  </div>
                  <ArrowUpRight
                    size={14}
                    className="text-white/15 transition-colors duration-200 group-hover:text-white/50"
                  />
                </div>
                <p className="text-[36px] font-light text-white leading-none mb-1.5">
                  {value}
                </p>
                <p className="text-[11.5px] text-white/35 tracking-wide">
                  {title}
                </p>
              </div>
            ),
          )}
        </div>

        {/* ── Quick Links ── */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/25">
              Quick Actions
            </p>
            <div className="flex-1 h-px bg-white/6" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map(
              ({ title, description, to, icon: Icon, iconBg, iconColor }) => (
                <NavLink
                  key={to}
                  to={to}
                  className="group flex items-start gap-4 bg-white/3 border border-white/8 rounded-2xl p-5 hover:bg-white/6 hover:border-white/15 transition-all duration-300"
                >
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${iconBg}`}
                  >
                    <Icon size={17} className={iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white/85 mb-0.5">
                      {title}
                    </p>
                    <p className="text-[11px] text-white/30">{description}</p>
                  </div>
                  <ArrowUpRight
                    size={14}
                    className="text-white/15 group-hover:text-white/50 transition-colors duration-200 shrink-0 mt-0.5"
                  />
                </NavLink>
              ),
            )}
          </div>
        </div>

        {/* ── Quick create CTA ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 mb-24">
          <NavLink
            to="/dashboard/manager/create-club"
            className="group flex items-center justify-between bg-linear-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20 rounded-2xl px-5 py-4 hover:from-blue-500/15 hover:to-violet-500/15 hover:border-blue-500/35 transition-all duration-300"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-[0_4px_14px_rgba(79,127,255,0.35)] shrink-0">
                <Building2 size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Create a New Club
                </p>
                <p className="text-[11px] text-white/35 mt-0.5">
                  Set up a new club and start managing
                </p>
              </div>
            </div>
            <ArrowUpRight
              size={16}
              className="text-white/25 group-hover:text-blue-400 transition-colors duration-200 shrink-0"
            />
          </NavLink>

          <NavLink
            to="/dashboard/manager/create-event"
            className="group flex items-center justify-between bg-linear-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl px-5 py-4 hover:from-cyan-500/15 hover:to-blue-500/15 hover:border-cyan-500/35 transition-all duration-300"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-[0_4px_14px_rgba(6,182,212,0.35)] shrink-0">
                <CalendarCheck size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Create a New Event
                </p>
                <p className="text-[11px] text-white/35 mt-0.5">
                  Schedule an event for your clubs
                </p>
              </div>
            </div>
            <ArrowUpRight
              size={16}
              className="text-white/25 group-hover:text-cyan-400 transition-colors duration-200 shrink-0"
            />
          </NavLink>
        </div>
      </div>
    </div>
  );
};
