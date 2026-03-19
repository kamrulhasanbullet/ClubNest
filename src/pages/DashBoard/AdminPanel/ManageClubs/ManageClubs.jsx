import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { Building2, CheckCircle2, XCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";

const ITEMS_PER_PAGE = 10;

export const ManageClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const auth = getAuth();

  const fetchClubs = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return alert("Please login first");
      }

      const token = await user.getIdToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/clubs`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setClubs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const updateStatus = async (id, action) => {
    const user = auth.currentUser;
    if (!user) return alert("Not logged in");

    const token = await user.getIdToken();
    await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/clubs/${id}/${action}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    fetchClubs();
  };

  // Pagination
  const totalPages = Math.ceil(clubs.length / ITEMS_PER_PAGE);
  const paginatedClubs = clubs.slice(
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
            {Math.min(currentPage * ITEMS_PER_PAGE, clubs.length)}
          </span>{" "}
          of <span className="text-white/40">{clubs.length}</span> clubs
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
                    ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
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
            {[1, 0.75, 0.6, 0.45, 0.3].map((op, i) => (
              <div
                key={i}
                className="grid grid-cols-4 items-center px-6 py-4 border-b border-white/4 last:border-0 gap-4"
                style={{ opacity: op }}
              >
                <div className="h-2.5 w-32 rounded-full bg-white/6 animate-pulse" />
                <div className="h-2.5 w-40 rounded-full bg-white/6 animate-pulse" />
                <div className="h-5 w-16 rounded-full bg-white/6 animate-pulse" />
                <div className="flex justify-end gap-2">
                  <div className="h-7 w-20 rounded-lg bg-white/6 animate-pulse" />
                  <div className="h-7 w-16 rounded-lg bg-white/6 animate-pulse" />
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
      <Helmet>
        <title>Manage Clubs - ClubNest</title>
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
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-blue-400 mb-2">
            Admin Panel
          </p>
          <h1 className="text-[34px] sm:text-[42px] font-light font-serif leading-tight text-[#f0f4ff]">
            Manage <em className="italic text-[#93b4ff]">Clubs</em>
          </h1>
          <p className="text-sm text-white/30 mt-1">
            {clubs.length} total clubs · page {currentPage} of {totalPages || 1}
          </p>
        </div>

        {/* ── Empty state ── */}
        {clubs.length === 0 ? (
          <div className="bg-white/3 border border-white/8 rounded-2xl flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center">
              <Building2 size={20} className="text-white/20" />
            </div>
            <p className="text-sm font-medium text-white/30">
              No pending clubs found
            </p>
            <p className="text-[11px] text-white/15">
              Club requests will appear here
            </p>
          </div>
        ) : (
          <>
            {/* ── Desktop Table ── */}
            <div className="hidden md:block bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-[1fr_1fr_140px_200px] px-6 py-3 border-b border-white/7 bg-white/2">
                {["Club Name", "Manager", "Status", "Actions"].map((h, i) => (
                  <p
                    key={h}
                    className={`text-[9.5px] font-semibold tracking-[0.18em] uppercase text-white/20 ${
                      i === 3 ? "text-right" : ""
                    }`}
                  >
                    {h}
                  </p>
                ))}
              </div>

              {paginatedClubs.map((club) => (
                <div
                  key={club._id}
                  className="grid grid-cols-[1fr_1fr_140px_200px] items-center px-6 py-4 border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors duration-150"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500/20 to-violet-500/20 border border-white/8 flex items-center justify-center shrink-0">
                      <Building2 size={14} className="text-blue-300" />
                    </div>
                    <p className="text-sm font-semibold text-white/85 truncate pr-4">
                      {club.clubName}
                    </p>
                  </div>

                  <p className="text-sm text-white/45 truncate pr-4">
                    {club.managerEmail}
                  </p>

                  <div>
                    <span className="inline-flex items-center text-[10px] font-semibold px-2.5 py-0.5 rounded-full border text-amber-400 bg-amber-400/10 border-amber-400/20">
                      pending
                    </span>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => updateStatus(club._id, "approve")}
                      className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25 transition-all duration-200"
                    >
                      <CheckCircle2 size={11} />
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(club._id, "reject")}
                      className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-red-500/15 border border-red-500/20 text-red-400 hover:bg-red-500/25 transition-all duration-200"
                    >
                      <XCircle size={11} />
                      Reject
                    </button>
                  </div>
                </div>
              ))}

              <Pagination />
            </div>

            {/* ── Mobile Cards ── */}
            <div className="md:hidden space-y-3">
              {paginatedClubs.map((club) => (
                <div
                  key={club._id}
                  className="bg-white/3 border border-white/8 rounded-2xl p-4 space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500/20 to-violet-500/20 border border-white/8 flex items-center justify-center shrink-0">
                        <Building2 size={15} className="text-blue-300" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white/85 leading-tight">
                          {club.clubName}
                        </p>
                        <p className="text-[11px] text-white/30 truncate max-w-[180px]">
                          {club.managerEmail}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full border text-amber-400 bg-amber-400/10 border-amber-400/20 shrink-0">
                      pending
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateStatus(club._id, "approve")}
                      className="cursor-pointer flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-semibold rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 active:scale-95 transition-all duration-200"
                    >
                      <CheckCircle2 size={12} />
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(club._id, "reject")}
                      className="cursor-pointer flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-semibold rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 active:scale-95 transition-all duration-200"
                    >
                      <XCircle size={12} />
                      Reject
                    </button>
                  </div>
                </div>
              ))}

              <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden mt-4 mb-24">
                <Pagination />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
