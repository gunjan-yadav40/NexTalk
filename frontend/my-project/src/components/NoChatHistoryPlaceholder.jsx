import { MessageCircleIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const NoChatHistoryPlaceholder = ({ name }) => {
  const { sendMessage, selectedUser } = useChatStore();

  const suggestedMessages = [
    { emoji: "👋", text: "Say Hello", message: "Hello! How are you?" },
    { emoji: "💬", text: "How are you?", message: "How are you doing today?" },
    { emoji: "📅", text: "Meet up soon?", message: "Would you like to meet up sometime?" },
  ];

  const handleSendSuggestion = (messageText) => {
    if (selectedUser) {
      sendMessage({ text: messageText, image: null });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 rounded-full flex items-center justify-center mb-5">
        <MessageCircleIcon className="size-8 text-cyan-400" />
      </div>

      <h3 className="text-lg font-medium text-slate-200 mb-3">
        Start your conversation with {name}
      </h3>

      <div className="flex flex-col space-y-3 max-w-md mb-5">
        <p className="text-slate-400 text-sm">
          This is the beginning of your conversation.
          Send a message to start chatting!
        </p>

        <div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mx-auto"></div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {suggestedMessages.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSendSuggestion(suggestion.message)}
            className="px-4 py-2 text-xs font-medium text-cyan-400 bg-cyan-500/10 rounded-full hover:bg-cyan-500/20 hover:scale-105 transition-all duration-200"
          >
            {suggestion.emoji} {suggestion.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NoChatHistoryPlaceholder;