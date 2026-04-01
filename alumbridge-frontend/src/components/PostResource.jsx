import { useState } from "react";
import API from "../services/api";

function PostResource({ refreshResources }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [posting, setPosting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', msg }

  const handlePost = async () => {
    if (!title.trim()) {
      setFeedback({ type: "error", msg: "Title is required" });
      return;
    }
    setPosting(true);
    setFeedback(null);
    try {
      await API.post("/resources", { title, description, link });
      setTitle("");
      setDescription("");
      setLink("");
      setFeedback({ type: "success", msg: "✅ Resource posted successfully!" });
      if (refreshResources) refreshResources();
    } catch (error) {
      const msg = error.response?.data?.message || "❌ Only Alumni can post resources";
      setFeedback({ type: "error", msg });
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="bg-white/10 border border-white/20 p-6 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] mb-6 text-white">
      <h2 className="text-xl font-bold mb-4 drop-shadow">📤 Share Resource</h2>

      <input
        type="text"
        placeholder="Title *"
        className="w-full p-3 mb-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:bg-white/10 focus:ring-2 focus:ring-purple-400 outline-none transition"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        rows={3}
        className="w-full p-3 mb-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:bg-white/10 focus:ring-2 focus:ring-purple-400 outline-none transition"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="text"
        placeholder="Resource Link (https://...)"
        className="w-full p-3 mb-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:bg-white/10 focus:ring-2 focus:ring-purple-400 outline-none transition"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />

      {feedback && (
        <p className={`text-sm mb-3 font-semibold text-center py-2 rounded-lg ${feedback.type === "success" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
          {feedback.msg}
        </p>
      )}

      <button
        onClick={handlePost}
        disabled={posting}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl hover:opacity-90 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {posting ? "Posting..." : "Post Resource"}
      </button>
    </div>
  );
}

export default PostResource;