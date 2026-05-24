import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/screen-container";
import { ChannelCard } from "@/components/ChannelCard";
import { EmptyState } from "@/components/EmptyState";
import { useColors } from "@/hooks/use-colors";
import { useIPTV } from "@/context/IPTVContext";
import { Channel } from "@/types/iptv";
import { getGroups, filterChannels } from "@/lib/m3u-parser";

export default function ChannelsScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ group?: string }>();
  const { state, toggleFavorite, isFavorite, setLastChannel } = useIPTV();

  const [query, setQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(params.group || "Todos");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const groups = useMemo(() => getGroups(state.channels), [state.channels]);
  const filtered = useMemo(
    () => filterChannels(state.channels, query, selectedGroup),
    [state.channels, query, selectedGroup]
  );

  const handleChannelPress = useCallback(async (channel: Channel) => {
    await setLastChannel(channel);
    router.push({ pathname: "/player", params: { channelId: channel.id } });
  }, [setLastChannel, router]);

  const handleToggleFavorite = useCallback((channelId: string) => {
    toggleFavorite(channelId);
  }, [toggleFavorite]);

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Canais</Text>
        <Pressable
          onPress={() => setViewMode(viewMode === "list" ? "grid" : "list")}
          style={({ pressed }) => [styles.viewModeBtn, pressed && { opacity: 0.6 }]}
        >
          <MaterialIcons
            name={viewMode === "list" ? "grid-view" : "list"}
            size={24}
            color={colors.foreground}
          />
        </Pressable>
      </View>

      {/* Search bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <MaterialIcons name="search" size={20} color={colors.muted} />
        <TextInput
          style={[styles.searchInput, { color: colors.foreground }]}
          placeholder="Buscar canal..."
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")} hitSlop={8}>
            <MaterialIcons name="cancel" size={18} color={colors.muted} />
          </Pressable>
        )}
      </View>

      {/* Group filter */}
      {groups.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.groupsScroll, { borderBottomColor: colors.border }]}
          contentContainerStyle={styles.groupsContent}
        >
          {groups.map((group) => {
            const active = selectedGroup === group;
            return (
              <Pressable
                key={group}
                onPress={() => setSelectedGroup(group)}
                style={({ pressed }) => [
                  styles.groupChip,
                  active
                    ? { backgroundColor: colors.primary }
                    : { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: StyleSheet.hairlineWidth },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text
                  style={[
                    styles.groupChipText,
                    { color: active ? "#fff" : colors.foreground },
                  ]}
                >
                  {group}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {/* Channel count */}
      {state.channels.length > 0 && (
        <View style={styles.countBar}>
          <Text style={[styles.countText, { color: colors.muted }]}>
            {filtered.length} canal{filtered.length !== 1 ? "is" : ""}
          </Text>
        </View>
      )}

      {/* Channel list */}
      {state.isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : state.channels.length === 0 ? (
        <EmptyState
          icon="live-tv"
          title="Nenhum canal disponível"
          subtitle="Adicione uma playlist M3U nas configurações"
          action={
            <Pressable
              onPress={() => router.push("/(tabs)/settings")}
              style={[styles.addBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.addBtnText}>Ir para Configurações</Text>
            </Pressable>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="search-off"
          title="Nenhum resultado"
          subtitle={`Nenhum canal encontrado para "${query}"`}
        />
      ) : viewMode === "list" ? (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChannelCard
              channel={item}
              isFavorite={isFavorite(item.id)}
              onPress={() => handleChannelPress(item)}
              onToggleFavorite={() => handleToggleFavorite(item.id)}
              variant="list"
            />
          )}
          showsVerticalScrollIndicator={false}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={10}
          getItemLayout={(_, index) => ({ length: 72, offset: 72 * index, index })}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={({ item }) => (
            <ChannelCard
              channel={item}
              isFavorite={isFavorite(item.id)}
              onPress={() => handleChannelPress(item)}
              onToggleFavorite={() => handleToggleFavorite(item.id)}
              variant="grid"
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContent}
          initialNumToRender={30}
          maxToRenderPerBatch={30}
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
  viewModeBtn: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 12,
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
  groupsScroll: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  groupsContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  groupChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 4,
  },
  groupChipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  countBar: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  countText: {
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  gridContent: {
    padding: 8,
  },
});
