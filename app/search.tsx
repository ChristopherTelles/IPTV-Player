import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/screen-container";
import { ChannelCard } from "@/components/ChannelCard";
import { useColors } from "@/hooks/use-colors";
import { useIPTV } from "@/context/IPTVContext";
import { Channel } from "@/types/iptv";

export default function SearchScreen() {
  const colors = useColors();
  const router = useRouter();
  const { state, toggleFavorite, isFavorite, setLastChannel } = useIPTV();

  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return state.channels.filter(
      (ch) =>
        ch.name.toLowerCase().includes(q) ||
        ch.group.toLowerCase().includes(q)
    ).slice(0, 50);
  }, [state.channels, query]);

  const handleChannelPress = useCallback(async (channel: Channel) => {
    await setLastChannel(channel);
    router.push({ pathname: "/player", params: { channelId: channel.id } });
  }, [setLastChannel, router]);

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Search header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MaterialIcons name="search" size={20} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Buscar canais..."
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} hitSlop={8}>
              <MaterialIcons name="cancel" size={18} color={colors.muted} />
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.cancelBtn, pressed && { opacity: 0.6 }]}
        >
          <Text style={[styles.cancelText, { color: colors.primary }]}>Cancelar</Text>
        </Pressable>
      </View>

      {query.trim() === "" ? (
        <View style={styles.placeholder}>
          <MaterialIcons name="search" size={56} color={colors.muted} style={{ opacity: 0.3 }} />
          <Text style={[styles.placeholderText, { color: colors.muted }]}>
            Digite para buscar canais
          </Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.placeholder}>
          <MaterialIcons name="search-off" size={56} color={colors.muted} style={{ opacity: 0.3 }} />
          <Text style={[styles.placeholderText, { color: colors.muted }]}>
            Nenhum canal encontrado para "{query}"
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.resultsCount}>
            <Text style={[styles.resultsCountText, { color: colors.muted }]}>
              {results.length} resultado{results.length !== 1 ? "s" : ""}
            </Text>
          </View>
          <FlatList
            data={results}
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
            keyboardShouldPersistTaps="handled"
            initialNumToRender={20}
            getItemLayout={(_, index) => ({ length: 72, offset: 72 * index, index })}
          />
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
  },
  cancelBtn: {
    paddingHorizontal: 4,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "600",
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
  },
  placeholderText: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  resultsCount: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsCountText: {
    fontSize: 12,
  },
});
