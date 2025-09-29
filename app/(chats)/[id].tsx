import { AuthContext } from "@/context/AuthContext";
import { supabase } from "@/utils/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type Message = {
  id: string;
  text: string;
  sent_by: string;
  chat_id: string;
  created_at: string;
  sent_at?: string | null;
  seen_at?: string | null;
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  // Carga inicial y suscripción a mensajes
  useEffect(() => {
    const loadMessages = async () => {
      // 1. Cargar todos los mensajes del chat
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", id)
        .order("created_at", { ascending: true });

      if (!error && data) {
        const messages = data as Message[];
        setMessages(messages);

        // 2. Filtrar mensajes de la otra persona que aún no están leídos
        const unreadMessages = messages.filter(
          (msg) => msg.sent_by !== user?.id && !msg.seen_at
        );

        // 3. Marcar como leídos
        if (unreadMessages.length > 0) {
          await supabase
            .from("messages")
            .update({ seen_at: new Date().toISOString() })
            .in(
              "id",
              unreadMessages.map((m) => m.id)
            );
        }
      }
    };

    loadMessages();

    // 4. Suscribirse a INSERT y UPDATE (equivalente a UPSERT)
    const channel = supabase
      .channel(`chat-${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${id}`,
        },
        handleRealtimeMessage
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${id}`,
        },
        handleRealtimeMessage
      )
      .subscribe();

    function handleRealtimeMessage(payload: any) {
      const newMessage = payload.new as Message;

      // Si es de la otra persona y no está leído, marcarlo como leído
      if (newMessage.sent_by !== user?.id && !newMessage.seen_at) {
        supabase
          .from("messages")
          .update({ seen_at: new Date().toISOString() })
          .eq("id", newMessage.id);

        newMessage.seen_at = new Date().toISOString();
      }

      setMessages((prev) => {
        // Evitar duplicados en caso de UPDATE
        const exists = prev.find((m) => m.id === newMessage.id);
        if (exists) {
          return prev.map((m) => (m.id === newMessage.id ? newMessage : m));
        } else {
          return [...prev, newMessage];
        }
      });
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, id]);

  // Scroll al final cuando cambian los mensajes
  const scrollToEnd = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToEnd();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const { error } = await supabase.from("messages").insert({
      chat_id: id,
      sent_by: user?.id,
      text: input.trim(),
    });
    if (!error) setInput("");
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const weekday = date.toLocaleDateString("es-ES", { weekday: "long" });
    const day = date.getDate();
    const month = date.toLocaleDateString("es-ES", { month: "short" });
    const year = date.getFullYear();
    return `${weekday}, ${day} ${month} ${year}`;
  };

  const isSameDay = (date1?: string, date2?: string) => {
    if (!date1 || !date2) return false;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={{
              flexGrow: 1,
              padding: 10,
              justifyContent: "flex-start",
            }}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={scrollToEnd}
          >
            {messages.map((item, index) => {
              const isMe = item.sent_by === user?.id;

              // Separador de día
              const showDaySeparator =
                index === 0 ||
                !isSameDay(item.created_at, messages[index - 1]?.created_at);

              const daySeparator = showDaySeparator ? (
                <View style={styles.daySeparatorContainer} key={`day-${index}`}>
                  <Text style={styles.daySeparatorText}>
                    {formatDate(item.created_at)}
                  </Text>
                </View>
              ) : null;

              // Icono de visto
              const seenIcon = isMe ? (
                <View style={styles.seenRow}>
                  <Text
                    style={[
                      styles.seenIcon,
                      { color: item.sent_at ? "#32408C" : "#B4B9D9" },
                    ]}
                  >
                    ✓
                  </Text>
                  <Text
                    style={[
                      styles.seenIcon,
                      {
                        color: item.seen_at ? "#32408C" : "#B4B9D9",
                        marginLeft: -3,
                      },
                    ]}
                  >
                    ✓
                  </Text>
                </View>
              ) : (
                <View />
              );

              return (
                <React.Fragment key={item.id}>
                  {daySeparator}
                  <View
                    style={[
                      styles.message,
                      isMe ? styles.myMessage : styles.theirMessage,
                      styles.shadow,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        { color: isMe ? "#333640" : "#fff" },
                      ]}
                    >
                      {item.text || ""}
                    </Text>
                    <View style={styles.metaRow}>
                      {isMe && (
                        <View style={styles.checksWrapper}>{seenIcon}</View>
                      )}
                      <Text
                        style={[
                          styles.timeText,
                          { color: isMe ? "#32408C" : "#fff" },
                        ]}
                      >
                        {new Date(item.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </Text>
                    </View>
                  </View>
                </React.Fragment>
              );
            })}
            <View style={{ height: 50 }} />
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Escribe un mensaje..."
              placeholderTextColor="#999"
              value={input}
              onChangeText={setInput}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Ionicons name="send-sharp" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  message: {
    padding: 14,
    borderRadius: 20,
    marginVertical: 6,
    maxWidth: "75%",
  },
  myMessage: {
    backgroundColor: "#D6D8E8",
    alignSelf: "flex-end",
  },
  theirMessage: {
    backgroundColor: "#2E38F2",
    alignSelf: "flex-start",
  },
  messageText: { fontSize: 16, marginBottom: 5 },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeText: { fontSize: 11 },
  checksWrapper: { marginRight: 8 },
  seenRow: { flexDirection: "row", alignItems: "center" },
  seenIcon: { fontSize: 11, fontWeight: "bold", lineHeight: 12 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
    marginBottom: 30,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: "#F8F8F8",
    color: "#333640",
  },
  sendButton: {
    width: 50,
    backgroundColor: "#2E38F2",
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  daySeparatorContainer: {
    alignSelf: "center",
    backgroundColor: "#E3E6F0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginVertical: 10,
  },
  daySeparatorText: {
    fontSize: 12,
    color: "#333640",
    fontWeight: "600",
  },
});
