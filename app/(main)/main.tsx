import { DataContext } from "@/context/DataContext";
import { Feather } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";
import { useContext, useRef, useState } from "react";
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

// Definimos el tipo Post según nuestro context
type Post = {
  id: string;
  user_id: string;
  user_name: string;
  avatar: string;
  content: string;
  media_url?: string;
  likes_count: number;
  comments_count: number;
};

function PostItem({ item }: { item: Post }) {
  const { likePost } = useContext(DataContext);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isPlaying, setIsPlaying] = useState(false);
  const player = useVideoPlayer(item.media_url || "", (p) => {
    p.loop = true;
  });

  const togglePlayPause = () => {
    if (!item.media_url?.endsWith(".mp4")) return; // solo video
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

  return (
    <View style={styles.post}>
      {/* User row */}
      <View style={styles.userRow}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.username}>{item.user_name}</Text>
      </View>

      {/* Content */}
      <Text style={styles.content}>{item.content}</Text>

      {/* Post media */}
      {item.media_url && item.media_url.endsWith(".mp4") ? (
        <TouchableWithoutFeedback onPress={togglePlayPause}>
          <View style={styles.postMediaContainer}>
            <VideoView
              player={player}
              style={styles.postMedia} // <-- usamos estilo escalado
              contentFit="cover"
              allowsPictureInPicture={false}
              nativeControls={true}
            />
          </View>
        </TouchableWithoutFeedback>
      ) : item.media_url ? (
        <Image source={{ uri: item.media_url }} style={styles.postMedia} />
      ) : null}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => likePost(item.id)}
        >
          <Feather name="heart" size={20} color="#2E38F2" />
          <Text style={styles.actionText}>Like ({item.likes_count || 0})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Feather name="message-circle" size={20} color="#2E38F2" />
          <Text style={styles.actionText}>
            Comment ({item.comments_count || 0})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Feather name="share" size={20} color="#2E38F2" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function Main() {
  const { posts } = useContext(DataContext);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostItem item={item} />}
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
  postMediaContainer: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  postMedia: {
    width: "100%",
    height: "100%",
  },
  iconOverlay: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBackground: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 50,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 6,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    color: "#2E38F2",
    fontWeight: "600",
    marginLeft: 4,
  },
});
