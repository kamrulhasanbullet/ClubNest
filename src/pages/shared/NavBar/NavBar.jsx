import { use, useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import toast from "react-hot-toast";
import {
  Calendar1,
  Club,
  House,
  LogOut,
  User,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";

/* ── Keyframes only — Tailwind can't do these ─── */
const ANIM = `
  @keyframes nbFadeIn  { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes nbSlideIn { from{opacity:0;transform:translateY(6px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes nbMenuIn  { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
  .nb-fadein  { animation: nbFadeIn  0.3s cubic-bezier(.22,1,.36,1) forwards; }
  .nb-slidein { animation: nbSlideIn 0.22s cubic-bezier(.22,1,.36,1) forwards; }
  .nb-menuin  { animation: nbMenuIn  0.2s cubic-bezier(.22,1,.36,1) forwards; }
  .font-bricolage { font-family: 'Bricolage Grotesque', sans-serif; }
`;

export const NavBar = () => {
  const { user, signOutUser } = use(AuthContext);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef(null);
  const location = useLocation();

  /* close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* close mobile menu on route change */
  useEffect(() => {
    setMobileOpen(false);
    setAvatarOpen(false);
  }, [location]);

  /* scroll shadow */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleLogout = () => {
    signOutUser();
    toast.success("Logged out successfully");
    setAvatarOpen(false);
  };

  /* active link style helper */
  const linkCls = ({ isActive }) =>
    `relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 group
     ${
       isActive
         ? "text-indigo-600 bg-indigo-50"
         : "text-gray-500 hover:text-[#1a1a2e] hover:bg-gray-100"
     }`;

  const mobileLinkCls = ({ isActive }) =>
    `nb-menuin flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
     ${
       isActive
         ? "text-indigo-600 bg-indigo-50"
         : "text-gray-600 hover:text-[#1a1a2e] hover:bg-gray-50"
     }`;

  return (
    <>
      <style>{ANIM}</style>

      {/* ── NAV WRAPPER ─────────────────────────── */}
      <nav
        className={`sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 transition-shadow duration-300
        ${scrolled ? "shadow-[0_4px_24px_rgba(0,0,0,0.06)]" : "shadow-none"}`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between gap-4">
          {/* ── LOGO ────────────────────────────── */}
          <NavLink
            to="/"
            className="flex items-center gap-2 shrink-0 no-underline group"
          >
            {/* icon mark */}
            <div className="w-9 h-9 rounded-[11px] bg-linear-to-br from-indigo-500 to-orange-500 flex items-center justify-center shadow-[0_4px_14px_rgba(79,70,229,0.25)] group-hover:shadow-[0_6px_20px_rgba(79,70,229,0.35)] transition-shadow">
              <Club size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bricolage text-xl font-extrabold tracking-[-0.04em] text-[#1a1a2e]">
              club
              <span className="bg-linear-to-r from-indigo-500 to-orange-500 bg-clip-text text-transparent">
                Nest
              </span>
            </span>
          </NavLink>

          {/* ── DESKTOP LINKS ───────────────────── */}
          <ul className="hidden lg:flex items-center gap-1 list-none m-0 p-0">
            <li>
              <NavLink to="/" className={linkCls} end>
                <House size={16} /> Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/clubs" className={linkCls}>
                <Club size={16} /> Clubs
              </NavLink>
            </li>
            <li>
              <NavLink to="/events" className={linkCls}>
                <Calendar1 size={16} /> Events
              </NavLink>
            </li>
          </ul>

          {/* ── RIGHT SECTION ───────────────────── */}
          <div className="flex items-center gap-3">
            {user ? (
              /* avatar + dropdown */
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setAvatarOpen(!avatarOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-2xl border border-gray-100 bg-white hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer"
                >
                  <img
                    src={
                      user.photoURL ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "U")}&background=ede9fe&color=4f46e5`
                    }
                    alt="avatar"
                    className="w-8 h-8 rounded-xl object-cover"
                  />
                  <span className="hidden sm:block text-sm font-semibold text-gray-700 max-w-[100px] truncate">
                    {user.displayName?.split(" ")[0] || "Account"}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform duration-200 ${avatarOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* dropdown menu */}
                {avatarOpen && (
                  <div className="nb-slidein absolute right-0 top-[calc(100%+10px)] w-52 bg-white rounded-2xl border border-gray-100 shadow-[0_16px_48px_rgba(0,0,0,0.1)] overflow-hidden p-1.5">
                    {/* user info header */}
                    <div className="px-3 py-2.5 mb-1 border-b border-gray-50">
                      <p className="text-xs font-bold text-[#1a1a2e] truncate">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-[0.68rem] text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    <NavLink
                      to="/profile"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#1a1a2e] transition-colors no-underline"
                    >
                      <User size={15} className="text-gray-400" /> Profile
                    </NavLink>
                    <NavLink
                      to="/dashboard/admin"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors no-underline"
                    >
                      <LayoutDashboard size={15} className="text-gray-400" />{" "}
                      Dashboard
                    </NavLink>

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors cursor-pointer border-none bg-transparent"
                      >
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* auth buttons */
              <div className="flex items-center gap-2">
                <NavLink
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 border-[1.5px] border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-all no-underline"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="hidden sm:flex px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#1a1a2e] hover:bg-indigo-600 transition-colors no-underline items-center gap-1.5 shadow-[0_4px_14px_rgba(26,26,46,0.2)]"
                >
                  Get Started
                </NavLink>
              </div>
            )}

            {/* ── MOBILE HAMBURGER ───────────────── */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex flex-col justify-center items-center w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 gap-[5px] cursor-pointer hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <span
                className={`block w-4 h-[1.5px] bg-gray-700 rounded-full transition-all duration-200 ${mobileOpen ? "rotate-45 translate-y-[6.5px]" : ""}`}
              />
              <span
                className={`block w-4 h-[1.5px] bg-gray-700 rounded-full transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block w-4 h-[1.5px] bg-gray-700 rounded-full transition-all duration-200 ${mobileOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU ───────────────────────── */}
        {mobileOpen && (
          <div className="nb-fadein lg:hidden border-t border-gray-100 bg-white px-5 py-4">
            <ul className="flex flex-col gap-1 list-none m-0 p-0">
              <li>
                <NavLink to="/" className={mobileLinkCls} end>
                  <House size={16} /> Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/clubs" className={mobileLinkCls}>
                  <Club size={16} /> Clubs
                </NavLink>
              </li>
              <li>
                <NavLink to="/events" className={mobileLinkCls}>
                  <Calendar1 size={16} /> Events
                </NavLink>
              </li>
            </ul>

            {/* mobile auth */}
            {!user && (
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <NavLink
                  to="/login"
                  className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold text-gray-600 border-[1.5px] border-gray-200 no-underline hover:border-indigo-300 transition-colors"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold text-white bg-[#1a1a2e] no-underline hover:bg-indigo-600 transition-colors"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
};
