import React from 'react';
import { MessageCircleIcon, UsersIcon, ArrowRightIcon } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';

function NoChatsFound() {
  const { setActiveTab } = useChatStore();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      {/* Animated empty state icon */}
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-full flex items-center justify-center border border-slate-700/50">
          <MessageCircleIcon className="w-12 h-12 text-slate-500" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
          <UsersIcon className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">
        No conversations yet
      </h3>

      <p className="text-slate-400 text-sm max-w-xs mb-6">
        Your chats will appear here once you start messaging someone.
      </p>

      {/* Button to switch to Contacts tab */}
      <button
        onClick={() => setActiveTab("contacts")}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white text-sm font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:scale-105"
      >
        <UsersIcon className="w-4 h-4" />
        <span>Go to Contacts</span>
        <ArrowRightIcon className="w-4 h-4" />
      </button>

      <p className="text-xs text-slate-500 mt-6">
        Find friends and start chatting
      </p>
    </div>
  );
}

export default NoChatsFound;