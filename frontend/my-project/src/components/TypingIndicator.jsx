import { useAuthStore } from "../store/useAuthStore";

function TypingIndicator() {
  const { isUserTyping } = useAuthStore();

  if (!isUserTyping) return null;

  return (
    <div className="flex items-center gap-1 px-4 py-2">
      <div className="flex items-center gap-1 bg-slate-800/80 backdrop-blur-sm rounded-full px-3 py-1.5">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        <span className="text-xs text-slate-400 ml-1">typing...</span>
      </div>
    </div>
  );
}

export default TypingIndicator;