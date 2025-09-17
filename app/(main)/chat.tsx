import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const dummyChats = [
  {
    id: "1",
    name: "Juan",
    lastMessage: "¿Cómo vas?",
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: "2",
    name: "María",
    lastMessage: "Mañana nos vemos 👍",
    avatar: "https://i.pravatar.cc/100?img=2",
  },
  {
    id: "3",
    name: "Rodrigo",
    lastMessage: "Te envié las fotos 📸",
    avatar: "https://i.pravatar.cc/100?img=3",
  },
];

export default function ChatList() {
  const router = useRouter();

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        router.push({
          pathname: "/(chats)/[id]",
          params: {
            id: item.id,
            name: item.name,
            avatar: item.avatar,
          },
        })
      }
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={dummyChats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: { flex: 1 },
  name: { fontWeight: "bold", fontSize: 16 },
  lastMessage: { color: "#666", marginTop: 2 },
});
