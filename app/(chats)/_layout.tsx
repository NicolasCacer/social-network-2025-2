import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Image, Text, TouchableOpacity } from "react-native";

export default function ChatLayout() {
  const router = useRouter();
  const { name, avatar } = useLocalSearchParams(); // 👈 recibes params del push

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#fff" },
        headerTitleAlign: "left",
        headerShadowVisible: true,
        headerLeft: () => (
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />

            {/* Avatar dinámico */}
            {avatar ? (
              <Image
                source={{ uri: String(avatar) }}
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 25,
                  marginLeft: 12,
                  marginRight: 12,
                }}
              />
            ) : null}

            {/* Nombre */}
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              {name || "Contacto"}
            </Text>
          </TouchableOpacity>
        ),
        headerTitle: "",
      }}
    />
  );
}
