import { LinearGradient } from "expo-linear-gradient";
import { VideoView, useVideoPlayer } from "expo-video";
import React, { useEffect, useRef, useState } from "react";
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

function ReelItem({
  item,
  isActive,
  reelHeight,
}: {
  item: any;
  isActive: boolean;
  reelHeight: number;
}) {
  const player = useVideoPlayer(item.video, (p) => {
    p.loop = true;
  });

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player]);

  return (
    <View style={[styles.reelContainer, { height: reelHeight }]}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        fullscreenOptions={{ enable: false }}
        allowsPictureInPicture={false}
      />

      {/* Gradiente en la parte inferior para legibilidad */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.6)"]}
        style={styles.gradient}
      />

      {/* Overlay con user + caption */}
      <View style={styles.overlay}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.user}>@{item.user}</Text>
          <Text style={styles.caption}>{item.caption}</Text>
        </View>
      </View>
    </View>
  );
}

export default function ReelsScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();

  // 🟢 Ajustamos altura disponible (quita header y tabs)
  const availableHeight = height - insets.top - insets.bottom - 100;
  // 👆 el `-100` lo puedes ajustar según el alto de tus Tabs/Header

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 80 });

  return (
    <View style={styles.container}>
      <FlatList
        data={reelsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ReelItem
            item={item}
            isActive={index === currentIndex}
            reelHeight={availableHeight}
          />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={availableHeight}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewConfig.current}
        getItemLayout={(_, index) => ({
          length: availableHeight,
          offset: availableHeight * index,
          index,
        })}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 40, // deja aire sobre tabs
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  reelContainer: {
    width,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  video: { width: "100%", height: "100%" },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  overlay: {
    position: "absolute",
    bottom: 40,
    left: 20,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#fff",
  },
  user: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  caption: { color: "#fff", fontSize: 14, marginTop: 2, flexWrap: "wrap" },
});
