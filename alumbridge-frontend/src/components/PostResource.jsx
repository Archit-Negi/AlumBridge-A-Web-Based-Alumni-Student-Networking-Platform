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
    <div className="card mb-6">
      <h2 className="text-lg font-bold mb-4">📤 Share Resource</h2>

      <input
        type="text"
        placeholder="Title *"
        className="w-full p-2 mb-2 rounded border focus:ring-2 focus:ring-green-300 outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        rows={3}
        className="w-full p-2 mb-2 rounded border focus:ring-2 focus:ring-green-300 outline-none"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="text"
        placeholder="Resource Link (https://...)"
        className="w-full p-2 mb-3 rounded border focus:ring-2 focus:ring-green-300 outline-none"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />

      {feedback && (
        <p className={`text-sm mb-3 ${feedback.type === "success" ? "text-green-600" : "text-red-500"}`}>
          {feedback.msg}
        </p>
      )}

      <button
        onClick={handlePost}
        disabled={posting}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {posting ? "Posting..." : "Post Resource"}
      </button>
    </div>
  );
}

export default PostResource;