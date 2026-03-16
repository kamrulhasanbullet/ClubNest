import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { use } from "react";
import { AuthContext } from "../context/AuthContext/AuthContext";
import Swal from "sweetalert2";
import {
  Sparkles,
  FileText,
  CalendarDays,
  MapPin,
  Users,
  DollarSign,
  Pencil,
  ArrowLeft,
} from "lucide-react";

export const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = use(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [token, setToken] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: "",
    isPaid: false,
    eventFee: 0,
    maxAttendees: "",
  });

  useEffect(() => {
    if (user) user.getIdToken().then(setToken);
  }, [user]);

  useEffect(() => {
    if (!token || !id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const eventRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/events/${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const event = eventRes.data;
        const formattedDate = new Date(event.eventDate)
          .toISOString()
          .slice(0, 16);

        setFormData({
          title: event.title || "",
          description: event.description || "",
          eventDate: formattedDate,
          location: event.location || "",
          isPaid: event.isPaid || false,
          eventFee: event.eventFee || 0,
          maxAttendees: event.maxAttendees || "",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to load event",
          text: "Could not load event details.",
          background: "#0b0f1e",
          color: "#e8eeff",
          confirmButtonColor: "#4f7fff",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, id, user?.email]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
        ...(name === "isPaid" && !checked ? { eventFee: 0 } : {}),
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Event title is required",
        background: "#0b0f1e",
        color: "#e8eeff",
        confirmButtonColor: "#4f7fff",
      });
      return;
    }
    if (!formData.eventDate) {
      Swal.fire({
        icon: "warning",
        title: "Event date is required",
        background: "#0b0f1e",
        color: "#e8eeff",
        confirmButtonColor: "#4f7fff",
      });
      return;
    }
    if (formData.isPaid && formData.eventFee <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Event fee must be greater than 0",
        background: "#0b0f1e",
        color: "#e8eeff",
        confirmButtonColor: "#4f7fff",
      });
      return;
    }

    setSaving(true);
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/events/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        await Swal.fire({
          icon: "success",
          title: "Event Updated!",
          text: "Your event has been updated successfully.",
          timer: 2000,
          showConfirmButton: false,
          background: "#0b0f1e",
          color: "#e8eeff",
        });
        navigate("/dashboard/manager/events");
      }
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.message || "Could not update event.",
        background: "#0b0f1e",
        color: "#e8eeff",
        confirmButtonColor: "#4f7fff",
      });
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-[#e8eeff] text-sm outline-none transition-all duration-200 placeholder:text-white/20 focus:bg-cyan-500/[0.06] focus:border-cyan-500/50 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.10)] disabled:opacity-40";

  /* ── Skeleton ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#060810] px-4 sm:px-8 py-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-linear-to-bl from-cyan-600 to-blue-700 opacity-6 blur-[110px] pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
          <div className="space-y-3">
            <div className="h-2 w-24 rounded-full bg-white/6 animate-pulse" />
            <div className="h-9 w-40 rounded-2xl bg-white/6 animate-pulse" />
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
    <div className="min-h-screen bg-[#060810] text-white px-4 sm:px-8 py-8 relative overflow-hidden">
      {/* ── Aurora bg ── */}
      <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-linear-to-bl from-cyan-600 to-blue-700 opacity-6 blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-linear-to-tr from-blue-600 to-violet-600 opacity-5 blur-[100px] pointer-events-none" />

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
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-cyan-400 mb-2">
            Club Manager
          </p>
          <h1 className="text-[34px] sm:text-[42px] font-light font-serif leading-tight text-[#f0f4ff]">
            Edit <em className="italic text-[#67e8f9]">Event</em>
          </h1>
          <p className="text-sm text-white/30 mt-1">
            Update your event information
          </p>
        </div>

        {/* ── Form card ── */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-2">
                <Sparkles size={12} />
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter event title"
                required
                disabled={saving}
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
                placeholder="Describe your event…"
                disabled={saving}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Date + Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-2">
                  <CalendarDays size={12} />
                  Event Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                  disabled={saving}
                  className={inputClass}
                />
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
                  placeholder="Venue or meeting link"
                  disabled={saving}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Max Attendees */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-2">
                <Users size={12} />
                Max Attendees
              </label>
              <input
                type="number"
                name="maxAttendees"
                value={formData.maxAttendees}
                onChange={handleChange}
                min={1}
                placeholder="Leave blank for unlimited"
                disabled={saving}
                className={inputClass}
              />
            </div>

            {/* Paid toggle */}
            <div className="bg-white/3 border border-white/[0.07] rounded-xl p-4 space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                    <DollarSign size={14} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/80">
                      Paid Event
                    </p>
                    <p className="text-[11px] text-white/30">
                      Charge attendees to register
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    name="isPaid"
                    id="isPaidToggle"
                    checked={formData.isPaid}
                    onChange={handleChange}
                    disabled={saving}
                    className="sr-only"
                  />
                  <label
                    htmlFor="isPaidToggle"
                    className={`cursor-pointer flex items-center w-10 h-6 rounded-full px-1 transition-colors duration-200 ${
                      formData.isPaid ? "bg-cyan-500" : "bg-white/10"
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                        formData.isPaid ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </label>
                </div>
              </label>

              {formData.isPaid && (
                <div>
                  <label className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-2 block">
                    Event Fee
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      name="eventFee"
                      value={formData.eventFee}
                      onChange={handleChange}
                      min={0.01}
                      step={0.01}
                      placeholder="0.00"
                      disabled={saving}
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                  <p className="text-[10.5px] text-white/20 mt-1.5 pl-1">
                    Participants will pay this amount to register
                  </p>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/dashboard/manager/events")}
                disabled={saving}
                className="cursor-pointer flex items-center gap-2 px-5 py-3 rounded-xl bg-white/4 border border-white/10 text-white/50 text-sm font-semibold hover:bg-white/8 hover:text-white/70 disabled:opacity-40 transition-all duration-200"
              >
                <ArrowLeft size={15} />
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="cursor-pointer flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold tracking-wide shadow-[0_4px_20px_rgba(6,182,212,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_28px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 transition-all duration-200"
              >
                {saving ? (
                  <span>Updating…</span>
                ) : (
                  <>
                    <Pencil size={15} />
                    Update Event
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
