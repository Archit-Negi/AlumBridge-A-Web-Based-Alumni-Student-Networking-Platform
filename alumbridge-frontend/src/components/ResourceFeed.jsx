import { useEffect, useState } from "react";
import API from "../services/api";
import CommentSection from "./CommentSection";
import PostResource from "./PostResource";

function ResourceFeed({ setRefresh }) {

  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [likedIds, setLikedIds] = useState([]);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ================= FETCH =================
  const fetchResources = async () => {

    try {

      const res = await API.get("/resources", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setResources(res.data);

    } catch (error) {
      console.error("Fetch error", error);
    }

  };

  useEffect(() => {
  fetchResources();

  if (setRefresh) {
    setRefresh.current = fetchResources;
  }

}, []);

  // ================= LIKE / UNLIKE =================
  const handleLike = async (id) => {

    try {

      const res = await API.post(`/resources/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Toggle UI instantly
      setResources(prev =>
        prev.map(r => {
          if (r.id === id) {
            return {
              ...r,
              like_count:
                res.data.message === "Liked"
                  ? (r.like_count || 0) + 1
                  : (r.like_count || 1) - 1
            };
          }
          return r;
        })
      );

      // Track liked state
      if (res.data.message === "Liked") {
        setLikedIds(prev => [...prev, id]);
      } else {
        setLikedIds(prev => prev.filter(lid => lid !== id));
      }

    } catch (error) {
      console.error("Like error", error);
    }

  };

  // ================= DELETE RESOURCE =================
  const deleteResource = async (id) => {

    try {

      await API.delete(`/resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setResources(prev => prev.filter(r => r.id !== id));

    } catch (error) {
      console.error("Delete error", error);
    }

  };

  return (

    <div>

      <h2 className="text-2xl font-bold mb-4 text-indigo-700">
        📢 Resource Feed
      </h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="🔍 Search resources..."
        className="w-full p-3 mb-5 rounded-xl border focus:ring-2 focus:ring-indigo-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* RESOURCE LIST */}
      {resources
        .filter(r =>
          r.title.toLowerCase().includes(search.toLowerCase())
        )
        .map(r => (

        <div
          key={r.id}
          className="bg-white dark:bg-gray-800 p-5 mb-5 rounded-xl shadow hover:shadow-lg transition"
        >

          <h3 className="text-lg font-bold text-indigo-700">
            {r.title}
          </h3>

          <p className="text-gray-700 mt-2 dark:text-gray-300">
            {r.description}
          </p>

          <a
            href={r.link}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 block mt-2"
          >
            🔗 View Resource
          </a>

          <p className="text-sm text-gray-500 mt-2">
            Posted by {r.posted_by_name}
          </p>

          {/* ACTIONS */}
          <div className="flex items-center gap-3 mt-3">

            {/* LIKE BUTTON */}
            <button
              onClick={() => handleLike(r.id)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-lg hover:scale-105 transition"
            >
              {likedIds.includes(r.id) ? "👎 Unlike" : "👍 Like"}
            </button>

            {/* LIKE COUNT */}
            <span className="text-indigo-600 font-medium">
              {r.like_count || 0} Likes
            </span>

            {/* DELETE BUTTON */}
            {(role === "admin" || role === "alumni") && (
              <button
                onClick={() => deleteResource(r.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
              >
                🗑 Delete
              </button>
            )}

          </div>

          {/* COMMENTS */}
          <CommentSection resourceId={r.id} />

        </div>

      ))}

    </div>

  );

}

export default ResourceFeed;