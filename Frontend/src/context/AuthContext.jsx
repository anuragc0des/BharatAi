import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("bharatai-user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = ({ token, user }) => {
    window.localStorage.setItem("bharatai-token", token);
    window.localStorage.setItem("bharatai-user", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    window.localStorage.removeItem("bharatai-token");
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
