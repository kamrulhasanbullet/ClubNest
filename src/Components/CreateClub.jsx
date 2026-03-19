import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { use } from "react";
import { AuthContext } from "../context/AuthContext/AuthContext";
import Swal from "sweetalert2";
import {
  Building2,
  MapPin,
  Tag,
  DollarSign,
  Image,
  FileText,
  Plus,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

const CATEGORIES = [
  "Photography",
  "Sports",
  "Music",
  "Technology",
  "Art",
  "Literature",
  "Science",
  "Business",
  "Gaming",
  "Other",
];

export const CreateClub = () => {
  const { user } = use(AuthContext);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const createClubMutation = useMutation({
    mutationFn: async (data) => {
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/clubs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          managerEmail: user.email,
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      });
      return res.json();
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Club Created!",
        text: "Your club has been submitted for approval.",
        timer: 2500,
        showConfirmButton: false,
        background: "#0b0f1e",
        color: "#e8eeff",
      });
      queryClient.invalidateQueries(["myClubs"]);
      reset();
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not create the club. Try again.",
        background: "#0b0f1e",
        color: "#e8eeff",
        confirmButtonColor: "#4f7fff",
      });
    },
  });

  const onSubmit = (data) => createClubMutation.mutate(data);

  const inputClass = (hasError) =>
    `w-full bg-white/[0.04] border rounded-xl px-4 py-3 text-[#e8eeff] text-sm outline-none transition-all duration-200 placeholder:text-white/20 focus:bg-blue-500/[0.06] focus:shadow-[0_0_0_3px_rgba(79,127,255,0.10)] ${
      hasError
        ? "border-red-400/50"
        : "border-white/10 focus:border-blue-500/50"
    }`;

  return (
    <div className="min-h-screen bg-[#060810] text-white px-4 sm:px-8 py-8 relative overflow-hidden">
      <Helmet>
        <title>Create Club - ClubNest</title>
      </Helmet>

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
        <div className="mb-8 pt-2">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-violet-400 mb-2">
            Club Manager
          </p>
          <h1 className="text-[34px] sm:text-[42px] font-light font-serif leading-tight text-[#f0f4ff]">
            Create a <em className="italic text-[#c4b5fd]">New Club</em>
          </h1>
          <p className="text-sm text-white/30 mt-1">
            Fill in the details — your club will be reviewed before going live
          </p>
        </div>

        {/* ── Form card ── */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 sm:p-8">
          {/* Top accent */}
          <div className="absolute top-0 left-10 w-14 h-[3px] rounded-b bg-linear-to-r from-violet-500 to-blue-500" />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Club Name */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-2">
                <Building2 size={12} />
                Club Name
              </label>
              <input
                {...register("clubName", { required: "Club name is required" })}
                placeholder="e.g. Photography Club"
                className={inputClass(errors.clubName)}
              />
              {errors.clubName && (
                <p className="text-[11px] text-red-400 mt-1.5 pl-1">
                  {errors.clubName.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-2">
                <FileText size={12} />
                Description
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                placeholder="Tell people what your club is about…"
                rows={4}
                className={`${inputClass(errors.description)} resize-none`}
              />
              {errors.description && (
                <p className="text-[11px] text-red-400 mt-1.5 pl-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Location + Category (2 col) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-2">
                  <MapPin size={12} />
                  Location
                </label>
                <input
                  {...register("location", {
                    required: "Location is required",
                  })}
                  placeholder="e.g. Dhaka, Bangladesh"
                  className={inputClass(errors.location)}
                />
                {errors.location && (
                  <p className="text-[11px] text-red-400 mt-1.5 pl-1">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-2">
                  <Tag size={12} />
                  Category
                </label>
                <select
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className={`cursor-pointer ${inputClass(errors.category)}`}
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
                {errors.category && (
                  <p className="text-[11px] text-red-400 mt-1.5 pl-1">
                    {errors.category.message}
                  </p>
                )}
              </div>
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
                  {...register("membershipFee", { required: true, min: 0 })}
                  placeholder="0"
                  className={`${inputClass(errors.membershipFee)} pl-8`}
                />
              </div>
              <p className="text-[10.5px] text-white/20 mt-1.5 pl-1">
                Enter 0 for a free club
              </p>
              {errors.membershipFee && (
                <p className="text-[11px] text-red-400 mt-1 pl-1">
                  Membership fee is required
                </p>
              )}
            </div>

            {/* Banner Image URL */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-2">
                <Image size={12} />
                Banner Image URL
              </label>
              <input
                {...register("bannerImage", {
                  required: "Banner image URL is required",
                })}
                placeholder="https://example.com/banner.jpg"
                className={inputClass(errors.bannerImage)}
              />
              {errors.bannerImage && (
                <p className="text-[11px] text-red-400 mt-1.5 pl-1">
                  {errors.bannerImage.message}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

            {/* Submit */}
            <button
              type="submit"
              disabled={createClubMutation.isPending}
              className="cursor-pointer w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-linear-to-r from-violet-500 to-blue-500 text-white text-sm font-semibold tracking-wide shadow-[0_4px_20px_rgba(139,92,246,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_28px_rgba(139,92,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 transition-all duration-200"
            >
              {createClubMutation.isPending ? (
                <span className="text-sm">Creating…</span>
              ) : (
                <>
                  <Plus size={16} />
                  Create Club
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-white/20">
              Your club will be reviewed by an admin before going live
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
