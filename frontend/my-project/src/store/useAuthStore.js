import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLogginIn: false,
  isUpdatingProfile: false,

  socket: null,
  onlineUsers: [],
  isUserTyping: false,
  typingTimeout: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in authCheck:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });

    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      get().connectSocket();
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLogginIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      get().connectSocket();
      toast.success("Logged In successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLogginIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      get().disconnectSocket();
      set({
        authUser: null,
        onlineUsers: [],
        isUserTyping: false,
      });
      toast.success("Logged out successfully");
    } catch (error) {
      console.log("Logout error:", error);
      toast.error("Error logging out");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Send typing indicator to another user
  sendTypingIndicator: (receiverId, isTyping) => {
    const { socket, authUser } = get();
    
    if (!socket || !authUser || !receiverId) return;
    
    // Clear previous timeout
    const { typingTimeout } = get();
    if (typingTimeout) clearTimeout(typingTimeout);
    
    // Emit typing event
    socket.emit("typing", {
      senderId: authUser._id,
      receiverId: receiverId,
      isTyping: isTyping,
    });
    
    // Auto-stop typing after 2 seconds of no activity
    if (isTyping) {
      const timeout = setTimeout(() => {
        get().sendTypingIndicator(receiverId, false);
      }, 2000);
      
      set({ typingTimeout: timeout });
    }
  },

  connectSocket: () => {
    const { authUser } = get();

    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"], // Better fallback
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.log("Socket error:", error.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    // Listen for online users
    socket.on("onlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    // Listen for typing indicators
    socket.on("typing", ({ senderId, isTyping }) => {
      const { selectedUser } = useChatStore.getState();
      
      // Only update if the typing user is the currently selected chat
      if (selectedUser?._id === senderId) {
        set({ isUserTyping: isTyping });
        
        // Auto-clear typing after 3 seconds if no update
        if (isTyping) {
          setTimeout(() => {
            const currentTyping = get().isUserTyping;
            if (currentTyping) {
              set({ isUserTyping: false });
            }
          }, 3000);
        }
      }
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    const { typingTimeout } = get();

    if (typingTimeout) clearTimeout(typingTimeout);

    if (socket?.connected) {
      socket.disconnect();
    }

    set({
      socket: null,
      onlineUsers: [],
      isUserTyping: false,
      typingTimeout: null,
    });
  },
}));
