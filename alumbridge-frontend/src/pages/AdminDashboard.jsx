import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

// ─── small stat card ────────────────────────────────────────────
function StatCard({ icon, label, value, color }) {
  return (
    <div className={`rounded-2xl p-5 shadow text-white bg-gradient-to-br ${color}`}>
      <div className="text-3xl mb-1">{icon}</div>
      <div className="text-3xl font-extrabold">{value ?? "—"}</div>
      <div className="text-sm opacity-80 mt-1">{label}</div>
    </div>
  );
}

// ─── confirm-delete helper ───────────────────────────────────────
function ConfirmBtn({ onConfirm, label = "🗑 Delete" }) {
  const [step, setStep] = useState(false);
  if (!step) {
    return (
      <button
        onClick={() => setStep(true)}
        className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition"
      >
        {label}
      </button>
    );
  }
  return (
    <span className="flex items-center gap-1">
      <button
        onClick={onConfirm}
        className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
      >
        Confirm
      </button>
      <button
        onClick={() => setStep(false)}
        className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-lg"
      >
        Cancel
      </button>
    </span>
  );
}

// ════════════════════════════════════════════════════════════════
function AdminDashboard() {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingResources, setLoadingResources] = useState(true);
  const [loadingLB, setLoadingLB] = useState(true);

  // ── fetch helpers ─────────────────────────────────────────────
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (e) { console.error(e); }
    finally { setLoadingUsers(false); }
  };

  const fetchResources = async () => {
    setLoadingResources(true);
    try {
      const res = await API.get("/resources");
      setResources(res.data);
    } catch (e) { console.error(e); }
    finally { setLoadingResources(false); }
  };

  const fetchLeaderboard = async () => {
    setLoadingLB(true);
    try {
      const res = await API.get("/admin/leaderboard");
      setLeaderboard(res.data);
    } catch (e) { console.error(e); }
    finally { setLoadingLB(false); }
  };

  useEffect(() => {
    fetchUsers();
    fetchResources();
    fetchLeaderboard();
  }, []);

  // ── delete handlers ───────────────────────────────────────────
  const deleteUser = async (id) => {
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (e) { alert("Failed to delete user"); }
  };

  const deleteResource = async (id) => {
    try {
      await API.delete(`/admin/resources/${id}`);
      setResources(prev => prev.filter(r => r.id !== id));
    } catch (e) { alert("Failed to delete resource"); }
  };

  // ── derived stats ─────────────────────────────────────────────
  const totalAlumni = users.filter(u => u.role === "alumni").length;
  const totalStudents = users.filter(u => u.role === "student").length;

  // ── tab style helper ──────────────────────────────────────────
  const tabCls = (t) =>
    `px-5 py-2 rounded-full text-sm font-semibold transition cursor-pointer
     ${tab === t
       ? "bg-red-500 text-white shadow"
       : "bg-white text-gray-600 hover:bg-red-50"}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── Header ── */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">🛠 Admin Control Panel</h1>
          <p className="text-gray-500 mt-1">Manage users, resources, and platform health</p>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon="👥" label="Total Users"     value={users.length}     color="from-red-400 to-red-600" />
          <StatCard icon="🎓" label="Alumni"          value={totalAlumni}      color="from-purple-400 to-purple-600" />
          <StatCard icon="📚" label="Students"        value={totalStudents}    color="from-blue-400 to-blue-600" />
          <StatCard icon="📢" label="Resources"       value={resources.length} color="from-green-400 to-green-600" />
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-3 flex-wrap">
          <button className={tabCls("users")}       onClick={() => setTab("users")}>       👥 Users       </button>
          <button className={tabCls("resources")}   onClick={() => setTab("resources")}>   📢 Resources   </button>
          <button className={tabCls("leaderboard")} onClick={() => setTab("leaderboard")}> 🏆 Leaderboard </button>
        </div>

        {/* ══ USERS TAB ══════════════════════════════════════════ */}
        {tab === "users" && (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="font-bold text-gray-700 text-lg">All Users ({users.length})</h2>
              <button onClick={fetchUsers} className="text-xs text-red-500 hover:underline">↻ Refresh</button>
            </div>

            {loadingUsers ? (
              <p className="p-6 text-gray-400 animate-pulse">Loading users...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3 text-left">ID</th>
                      <th className="px-6 py-3 text-left">Name</th>
                      <th className="px-6 py-3 text-left">Email</th>
                      <th className="px-6 py-3 text-left">Role</th>
                      <th className="px-6 py-3 text-left">Points</th>
                      <th className="px-6 py-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-3 text-gray-400">#{u.id}</td>
                        <td className="px-6 py-3 font-medium text-gray-800">{u.name}</td>
                        <td className="px-6 py-3 text-gray-500">{u.email}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full font-semibold
                            ${u.role === "admin"  ? "bg-red-100 text-red-700" :
                              u.role === "alumni" ? "bg-purple-100 text-purple-700" :
                                                    "bg-blue-100 text-blue-700"}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-semibold text-indigo-600">{u.points ?? 0}</td>
                        <td className="px-6 py-3">
                          {u.role !== "admin" && (
                            <ConfirmBtn onConfirm={() => deleteUser(u.id)} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══ RESOURCES TAB ══════════════════════════════════════ */}
        {tab === "resources" && (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="font-bold text-gray-700 text-lg">All Resources ({resources.length})</h2>
              <button onClick={fetchResources} className="text-xs text-red-500 hover:underline">↻ Refresh</button>
            </div>

            {loadingResources ? (
              <p className="p-6 text-gray-400 animate-pulse">Loading resources...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3 text-left">ID</th>
                      <th className="px-6 py-3 text-left">Title</th>
                      <th className="px-6 py-3 text-left">Posted By</th>
                      <th className="px-6 py-3 text-left">Likes</th>
                      <th className="px-6 py-3 text-left">Link</th>
                      <th className="px-6 py-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {resources.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-3 text-gray-400">#{r.id}</td>
                        <td className="px-6 py-3 font-medium text-gray-800 max-w-xs truncate">{r.title}</td>
                        <td className="px-6 py-3 text-gray-500">{r.posted_by_name}</td>
                        <td className="px-6 py-3 text-indigo-600 font-semibold">👍 {r.like_count ?? 0}</td>
                        <td className="px-6 py-3">
                          <a href={r.link} target="_blank" rel="noreferrer"
                            className="text-blue-500 hover:underline text-xs truncate block max-w-[120px]">
                            🔗 Open
                          </a>
                        </td>
                        <td className="px-6 py-3">
                          <ConfirmBtn onConfirm={() => deleteResource(r.id)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══ LEADERBOARD TAB ════════════════════════════════════ */}
        {tab === "leaderboard" && (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="font-bold text-gray-700 text-lg">🏆 Full Platform Leaderboard</h2>
              <button onClick={fetchLeaderboard} className="text-xs text-red-500 hover:underline">↻ Refresh</button>
            </div>

            {loadingLB ? (
              <p className="p-6 text-gray-400 animate-pulse">Loading leaderboard...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3 text-left">Rank</th>
                      <th className="px-6 py-3 text-left">Name</th>
                      <th className="px-6 py-3 text-left">Role</th>
                      <th className="px-6 py-3 text-left">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {leaderboard.map((u, i) => (
                      <tr key={u.id}
                        className={`transition ${i === 0 ? "bg-yellow-50" : i === 1 ? "bg-gray-50" : i === 2 ? "bg-orange-50" : "hover:bg-gray-50"}`}>
                        <td className="px-6 py-3 text-xl">
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                        </td>
                        <td className="px-6 py-3 font-semibold text-gray-800">{u.name}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full font-semibold
                            ${u.role === "admin"  ? "bg-red-100 text-red-700" :
                              u.role === "alumni" ? "bg-purple-100 text-purple-700" :
                                                    "bg-blue-100 text-blue-700"}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-bold text-indigo-600 text-base">{u.points ?? 0} pts</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;