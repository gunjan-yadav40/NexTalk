import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageLoadingSkeleton from "./MessageLoadingSkeleton";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";

function ChatContainer() {
  const { authUser } = useAuthStore();
  const { onlineUsers } = useAuthStore();
  const [hoveredMessage, setHoveredMessage] = useState(null);

  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessage,
    unsubscribeFromMessages,
  } = useChatStore();

  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      getMessagesByUserId(selectedUser._id);
      subscribeToMessage();
    }

    return () => unsubscribeFromMessages();
  }, [
    selectedUser,
    getMessagesByUserId,
    subscribeToMessage,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach((msg) => {
      const date = new Date(msg.createdAt).toLocaleDateString([], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  if (!selectedUser) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-950">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto px-4 py-6 messages-container">
        {isMessagesLoading ? (
          <MessageLoadingSkeleton />
        ) : messages.length > 0 ? (
          <div className="max-w-4xl mx-auto">
            {Object.entries(messageGroups).map(([date, dateMessages]) => (
              <div key={date}>
                {/* Date Divider */}
                <div className="flex justify-center my-6">
                  <div className="px-4 py-1.5 bg-slate-800/80 backdrop-blur-sm rounded-full text-xs text-slate-400 font-medium border border-slate-700/50">
                    {date}
                  </div>
                </div>

                {/* Messages for this date */}
                <div className="space-y-3">
                  {dateMessages.map((msg) => {
                    const isOwnMessage = msg.senderId === authUser?._id;
                    
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group`}
                        onMouseEnter={() => setHoveredMessage(msg._id)}
                        onMouseLeave={() => setHoveredMessage(null)}
                      >
                        {/* Avatar (only for received messages) */}
                        {!isOwnMessage && (
                          <div className="flex-shrink-0 mr-2 self-end mb-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                              <span className="text-white text-sm font-bold">
                                {selectedUser?.fullName?.charAt(0) || "?"}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div className={`max-w-[70%] ${isOwnMessage ? 'ml-auto' : ''}`}>
                          {/* Sender name */}
                          {!isOwnMessage && (
                            <p className="text-xs text-slate-400 mb-1 ml-2">
                              {selectedUser?.fullName}
                            </p>
                          )}

                          <div
                            className={`relative rounded-2xl px-4 py-2.5 shadow-lg transition-all duration-200 ${
                              isOwnMessage
                                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-br-none"
                                : "bg-slate-700 text-white rounded-bl-none"
                            } ${hoveredMessage === msg._id ? 'scale-[1.02]' : ''}`}
                          >
                            {/* Image message */}
                            {msg.image && (
                              <div className="mb-2 -mt-1">
                                <img
                                  src={msg.image}
                                  alt="Shared"
                                  className="rounded-lg max-w-[260px] max-h-[260px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => window.open(msg.image, '_blank')}
                                />
                              </div>
                            )}

                            {/* Text message */}
                            {msg.text && (
                              <p className="text-[15px] leading-relaxed break-words">
                                {msg.text}
                              </p>
                            )}

                            {/* Time & Status */}
                            <div className={`flex items-center justify-end gap-1 mt-1 ${
                              isOwnMessage ? 'text-cyan-100' : 'text-slate-300'
                            }`}>
                              <span className="text-[10px] font-medium opacity-80">
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              
                              {/* Seen/Read status */}
                              {isOwnMessage && (
                                <span className="text-[10px]">
                                  {msg.read ? "✓✓" : "✓"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Spacer for alignment */}
                        {isOwnMessage && <div className="w-8 flex-shrink-0 ml-2" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            
            <div ref={messageEndRef} />
          </div>
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser?.fullName} />
        )}
      </div>

      <MessageInput />
    </div>
  );
}

export default ChatContainer;