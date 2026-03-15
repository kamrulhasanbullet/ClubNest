import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { use } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext/AuthContext";
import {
  Building2,
  FileText,
  Tag,
  MapPin,
  Image,
  DollarSign,
  Pencil,
  ArrowLeft,
} from "lucide-react";

const CATEGORIES = [
  "Technology",
  "Sports",
  "Arts",
  "Music",
  "Business",
  "Science",
  "Health",
  "Social",
  "Academic",
  "Other",
];

const statusStyle = (status) => {
  if (status === "approved")
    return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
  if (status === "pending")
    return "text-amber-400 bg-amber-400/10 border-amber-400/20";
  return "text-red-400 bg-red-400/10 border-red-400/20";
};

export const EditClub = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = use(AuthContext);

  const [formData, setFormData] = useState({
    clubName: "",
    description: "",
    category: "",
    location: "",
    bannerImage: "",
    membershipFee: 0,
  });

  const { data: club, isLoading } = useQuery({
    queryKey: ["club", id],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/clubs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    enabled: !!id && !!user,
  });

  useEffect(() => {
    if (club) {
      setFormData({
        clubName: club.clubName || "",
        description: club.description || "",
        category: club.category || "",
        location: club.location || "",
        bannerImage: club.bannerImage || "",
        membershipFee: club.membershipFee || 0,
      });
    }
  }, [club]);

  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/clubs/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Update failed");
      }
      return res.json();
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Club updated successfully.",
        timer: 2000,
        showConfirmButton: false,
        background: "#0b0f1e",
        color: "#e8eeff",
      });
      navigate("/dashboard/manager/my-clubs");
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        background: "#0b0f1e",
        color: "#e8eeff",
        confirmButtonColor: "#4f7fff",
      });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "membershipFee" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.clubName.trim() || !formData.description.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Required fields missing",
        text: "Club name and description are required.",
        background: "#0b0f1e",
        color: "#e8eeff",
        confirmButtonColor: "#4f7fff",
      });
      return;
    }
    updateMutation.mutate(formData);
  };

  const inputClass =
    "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-[#e8eeff] text-sm outline-none transition-all duration-200 placeholder:text-white/20 focus:bg-blue-500/[0.06] focus:border-blue-500/50 focus:shadow-[0_0_0_3px_rgba(79,127,255,0.10)]";

  /* ── Skeleton ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#060810] px-4 sm:px-8 py-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-linear-to-bl from-blue-600 to-violet-700 opacity-6 blur-[110px] pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
          <div className="space-y-3">
            <div className="h-2 w-24 rounded-full bg-white/6 animate-pulse" />
            <div className="h-9 w-44 rounded-2xl bg-white/6 animate-pulse" />
          </div>
          <div className="bg-white/3 border border-white/6 rounded-2xl p-8 space-y-5">
            {[1, 0.75, 0.55, 0.4, 0.3].map((op, i) => (
              <div
                key={i}
                className="space-y-2 animate-pulse"
                style={{ opacity: op }}
              >
                <div className="h-2 w-20 rounded-full bg-white/6" />
                <div className="h-11 rounded-xl bg-white/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060810] text-white px-4 sm:px-8 pt-8 pb-28 relative overflow-hidden">
      {/* ── Aurora bg ── */}
      <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-linear-to-bl from-blue-600 to-violet-700 opacity-6 blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-linear-to-tr from-violet-500 to-blue-600 opacity-5 blur-[100px] pointer-events-none" />

      {/* ── Grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* ── Header ── */}
        <div className="mb-8 pt-4">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-violet-400 mb-2">
            Club Manager
          </p>
          <h1 className="text-[34px] sm:text-[42px] font-light font-serif leading-tight text-[#f0f4ff]">
            Edit <em className="italic text-[#c4b5fd]">Club</em>
          </h1>
          <p className="text-sm text-white/30 mt-1">
            Update your club information
          </p>
        </div>

        {/* ── Form card ── */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Club Name */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-2">
                <Building2 size={12} />
                Club Name
              </label>
              <input
                type="text"
                name="clubName"
                value={formData.clubName}
                onChange={handleChange}
                placeholder="Enter club name"
                required
                className={inputClass}
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-2">
                <FileText size={12} />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your club…"
                required
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Category + Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-2">
                  <Tag size={12} />
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className={`cursor-pointer ${inputClass}`}
                >
                  <option value="" className="bg-[#0b0f1e]">
                    Select category…
                  </option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#0b0f1e]">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-2">
                  <MapPin size={12} />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Banner Image */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-2">
                <Image size={12} />
                Banner Image URL
              </label>
              <input
                type="url"
                name="bannerImage"
                value={formData.bannerImage}
                onChange={handleChange}
                placeholder="https://example.com/banner.jpg"
                className={inputClass}
              />
              {formData.bannerImage && (
                <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={formData.bannerImage}
                    alt="Banner preview"
                    className="h-40 w-full object-cover"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}
            </div>

            {/* Membership Fee */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-2">
                <DollarSign size={12} />
                Membership Fee
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-sm">
                  $
                </span>
                <input
                  type="number"
                  name="membershipFee"
                  value={formData.membershipFee}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className={`${inputClass} pl-8`}
                />
              </div>
              <p className="text-[10.5px] text-white/20 mt-1.5 pl-1">
                Set to 0 for free membership
              </p>
            </div>

            {/* Status (read only) */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-2">
                Status
              </label>
              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${statusStyle(club?.status)}`}
                >
                  {club?.status?.toUpperCase()}
                </span>
                <p className="text-[11px] text-white/25">
                  Contact admin to change status
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/dashboard/manager/my-clubs")}
                className="cursor-pointer flex items-center gap-2 px-5 py-3 rounded-xl bg-white/4 border border-white/10 text-white/50 text-sm font-semibold hover:bg-white/8 hover:text-white/70 transition-all duration-200"
              >
                <ArrowLeft size={15} />
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="cursor-pointer flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-linear-to-r from-violet-500 to-blue-500 text-white text-sm font-semibold tracking-wide shadow-[0_4px_20px_rgba(139,92,246,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_28px_rgba(139,92,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 transition-all duration-200"
              >
                {updateMutation.isPending ? (
                  <span>Updating…</span>
                ) : (
                  <>
                    <Pencil size={15} />
                    Update Club
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
