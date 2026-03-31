import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ResourceFeed from "../components/ResourceFeed";
import PostResource from "../components/PostResource";

// ── Icons
const ICONS = {
  dashboard: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
  ),
  network: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
  ),
  messages: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
  ),
  resources: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
  ),
  logout: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
  )
};

function AlumniDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("dashboard");
  const feedRef = useRef();

  const name = localStorage.getItem("name") || "Alumni";
  const points = localStorage.getItem("points") || 0;
  const role = localStorage.getItem("role") || "alumni";

  const refreshFeed = () => {
    if (feedRef.current) feedRef.current();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const navLinks = [
    { id: "dashboard", label: "Dashboard", icon: ICONS.dashboard },
    { id: "network", label: "Network", icon: ICONS.network },
    { id: "messages", label: "Messages", icon: ICONS.messages },
    { id: "resources", label: "Resources", icon: ICONS.resources },
  ];

  return (
    <div className="relative flex h-screen w-full overflow-hidden text-white font-sans">
      
      {/* ── BACKGROUND VIDEO ── */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://videos.pexels.com/video-files/3129957/3129957-hd_1920_1080_25fps.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      
      {/* ── STRONG DARK OVERLAY ── */}
      <div className="absolute inset-0 z-10 bg-black/70 backdrop-blur-sm" />

      {/* ── Fixed Left Sidebar 100vh ── */}
      <aside className="relative z-20 w-72 bg-white/5 border-r border-white/10 flex flex-col shadow-2xl backdrop-blur-md flex-shrink-0">
        
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-white/10 shrink-0">
          <h1 className="text-xl font-black text-white tracking-wide flex items-center gap-3">
            <span className="bg-purple-500/20 border border-purple-400/30 text-purple-300 rounded-xl p-1.5 shadow-md flex items-center justify-center text-lg">🚀</span>
            AlumBridge
          </h1>
        </div>

        {/* Scrollable Nav & Stats inside sidebar */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8 custom-scrollbar">
          
          {/* Main Navigation */}
          <nav className="space-y-1.5">
            <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Main Menu</p>
            {navLinks.map((link) => {
              const isActive = tab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setTab(link.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${
                    isActive 
                      ? "bg-purple-500/20 border border-purple-500/30 text-purple-300 shadow-lg" 
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className={`${isActive ? "text-purple-400" : "text-gray-400 group-hover:text-white"}`}>
                    {link.icon}
                  </span>
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Quick Stats Section */}
          <div className="space-y-4 px-1">
            <p className="px-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Impact Stats</p>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <h3 className="font-bold text-purple-300 text-sm mb-1">Your Reputation</h3>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-2xl font-black">{points}</span>
                <span className="text-xs text-gray-400 font-medium mb-1 uppercase">pts</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 font-medium tracking-wide">You are helping students grow 💜</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <h3 className="font-bold text-purple-300 text-sm mb-3">Top Contributions</h3>
              <ul className="space-y-2 text-xs font-medium text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Shared Resources
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Career Mentorship
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Technical Guidance
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Profile / Logout */}
        <div className="p-5 border-t border-white/10 shrink-0 bg-black/20">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mb-4 border border-white/10 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 font-black flex items-center justify-center text-lg">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-bold text-white truncate">{name}</p>
              <p className="text-[10px] font-bold text-purple-300 uppercase letter-spacing-wide tracking-widest">{role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 font-bold rounded-xl hover:bg-red-500/10 hover:text-red-300 border border-transparent hover:border-red-500/20 transition-all duration-200"
          >
            {ICONS.logout}
            Logout
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
            <span className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              Live Sync
            </span>
          </div>
        </header>

        {/* Page Content Scrolling Wrapper */}
        <div className="flex-1 overflow-y-auto px-6 md:px-10 py-10">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {tab === "dashboard" || tab === "resources" ? (
              <>
                {/* Header Welcome */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-20"></div>
                  <div className="relative z-10">
                    <h1 className="text-3xl font-black text-white tracking-tighter drop-shadow-md">
                      Share Knowledge, {name}.
                    </h1>
                    <p className="text-gray-300 mt-2 text-sm font-medium leading-relaxed max-w-lg">
                      Guide the next generation of students. Post resources, mentor juniors, and expand your professional network natively here.
                    </p>
                  </div>
                </div>

                {/* Resource Posting Utility */}
                <PostResource refreshResources={refreshFeed} />

                {/* Main Feed Activity */}
                <ResourceFeed setRefresh={feedRef} />
              </>
            ) : (
              <div className="bg-white/5 border border-white/10 p-16 rounded-3xl backdrop-blur-md text-center shadow-2xl">
                <span className="text-6xl mb-4 block">🚧</span>
                <h2 className="text-2xl font-black text-white mb-2">Module Under Construction</h2>
                <p className="text-gray-400 text-sm font-medium">The {tab} features are currently being built.</p>
              </div>
            )}

          </div>
        </div>
      </main>

    </div>
  );
}

export default AlumniDashboard;