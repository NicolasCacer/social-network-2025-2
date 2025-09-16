import { Ionicons } from "@expo/vector-icons"; //  iconos de play/pause
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useIsFocused } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { VideoView, useVideoPlayer } from "expo-video";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height, width } = Dimensions.get("window");

const reelsData = [
  {
    id: "1",
    image:
      "https://wallpapers.com/images/hd/vertical-pictures-d8n9viqi1q14gwj2.jpg", //  imagen vertical
    user: "photofan",
    caption: "Un reel con imagen 📸",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    id: "2",
    video:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    user: "epicfilms",
    caption: "Tears of Steel",
    avatar: "https://i.pravatar.cc/150?img=14",
  },
  {
    id: "3",
    video:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    user: "bunnylover",
    caption: "Big Buck Bunny 🐰",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: "4",
    video:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    user: "dreamer",
    caption: "Elephant’s Dream 🌙",
    avatar: "https://i.pravatar.cc/150?img=12",
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
  const player = useVideoPlayer(item.video || "", (p) => {
    p.loop = true;
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (item.video) {
      if (isActive) {
        player.play();
        setIsPlaying(true);
      } else {
        player.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive, player, item.video]);

  const togglePlayPause = () => {
    if (!item.video) return; //  no aplica a imágenes

    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }

    fadeAnim.setValue(1);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={[styles.reelContainer, { height: reelHeight }]}>
      {/* Imagen */}
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.media}
          resizeMode="cover"
        />
      )}

      {/* Video con play/pause */}
      {item.video && (
        <TouchableWithoutFeedback onPress={togglePlayPause}>
          <View style={{ flex: 1, width: "100%" }}>
            <VideoView
              player={player}
              style={styles.media}
              contentFit="contain"
              allowsPictureInPicture={false}
              fullscreenOptions={{ enable: false }}
              nativeControls={false}
            />

            {/* Ícono overlay */}
            <Animated.View
              style={[
                styles.iconOverlay,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              <View style={styles.iconBackground}>
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={50}
                  color="white"
                />
              </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* Gradiente */}
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
  const tabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocused();

  const availableHeight = height - insets.top - insets.bottom - tabBarHeight;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={reelsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ReelItem
            item={item}
            isActive={isFocused && index === currentIndex}
            reelHeight={availableHeight}
          />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={availableHeight}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 80 }}
        getItemLayout={(_, index) => ({
          length: availableHeight,
          offset: availableHeight * index,
          index,
        })}
        contentContainerStyle={{ paddingBottom: tabBarHeight }}
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
  media: { width: "100%", height: "100%" }, //  funciona igual para video e imagen
  iconOverlay: {
    position: "absolute",
    top: "45%",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBackground: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 50,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
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
