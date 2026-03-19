import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { toast } from "react-hot-toast";
import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  CheckCircle,
  Loader2,
  AlertCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { EventCheckoutForm } from "../../../Components/EventCheckOutForm";
import { Helmet } from "react-helmet-async";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

/* ── Font injection ─────────────────────────── */
const useFont = () => {
  useEffect(() => {
    if (document.getElementById("ed-font")) return;
    const l = document.createElement("link");
    l.id = "ed-font";
    l.href =
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800&family=Outfit:wght@300;400;500;600&display=swap";
    l.rel = "stylesheet";
    document.head.appendChild(l);
  }, []);
};

const STYLES = `
  .font-bricolage { font-family:'Bricolage Grotesque',sans-serif; }
  .font-outfit    { font-family:'Outfit',sans-serif; }

  @keyframes edFadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  .ed-f1 { animation: edFadeUp 0.4s cubic-bezier(.22,1,.36,1) 0.00s both; }
  .ed-f2 { animation: edFadeUp 0.4s cubic-bezier(.22,1,.36,1) 0.08s both; }
  .ed-f3 { animation: edFadeUp 0.4s cubic-bezier(.22,1,.36,1) 0.16s both; }
  .ed-f4 { animation: edFadeUp 0.4s cubic-bezier(.22,1,.36,1) 0.24s both; }

  .reg-btn { transition: background .22s, transform .2s, box-shadow .2s; }
  .reg-btn:hover { background:#4f46e5 !important; transform:translateY(-2px); box-shadow:0 10px 32px rgba(79,70,229,0.28) !important; }
  .reg-btn:active { transform:scale(0.98); }

  .reg-btn-free:hover { background:#16a34a !important; box-shadow:0 10px 32px rgba(22,163,74,0.22) !important; }

  .meta-card { transition: border-color .2s, box-shadow .2s; }
  .meta-card:hover { border-color: rgba(79,70,229,0.18) !important; box-shadow: 0 6px 24px rgba(79,70,229,0.07); }
`;

/* ── Gradient text ──────────────────────────── */
const gText = {
  background: "linear-gradient(135deg,#4f46e5,#f97316)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

/* ════════════════════════════════════════════ */
export const EventDetails = () => {
  useFont();
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [registrationId, setRegistrationId] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState("");

  /* ── Fetch event ────────────────────────── */
  const {
    data: event = {},
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["eventDetails", id],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/events/${id}`);
      if (!res.ok) throw new Error("Failed to fetch event");
      return res.json();
    },
  });

  /* ── Check registration ─────────────────── */
  useEffect(() => {
    const checkRegistration = async () => {
      if (user && event?._id) {
        try {
          const token = await user.getIdToken();
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/check-event-registration?eventId=${event._id}`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          if (res.ok) {
            const data = await res.json();
            setIsRegistered(data.isRegistered);
            setRegistrationStatus(data.status);
            if (data.registrationId) setRegistrationId(data.registrationId);
            if (data.status === "pendingPayment") setShowPayment(true);
          }
        } catch (err) {
          console.error("Check registration error:", err);
        }
      }
    };
    if (event?._id) checkRegistration();
  }, [event?._id, user]);

  /* ── Handle registration ────────────────── */
  const handleRegistration = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    try {
      const token = await user.getIdToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/event-registrations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ eventId: event._id }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      if (data.existing && data.status === "pendingPayment") {
        setRegistrationId(data.registrationId);
        setShowPayment(true);
        setRegistrationStatus("pendingPayment");
        toast.success("Continue with your pending payment");
      } else if (data.requiresPayment) {
        setRegistrationId(data.registrationId);
        setShowPayment(true);
        setRegistrationStatus("pendingPayment");
        toast.success("Registration created! Please complete payment.");
      } else {
        setIsRegistered(true);
        setRegistrationId(data.registrationId);
        setRegistrationStatus("registered");
        toast.success("Successfully registered for event!");
        refetch();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCancelPayment = () => {
    setShowPayment(false);
    toast("Payment cancelled");
  };
  const handlePaymentSuccess = () => {
    setIsRegistered(true);
    setShowPayment(false);
    setRegistrationStatus("registered");
    toast.success("Payment successful! You are now registered.");
    refetch();
  };

  /* ── Derived values ─────────────────────── */
  const availableSeats = event.maxAttendees
    ? Math.max(0, event.maxAttendees - (event.registeredCount || 0))
    : null;
  const isFull = event.maxAttendees && availableSeats <= 0;
  const isFree =
    !event.isPaid || !event.eventFee || Number(event.eventFee) === 0;
  const eventDate = event.eventDate ? new Date(event.eventDate) : null;

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
            Loading event details…
          </p>
        </div>
      </div>
    );

  /* ── Error ──────────────────────────────── */
  if (error)
    return (
      <div className="font-outfit min-h-screen bg-[#fafaf8] flex items-center justify-center px-6">
        <style>{STYLES}</style>
        <div className="text-center bg-white rounded-3xl border border-red-100 p-10 max-w-sm shadow-sm">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="font-bricolage text-lg font-bold text-red-600 mb-2">
            Failed to load event
          </p>
          <p className="text-sm text-gray-400">{error.message}</p>
        </div>
      </div>
    );

  /* ── Meta cards data ────────────────────── */
  const metaItems = [
    {
      icon: Calendar,
      label: "Date & Time",
      value: eventDate
        ? `${eventDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · ${eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
        : "TBD",
      bg: "bg-indigo-50",
      ic: "text-indigo-600",
    },
    {
      icon: MapPin,
      label: "Location",
      value: event.location || "TBD",
      bg: "bg-red-50",
      ic: "text-red-500",
    },
    {
      icon: Users,
      label: "Attendees",
      value: `${event.registeredCount || 0}${event.maxAttendees ? ` / ${event.maxAttendees}` : ""}${availableSeats !== null ? ` · ${availableSeats} seats left` : ""}`,
      bg: "bg-violet-50",
      ic: "text-violet-600",
    },
    {
      icon: CreditCard,
      label: "Payment",
      value: isFree ? "Free Entry" : `Paid — $${event.eventFee}`,
      bg: isFree ? "bg-emerald-50" : "bg-amber-50",
      ic: isFree ? "text-emerald-600" : "text-amber-600",
    },
  ];

  return (
    <div className="font-outfit min-h-screen bg-[#fafaf8] px-4 md:px-6 py-12">
      <style>{STYLES}</style>

      <Helmet>
        <title>
          {event.title ? `${event.title} - ClubNest` : "ClubNest"}
        </title>
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* ── HERO CARD ─────────────────────── */}
        <div className="ed-f1 relative rounded-3xl overflow-hidden bg-[#1a1a2e] shadow-[0_20px_60px_rgba(26,26,46,0.2)]">
          {/* radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 30% 50%,rgba(79,70,229,0.18) 0%,transparent 65%)",
            }}
          />

          <div className="relative z-10 p-8 md:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* eyebrow */}
                <p className="text-[0.67rem] font-bold tracking-[0.18em] text-orange-400 uppercase mb-3">
                  {event.clubName}
                </p>
                {/* title */}
                <h1
                  className="font-bricolage font-extrabold text-white leading-tight mb-4"
                  style={{
                    fontSize: "clamp(1.6rem,4vw,2.6rem)",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {event.title}
                </h1>
                {/* description */}
                <p className="text-slate-400 text-sm leading-[1.8] max-w-[560px]">
                  {event.description}
                </p>
              </div>

              {/* badges */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span
                  className={`px-4 py-1.5 rounded-full text-[0.72rem] font-extrabold uppercase tracking-[0.08em] border
                  ${isFree ? "bg-emerald-50/10 text-emerald-300 border-emerald-500/30" : "bg-amber-50/10 text-amber-300 border-amber-500/30"}`}
                >
                  {isFree ? "Free Event" : `$${event.eventFee}`}
                </span>
                {isFull && (
                  <span className="px-3 py-1 bg-red-500/15 text-red-400 border border-red-500/30 rounded-full text-[0.72rem] font-bold">
                    Sold Out
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── META GRID ─────────────────────── */}
        <div className="ed-f2 grid grid-cols-2 md:grid-cols-4 gap-4">
          {metaItems.map((m, i) => (
            <div
              key={i}
              className="meta-card bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_2px_16px_rgba(0,0,0,0.04)] flex flex-col gap-3 transition-all duration-200"
            >
              <div
                className={`w-9 h-9 rounded-xl ${m.bg} flex items-center justify-center`}
              >
                <m.icon size={16} className={m.ic} />
              </div>
              <div>
                <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-[0.08em] mb-0.5">
                  {m.label}
                </p>
                <p className="font-bricolage font-bold text-[#1a1a2e] text-[0.82rem] leading-snug">
                  {m.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── REGISTRATION STATUS ───────────── */}
        {user && registrationStatus && (
          <div
            className={`ed-f3 flex items-center gap-4 p-5 rounded-2xl border
            ${
              registrationStatus === "registered"
                ? "bg-emerald-50 border-emerald-200"
                : "bg-amber-50 border-amber-200"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
              ${registrationStatus === "registered" ? "bg-emerald-100" : "bg-amber-100"}`}
            >
              {registrationStatus === "registered" ? (
                <CheckCircle size={20} className="text-emerald-600" />
              ) : (
                <Clock size={20} className="text-amber-600" />
              )}
            </div>
            <div>
              <p
                className={`font-bold text-sm ${registrationStatus === "registered" ? "text-emerald-800" : "text-amber-800"}`}
              >
                {registrationStatus === "registered"
                  ? "You are registered for this event!"
                  : "Payment Pending"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {registrationStatus === "registered"
                  ? `Registration ID: ${registrationId}`
                  : `Complete payment to confirm your spot (ID: ${registrationId})`}
              </p>
            </div>
          </div>
        )}

        {/* ── REGISTER / PAYMENT SECTION ────── */}
        <div className="ed-f4 bg-white rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.05)] p-8">
          <p className="text-[0.67rem] font-bold tracking-[0.18em] text-orange-500 uppercase mb-2">
            Registration
          </p>
          <h2
            className="font-bricolage font-extrabold text-[#1a1a2e] text-xl mb-6"
            style={{ letterSpacing: "-0.03em" }}
          >
            {registrationStatus === "registered"
              ? "You're in! 🎉"
              : isFull
                ? "Event Full"
                : showPayment
                  ? "Complete Payment"
                  : "Ready to join?"}
          </h2>

          {/* not logged in */}
          {!user ? (
            <div className="flex items-center gap-4 p-5 bg-amber-50 border border-amber-200 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <AlertCircle size={20} className="text-amber-600" />
              </div>
              <p className="text-amber-800 font-semibold text-sm">
                Please login to register for this event
              </p>
            </div>
          ) : /* already registered */
          registrationStatus === "registered" ? (
            <div className="text-center p-8 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <CheckCircle
                size={40}
                className="text-emerald-500 mx-auto mb-3"
              />
              <p className="font-bricolage font-bold text-emerald-800 text-lg mb-1">
                You're already registered!
              </p>
              <p className="text-emerald-600 text-sm">
                We'll see you at the event.
              </p>
            </div>
          ) : /* sold out */
          isFull ? (
            <div className="flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle size={20} className="text-red-500" />
              </div>
              <p className="text-red-700 font-semibold text-sm">
                This event is fully booked
              </p>
            </div>
          ) : /* stripe payment form */
          event.isPaid && showPayment ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-indigo-100 overflow-hidden">
                <Elements stripe={stripePromise}>
                  <EventCheckoutForm
                    event={event}
                    user={user}
                    registrationId={registrationId}
                    onSuccess={handlePaymentSuccess}
                    onCancel={handleCancelPayment}
                  />
                </Elements>
              </div>
              <button
                onClick={handleCancelPayment}
                className="w-full py-3 rounded-2xl text-sm font-semibold text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel payment
              </button>
            </div>
          ) : (
            /* register button */
            <div className="space-y-3">
              <button
                onClick={handleRegistration}
                disabled={isLoading}
                className={`reg-btn w-full py-4 rounded-2xl font-bricolage font-bold text-white text-[0.95rem] flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
                  ${
                    isFree
                      ? "reg-btn-free bg-emerald-600 shadow-[0_8px_28px_rgba(22,163,74,0.2)]"
                      : "bg-[#1a1a2e] shadow-[0_8px_28px_rgba(26,26,46,0.2)]"
                  }`}
              >
                {registrationStatus === "pendingPayment" ? (
                  <>
                    <Clock size={17} /> Continue Payment
                  </>
                ) : isFree ? (
                  <>
                    <CheckCircle size={17} /> Register for Free
                  </>
                ) : (
                  <>
                    <CreditCard size={17} /> Register & Pay — ${event.eventFee}
                  </>
                )}
                <ArrowRight size={15} />
              </button>

              {/* fine print */}
              <p className="text-center text-gray-400 text-xs">
                {registrationStatus === "pendingPayment"
                  ? "You have a pending payment for this event."
                  : isFree
                    ? "Free entry — no credit card required."
                    : "You'll complete payment on the next step."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
