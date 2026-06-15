import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageLoadingSkeleton from "./MessageLoadingSkeleton";
import MessageInput from "./MessageInput";

function ChatContainer() {
  const { authUser } = useAuthStore();

  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
  } = useChatStore();

  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      getMessagesByUserId(selectedUser._id);
    }
  }, [selectedUser, getMessagesByUserId]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />

      <div className="flex-1 px-6 overflow-y-auto py-8">
        {isMessagesLoading ? (
          <MessageLoadingSkeleton />
        ) : messages.length > 0 ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${
                  msg.senderId === authUser._id
                    ? "chat-end"
                    : "chat-start"
                }`}
              >
                <div
                  className={`chat-bubble relative ${
                    msg.senderId === authUser._id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Shared"
                      className="rounded-lg max-w-[300px] max-h-[300px] object-cover"
                    />
                  )}

                  {msg.text && (
                    <p className="mt-2">{msg.text}</p>
                  )}

                  <p className="text-xs mt-1 opacity-75">
                    {new Date(
                      msg.createdAt
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            <div ref={messageEndRef} />
          </div>
        ) : (
          <NoChatHistoryPlaceholder
            name={selectedUser?.fullName}
          />
        )}
      </div>

      <MessageInput />
    </div>
  );
}

export default ChatContainer;