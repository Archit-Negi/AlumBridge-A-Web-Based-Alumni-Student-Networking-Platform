import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Profile() {
  const [user, setUser] = useState({});
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/profile");
      setUser(res.data.user);
      setResources(res.data.resources);
    } catch (error) {
      console.error("Profile fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">

        {loading ? (
          <p className="text-gray-400 animate-pulse text-center mt-20">Loading profile...</p>
        ) : (
          <>
            {/* ── User Card ── */}
            <div className="bg-white p-6 rounded-2xl shadow mb-6 flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-indigo-500 text-white flex items-center justify-center text-2xl font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {user.name}
                </h1>
                <p className="text-gray-500 capitalize">
                  Role: <span className="font-medium text-indigo-600">{user.role}</span>
                </p>
                <p className="text-yellow-600 font-semibold mt-1">
                  ⭐ {user.points ?? 0} Points
                </p>
              </div>
            </div>

            {/* ── Resources ── */}
            <h2 className="text-xl font-bold mb-4 text-gray-700">
              📢 Resources Posted ({resources.length})
            </h2>

            {resources.length === 0 ? (
              <p className="text-gray-400 text-sm">No resources posted yet.</p>
            ) : (
              resources.map((r) => (
                <div
                  key={r.id}
                  className="bg-white p-4 rounded-xl shadow mb-3 hover:shadow-md transition"
                >
                  <h3 className="font-bold text-indigo-700">{r.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{r.description}</p>
                  {r.link && (
                    <a href={r.link} target="_blank" rel="noreferrer"
                      className="text-blue-500 text-sm mt-1 inline-block hover:underline">
                      🔗 View Resource
                    </a>
                  )}
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;