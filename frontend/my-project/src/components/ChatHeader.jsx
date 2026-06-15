import { useEffect, useState, useRef } from "react";
import { 
  XIcon, 
  ArrowLeftIcon, 
  PhoneIcon, 
  VideoIcon, 
  InfoIcon 
} from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [imageError, setImageError] = useState(false);
  const menuRef = useRef(null);
  
  const isOnline = onlineUsers?.includes(selectedUser?._id);

  // Handle ESC key to close chat
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setSelectedUser(null);
      }
    };
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMenu]);

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!selectedUser?.fullName) return "?";
    return selectedUser.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format last seen text
  const getLastSeenText = () => {
    if (isOnline) return "Online";
    if (!selectedUser?.lastSeen) return "Offline";
    
    const lastSeen = new Date(selectedUser.lastSeen);
    const now = new Date();
    const diffHours = (now - lastSeen) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return `Last seen today at ${lastSeen.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    } else if (diffHours < 48) {
      return "Last seen yesterday";
    } else {
      return `Last seen on ${lastSeen.toLocaleDateString()}`;
    }
  };

  if (!selectedUser) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/50 shadow-lg">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Back button for mobile */}
        <button
          onClick={() => setSelectedUser(null)}
          className="md:hidden p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>

        {/* Avatar with Online Status */}
        <div className="relative group cursor-pointer">
          <div className="relative">
            {selectedUser?.profilePic && !imageError ? (
              <img
                src={selectedUser.profilePic}
                alt={selectedUser.fullName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700/50 group-hover:ring-cyan-500/50 transition-all duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center ring-2 ring-slate-700/50 group-hover:ring-cyan-500/50 transition-all duration-300 shadow-md">
                <span className="text-white font-bold text-sm">
                  {getInitials()}
                </span>
              </div>
            )}
            
            {/* Online/Offline Status Dot */}
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-800 transition-all duration-300 ${
                isOnline ? "bg-green-500 animate-pulse" : "bg-gray-500"
              }`}
            />
          </div>
        </div>

        {/* User Info */}
        <div>
          <h3 className="text-white font-semibold text-base leading-tight">
            {selectedUser.fullName}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div
              className={`w-2 h-2 rounded-full ${
                isOnline ? "bg-green-500 animate-pulse" : "bg-gray-500"
              }`}
            />
            <p className="text-slate-400 text-xs font-medium">
              {getLastSeenText()}
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Action Buttons */}
      <div className="flex items-center gap-1">
        {/* Voice Call Button */}
        <button
          className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/70 transition-all duration-200 group"
          title="Voice call"
          onClick={() => console.log("Voice call to:", selectedUser?.fullName)}
        >
          <PhoneIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        {/* Video Call Button */}
        <button
          className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/70 transition-all duration-200 group"
          title="Video call"
          onClick={() => console.log("Video call to:", selectedUser?.fullName)}
        >
          <VideoIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        {/* View Profile Button with Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/70 transition-all duration-200 group"
            title="View profile"
            onClick={() => setShowMenu(!showMenu)}
          >
            <InfoIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {/* Profile Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 rounded-xl shadow-xl border border-slate-700/50 overflow-hidden z-50">
              <div className="p-4 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {getInitials()}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{selectedUser.fullName}</h4>
                    <p className="text-xs text-slate-400">
                      {isOnline ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                  View full profile
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                  Block user
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Close Chat Button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="p-2 rounded-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group ml-1"
          title="Close chat (ESC)"
        >
          <XIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;