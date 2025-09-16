import { AuthContext } from "@/context/AuthContext";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const context = useContext(AuthContext);

  const handleRegister = async () => {
    if (!email || !password || !username) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }
    if (password !== confirmPass) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await context.register(email, password, username);
    } catch (error) {
      console.log(error);
      Alert.alert("Error al registrar");
      return;
    }
    setLoading(false);

    Alert.alert(
      "Registro exitoso",
      "Revisa tu correo para confirmar la cuenta."
    );
    router.push("/(auth)/login");
  };

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
          {/* Logo + Name */}
          <View style={styles.header}>
            <Image
              style={styles.image}
              source="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+Cgk8ZGVmcz4KCQk8bGluZWFyR3JhZGllbnQgaWQ9IlNWR3JZRUdhYmFJIiB4MT0iOTkuNjg3JSIgeDI9IjM5LjgzNiUiIHkxPSIxNS44MDElIiB5Mj0iOTcuNDM4JSI+CgkJCTxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMzMzM2NDAiIC8+CgkJCTxzdG9wIG9mZnNldD0iOTIuMyUiIHN0b3AtY29sb3I9IiMyRTM4RjIiIC8+CgkJPC9saW5lYXJHcmFkaWVudD4KCTwvZGVmcz4KCTxwYXRoIGZpbGw9InVybCgjU1ZHcllFR2FiYUkpIiBkPSJNNzUuNzkzIDExNy45NWMtMy44Mi00LjA4LTkuNzctMy44NS0xMi4zNjcgMS4zNDJMLjc5MSAyNDQuNTY1YTcuNDg4IDcuNDg4IDAgMCAwIDYuNjk3IDEwLjgzOGg4Ny4yMjhhNy4yMiA3LjIyIDAgMCAwIDYuNjk5LTQuMTRjMTguODA4LTM4Ljg5IDcuNDEzLTk4LjAxOC0yNS42MjItMTMzLjMxNCIgLz4KCTxwYXRoIGZpbGw9IiMyRTM4RjIiIGQ9Ik0xMjEuNzU2IDQuMDExYy0zNS4wMzMgNTUuNTA1LTMyLjcyMSAxMTYuOTc5LTkuNjQ2IDE2My4xM2w0Mi4wNiA4NC4xMjFhNy40OSA3LjQ5IDAgMCAwIDYuNjk3IDQuMTRoODcuMjI3YTcuNDg4IDcuNDg4IDAgMCAwIDYuNjk3LTEwLjgzOFMxMzcuNDQ1IDkuODM3IDEzNC40OTMgMy45NjRjLTIuNjQtNS4yNTgtOS4zNDQtNS4zMy0xMi43MzcuMDQ3IiAvPgo8L3N2Zz4="
              placeholder={""}
              contentFit="cover"
            />
            <Text style={styles.brandText}>Niuppi</Text>
          </View>

          {/* Registration form */}
          <View style={styles.body}>
            <Text style={styles.title}>Create an Account</Text>

            {/* Email */}
            <View style={styles.inputWrap}>
              <Feather name="mail" size={18} style={styles.inputIcon} />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#BDBDBD"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="username"
                autoComplete="email"
                style={styles.input}
              />
            </View>

            {/* Username */}
            <View style={styles.inputWrap}>
              <Feather name="user" size={18} style={styles.inputIcon} />
              <TextInput
                placeholder="Username"
                placeholderTextColor="#BDBDBD"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
              />
            </View>

            {/* Password */}
            <View style={styles.inputWrap}>
              <Feather name="lock" size={18} style={styles.inputIcon} />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#BDBDBD"
                secureTextEntry={!showPass}
                value={password}
                onChangeText={setPassword}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => setShowPass((s) => !s)}
                style={styles.eyeBtn}
              >
                <Feather
                  name={showPass ? "eye" : "eye-off"}
                  size={16}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputWrap}>
              <Feather name="lock" size={18} style={styles.inputIcon} />
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#BDBDBD"
                secureTextEntry={!showConfirm}
                value={confirmPass}
                onChangeText={setConfirmPass}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => setShowConfirm((s) => !s)}
                style={styles.eyeBtn}
              >
                <Feather
                  name={showConfirm ? "eye" : "eye-off"}
                  size={16}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerText}>
                {loading ? "Registering..." : "Register"}
              </Text>
            </TouchableOpacity>

            {/* Go back to login */}
            <View style={styles.signUpRow}>
              <Text style={styles.smallText}>Already have an account? </Text>
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
    marginBottom: 16,
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
    marginBottom: 20,
    color: "#2E38F2",
  },

  inputWrap: {
    width: "100%",
    backgroundColor: "#F3F5F8",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: { marginRight: 10, color: "#9AA0A6" },
  input: { flex: 1, fontSize: 18, paddingVertical: 8, color: "#222" },
  eyeBtn: { padding: 6 },

  registerBtn: {
    backgroundColor: "#3037BF",
    width: "100%",
    borderRadius: 999,
    marginBottom: 18,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 30,
  },
  registerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },

  signUpRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 65,
  },
  smallText: { color: "#9DA3A9" },
  linkText: { color: "#3037BF", fontWeight: "700" },
});
