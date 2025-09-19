import CameraModal from "@/components/cameraModal";
import { AuthContext } from "@/context/AuthContext";
import { supabase } from "@/utils/supabase";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditProfile() {
  const router = useRouter();
  const context = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    bio: "",
    website: "",
    location: "",
    phone: "",
    gender: "",
    avatar_url: "",
  });

  // Cargar datos actuales del perfil
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        Alert.alert("Error", "user was not found");
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
      } else if (data) {
        setProfile({
          name: data.name || "",
          username: data.username || "",
          bio: data.bio || "",
          website: data.website || "",
          location: data.location || "",
          phone: data.phone || "",
          gender: data.gender || "",
          avatar_url: data.avatar_url || "",
        });
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  const uploadImage = async (uri: string) => {
    try {
      // Fetch image from URI
      const response = await fetch(uri);
      const arrayBuffer = await response.arrayBuffer();
      const file = new Uint8Array(arrayBuffer);

      // Get file extension (default to jpg if missing)
      const ext = uri.split(".").pop() || "jpg";

      // Use a fixed filename per user (no Date.now to avoid duplicates)
      const fileName = `${context.user?.id}.${ext}`;

      // Upload image with upsert: true (replace if it already exists)
      const { error: uploadError } = await supabase.storage
        .from("profilesBucket")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded file
      const { data: publicData } = supabase.storage
        .from("profilesBucket")
        .getPublicUrl(fileName);

      // Add a cache-busting parameter (forces refresh)
      const freshUrl = `${publicData.publicUrl}?t=${Date.now()}`;

      // Update local profile state with the new avatar URL
      setProfile((prev) => ({ ...prev, avatar_url: freshUrl }));

      Alert.alert("Success", "Profile picture updated successfully!");
    } catch (err: any) {
      console.log("Error uploading image:", err);
      Alert.alert("Upload Error", err.message);
    }
  };

  // Guardar cambios
  const handleSave = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("profiles")
      .update({
        ...profile,
        updated_at: new Date(),
      })
      .eq("id", user?.id);

    await context.refreshUser();

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Éxito", "Perfil actualizado");
      router.back();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Edit Profile</Text>

        {/* Avatar con ícono de editar */}
        <TouchableOpacity
          onPress={() => setShowCamera(true)}
          style={styles.avatarContainer}
        >
          {profile.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
          ) : (
            <Image
              source={{
                uri: "https://static.vecteezy.com/system/resources/thumbnails/036/280/651/small_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg",
              }} // agrega un placeholder en assets
              style={styles.avatar}
            />
          )}
          <View style={styles.editIcon}>
            <MaterialIcons name="edit" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Inputs */}
        {Object.entries(profile).map(([key, value]) => {
          if (key === "avatar_url") return null; // ocultar avatar_url como campo de texto
          return (
            <View key={key} style={styles.inputGroup}>
              <Text style={styles.label}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={(text) =>
                  setProfile((prev) => ({ ...prev, [key]: text }))
                }
                placeholder={`Enter your ${key}`}
                placeholderTextColor="#888"
              />
            </View>
          );
        })}

        {/* Botón Guardar */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveText}>
            {loading ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Camera Modal */}
      <CameraModal
        visible={showCamera}
        onClose={() => setShowCamera(false)}
        onSelect={(uri) => uploadImage(uri)}
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
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginTop: 16,
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2E38F2",
    marginBottom: 20,
    textAlign: "center",
  },
  avatarContainer: {
    alignSelf: "center",
    marginBottom: 20,
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#eee",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2E38F2",
    borderRadius: 15,
    padding: 5,
    borderWidth: 2,
    borderColor: "#fff",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333640",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#B4B9D9",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    color: "#000",
    backgroundColor: "#F5F6FA",
  },
  saveBtn: {
    backgroundColor: "#3037BF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
