import { useEffect, useState } from "react";
import { XIcon, MoreVerticalIcon, PhoneIcon, VideoIcon, InfoIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const isOnline = onlineUsers.includes(selectedUser?._id);

  // Handle ESC key to close chat
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setSelectedUser(null);
      }
    };

    window.addEventListener("keydown", handleEscKey);

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [setSelectedUser]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowMenu(false);
    if (showMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
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

  return (
    <div className="flex justify-between items-center bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-sm border-b border-slate-700/50 h-[72px] px-5 shadow-lg">
      <div className="flex items-center gap-4">
        {/* Avatar with Online Status Ring */}
        <div className="relative group">
          <div className={`relative ${isOnline ? "online-ring" : ""}`}>
            {selectedUser?.profilePic && !imageError ? (
              <img
                src={selectedUser.profilePic}
                alt={selectedUser?.fullName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-700/50 group-hover:ring-cyan-500/50 transition-all duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center ring-2 ring-slate-700/50 group-hover:ring-cyan-500/50 transition-all duration-300">
                <span className="text-white font-bold text-lg">
                  {getInitials()}
                </span>
              </div>
            )}
          </div>
          
          {/* Online/Offline Status Dot */}
          <div
            className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-800 transition-all duration-300 ${
              isOnline ? "bg-green-500 animate-pulse" : "bg-gray-500"
            }`}
          />
        </div>

        {/* User Info */}
        <div>
          <h3 className="text-white font-semibold text-lg leading-tight">
            {selectedUser?.fullName}
          </h3>
          
          <div className="flex items-center gap-1.5 mt-0.5">
            <div
              className={`w-2 h-2 rounded-full ${
                isOnline ? "bg-green-500" : "bg-gray-500"
              }`}
            />
            <p className="text-slate-400 text-sm font-medium">
              {isOnline ? "Online" : "Offline"}
              {!isOnline && selectedUser?.lastSeen && (
                <span className="text-slate-500 text-xs ml-1">
                  • Last seen {new Date(selectedUser.lastSeen).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        {/* Voice Call Button */}
        <button
          className="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/70 transition-all duration-200 group"
          title="Voice call"
          onClick={() => {
            // TODO: Implement voice call
            console.log("Voice call to:", selectedUser?.fullName);
          }}
        >
          <PhoneIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        {/* Video Call Button */}
        <button
          className="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/70 transition-all duration-200 group"
          title="Video call"
          onClick={() => {
            // TODO: Implement video call
            console.log("Video call to:", selectedUser?.fullName);
          }}
        >
          <VideoIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        {/* View Profile Button */}
        <button
          className="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/70 transition-all duration-200 group"
          title="View profile"
          onClick={() => {
            // TODO: Show profile modal
            console.log("View profile:", selectedUser?.fullName);
          }}
        >
          <InfoIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        {/* Close Chat Button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="p-2.5 rounded-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group ml-2"
          title="Close chat (ESC)"
        >
          <XIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;