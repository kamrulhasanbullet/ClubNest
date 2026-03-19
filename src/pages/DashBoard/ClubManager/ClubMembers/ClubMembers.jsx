import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext/AuthContext";
import { Users, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";

const ITEMS_PER_PAGE = 20;

export const ClubMembers = () => {
  const { user } = useContext(AuthContext);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!user?.email) return;
      try {
        setLoading(true);
        setError("");
        const token = await user.getIdToken();
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/memberships?managerEmail=${user.email}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data = await res.json();
        setMembers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load members");
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [user?.email]);

  // Unique clubs count
  const uniqueClubs = [
    ...new Set(members.map((m) => m.clubName).filter(Boolean)),
  ];

  // Pagination
  const totalPages = Math.ceil(members.length / ITEMS_PER_PAGE);
  const paginatedMembers = members.slice(
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-white/7">
        <p className="text-[11px] text-white/25">
          Showing{" "}
          <span className="text-white/40">
            {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(currentPage * ITEMS_PER_PAGE, members.length)}
          </span>{" "}
          of <span className="text-white/40">{members.length}</span> members
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
                    ? "bg-violet-500/20 border-violet-500/30 text-violet-400"
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
          <div className="space-y-3">
            <div className="h-2 w-24 rounded-full bg-white/6 animate-pulse" />
            <div className="h-9 w-44 rounded-2xl bg-white/6 animate-pulse" />
          </div>
          <div className="bg-white/3 border border-white/6 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-4 px-6 py-3 border-b border-white/6 bg-white/2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-2 w-16 rounded-full bg-white/6 animate-pulse"
                />
              ))}
            </div>
            {[1, 0.75, 0.55, 0.4, 0.3].map((op, i) => (
              <div
                key={i}
                className="grid grid-cols-4 items-center px-6 py-4 border-b border-white/4 last:border-0 gap-4"
                style={{ opacity: op }}
              >
                <div className="h-2.5 w-36 rounded-full bg-white/6 animate-pulse" />
                <div className="h-2.5 w-24 rounded-full bg-white/6 animate-pulse" />
                <div className="h-5 w-16 rounded-full bg-white/6 animate-pulse" />
                <div className="h-2.5 w-20 rounded-full bg-white/4 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060810] text-white px-4 sm:px-8 py-8 space-y-8 relative overflow-hidden">
      <Helmet>
        <title>Club Members - ClubNest</title>
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
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-violet-400 mb-2">
            Club Manager
          </p>
          <h1 className="text-[34px] sm:text-[42px] font-light font-serif leading-tight text-[#f0f4ff]">
            Club <em className="italic text-[#c4b5fd]">Members</em>
          </h1>
          <p className="text-sm text-white/30 mt-1">
            {members.length} total members across {uniqueClubs.length} clubs ·
            page {currentPage} of {totalPages || 1}
          </p>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4">
            <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
              <AlertCircle size={16} className="text-red-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-400">
                Failed to load members
              </p>
              <p className="text-[11px] text-red-400/60 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* ── Empty ── */}
        {!error && members.length === 0 && (
          <div className="bg-white/3 border border-white/8 rounded-2xl flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center">
              <Users size={20} className="text-white/20" />
            </div>
            <p className="text-sm font-medium text-white/30">
              No members found
            </p>
            <p className="text-[11px] text-white/15">
              Members will appear here once they join your clubs
            </p>
          </div>
        )}

        {/* ── Desktop Table ── */}
        {!error && members.length > 0 && (
          <div className="hidden md:block bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-[1fr_1fr_140px_140px] px-6 py-3 border-b border-white/7 bg-white/2">
              {["Member Email", "Club Name", "Status", "Joined At"].map((h) => (
                <p
                  key={h}
                  className="text-[9.5px] font-semibold tracking-[0.18em] uppercase text-white/20"
                >
                  {h}
                </p>
              ))}
            </div>

            {paginatedMembers.map((m) => (
              <div
                key={m._id}
                className="grid grid-cols-[1fr_1fr_140px_140px] items-center px-6 py-4 border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors duration-150"
              >
                <p className="text-sm text-white/65 truncate pr-4">
                  {m.userEmail}
                </p>

                <div className="flex items-center gap-2 pr-4">
                  <div className="w-6 h-6 rounded-lg bg-linear-to-br from-blue-500/20 to-violet-500/20 border border-white/8 flex items-center justify-center shrink-0">
                    <Users size={11} className="text-blue-300" />
                  </div>
                  <p className="text-sm text-white/50 truncate">
                    {m.clubName || "—"}
                  </p>
                </div>

                <div>
                  {m.status === "active" ? (
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full border text-emerald-400 bg-emerald-400/10 border-emerald-400/20">
                      <CheckCircle2 size={10} />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full border text-amber-400 bg-amber-400/10 border-amber-400/20">
                      <Clock size={10} />
                      Pending
                    </span>
                  )}
                </div>

                <p className="text-sm text-white/30">
                  {m.joinedAt
                    ? new Date(m.joinedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "2-digit",
                      })
                    : "—"}
                </p>
              </div>
            ))}

            <Pagination />
          </div>
        )}

        {/* ── Mobile Cards ── */}
        {!error && members.length > 0 && (
          <div className="md:hidden space-y-3">
            {paginatedMembers.map((m) => (
              <div
                key={m._id}
                className="bg-white/3 border border-white/8 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-white/75 truncate font-medium">
                    {m.userEmail}
                  </p>
                  {m.status === "active" ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shrink-0">
                      <CheckCircle2 size={9} />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border text-amber-400 bg-amber-400/10 border-amber-400/20 shrink-0">
                      <Clock size={9} />
                      Pending
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-white/35">
                    <Users size={10} className="text-white/25" />
                    {m.clubName || "—"}
                  </div>
                  <p className="text-[11px] text-white/25">
                    {m.joinedAt
                      ? new Date(m.joinedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "2-digit",
                        })
                      : "—"}
                  </p>
                </div>
              </div>
            ))}

            <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden mt-4 mb-24">
              <Pagination />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
