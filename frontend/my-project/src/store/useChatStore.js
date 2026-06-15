import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

const notificationSound = new Audio("/sounds/notification.mp3");

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],

  activeTab: "chats",
  selectedUser: null,
  isUserTyping: false,

  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,

  isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",

  toggleSound: () => {
    const newState = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", newState);
    set({ isSoundEnabled: newState });
    toast.success(newState ? "Sound enabled 🔔" : "Sound disabled 🔕");
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSelectedUser: (selectedUser) => {
    console.log("📱 Selected user:", selectedUser?.fullName);
    set({ selectedUser });
  },

  getAllContacts: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/messages/chats");
      
      const enrichedChats = res.data.map(chat => ({
        ...chat,
        lastMessage: chat.lastMessage || null,
        unreadCount: chat.unreadCount || 0
      }));
      
      set({ chats: enrichedChats });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load chats");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
      
      await get().markMessagesAsRead(userId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();
    
    if (!selectedUser) {
      toast.error("No user selected");
      return;
    }
    
    set({ isSendingMessage: true });
    
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    // Optimistic update
    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      // Replace optimistic message with real one
      const updatedMessages = get().messages.map(msg =>
        msg._id === tempId ? res.data : msg
      );
      
      set({ messages: updatedMessages });
      await get().refreshChatList();
      
    } catch (error) {
      // Remove optimistic message on error
      const filteredMessages = get().messages.filter(msg => msg._id !== tempId);
      set({ messages: filteredMessages });
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      set({ isSendingMessage: false });
    }
  },
  
  markMessagesAsRead: async (userId) => {
    try {
      await axiosInstance.post(`/messages/mark-read/${userId}`);
      
      const updatedChats = get().chats.map(chat => {
        if (chat._id === userId) {
          return { ...chat, unreadCount: 0 };
        }
        return chat;
      });
      
      set({ chats: updatedChats });
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  },
  
  refreshChatList: async () => {
    try {
      const res = await axiosInstance.get("/messages/chats");
      const enrichedChats = res.data.map(chat => ({
        ...chat,
        lastMessage: chat.lastMessage || null,
        unreadCount: chat.unreadCount || 0
      }));
      set({ chats: enrichedChats });
    } catch (error) {
      console.error("Failed to refresh chats:", error);
    }
  },
  
  deleteMessage: async (messageId) => {
    const { messages } = get();
    const messageToDelete = messages.find(msg => msg._id === messageId);
    
    set({ messages: messages.filter(msg => msg._id !== messageId) });
    
    try {
      await axiosInstance.delete(`/messages/${messageId}`);
      toast.success("Message deleted");
    } catch (error) {
      await get().getMessagesByUserId(get().selectedUser?._id);
      toast.error("Failed to delete message");
    }
  },
  
  subscribeToMessage: () => {
    const { isSoundEnabled, refreshChatList } = get();
    const socket = useAuthStore.getState().socket;
    const { authUser } = useAuthStore.getState();

    if (!socket) {
      console.log("No socket connection");
      return;
    }

    socket.off("newMessage");

    socket.on("newMessage", async (newMessage) => {
      // Ignore own messages
      if (newMessage.senderId === authUser?._id) return;

      const currentSelectedUser = get().selectedUser;
      const isMessageFromSelectedUser = currentSelectedUser?._id === newMessage.senderId;
      
      // Update messages if chat is open
      if (isMessageFromSelectedUser) {
        const currentMessages = get().messages;
        const alreadyExists = currentMessages.some(msg => msg._id === newMessage._id);
        if (!alreadyExists) {
          set({ messages: [...currentMessages, newMessage] });
        }
      }
      
      // Play sound
      if (isSoundEnabled && notificationSound) {
        notificationSound.currentTime = 0;
        notificationSound.play().catch(e => console.log("Audio play failed:", e));
      }
      
      await refreshChatList();
      
      // Show notification
      if (!isMessageFromSelectedUser) {
        toast.success(`📩 New message from ${newMessage.senderName || "someone"}`);
      }
    });
  },
  
  subscribeToTyping: () => {
    const socket = useAuthStore.getState().socket;
    const { selectedUser } = get();
    
    if (!socket || !selectedUser) return;
    
    socket.off("typing");
    
    socket.on("typing", ({ userId, isTyping }) => {
      if (userId === selectedUser._id) {
        set({ isUserTyping: isTyping });
        
        // Auto clear after 2 seconds
        if (isTyping) {
          setTimeout(() => {
            const currentTyping = get().isUserTyping;
            if (currentTyping) {
              set({ isUserTyping: false });
            }
          }, 2000);
        }
      }
    });
  },
  
  sendTypingIndicator: (receiverId, isTyping) => {
    const socket = useAuthStore.getState().socket;
    const { authUser } = useAuthStore.getState();
    
    if (!socket || !authUser || !receiverId) return;
    
    socket.emit("typing", {
      senderId: authUser._id,
      receiverId: receiverId,
      isTyping,
    });
  },
  
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
      socket.off("typing");
    }
  },
  
  // Clear messages (useful for logout)
  clearMessages: () => set({ messages: [] }),
  
  // Clear selected user
  clearSelectedUser: () => set({ selectedUser: null }),
}));

export default useChatStore;