import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatList({ onSelectUser }) {
  const { 
    getMyChatPartners, 
    chats, 
    isUsersLoading, 
    setSelectedUser, 
    selectedUser 
  } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  // Handle user selection
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    if (onSelectUser) {
      onSelectUser(user);
    }
  };

  // Get last message for each chat
  const getLastMessage = (chat) => {
    if (chat.lastMessage) {
      return chat.lastMessage;
    }
    return null;
  };

  // Format last message time
  const formatMessageTime = (date) => {
    const now = new Date();
    const msgDate = new Date(date);
    const diffInHours = (now - msgDate) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return msgDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return msgDate.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle image error
  const handleImageError = (chatId) => {
    setImageErrors((prev) => ({ ...prev, [chatId]: true }));
  };

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <div className="space-y-1.5">
      {chats.map((chat) => {
        const lastMessage = getLastMessage(chat);
        const isActive = selectedUser?._id === chat._id;
        const isUserOnline = onlineUsers.includes(chat._id);
        const hasImageError = imageErrors[chat._id];

        return (
          <div
            key={chat._id}
            onClick={() => handleSelectUser(chat)}
            className={`
              group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer
              transition-all duration-300 ease-out
              ${isActive 
                ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border-l-4 border-cyan-500" 
                : "hover:bg-slate-800/50 active:scale-[0.98]"
              }
            `}
          >
            {/* Online Status Indicator - Visual */}
            <div className="relative flex-shrink-0">
              {/* Avatar Container */}
              <div className={`
                relative w-14 h-14 rounded-full overflow-hidden
                ${isActive ? "ring-2 ring-cyan-500/50 ring-offset-2 ring-offset-slate-900" : ""}
                transition-all duration-300 group-hover:scale-105
              `}>
                {chat.profilePic && !hasImageError ? (
                  <img
                    src={chat.profilePic}
                    alt={chat.fullName}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(chat._id)}
                  />
                ) : (
                  <div className={`
                    w-full h-full bg-gradient-to-br from-cyan-500 to-blue-500 
                    flex items-center justify-center
                    ${isActive ? "shadow-lg shadow-cyan-500/25" : ""}
                  `}>
                    <span className="text-white font-bold text-lg">
                      {getInitials(chat.fullName)}
                    </span>
                  </div>
                )}
              </div>

              {/* Online/Offline Status Dot */}
              <div className={`
                absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-slate-900
                transition-all duration-300
                ${isUserOnline 
                  ? "bg-green-500 animate-pulse" 
                  : "bg-gray-500"
                }
              `} />
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className={`
                  font-semibold truncate max-w-[140px]
                  ${isActive ? "text-white" : "text-slate-200 group-hover:text-white"}
                  transition-colors duration-200
                `}>
                  {chat.fullName}
                </h4>
                
                {lastMessage && (
                  <span className="text-xs text-slate-400 flex-shrink-0">
                    {formatMessageTime(lastMessage.createdAt)}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                {/* Last Message Preview */}
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  {lastMessage ? (
                    <>
                      {/* Unread indicator */}
                      {chat.unreadCount > 0 && (
                        <div className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" />
                      )}
                      
                      <p className={`
                        text-sm truncate
                        ${chat.unreadCount > 0 
                          ? "text-white font-medium" 
                          : "text-slate-400 group-hover:text-slate-300"
                        }
                        transition-colors duration-200
                      `}>
                        {lastMessage.image && !lastMessage.text && "📷 Photo"}
                        {lastMessage.text && (
                          lastMessage.text.length > 35 
                            ? lastMessage.text.slice(0, 35) + "..." 
                            : lastMessage.text
                        )}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-slate-500 italic">
                      No messages yet
                    </p>
                  )}
                </div>

                {/* Unread Count Badge */}
                {chat.unreadCount > 0 && (
                  <div className="flex-shrink-0 ml-2">
                    <div className="min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                      <span className="text-white text-xs font-bold">
                        {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChatList;