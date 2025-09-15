import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RecoverScreen() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#32408C", "#B4B9D9", "#B4B9D9"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
        >
          {/* Logo + Brand */}
          <View style={styles.header}>
            <Image
              style={styles.image}
              source="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+Cgk8ZGVmcz4KCQk8bGluZWFyR3JhZGllbnQgaWQ9IlNWR3JZRUdhYmFJIiB4MT0iOTkuNjg3JSIgeDI9IjM5LjgzNiUiIHkxPSIxNS44MDElIiB5Mj0iOTcuNDM4JSI+CgkJCTxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMzMzM2NDAiIC8+CgkJCTxzdG9wIG9mZnNldD0iOTIuMyUiIHN0b3AtY29sb3I9IiMyRTM4RjIiIC8+CgkJPC9saW5lYXJHcmFkaWVudD4KCTwvZGVmcz4KCTxwYXRoIGZpbGw9InVybCgjU1ZHcllFR2FiYUkpIiBkPSJNNzUuNzkzIDExNy45NWMtMy44Mi00LjA4LTkuNzctMy44NS0xMi4zNjcgMS4zNDJMLjc5MSAyNDQuNTY1YTcuNDg4IDcuNDg4IDAgMCAwIDYuNjk3IDEwLjgzOGg4Ny4yMjhhNy4yMiA3LjIyIDAgMCAwIDYuNjk5LTQuMTRjMTguODA4LTM4Ljg5IDcuNDEzLTk4LjAxOC0yNS42MjItMTMzLjMxNCIgLz4KCTxwYXRoIGZpbGw9IiMyRTM4RjIiIGQ9Ik0xMjEuNzU2IDQuMDExYy0zNS4wMzMgNTUuNTA1LTMyLjcyMSAxMTYuOTc5LTkuNjQ2IDE2My4xM2w0Mi4wNiA4NC4xMjFhNy40OSA3LjQ5IDAgMCAwIDYuNjk3IDQuMTRoODcuMjI3YTcuNDg4IDcuNDg4IDAgMCAwIDYuNjk3LTEwLjgzOFMxMzcuNDQ1IDkuODM3IDEzNC40OTMgMy45NjRjLTIuNjQtNS4yNTgtOS4zNDQtNS4zMy0xMi43MzcuMDQ3IiAvPgo8L3N2Zz4="
              placeholder={""}
              contentFit="cover"
              transition={1000}
            />
            <Text style={styles.brandText}>Niuppi</Text>
          </View>

          {/* Form */}
          <View style={styles.body}>
            <Text style={styles.title}>Recover Account</Text>
            <Text style={styles.subtitle}>
              Enter your email or username to reset your password.
            </Text>

            {/* Input */}
            <View style={styles.inputWrap}>
              <Feather name="mail" size={18} style={styles.inputIcon} />
              <TextInput
                placeholder="Email or Username"
                placeholderTextColor="#BDBDBD"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
              />
            </View>

            {/* Recover button */}
            <TouchableOpacity
              style={styles.recoverBtn}
              onPress={() => {
                // Aquí va la lógica para enviar recuperación
                alert("Recovery link sent!");
              }}
            >
              <Text style={styles.recoverText}>Recover Account</Text>
            </TouchableOpacity>

            {/* Back to login */}
            <View style={styles.signUpRow}>
              <Text style={styles.smallText}>Remembered? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text style={[styles.smallText, styles.linkText]}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: "flex-end" },

  header: {
    alignItems: "center",
    marginBottom: 80,
  },
  image: {
    width: 120,
    height: 120,
    marginTop: 40,
    marginBottom: 8,
  },
  brandText: {
    color: "#3037BF",
    fontSize: 20,
    fontWeight: "700",
  },

  body: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 22,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    color: "#2E38F2",
  },
  subtitle: {
    fontSize: 14,
    color: "#333640",
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.7,
  },

  inputWrap: {
    width: "100%",
    backgroundColor: "#F3F5F8",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: { marginRight: 10, color: "#9AA0A6" },
  input: { flex: 1, fontSize: 18, paddingVertical: 8, color: "#222" },

  recoverBtn: {
    backgroundColor: "#3037BF",
    width: "100%",
    borderRadius: 999,
    marginBottom: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  recoverText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },

  signUpRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 195,
  },
  smallText: { color: "#9DA3A9" },
  linkText: { color: "#3037BF", fontWeight: "700" },
});
