import { useEffect, useState } from "react";
import API from "../services/api";

const MEDALS = ["🥇", "🥈", "🥉"];

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users/leaderboard");
      // Sort descending by points as a safety net
      const sorted = [...res.data].sort((a, b) => b.points - a.points);
      setUsers(sorted);
    } catch (error) {
      console.error("Leaderboard error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 text-indigo-700">
        🏆 Alumni Leaderboard
      </h2>

      {loading ? (
        <p className="text-gray-400 text-sm animate-pulse">Loading rankings...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500 text-sm">No alumni data yet.</p>
      ) : (
        <div className="space-y-2">
          {users.map((u, index) => (
            <div
              key={u.id}
              className={`flex justify-between items-center px-3 py-2 rounded-lg border
                ${index === 0 ? "bg-yellow-50 border-yellow-300" :
                  index === 1 ? "bg-gray-50 border-gray-300" :
                  index === 2 ? "bg-orange-50 border-orange-200" :
                  "bg-white border-gray-100"}`}
            >
              <span className="font-medium text-gray-800">
                {MEDALS[index] ?? `${index + 1}.`} {u.name}
              </span>
              <span className="text-indigo-600 font-bold text-sm">
                {u.points} pts
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Leaderboard;