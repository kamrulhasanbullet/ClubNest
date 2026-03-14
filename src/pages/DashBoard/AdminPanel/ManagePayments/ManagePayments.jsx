import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext/AuthContext";
import { toast } from "react-hot-toast";
import { CreditCard, CheckCircle2 } from "lucide-react";

const ITEMS_PER_PAGE = 20;

export const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useContext(AuthContext);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const token = await user?.getIdToken();
      if (!token) throw new Error("User token not found");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch payments");
      }

      const data = await res.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Network error");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Pagination
  const totalPages = Math.ceil(payments.length / ITEMS_PER_PAGE);
  const paginatedPayments = payments.slice(
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
            {Math.min(currentPage * ITEMS_PER_PAGE, payments.length)}
          </span>{" "}
          of <span className="text-white/40">{payments.length}</span> payments
        </p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-white/5 border border-white/10 text-white/45 hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
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
                className={`w-8 h-8 text-[11px] font-semibold rounded-lg border transition-all duration-200 cursor-pointer ${
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
            className="px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-white/5 border border-white/10 text-white/45 hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
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
                <div className="h-2.5 w-14 rounded-full bg-white/6 animate-pulse" />
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
            Manage <em className="italic text-[#93b4ff]">Payments</em>
          </h1>
          <p className="text-sm text-white/30 mt-1">
            {payments.length} total records · page {currentPage} of{" "}
            {totalPages || 1}
          </p>
        </div>

        {/* ── Empty state ── */}
        {payments.length === 0 ? (
          <div className="bg-white/3 border border-white/8 rounded-2xl flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center">
              <CreditCard size={20} className="text-white/20" />
            </div>
            <p className="text-sm font-medium text-white/30">
              No payments found
            </p>
            <p className="text-[11px] text-white/15">
              Payment records will appear here
            </p>
          </div>
        ) : (
          <>
            {/* ── Desktop Table ── */}
            <div className="hidden md:block bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-[1fr_1fr_120px_140px] px-6 py-3 border-b border-white/7 bg-white/2">
                {["User", "Club", "Amount", "Date"].map((h) => (
                  <p
                    key={h}
                    className="text-[9.5px] font-semibold tracking-[0.18em] uppercase text-white/20"
                  >
                    {h}
                  </p>
                ))}
              </div>

              {paginatedPayments.map((p) => (
                <div
                  key={p._id}
                  className="grid grid-cols-[1fr_1fr_120px_140px] items-center px-6 py-4 border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors duration-150"
                >
                  <p className="text-sm text-white/70 truncate pr-4">
                    {p.userEmail}
                  </p>
                  <p className="text-sm text-white/55 truncate pr-4">
                    {p.clubName}
                  </p>
                  <div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 size={10} />${p.amount}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/30">
                    {new Date(p.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "2-digit",
                    })}
                  </p>
                </div>
              ))}

              <Pagination />
            </div>

            {/* ── Mobile Cards ── */}
            <div className="md:hidden space-y-3">
              {paginatedPayments.map((p) => (
                <div
                  key={p._id}
                  className="bg-white/3 border border-white/8 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-white/80 truncate">
                      {p.userEmail}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-0.5 rounded-full shrink-0">
                      <CheckCircle2 size={10} />${p.amount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-white/35">{p.clubName}</p>
                    <p className="text-[11px] text-white/25">
                      {new Date(p.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "2-digit",
                      })}
                    </p>
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
