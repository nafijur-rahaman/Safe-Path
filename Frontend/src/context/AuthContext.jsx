// src/context/AuthContext.js
import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const api = axios.create({
    baseURL: "http://localhost:8000/api",
  });


  api.interceptors.request.use((config) => {
    if (token) config.headers["Authorization"] = `Token ${token}`;
    return config;
  });

  // Login function
  const login = async (username, password) => {
    try {
      const res = await api.post("/user/login/", { username, password });
      console.log(res.data);
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser({ username });
      return true;
    } catch (err) {
      console.error(err.response?.data || err.message);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
