import React from "react";
import { NavLink } from "react-router";

export const Footer = () => {
  return (
    <footer className="relative bg-[#060810] border-t border-white/6 overflow-hidden">
      {/* ── Aurora blob ── */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full bg-linear-to-r from-blue-600 to-violet-600 opacity-10 blur-[80px] pointer-events-none" />

      {/* ── Grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* ── Top row ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          {/* Brand */}
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-blue-400 mb-1">
              Platform
            </p>
            <span className="text-2xl font-light font-serif text-[#f0f4ff]">
              Club<em className="italic text-[#93b4ff]">Nest</em>
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {[
              { to: "/", label: "Home" },
              { to: "/clubs", label: "Clubs" },
              { to: "/events", label: "Events" },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? "text-white bg-white/8"
                      : "text-white/40 hover:text-white/80 hover:bg-white/5"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Social icons */}
          <div className="flex items-center gap-2">
            {/* Twitter / X */}
            <a
              href="#"
              aria-label="Twitter"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 bg-white/4 text-white/40 hover:text-white/80 hover:bg-white/8 hover:border-white/20 transition-all duration-200"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="#"
              aria-label="YouTube"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 bg-white/4 text-white/40 hover:text-white/80 hover:bg-white/8 hover:border-white/20 transition-all duration-200"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="#"
              aria-label="Facebook"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 bg-white/4 text-white/40 hover:text-white/80 hover:bg-white/8 hover:border-white/20 transition-all duration-200"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-6" />

        {/* ── Bottom row ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-white/25">
            © {new Date().getFullYear()} ClubNest. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[11px] text-white/20 tracking-wide">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
