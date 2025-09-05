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
  { id: "1", image: "https://picsum.photos/300/200" },
  { id: "2", image: "https://picsum.photos/301/200" },
  { id: "3", image: "https://picsum.photos/302/200" },
];

export default function Profile() {
  return (
    <View style={styles.container}>
      {/* Header con datos */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=5" }}
          style={styles.avatar}
        />
        <Text style={styles.username}>@nuppi_user</Text>
        <Text style={styles.bio}>🚀 Amante de la tecnología y el café ☕</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>120</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>4.5k</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>230</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        {/* Botones */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Posts del usuario */}
      <Text style={styles.sectionTitle}>My Posts</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Image source={{ uri: item.image }} style={styles.postImage} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.postsRow}
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
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E38F2",
  },
  bio: {
    fontSize: 14,
    color: "#333640",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginBottom: 16,
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E38F2",
  },
  statLabel: {
    fontSize: 12,
    color: "#333640",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  editBtn: {
    backgroundColor: "#3037BF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  editText: {
    color: "#fff",
    fontWeight: "600",
  },
  logoutBtn: {
    backgroundColor: "#32408C",
    padding: 10,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333640",
    marginLeft: 16,
    marginBottom: 10,
  },
  postsRow: {
    paddingLeft: 16,
  },
  postImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 12,
  },
});
