import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

// ✅ Definimos el tipo de cada mensaje
type Message = {
  id: string;
  text: string;
  sender: "me" | "them";
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hola!", sender: "them" },
    { id: "2", text: "Hey, ¿cómo vas?", sender: "me" },
  ]);
  const [input, setInput] = useState<string>("");

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: input, sender: "me" },
    ]);
    setInput("");
  };

  // ✅ Tipamos el parámetro item como Message
  const renderItem: ListRenderItem<Message> = ({ item }) => (
    <View
      style={[
        styles.message,
        item.sender === "me" ? styles.myMessage : styles.theirMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Lista de mensajes */}
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 10 }}
            showsVerticalScrollIndicator={false}
          />

          {/* Caja de texto */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Escribe un mensaje..."
              value={input}
              onChangeText={setInput}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Ionicons name="send-sharp" size={20} color="white" />
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
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "70%",
  },
  myMessage: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  theirMessage: {
    backgroundColor: "#eee",
    alignSelf: "flex-start",
  },
  messageText: { fontSize: 16 },
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
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 50,
    backgroundColor: "#3897f0",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  sendText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
