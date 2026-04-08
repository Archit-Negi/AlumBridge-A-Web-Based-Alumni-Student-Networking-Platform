import { useState, useEffect } from "react";
import API from "../services/api";

function Network() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingRequests();
    fetchConnections();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const res = await API.get("/network/requests");
      setPendingRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests", err);
    }
  };

  const fetchConnections = async () => {
    try {
      const res = await API.get("/network/connections");
      setConnections(res.data);
    } catch (err) {
      console.error("Error fetching connections", err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await API.get(`/network/search?query=${searchQuery}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error("Error searching users", err);
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (receiverId) => {
    try {
      await API.post("/network/request", { receiverId });
      setSearchResults(searchResults.filter((u) => u.id !== receiverId));
      alert("Connection request sent!");
    } catch (err) {
      console.error("Error sending request", err);
    }
  };

  const respondToRequest = async (connectionId, status) => {
    try {
      await API.put("/network/respond", { connectionId, status });
      fetchPendingRequests();
      if (status === "accepted") fetchConnections();
    } catch (err) {
      console.error("Error responding to request", err);
    }
  };

  return (
    <div className="space-y-10">
      
      {/* ── SEARCH SECTION ── */}
      <section className="bg-white/5 border border-white/10 p-6 rounded-3xl shadow-xl">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-indigo-400">🔍</span> Find Connections
        </h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name or role (alumni/student)..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500 transition-all font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 px-6 py-2 rounded-xl font-bold transition-all shadow-lg"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {searchResults.map((user) => (
              <div key={user.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white">{user.name}</h3>
                  <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest">{user.role}</p>
                </div>
                <button
                  onClick={() => sendRequest(user.id)}
                  className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500 hover:text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
                >
                  Connect
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── PENDING REQUESTS ── */}
      {pendingRequests.length > 0 && (
        <section className="bg-white/5 border border-white/10 p-6 rounded-3xl shadow-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-yellow-400">⏳</span> Pending Requests
          </h2>
          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div key={req.connectionId} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white">{req.name}</h3>
                  <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest">{req.role}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => respondToRequest(req.connectionId, "accepted")}
                    className="bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500 hover:text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => respondToRequest(req.connectionId, "rejected")}
                    className="bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── MY NETWORK ── */}
      <section className="bg-white/5 border border-white/10 p-6 rounded-3xl shadow-xl">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-green-400">👥</span> Your Network
        </h2>
        {connections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connections.map((user) => (
              <div key={user.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl -mr-8 -mt-8 group-hover:bg-indigo-500/20 transition-all"></div>
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-black flex items-center justify-center text-lg mx-auto mb-3">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-bold text-white">{user.name}</h3>
                <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mb-2">{user.role}</p>
                <div className="flex items-center justify-center gap-1 text-xs font-bold text-gray-400">
                  <span className="text-indigo-400">★</span> {user.points || 0} pts
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-10 font-medium">You haven't connected with anyone yet. Start searching above!</p>
        )}
      </section>

    </div>
  );
}

export default Network;
