import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="flex p-3 gap-2">
      <button
        onClick={() => setActiveTab("chats")}
        className={`flex-1 py-2 rounded-lg ${
          activeTab === "chats"
            ? "bg-cyan-500 text-white"
            : "bg-slate-800 text-slate-300"
        }`}
      >
        Chats
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`flex-1 py-2 rounded-lg ${
          activeTab === "contacts"
            ? "bg-cyan-500 text-white"
            : "bg-slate-800 text-slate-300"
        }`}
      >
        Contacts
      </button>
    </div>
  );
}

export default ActiveTabSwitch;