import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

// ── Free Pexels video — students / campus / professional vibe ──
const BG_VIDEO =
  "https://videos.pexels.com/video-files/3195394/3195394-hd_1920_1080_25fps.mp4";

const FEATURES = [
  { icon: "📢", text: "Share resources with the community" },
  { icon: "💬", text: "Real-time discussions & comments" },
  { icon: "🏆", text: "Earn points & climb the leaderboard" },
  { icon: "🤝", text: "Build meaningful alumni connections" },
];

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      const res  = await API.post("/auth/login", { email, password });
      const role = res.data.user.role.toLowerCase();

      localStorage.setItem("token",  res.data.token);
      localStorage.setItem("name",   res.data.user.name);
      localStorage.setItem("role",   role);
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("points", res.data.user.points);

      document.body.classList.remove("student", "alumni", "admin");
      document.body.classList.add(role);

      window.location.href = `/${role}-dashboard`;

    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">

      {/* ── BACKGROUND VIDEO ───────────────────────────────── */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={BG_VIDEO}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* ── DARK GRADIENT OVERLAY ─────────────────────────── */}
      <div className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(120deg, rgba(10,5,30,0.82) 0%, rgba(20,10,50,0.70) 50%, rgba(5,15,40,0.85) 100%)"
        }}
      />

      {/* ── CONTENT ───────────────────────────────────────── */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT — Hero ─────────────────────────────────────── */}
        <div className="text-white">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-lg">
              🚀
            </div>
            <span
              className="text-2xl font-extrabold tracking-widest"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              AlumBridge
            </span>
          </div>

          <h1
            className="text-5xl font-extrabold leading-tight mb-5"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Connect.<br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Learn.
            </span>{" "}
            Grow.
          </h1>

          <p className="text-white/70 text-lg mb-8 leading-relaxed max-w-md">
            A powerful platform bridging the gap between students and alumni — share resources, earn rewards, and build lasting connections.
          </p>

          {/* Feature pills */}
          <div className="space-y-3">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3"
              >
                <span className="text-xl">{f.icon}</span>
                <span className="text-white/90 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Login card ───────────────────────────────── */}
        <div>
          <div
            className="rounded-3xl p-8 border"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderColor: "rgba(255,255,255,0.18)",
              boxShadow: "0 8px 64px rgba(120,60,255,0.25), inset 0 1px 0 rgba(255,255,255,0.1)"
            }}
          >
            <h2
              className="text-2xl font-bold text-white mb-2"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Welcome back 👋
            </h2>
            <p className="text-white/50 text-sm mb-7">
              Sign in to your AlumBridge account
            </p>

            {/* Email */}
            <label className="block text-white/60 text-xs font-semibold mb-1 uppercase tracking-widest">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 mb-4 rounded-xl text-white placeholder-white/30 outline-none text-sm"
              style={{
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />

            {/* Password */}
            <label className="block text-white/60 text-xs font-semibold mb-1 uppercase tracking-widest">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 mb-6 rounded-xl text-white placeholder-white/30 outline-none text-sm"
              style={{
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />

            {/* Error */}
            {error && (
              <p className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                ⚠ {error}
              </p>
            )}

            {/* Submit */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? "rgba(255,255,255,0.15)"
                  : "linear-gradient(135deg, #7c3aed, #ec4899)",
                boxShadow: loading ? "none" : "0 0 24px rgba(168,85,247,0.5)"
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In →"
              )}
            </button>

            <p className="text-center text-white/30 text-xs mt-6">
              Don't have an account?{" "}
              <span className="text-purple-400 cursor-pointer hover:underline">
                Contact your admin
              </span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;