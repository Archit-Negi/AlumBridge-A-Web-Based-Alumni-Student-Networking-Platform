import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ResourceFeed from "../components/ResourceFeed";

function StudentDashboard() {
  return (
    <div>
      <Navbar />

      <div className="grid grid-cols-4 gap-6 p-6">

        {/* LEFT SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT */}
        <div className="col-span-2 space-y-5">

          <div className="card">
            <h2 className="text-xl font-bold text-indigo-600">
              🎓 Student Dashboard
            </h2>
            <p className="text-gray-600">
              Explore resources, learn new skills, and grow your career 🚀
            </p>
          </div>

          <ResourceFeed />

        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-5">

          <div className="card">
            <h3 className="font-bold text-indigo-600">📊 Your Progress</h3>
            <p className="text-sm text-gray-500">Keep learning daily 💪</p>
          </div>

          <div className="card">
            <h3 className="font-bold text-indigo-600">🔥 Trending Skills</h3>
            <ul className="text-sm mt-2 space-y-1">
              <li>• React</li>
              <li>• Node.js</li>
              <li>• Data Science</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}

export default StudentDashboard;