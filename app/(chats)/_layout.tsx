import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Image, Text, TouchableOpacity } from "react-native";

export default function ChatLayout() {
  const router = useRouter();
  const { name, avatar } = useLocalSearchParams(); // recibimos params desde el push

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
            <Ionicons
              name="arrow-back"
              size={24}
              color="#000"
              style={{ marginRight: 8 }}
            />

            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              {name || "Contacto"}
            </Text>

            <Image
              source={{ uri: "https://i.pravatar.cc/100?img=1" }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 25,
                marginLeft: 12,
              }}
            />
          </TouchableOpacity>
        ),
        headerTitle: "",
      }}
    />
  );
}
