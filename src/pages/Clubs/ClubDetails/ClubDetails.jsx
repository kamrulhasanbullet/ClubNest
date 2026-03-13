import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ClubCheckoutForm } from "../../../components/ClubCheckoutForm";
import { toast } from "react-hot-toast";
import {
  ChartBarStacked,
  MapPin,
  Users,
  Mail,
  User,
  Loader2,
  CheckCircle,
  DollarSign,
  AlertCircle,
  Clock,
} from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

/* ── Font injection ─────────────────────────── */
const useFont = () => {
  useEffect(() => {
    if (document.getElementById("cd-font")) return;
    const l = document.createElement("link");
    l.id = "cd-font";
    l.href =
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Outfit:wght@300;400;500;600&display=swap";
    l.rel = "stylesheet";
    document.head.appendChild(l);
  }, []);
};

const STYLES = `
  .font-bricolage { font-family:'Bricolage Grotesque',sans-serif; }
  .font-outfit    { font-family:'Outfit',sans-serif; }
  @keyframes cdFadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  .cd-fadein { animation: cdFadeUp 0.45s cubic-bezier(.22,1,.36,1) forwards; }
  .cd-fadein-2 { animation: cdFadeUp 0.45s cubic-bezier(.22,1,.36,1) 0.08s forwards; opacity:0; }
  .cd-fadein-3 { animation: cdFadeUp 0.45s cubic-bezier(.22,1,.36,1) 0.16s forwards; opacity:0; }
  .cd-fadein-4 { animation: cdFadeUp 0.45s cubic-bezier(.22,1,.36,1) 0.24s forwards; opacity:0; }
  .join-btn:hover { background:#4f46e5 !important; transform:translateY(-2px); }
  .join-btn-free:hover { background:#16a34a !important; transform:translateY(-2px); }
`;

/* ── Gradient text helper ───────────────────── */
const GText = ({ children }) => (
  <span
    style={{
      background: "linear-gradient(135deg,#4f46e5,#f97316)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    }}
  >
    {children}
  </span>
);

/* ════════════════════════════════════════════ */
export const ClubDetails = () => {
  useFont();
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [membershipId, setMembershipId] = useState(null);
  const [membershipStatus, setMembershipStatus] = useState(null);

  /* ── Fetch club ─────────────────────────── */
  const {
    data: club = {},
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["clubDetails", id],
    queryFn: async () => {
      const token = user ? await user.getIdToken() : null;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/clubs/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch club");
      return res.json();
    },
  });

  /* ── Check membership ───────────────────── */
  useEffect(() => {
    const checkMembership = async () => {
      if (user && club?._id) {
        try {
          const token = await user.getIdToken();
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/check-membership?clubId=${club._id}`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          if (res.ok) {
            const data = await res.json();
            setMembershipStatus(data.status);
            if (data.membershipId) setMembershipId(data.membershipId);
          }
        } catch (err) {
          console.error("Check membership error:", err);
        }
      }
    };
    if (club?._id) checkMembership();
  }, [club?._id, user]);

  /* ── Join mutation ──────────────────────── */
  const joinClubMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Please login first");
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/memberships`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userEmail: user.email, clubId: club._id }),
      });
      const data = await res.json();
      if (data.message?.includes("already a member"))
        return { ...data, isAlreadyMember: true };
      if (!res.ok) throw new Error(data.message || "Failed to join club");
      return data;
    },
    onSuccess: (data) => {
      if (data.isAlreadyMember) {
        toast.error("You are already a member of this club!");
        return;
      }
      if (data.existing && data.status === "pendingPayment") {
        setMembershipId(data.membershipId);
        setMembershipStatus("pendingPayment");
        toast.success("Continue with your pending payment");
      } else if (data.status === "active") {
        setMembershipStatus("active");
        setMembershipId(data.membershipId);
        toast.success("Successfully joined the club!");
        refetch();
      } else if (data.status === "pendingPayment") {
        setMembershipId(data.membershipId);
        setMembershipStatus("pendingPayment");
        toast.success("Membership created! Please complete payment.");
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handlePaymentSuccess = () => {
    setMembershipStatus("active");
    toast.success("Payment successful! You are now a member.");
    refetch();
    queryClient.invalidateQueries(["clubDetails", id]);
  };

  /* ── Loading ────────────────────────────── */
  if (isLoading)
    return (
      <div className="font-outfit min-h-screen bg-[#fafaf8] flex items-center justify-center">
        <style>{STYLES}</style>
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-orange-500 flex items-center justify-center shadow-lg">
            <Loader2 className="w-7 h-7 text-white animate-spin" />
          </div>
          <p className="text-gray-400 text-sm font-medium">
            Loading club details…
          </p>
        </div>
      </div>
    );

  /* ── Error ──────────────────────────────── */
  if (error || !club._id)
    return (
      <div className="font-outfit min-h-screen bg-[#fafaf8] flex items-center justify-center px-6">
        <style>{STYLES}</style>
        <div className="text-center bg-white rounded-3xl border border-red-100 p-10 max-w-sm shadow-sm">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="font-bricolage text-lg font-bold text-red-600 mb-2">
            Failed to load club
          </p>
          <p className="text-sm text-gray-400">
            {error?.message || "Club not found"}
          </p>
        </div>
      </div>
    );

  const isPaid = club.membershipFee > 0;
  const isActive = membershipStatus === "active";
  const isPending = membershipStatus === "pendingPayment";

  return (
    <div className="font-outfit min-h-screen bg-[#fafaf8]">
      <style>{STYLES}</style>

      {/* ── HERO BANNER ─────────────────────── */}
      <div className="relative max-w-4xl mx-auto h-80 md:h-[420px] overflow-hidden cd-fadein rounded-xl">
        {club.bannerImage ? (
          <img
            src={club.bannerImage}
            alt={club.clubName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-indigo-100 via-violet-50 to-orange-50 flex items-center justify-center">
            <span className="text-8xl opacity-20">🏛️</span>
          </div>
        )}
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-[#0f0f1a]/80 via-[#0f0f1a]/20 to-transparent" />

        {/* badge + title over image */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-8">
          <div className="max-w-4xl mx-auto">
            <span
              className={`inline-block px-3 py-1 rounded-full text-[0.63rem] font-bold uppercase tracking-widest mb-3 border
              ${isPaid ? "bg-amber-50/90 text-amber-700 border-amber-200" : "bg-emerald-50/90 text-emerald-700 border-emerald-200"}`}
            >
              {isPaid ? `$${club.membershipFee} membership` : "Free to join"}
            </span>
            <h1
              className="font-bricolage font-extrabold text-white leading-tight"
              style={{
                fontSize: "clamp(1.8rem,5vw,3rem)",
                letterSpacing: "-0.04em",
              }}
            >
              {club.clubName}
            </h1>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 space-y-6">
        {/* ── QUICK STATS ROW ─────────────────── */}
        <div className="cd-fadein-2 grid grid-cols-3 gap-4">
          {[
            {
              icon: ChartBarStacked,
              label: "Category",
              value: club.category,
              bg: "bg-indigo-50",
              ic: "text-indigo-600",
            },
            {
              icon: MapPin,
              label: "Location",
              value: club.location,
              bg: "bg-emerald-50",
              ic: "text-emerald-600",
            },
            {
              icon: Users,
              label: "Members",
              value: club.membersCount || 0,
              bg: "bg-violet-50",
              ic: "text-violet-600",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_2px_16px_rgba(0,0,0,0.04)] flex items-center gap-3"
            >
              <div
                className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}
              >
                <s.icon size={18} className={s.ic} />
              </div>
              <div className="min-w-0">
                <p className="text-[0.68rem] text-gray-400 font-semibold uppercase tracking-[0.07em]">
                  {s.label}
                </p>
                <p className="font-bricolage font-bold text-[#1a1a2e] text-sm truncate">
                  {s.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── DESCRIPTION + MANAGER ─────────── */}
        <div className="cd-fadein-3 grid md:grid-cols-5 gap-6">
          {/* description — 3 cols */}
          <div className="md:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-6 space-y-5">
            <div>
              <p className="text-[0.67rem] font-bold tracking-[0.18em] text-orange-500 uppercase mb-2">
                About
              </p>
              <h2 className="font-bricolage font-bold text-[#1a1a2e] text-xl mb-3">
                Club Overview
              </h2>
              <p className="text-gray-500 text-sm leading-[1.8]">
                {club.description}
              </p>
            </div>

            {/* membership fee card */}
            <div
              className={`flex items-center gap-4 p-4 rounded-xl border ${isPaid ? "bg-amber-50 border-amber-100" : "bg-emerald-50 border-emerald-100"}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isPaid ? "bg-amber-100" : "bg-emerald-100"}`}
              >
                <DollarSign
                  size={18}
                  className={isPaid ? "text-amber-700" : "text-emerald-700"}
                />
              </div>
              <div>
                <p
                  className={`font-bold text-sm ${isPaid ? "text-amber-800" : "text-emerald-800"}`}
                >
                  {isPaid ? "Paid Membership" : "Free Membership"}
                </p>
                <p
                  className={`text-xs mt-0.5 ${isPaid ? "text-amber-600" : "text-emerald-600"}`}
                >
                  {isPaid
                    ? `$${club.membershipFee} one-time fee`
                    : "Join for free — no payment required"}
                </p>
              </div>
            </div>
          </div>

          {/* manager card — 2 cols */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-6 flex flex-col gap-5">
            <div>
              <p className="text-[0.67rem] font-bold tracking-[0.18em] text-orange-500 uppercase mb-2">
                Manager
              </p>
              <h2 className="font-bricolage font-bold text-[#1a1a2e] text-xl">
                Club Manager
              </h2>
            </div>

            {/* avatar */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 to-orange-500 flex items-center justify-center shadow-md shrink-0">
                <span className="text-white font-extrabold text-sm font-bricolage">
                  {(club.managerName || "M").charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-bricolage font-bold text-[#1a1a2e] text-sm">
                  {club.managerName || "Unknown"}
                </p>
                <p className="text-xs text-indigo-500 font-semibold">
                  Club Manager
                </p>
              </div>
            </div>

            {/* email */}
            <div className="flex items-center gap-3 p-3 bg-[#fafaf8] rounded-xl border border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                <Mail size={14} className="text-gray-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[0.68rem] text-gray-400 font-semibold uppercase tracking-[0.07em]">
                  Email
                </p>
                <p className="text-xs text-gray-700 font-medium truncate">
                  {club.managerEmail || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── MEMBERSHIP STATUS BANNER ─────────── */}
        {membershipStatus && (
          <div
            className={`cd-fadein-4 flex items-center gap-4 p-5 rounded-2xl border
            ${isActive ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
              ${isActive ? "bg-emerald-100" : "bg-amber-100"}`}
            >
              {isActive ? (
                <CheckCircle size={20} className="text-emerald-600" />
              ) : (
                <Clock size={20} className="text-amber-600" />
              )}
            </div>
            <div>
              <p
                className={`font-bold text-sm ${isActive ? "text-emerald-800" : "text-amber-800"}`}
              >
                {isActive
                  ? "You are a member of this club!"
                  : "Payment Pending — Complete payment to join"}
              </p>
              {membershipId && (
                <p className="text-xs text-gray-500 mt-0.5">
                  Membership ID: {membershipId}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── JOIN / PAYMENT SECTION ───────────── */}
        <div className="cd-fadein-4 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-6">
          <p className="text-[0.67rem] font-bold tracking-[0.18em] text-orange-500 uppercase mb-2">
            Membership
          </p>
          <h2 className="font-bricolage font-bold text-[#1a1a2e] text-xl mb-5">
            {isActive
              ? "You're in! 🎉"
              : isPending
                ? "Almost there!"
                : "Ready to join?"}
          </h2>

          {!user ? (
            /* not logged in */
            <div className="flex items-center gap-4 p-5 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <AlertCircle size={20} className="text-amber-600" />
              </div>
              <p className="text-amber-800 font-semibold text-sm">
                Please login to join this club
              </p>
            </div>
          ) : isActive ? (
            /* already member */
            <div className="text-center p-6 bg-emerald-50 border border-emerald-200 rounded-xl">
              <CheckCircle
                size={36}
                className="text-emerald-500 mx-auto mb-3"
              />
              <p className="font-bricolage font-bold text-emerald-800 text-lg">
                You're already a member!
              </p>
              <p className="text-emerald-600 text-sm mt-1">
                You cannot join the same club multiple times
              </p>
            </div>
          ) : isPending && isPaid ? (
            /* stripe payment form */
            <div className="rounded-xl border border-indigo-100 overflow-hidden">
              <Elements stripe={stripePromise}>
                <ClubCheckoutForm
                  club={club}
                  user={user}
                  membershipId={membershipId}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              </Elements>
            </div>
          ) : (
            /* join button */
            <div className="space-y-3">
              <button
                onClick={() => joinClubMutation.mutate()}
                disabled={joinClubMutation.isLoading || isPending}
                className={`join-btn w-full py-4 rounded-2xl font-bricolage font-bold text-white text-[1rem] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                  ${isPaid ? "bg-[#1a1a2e] shadow-[0_8px_28px_rgba(26,26,46,0.2)]" : "join-btn-free bg-emerald-600 shadow-[0_8px_28px_rgba(22,163,74,0.2)]"}`}
              >
                {joinClubMutation.isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />{" "}
                    {isPaid ? "Creating Membership…" : "Joining…"}
                  </>
                ) : isPending ? (
                  <>
                    <AlertCircle size={18} /> Payment Pending
                  </>
                ) : isPaid ? (
                  `Join Club — $${club.membershipFee}`
                ) : (
                  "Join Club for Free"
                )}
              </button>

              {/* fine print */}
              <p className="text-center text-gray-400 text-xs">
                {isPaid
                  ? "Secure payment powered by Stripe. One-time fee."
                  : "No credit card required. Free forever."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
