import { User } from "@/types/types";
import { useState } from "react";

export const useAuthStorage = () => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("users");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const saveUser = (userData: User, token?: string) => {
    if (typeof window !== "undefined") {
      if (token) localStorage.setItem("accessToken", token);
      localStorage.setItem("users", JSON.stringify(userData));
      setUser(userData);
    }
  };

  const saveTempToken = (tempToken: string, otpFor: "2fa" | "email") => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tempToken", tempToken);
      localStorage.setItem("otpfor", otpFor);
    }
  };

  const clearAll = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("users");
      localStorage.removeItem("tempToken");
      localStorage.removeItem("otpfor");
      setUser(null);
    }
  };

  const getAccessToken = () => {
    if (typeof window !== "undefined")
      return localStorage.getItem("accessToken");
    return null;
  };

  const getTempToken = () => {
    if (typeof window !== "undefined") return localStorage.getItem("tempToken");
    return null;
  };

  // NEW: helper to get both user and token
  const getUser = () => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("users");
      const accessToken = localStorage.getItem("accessToken");
      return storedUser && accessToken
        ? { user: JSON.parse(storedUser), accessToken }
        : null;
    }
    return null;
  };

  return {
    user,
    saveUser,
    saveTempToken,
    clearAll,
    getAccessToken,
    getTempToken,
    getUser, // export it
  };
};
