import { Feather, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  // State for username input
  const [username, setUsername] = useState("");
  // State for password input
  const [password, setPassword] = useState("");
  // State to toggle password visibility
  const [showPass, setShowPass] = useState(false);
  // State for "Remember me" checkbox
  const [remember, setRemember] = useState(false);

  return (
    // Background gradient
    <LinearGradient colors={["#00C2FF", "#5B3BFF"]} style={styles.container}>
      {/* Adjust keyboard on iOS so it does not cover inputs */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        {/* ScrollView to handle small screen sizes */}
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with logo and brand name */}
          <View style={styles.header}>
            <Image
              source={require("../assets/images/logos--atlassian.png")}
              style={styles.logo}
            />
            <Text style={styles.brandText}>Nico Caceres</Text>
          </View>

          {/* White container for the login form */}
          <View style={styles.body}>
            {/* Title */}
            <Text style={styles.title}>Welcome back !</Text>

            {/* Username input with icon */}
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

            {/* Password input with toggle eye button */}
            <View style={styles.inputWrap}>
              <Feather name="lock" size={18} style={styles.inputIcon} />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#BDBDBD"
                secureTextEntry={!showPass} // Show or hide password
                value={password}
                onChangeText={setPassword}
                style={styles.input}
              />
              {/* Eye icon button to toggle password visibility */}
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

            {/* Remember me checkbox and forgot password link */}
            <View style={styles.row}>
              {/* Custom checkbox */}
              <TouchableOpacity
                style={styles.rememberBtn}
                onPress={() => setRemember((prev) => !prev)}
                activeOpacity={0.7}
              >
                {/* Checkbox square */}
                <View
                  style={[
                    styles.rememberDot,
                    remember && styles.rememberDotChecked, // Apply checked style if active
                  ]}
                >
                  {/* Check icon inside the box when active */}
                  {remember && <Feather name="check" size={10} color="#fff" />}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>

              {/* Forgot password link */}
              <TouchableOpacity>
                <Text style={styles.forgotText}>Forget password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login button with gradient background */}
            <TouchableOpacity style={styles.loginBtn}>
              <LinearGradient
                colors={["#6A5BFF", "#00B9FF"]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.loginGradient}
              >
                <Text style={styles.loginText}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign up link */}
            <View style={styles.signUpRow}>
              <Text style={styles.smallText}>New user? </Text>
              <TouchableOpacity>
                <Text style={[styles.smallText, styles.linkText]}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* Divider with OR text */}
            <View style={styles.orRow}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.line} />
            </View>

            {/* Social login buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn}>
                <FontAwesome name="twitter" size={18} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <FontAwesome name="linkedin" size={18} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <FontAwesome name="facebook" size={18} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <FontAwesome name="google" size={18} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

// Styles
const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  scroll: { flexGrow: 1 },

  // Header with logo and brand text
  header: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  logo: {
    width: 90,
    height: 90,
    resizeMode: "contain",
    marginBottom: 8,
  },
  brandText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  // Main white box for form
  body: {
    flex: 1,
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
    color: "#333",
  },

  // Input fields
  inputWrap: {
    width: "100%",
    backgroundColor: "#F3F5F8",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: { marginRight: 10, color: "#9AA0A6" },
  input: { flex: 1, fontSize: 15, paddingVertical: 8, color: "#222" },
  eyeBtn: { padding: 6 },

  // Row for remember me and forgot password
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  rememberBtn: { flexDirection: "row", alignItems: "center" },
  rememberDot: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1.6,
    borderColor: "#00B9FF",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  rememberDotChecked: {
    backgroundColor: "#00B9FF",
    borderColor: "#00B9FF",
  },
  rememberText: { color: "#666" },
  forgotText: { color: "#8f98a3" },

  // Login button
  loginBtn: {
    width: "100%",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 12,
  },
  loginGradient: { paddingVertical: 14, alignItems: "center" },
  loginText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.4,
  },

  // Sign up row
  signUpRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  smallText: { color: "#9DA3A9" },
  linkText: { color: "#4A7BFF", fontWeight: "700" },

  // OR divider
  orRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  line: { flex: 1, height: 1, backgroundColor: "#E0E0E0" },
  orText: {
    marginHorizontal: 10,
    color: "#999",
    fontWeight: "500",
  },

  // Social login row
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 10,
  },
  socialBtn: {
    width: 44,
    height: 44,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
});
