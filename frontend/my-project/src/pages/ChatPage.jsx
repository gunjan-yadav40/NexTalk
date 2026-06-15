import { useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ChatList from "../components/ChatList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import { ArrowLeftIcon } from "lucide-react";

function ChatPage() {
  const { activeTab, setActiveTab, selectedUser, setSelectedUser } = useChatStore();
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleBackToList = () => {
    setSelectedUser(null);
  };

  // MOBILE VIEW
  if (isMobile) {
    // If a chat is selected, show ONLY the chat (full screen)
    if (selectedUser) {
      return (
        <div className="flex flex-col h-screen bg-slate-900">
          {/* Mobile Chat Header with Back Button */}
          <div className="flex items-center gap-3 p-3 bg-slate-800 border-b border-slate-700">
            <button
              onClick={handleBackToList}
              className="p-2 rounded-full bg-slate-700 text-slate-300 hover:text-white"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {selectedUser.fullName?.charAt(0) || "?"}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold">{selectedUser.fullName}</h3>
              </div>
            </div>
          </div>
          <ChatContainer />
        </div>
      );
    }

    // No chat selected - show the sidebar (contacts/chats list)
    return (
      <div className="flex flex-col h-screen bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <h2 className="text-white font-semibold text-lg">NextTalk</h2>
          </div>
        </div>

        {/* Profile Header */}
        <ProfileHeader />

        {/* Tab Buttons */}
        <div className="flex gap-2 p-4 border-b border-slate-700/50">
          <button
            onClick={() => setActiveTab("chats")}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              activeTab === "chats"
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                : "bg-slate-800/50 text-slate-400 hover:text-white"
            }`}
          >
            Chats
          </button>
          <button
            onClick={() => setActiveTab("contacts")}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              activeTab === "contacts"
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                : "bg-slate-800/50 text-slate-400 hover:text-white"
            }`}
          >
            Contacts
          </button>
        </div>

        {/* Chat/Contact List */}
        <div className="flex-1 overflow-y-auto p-3">
          {activeTab === "chats" ? (
            <ChatList onSelectUser={handleSelectUser} />
          ) : (
            <ContactList onSelectUser={handleSelectUser} />
          )}
        </div>
      </div>
    );
  }

  // DESKTOP VIEW - Show sidebar + chat side by side
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-8 bg-slate-950">
      <div className="w-full max-w-6xl h-[800px] mx-auto">
        <BorderAnimatedContainer>
          <div className="flex h-full w-full">
            {/* LEFT SIDEBAR */}
            <div className="w-80 shrink-0 bg-slate-800/40 backdrop-blur-md border-r border-slate-700/50 flex flex-col">
              <ProfileHeader />

              <div className="flex gap-2 p-4 border-b border-slate-700/50">
                <button
                  onClick={() => setActiveTab("chats")}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    activeTab === "chats"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                      : "bg-slate-800/50 text-slate-400 hover:text-white"
                  }`}
                >
                  Chats
                </button>
                <button
                  onClick={() => setActiveTab("contacts")}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    activeTab === "contacts"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                      : "bg-slate-800/50 text-slate-400 hover:text-white"
                  }`}
                >
                  Contacts
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                {activeTab === "chats" ? (
                  <ChatList onSelectUser={handleSelectUser} />
                ) : (
                  <ContactList onSelectUser={handleSelectUser} />
                )}
              </div>
            </div>

            {/* RIGHT CHAT AREA */}
            <div className="flex-1 min-w-0 bg-slate-900/30 backdrop-blur-md flex flex-col">
              {selectedUser ? (
                <ChatContainer />
              ) : (
                <NoConversationPlaceholder />
              )}
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}

export default ChatPage;