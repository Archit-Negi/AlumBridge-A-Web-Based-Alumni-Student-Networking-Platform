import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ResourceFeed from "../components/ResourceFeed";
import PostResource from "../components/PostResource";
import { useRef } from "react";

function AlumniDashboard() {

  const feedRef = useRef();

  const refreshFeed = () => {
    if (feedRef.current) {
      feedRef.current();
    }
  };

  return (

    <div className="min-h-screen animated-bg relative overflow-hidden">

      {/* BLOBS */}
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>

      <Navbar />

      <div className="grid grid-cols-4 gap-6 p-6">

        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN */}
        <div className="col-span-2 space-y-5">

          <div className="card">
            <h2 className="text-xl font-bold text-purple-600">
              💼 Alumni Dashboard
            </h2>
            <p className="text-gray-600">
              Share knowledge and guide students 🌟
            </p>
          </div>

          {/* ✅ ONLY ONE PLACE */}
          <PostResource refreshResources={refreshFeed} />

          {/* FEED */}
          <ResourceFeed setRefresh={feedRef} />

        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-5">

          <div className="card">
            <h3 className="font-bold text-purple-600">🏆 Your Impact</h3>
            <p className="text-sm text-gray-500">
              You are helping students grow 💜
            </p>
          </div>

          <div className="card">
            <h3 className="font-bold text-purple-600">📈 Contributions</h3>
            <p className="text-sm">Resources Shared: ⭐</p>
          </div>

        </div>

      </div>

    </div>

  );
}

export default AlumniDashboard;