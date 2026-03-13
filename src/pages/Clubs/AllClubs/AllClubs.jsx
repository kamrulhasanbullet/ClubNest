import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import {
  MapPin,
  Tag,
  ArrowRight,
  Sparkles,
  LayoutGrid,
  Search,
  Filter,
  X,
  ChevronDown,
  DollarSign,
  Clock,
  Loader,
} from "lucide-react";

/* ── Font injection ─────────────────────────────── */
const useFont = () => {
  useEffect(() => {
    if (document.getElementById("allclubs-font")) return;
    const l = document.createElement("link");
    l.id = "allclubs-font";
    l.href =
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Outfit:wght@300;400;500;600&display=swap";
    l.rel = "stylesheet";
    document.head.appendChild(l);
  }, []);
};

/* ── Keyframe animations (Tailwind can't do these) ─ */
const ANIM = `
  @keyframes acFadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes acSlideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes acPulse { 0%,100%{opacity:1} 50%{opacity:.45} }
  .font-bricolage { font-family:'Bricolage Grotesque',sans-serif; }
  .font-outfit    { font-family:'Outfit',sans-serif; }
  .ac-fadein  { animation: acFadeUp 0.4s cubic-bezier(.22,1,.36,1) both; }
  .ac-panel   { animation: acSlideDown 0.22s cubic-bezier(.22,1,.36,1) forwards; }
  .ac-skel    { animation: acPulse 1.6s ease-in-out infinite; }
  /* card hover */
  .club-card { transition: transform .32s cubic-bezier(.22,1,.36,1), box-shadow .32s cubic-bezier(.22,1,.36,1), border-color .2s; }
  .club-card:hover { transform:translateY(-6px); box-shadow:0 28px 70px rgba(79,70,229,0.13); border-color:rgba(79,70,229,0.22)!important; }
  .club-card:hover .card-img  { transform:scale(1.08); }
  .club-card:hover .card-overlay { opacity:1!important; }
  .club-card:hover .view-btn  { background:#4f46e5!important; }
  .card-img     { transition:transform .5s cubic-bezier(.22,1,.36,1); }
  .card-overlay { transition:opacity .3s; }
  .view-btn     { transition:background .22s; }
  /* inputs */
  .ac-input:focus { outline:none; box-shadow:0 0 0 3px rgba(79,70,229,0.12); border-color:#4f46e5!important; }
  .ac-select:focus{ outline:none; box-shadow:0 0 0 3px rgba(79,70,229,0.12); border-color:#4f46e5!important; }
  /* chip hover */
  .cat-chip:hover { background:#4f46e5!important; color:#fff!important; border-color:#4f46e5!important; }
  /* fee buttons */
  .fee-btn { transition:all .18s; }
`;

export const AllClubs = () => {
  useFont();
  const { user } = use(AuthContext);

  /* ── State (logic untouched) ──────────────────── */
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [membershipFeeFilter, setMembershipFeeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(id);
  }, [searchTerm]);

  const { data: allClubsRaw = [] } = useQuery({
    queryKey: ["allClubsRaw"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/clubs`);
      if (!res.ok) throw new Error("Failed to fetch clubs");
      return res.json();
    },
  });

  const uniqueCategories = [
    ...new Set(allClubsRaw.map((c) => c.category).filter(Boolean)),
  ];

  const {
    data: clubs = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "clubs",
      debouncedSearch,
      selectedCategory,
      selectedSort,
      membershipFeeFilter,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (selectedCategory && selectedCategory !== "all")
        params.append("category", selectedCategory);
      if (membershipFeeFilter !== "all")
        params.append("membershipFee", membershipFeeFilter);
      let sortBy = selectedSort,
        order = "desc";
      switch (selectedSort) {
        case "newest":
          sortBy = "newest";
          order = "desc";
          break;
        case "oldest":
          sortBy = "oldest";
          order = "asc";
          break;
        case "nameAsc":
          sortBy = "nameAsc";
          order = "asc";
          break;
        case "nameDesc":
          sortBy = "nameDesc";
          order = "desc";
          break;
        case "feeLowest":
          sortBy = "feeLowest";
          order = "asc";
          break;
        case "feeHighest":
          sortBy = "feeHighest";
          order = "desc";
          break;
        default:
          sortBy = "newest";
          order = "desc";
      }
      params.append("sortBy", sortBy);
      params.append("order", order);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/clubs?${params.toString()}`,
      );
      if (!res.ok) throw new Error(`Failed to fetch clubs: ${res.status}`);
      return res.json();
    },
    staleTime: 30000,
    gcTime: 60000,
  });

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleClearFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setSelectedCategory("");
    setSelectedSort("newest");
    setMembershipFeeFilter("all");
  };
  const activeFiltersCount = [
    debouncedSearch,
    selectedCategory && selectedCategory !== "all",
    selectedSort !== "newest",
    membershipFeeFilter !== "all",
  ].filter(Boolean).length;

  const sortLabels = {
    newest: "Newest First",
    oldest: "Oldest First",
    nameAsc: "Name A–Z",
    nameDesc: "Name Z–A",
    feeLowest: "Lowest Fee",
    feeHighest: "Highest Fee",
  };

  /* ── Loading skeleton ─────────────────────────── */
  if (isLoading)
    return (
      <div className="font-outfit min-h-screen bg-[#fafaf8] p-10">
        <style>{ANIM}</style>
        <div className="ac-skel w-64 h-12 rounded-xl bg-gray-200 mb-3" />
        <div className="ac-skel w-44 h-5  rounded-lg bg-gray-200 mb-10" />
        <div className="ac-skel h-16 rounded-2xl bg-gray-200 mb-9" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="ac-skel h-96 rounded-2xl bg-gray-200" />
          ))}
        </div>
      </div>
    );

  /* ── Error state ──────────────────────────────── */
  if (error)
    return (
      <div className="font-outfit min-h-screen bg-[#fafaf8] flex items-center justify-center">
        <style>{ANIM}</style>
        <div className="text-center p-10 bg-white rounded-3xl border border-red-100 max-w-sm shadow-sm">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="font-bricolage text-lg font-bold text-red-600 mb-2">
            Failed to load clubs
          </p>
          <p className="text-sm text-gray-400 mb-6">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="px-7 py-3 bg-[#1a1a2e] text-white font-bold text-sm rounded-xl hover:bg-indigo-600 transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  /* ── MAIN RENDER ──────────────────────────────── */
  return (
    <div className="font-outfit min-h-screen bg-[#fafaf8] px-6 md:px-10 py-12">
      <style>{ANIM}</style>

      {/* ══ PAGE HEADER ════════════════════════════ */}
      <div className="flex items-end justify-between flex-wrap gap-3 mb-10">
        <div>
          <p className="text-[0.67rem] font-bold tracking-[0.18em] text-orange-500 uppercase mb-2">
            Explore
          </p>
          <h1 className="font-bricolage text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-none tracking-[-0.05em] text-[#1a1a2e] m-0">
            All{" "}
            <span className="bg-linear-to-br from-indigo-500 to-orange-500 bg-clip-text text-transparent">
              Clubs
            </span>
          </h1>
          <p className="text-gray-400 mt-2.5 text-sm">
            Explore and join the best communities.{" "}
            <span className="text-indigo-600 font-semibold">
              {clubs.length} clubs found
            </span>
          </p>
        </div>

        {/* active filter badge */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-2xl px-4 py-2.5 shadow-sm">
            <span className="text-sm text-gray-500">
              {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""}{" "}
              active
            </span>
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 bg-red-50 text-red-600 text-[0.72rem] font-bold px-2 py-0.5 rounded-lg border-none cursor-pointer hover:bg-red-100 transition-colors"
            >
              <X size={11} /> Clear
            </button>
          </div>
        )}
      </div>

      {/* ══ SEARCH + FILTER BAR ════════════════════ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-5 mb-8">
        {/* main row */}
        <div className="flex flex-wrap gap-3">
          {/* Search input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search clubs by name…"
              value={searchTerm}
              onChange={handleSearch}
              className="ac-input w-full pl-11 pr-10 py-3 bg-[#fafaf8] border-[1.5px] border-gray-200 rounded-[14px] text-sm text-[#1a1a2e] font-outfit transition-all"
            />
            {searchTerm !== debouncedSearch && (
              <Loader
                size={14}
                className="absolute right-10 top-1/2 -translate-y-1/2 text-indigo-500 animate-spin"
              />
            )}
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setDebouncedSearch("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center text-gray-500 cursor-pointer border-none hover:bg-gray-200 transition-colors"
              >
                <X size={11} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative shrink-0">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="ac-select appearance-none pl-4 pr-10 py-3 bg-[#fafaf8] border-[1.5px] border-gray-200 rounded-[14px] text-sm text-gray-700 font-outfit cursor-pointer min-w-40 transition-all"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="nameAsc">Name (A–Z)</option>
              <option value="nameDesc">Name (Z–A)</option>
              <option value="feeLowest">Lowest Fee</option>
              <option value="feeHighest">Highest Fee</option>
            </select>
            <ChevronDown
              size={15}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-[14px] text-sm font-semibold border-[1.5px] cursor-pointer transition-all shrink-0 font-outfit
              ${showFilters ? "bg-[#1a1a2e] text-white border-[#1a1a2e]" : "bg-[#fafaf8] text-gray-700 border-gray-200 hover:bg-gray-50"}`}
          >
            <Filter size={15} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-indigo-600 text-white rounded-full w-5 h-5 text-[0.65rem] font-extrabold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* expanded panel */}
        {showFilters && (
          <div className="ac-panel mt-5 pt-5 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category */}
              <div>
                <label className="block text-[0.72rem] font-bold tracking-widest uppercase text-gray-400 mb-2.5">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="ac-select appearance-none w-full pl-3.5 pr-9 py-2.5 bg-[#fafaf8] border-[1.5px] border-gray-200 rounded-xl text-sm text-gray-700 font-outfit cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {uniqueCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Fee filter */}
              <div>
                <label className="block text-[0.72rem] font-bold tracking-widest uppercase text-gray-400 mb-2.5">
                  Membership Fee
                </label>
                <div className="flex gap-2">
                  {["all", "free", "paid"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setMembershipFeeFilter(opt)}
                      className={`fee-btn px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer border-[1.5px] font-outfit transition-all
                        ${
                          membershipFeeFilter === opt
                            ? "bg-[#1a1a2e] text-white border-[#1a1a2e]"
                            : "bg-[#fafaf8] text-gray-500 border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      {opt === "free"
                        ? "🎁 Free"
                        : opt === "paid"
                          ? "💳 Paid"
                          : "All"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active chips */}
              <div>
                <label className="block text-[0.72rem] font-bold tracking-wiedest uppercase text-gray-400 mb-2.5">
                  Active Filters
                </label>
                <div className="flex flex-wrap gap-2">
                  {debouncedSearch && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg text-[0.76rem] font-semibold">
                      "{debouncedSearch}"
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setDebouncedSearch("");
                        }}
                        className="bg-transparent border-none cursor-pointer text-indigo-500 flex p-0 hover:text-indigo-700"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {selectedCategory && selectedCategory !== "all" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg text-[0.76rem] font-semibold">
                      {selectedCategory}
                      <button
                        onClick={() => setSelectedCategory("")}
                        className="bg-transparent border-none cursor-pointer text-green-600 flex p-0 hover:text-green-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {membershipFeeFilter !== "all" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-[0.76rem] font-semibold">
                      {membershipFeeFilter === "free"
                        ? "Free Only"
                        : "Paid Only"}
                      <button
                        onClick={() => setMembershipFeeFilter("all")}
                        className="bg-transparent border-none cursor-pointer text-purple-600 flex p-0 hover:text-purple-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {selectedSort !== "newest" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[0.76rem] font-semibold">
                      {sortLabels[selectedSort]}
                      <button
                        onClick={() => setSelectedSort("newest")}
                        className="bg-transparent border-none cursor-pointer text-amber-600 flex p-0 hover:text-amber-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {activeFiltersCount === 0 && (
                    <span className="text-[0.78rem] text-gray-300 italic">
                      No filters applied
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══ EMPTY STATE ════════════════════════════ */}
      {clubs.length === 0 ? (
        <div className="min-h-[420px] flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 text-center p-12">
          <div className="w-18 h-18 rounded-[22px] bg-linear-to-br from-violet-100 to-pink-100 flex items-center justify-center mb-5 p-4">
            <Sparkles size={28} className="text-purple-500" />
          </div>
          <h3 className="font-bricolage text-xl font-bold text-[#1a1a2e] mb-2">
            No clubs found
          </h3>
          <p className="text-sm text-gray-400 max-w-xs leading-relaxed mb-6">
            Try adjusting your filters or search term to find the right
            community.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-7 py-3 bg-[#1a1a2e] text-white font-bold text-sm rounded-xl hover:bg-indigo-600 transition-colors cursor-pointer font-outfit"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        /* ══ CLUBS GRID ════════════════════════════ */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {clubs.map((club, idx) => (
            <div
              key={club._id}
              className="club-card ac-fadein bg-white rounded-[22px] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col"
              style={{ animationDelay: `${idx * 0.04}s` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden shrink-0">
                {club.bannerImage ? (
                  <img
                    src={club.bannerImage}
                    alt={club.clubName}
                    className="card-img w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-violet-100 to-pink-100 flex items-center justify-center">
                    <LayoutGrid size={36} className="text-violet-300" />
                  </div>
                )}

                {/* hover overlay */}
                <div className="card-overlay opacity-0 absolute inset-0 bg-linear-to-t from-indigo-600/35 to-transparent" />

                {/* Fee badge */}
                <div className="absolute top-3.5 right-3.5">
                  <span
                    className={`px-3 py-1 rounded-full text-[0.62rem] font-extrabold tracking-[0.08em] uppercase backdrop-blur-md border
                    ${
                      club.membershipFee > 0
                        ? "bg-amber-50/90 text-amber-700 border-amber-200"
                        : "bg-emerald-50/90 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    {club.membershipFee > 0 ? `$${club.membershipFee}` : "Free"}
                  </span>
                </div>

                {/* Date badge */}
                <div className="absolute bottom-3.5 left-3.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/85 backdrop-blur-sm rounded-full text-[0.67rem] text-gray-500 font-medium">
                    <Clock size={10} />
                    {new Date(club.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                {/* Title */}
                <h3 className="font-bricolage text-[1.1rem] font-bold text-[#1a1a2e] mb-2 tracking-[-0.02em] truncate">
                  {club.clubName}
                </h3>

                {/* Description */}
                <p className="text-[0.82rem] text-gray-400 leading-relaxed mb-4 line-clamp-2 flex-1">
                  {club.description}
                </p>

                {/* Meta chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {/* Category */}
                  <span className="cat-chip inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-500 rounded-lg text-[0.72rem] font-semibold border border-transparent cursor-default transition-all">
                    <Tag size={11} /> {club.category}
                  </span>

                  {/* Location */}
                  {club.location && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-[0.72rem] font-semibold border border-red-100">
                      <MapPin size={11} /> {club.location}
                    </span>
                  )}

                  {/* Fee */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[0.72rem] font-semibold border
                    ${
                      club.membershipFee > 0
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    <DollarSign size={11} />
                    {club.membershipFee > 0
                      ? `$${club.membershipFee} / month`
                      : "Free membership"}
                  </span>
                </div>

                {/* CTA */}
                <Link
                  to={`/clubs/${club._id}`}
                  className="view-btn font-bricolage flex items-center justify-center gap-2 py-3.5 bg-[#1a1a2e] text-white rounded-2xl font-bold text-sm no-underline tracking-[0.01em] hover:bg-indigo-600"
                >
                  View Club Details
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
