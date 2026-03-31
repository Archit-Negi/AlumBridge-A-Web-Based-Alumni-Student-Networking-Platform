import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

// ── Background Video (Data / Tech Themed) ──────────────────────
const BG_VIDEO =
  "https://videos.pexels.com/video-files/3129957/3129957-hd_1920_1080_25fps.mp4";

// ── Features List ────────────────────────────────────────────────
const FEATURES = [
  { icon: "🌐", text: "Global network of professionals" },
  { icon: "📈", text: "Data-driven career insights" },
  { icon: "🔒", text: "Secure and verified connections" },
  { icon: "🚀", text: "Fast-track your career growth" },
];

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (loading) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await API.post("/auth/register", { name, email, password, role });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">

      {/* ── BACKGROUND VIDEO ───────────────────────── */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={BG_VIDEO}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* ── DARK OVERLAY (Cyan / Blue Gradient) ────── */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(120deg, rgba(5,20,30,0.88) 0%, rgba(10,30,50,0.80) 50%, rgba(5,15,40,0.92) 100%)",
        }}
      />

      {/* ── MAIN CONTENT ─────────────────────────── */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT SECTION */}
        <div className="text-white">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              📊
            </div>
            <span className="text-2xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
              AlumBridge
            </span>
          </div>

          <h1 className="text-5xl font-extrabold leading-tight mb-5">
            Join the<br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
              Network.
            </span>
          </h1>

          <p className="text-cyan-100/70 text-lg mb-8 max-w-md leading-relaxed">
            Unlock a world of opportunities. Create your account to start connecting with peers and industry leaders through data-driven insights.
          </p>

          {/* Features */}
          <div className="space-y-4">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-cyan-500/20 rounded-xl px-5 py-4 hover:bg-white/10 transition-colors shadow-sm"
              >
                <span className="text-2xl">{f.icon}</span>
                <span className="text-cyan-50 text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SECTION (Register Card) */}
        <div>
          <div className="rounded-3xl p-8 border bg-[#0a192f]/60 backdrop-blur-2xl border-cyan-500/20 shadow-[0_0_40px_-10px_rgba(6,182,212,0.25)] relative overflow-hidden">
            
            {/* Subtle glow effect behind card */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-cyan-500/20 rounded-full blur-[40px] pointer-events-none"></div>

            <h2 className="text-3xl font-bold text-white mb-2 relative z-10">
              Create Account ✨
            </h2>

            <p className="text-cyan-200/60 text-sm mb-8 relative z-10">
              Fill in your details to get started
            </p>

            <div className="space-y-4 relative z-10">
              {/* Name */}
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-xl bg-white/5 text-white outline-none border border-cyan-500/10 focus:border-cyan-500/50 focus:bg-white/10 transition-all placeholder-white/40"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              {/* Email */}
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-xl bg-white/5 text-white outline-none border border-cyan-500/10 focus:border-cyan-500/50 focus:bg-white/10 transition-all placeholder-white/40"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Role Selection */}
              <div className="relative">
                <select
                  className="w-full px-4 py-3 rounded-xl bg-[#0e213e] text-white/90 outline-none border border-cyan-500/10 focus:border-cyan-500/50 transition-all appearance-none cursor-pointer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="student">I am a Student</option>
                  <option value="alumni">I am an Alumni</option>
                </select>
                {/* Custom generic down arrow */}
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-cyan-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              {/* Password */}
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl bg-white/5 text-white outline-none border border-cyan-500/10 focus:border-cyan-500/50 focus:bg-white/10 transition-all placeholder-white/40"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Error & Success Messages */}
            <div className="mt-4 min-h-[24px]">
              {error && <p className="text-red-400 text-sm animate-pulse">{error}</p>}
              {success && <p className="text-cyan-400 text-sm font-medium">{success}</p>}
            </div>

            {/* Button */}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:opacity-90 transition-all hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register Now"}
            </button>

            {/* Login Link */}
            <p className="text-cyan-100/60 text-sm text-center mt-6">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/")}
                className="text-cyan-400 font-semibold cursor-pointer hover:text-cyan-300 hover:underline transition-colors"
              >
                Sign In
              </span>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;
