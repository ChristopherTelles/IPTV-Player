import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEvent } from "expo";
import { useKeepAwake } from "expo-keep-awake";
import * as Haptics from "expo-haptics";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIPTV } from "@/context/IPTVContext";

const CONTROLS_TIMEOUT = 4000;

export default function PlayerScreen() {
  const { channelId } = useLocalSearchParams<{ channelId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getChannelById, toggleFavorite, isFavorite } = useIPTV();

  const channel = getChannelById(channelId);

  const player = useVideoPlayer(channel?.url ?? null, (p) => {
    p.loop = true;
    p.play();
  });

  const { status } = useEvent(player, "statusChange", { status: player.status });
  const { isPlaying } = useEvent(player, "playingChange", { isPlaying: player.playing });

  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep screen awake during playback
  useKeepAwake();

  const resetControlsTimer = useCallback(() => {
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    setShowControls(true);
    controlsTimer.current = setTimeout(() => setShowControls(false), CONTROLS_TIMEOUT);
  }, []);

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
    };
  }, []);

  const handleScreenTap = () => {
    if (showControls) {
      setShowControls(false);
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
    } else {
      resetControlsTimer();
    }
  };

  const handlePlayPause = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    resetControlsTimer();
  };

  const handleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    player.muted = newMuted;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    resetControlsTimer();
  };

  const handleFavorite = () => {
    if (channel) {
      toggleFavorite(channel.id);
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
    resetControlsTimer();
  };

  const handleBack = () => {
    player.pause();
    router.back();
  };

  const isLoading = status === "loading" || status === "readyToPlay";
  const hasError = status === "error";
  const favorited = channel ? isFavorite(channel.id) : false;

  if (!channel) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={64} color="#EF4444" />
        <Text style={styles.errorText}>Canal não encontrado</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Video */}
      <VideoView
        style={styles.video}
        player={player}
        contentFit="contain"
        nativeControls={false}
      />

      {/* Tap overlay */}
      <Pressable style={StyleSheet.absoluteFill} onPress={handleScreenTap} />

      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      )}

      {/* Error state */}
      {hasError && (
        <View style={styles.loadingOverlay}>
          <MaterialIcons name="wifi-off" size={48} color="#EF4444" />
          <Text style={styles.errorOverlayText}>Erro ao reproduzir canal</Text>
          <Pressable
            onPress={() => { player.replace(channel.url); player.play(); }}
            style={styles.retryBtn}
          >
            <MaterialIcons name="refresh" size={18} color="#fff" />
            <Text style={styles.retryBtnText}>Tentar novamente</Text>
          </Pressable>
        </View>
      )}

      {/* Controls overlay */}
      {showControls && (
        <View style={[StyleSheet.absoluteFill, styles.controlsOverlay]}>
          {/* Top bar */}
          <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
            <Pressable
              onPress={handleBack}
              style={({ pressed }) => [styles.controlBtn, pressed && { opacity: 0.6 }]}
            >
              <MaterialIcons name="chevron-left" size={32} color="#fff" />
            </Pressable>

            <View style={styles.channelInfo}>
              {channel.logo ? (
                <Image source={{ uri: channel.logo }} style={styles.channelLogo} resizeMode="contain" />
              ) : (
                <View style={styles.channelLogoFallback}>
                  <Text style={styles.channelLogoFallbackText}>
                    {channel.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View>
                <Text style={styles.channelName} numberOfLines={1}>{channel.name}</Text>
                <Text style={styles.channelGroup} numberOfLines={1}>{channel.group}</Text>
              </View>
            </View>

            <Pressable
              onPress={handleFavorite}
              style={({ pressed }) => [styles.controlBtn, pressed && { opacity: 0.6 }]}
            >
              <MaterialIcons
                name={favorited ? "favorite" : "favorite-border"}
                size={26}
                color={favorited ? "#EF4444" : "#fff"}
              />
            </Pressable>
          </View>

          {/* Center play/pause */}
          <View style={styles.centerControls}>
            <Pressable
              onPress={handlePlayPause}
              style={({ pressed }) => [styles.playPauseBtn, pressed && { opacity: 0.8 }]}
            >
              <MaterialIcons
                name={isPlaying ? "pause" : "play-arrow"}
                size={52}
                color="#fff"
              />
            </Pressable>
          </View>

          {/* Bottom bar */}
          <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 8 }]}>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>AO VIVO</Text>
            </View>

            <Pressable
              onPress={handleMute}
              style={({ pressed }) => [styles.controlBtn, pressed && { opacity: 0.6 }]}
            >
              <MaterialIcons
                name={isMuted ? "volume-off" : "volume-up"}
                size={26}
                color="#fff"
              />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  video: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    gap: 12,
  },
  loadingText: {
    color: "#fff",
    fontSize: 14,
  },
  errorOverlayText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "600",
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 8,
  },
  retryBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  controlsOverlay: {
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  channelInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  channelLogo: {
    width: 36,
    height: 36,
    borderRadius: 6,
  },
  channelLogoFallback: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  channelLogoFallbackText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  channelName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  channelGroup: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    lineHeight: 16,
  },
  controlBtn: {
    padding: 6,
  },
  centerControls: {
    alignItems: "center",
    justifyContent: "center",
  },
  playPauseBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(239,68,68,0.85)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
  },
  liveText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  errorText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  backBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  backBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
