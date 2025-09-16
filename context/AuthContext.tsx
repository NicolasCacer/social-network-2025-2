import { createContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase"; // ajusta la ruta
import { User } from "./common.type";

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    username?: string
  ) => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);

  // Mantener sesión activa
  useEffect(() => {
    // Cargar sesión activa al iniciar la app
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUser(data.session.user as any);
      }
    };
    loadSession();

    // Escuchar cambios en la sesión (login, logout, refresh)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user as any);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Error en login:", error.message);
      return false;
    }
    setUser(data.user as any);
    return true;
  };

  // Registro (puedes guardar username en metadata)
  const register = async (
    email: string,
    password: string,
    username?: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: username,
        },
      },
    });
    if (error) {
      console.error("Error en registro:", error.message);
      return false;
    }
    setUser(data.user as any);
    return true;
  };

  // Reset password
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://google.com",
    });
    if (error) console.error("Error al resetear:", error.message);
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
