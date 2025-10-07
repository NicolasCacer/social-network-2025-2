// context/DataContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { AuthContext } from "./AuthContext";

export interface LastMessage {
  text?: string;
  sent_at?: string;
  seen_at?: string | null;
  sent_by?: string;
}

export interface ChatItem {
  chatId: string;
  participant: {
    id: string;
    name: string;
    username?: string;
    avatar_url?: string;
  };
  lastMessage?: LastMessage;
  _uniqueKey: string;
}

export const DataContext = createContext<any>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [posts, setPosts] = useState<any[]>([]); // estado de posts

  const contextAuth = useContext(AuthContext);

  // -----------------------------
  // Obtener todos los perfiles
  // -----------------------------
  const getProfiles = async () => {
    const currentUserId = contextAuth.user?.id;
    if (!currentUserId) return { data: [], error: null };

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", currentUserId);

      if (error) return { data: null, error };

      setProfiles(data || []);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  // -----------------------------
  // Obtener chats del usuario actual
  // -----------------------------
  const getUserChats = async (userId: string) => {
    try {
      const { data: chatsData, error } = await supabase
        .from("chats")
        .select("*")
        .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`);

      if (error) return { data: null, error };

      const chatWithProfiles = await Promise.all(
        (chatsData || []).map(async (chat, index) => {
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

          const safeChatId = chat.id ?? `chat-${index}`;
          const safeProfileId = profile?.id ?? `user-${index}`;

          return {
            chatId: safeChatId,
            participant: profile ?? { id: safeProfileId, name: "Desconocido" },
            lastMessage: lastMessage ?? undefined,
            _uniqueKey: `${safeChatId}-${safeProfileId}-${index}`,
          };
        })
      );

      setChats(chatWithProfiles);
      return { data: chatWithProfiles, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  // -----------------------------
  // Crear un nuevo chat
  // -----------------------------
  const createChat = async (targetUserId: string) => {
    const currentUserId = contextAuth.user?.id;
    if (!currentUserId) return { data: null, error: "Usuario no autenticado" };

    try {
      const { data: existingChat } = await supabase
        .from("chats")
        .select("id, user_id_1, user_id_2")
        .or(
          `and(user_id_1.eq.${currentUserId},user_id_2.eq.${targetUserId}),and(user_id_1.eq.${targetUserId},user_id_2.eq.${currentUserId})`
        )
        .maybeSingle();

      if (existingChat) return { data: existingChat, error: null };

      const { data: newChat, error } = await supabase
        .from("chats")
        .insert([{ user_id_1: currentUserId, user_id_2: targetUserId }])
        .select()
        .single();

      if (error) return { data: null, error };

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, name, username, avatar_url")
        .eq("id", targetUserId)
        .single();

      const chatItem: ChatItem = {
        chatId: newChat.id ?? `chat-${Date.now()}`,
        participant: profile ?? { id: targetUserId, name: "Desconocido" },
        lastMessage: undefined,
        _uniqueKey: `${newChat.id ?? Date.now()}-${
          profile?.id ?? targetUserId
        }`,
      };

      setChats((prev) => {
        const exists = prev.some((c) => c.chatId === chatItem.chatId);
        if (exists) return prev;
        return [chatItem, ...prev];
      });

      return { data: chatItem, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  // -----------------------------
  // Suscripción en tiempo real (chats + mensajes)
  // -----------------------------
  useEffect(() => {
    const userId = contextAuth.user?.id;
    if (!userId) return;

    // Canal de chats
    const chatChannel = supabase
      .channel(`realtime-chats-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chats",
          filter: `user_id_1=eq.${userId}`,
        },
        (payload) => handleRealtimeChat(payload.new)
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chats",
          filter: `user_id_2=eq.${userId}`,
        },
        (payload) => handleRealtimeChat(payload.new)
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload) => handleRealtimeMessage(payload.new)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextAuth.user?.id]);

  // -----------------------------
  // Actualizar chats desde la suscripción
  // -----------------------------
  const handleRealtimeChat = (chat: any) => {
    if (!chat) return;
    const userId = contextAuth.user?.id;
    const otherUserId =
      chat.user_id_1 === userId ? chat.user_id_2 : chat.user_id_1;

    setChats((prev) => {
      const existsIndex = prev.findIndex((c) => c.chatId === chat.id);
      const newChat: ChatItem = {
        chatId: chat.id,
        participant: { id: otherUserId, name: "Desconocido" },
        lastMessage: undefined,
        _uniqueKey: `${chat.id}-${otherUserId}`,
      };

      if (existsIndex >= 0) {
        const newArr = [...prev];
        newArr[existsIndex] = { ...newArr[existsIndex], ...newChat };
        return newArr;
      } else {
        return [newChat, ...prev];
      }
    });
  };

  // -----------------------------
  // Actualizar mensajes desde la suscripción
  // -----------------------------
  const handleRealtimeMessage = (message: any) => {
    if (!message) return;
    setChats((prev) =>
      prev.map((c) =>
        c.chatId === message.chat_id ? { ...c, lastMessage: message } : c
      )
    );
  };

  // -----------------------------
  // FUNCIONES DE POSTS
  // -----------------------------
  const createPost = async (
    type: "image" | "video" | "text",
    content: string,
    media_url?: string
  ) => {
    const userId = contextAuth.user?.id;
    if (!userId) return { data: null, error: "Usuario no autenticado" };

    const { data, error } = await supabase
      .from("posts")
      .insert([{ user_id: userId, type, content, media_url }])
      .select()
      .single();

    return { data, error };
  };

  const likePost = async (postId: string) => {
    const userId = contextAuth.user?.id;
    if (!userId) return { data: null, error: "Usuario no autenticado" };

    const { data, error } = await supabase
      .from("post_likes")
      .insert([{ post_id: postId, user_id: userId }])
      .select()
      .single();

    return { data, error };
  };

  const commentPost = async (
    postId: string,
    text: string,
    parentCommentId?: string
  ) => {
    const userId = contextAuth.user?.id;
    if (!userId) return { data: null, error: "Usuario no autenticado" };

    const { data, error } = await supabase
      .from("post_comments")
      .insert([
        {
          post_id: postId,
          user_id: userId,
          text,
          parent_comment_id: parentCommentId,
        },
      ])
      .select()
      .single();

    return { data, error };
  };

  // -----------------------------
  // Suscripción en tiempo real para posts
  // -----------------------------
  useEffect(() => {
    const userId = contextAuth.user?.id;
    if (!userId) return;

    getPosts();

    const postsChannel = supabase
      .channel("realtime-posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        () => {
          getPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
    };
  }, [contextAuth.user?.id]);

  // Get posts

  // Traer posts existentes
  const getPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
        *,
        profiles!inner(id, name, avatar_url)
      `
        )
        .order("created_at", { ascending: false });

      if (error) return { data: null, error };

      const mappedPosts = (data || []).map((p: any) => ({
        id: p.id,
        user_id: p.user_id,
        user_name: p.profiles?.name || "Desconocido",
        avatar: p.profiles?.avatar_url || "",
        content: p.content,
        media_url: p.media_url,
        likes_count: p.likes_count,
        comments_count: p.comments_count,
      }));

      setPosts(mappedPosts);
      return { data: mappedPosts, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  // -----------------------------
  // RETORNO DEL CONTEXT
  // -----------------------------
  return (
    <DataContext.Provider
      value={{
        profiles,
        chats,
        posts,
        getProfiles,
        getUserChats,
        createChat,
        createPost,
        likePost,
        commentPost,
        getPosts,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
