// context/DataContext.tsx
import { createContext, useState } from "react";
import { supabase } from "../utils/supabase";

export const DataContext = createContext<any>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);

  // Obtener todos los perfiles
  const getProfiles = async () => {
    const { data, error } = await supabase.from("profiles").select("*");
    if (error) {
      console.error("Error al traer perfiles:", error.message);
      return { data: null, error };
    }
    setProfiles(data || []);
    return { data, error: null };
  };

  // Obtener los chats en los que participa el usuario actual
  const getUserChats = async (userId: string) => {
    const { data: chatsData, error } = await supabase
      .from("chats")
      .select("*")
      .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`);

    if (error) {
      console.error("Error al traer chats:", error);
      return { data: null, error };
    }

    const chatWithProfiles = await Promise.all(
      (chatsData || []).map(async (chat) => {
        const otherUserId =
          chat.user_id_1 === userId ? chat.user_id_2 : chat.user_id_1;

        const { data: profile } = await supabase
          .from("profiles")
          .select("id, name, username, avatar_url")
          .eq("id", otherUserId)
          .single();
        const { data: lastMessage } = await supabase
          .from("messages")
          .select("id, text, sent_at, seen_at, sent_by")
          .eq("chat_id", chat.id)
          .order("sent_at", { ascending: false })
          .limit(1)
          .single();

        return {
          chatId: chat.id,
          participant: profile,
          lastMessage: lastMessage || null,
        };
      })
    );

    setChats(chatWithProfiles);

    return { data: chatWithProfiles, error: null };
  };

  return (
    <DataContext.Provider
      value={{
        profiles,
        chats,
        getProfiles,
        getUserChats,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
