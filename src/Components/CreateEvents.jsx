import { use, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext/AuthContext";
import Swal from "sweetalert2";
import {
  CalendarDays,
  MapPin,
  FileText,
  DollarSign,
  Users,
  Plus,
  Building2,
  Sparkles,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

export const CreateEvents = () => {
  const { user } = use(AuthContext);
  const [token, setToken] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
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
    if (user && token) {
      axios
        .get(
          `${import.meta.env.VITE_API_URL}/clubs?managerEmail=${user.email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then((res) => {
          setClubs(res.data);
          if (res.data.length > 0) setSelectedClub(res.data[0]._id);
        });
    }
  }, [user, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!selectedClub) {
      Swal.fire({
        icon: "warning",
        title: "No club selected",
        text: "Please select a club first.",
        background: "#0b0f1e",
        color: "#e8eeff",
        confirmButtonColor: "#4f7fff",
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/events`,
        { ...form, clubId: selectedClub },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      Swal.fire({
        icon: "success",
        title: "Event Created!",
        text: "Your event is now live.",
        timer: 2500,
        showConfirmButton: false,
        background: "#0b0f1e",
        color: "#e8eeff",
      });

      setForm({
        title: "",
        description: "",
        eventDate: "",
        location: "",
        isPaid: false,
        eventFee: 0,
        maxAttendees: "",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || "Could not create event.",
        background: "#0b0f1e",
        color: "#e8eeff",
        confirmButtonColor: "#4f7fff",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError = false) =>
    `w-full bg-white/[0.04] border rounded-xl px-4 py-3 text-[#e8eeff] text-sm outline-none transition-all duration-200 placeholder:text-white/20 focus:bg-cyan-500/[0.06] focus:shadow-[0_0_0_3px_rgba(6,182,212,0.10)] ${
      hasError
        ? "border-red-400/50"
        : "border-white/10 focus:border-cyan-500/50"
    }`;

  return (
    <div className="min-h-screen bg-[#060810] text-white px-4 sm:px-8 py-8 relative overflow-hidden">
      <Helmet>
        <title>Create Event - ClubNest</title>
      </Helmet>

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
            Create a <em className="italic text-[#67e8f9]">New Event</em>
          </h1>
          <p className="text-sm text-white/30 mt-1">
            Schedule an event for one of your clubs
          </p>
        </div>

        {/* ── Form card ── */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleCreateEvent} className="space-y-5">
            {/* Select Club */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-2">
                <Building2 size={12} />
                Select Club
              </label>
              {clubs.length === 0 ? (
                <div className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/25">
                  No clubs found — create a club first
                </div>
              ) : (
                <select
                  value={selectedClub}
                  onChange={(e) => setSelectedClub(e.target.value)}
                  className={`cursor-pointer ${inputClass()}`}
                >
                  {clubs.map((club) => (
                    <option
                      key={club._id}
                      value={club._id}
                      className="bg-[#0b0f1e]"
                    >
                      {club.clubName}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

            {/* Event Title */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-2">
                <Sparkles size={12} />
                Event Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Annual Photography Contest"
                value={form.title}
                onChange={handleChange}
                required
                className={inputClass()}
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
                placeholder="What is this event about…"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className={`${inputClass()} resize-none`}
              />
            </div>

            {/* Date + Location (2 col) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-2">
                  <CalendarDays size={12} />
                  Event Date
                </label>
                <input
                  type="datetime-local"
                  name="eventDate"
                  value={form.eventDate}
                  onChange={handleChange}
                  required
                  className={inputClass()}
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
                  placeholder="e.g. Dhaka, Bangladesh"
                  value={form.location}
                  onChange={handleChange}
                  className={inputClass()}
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
                placeholder="Leave blank for unlimited"
                value={form.maxAttendees}
                onChange={handleChange}
                min={1}
                className={inputClass()}
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
                {/* Toggle switch */}
                <div className="relative">
                  <input
                    type="checkbox"
                    name="isPaid"
                    checked={form.isPaid}
                    onChange={handleChange}
                    className="sr-only"
                    id="isPaidToggle"
                  />
                  <label
                    htmlFor="isPaidToggle"
                    className={`cursor-pointer block w-10 h-6 rounded-full transition-colors duration-200 ${
                      form.isPaid ? "bg-cyan-500" : "bg-white/10"
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white shadow mt-1 transition-transform duration-200 ${
                        form.isPaid ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </label>
                </div>
              </label>

              {/* Event fee — show if paid */}
              {form.isPaid && (
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
                      placeholder="0"
                      value={form.eventFee}
                      onChange={handleChange}
                      min={0}
                      className={`${inputClass()} pl-8`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || clubs.length === 0}
              className="cursor-pointer w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold tracking-wide shadow-[0_4px_20px_rgba(6,182,212,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_28px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 transition-all duration-200"
            >
              {loading ? (
                <span className="text-sm">Creating…</span>
              ) : (
                <>
                  <Plus size={16} />
                  Create Event
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
