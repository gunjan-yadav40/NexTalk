import { useChatStore } from "../store/useChatStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatList from "../components/ChatList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-6xl h-[800px] mx-auto">
        <BorderAnimatedContainer>
          <div className="flex h-full w-full">
            {/* LEFT SIDEBAR */}
            <div className="w-80 shrink-0 bg-slate-800/40 backdrop-blur-md border-r border-slate-700/50 flex flex-col">
              <ProfileHeader />

              <div className="p-4">
                <ActiveTabSwitch />
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-4">
                {activeTab === "chats" ? (
                  <ChatList />
                ) : (
                  <ContactList />
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