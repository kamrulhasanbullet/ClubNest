import React, { use, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../../context/AuthContext/AuthContext";
import { toast } from "react-hot-toast";
import {
  Search,
  Calendar,
  Users,
  DollarSign,
  Clock,
  Eye,
  CalendarCheck,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

const REGS_PER_PAGE = 10;

export const EventsRegistrations = () => {
  const { user } = use(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [regPage, setRegPage] = useState(1);

  // Reset reg page when event changes
  useEffect(() => {
    setRegPage(1);
  }, [selectedEvent?._id]);

  const {
    data: events = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["managerEventsRegistrations"],
    queryFn: async () => {
      if (!user) return [];
      const token = await user.getIdToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/events/manager`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
    enabled: !!user,
  });

  const {
    data: registrations = [],
    isLoading: loadingRegistrations,
    refetch: refetchRegistrations,
  } = useQuery({
    queryKey: ["eventRegistrations", selectedEvent?._id],
    queryFn: async () => {
      if (!selectedEvent || !user) return [];
      const token = await user.getIdToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/manager/event-registrations?eventId=${selectedEvent._id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error("Failed to fetch registrations");
      return res.json();
    },
    enabled: !!selectedEvent && !!user,
  });

  // Registrations pagination
  const totalRegPages = Math.ceil(registrations.length / REGS_PER_PAGE);
  const paginatedRegs = registrations.slice(
    (regPage - 1) * REGS_PER_PAGE,
    regPage * REGS_PER_PAGE,
  );

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.clubName.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === "upcoming")
      return matchesSearch && new Date(event.eventDate) > new Date();
    if (statusFilter === "past")
      return matchesSearch && new Date(event.eventDate) < new Date();
    return matchesSearch;
  });

  const handleCancel = async (registrationId) => {
    try {
      const token = await user.getIdToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/manager/event-registrations/${registrationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "cancelled" }),
        },
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to cancel");
      }
      toast.success("Registration cancelled");
      refetchRegistrations();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const totalRegistrations = events.reduce(
    (s, e) => s + (e.registeredUsersCount || 0),
    0,
  );
  const upcomingCount = events.filter(
    (e) => new Date(e.eventDate) > new Date(),
  ).length;

  const regStatusStyle = (status) => {
    if (status === "registered")
      return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (status === "pendingPayment")
      return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    return "text-red-400 bg-red-400/10 border-red-400/20";
  };

  /* ── Skeleton ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#060810] px-4 sm:px-8 py-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-linear-to-bl from-blue-600 to-violet-700 opacity-6 blur-[110px] pointer-events-none" />
        <div className="relative z-10 max-w-[1440px] mx-auto space-y-8">
          <div className="space-y-3">
            <div className="h-2 w-28 rounded-full bg-white/6 animate-pulse" />
            <div className="h-9 w-56 rounded-2xl bg-white/6 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 0.75, 0.55, 0.35].map((op, i) => (
              <div
                key={i}
                className="bg-white/3 border border-white/6 rounded-2xl p-5 space-y-4 animate-pulse"
                style={{ opacity: op }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/8" />
                <div className="h-8 w-12 rounded-lg bg-white/8" />
                <div className="h-2 w-20 rounded-full bg-white/4" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {[1, 0.7, 0.45].map((op, i) => (
                <div
                  key={i}
                  className="bg-white/3 border border-white/6 rounded-2xl p-5 h-24 animate-pulse"
                  style={{ opacity: op }}
                />
              ))}
            </div>
            <div className="bg-white/3 border border-white/6 rounded-2xl h-64 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="min-h-screen bg-[#060810] px-4 sm:px-8 py-8 flex items-center justify-center">
        <div className="flex items-start gap-4 bg-red-500/10 border border-red-500/20 rounded-2xl px-6 py-5 max-w-md">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
            <AlertCircle size={18} className="text-red-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-400 mb-1">
              Failed to load events
            </p>
            <p className="text-[11px] text-red-400/60">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060810] text-white px-4 sm:px-8 pt-8 pb-28 space-y-8 relative overflow-hidden">
      <Helmet>
        <title>Event Regestration - ClubNest</title>
      </Helmet>

      {/* ── Aurora bg ── */}
      <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-linear-to-bl from-blue-600 to-violet-700 opacity-6 blur-[110px] pointer-events-none" />
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
        <div>
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-cyan-400 mb-2">
            Club Manager
          </p>
          <h1 className="text-[34px] sm:text-[42px] font-light font-serif leading-tight text-[#f0f4ff]">
            Event <em className="italic text-[#67e8f9]">Registrations</em>
          </h1>
          <p className="text-sm text-white/30 mt-1">
            Manage and view all event registrations
          </p>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Total Events",
              value: events.length,
              icon: Calendar,
              iconBg: "bg-blue-500/15 border-blue-500/20",
              iconColor: "text-blue-400",
              blob: "bg-blue-500/8",
              hover: "hover:border-blue-500/30",
            },
            {
              label: "Total Registrations",
              value: totalRegistrations,
              icon: Users,
              iconBg: "bg-violet-500/15 border-violet-500/20",
              iconColor: "text-violet-400",
              blob: "bg-violet-500/8",
              hover: "hover:border-violet-500/30",
            },
            {
              label: "Upcoming Events",
              value: upcomingCount,
              icon: CalendarCheck,
              iconBg: "bg-cyan-500/15 border-cyan-500/20",
              iconColor: "text-cyan-400",
              blob: "bg-cyan-500/8",
              hover: "hover:border-cyan-500/30",
            },
            {
              label: "Past Events",
              value: events.length - upcomingCount,
              icon: Clock,
              iconBg: "bg-white/8 border-white/10",
              iconColor: "text-white/40",
              blob: "bg-white/4",
              hover: "hover:border-white/15",
            },
          ].map(
            ({ label, value, icon: Icon, iconBg, iconColor, blob, hover }) => (
              <div
                key={label}
                className={`relative group bg-white/3 border border-white/8 rounded-2xl p-5 overflow-hidden transition-all duration-300 ${hover}`}
              >
                <div
                  className={`absolute top-0 right-0 w-24 h-24 ${blob} rounded-full blur-2xl pointer-events-none`}
                />
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${iconBg}`}
                >
                  <Icon size={17} className={iconColor} />
                </div>
                <p className="text-[34px] font-light text-white leading-none mb-1">
                  {value}
                </p>
                <p className="text-[11.5px] text-white/35 tracking-wide">
                  {label}
                </p>
              </div>
            ),
          )}
        </div>

        {/* ── Main layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left: Events list ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                />
                <input
                  type="text"
                  placeholder="Search by title or club…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white/3 border border-white/8 rounded-xl text-sm text-white/70 placeholder:text-white/20 outline-none focus:border-cyan-500/40 focus:bg-white/5 transition-all duration-200"
                />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="cursor-pointer appearance-none pl-4 pr-9 py-2.5 bg-white/3 border border-white/8 rounded-xl text-sm text-white/60 outline-none focus:border-cyan-500/40 transition-all duration-200"
                >
                  <option value="all">All Events</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past Events</option>
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                />
              </div>
            </div>

            {/* Events */}
            {filteredEvents.length === 0 ? (
              <div className="bg-white/3 border border-white/8 rounded-2xl flex flex-col items-center justify-center py-14 gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center">
                  <Calendar size={20} className="text-white/20" />
                </div>
                <p className="text-sm font-medium text-white/30">
                  No events found
                </p>
              </div>
            ) : (
              filteredEvents.map((event) => {
                const isSelected = selectedEvent?._id === event._id;
                const isPast = new Date(event.eventDate) < new Date();
                return (
                  <div
                    key={event._id}
                    onClick={() => setSelectedEvent(event)}
                    className={`cursor-pointer bg-white/3 border rounded-2xl p-5 transition-all duration-200 hover:bg-white/5 ${
                      isSelected
                        ? "border-cyan-500/35 shadow-[0_0_20px_rgba(6,182,212,0.08)]"
                        : "border-white/8 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white/85 truncate">
                          {event.title}
                        </p>
                        <p className="text-[11px] text-white/35 mt-0.5 truncate">
                          {event.clubName}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <span className="inline-flex items-center gap-1 text-[10px] text-white/35">
                            <Calendar size={10} />
                            {new Date(event.eventDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border text-blue-400 bg-blue-400/10 border-blue-400/20">
                            <Users size={9} />
                            {event.registeredUsersCount || 0} registered
                          </span>
                          {event.isPaid && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border text-emerald-400 bg-emerald-400/10 border-emerald-400/20">
                              <DollarSign size={9} />${event.eventFee}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="shrink-0">
                        {isPast ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border text-white/30 bg-white/5 border-white/10">
                            Past
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border text-cyan-400 bg-cyan-400/10 border-cyan-400/20">
                            Upcoming
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ── Right: Registration details ── */}
          <div className="lg:col-span-1">
            <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden sticky top-4">
              {!selectedEvent ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center">
                    <Eye size={20} className="text-white/20" />
                  </div>
                  <p className="text-sm text-white/25">
                    Select an event to view registrations
                  </p>
                </div>
              ) : (
                <>
                  {/* Event header */}
                  <div className="px-5 py-4 border-b border-white/7 bg-linear-to-r from-cyan-500/10 to-blue-500/10">
                    <p className="text-sm font-semibold text-white/85 truncate">
                      {selectedEvent.title}
                    </p>
                    <p className="text-[11px] text-white/35 mt-0.5">
                      {selectedEvent.clubName}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-[10.5px] text-white/30 flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(selectedEvent.eventDate).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" },
                        )}
                      </span>
                      {selectedEvent.location && (
                        <span className="text-[10.5px] text-white/25 truncate">
                          · {selectedEvent.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mini stat grid */}
                  <div className="grid grid-cols-2 gap-px bg-white/5 border-b border-white/7">
                    {[
                      {
                        label: "Total",
                        value: registrations.length,
                        color: "text-white/70",
                      },
                      {
                        label: "Confirmed",
                        value: registrations.filter(
                          (r) => r.status === "registered",
                        ).length,
                        color: "text-emerald-400",
                      },
                      {
                        label: "Pending",
                        value: registrations.filter(
                          (r) => r.status === "pendingPayment",
                        ).length,
                        color: "text-amber-400",
                      },
                      {
                        label: "Cancelled",
                        value: registrations.filter(
                          (r) => r.status === "cancelled",
                        ).length,
                        color: "text-red-400",
                      },
                    ].map(({ label, value, color }) => (
                      <div
                        key={label}
                        className="flex flex-col items-center justify-center py-4 bg-[#060810]"
                      >
                        <p className={`text-2xl font-light ${color}`}>
                          {value}
                        </p>
                        <p className="text-[10px] text-white/25 mt-0.5">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Registrations list */}
                  <div className="p-4">
                    <p className="text-[9.5px] font-semibold tracking-[0.18em] uppercase text-white/20 mb-3">
                      Registrations ({registrations.length})
                    </p>

                    {loadingRegistrations ? (
                      <div className="space-y-2">
                        {[1, 0.65, 0.4].map((op, i) => (
                          <div
                            key={i}
                            className="h-14 rounded-xl bg-white/4 animate-pulse"
                            style={{ opacity: op }}
                          />
                        ))}
                      </div>
                    ) : registrations.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-sm text-white/20">
                          No registrations yet
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          {paginatedRegs.map((reg) => {
                            const isPaid = !!reg.paymentId;
                            const isCancelled = reg.status === "cancelled";
                            const canCancel = !isPaid && !isCancelled;

                            return (
                              <div
                                key={reg._id}
                                className="bg-white/3 border border-white/7 rounded-xl p-3 hover:bg-white/5 transition-colors duration-150"
                              >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div className="min-w-0">
                                    <p className="text-[12px] font-semibold text-white/75 truncate">
                                      {reg.userName || reg.userEmail}
                                    </p>
                                    <p className="text-[10px] text-white/30 truncate">
                                      {reg.userEmail}
                                    </p>
                                  </div>
                                  <span
                                    className={`text-[9.5px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${regStatusStyle(reg.status)}`}
                                  >
                                    {reg.status === "pendingPayment"
                                      ? "Pending"
                                      : reg.status}
                                  </span>
                                </div>

                                {selectedEvent.isPaid && (
                                  <p className="text-[10px] text-white/30 mb-2">
                                    Payment:{" "}
                                    {isPaid ? (
                                      <span className="text-emerald-400">
                                        Paid (${selectedEvent.eventFee})
                                      </span>
                                    ) : (
                                      <span className="text-amber-400">
                                        Pending
                                      </span>
                                    )}
                                  </p>
                                )}

                                {/* Cancel button — disabled if paid or already cancelled */}
                                <button
                                  onClick={() => handleCancel(reg._id)}
                                  disabled={!canCancel}
                                  title={
                                    isPaid
                                      ? "Cannot cancel a paid registration"
                                      : isCancelled
                                        ? "Already cancelled"
                                        : "Cancel this registration"
                                  }
                                  className={`cursor-pointer w-full flex items-center justify-center gap-1 py-1.5 text-[10px] font-semibold rounded-lg border transition-all duration-200 ${
                                    canCancel
                                      ? "bg-red-500/15 border-red-500/20 text-red-400 hover:bg-red-500/25"
                                      : "bg-white/3 border-white/8 text-white/20 cursor-not-allowed"
                                  }`}
                                >
                                  {isCancelled
                                    ? "Cancelled"
                                    : isPaid
                                      ? "Paid — Cannot Cancel"
                                      : "Cancel Registration"}
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        {/* Registration pagination */}
                        {totalRegPages > 1 && (
                          <div className="flex items-center justify-between pt-3 border-t border-white/6 mt-3">
                            <p className="text-[10px] text-white/25">
                              {(regPage - 1) * REGS_PER_PAGE + 1}–
                              {Math.min(
                                regPage * REGS_PER_PAGE,
                                registrations.length,
                              )}{" "}
                              <span className="text-white/15">
                                / {registrations.length}
                              </span>
                            </p>
                            <div className="flex gap-1">
                              <button
                                onClick={() =>
                                  setRegPage((p) => Math.max(1, p - 1))
                                }
                                disabled={regPage === 1}
                                className="cursor-pointer px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200"
                              >
                                ←
                              </button>
                              <button
                                onClick={() =>
                                  setRegPage((p) =>
                                    Math.min(totalRegPages, p + 1),
                                  )
                                }
                                disabled={regPage === totalRegPages}
                                className="cursor-pointer px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200"
                              >
                                →
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
