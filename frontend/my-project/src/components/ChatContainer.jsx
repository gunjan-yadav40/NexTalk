import { useEffect, useRef, useState, useCallback } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageLoadingSkeleton from "./MessageLoadingSkeleton";
import MessageInput from "./MessageInput";

function ChatContainer() {
  const { authUser } = useAuthStore();
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessage,
    unsubscribeFromMessages,
  } = useChatStore();

  const messageEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Fetch messages and subscribe
  useEffect(() => {
    if (selectedUser) {
      getMessagesByUserId(selectedUser._id);
      subscribeToMessage();
    }

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Track scroll position
  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    const today = new Date();
    const msgDate = new Date(date);
    
    if (msgDate.toDateString() === today.toDateString()) {
      return "Today";
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (msgDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    
    return msgDate.toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach((msg) => {
      const date = new Date(msg.createdAt).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  if (!selectedUser) return null;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-950">
      

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 messages-container"
      >
        {isMessagesLoading ? (
          <MessageLoadingSkeleton />
        ) : messages.length === 0 ? (
          <NoChatHistoryPlaceholder name={selectedUser?.fullName} />
        ) : (
          <div className="flex flex-col max-w-4xl mx-auto">
            {Object.entries(messageGroups).map(([date, dateMessages]) => (
              <div key={date}>
                {/* Date Divider */}
                <div className="flex justify-center my-6">
                  <div className="px-4 py-1.5 bg-slate-800/80 backdrop-blur-sm rounded-full text-xs text-slate-400 font-medium border border-slate-700/50">
                    {formatDate(dateMessages[0].createdAt)}
                  </div>
                </div>

                {/* Messages */}
                {dateMessages.map((msg) => {
                  const isOwnMessage = msg.senderId === authUser?._id;
                  
                  return (
                    <div
                      key={msg._id}
                      className={`flex mb-3 ${isOwnMessage ? "justify-end" : "justify-start"}`}
                      onMouseEnter={() => setHoveredMessage(msg._id)}
                      onMouseLeave={() => setHoveredMessage(null)}
                    >
                      {/* Avatar (only for received messages) */}
                      {!isOwnMessage && (
                        <div className="flex-shrink-0 mr-2 self-end mb-1">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-md">
                            <span className="text-white text-xs font-bold">
                              {selectedUser?.fullName?.charAt(0) || "?"}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Message Content - NO SENDER NAME TEXT (removed duplicate) */}
                      <div className={`max-w-[75%] ${isOwnMessage ? "ml-auto" : ""}`}>
                        {/* Message Bubble */}
                        <div
                          className={`relative rounded-2xl px-4 py-2.5 shadow-md transition-all duration-200 ${
                            isOwnMessage
                              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-br-md"
                              : "bg-slate-800/90 backdrop-blur-sm text-white rounded-bl-md border border-slate-700/50"
                          } ${hoveredMessage === msg._id ? "scale-[1.01] shadow-lg" : ""}`}
                        >
                          {/* Image Message */}
                          {msg.image && (
                            <div className="mb-2 -mt-1">
                              <img
                                src={msg.image}
                                alt="Shared"
                                className="rounded-lg max-w-[200px] max-h-[200px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => window.open(msg.image, "_blank")}
                              />
                            </div>
                          )}

                          {/* Text Message */}
                          {msg.text && (
                            <p className="text-sm leading-relaxed break-words">
                              {msg.text}
                            </p>
                          )}

                          {/* Time & Status */}
                          <div className={`flex items-center justify-end gap-1 mt-1.5 ${
                            isOwnMessage ? "text-cyan-100" : "text-slate-400"
                          }`}>
                            <span className="text-[10px] font-medium opacity-80">
                              {formatTime(msg.createdAt)}
                            </span>
                            {isOwnMessage && (
                              <span className="text-[10px]">
                                {msg.read ? "✓✓" : "✓"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Spacer for alignment */}
                      {isOwnMessage && <div className="w-8 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>
            ))}
            
            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && messages.length > 0 && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-6 z-10 p-2 bg-cyan-500 rounded-full shadow-lg hover:bg-cyan-600 transition-all duration-200 hover:scale-110"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}

      <MessageInput />
    </div>
  );
}

export default ChatContainer;