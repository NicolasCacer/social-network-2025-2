import CameraModal from "@/components/cameraModal";
import { DataContext } from "@/context/DataContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const screenHeight = Dimensions.get("window").height;

export default function CreatePostWithCamera() {
  const { createPost } = useContext(DataContext);
  const insets = useSafeAreaInsets();

  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState<string | null>(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Resetear flujo cuando se cambia de pestaña
  useFocusEffect(
    useCallback(() => {
      // cuando entra en foco no hacemos nada
      return () => {
        // al salir de foco, resetear todo
        setCaption("");
        setMedia(null);
        setShowInput(false);
      };
    }, [])
  );

  const handleSelectMedia = (uri: string) => {
    setMedia(uri);
    setShowInput(true);
  };

  const handlePost = async () => {
    if (!media && !caption.trim()) {
      alert("Agrega una foto o escribe un texto");
      return;
    }
    const type = media?.endsWith(".mp4") ? "video" : media ? "image" : "text";

    const { error } = await createPost(type, caption, media || undefined);
    if (error) {
      alert("Error al crear el post");
      return;
    }

    alert("Post creado!");
    setCaption("");
    setMedia(null);
    setShowInput(false);
  };

  const removeMedia = () => setMedia(null);

  // Ajuste del teclado
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Pantalla inicial */}
          {!showInput && !media && (
            <TouchableOpacity
              style={styles.centerIconContainer}
              onPress={() => setShowInput(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.centerIcon}>➕</Text>
              <Text style={styles.centerText}>Crear un nuevo post</Text>
            </TouchableOpacity>
          )}

          {/* Selección de media */}
          {(showInput || media) && (
            <View
              style={[
                styles.mediaWrapper,
                {
                  height: media ? screenHeight * 0.65 : undefined,
                  flex: media ? undefined : 1,
                },
              ]}
            >
              {media ? (
                <>
                  <Image source={{ uri: media }} style={styles.mediaPreview} />
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={removeMedia}
                  >
                    <Text style={styles.removeText}>✕</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.pickMediaContainer}>
                  <TouchableOpacity
                    style={styles.pickMediaBtn}
                    onPress={() => setCameraVisible(true)}
                  >
                    <Text style={styles.pickMediaText}>
                      Seleccionar foto o video
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Barra de mensaje */}
          {showInput && (
            <View
              style={[
                styles.inputBar,
                {
                  marginBottom:
                    Platform.OS === "ios"
                      ? keyboardHeight - 10 || insets.bottom
                      : insets.bottom || 8,
                },
              ]}
            >
              <TextInput
                style={styles.captionInput}
                placeholder="Escribe un mensaje..."
                placeholderTextColor={colors.placeholder}
                value={caption}
                onChangeText={setCaption}
                multiline
              />
              <TouchableOpacity style={styles.sendBtn} onPress={handlePost}>
                <FontAwesome name="send" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}

          {/* Modal de cámara */}
          <CameraModal
            visible={cameraVisible}
            onClose={() => setCameraVisible(false)}
            onSelect={handleSelectMedia}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const colors = {
  background: "#fafafa",
  card: "#fff",
  primary: "#3897f0",
  input: "#f0f0f0",
  text: "#333",
  placeholder: "#999",
  removeBtn: "rgba(0,0,0,0.4)",
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", // centrado horizontal
    padding: 20,
  },

  centerIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  centerIcon: { fontSize: 60, color: "#bbb", marginBottom: 12 },
  centerText: { fontSize: 18, color: "#888" },

  mediaWrapper: {
    width: "100%",
    borderRadius: 12,
    marginVertical: 10,
    minHeight: 550,
    position: "relative",
    overflow: "hidden",
    backgroundColor: colors.input,
    justifyContent: "center",
    alignItems: "center",
  },
  mediaPreview: { width: "100%", height: "100%", borderRadius: 12 },
  removeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: colors.removeBtn,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  removeText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  pickMediaContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  pickMediaBtn: {
    borderWidth: 2,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  pickMediaText: { color: "#888", fontSize: 16 },

  inputBar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "lightgray",
    backgroundColor: colors.card,
    borderRadius: 15,
  },
  captionInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.input,
    color: colors.text,
    fontSize: 16,
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingRight: 16,
    paddingLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  sendText: { color: "#fff", fontWeight: "bold" },
});
