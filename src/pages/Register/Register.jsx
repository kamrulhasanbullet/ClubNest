import { use } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate, NavLink } from "react-router";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

export const Register = () => {
  const { createUser, updateUserProfile, signInWithGoogle, signOutUser } =
    use(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/login";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { name, email, password, photoURL } = data;
    try {
      const result = await createUser(email, password);
      await updateUserProfile(name, photoURL);

      const firebaseUser = result.user;
      const token = await firebaseUser.getIdToken();

      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/save-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          name,
          email,
          photoURL,
          role: "member",
        }),
      });

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        timer: 2000,
        showConfirmButton: false,
      });
      signOutUser();
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.message
        .replace("Firebase:", "")
        .replace("auth/", "")
        .replace(/-/g, " ");
      toast.error(msg.charAt(0).toUpperCase() + msg.slice(1));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      const token = await user.getIdToken();

      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/save-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }),
      });

      Swal.fire({
        icon: "success",
        title: "Log In Successful!",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/", { replace: true });
    } catch (err) {
      const msg = err.message
        .replace("Firebase:", "")
        .replace("auth/", "")
        .replace(/-/g, " ");
      toast.error(msg.charAt(0).toUpperCase() + msg.slice(1));
    }
  };

  const inputClass = (hasError) =>
    `peer w-full bg-white/[0.04] border rounded-xl px-4 py-[15px] text-[#e8eeff] text-sm outline-none transition-all duration-200 placeholder:text-transparent focus:bg-blue-500/[0.06] focus:shadow-[0_0_0_3px_rgba(79,127,255,0.10)] ${
      hasError
        ? "border-red-400/55"
        : "border-white/10 focus:border-blue-500/60"
    }`;

  const labelClass =
    "absolute left-4 top-1/2 -translate-y-1/2 text-[13px] text-white/35 pointer-events-none transition-all duration-200 px-1 peer-focus:top-0 peer-focus:text-[11px] peer-focus:tracking-wide peer-focus:text-blue-400 peer-focus:bg-[#0b0f1e] peer-focus:px-1.5 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:tracking-wide peer-[:not(:placeholder-shown)]:text-blue-400 peer-[:not(:placeholder-shown)]:bg-[#0b0f1e] peer-[:not(:placeholder-shown)]:px-1.5";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060810] relative overflow-hidden py-10">
      <Helmet>
        <title>Register - ClubNest</title>
      </Helmet>

      {/* ── Aurora blobs ── */}
      <div className="absolute -top-44 -left-44 w-[600px] h-[600px] rounded-full bg-linear-to-br from-violet-500 to-blue-600 opacity-20 blur-[120px] animate-pulse" />
      <div className="absolute -bottom-36 -right-36 w-[500px] h-[500px] rounded-full bg-linear-to-br from-cyan-400 to-indigo-500 opacity-15 blur-[120px] animate-pulse [animation-delay:3s]" />

      {/* ── Grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Card ── */}
      <div className="relative z-10 w-full max-w-[440px] mx-6 bg-white/4 border border-white/10 rounded-3xl px-8 pt-12 pb-11 backdrop-blur-2xl shadow-[0_32px_80px_rgba(0,0,0,0.55),0_0_120px_rgba(139,92,246,0.07),inset_0_0_0_1px_rgba(255,255,255,0.05)]">
        {/* Top accent bar */}
        <div className="absolute top-0 left-10 w-14 h-[3px] rounded-b bg-linear-to-r from-violet-500 to-blue-500" />

        {/* ── Header ── */}
        <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-violet-400 mb-2.5">
          Get started
        </p>
        <h1 className="text-[40px] font-light leading-tight text-[#f0f4ff] mb-1.5 font-serif">
          Create <em className="italic text-[#c4b5fd]">your</em> account
        </h1>
        <p className="text-[13px] text-white/35 mb-9">
          Fill in your details to join
        </p>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* ── Form ── */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div className="relative">
            <input
              id="name"
              type="text"
              placeholder=" "
              className={inputClass(errors.name)}
              {...register("name", { required: "Name is required" })}
            />
            <label htmlFor="name" className={labelClass}>
              Full name
            </label>
            {errors.name && (
              <p className="text-[11.5px] text-red-400 mt-1.5 pl-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <input
              id="email"
              type="email"
              placeholder=" "
              className={inputClass(errors.email)}
              {...register("email", { required: "Email is required" })}
            />
            <label htmlFor="email" className={labelClass}>
              Email address
            </label>
            {errors.email && (
              <p className="text-[11.5px] text-red-400 mt-1.5 pl-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Photo URL */}
          <div className="relative">
            <input
              id="photoURL"
              type="text"
              placeholder=" "
              className={inputClass(errors.photoURL)}
              {...register("photoURL", { required: "Photo URL is required" })}
            />
            <label htmlFor="photoURL" className={labelClass}>
              Photo URL
            </label>
            {errors.photoURL && (
              <p className="text-[11.5px] text-red-400 mt-1.5 pl-1">
                {errors.photoURL.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              id="password"
              type="password"
              placeholder=" "
              className={inputClass(errors.password)}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z]).+$/,
                  message: "Must include uppercase & lowercase letter",
                },
              })}
            />
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            {errors.password && (
              <p className="text-[11.5px] text-red-400 mt-1.5 pl-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Password hint */}
          <p className="text-[11px] text-white/20 -mt-2 pl-1">
            Min. 6 chars · uppercase & lowercase required
          </p>

          {/* Submit */}
          <button
            type="submit"
            className="relative w-full py-[15px] rounded-xl bg-linear-to-br from-violet-500 to-blue-500 text-white text-sm font-semibold tracking-wide cursor-pointer overflow-hidden shadow-[0_4px_24px_rgba(139,92,246,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(139,92,246,0.50)] active:translate-y-0 before:absolute before:inset-0 before:bg-linear-to-br before:from-white/15 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-200"
          >
            Create account →
          </button>
        </form>

        {/* ── OR ── */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-[11px] text-white/25 tracking-widest">OR</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        {/* ── Google ── */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl border border-white/10 bg-white/4 text-white/70 text-[13.5px] font-medium cursor-pointer transition-all duration-200 hover:bg-white/8 hover:border-white/20 hover:-translate-y-px active:translate-y-0"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#4285F4"
              d="M386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
            />
            <path
              fill="#34A853"
              d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
            />
            <path
              fill="#FBBC02"
              d="M90 341a208 200 0 010-171l63 49q-12 37 0 73"
            />
            <path
              fill="#EA4335"
              d="M153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
            />
          </svg>
          Continue with Google
        </button>

        {/* ── Login link ── */}
        <p className="text-center mt-7 text-[12.5px] text-white/30">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="text-[#c4b5fd] font-semibold hover:text-white transition-colors duration-200"
          >
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
};
