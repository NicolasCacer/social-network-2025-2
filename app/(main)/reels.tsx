import { Video } from "expo-av";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height, width } = Dimensions.get("window");

const reelsData = [
  {
    id: "1",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    user: "user1",
    caption: "Este es un reel de prueba 🎥",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    video: "https://www.w3schools.com/html/movie.mp4",
    user: "user2",
    caption: "Otro reel 🔥",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
];

const channels = [
  { id: "c1", avatar: "https://i.pravatar.cc/150?img=11", name: "canal1" },
  { id: "c2", avatar: "https://i.pravatar.cc/150?img=12", name: "canal2" },
  { id: "c3", avatar: "https://i.pravatar.cc/150?img=13", name: "canal3" },
  { id: "c4", avatar: "https://i.pravatar.cc/150?img=14", name: "canal4" },
  { id: "c5", avatar: "https://i.pravatar.cc/150?img=15", name: "canal5" },
];

export default function ReelsScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef<(Video | null)[]>([]);
  const insets = useSafeAreaInsets(); // 👉 detecta espacio seguro (incluye tab bar en iOS/Android)

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 80 });

  return (
    <View style={styles.container}>
      {/* Lista vertical de reels */}
      <FlatList
        data={reelsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.reelContainer}>
            <Video
              ref={(ref) => (videoRefs.current[index] = ref)}
              source={{ uri: item.video }}
              style={styles.video}
              resizeMode="contain"
              shouldPlay={index === currentIndex}
              isLooping
            />

            {/* Overlay con avatar y caption */}
            <View style={styles.overlay}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View>
                <Text style={styles.user}>@{item.user}</Text>
                <Text style={styles.caption}>{item.caption}</Text>
              </View>
            </View>
          </View>
        )}
        pagingEnabled
        horizontal={false}
        showsVerticalScrollIndicator={false}
        snapToInterval={height * 0.7} // reel ocupa 70% pantalla
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewConfig.current}
        contentContainerStyle={{ paddingBottom: insets.bottom + 70 }}
        // 👆 espacio extra para que no choque con la tab bar
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  channelsContainer: {
    height: 100,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
  },
  channelItem: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  channelAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#fff",
  },
  channelName: {
    marginTop: 5,
    fontSize: 12,
    color: "#fff",
  },
  reelContainer: {
    width,
    height: height * 0.7,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    marginBottom: 50,
    borderRadius: 15,
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  user: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  caption: {
    color: "#fff",
    fontSize: 14,
  },
});
