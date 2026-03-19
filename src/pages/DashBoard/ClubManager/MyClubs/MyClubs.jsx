import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { use, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../../../context/AuthContext/AuthContext";
import Swal from "sweetalert2";
import {
  Building2,
  MapPin,
  Tag,
  DollarSign,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

const ITEMS_PER_PAGE = 20;

export const MyClubs = () => {
  const { user } = use(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["myClubs", user?.email],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/clubs?managerEmail=${user.email}`,
        { headers: { Authorization: `Bearer ${await user.getIdToken()}` } },
      );
      return res.json();
    },
    enabled: !!user?.email,
  });

  const deleteMutation = useMutation({
    mutationFn: async (clubId) => {
      const token = await user.getIdToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/clubs/${clubId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myClubs", user?.email]);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Club has been deleted successfully.",
        timer: 2000,
        showConfirmButton: false,
        background: "#0b0f1e",
        color: "#e8eeff",
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to delete club",
        background: "#0b0f1e",
        color: "#e8eeff",
        confirmButtonColor: "#4f7fff",
      });
    },
  });

  const handleDelete = (clubId, clubName) => {
    Swal.fire({
      title: "Delete Club?",
      text: `"${clubName}" will be permanently deleted.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#4f7fff",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      background: "#0b0f1e",
      color: "#e8eeff",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(clubId);
    });
  };

  const handleEdit = (clubId) => {
    navigate(`/dashboard/manager/edit-club/${clubId}`);
  };

  const statusStyle = (status) => {
    if (status === "approved")
      return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (status === "pending")
      return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    return "text-red-400 bg-red-400/10 border-red-400/20";
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 mb-24">
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
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#060810] px-4 sm:px-8 py-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-linear-to-bl from-blue-600 to-violet-700 opacity-6 blur-[110px] pointer-events-none" />
        <div className="relative z-10 max-w-[1440px] mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-2 w-24 rounded-full bg-white/6 animate-pulse" />
              <div className="h-9 w-36 rounded-2xl bg-white/6 animate-pulse" />
            </div>
            <div className="h-10 w-32 rounded-xl bg-white/6 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 0.75, 0.5].map((op, i) => (
              <div
                key={i}
                className="bg-white/3 border border-white/6 rounded-2xl overflow-hidden animate-pulse"
                style={{ opacity: op }}
              >
                <div className="h-44 bg-white/6" />
                <div className="p-5 space-y-4">
                  <div className="h-4 w-3/4 rounded-full bg-white/8" />
                  <div className="h-3 w-full rounded-full bg-white/4" />
                  <div className="h-3 w-2/3 rounded-full bg-white/4" />
                  <div className="space-y-2 pt-2">
                    {[1, 2, 3].map((j) => (
                      <div
                        key={j}
                        className="h-2.5 w-1/2 rounded-full bg-white/4"
                      />
                    ))}
                  </div>
                  <div className="flex justify-between pt-3 border-t border-white/6">
                    <div className="h-8 w-20 rounded-xl bg-white/6" />
                    <div className="h-8 w-20 rounded-xl bg-white/6" />
                  </div>
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
        <title>My Clubs - ClubNest</title>
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
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-violet-400 mb-2">
              Club Manager
            </p>
            <h1 className="text-[34px] sm:text-[42px] font-light font-serif leading-tight text-[#f0f4ff]">
              My <em className="italic text-[#c4b5fd]">Clubs</em>
            </h1>
            <p className="text-sm text-white/30 mt-1">
              {clubs.length} clubs · page {currentPage} of {totalPages || 1}
            </p>
          </div>
          <Link
            to="/dashboard/manager/create-club"
            className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-blue-500 to-violet-500 text-white text-sm font-semibold shadow-[0_4px_14px_rgba(79,127,255,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(79,127,255,0.45)] transition-all duration-200 shrink-0"
          >
            <Plus size={15} />
            Create Club
          </Link>
        </div>

        {/* ── Empty state ── */}
        {clubs.length === 0 ? (
          <div className="bg-white/3 border border-white/8 rounded-2xl flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center">
              <Building2 size={24} className="text-white/20" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-white/35 mb-1">
                No clubs yet
              </p>
              <p className="text-[11px] text-white/20">
                Create your first club to get started
              </p>
            </div>
            <Link
              to="/dashboard/manager/create-club"
              className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-500 to-violet-500 text-white text-sm font-semibold shadow-[0_4px_14px_rgba(79,127,255,0.35)] hover:-translate-y-0.5 transition-all duration-200 mt-2"
            >
              <Plus size={15} />
              Create Your First Club
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedClubs.map((club) => (
                <div
                  key={club._id}
                  className="group bg-white/3 border border-white/8 rounded-2xl overflow-hidden hover:border-white/15 hover:bg-white/5 transition-all duration-300"
                >
                  {/* Banner */}
                  {club.bannerImage ? (
                    <img
                      src={club.bannerImage}
                      alt={club.clubName}
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <div className="h-44 w-full bg-linear-to-br from-blue-500/15 to-violet-500/15 flex items-center justify-center border-b border-white/6">
                      <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center">
                        <Building2 size={24} className="text-blue-300" />
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-semibold text-white/90 truncate leading-tight">
                        {club.clubName}
                      </h3>
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${statusStyle(club.status)}`}
                      >
                        {club.status?.toUpperCase()}
                      </span>
                    </div>

                    {club.description && (
                      <p className="text-[12px] text-white/35 line-clamp-2 leading-relaxed">
                        {club.description}
                      </p>
                    )}

                    <div className="space-y-2">
                      {club.location && (
                        <div className="flex items-center gap-2 text-[11.5px] text-white/35">
                          <MapPin
                            size={12}
                            className="text-white/25 shrink-0"
                          />
                          {club.location}
                        </div>
                      )}
                      {club.category && (
                        <div className="flex items-center gap-2 text-[11.5px] text-white/35">
                          <Tag size={12} className="text-white/25 shrink-0" />
                          {club.category}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-[11.5px] text-white/35">
                        <DollarSign
                          size={12}
                          className="text-white/25 shrink-0"
                        />
                        Membership fee: ${club.membershipFee || 0}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-white/6">
                      <button
                        onClick={() => handleEdit(club._id)}
                        className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold rounded-xl bg-blue-500/15 border border-blue-500/20 text-blue-400 hover:bg-blue-500/25 transition-all duration-200"
                      >
                        <Pencil size={11} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(club._id, club.clubName)}
                        disabled={deleteMutation.isPending}
                        className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 hover:bg-red-500/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {deleteMutation.isPending ? (
                          <span className="text-[10px]">Deleting…</span>
                        ) : (
                          <>
                            <Trash2 size={11} />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Pagination />
          </>
        )}
      </div>
    </div>
  );
};
