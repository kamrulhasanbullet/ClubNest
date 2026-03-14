import { NavLink, useNavigate } from "react-router";
import { Home, Users, User } from "lucide-react";
import { use, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext/AuthContext";

const DashBoardNavbar = () => {
  const { user } = use(AuthContext);
  const [currentUserRole, setCurrentUserRole] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const roleDashboardMap = {
    admin: { to: "/dashboard/admin", label: "Admin Panel", icon: Home },
    clubManager: {
      to: "/dashboard/manager",
      label: "Club Manager",
      icon: Users,
    },
    member: { to: "/dashboard/member", label: "Member", icon: User },
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`);
        if (!res.ok) throw new Error("Failed to fetch users");

        const allUsers = await res.json();
        const current = allUsers.find((u) => u.email === user.email);

        if (current) {
          setCurrentUserRole(current.role);
          const userDashboard = roleDashboardMap[current.role];
          if (userDashboard) {
            const currentPath = window.location.pathname;
            if (!currentPath.startsWith(userDashboard.to)) {
              navigate(userDashboard.to);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, navigate]);

  /* ─── Sidebar shell ─── */
  const Shell = ({ children }) => (
    <>
      {/* ── DESKTOP ── */}
      <aside className="hidden sm:flex fixed inset-y-0 left-0 w-64 z-40 flex-col">
        {/* Glass bg */}
        <div className="absolute inset-0 bg-[#0d1424]/90 backdrop-blur-2xl border-r border-white/[0.07]" />

        {/* Subtle aurora inside sidebar */}
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-0 w-32 h-32 bg-violet-600/08 rounded-full blur-2xl pointer-events-none" />

        {/* Top accent */}
        <div className="relative h-[3px] shrink-0 bg-linear-to-r from-blue-500 via-indigo-500 to-violet-500" />

        {/* Nav */}
        <nav className="relative flex-1 flex flex-col justify-center px-4 gap-1">
          {children}
        </nav>

        {/* User pill */}
        {user && (
          <div className="relative px-4 py-4 border-t border-white/[0.07] shrink-0">
            <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-white/4 border border-white/[0.07] hover:bg-white/[0.07] hover:border-white/12 transition-all duration-200 cursor-default group">
              <div className="relative shrink-0">
                <img
                  src={
                    user.photoURL ||
                    `https://ui-avatars.com/api/?name=${user.displayName}&background=4f7fff&color=fff`
                  }
                  alt="avatar"
                  className="w-8 h-8 rounded-xl object-cover"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0d1424]" />
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-[12.5px] font-semibold text-white/75 truncate leading-tight">
                  {user.displayName || "User"}
                </p>
                <p className="text-[10px] text-white/30 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ── MOBILE bottom bar ── */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40">
        <div className="absolute inset-0 bg-[#0d1424]/95 backdrop-blur-2xl border-t border-white/[0.07]" />
        <div className="relative flex items-center justify-around px-8 py-2">
          {children}
        </div>
      </div>
    </>
  );

  /* ── Loading ── */
  if (loading) {
    return (
      <Shell>
        {/* desktop skeleton */}
        <div className="hidden sm:flex flex-col gap-2 w-full">
          {[1, 0.55, 0.3].map((op, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/4 animate-pulse"
              style={{ opacity: op }}
            >
              <div className="w-9 h-9 rounded-xl bg-white/[0.07] shrink-0" />
              <div className="h-3 w-28 bg-white/[0.07] rounded-full" />
            </div>
          ))}
        </div>
        {/* mobile skeleton */}
        <div className="sm:hidden w-12 h-12 rounded-2xl bg-white/6 animate-pulse" />
      </Shell>
    );
  }

  const dashboardItem = currentUserRole
    ? roleDashboardMap[currentUserRole]
    : null;

  /* ── Access restricted ── */
  if (!dashboardItem) {
    setTimeout(() => navigate("/"), 2000);
    return (
      <Shell>
        <div className="hidden sm:block w-full">
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-red-500/10 border border-red-500/20">
            <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
              <span className="text-red-400 text-sm font-bold">!</span>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-red-400">
                Access Restricted
              </p>
              <p className="text-[10px] text-red-400/50">Redirecting in 2s…</p>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  const Icon = dashboardItem.icon;

  return (
    <Shell>
      {/* ── Desktop nav item ── */}
      <div className="hidden sm:block w-full">
        <p className="text-[9px] font-semibold tracking-[0.22em] uppercase text-white/20 px-4 mb-2">
          Navigation
        </p>
        <NavLink
          to={dashboardItem.to}
          end
          className={({ isActive }) =>
            `group relative flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border transition-all duration-250 ${
              isActive
                ? "bg-linear-to-r from-blue-500/18 to-violet-500/10 border-blue-500/25 text-white"
                : "border-transparent text-white/40 hover:text-white/75 hover:bg-white/5"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {/* Active left bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full bg-linear-to-b from-blue-400 to-violet-500" />
              )}

              {/* Icon pill */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                  isActive
                    ? "bg-linear-to-br from-blue-500 to-violet-500 shadow-[0_4px_16px_rgba(79,127,255,0.45)]"
                    : "bg-white/6 group-hover:bg-white/10"
                }`}
              >
                <Icon size={16} />
              </div>

              <span className="text-[13.5px] font-medium tracking-wide">
                {dashboardItem.label}
              </span>

              {isActive && (
                <div className="ml-auto flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                </div>
              )}
            </>
          )}
        </NavLink>
      </div>

      {/* ── Mobile bottom bar item ── */}
      <NavLink
        to={dashboardItem.to}
        end
        className={({ isActive }) =>
          `sm:hidden flex flex-col items-center gap-1.5 py-1.5 px-5 rounded-2xl transition-all duration-200 ${
            isActive ? "text-white" : "text-white/30"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? "bg-linear-to-br from-blue-500 to-violet-500 shadow-[0_4px_16px_rgba(79,127,255,0.4)]"
                  : "bg-white/5"
              }`}
            >
              <Icon size={19} />
            </div>
            <span className="text-[10px] font-semibold tracking-wide">
              {dashboardItem.label.split(" ")[0]}
            </span>
          </>
        )}
      </NavLink>
    </Shell>
  );
};

export default DashBoardNavbar;
