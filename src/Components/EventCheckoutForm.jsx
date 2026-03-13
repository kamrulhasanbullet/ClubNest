import { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-hot-toast";
import { Loader2, CheckCircle, CreditCard, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router";

/* ── Font injection ─────────────────────────── */
const useFont = () => {
  useEffect(() => {
    if (document.getElementById("ecf-font")) return;
    const l = document.createElement("link");
    l.id = "ecf-font";
    l.href =
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Outfit:wght@400;500;600&display=swap";
    l.rel = "stylesheet";
    document.head.appendChild(l);
  }, []);
};

const STYLES = `
  .font-bricolage { font-family:'Bricolage Grotesque',sans-serif; }
  .font-outfit    { font-family:'Outfit',sans-serif; }

  /* Stripe CardElement container */
  .stripe-card-wrap .StripeElement {
    padding: 14px 16px;
    border-radius: 14px;
    border: 1.5px solid #e5e7eb;
    background: #fafaf8;
    transition: border-color .18s, box-shadow .18s;
    font-family: 'Outfit', sans-serif;
  }
  .stripe-card-wrap .StripeElement--focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79,70,229,0.12);
    outline: none;
  }
  .stripe-card-wrap .StripeElement--invalid {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239,68,68,0.1);
  }

  .pay-btn { transition: background .22s, transform .2s, box-shadow .2s; }
  .pay-btn:hover:not(:disabled) { background:#4f46e5 !important; transform:translateY(-2px); box-shadow:0 10px 32px rgba(79,70,229,0.28) !important; }
  .pay-btn:active:not(:disabled) { transform:scale(0.98); }

  .cancel-btn { transition: background .18s, border-color .18s; }
  .cancel-btn:hover { background:#f9fafb; border-color:#d1d5db; }
`;

/* ════════════════════════════════════════════ */
export const EventCheckoutForm = ({
  event,
  user,
  registrationId,
  onSuccess,
  onCancel,
}) => {
  useFont();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState("");
  const [isFreeEvent, setIsFreeEvent] = useState(false);

  /* ── Same logic — untouched ─────────────── */
  useEffect(() => {
    const eventFee = Number(event.eventFee) || 0;
    const freeEvent = !event.isPaid || eventFee === 0;
    setIsFreeEvent(freeEvent);
    if (freeEvent) handleFreeRegistration();
  }, [event]);

  const handleFreeRegistration = async () => {
    if (!user || !registrationId) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const confirmRes = await fetch(
        `${import.meta.env.VITE_API_URL}/event-registrations/${registrationId}/confirm`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ paymentId: "free_registration" }),
        },
      );
      if (!confirmRes.ok) {
        const error = await confirmRes.json();
        throw new Error(error.message || "Registration failed");
      }
      toast.success("🎉 Successfully registered for free event!");
      setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      console.error("Free registration error:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaidPayment = async (e) => {
    e.preventDefault();
    if (loading || !stripe || !elements) return;
    setLoading(true);
    setCardError("");
    try {
      const token = await user.getIdToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/create-event-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ eventId: event._id }),
        },
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Payment setup failed");
      }
      const { clientSecret } = await res.json();
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              email: user.email,
              name: user.displayName || user.email,
            },
          },
        },
      );
      if (error) {
        setCardError(error.message);
        throw new Error(error.message);
      }

      const confirmRes = await fetch(
        `${import.meta.env.VITE_API_URL}/event-registrations/${registrationId}/confirm`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ paymentId: paymentIntent.id }),
        },
      );
      if (!confirmRes.ok) {
        const error = await confirmRes.json();
        throw new Error(error.message || "Registration confirmation failed");
      }
      toast.success("Payment successful! Event registration confirmed.");
      onSuccess();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── FREE EVENT VIEW ─────────────────────── */
  if (isFreeEvent) {
    return (
      <div className="font-outfit p-8">
        <style>{STYLES}</style>
        <div className="text-center">
          {/* icon */}
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-5 shadow-[0_8px_24px_rgba(16,185,129,0.25)]">
            <CheckCircle size={28} className="text-white" />
          </div>
          <h3
            className="font-bricolage font-extrabold text-[#1a1a2e] text-xl mb-2"
            style={{ letterSpacing: "-0.03em" }}
          >
            Free Registration
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-7 max-w-[280px] mx-auto">
            This event is free to attend. No payment required.
          </p>

          {loading ? (
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
              <Loader2 size={16} className="animate-spin" />
              Processing registration…
            </div>
          ) : (
            <button
              onClick={() => navigate(`/events/${event._id}`)}
              className="px-8 py-3 bg-emerald-600 text-white font-bold text-sm rounded-2xl hover:bg-emerald-700 transition-colors shadow-[0_6px_20px_rgba(22,163,74,0.2)] cursor-pointer"
            >
              Back to Event
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ── PAID EVENT FORM ─────────────────────── */
  return (
    <div className="font-outfit p-7">
      <style>{STYLES}</style>

      {/* header */}
      <div className="mb-6">
        <p className="text-[0.67rem] font-bold tracking-[0.18em] text-orange-500 uppercase mb-1.5">
          Secure Checkout
        </p>
        <h3
          className="font-bricolage font-extrabold text-[#1a1a2e] text-xl mb-0.5"
          style={{ letterSpacing: "-0.03em" }}
        >
          Complete Payment
        </h3>
        <p className="text-gray-400 text-sm">{event.title}</p>
      </div>

      {/* amount summary */}
      <div className="flex items-center justify-between p-4 bg-[#fafaf8] border border-gray-100 rounded-2xl mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
            <CreditCard size={16} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-[0.07em]">
              Amount Due
            </p>
            <p
              className="font-bricolage font-extrabold text-[#1a1a2e] text-lg"
              style={{ letterSpacing: "-0.03em" }}
            >
              ${event.eventFee}
            </p>
          </div>
        </div>
        <span className="text-[0.68rem] text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg font-semibold">
          ID: {registrationId?.slice(-8)}
        </span>
      </div>

      {/* form */}
      <form onSubmit={handlePaidPayment} className="space-y-5">
        {/* card input */}
        <div>
          <label className="block text-[0.72rem] font-bold text-gray-500 uppercase tracking-[0.08em] mb-2.5">
            Card Details
          </label>
          <div className="stripe-card-wrap">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "15px",
                    color: "#1a1a2e",
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: "500",
                    "::placeholder": { color: "#9ca3af" },
                  },
                  invalid: { color: "#ef4444" },
                },
              }}
            />
          </div>
          {cardError && (
            <p className="text-red-500 text-xs mt-2 flex items-center gap-1.5 font-medium">
              <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-[10px]">
                !
              </span>
              {cardError}
            </p>
          )}
        </div>

        {/* stripe trust badge */}
        <p className="text-[0.7rem] text-gray-400 text-center flex items-center justify-center gap-1.5">
          <span>🔒</span> Secured by Stripe. Your card info is never stored.
        </p>

        {/* buttons */}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={!stripe || loading}
            className="pay-btn flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#1a1a2e] text-white font-bricolage font-bold text-[0.9rem] rounded-2xl shadow-[0_6px_20px_rgba(26,26,46,0.2)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Processing…
              </>
            ) : (
              <>
                <CreditCard size={16} /> Pay ${event.eventFee}{" "}
                <ArrowRight size={14} />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="cancel-btn w-12 h-12 flex items-center justify-center rounded-2xl border-[1.5px] border-gray-200 bg-white text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};
