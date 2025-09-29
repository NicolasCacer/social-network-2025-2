import { DataContext } from "@/context/DataContext";
import { useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChatList() {
  const router = useRouter();
  const { profiles, getProfiles } = useContext(DataContext);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data } = await getProfiles();
      console.log("Perfiles desde Supabase:", data);
    };
    fetchProfiles();
  });

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        router.push({
          pathname: "/(chats)/[id]",
          params: {
            id: item.id,
            name: item.name,
            avatar: item.avatar_url,
          },
        })
      }
    >
      <Image
        source={{
          uri:
            item.avatar_url ??
            "https://static.vecteezy.com/system/resources/thumbnails/036/280/651/small_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg",
        }}
        style={styles.avatar}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.lastMessage}>@{item.username}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={profiles} // 👈 ahora usas los perfiles reales
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
