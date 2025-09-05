import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const posts = [
  {
    id: "1",
    user: "NuppiUser",
    avatar: "https://i.pravatar.cc/100?img=1",
    content: "¡Hola! Esta es mi primera publicación en Nuppi 🚀",
    image: "https://picsum.photos/400/200",
  },
  {
    id: "2",
    user: "JaneDoe",
    avatar: "https://i.pravatar.cc/100?img=2",
    content: "Disfrutando del día con un buen café ☕",
    image: "https://picsum.photos/400/201",
  },
];

export default function Main() {
  const renderPost = ({ item }) => (
    <View style={styles.post}>
      {/* User row */}
      <View style={styles.userRow}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.username}>{item.user}</Text>
      </View>

      {/* Content */}
      <Text style={styles.content}>{item.content}</Text>

      {/* Post image */}
      <Image source={{ uri: item.image }} style={styles.postImage} />

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn}>
          <Feather name="heart" size={20} color="#2E38F2" />
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Feather name="message-circle" size={20} color="#2E38F2" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Feather name="share" size={20} color="#2E38F2" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Feed */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={styles.feed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B4B9D9",
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2E38F2",
    textAlign: "center",
    paddingVertical: 16,
    backgroundColor: "#fff",
  },
  feed: {
    padding: 12,
  },
  post: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  username: {
    fontWeight: "700",
    color: "#333640",
  },
  content: {
    marginBottom: 8,
    color: "#333640",
  },
  postImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 6,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    color: "#2E38F2",
    fontWeight: "600",
    marginLeft: 4,
  },
});
