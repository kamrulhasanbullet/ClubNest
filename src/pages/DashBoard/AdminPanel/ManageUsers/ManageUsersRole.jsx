import { useEffect, useState, useContext } from "react";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../../../context/AuthContext/AuthContext";
import { Users, ShieldCheck, Settings, User } from "lucide-react";
import { Helmet } from "react-helmet-async";

const ITEMS_PER_PAGE = 20;

export const ManageUsersRole = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useContext(AuthContext);
  const [userRole, setUserRole] = useState("");

  const fetchUserRole = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/role?email=${user.email}`,
      );
      const data = await res.json();
      setUserRole(data.role);
    } catch (err) {
      console.error("Failed to fetch user role", err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
    fetchUsers();
  }, [user?.email]);

  const handleRoleUpdate = async (email, newRole) => {
    if (!userRole || userRole !== "admin") {
      toast.error("Only Admins can change role");
      return;
    }
    if (email === user?.email && newRole !== "admin") {
      toast.error("Admin can not change his role");
      return;
    }
    try {
      const token = await user.getIdToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, newRole }),
        },
      );
      const data = await res.json();
      if (data.success) {
        toast.success(`Role updated to ${newRole}`);
        fetchUsers();
      } else {
        toast.error(data.message || "Role update failed");
      }
    } catch (err) {
      toast.error(err.message || "Network error");
      console.error(err);
    }
  };

  const roleBadge = (role) => {
    if (role === "admin")
      return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    if (role === "clubManager")
      return "text-violet-400 bg-violet-400/10 border-violet-400/20";
    return "text-white/40 bg-white/5 border-white/10";
  };

  // Pagination
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const paginatedUsers = users.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Page numbers to show (max 5 around current)
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

  /* ── Pagination UI ── */
  const Pagination = () =>
    totalPages > 1 ? (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-white/7">
        <p className="text-[11px] text-white/25">
          Showing{" "}
          <span className="text-white/40">
            {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(currentPage * ITEMS_PER_PAGE, users.length)}
          </span>{" "}
          of <span className="text-white/40">{users.length}</span> users
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
            <div className="h-9 w-48 rounded-2xl bg-white/6 animate-pulse" />
          </div>
          <div className="bg-white/3 border border-white/6 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 px-5 py-3 border-b border-white/6 bg-white/2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-2 w-20 rounded-full bg-white/6 animate-pulse"
                />
              ))}
            </div>
            {[1, 0.75, 0.55, 0.4, 0.3].map((op, i) => (
              <div
                key={i}
                className="grid grid-cols-3 items-center px-5 py-4 border-b border-white/4 last:border-0"
                style={{ opacity: op }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/6 animate-pulse shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-2.5 w-24 rounded-full bg-white/6 animate-pulse" />
                    <div className="h-2 w-32 rounded-full bg-white/4 animate-pulse" />
                  </div>
                </div>
                <div className="h-5 w-16 rounded-full bg-white/6 animate-pulse" />
                <div className="flex justify-end gap-2">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="h-7 w-16 rounded-lg bg-white/6 animate-pulse"
                    />
                  ))}
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
        <title>Manage Users Role - ClubNest</title>
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
            Manage <em className="italic text-[#93b4ff]">Users</em>
          </h1>
          <p className="text-sm text-white/30 mt-1">
            {users.length} total users · page {currentPage} of {totalPages || 1}
          </p>
        </div>

        {/* ── Desktop Table ── */}
        <div className="hidden md:block bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_160px_280px] px-6 py-3 border-b border-white/7 bg-white/2">
            {["User Information", "Current Role", "Manage Role"].map((h, i) => (
              <p
                key={h}
                className={`text-[9.5px] font-semibold tracking-[0.18em] uppercase text-white/20 ${
                  i === 2 ? "text-right" : ""
                }`}
              >
                {h}
              </p>
            ))}
          </div>

          {/* Rows */}
          {paginatedUsers.map((userRow) => {
            const isSelf = userRow.email === user?.email;
            return (
              <div
                key={userRow.uid}
                className="grid grid-cols-[1fr_160px_280px] items-center px-6 py-4 border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors duration-150"
              >
                {/* User info */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500/20 to-violet-500/20 border border-white/8 flex items-center justify-center shrink-0">
                    <Users size={14} className="text-blue-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/85 leading-tight">
                      {userRow.name}
                      {isSelf && (
                        <span className="ml-2 text-[9px] font-bold tracking-widest uppercase text-blue-400/70">
                          you
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-white/30">{userRow.email}</p>
                  </div>
                </div>

                {/* Role badge */}
                <div>
                  <span
                    className={`inline-flex items-center text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${roleBadge(userRow.role)}`}
                  >
                    {userRow.role}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleRoleUpdate(userRow.email, "admin")}
                    disabled={userRole !== "admin" || isSelf}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-blue-500/15 border border-blue-500/20 text-blue-400 hover:bg-blue-500/25 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                  >
                    <ShieldCheck size={11} />
                    Admin
                  </button>
                  <button
                    onClick={() =>
                      handleRoleUpdate(userRow.email, "clubManager")
                    }
                    disabled={userRole !== "admin" || isSelf}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-violet-500/15 border border-violet-500/20 text-violet-400 hover:bg-violet-500/25 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                  >
                    <Settings size={11} />
                    Manager
                  </button>
                  <button
                    onClick={() => handleRoleUpdate(userRow.email, "member")}
                    disabled={userRole !== "admin" || isSelf}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-white/5 border border-white/10 text-white/45 hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                  >
                    <User size={11} />
                    Member
                  </button>
                </div>
              </div>
            );
          })}

          <Pagination />
        </div>

        {/* ── Mobile Cards ── */}
        <div className="md:hidden space-y-3">
          {paginatedUsers.map((userRow) => {
            const isSelf = userRow.email === user?.email;
            return (
              <div
                key={userRow.uid}
                className="bg-white/3 border border-white/8 rounded-2xl p-4 space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500/20 to-violet-500/20 border border-white/8 flex items-center justify-center shrink-0">
                      <Users size={15} className="text-blue-300" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white/85 leading-tight">
                        {userRow.name}
                        {isSelf && (
                          <span className="ml-1.5 text-[9px] font-bold tracking-widest uppercase text-blue-400/70">
                            you
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-white/30 truncate max-w-[180px]">
                        {userRow.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${roleBadge(userRow.role)}`}
                  >
                    {userRow.role}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleRoleUpdate(userRow.email, "admin")}
                    disabled={userRole !== "admin" || isSelf}
                    className="py-2.5 text-[11px] font-semibold rounded-xl bg-blue-500/15 border border-blue-500/20 text-blue-400 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                  >
                    Admin
                  </button>
                  <button
                    onClick={() =>
                      handleRoleUpdate(userRow.email, "clubManager")
                    }
                    disabled={userRole !== "admin" || isSelf}
                    className="py-2.5 text-[11px] font-semibold rounded-xl bg-violet-500/15 border border-violet-500/20 text-violet-400 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                  >
                    Manager
                  </button>
                  <button
                    onClick={() => handleRoleUpdate(userRow.email, "member")}
                    disabled={userRole !== "admin" || isSelf}
                    className="py-2.5 text-[11px] font-semibold rounded-xl bg-white/5 border border-white/10 text-white/45 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                  >
                    Member
                  </button>
                </div>
              </div>
            );
          })}

          {/* Mobile pagination */}
          <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden mt-4 mb-24">
            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
};
