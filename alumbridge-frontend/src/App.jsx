import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AlumniDashboard from "./pages/AlumniDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";

function App() {

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    document.body.classList.remove("student", "alumni", "admin");

    if (role) {
      document.body.classList.add(role);
    }
  }, [role]);

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={token ? <Navigate to={`/${role}-dashboard`} /> : <Login />}
        />

        {/* STUDENT */}
        <Route
          path="/student-dashboard"
          element={
            token && role === "student"
              ? <StudentDashboard />
              : <Navigate to="/" />
          }
        />

        {/* ALUMNI */}
        <Route
          path="/alumni-dashboard"
          element={
            token && role === "alumni"
              ? <AlumniDashboard />
              : <Navigate to="/" />
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin-dashboard"
          element={
            token && role === "admin"
              ? <AdminDashboard />
              : <Navigate to="/" />
          }
        />

        {/* PROFILE (ANY LOGGED USER) */}
        <Route
          path="/profile"
          element={
            token ? <Profile /> : <Navigate to="/" />
          }
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;