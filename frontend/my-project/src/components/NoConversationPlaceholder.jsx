import { MessageCircleIcon } from "lucide-react";

const NoConversationPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-cyan-500/20">
        <MessageCircleIcon className="w-10 h-10 text-cyan-400" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">
        No conversation selected
      </h3>

      <p className="text-slate-400 text-sm max-w-md">
        Select a contact from the sidebar to start chatting
      </p>

      {/* Small hint */}
      <div className="mt-4 flex items-center gap-1 text-xs text-slate-500">
        <span>←</span>
        <span>Click on any name to start</span>
      </div>
    </div>
  );
};

export default NoConversationPlaceholder;