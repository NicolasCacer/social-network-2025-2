import { DataContext } from "@/context/DataContext";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
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

export default function Profile() {
  const router = useRouter();
  const { posts, getPosts } = useContext(DataContext);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile data
  const loadProfile = async () => {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      Alert.alert("Error", "Failed to fetch user.");
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

  // Load profile & posts
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const init = async () => {
      await loadProfile();
      await getPosts(); // <-- cargar posts reales del contexto

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Listen for real-time profile updates
      channel = supabase
        .channel("profile-updates")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "profiles",
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            console.log("Realtime profile update detected");
            if (payload.new) {
              setProfile(payload.new as ProfileData);
            }
          }
        )
        .subscribe((status) => {
          console.log("Channel status:", status);
        });
    };

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {/* Header with user data */}
      <View style={styles.header}>
        {profile.avatar_url ? (
          <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
        ) : (
          <Image
            source={{
              uri: "https://static.vecteezy.com/system/resources/thumbnails/036/280/651/small_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg",
            }}
            style={styles.avatar}
          />
        )}

        <Text style={styles.username}>
          {profile.username ? `@${profile.username}` : profile.email}
        </Text>
        <Text style={styles.bio}>{profile.bio || ""}</Text>

        {/* Stats section */}
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

        {/* Action buttons */}
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

      {/* User posts section */}
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.sectionTitle}>My Posts</Text>

        {posts.filter((p) => p.user_id === profile?.id).length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 10, color: "#555" }}>
            No tienes posts aún.
          </Text>
        ) : (
          <FlatList
            data={posts.filter((p) => p.user_id === profile?.id)}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.postsRow}
            renderItem={({ item }) => {
              const date = new Date(item.created_at);
              const formattedDate = `${date
                .getDate()
                .toString()
                .padStart(2, "0")}/${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")}/${date.getFullYear()}`;

              return (
                <View style={styles.postCard}>
                  {/* Foto si existe */}
                  {item.media_url && (
                    <Image
                      source={{ uri: item.media_url }}
                      style={styles.postImage}
                    />
                  )}

                  {/* Contenido de texto */}
                  <Text style={styles.postContent}>{item.content}</Text>

                  {/* Likes y fecha */}
                  <View style={styles.postFooter}>
                    <Text style={styles.postLikes}>
                      ❤️ {item.likes_count || 0}
                    </Text>
                    <Text style={styles.postDate}>{formattedDate}</Text>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
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
    borderColor: "#00000067",
    borderWidth: 2,
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
    paddingRight: 5,
    marginBottom: 10,
  },
  postCard: {
    width: 220,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  postContent: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  postLikes: {
    fontSize: 12,
    color: "#888",
  },
  postDate: {
    fontSize: 12,
    color: "#888",
  },
});
