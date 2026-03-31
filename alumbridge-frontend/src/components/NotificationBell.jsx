import { useEffect, useState } from "react";
import API from "../services/api";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data);
    } catch {
      // Endpoint may not exist yet — silently skip
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unread = notifications.length;

  return (
    <div className="relative">
      <button
        onClick={() => setShow(!show)}
        className="relative text-xl"
      >
        🔔
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {show && (
        <div className="absolute right-0 mt-2 w-72 bg-white text-black rounded-xl shadow-xl p-3 z-50 border border-gray-100">
          <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Notifications</p>
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-400 py-2 text-center">No notifications yet 🎉</p>
          ) : (
            notifications.map((n, i) => (
              <p key={i} className="text-sm border-b py-2 last:border-0 text-gray-700">
                {n.message}
              </p>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;