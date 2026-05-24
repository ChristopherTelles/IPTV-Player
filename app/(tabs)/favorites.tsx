import React, { useCallback } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { ChannelCard } from "@/components/ChannelCard";
import { EmptyState } from "@/components/EmptyState";
import { useColors } from "@/hooks/use-colors";
import { useIPTV } from "@/context/IPTVContext";
import { Channel } from "@/types/iptv";

export default function FavoritesScreen() {
  const colors = useColors();
  const router = useRouter();
  const { getFavoriteChannels, toggleFavorite, isFavorite, setLastChannel } = useIPTV();

  const favorites = getFavoriteChannels();

  const handleChannelPress = useCallback(async (channel: Channel) => {
    await setLastChannel(channel);
    router.push({ pathname: "/player", params: { channelId: channel.id } });
  }, [setLastChannel, router]);

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Favoritos</Text>
        {favorites.length > 0 && (
          <Text style={[styles.headerCount, { color: colors.muted }]}>
            {favorites.length} canal{favorites.length !== 1 ? "is" : ""}
          </Text>
        )}
      </View>

      {favorites.length === 0 ? (
        <EmptyState
          icon="favorite-border"
          title="Nenhum favorito ainda"
          subtitle="Toque no ícone de coração em qualquer canal para adicioná-lo aqui"
          action={
            <Pressable
              onPress={() => router.push("/(tabs)/channels")}
              style={[styles.browseBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.browseBtnText}>Explorar Canais</Text>
            </Pressable>
          }
        />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChannelCard
              channel={item}
              isFavorite={isFavorite(item.id)}
              onPress={() => handleChannelPress(item)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              variant="list"
            />
          )}
          showsVerticalScrollIndicator={false}
          initialNumToRender={20}
          getItemLayout={(_, index) => ({ length: 72, offset: 72 * index, index })}
        />
      )}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  headerCount: {
    fontSize: 14,
  },
  browseBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  browseBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
