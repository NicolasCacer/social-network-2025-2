import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function TabsLayout() {
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: "",
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 20, marginBottom: 10 }}
            onPress={() => {
              // Clean session
              router.replace("/(auth)/login");
            }}
          >
            <Ionicons name="log-out-outline" size={24} color="#333" />
          </TouchableOpacity>
        ),
        headerShadowVisible: true,
      }}
    >
      <Tabs.Screen
        name="main"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
