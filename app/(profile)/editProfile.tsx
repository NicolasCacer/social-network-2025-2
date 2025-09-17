import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    bio: "",
    website: "",
    location: "",
    phone: "",
    gender: "",
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
        Alert.alert("Error", "No se pudo obtener el usuario");
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
        });
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

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

        {Object.entries(profile).map(([key, value]) => (
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
        ))}

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B4B9D9", // Fondo azul claro
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
    color: "#2E38F2", // Azul fuerte
    marginBottom: 20,
    textAlign: "center",
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
    backgroundColor: "#3037BF", // Azul botón
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
