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

  setSelectedUser: (selectedUser) => set({ selectedUser }),

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
      
      // Transform chats to include last message and unread count
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
      
      // Mark messages as read when opening chat
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
    
    set({ isSendingMessage: true });
    
    const tempId = `temp-${Date.now()}`;
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
      
      // Update chat list with new last message
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
  
  // Mark messages as read
  markMessagesAsRead: async (userId) => {
    try {
      await axiosInstance.post(`/messages/mark-read/${userId}`);
      
      // Update unread count in chats
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
  
  // Refresh chat list (call after sending/receiving messages)
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
  
  // Delete message (optional feature)
  deleteMessage: async (messageId) => {
    const { messages } = get();
    
    // Optimistic update
    set({ messages: messages.filter(msg => msg._id !== messageId) });
    
    try {
      await axiosInstance.delete(`/messages/${messageId}`);
      toast.success("Message deleted");
    } catch (error) {
      // Restore message on error
      await get().getMessagesByUserId(get().selectedUser?._id);
      toast.error("Failed to delete message");
    }
  },
  
  // Subscribe to new messages
  subscribeToMessage: () => {
    const { selectedUser, isSoundEnabled, refreshChatList } = get();
    const socket = useAuthStore.getState().socket;

    if (!socket) return;

    socket.on("newMessage", async (newMessage) => {
      const currentSelectedUser = get().selectedUser;
      const isMessageFromSelectedUser = currentSelectedUser?._id === newMessage.senderId;
      
      // Update messages if chat is open
      if (isMessageFromSelectedUser) {
        const currentMessages = get().messages;
        set({ messages: [...currentMessages, newMessage] });
      }
      
      // Play notification sound
      if (isSoundEnabled && notificationSound && !isMessageFromSelectedUser) {
        notificationSound.currentTime = 0;
        notificationSound.play().catch(e => console.log("Audio play failed:", e));
      }
      
      // Refresh chat list to update last message and unread count
      await refreshChatList();
      
      // Show toast notification for new message from other user
      if (!isMessageFromSelectedUser) {
        toast.success(`New message from ${newMessage.senderName || "someone"}`);
      }
    });
  },
  
  // Subscribe to typing indicators
  subscribeToTyping: () => {
    const socket = useAuthStore.getState().socket;
    const { selectedUser } = get();
    
    if (!socket || !selectedUser) return;
    
    socket.on("typing", ({ userId, isTyping }) => {
      if (userId === selectedUser._id) {
        set({ isUserTyping: isTyping });
      }
    });
  },
  
  // Send typing indicator
  sendTypingIndicator: (isTyping) => {
    const socket = useAuthStore.getState().socket;
    const { selectedUser } = get();
    
    if (!socket || !selectedUser) return;
    
    socket.emit("typing", {
      receiverId: selectedUser._id,
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
}));

export default useChatStore;