import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

// ── Icons
const ICONS = {
  users: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
  ),
  resources: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
  ),
  leaderboard: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
  ),
  logout: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3-3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
  ),
  admin: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  ),
  referrals: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
  )
};

// ─── Glassmorphic Stat Card
function StatCard({ title, value, icon, trend }) {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/10 flex items-center gap-4 transition hover:bg-white/10 group">
      <div className={`p-4 rounded-xl shadow-inner ${trend ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-white/5 text-gray-300'}`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{title}</p>
        <h3 className="text-3xl font-black text-white tracking-tight">{value ?? "—"}</h3>
      </div>
    </div>
  );
}

// ─── Confirm Delete Component
function ConfirmBtn({ onConfirm, label = "Delete" }) {
  const [step, setStep] = useState(false);
  if (!step) {
    return (
      <button
        onClick={() => setStep(true)}
        className="text-xs font-bold text-red-400 hover:text-red-300 hover:underline transition px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-md border border-red-500/20 backdrop-blur-sm"
      >
        {label}
      </button>
    );
  }
  return (
    <span className="flex items-center gap-2">
      <button
        onClick={onConfirm}
        className="text-xs font-bold bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition shadow-sm border border-red-600"
      >
        Confirm
      </button>
      <button
        onClick={() => setStep(false)}
        className="text-xs font-bold text-gray-300 hover:text-white hover:underline px-2 py-1"
      >
        Cancel
      </button>
    </span>
  );
}

// ════════════════════════════════════════════════════════════════
function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingResources, setLoadingResources] = useState(true);
  const [loadingLB, setLoadingLB] = useState(true);

  const [referrals, setReferrals] = useState([]);
  const [loadingReferrals, setLoadingReferrals] = useState(true);

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

  const fetchReferrals = async () => {
    setLoadingReferrals(true);
    try {
      const res = await API.get("/referrals");
      setReferrals(res.data);
    } catch (e) { console.error(e); }
    finally { setLoadingReferrals(false); }
  };

  useEffect(() => {
    fetchUsers();
    fetchResources();
    fetchLeaderboard();
    fetchReferrals();
  }, []);

  const updateReferralStatus = async (id, status) => {
    if (!window.confirm(`Are you sure you want to mark this referral as ${status}?`)) return;
    try {
      const res = await API.patch(`/referrals/${id}/status`, { status });
      alert(res.data.message);
      fetchReferrals();
    } catch (e) {
      alert("Failed to update status");
      console.error(e);
    }
  };

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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const totalAlumni = users.filter(u => u.role === "alumni").length;
  const totalStudents = users.filter(u => u.role === "student").length;

  const adminName = localStorage.getItem("name") || "Admin";

  const navLinks = [
    { id: "dashboard", label: "Dashboard", icon: ICONS.admin }, // We map "dashboard" to nothing specific yet or overview
    { id: "users", label: "Platform Users", icon: ICONS.users },
    { id: "resources", label: "Resource Hub", icon: ICONS.resources },
    { id: "leaderboard", label: "Leaderboard", icon: ICONS.leaderboard },
    { id: "referrals", label: "Referrals", icon: ICONS.referrals },
  ];

  return (
    <div className="relative flex h-screen w-full overflow-hidden text-white font-sans bg-black">
      
      {/* ── BACKGROUND VIDEO ── */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0 blur-[1px] scale-105"
        src="https://videos.pexels.com/video-files/3129957/3129957-hd_1920_1080_25fps.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      
      {/* ── STRONG DARK OVERLAY ── */}
      <div className="absolute inset-0 z-10 bg-black/75 backdrop-blur-[2px]" />

      {/* ── Fixed Left Sidebar 100vh ── */}
      <aside className="relative z-20 w-72 bg-white/5 border-r border-white/10 flex flex-col shadow-2xl backdrop-blur-md flex-shrink-0">
        
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-white/10 shrink-0 bg-black/20">
          <h1 className="text-xl font-black text-white tracking-wide flex items-center gap-3">
            <span className="bg-red-500/20 border border-red-400/30 text-red-300 rounded-xl p-1.5 shadow-md flex items-center justify-center text-lg">🚀</span>
            AlumBridge
          </h1>
        </div>

        {/* Scrollable Nav & Stats inside sidebar */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8 custom-scrollbar">
          
          {/* Main Navigation */}
          <nav className="space-y-1.5">
            <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">System Menu</p>
            {navLinks.map((link) => {
              const isActive = tab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setTab(link.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${
                    isActive 
                      ? "bg-red-500/20 border border-red-500/30 text-red-300 shadow-lg" 
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className={`${isActive ? "text-red-400" : "text-gray-400 group-hover:text-white"}`}>
                    {link.icon}
                  </span>
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Quick Stats Section */}
          <div className="space-y-4 px-1">
            <p className="px-2 text-xs font-bold text-gray-400 uppercase tracking-widest">System Load</p>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm shadow-inner">
              <h3 className="font-bold text-red-300 text-sm mb-1">Total Users</h3>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-2xl font-black text-white">{users.length}</span>
                <span className="text-xs text-green-400 font-medium mb-1 uppercase">+Active</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 font-medium tracking-wide">Growing network globally 🌐</p>
            </div>
          </div>

        </div>

        {/* Bottom Profile / Logout */}
        <div className="p-5 border-t border-white/10 shrink-0 bg-black/40">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mb-4 border border-white/10 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-400/30 text-red-300 font-black flex items-center justify-center text-lg shadow-inner">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-bold text-white truncate">{adminName}</p>
              <p className="text-[10px] font-bold text-red-300 uppercase letter-spacing-wide tracking-widest">Root Admin</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 font-bold rounded-xl hover:bg-red-500/10 hover:text-red-300 border border-transparent hover:border-red-500/20 transition-all duration-200"
          >
            {ICONS.logout}
            Secure Logout
          </button>
        </div>
      </aside>

      {/* ── Main Scrollable Area ── */}
      <main className="relative z-20 flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Minimal Header */}
        <header className="h-20 bg-black/20 border-b border-white/10 flex items-center justify-between px-10 flex-shrink-0 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black text-white tracking-tight hidden sm:block">
              {navLinks.find(l => l.id === tab)?.label || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-5">
            <span className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20 backdrop-blur-sm shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              All Systems Operational
            </span>
          </div>
        </header>

        {/* Page Content Scrolling Wrapper */}
        <div className="flex-1 overflow-y-auto px-6 md:px-10 py-10">
          <div className="max-w-7xl mx-auto space-y-10">
            
            {/* Header Welcome */}
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-black text-white tracking-tighter drop-shadow-md">Admin Workspace</h1>
                <p className="text-gray-300 mt-2 text-base font-medium drop-shadow-sm">High-level control panel to monitor activity and moderate content.</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Users" value={users.length} icon="👥" trend={true} />
              <StatCard title="Alumni Accounts" value={totalAlumni} icon="🎓" trend={true} />
              <StatCard title="Student Accounts" value={totalStudents} icon="📚" trend={true} />
              <StatCard title="Active Resources" value={resources.length} icon="📢" trend={true} />
            </div>

            {/* ══ DASHBOARD TAB ══ */}
            {tab === "dashboard" && (
              <div className="bg-white/5 border border-white/10 p-16 rounded-3xl backdrop-blur-md text-center shadow-2xl mt-6">
                <span className="text-6xl mb-4 block">📈</span>
                <h2 className="text-2xl font-black text-white mb-2">Welcome to your Control Center</h2>
                <p className="text-gray-400 text-sm font-medium mb-6">Select a module from the left sidebar to begin managing the platform.</p>
                <div className="flex gap-4 justify-center">
                  <button onClick={() => setTab("users")} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition font-bold">Manage Users</button>
                  <button onClick={() => setTab("resources")} className="px-6 py-2 bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/50 text-indigo-300 rounded-lg transition font-bold">Moderate Content</button>
                </div>
              </div>
            )}

            {/* ══ USERS TAB CONTENT ══ */}
            {tab === "users" && (
              <div className="bg-white/5 rounded-3xl shadow-2xl border border-white/10 overflow-hidden backdrop-blur-md mt-6">
                <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                  <h2 className="font-bold text-white text-xl tracking-tight">Platform Users</h2>
                  <button onClick={fetchUsers} className="text-sm font-bold text-white hover:text-indigo-300 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2 transition">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Refresh
                  </button>
                </div>

                {loadingUsers ? (
                  <div className="p-16 flex justify-center"><div className="w-10 h-10 border-4 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin"></div></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left align-middle border-collapse">
                      <thead className="bg-black/30 text-gray-300 font-bold uppercase text-xs tracking-widest border-b border-white/10">
                        <tr>
                          <th className="px-8 py-5">User</th>
                          <th className="px-8 py-5">Role</th>
                          <th className="px-8 py-5">Engagement</th>
                          <th className="px-8 py-5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {users.map(u => (
                          <tr key={u.id} className="hover:bg-white/5 transition-colors duration-200 group">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black shadow-inner border border-white/10
                                  ${u.role === 'admin' ? 'bg-red-500/20 text-red-300' : 
                                    u.role === 'alumni' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                  {u.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-bold text-white text-base drop-shadow-sm">{u.name}</p>
                                  <p className="text-xs font-medium text-gray-400 tracking-wide mt-0.5">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <span className={`px-3 py-1.5 text-xs rounded-lg font-bold uppercase tracking-widest border backdrop-blur-sm shadow-sm
                                ${u.role === "admin"  ? "bg-red-500/20 text-red-300 border-red-500/30" :
                                  u.role === "alumni" ? "bg-purple-500/20 text-purple-300 border-purple-500/30" :
                                                        "bg-blue-500/20 text-blue-300 border-blue-500/30"}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-8 py-5">
                              <span className="font-black text-white text-base drop-shadow">{u.points ?? 0}</span> 
                              <span className="text-gray-400 font-semibold text-xs ml-1 uppercase">pts</span>
                            </td>
                            <td className="px-8 py-5 text-right">
                              {u.role !== "admin" ? (
                                <ConfirmBtn onConfirm={() => deleteUser(u.id)} label="Remove User" />
                              ) : (
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Protected</span>
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

            {/* ══ RESOURCES TAB CONTENT ══ */}
            {tab === "resources" && (
              <div className="bg-white/5 rounded-3xl shadow-2xl border border-white/10 overflow-hidden backdrop-blur-md mt-6">
                <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                  <h2 className="font-bold text-white text-xl tracking-tight">Content Repository</h2>
                  <button onClick={fetchResources} className="text-sm font-bold text-white hover:text-indigo-300 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2 transition">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Refresh
                  </button>
                </div>

                {loadingResources ? (
                  <div className="p-16 flex justify-center"><div className="w-10 h-10 border-4 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin"></div></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left align-middle border-collapse">
                      <thead className="bg-black/30 text-gray-300 font-bold uppercase text-xs tracking-widest border-b border-white/10">
                        <tr>
                          <th className="px-8 py-5 w-5/12">Resource Name</th>
                          <th className="px-8 py-5">Author</th>
                          <th className="px-8 py-5">Engagement</th>
                          <th className="px-8 py-5 text-right flex-shrink-0">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {resources.map(r => (
                          <tr key={r.id} className="hover:bg-white/5 transition-colors duration-200 group">
                            <td className="px-8 py-5">
                              <p className="font-bold text-white text-lg leading-tight mb-1 drop-shadow-sm">{r.title}</p>
                              <a href={r.link} target="_blank" rel="noreferrer" className="text-sm font-bold text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1.5 drop-shadow">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                Open Source Link
                              </a>
                            </td>
                            <td className="px-8 py-5">
                              <span className="font-bold text-gray-200 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 shadow-inner">
                                {r.posted_by_name}
                              </span>
                            </td>
                            <td className="px-8 py-5">
                              <span className="inline-flex items-center gap-1.5 bg-green-500/20 text-green-300 px-3 py-1.5 rounded-lg text-sm font-bold border border-green-500/30 backdrop-blur-sm shadow-sm">
                                👍 {r.like_count ?? 0}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <ConfirmBtn onConfirm={() => deleteResource(r.id)} label="Remove Resource" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ══ LEADERBOARD TAB CONTENT ══ */}
            {tab === "leaderboard" && (
              <div className="bg-white/5 rounded-3xl shadow-2xl border border-white/10 overflow-hidden backdrop-blur-md mt-6">
                <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                  <h2 className="font-bold text-white text-xl tracking-tight">Top Contributors</h2>
                  <button onClick={fetchLeaderboard} className="text-sm font-bold text-white hover:text-indigo-300 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2 transition">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Refresh
                  </button>
                </div>

                {loadingLB ? (
                  <div className="p-16 flex justify-center"><div className="w-10 h-10 border-4 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin"></div></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left align-middle border-collapse">
                      <thead className="bg-black/30 text-gray-300 font-bold uppercase text-xs tracking-widest border-b border-white/10">
                        <tr>
                          <th className="px-8 py-5 w-24 text-center">Rank</th>
                          <th className="px-8 py-5">User Profile</th>
                          <th className="px-8 py-5 text-right w-48">Total Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {leaderboard.map((u, i) => {
                          const isTop = i < 3;
                          return (
                            <tr key={u.id} className={`${i === 0 ? "bg-amber-500/10" : i === 1 ? "bg-slate-400/10" : i === 2 ? "bg-orange-500/10" : "hover:bg-white/5"} transition-colors duration-200`}>
                              <td className="px-8 py-5 text-center font-black text-2xl drop-shadow-md">
                                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : <span className="text-gray-500 text-lg">#{i + 1}</span>}
                              </td>
                              <td className="px-8 py-5">
                                <div className="flex flex-col">
                                  <span className={`font-black text-lg drop-shadow-sm ${isTop ? "text-white" : "text-gray-200"}`}>{u.name}</span>
                                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">{u.role}</span>
                                </div>
                              </td>
                              <td className="px-8 py-5 text-right">
                                <div className="flex items-center justify-end gap-2 text-xl">
                                  <span className={`font-black drop-shadow ${isTop ? "text-yellow-400" : "text-gray-300"}`}>
                                    {u.points ?? 0}
                                  </span>
                                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">pts</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            {/* ══ REFERRALS TAB CONTENT ══ */}
            {tab === "referrals" && (
              <div className="bg-white/5 rounded-3xl shadow-2xl border border-white/10 overflow-hidden backdrop-blur-md mt-6">
                <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                  <h2 className="font-bold text-white text-xl tracking-tight">Referral Management</h2>
                  <button onClick={fetchReferrals} className="text-sm font-bold text-white hover:text-indigo-300 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2 transition">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Refresh
                  </button>
                </div>

                {loadingReferrals ? (
                  <div className="p-16 flex justify-center"><div className="w-10 h-10 border-4 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin"></div></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left align-middle border-collapse">
                      <thead className="bg-black/30 text-gray-300 font-bold uppercase text-xs tracking-widest border-b border-white/10">
                        <tr>
                          <th className="px-8 py-5">Referral Info</th>
                          <th className="px-8 py-5">Referred By (Alumni)</th>
                          <th className="px-8 py-5">Status</th>
                          <th className="px-8 py-5 text-right w-48">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {referrals.map(ref => (
                          <tr key={ref.id} className="hover:bg-white/5 transition-colors duration-200 group">
                            <td className="px-8 py-5">
                              <p className="font-bold text-white text-base drop-shadow-sm">{ref.student_name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{ref.student_email}</p>
                              <p className="text-[10px] font-bold text-indigo-400 mt-1 uppercase tracking-wider">{ref.company} - {ref.role}</p>
                            </td>
                            <td className="px-8 py-5">
                              <p className="font-bold text-white text-base drop-shadow-sm">{ref.alumni_name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{ref.alumni_email}</p>
                            </td>
                            <td className="px-8 py-5">
                              <span className={`px-3 py-1.5 text-[10px] rounded-lg font-bold uppercase tracking-widest border shadow-sm
                                ${ref.status === 'Selected' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 
                                  ref.status === 'Rejected' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 
                                  'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'}`}>
                                {ref.status}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-right">
                              {ref.status === "Pending" ? (
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => updateReferralStatus(ref.id, 'Selected')} className="bg-green-600/20 hover:bg-green-600 text-green-300 hover:text-white border border-green-500/30 px-3 py-1 rounded-md text-xs font-bold transition">Accept</button>
                                  <button onClick={() => updateReferralStatus(ref.id, 'Rejected')} className="bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 px-3 py-1 rounded-md text-xs font-bold transition">Reject</button>
                                </div>
                              ) : (
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Processed</span>
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

          </div>
        </div>
      </main>

    </div>
  );
}

export default AdminDashboard;