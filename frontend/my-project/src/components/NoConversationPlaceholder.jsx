import { MessageCircle } from "lucide-react";

function NoConversationPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">
        <MessageCircle className="w-10 h-10 text-cyan-400" />
      </div>

      <h2 className="text-3xl font-bold text-white mb-2">
        Select a conversation
      </h2>

      <p className="text-slate-400 text-center max-w-md">
        Choose a contact from the sidebar to start chatting
        or continue a previous conversation.
      </p>
    </div>
  );
}

export default NoConversationPlaceholder;