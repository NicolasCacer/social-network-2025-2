import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide default header
        contentStyle: {
          backgroundColor: "transparent", // Make screen background transparent
        },
      }}
    />
  );
}
