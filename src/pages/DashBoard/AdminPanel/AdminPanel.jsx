import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Users,
  Building2,
  CreditCard,
  IdCard,
  ArrowUpRight,
  Settings,
  ShieldCheck,
  Wallet,
  AlertCircle,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

export const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchChartData = async () => {
      try {
        const token = await user.getIdToken();
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/memberships-per-club`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setChartData(res.data || []);
      } catch (error) {
        console.error("Chart data error:", error);
        setChartData([]);
      }
    };
    fetchChartData();
  }, [user]);

  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
    enabled: !!user,
  });

  const {
    data: clubs = [],
    isLoading: clubsLoading,
    error: clubsError,
  } = useQuery({
    queryKey: ["allClubs"],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/clubs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch clubs");
      return res.json();
    },
    enabled: !!user,
  });

  const {
    data: memberships = [],
    isLoading: membershipsLoading,
    error: membershipsError,
  } = useQuery({
    queryKey: ["allMemberships"],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/memberships`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error("Failed to fetch memberships");
      return res.json();
    },
    enabled: !!user,
  });

  const {
    data: payments = [],
    isLoading: paymentsLoading,
    error: paymentsError,
  } = useQuery({
    queryKey: ["allPayments"],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch payments");
      return res.json();
    },
    enabled: !!user,
  });

  const totalPaymentsAmount = payments.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0,
  );

  const isLoading =
    usersLoading || clubsLoading || membershipsLoading || paymentsLoading;

  const errorMessage =
    usersError?.message ||
    clubsError?.message ||
    membershipsError?.message ||
    paymentsError?.message;

  /* ── Custom tooltip ── */
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0d1424] border border-white/10 rounded-xl px-4 py-3 shadow-xl">
          <p className="text-[11px] text-white/40 mb-1">{label}</p>
          <p className="text-sm font-semibold text-blue-400">
            {payload[0].value} members
          </p>
        </div>
      );
    }
    return null;
  };

  /* ── Loading Skeleton ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#060810] px-4 sm:px-8 py-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[520px] h-[420px] rounded-full bg-linear-to-bl from-blue-600 to-violet-700 opacity-6 blur-[110px] pointer-events-none" />

        <div className="relative z-10 max-w-[1440px] mx-auto space-y-8">
          {/* header */}
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="h-2 w-24 rounded-full bg-white/6 animate-pulse" />
              <div className="h-9 w-52 rounded-2xl bg-white/6 animate-pulse" />
              <div className="h-2 w-36 rounded-full bg-white/4 animate-pulse" />
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

          {/* chart */}
          <div className="bg-white/3 border border-white/6 rounded-2xl p-6 animate-pulse">
            <div className="h-2 w-36 rounded-full bg-white/6 mb-8" />
            <div className="flex items-end gap-3 h-44">
              {[60, 85, 45, 95, 70, 55, 80].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-lg bg-white/6"
                  style={{ height: `${h}%`, opacity: 0.4 + i * 0.05 }}
                />
              ))}
            </div>
          </div>

          {/* quick links */}
          <div className="space-y-4">
            <div className="h-2 w-24 rounded-full bg-white/6 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 0.65, 0.4].map((op, i) => (
                <div
                  key={i}
                  className="bg-white/3 border border-white/6 rounded-2xl p-5 flex items-start gap-4 animate-pulse"
                  style={{ opacity: op }}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/8 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-28 rounded-full bg-white/8" />
                    <div className="h-2 w-36 rounded-full bg-white/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (errorMessage) {
    return (
      <div className="min-h-screen bg-[#060810] px-4 sm:px-8 py-8 flex items-center justify-center">
        <div className="flex items-start gap-4 bg-red-500/10 border border-red-500/20 rounded-2xl px-6 py-5 max-w-md">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
            <AlertCircle size={18} className="text-red-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-400 mb-1">
              Failed to load dashboard
            </p>
            <p className="text-[11px] text-red-400/60">{errorMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      iconBg: "bg-blue-500/15 border-blue-500/20",
      iconColor: "text-blue-400",
      hoverBorder: "hover:border-blue-500/30",
      hoverShadow: "hover:shadow-[0_0_30px_rgba(79,127,255,0.08)]",
      blob: "bg-blue-500/8",
    },
    {
      title: "Total Clubs",
      value: clubs.length,
      icon: Building2,
      iconBg: "bg-violet-500/15 border-violet-500/20",
      iconColor: "text-violet-400",
      hoverBorder: "hover:border-violet-500/30",
      hoverShadow: "hover:shadow-[0_0_30px_rgba(139,92,246,0.08)]",
      blob: "bg-violet-500/8",
    },
    {
      title: "Total Memberships",
      value: memberships.length,
      icon: IdCard,
      iconBg: "bg-cyan-500/15 border-cyan-500/20",
      iconColor: "text-cyan-400",
      hoverBorder: "hover:border-cyan-500/30",
      hoverShadow: "hover:shadow-[0_0_30px_rgba(6,182,212,0.08)]",
      blob: "bg-cyan-500/8",
    },
    {
      title: "Total Revenue",
      value: `$${totalPaymentsAmount.toLocaleString()}`,
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
      title: "Manage Users",
      description: "View & update user roles",
      to: "/dashboard/admin/manage-users",
      icon: ShieldCheck,
      iconBg: "bg-blue-500/15 border-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      title: "Manage Clubs",
      description: "Approve or reject clubs",
      to: "/dashboard/admin/manage-clubs",
      icon: Settings,
      iconBg: "bg-violet-500/15 border-violet-500/20",
      iconColor: "text-violet-400",
    },
    {
      title: "Payments",
      description: "View all transactions",
      to: "/dashboard/admin/payments",
      icon: Wallet,
      iconBg: "bg-emerald-500/15 border-emerald-500/20",
      iconColor: "text-emerald-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#060810] text-white px-4 sm:px-8 py-8 space-y-8 relative overflow-hidden">
      <Helmet>
        <title>Admin - ClubNest</title>
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
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-blue-400 mb-2">
              Admin Dashboard
            </p>
            <h1 className="text-[34px] sm:text-[42px] font-light font-serif leading-tight text-[#f0f4ff]">
              Welcome back,{" "}
              <em className="italic text-[#93b4ff]">
                {user?.displayName?.split(" ")[0] || "Admin"}
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

        {/* ── Chart ── */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/25">
              Memberships per Club
            </p>
            <div className="flex-1 h-px bg-white/6" />
          </div>

          {chartData.length === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/4 border border-white/8 flex items-center justify-center">
                <Building2 size={18} className="text-white/20" />
              </div>
              <p className="text-sm text-white/25 font-medium">
                No data available
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} barCategoryGap="35%">
                <XAxis
                  dataKey="clubName"
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar dataKey="totalMembers" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={`rgba(79,127,255,${0.5 + (i % 3) * 0.15})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-24 md:pb-0">
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
      </div>
    </div>
  );
};
