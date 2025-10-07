import { AuthContext } from "@/context/AuthContext";
import { DataContext } from "@/context/DataContext";
import { supabase } from "@/utils/supabase";
import { Feather } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { VideoView, useVideoPlayer } from "expo-video";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

// Tipo Post
type Post = {
  id: string;
  user_id: string;
  user_name: string;
  avatar: string;
  content: string;
  media_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: Date;
  likedByUser?: boolean; // 👈 nuevo
};

// ---------------- PostItem ----------------
function PostItem({ item }: { item: Post }) {
  const { toggleLikePost } = useContext(DataContext);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isPlaying, setIsPlaying] = useState(false);
  const isFocused = useIsFocused();
  const player = useVideoPlayer(item.media_url || "", (p) => {
    p.loop = true;
  });

  useEffect(() => {
    if (!isFocused && isPlaying) {
      player.pause();
      setIsPlaying(false);
    }
  }, [isFocused, isPlaying, player]);

  const togglePlayPause = () => {
    if (!item.media_url?.endsWith(".mp4")) return;
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }

    fadeAnim.setValue(1);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  // Formatear fecha
  const formattedDate = new Date(item.created_at || "").toLocaleDateString(
    "es-ES"
  );

  return (
    <View style={styles.post}>
      <View style={styles.userRow}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.username}>{item.user_name}</Text>
      </View>

      {item.media_url && item.media_url.endsWith(".mp4") ? (
        <TouchableWithoutFeedback onPress={togglePlayPause}>
          <View style={styles.postMediaContainer}>
            <VideoView
              player={player}
              style={styles.postMedia}
              contentFit="cover"
              allowsPictureInPicture={false}
              nativeControls={false}
            />
            {!isPlaying && (
              <View style={styles.playOverlay}>
                <View style={styles.playButton}>
                  <Feather
                    name="play"
                    size={36}
                    color="#fff"
                    style={{ marginLeft: 6 }}
                  />
                </View>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      ) : item.media_url ? (
        <View style={styles.postMediaContainer}>
          <Image
            source={{ uri: item.media_url }}
            style={styles.postMedia}
            resizeMode="cover"
          />
        </View>
      ) : null}

      <View style={styles.textContainer}>
        <Text style={styles.content}>{item.content}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => toggleLikePost(item.id)}
        >
          <Feather
            name={item.likedByUser ? "heart" : "heart"}
            size={20}
            color={item.likedByUser ? "red" : "#2E38F2"}
            fill={item.likedByUser ? "red" : "none"}
          />
          <Text style={styles.actionText}>
            {item.likes_count || 0} {item.likedByUser ? "Liked" : "Like"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Feather name="message-circle" size={20} color="#2E38F2" />
          <Text style={styles.actionText}>
            Comment ({item.comments_count || 0})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Feather name="calendar" size={20} color="#2E38F2" />
          <Text style={styles.actionText}>{formattedDate}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ---------------- Main ----------------
export default function Main() {
  const { posts, setPosts } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  // Escuchar likes realtime
  useEffect(() => {
    const channel = supabase
      .channel("posts-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        (payload) => {
          setPosts((prev: any) =>
            prev.map((p) =>
              p.id === payload.new ? { ...p, ...payload.new } : p
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [setPosts]);

  // Filtrar posts (no propios)
  useEffect(() => {
    if (user) {
      const fp = posts.filter((p) => p.user_id !== user.id);
      setFilteredPosts(fp);
    }
  }, [posts, user]);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostItem item={item} />}
        contentContainerStyle={styles.feed}
      />
    </View>
  );
}

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#B4B9D9" },
  feed: { padding: 12 },
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
  userRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  username: { fontWeight: "700", color: "#333640" },
  content: { marginBottom: 10, color: "#333640", fontSize: 16, lineHeight: 22 },
  postMediaContainer: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: "#e0e0e0",
  },
  postMedia: { width: "100%", height: "100%", borderRadius: 12 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 6,
  },
  actionBtn: { flexDirection: "row", alignItems: "center" },
  actionText: { color: "#2E38F2", fontWeight: "600", marginLeft: 4 },
  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
});
