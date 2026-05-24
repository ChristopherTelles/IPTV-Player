import React, { useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useIPTV } from "@/context/IPTVContext";
import { Channel } from "@/types/iptv";
import { getGroups } from "@/lib/m3u-parser";

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { state, toggleFavorite, isFavorite, setLastChannel } = useIPTV();

  const groups = useMemo(() => getGroups(state.channels).slice(1, 8), [state.channels]);
  const favoriteChannels = useMemo(
    () => state.channels.filter((ch) => state.favorites.includes(ch.id)).slice(0, 10),
    [state.channels, state.favorites]
  );
  const recentChannels = useMemo(() => state.channels.slice(0, 12), [state.channels]);

  const handleChannelPress = async (channel: Channel) => {
    await setLastChannel(channel);
    router.push({ pathname: "/player", params: { channelId: channel.id } });
  };

  if (state.isLoading) {
    return (
      <ScreenContainer containerClassName="bg-background">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.muted }]}>
            {state.loadingMessage || "Carregando..."}
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="live-tv" size={28} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>IPTV Player</Text>
        </View>
        <Pressable
          onPress={() => router.push("/search")}
          style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.6 }]}
        >
          <MaterialIcons name="search" size={26} color={colors.foreground} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {state.channels.length === 0 ? (
          /* Empty state */
          <View style={styles.emptyContainer}>
            <MaterialIcons name="live-tv" size={80} color={colors.muted} style={{ opacity: 0.4 }} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Nenhuma playlist adicionada
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
              Adicione uma lista M3U nas configurações para começar a assistir
            </Text>
            <Pressable
              onPress={() => router.push("/(tabs)/settings")}
              style={({ pressed }) => [
                styles.emptyBtn,
                { backgroundColor: colors.primary },
                pressed && { opacity: 0.8 },
              ]}
            >
              <MaterialIcons name="add" size={20} color="#fff" />
              <Text style={styles.emptyBtnText}>Adicionar Playlist</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Last watched */}
            {state.lastChannel && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                  Assistindo Agora
                </Text>
                <Pressable
                  onPress={() => handleChannelPress(state.lastChannel!)}
                  style={({ pressed }) => [
                    styles.lastChannelCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <View style={[styles.lastChannelLogo, { backgroundColor: colors.primary + "22" }]}>
                    {state.lastChannel.logo ? (
                      <Image
                        source={{ uri: state.lastChannel.logo }}
                        style={styles.lastChannelLogoImg}
                        resizeMode="contain"
                      />
                    ) : (
                      <Text style={[styles.lastChannelLogoText, { color: colors.primary }]}>
                        {state.lastChannel.name.charAt(0).toUpperCase()}
                      </Text>
                    )}
                  </View>
                  <View style={styles.lastChannelInfo}>
                    <Text style={[styles.lastChannelName, { color: colors.foreground }]} numberOfLines={1}>
                      {state.lastChannel.name}
                    </Text>
                    <Text style={[styles.lastChannelGroup, { color: colors.muted }]} numberOfLines={1}>
                      {state.lastChannel.group}
                    </Text>
                  </View>
                  <View style={[styles.playBadge, { backgroundColor: colors.primary }]}>
                    <MaterialIcons name="play-arrow" size={20} color="#fff" />
                  </View>
                </Pressable>
              </View>
            )}

            {/* Categories */}
            {groups.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Categorias</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
                  {groups.map((group) => (
                    <Pressable
                      key={group}
                      onPress={() => router.push({ pathname: "/(tabs)/channels", params: { group } })}
                      style={({ pressed }) => [
                        styles.categoryChip,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                        pressed && { opacity: 0.7 },
                      ]}
                    >
                      <Text style={[styles.categoryChipText, { color: colors.foreground }]}>
                        {group}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Favorites */}
            {favoriteChannels.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Favoritos</Text>
                  <Pressable onPress={() => router.push("/(tabs)/favorites")}>
                    <Text style={[styles.seeAll, { color: colors.primary }]}>Ver todos</Text>
                  </Pressable>
                </View>
                <FlatList
                  data={favoriteChannels}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.horizontalList}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => handleChannelPress(item)}
                      style={({ pressed }) => [
                        styles.favCard,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                        pressed && { opacity: 0.75 },
                      ]}
                    >
                      <View style={[styles.favLogo, { backgroundColor: colors.primary + "22" }]}>
                        {item.logo ? (
                          <Image source={{ uri: item.logo }} style={styles.favLogoImg} resizeMode="contain" />
                        ) : (
                          <Text style={[styles.favLogoText, { color: colors.primary }]}>
                            {item.name.charAt(0).toUpperCase()}
                          </Text>
                        )}
                      </View>
                      <Text style={[styles.favName, { color: colors.foreground }]} numberOfLines={2}>
                        {item.name}
                      </Text>
                    </Pressable>
                  )}
                />
              </View>
            )}

            {/* All channels */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                  Canais ({state.channels.length})
                </Text>
                <Pressable onPress={() => router.push("/(tabs)/channels")}>
                  <Text style={[styles.seeAll, { color: colors.primary }]}>Ver todos</Text>
                </Pressable>
              </View>
              <View style={styles.channelGrid}>
                {recentChannels.map((channel) => (
                  <Pressable
                    key={channel.id}
                    onPress={() => handleChannelPress(channel)}
                    style={({ pressed }) => [
                      styles.gridCard,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                      pressed && { opacity: 0.75 },
                    ]}
                  >
                    <View style={[styles.gridLogo, { backgroundColor: colors.primary + "22" }]}>
                      {channel.logo ? (
                        <Image source={{ uri: channel.logo }} style={styles.gridLogoImg} resizeMode="contain" />
                      ) : (
                        <Text style={[styles.gridLogoText, { color: colors.primary }]}>
                          {channel.name.charAt(0).toUpperCase()}
                        </Text>
                      )}
                    </View>
                    <Text style={[styles.gridName, { color: colors.foreground }]} numberOfLines={2}>
                      {channel.name}
                    </Text>
                    <Pressable
                      onPress={() => toggleFavorite(channel.id)}
                      hitSlop={8}
                      style={styles.gridFav}
                    >
                      <MaterialIcons
                        name={isFavorite(channel.id) ? "favorite" : "favorite-border"}
                        size={14}
                        color={isFavorite(channel.id) ? "#EF4444" : colors.muted}
                      />
                    </Pressable>
                  </Pressable>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  headerBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    marginTop: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 26,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 24,
  },
  emptyBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
  },
  lastChannelCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  lastChannelLogo: {
    width: 56,
    height: 56,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  lastChannelLogoImg: {
    width: 56,
    height: 56,
  },
  lastChannelLogoText: {
    fontSize: 22,
    fontWeight: "700",
  },
  lastChannelInfo: {
    flex: 1,
  },
  lastChannelName: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
  },
  lastChannelGroup: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  playBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  categoriesScroll: {
    marginLeft: -4,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  horizontalList: {
    paddingRight: 8,
  },
  favCard: {
    width: 88,
    padding: 10,
    borderRadius: 12,
    marginRight: 10,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  favLogo: {
    width: 52,
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 6,
  },
  favLogoImg: {
    width: 52,
    height: 52,
  },
  favLogoText: {
    fontSize: 20,
    fontWeight: "700",
  },
  favName: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 14,
  },
  channelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  gridCard: {
    width: "31%",
    margin: "1%",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 110,
  },
  gridLogo: {
    width: 52,
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 6,
  },
  gridLogoImg: {
    width: 52,
    height: 52,
  },
  gridLogoText: {
    fontSize: 20,
    fontWeight: "700",
  },
  gridName: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 14,
    flex: 1,
  },
  gridFav: {
    marginTop: 4,
  },
});
