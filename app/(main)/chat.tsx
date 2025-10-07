import { AuthContext } from "@/context/AuthContext";
import { DataContext } from "@/context/DataContext";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface LastMessage {
  text?: string;
  sent_at?: string;
  seen_at?: string | null;
  sent_by?: string;
}

interface Participant {
  id: string;
  name: string;
  username?: string;
  avatar_url?: string;
}

interface ChatItem {
  id?: string; // chat id
  chatId?: string;
  name: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  lastMessage?: LastMessage;
  participant?: Participant;
  user_id_1?: string;
  user_id_2?: string;
  _uniqueKey?: string; // NUEVO: key única incremental
}

interface Section {
  title: string;
  data: ChatItem[];
}

export default function ChatList() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { profiles, chats, getProfiles, getUserChats, createChat } =
    useContext(DataContext);

  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [localProfiles, setLocalProfiles] = useState<ChatItem[]>([]);
  const [localChats, setLocalChats] = useState<ChatItem[]>([]);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      await getProfiles();
      if (user?.id) await getUserChats(user.id);
    };
    fetchData();
  }, [user, getProfiles, getUserChats]);

  // Mantener estados locales actualizados con _uniqueKey
  useEffect(() => {
    const chatsWithKey: ChatItem[] = chats.map((c: any, index: any) => ({
      ...c,
      _uniqueKey: `${c.chatId ?? c.id ?? "chat"}-${index}`,
    }));
    setLocalChats(chatsWithKey);
  }, [chats]);

  useEffect(() => {
    const profilesWithKey: ChatItem[] = profiles.map((p: any, index: any) => ({
      ...p,
      _uniqueKey: `${p.id ?? "profile"}-${index}`,
    }));
    setLocalProfiles(profilesWithKey);
  }, [profiles]);

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
    );
  };

  const filteredProfiles = localProfiles
    .filter((p) => !localChats.some((c) => c.participant?.id === p.id))
    .filter((p) =>
      (p.username ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleCreateChat = async (profile: ChatItem) => {
    if (!user?.id || !profile.id) return;

    const { data: newChat, error } = await createChat(profile.id);
    if (error || !newChat) return;

    const chatItem: ChatItem = {
      id: newChat.id,
      chatId: newChat.id,
      name: profile.name,
      username: profile.username,
      avatar_url: profile.avatar_url,
      participant: { ...profile } as Participant,
      user_id_1: user.id,
      user_id_2: profile.id,
      _uniqueKey: `chat-${newChat.id}`,
    };

    setLocalChats((prev) => [chatItem, ...prev]);
    setLocalProfiles((prev) => prev.filter((p) => p.id !== profile.id));
  };

  const sections: Section[] = [
    { title: "Mis chats", data: localChats },
    { title: "Explorar perfiles", data: filteredProfiles },
  ];

  const renderItem = ({
    item,
    section,
  }: SectionListRenderItemInfo<ChatItem, Section>) => {
    if (collapsedSections.includes(section.title)) return null;

    const lastMessage = item.lastMessage?.text ?? "";
    const lastMessageTime = item.lastMessage?.sent_at
      ? new Date(item.lastMessage.sent_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "";

    const seenIcon = item.lastMessage?.sent_at ? (
      item.lastMessage?.seen_at ? (
        <View style={styles.seenRow}>
          <Text style={[styles.seenIcon, { color: "#2E38F2" }]}>✓</Text>
          <Text style={[styles.seenIcon, { color: "#2E38F2", marginLeft: -3 }]}>
            ✓
          </Text>
        </View>
      ) : (
        <View style={styles.seenRow}>
          <Text style={[styles.seenIcon, { color: "#2E38F2" }]}>✓</Text>
          <Text style={[styles.seenIcon, { color: "#999", marginLeft: -3 }]}>
            ✓
          </Text>
        </View>
      )
    ) : (
      <View style={styles.seenRow}>
        <Text style={[styles.seenIcon, { color: "#999" }]}>✓</Text>
      </View>
    );

    if (section.title === "Mis chats") {
      if (!item.participant) return null;

      return (
        <TouchableOpacity
          key={item._uniqueKey}
          activeOpacity={0.7}
          style={styles.chatItem}
          onPress={() =>
            router.push({
              pathname: "/(chats)/[id]",
              params: {
                id: item.chatId!,
                name: item.participant?.username,
                avatar: item.participant?.avatar_url,
              },
            })
          }
        >
          <Image
            source={{
              uri:
                item.participant.avatar_url ??
                "https://static.vecteezy.com/system/resources/thumbnails/036/280/651/small_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg",
            }}
            style={styles.avatar}
          />
          <View style={styles.chatContent}>
            <View style={styles.row}>
              <Text style={styles.name}>@{item.participant.username}</Text>
              <Text style={styles.time}>{lastMessageTime}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {lastMessage}
              </Text>
              {seenIcon}
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    // Explorar perfiles
    return (
      <TouchableOpacity
        key={item._uniqueKey}
        activeOpacity={0.7}
        style={styles.chatItem}
        onPress={() => handleCreateChat(item)}
      >
        <Image
          source={{
            uri:
              item.avatar_url ??
              "https://static.vecteezy.com/system/resources/thumbnails/036/280/651/small_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg",
          }}
          style={styles.avatar}
        />
        <View style={styles.chatContent}>
          <View style={styles.row}>
            <Text style={styles.name}>@{item.username}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.bio ?? "Sin bio"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({
    section,
  }: {
    section: SectionListData<ChatItem, Section>;
  }) => {
    const isCollapsed = collapsedSections.includes(section.title);
    return (
      <View>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(section.title)}
        >
          <Text style={styles.sectionHeaderText}>{section.title}</Text>
          <Text style={styles.sectionToggle}>{isCollapsed ? "▼" : "▲"}</Text>
        </TouchableOpacity>

        {section.title === "Explorar perfiles" && !isCollapsed && (
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar perfiles..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) =>
          item._uniqueKey ?? item.id ?? Math.random().toString()
        }
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#2E38F2",
    borderBottomWidth: 1,
    borderBottomColor: "#B4B9D9",
  },
  sectionHeaderText: { fontWeight: "bold", fontSize: 16, color: "#fff" },
  sectionToggle: { fontSize: 14, color: "#B4B9D9" },

  searchInput: {
    backgroundColor: "#f9f9f9",
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#B4B9D9",
    fontSize: 14,
    color: "#333640",
  },

  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: { width: 52, height: 52, borderRadius: 26, marginRight: 14 },

  chatContent: { flex: 1, flexDirection: "column", justifyContent: "center" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },

  name: { fontWeight: "bold", fontSize: 16, color: "#2E38F2" },
  lastMessage: { color: "#666", fontSize: 13, flexShrink: 1, maxWidth: "85%" },
  time: { fontSize: 12, color: "#666" },

  seenRow: { flexDirection: "row", alignItems: "center" },
  seenIcon: { fontSize: 18, fontWeight: "600" },
});
