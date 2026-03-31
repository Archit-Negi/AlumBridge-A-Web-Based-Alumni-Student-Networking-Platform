import { useNavigate } from "react-router-dom";
import { useState } from "react";
import NotificationBell from "./NotificationBell";

function Navbar() {

  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  // 🎨 ROLE BASED COLOR
  const themeColor =
    role === "admin"
      ? "from-red-500 to-red-700"
      : role === "alumni"
      ? "from-purple-500 to-pink-500"
      : "from-indigo-500 to-blue-500";

  // 🎯 ROLE BASED ROUTE
  const dashboardRoute =
    role === "admin"
      ? "/admin-dashboard"
      : role === "alumni"
      ? "/alumni-dashboard"
      : "/student-dashboard";

  // 🏷️ ROLE BADGE STYLE
  const roleBadge =
    role === "admin"
      ? "bg-red-200 text-red-800"
      : role === "alumni"
      ? "bg-purple-200 text-purple-800"
      : "bg-blue-200 text-blue-800";

  const [dark, setDark] = useState(false);

  const toggleDark = () => {
    const html = document.documentElement;

    if (dark) {
      html.classList.remove("dark");
    } else {
      html.classList.add("dark");
    }

    setDark(!dark);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (

    <div className={`flex justify-between items-center px-8 py-4 bg-gradient-to-r ${themeColor} text-white shadow-lg`}>

      {/* LOGO */}
      <h1
        className="text-2xl font-bold cursor-pointer hover:scale-105 transition"
        onClick={() => navigate(dashboardRoute)}
      >
        AlumBridge 🚀
      </h1>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        {/* USER + ROLE */}
        <div className="hidden md:flex items-center gap-2">
          <span className="font-medium">
            {name}
          </span>

          {/* ROLE BADGE */}
          <span className={`px-2 py-1 text-xs rounded-full font-semibold ${roleBadge}`}>
            {role}
          </span>
        </div>

        {/* 🔔 NOTIFICATIONS */}
        <NotificationBell />

        {/* 🌙 DARK MODE */}
        <button
          onClick={toggleDark}
          className="bg-black/30 px-3 py-1 rounded hover:bg-black/50 transition"
        >
          🌙
        </button>

        {/* 👤 PROFILE */}
        <button
          onClick={() => navigate("/profile")}
          className="bg-white text-black px-4 py-1 rounded-lg hover:bg-gray-200 transition"
        >
          Profile
        </button>

        {/* 🚪 LOGOUT */}
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-1 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>

      </div>

    </div>

  );

}

export default Navbar;