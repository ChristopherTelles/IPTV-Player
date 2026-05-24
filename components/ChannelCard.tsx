import React, { memo } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import { Channel } from "@/types/iptv";

interface ChannelCardProps {
  channel: Channel;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
  variant?: "list" | "grid";
}

export const ChannelCard = memo(function ChannelCard({
  channel,
  isFavorite,
  onPress,
  onToggleFavorite,
  variant = "list",
}: ChannelCardProps) {
  const colors = useColors();

  if (variant === "grid") {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.gridCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
          pressed && { opacity: 0.75 },
        ]}
      >
        <View style={styles.gridLogoContainer}>
          {channel.logo ? (
            <Image
              source={{ uri: channel.logo }}
              style={styles.gridLogo}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.gridLogoFallback, { backgroundColor: colors.primary + "22" }]}>
              <Text style={[styles.gridLogoFallbackText, { color: colors.primary }]}>
                {channel.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <Text
          style={[styles.gridName, { color: colors.foreground }]}
          numberOfLines={2}
        >
          {channel.name}
        </Text>
        <Pressable
          onPress={onToggleFavorite}
          style={styles.gridFavBtn}
          hitSlop={8}
        >
          <MaterialIcons
            name={isFavorite ? "favorite" : "favorite-border"}
            size={16}
            color={isFavorite ? "#EF4444" : colors.muted}
          />
        </Pressable>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.listCard,
        { backgroundColor: colors.surface, borderBottomColor: colors.border },
        pressed && { opacity: 0.75 },
      ]}
    >
      <View style={styles.listLogoContainer}>
        {channel.logo ? (
          <Image
            source={{ uri: channel.logo }}
            style={styles.listLogo}
            resizeMode="contain"
          />
        ) : (
          <View style={[styles.listLogoFallback, { backgroundColor: colors.primary + "22" }]}>
            <Text style={[styles.listLogoFallbackText, { color: colors.primary }]}>
              {channel.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.listInfo}>
        <Text style={[styles.listName, { color: colors.foreground }]} numberOfLines={1}>
          {channel.name}
        </Text>
        <Text style={[styles.listGroup, { color: colors.muted }]} numberOfLines={1}>
          {channel.group}
        </Text>
      </View>

      <Pressable
        onPress={onToggleFavorite}
        style={styles.listFavBtn}
        hitSlop={12}
      >
        <MaterialIcons
          name={isFavorite ? "favorite" : "favorite-border"}
          size={22}
          color={isFavorite ? "#EF4444" : colors.muted}
        />
      </Pressable>

      <MaterialIcons name="chevron-right" size={20} color={colors.muted} />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  // List variant
  listCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  listLogoContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
  },
  listLogo: {
    width: 48,
    height: 48,
  },
  listLogoFallback: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  listLogoFallbackText: {
    fontSize: 20,
    fontWeight: "700",
  },
  listInfo: {
    flex: 1,
    marginRight: 8,
  },
  listName: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
  listGroup: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  listFavBtn: {
    padding: 4,
    marginRight: 4,
  },
  // Grid variant
  gridCard: {
    flex: 1,
    margin: 4,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 120,
  },
  gridLogoContainer: {
    width: 56,
    height: 56,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 8,
  },
  gridLogo: {
    width: 56,
    height: 56,
  },
  gridLogoFallback: {
    width: 56,
    height: 56,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  gridLogoFallbackText: {
    fontSize: 24,
    fontWeight: "700",
  },
  gridName: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 16,
    flex: 1,
  },
  gridFavBtn: {
    marginTop: 6,
  },
});
