import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList({ onSelectUser }) {
  const {
    getAllContacts,
    allContacts,
    setSelectedUser,
    isUsersLoading,
    selectedUser,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [imageErrors, setImageErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  // Handle user selection
  const handleSelectUser = (contact) => {
    setSelectedUser(contact);
    if (onSelectUser) {
      onSelectUser(contact);
    }
  };

  // Filter contacts based on search
  const filteredContacts = allContacts.filter((contact) =>
    contact.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle image error
  const handleImageError = (contactId) => {
    setImageErrors((prev) => ({ ...prev, [contactId]: true }));
  };

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-3 border-b border-slate-700/50">
        <div className="relative">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 pl-10 pr-4 text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-slate-400 font-medium">No contacts found</p>
            <p className="text-slate-500 text-sm mt-1">
              {searchTerm ? `No results for "${searchTerm}"` : "Add some friends to start chatting"}
            </p>
          </div>
        ) : (
          filteredContacts.map((contact) => {
            const isActive = selectedUser?._id === contact._id;
            const isUserOnline = onlineUsers.includes(contact._id);
            const hasImageError = imageErrors[contact._id];

            return (
              <div
                key={contact._id}
                onClick={() => handleSelectUser(contact)}
                className={`
                  group flex items-center gap-3 p-3 rounded-xl cursor-pointer
                  transition-all duration-300 ease-out
                  ${isActive 
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border-l-4 border-cyan-500 shadow-lg" 
                    : "hover:bg-slate-800/50 active:scale-[0.98]"
                  }
                `}
              >
                {/* Avatar with Online Status */}
                <div className="relative flex-shrink-0">
                  <div className={`
                    relative w-12 h-12 rounded-full overflow-hidden
                    ${isActive ? "ring-2 ring-cyan-500/50 ring-offset-2 ring-offset-slate-900" : ""}
                    transition-all duration-300 group-hover:scale-105
                  `}>
                    {contact.profilePic && !hasImageError ? (
                      <img
                        src={contact.profilePic}
                        alt={contact.fullName}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(contact._id)}
                      />
                    ) : (
                      <div className={`
                        w-full h-full bg-gradient-to-br from-cyan-500 to-blue-500 
                        flex items-center justify-center
                        ${isActive ? "shadow-lg shadow-cyan-500/25" : ""}
                      `}>
                        <span className="text-white font-bold text-base">
                          {getInitials(contact.fullName)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Online/Offline Status Dot */}
                  <div className={`
                    absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900
                    transition-all duration-300
                    ${isUserOnline 
                      ? "bg-green-500 animate-pulse" 
                      : "bg-gray-500"
                    }
                  `} />
                </div>

                {/* Contact Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`
                      font-semibold truncate
                      ${isActive ? "text-white" : "text-slate-200 group-hover:text-white"}
                      transition-colors duration-200
                    `}>
                      {contact.fullName}
                    </h4>
                    
                    {isUserOnline && (
                      <span className="text-xs text-green-400 flex-shrink-0 ml-2">
                        Online
                      </span>
                    )}
                  </div>
                  
                  {/* Optional: Show user bio or status */}
                  {contact.bio && (
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {contact.bio.length > 30 ? contact.bio.slice(0, 30) + "..." : contact.bio}
                    </p>
                  )}
                  
                  {!contact.bio && (
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {isUserOnline ? "Available" : "Offline"}
                    </p>
                  )}
                </div>

                {/* Start Chat Button (on hover) */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Contact Count Footer */}
      {filteredContacts.length > 0 && (
        <div className="p-3 border-t border-slate-700/50 bg-slate-800/20">
          <p className="text-xs text-slate-500 text-center">
            {filteredContacts.length} contact{filteredContacts.length !== 1 ? "s" : ""}
            {searchTerm && ` • filtered from ${allContacts.length}`}
          </p>
        </div>
      )}
    </div>
  );
}

export default ContactList;