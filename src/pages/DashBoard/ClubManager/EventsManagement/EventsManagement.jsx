import { use, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { AuthContext } from "../../../../context/AuthContext/AuthContext";
import Swal from "sweetalert2";
import {
  CalendarDays,
  MapPin,
  Users,
  Eye,
  Pencil,
  Trash2,
  Plus,
  DollarSign,
  Clock,
  CalendarCheck,
} from "lucide-react";

const ITEMS_PER_PAGE = 20;

export const EventsManagement = () => {
  const { user } = use(AuthContext);
  const [token, setToken] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) user.getIdToken().then(setToken);
  }, [user]);

  const fetchEvents = () => {
    if (!token) return;
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/events/manager`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEvents(res.data))
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load events",
          background: "#0b0f1e",
          color: "#e8eeff",
          confirmButtonColor: "#4f7fff",
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, [token]);

  const handleDeleteEvent = async (eventId, eventTitle) => {
    const result = await Swal.fire({
      title: "Delete Event?",
      text: `"${eventTitle}" and all its registrations will be permanently deleted.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#4f7fff",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      background: "#0b0f1e",
      color: "#e8eeff",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/events/${eventId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: `"${eventTitle}" deleted successfully.`,
          timer: 2000,
          showConfirmButton: false,
          background: "#0b0f1e",
          color: "#e8eeff",
        });
        fetchEvents();
      } else {
        throw new Error(response.data.message || "Failed to delete event");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to delete event",
        background: "#0b0f1e",
        color: "#e8eeff",
        confirmButtonColor: "#4f7fff",
      });
    }
  };

  // Pagination
  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  const paginatedEvents = events.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const getPageNumbers = () => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    pages.push(1);
    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const Pagination = () =>
    totalPages > 1 ? (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 pb-24">
        <p className="text-[11px] text-white/25">
          Showing{" "}
          <span className="text-white/40">
            {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(currentPage * ITEMS_PER_PAGE, events.length)}
          </span>{" "}
          of <span className="text-white/40">{events.length}</span> events
        </p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="cursor-pointer px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-white/5 border border-white/10 text-white/45 hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200"
          >
            ← Prev
          </button>
          {getPageNumbers().map((page, i) =>
            page === "..." ? (
              <span key={`dots-${i}`} className="text-white/25 text-xs px-1">
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`cursor-pointer w-8 h-8 text-[11px] font-semibold rounded-lg border transition-all duration-200 ${
                  page === currentPage
                    ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-400"
                    : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                }`}
              >
                {page}
              </button>
            ),
          )}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="cursor-pointer px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-white/5 border border-white/10 text-white/45 hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200"
          >
            Next →
          </button>
        </div>
      </div>
    ) : null;

  /* ── Skeleton ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#060810] px-4 sm:px-8 py-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-linear-to-bl from-blue-600 to-violet-700 opacity-6 blur-[110px] pointer-events-none" />
        <div className="relative z-10 max-w-[1440px] mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-2 w-24 rounded-full bg-white/6 animate-pulse" />
              <div className="h-9 w-40 rounded-2xl bg-white/6 animate-pulse" />
            </div>
            <div className="h-10 w-36 rounded-xl bg-white/6 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 0.75, 0.5].map((op, i) => (
              <div
                key={i}
                className="bg-white/3 border border-white/6 rounded-2xl p-5 space-y-4 animate-pulse"
                style={{ opacity: op }}
              >
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-36 rounded-full bg-white/8" />
                    <div className="h-2.5 w-24 rounded-full bg-white/4" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-5 w-16 rounded-full bg-white/6" />
                    <div className="h-5 w-20 rounded-full bg-white/4" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2.5 w-full rounded-full bg-white/4" />
                  <div className="h-2.5 w-3/4 rounded-full bg-white/4" />
                </div>
                <div className="space-y-2 pt-2">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="h-2.5 w-1/2 rounded-full bg-white/4"
                    />
                  ))}
                </div>
                <div className="flex gap-2 pt-3 border-t border-white/6">
                  <div className="h-8 flex-1 rounded-xl bg-white/6" />
                  <div className="h-8 flex-1 rounded-xl bg-white/6" />
                  <div className="h-8 flex-1 rounded-xl bg-white/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060810] text-white px-4 sm:px-8 py-8 space-y-8 relative overflow-hidden">
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
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-cyan-400 mb-2">
              Club Manager
            </p>
            <h1 className="text-[34px] sm:text-[42px] font-light font-serif leading-tight text-[#f0f4ff]">
              My <em className="italic text-[#67e8f9]">Events</em>
            </h1>
            <p className="text-sm text-white/30 mt-1">
              {events.length} events · page {currentPage} of {totalPages || 1}
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/manager/create-event")}
            className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold shadow-[0_4px_14px_rgba(6,182,212,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(6,182,212,0.45)] transition-all duration-200 shrink-0"
          >
            <Plus size={15} />
            Create Event
          </button>
        </div>

        {/* ── Empty state ── */}
        {events.length === 0 ? (
          <div className="bg-white/3 border border-white/8 rounded-2xl flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center">
              <CalendarDays size={24} className="text-white/20" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-white/35 mb-1">
                No events yet
              </p>
              <p className="text-[11px] text-white/20">
                Create your first event to get started
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard/manager/create-event")}
              className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold shadow-[0_4px_14px_rgba(6,182,212,0.35)] hover:-translate-y-0.5 transition-all duration-200 mt-2"
            >
              <Plus size={15} />
              Create Your First Event
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedEvents.map((ev) => {
                const isPast = new Date(ev.eventDate) < new Date();
                return (
                  <div
                    key={ev._id}
                    className="group bg-white/3 border border-white/8 rounded-2xl p-5 flex flex-col hover:border-white/15 hover:bg-white/5 transition-all duration-300"
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-sm font-semibold text-white/90 truncate leading-tight mb-1">
                          {ev.title}
                        </h2>
                        <p className="text-[11px] text-white/35 truncate">
                          {ev.clubName}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        {ev.isPaid ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border text-amber-400 bg-amber-400/10 border-amber-400/20">
                            <DollarSign size={9} />${ev.eventFee}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border text-emerald-400 bg-emerald-400/10 border-emerald-400/20">
                            Free
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border text-blue-400 bg-blue-400/10 border-blue-400/20">
                          <Users size={9} />
                          {ev.registeredUsersCount || 0}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {ev.description && (
                      <p className="text-[12px] text-white/30 line-clamp-2 leading-relaxed mb-4">
                        {ev.description}
                      </p>
                    )}

                    {/* Details */}
                    <div className="space-y-2 mb-4 flex-1">
                      <div className="flex items-center gap-2 text-[11.5px] text-white/40">
                        <CalendarDays
                          size={12}
                          className="text-white/25 shrink-0"
                        />
                        {new Date(ev.eventDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        <span className="text-white/25">·</span>
                        {new Date(ev.eventDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>

                      {ev.location && (
                        <div className="flex items-center gap-2 text-[11.5px] text-white/40">
                          <MapPin
                            size={12}
                            className="text-white/25 shrink-0"
                          />
                          <span className="truncate">{ev.location}</span>
                        </div>
                      )}

                      {ev.maxAttendees && (
                        <div className="flex items-center gap-2 text-[11.5px] text-white/40">
                          <Users size={12} className="text-white/25 shrink-0" />
                          Max {ev.maxAttendees} attendees
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {isPast ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border text-white/30 bg-white/5 border-white/10">
                            <Clock size={9} />
                            Past Event
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border text-cyan-400 bg-cyan-400/10 border-cyan-400/20">
                            <CalendarCheck size={9} />
                            Upcoming
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-white/6">
                      <button
                        onClick={() => navigate(`/events/${ev._id}`)}
                        className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold rounded-xl bg-white/5 border border-white/10 text-white/45 hover:bg-white/10 transition-all duration-200"
                      >
                        <Eye size={11} />
                        View
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/dashboard/manager/edit-event/${ev._id}`)
                        }
                        className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold rounded-xl bg-blue-500/15 border border-blue-500/20 text-blue-400 hover:bg-blue-500/25 transition-all duration-200"
                      >
                        <Pencil size={11} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(ev._id, ev.title)}
                        className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 hover:bg-red-500/25 transition-all duration-200"
                      >
                        <Trash2 size={11} />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <Pagination />
          </>
        )}
      </div>
    </div>
  );
};
