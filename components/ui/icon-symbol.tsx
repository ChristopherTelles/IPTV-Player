// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbols to Material Icons mappings for IPTV Player app.
 */
const MAPPING = {
  // Navigation
  "house.fill": "home",
  "tv.fill": "live-tv",
  "heart.fill": "favorite",
  "calendar": "calendar-today",
  "gearshape.fill": "settings",
  // Player controls
  "play.fill": "play-arrow",
  "pause.fill": "pause",
  "forward.fill": "fast-forward",
  "backward.fill": "fast-rewind",
  "speaker.wave.2.fill": "volume-up",
  "speaker.slash.fill": "volume-off",
  "arrow.up.left.and.arrow.down.right": "fullscreen",
  "arrow.down.right.and.arrow.up.left": "fullscreen-exit",
  // UI
  "magnifyingglass": "search",
  "xmark": "close",
  "xmark.circle.fill": "cancel",
  "chevron.left": "chevron-left",
  "chevron.right": "chevron-right",
  "chevron.left.forwardslash.chevron.right": "code",
  "paperplane.fill": "send",
  "plus": "add",
  "plus.circle.fill": "add-circle",
  "trash.fill": "delete",
  "arrow.clockwise": "refresh",
  "info.circle": "info",
  "list.bullet": "list",
  "square.grid.2x2": "grid-view",
  "star.fill": "star",
  "wifi": "wifi",
  "wifi.slash": "wifi-off",
  "exclamationmark.triangle.fill": "warning",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
