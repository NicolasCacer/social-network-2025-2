import { createContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
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

  // Crear usuario

  const register = async (
    email: string,
    password: string,
    username?: string
  ) => {
    // Crear usuario en Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: username } },
    });

    if (error || !data.user) {
      console.error(
        "Error en registro:",
        error?.message || "No se creó el usuario"
      );
      return false;
    }

    // Construir el User completo
    const newUser: User = {
      id: data.user.id,
      email: data.user.email || "",
      name: username || "",
      username: username || null,
      avatar_url: null,
      cover_url: null,
      bio: null,
      website: null,
      location: null,
      birth_date: null,
      phone: null,
      gender: null,
      is_verified: false,
      is_private: false,
      followers_count: 0,
      following_count: 0,
      posts_count: 0,
      likes_count: 0,
      last_active: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insertar en 'profiles'
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([newUser]);
    if (profileError) {
      console.error("Error al crear perfil:", profileError.message);
      return false;
    }

    // Guardar en estado
    setUser(newUser);
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
