import { useEffect, useState } from "react";
import API from "../services/api";
import socket from "../socket";

function CommentSection({ resourceId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  // ── fetch comments ─────────────────────────────────────────
  const fetchComments = async () => {
    try {
      const res = await API.get(`/comments/${resourceId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [resourceId]);

  // ── real-time new comment listener ─────────────────────────
  useEffect(() => {
    socket.on("newComment", (data) => {
      if (data.resourceId == resourceId) {
        setComments(prev => [
          { name: data.name, comment: data.text },
          ...prev
        ]);
      }
    });
    return () => socket.off("newComment");
  }, [resourceId]);

  // ── post comment ───────────────────────────────────────────
  const handleComment = async () => {
    if (!text.trim() || posting) return;
    setPosting(true);
    try {
      await API.post(`/comments/${resourceId}`, { text });
      setText("");
    } catch (err) {
      console.error("Comment failed", err);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="mt-4 border-t pt-3">

      {/* INPUT */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Write a comment..."
          className="flex-1 p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleComment()}
        />
        <button
          onClick={handleComment}
          disabled={posting}
          className="bg-indigo-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-600 transition disabled:opacity-50"
        >
          {posting ? "..." : "Post"}
        </button>
      </div>

      {/* COMMENTS */}
      <div className="space-y-2">
        {comments.length === 0 ? (
          <p className="text-xs text-gray-400">No comments yet — be the first!</p>
        ) : (
          comments.map((c, i) => (
            <div key={i} className="bg-gray-50 px-3 py-2 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold text-indigo-600">{c.name}:</span>{" "}
                {c.comment}
              </p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default CommentSection;