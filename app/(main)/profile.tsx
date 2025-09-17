import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ProfileData = {
  id: string;
  email: string;
  name: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  followers_count: number;
  following_count: number;
  posts_count: number;
};

const posts = [
  { id: "1", image: "https://picsum.photos/300/200" },
  { id: "2", image: "https://picsum.photos/301/200" },
  { id: "3", image: "https://picsum.photos/302/200" },
];

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const loadProfile = async () => {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      Alert.alert("Error", "No se pudo obtener el usuario.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      setProfile(data as ProfileData);
    }

    setLoading(false);
  };

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const init = async () => {
      await loadProfile();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      channel = supabase
        .channel("profile-updates")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "profiles",
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            console.log("Cambio detectado en realtime");
            if (payload.new) {
              setProfile(payload.new as ProfileData);
            }
          }
        )
        .subscribe((status) => {
          console.log("Estado de canal:", status);
        });
    };

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#2E38F2" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Text style={{ color: "#333" }}>No profile found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} bounces={false} overScrollMode="auto">
      {/* Header con datos */}
      <View style={styles.header}>
        <Image
          source={{
            uri: profile.avatar_url || "https://i.pravatar.cc/150?img=5",
          }}
          style={styles.avatar}
        />
        <Text style={styles.username}>
          {profile.username ? `@${profile.username}` : profile.email}
        </Text>
        <Text style={styles.bio}>{profile.bio || ""}</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{profile.posts_count}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{profile.followers_count}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{profile.following_count}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        {/* Botones */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              router.push("/(profile)/editProfile");
            }}
          >
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
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.postsRow}
      />
    </ScrollView>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333640",
    marginLeft: 16,
    marginBottom: 10,
  },
  postsRow: {
    paddingLeft: 16,
    margin: 0,
  },
  postImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginRight: 12,
  },
});
