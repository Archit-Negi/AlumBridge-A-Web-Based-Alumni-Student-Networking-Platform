import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  const userId = localStorage.getItem("userId");
  const activeChatRef = useRef(activeChat);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  useEffect(() => {
    // Initialize Socket once
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
      socketRef.current.emit("join_room", userId);
    });

    socketRef.current.on("receive_message", (message) => {
      // Use ref to get current active chat without re-running effect
      const currentActive = activeChatRef.current;
      if (currentActive && (message.sender_id == currentActive.id || message.receiver_id == currentActive.id)) {
        setMessages((prev) => [...prev, message]);
      }
      fetchConversations();
    });

    socketRef.current.on("message_sent", (message) => {
      const currentActive = activeChatRef.current;
      if (currentActive && (message.sender_id == currentActive.id || message.receiver_id == currentActive.id)) {
        setMessages((prev) => [...prev, message]);
      }
    });

    fetchConversations();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []); // Only run once on mount

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      // We'll fetch connections as possible chat partners
      const res = await API.get("/network/connections");
      setConversations(res.data);
    } catch (err) {
      console.error("Error fetching conversations", err);
    }
  };

  const fetchHistory = async (otherUser) => {
    setActiveChat(otherUser);
    try {
      const res = await API.get(`/messages/${otherUser.id}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching history", err);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    socketRef.current.emit("send_message", {
      senderId: userId,
      receiverId: activeChat.id,
      content: newMessage,
    });

    setNewMessage("");
  };

  return (
    <div className="flex h-[600px] bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
      
      {/* ── Sidebar: Conversations ── */}
      <aside className="w-80 border-r border-white/10 flex flex-col bg-black/20">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-indigo-400">💬</span> Messages
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {conversations.length > 0 ? (
            conversations.map((user) => (
              <button
                key={user.id}
                onClick={() => fetchHistory(user)}
                className={`w-full flex items-center gap-4 px-6 py-4 transition-all hover:bg-white/5 ${
                  activeChat?.id === user.id ? "bg-indigo-500/10 border-r-2 border-indigo-500" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-bold flex items-center justify-center shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left min-w-0">
                  <p className="text-sm font-bold text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">{user.role}</p>
                </div>
              </button>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500 text-sm font-medium">
              No connections found. Connect with alumni or students to start chatting!
            </div>
          )}
        </div>
      </aside>

      {/* ── Main: Chat Window ── */}
      <main className="flex-1 flex flex-col bg-black/10">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <header className="px-8 py-4 border-b border-white/10 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-bold flex items-center justify-center text-sm">
                  {activeChat.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-white leading-none">{activeChat.name}</h3>
                  <p className="text-[10px] text-green-400 font-bold uppercase mt-1">Online</p>
                </div>
              </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
              {messages.map((msg, index) => {
                const isMine = msg.sender_id == userId;
                return (
                  <div key={index} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm font-medium shadow-md ${
                        isMine
                          ? "bg-indigo-600 text-white rounded-tr-none"
                          : "bg-white/10 text-gray-200 border border-white/10 rounded-tl-none"
                      }`}
                    >
                      {msg.content}
                      <p className={`text-[9px] mt-1 opacity-50 ${isMine ? "text-right" : "text-left"}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/10 bg-black/20">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-3 focus:outline-none focus:border-indigo-500 transition-all font-medium"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-indigo-500 hover:bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-indigo-500/20"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">👋</span>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Your Inbox</h2>
            <p className="text-gray-400 max-w-sm font-medium">
              Select a connection from the left to start a real-time conversation.
            </p>
          </div>
        )}
      </main>

    </div>
  );
}

export default Messages;
