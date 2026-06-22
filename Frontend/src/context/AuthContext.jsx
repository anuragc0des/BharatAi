import { createContext, useContext, useEffect, useState } from "react";
import { logoutUser } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = window.localStorage.getItem("bharatai-user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData) => {
    // If backend returns { user } or { token, user }, set user state
    const userObj = userData.user || userData;
    window.localStorage.setItem("bharatai-user", JSON.stringify(userObj));
    setUser(userObj);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error("Logout API call failed", e);
    }
    window.localStorage.removeItem("bharatai-user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
