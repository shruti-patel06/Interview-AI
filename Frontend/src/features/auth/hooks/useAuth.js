import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from "../services/auth.api.js";

/**
 * Auth actions throw on failure so the calling page can show the error message.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { user, setUser, loading } = context;

  const handleLogin = async ({ email, password }) => {
    const data = await login({ email, password });
    //user comes from the response returned in the auth.controllers from Backend
    setUser(data.user);
    return data.user;
  };

  const handleRegister = async ({ username, email, password }) => {
    const data = await register({ username, email, password });
    setUser(data.user);
    return data.user;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setUser(null); //Frontend se user ka data null hojayega, even if the request fails
    }
  };

  return { user, loading, handleRegister, handleLogin, handleLogout };
};
