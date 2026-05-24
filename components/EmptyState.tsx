import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";

interface EmptyStateProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <MaterialIcons name={icon} size={64} color={colors.muted} style={styles.icon} />
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.muted }]}>{subtitle}</Text>
      )}
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  icon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },
  action: {
    marginTop: 24,
  },
});
