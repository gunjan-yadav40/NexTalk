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

  socket: null,
  onlineUsers: [],

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
      const res = await axiosInstance.post(
        "/auth/signup",
        data
      );

      set({ authUser: res.data });

      get().connectSocket();

      toast.success(
        "Account created successfully!"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Signup failed"
      );
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLogginIn: true });

    try {
      const res = await axiosInstance.post(
        "/auth/login",
        data
      );

      set({ authUser: res.data });

      get().connectSocket();

      toast.success(
        "Logged In successfully!"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      set({ isLogginIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post(
        "/auth/logout"
      );

      get().disconnectSocket();

      set({
        authUser: null,
        onlineUsers: [],
      });

      toast.success(
        "Logged out successfully"
      );
    } catch (error) {
      console.log(
        "Logout error:",
        error
      );

      toast.error(
        "Error logging out"
      );
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put(
        "/auth/update-profile",
        data
      );

      set({
        authUser: res.data,
      });

      toast.success(
        "Profile updated successfully"
      );
    } catch (error) {
      console.log(
        "Error in update profile:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Profile update failed"
      );
    }
  },

  connectSocket: () => {
    const { authUser } = get();

    if (
      !authUser ||
      get().socket?.connected
    )
      return;

    const socket = io(BASE_URL, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log(
        "Socket connected:",
        socket.id
      );
    });

    socket.on(
      "connect_error",
      (error) => {
        console.log(
          "Socket error:",
          error.message
        );
      }
    );

    socket.on(
      "onlineUsers",
      (userIds) => {
        set({
          onlineUsers: userIds,
        });
      }
    );

    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;

    if (socket?.connected) {
      socket.disconnect();
    }

    set({
      socket: null,
      onlineUsers: [],
    });
  },
}));

