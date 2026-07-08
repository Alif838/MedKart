import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1] || "";
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      const parsed = parseJwt(token);
      const baseUser = JSON.parse(storedUser);
      const userWithId = parsed && parsed.id ? { ...baseUser, id: parsed.id } : baseUser;
      setUser(userWithId);
    }
  }, []);

  const login = (userData, token) => {
    // if token passed, store it and derive id
    if (token) {
      localStorage.setItem("token", token);
      const parsed = parseJwt(token);
      const userWithId = parsed && parsed.id ? { ...userData, id: parsed.id } : userData;
      setUser(userWithId);
      localStorage.setItem("user", JSON.stringify(userWithId));
      return;
    }

    // fallback: store user only
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
