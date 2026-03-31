import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

// ── Background Video ─────────────────────────────
const BG_VIDEO =
  "https://videos.pexels.com/video-files/3129957/3129957-hd_1920_1080_25fps.mp4";

// ── Features List ────────────────────────────────
const FEATURES = [
  { icon: "📢", text: "Share resources with the community" },
  { icon: "💬", text: "Real-time discussions & comments" },
  { icon: "🏆", text: "Earn points & climb the leaderboard" },
  { icon: "🤝", text: "Build meaningful alumni connections" },
];

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });
      const role = res.data.user.role.toLowerCase();

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.user.name);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("points", res.data.user.points);

      document.body.classList.remove("student", "alumni", "admin");
      document.body.classList.add(role);

      window.location.href = `/${role}-dashboard`;

    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
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

      {/* ── DARK OVERLAY ─────────────────────────── */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(120deg, rgba(10,5,30,0.82) 0%, rgba(20,10,50,0.70) 50%, rgba(5,15,40,0.85) 100%)",
        }}
      />

      {/* ── MAIN CONTENT ─────────────────────────── */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT SECTION */}
        <div className="text-white">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-lg">
              🚀
            </div>
            <span className="text-2xl font-extrabold tracking-widest">
              AlumBridge
            </span>
          </div>

          <h1 className="text-5xl font-extrabold leading-tight mb-5">
            Connect.<br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Learn.
            </span>{" "}
            Grow.
          </h1>

          <p className="text-white/70 text-lg mb-8 max-w-md">
            A powerful platform bridging the gap between students and alumni —
            share resources, earn rewards, and build lasting connections.
          </p>

          {/* Features */}
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

        {/* RIGHT SECTION (Login Card) */}
        <div>
          <div className="rounded-3xl p-8 border bg-white/10 backdrop-blur-xl border-white/20 shadow-lg">

            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome back 👋
            </h2>

            <p className="text-white/50 text-sm mb-6">
              Sign in to your AlumBridge account
            </p>

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 mb-4 rounded-xl bg-white/10 text-white outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 mb-6 rounded-xl bg-white/10 text-white outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Error */}
            {error && (
              <p className="text-red-400 text-sm mb-4">{error}</p>
            )}

            {/* Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {/* Register Link */}
            <p className="text-white/60 text-sm text-center mt-6">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-purple-400 font-semibold cursor-pointer hover:underline transition"
              >
                Register Now
              </span>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;