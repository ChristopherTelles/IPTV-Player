import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useIPTV } from "@/context/IPTVContext";
import { Playlist } from "@/types/iptv";

export default function SettingsScreen() {
  const colors = useColors();
  const { state, addPlaylist, removePlaylist, refreshPlaylist } = useIPTV();

  const [showAddModal, setShowAddModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState("");

  const handleAddPlaylist = async () => {
    if (!playlistUrl.trim()) {
      setAddError("Informe a URL da playlist");
      return;
    }
    if (!playlistName.trim()) {
      setAddError("Informe um nome para a playlist");
      return;
    }

    setAddError("");
    setIsAdding(true);
    try {
      await addPlaylist(playlistName.trim(), playlistUrl.trim());
      setShowAddModal(false);
      setPlaylistName("");
      setPlaylistUrl("");
    } catch (e: any) {
      setAddError(e.message || "Erro ao carregar playlist");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemovePlaylist = (playlist: Playlist) => {
    Alert.alert(
      "Remover Playlist",
      `Deseja remover "${playlist.name}"? Todos os ${playlist.channelCount} canais serão removidos.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => removePlaylist(playlist.id),
        },
      ]
    );
  };

  const handleRefreshPlaylist = async (playlist: Playlist) => {
    try {
      await refreshPlaylist(playlist);
    } catch (e: any) {
      Alert.alert("Erro", e.message || "Não foi possível atualizar a playlist");
    }
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Configurações</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Playlists section */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.muted }]}>PLAYLISTS M3U</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {state.playlists.length === 0 ? (
              <View style={styles.emptyPlaylists}>
                <MaterialIcons name="playlist-add" size={40} color={colors.muted} style={{ opacity: 0.5 }} />
                <Text style={[styles.emptyPlaylistsText, { color: colors.muted }]}>
                  Nenhuma playlist adicionada
                </Text>
              </View>
            ) : (
              state.playlists.map((playlist, index) => (
                <View key={playlist.id}>
                  {index > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                  <View style={styles.playlistItem}>
                    <View style={[styles.playlistIcon, { backgroundColor: colors.primary + "22" }]}>
                      <MaterialIcons name="playlist-play" size={22} color={colors.primary} />
                    </View>
                    <View style={styles.playlistInfo}>
                      <Text style={[styles.playlistName, { color: colors.foreground }]} numberOfLines={1}>
                        {playlist.name}
                      </Text>
                      <Text style={[styles.playlistMeta, { color: colors.muted }]} numberOfLines={1}>
                        {playlist.channelCount} canais · {formatDate(playlist.lastUpdated)}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => handleRefreshPlaylist(playlist)}
                      style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.6 }]}
                      hitSlop={8}
                    >
                      {state.isLoading ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                      ) : (
                        <MaterialIcons name="refresh" size={20} color={colors.primary} />
                      )}
                    </Pressable>
                    <Pressable
                      onPress={() => handleRemovePlaylist(playlist)}
                      style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.6 }]}
                      hitSlop={8}
                    >
                      <MaterialIcons name="delete" size={20} color={colors.error} />
                    </Pressable>
                  </View>
                </View>
              ))
            )}

            {/* Add playlist button */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Pressable
              onPress={() => setShowAddModal(true)}
              style={({ pressed }) => [styles.addPlaylistBtn, pressed && { opacity: 0.7 }]}
            >
              <MaterialIcons name="add-circle" size={20} color={colors.primary} />
              <Text style={[styles.addPlaylistBtnText, { color: colors.primary }]}>
                Adicionar Playlist M3U
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Stats section */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.muted }]}>ESTATÍSTICAS</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Total de canais</Text>
              <Text style={[styles.statValue, { color: colors.foreground }]}>{state.channels.length}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Favoritos</Text>
              <Text style={[styles.statValue, { color: colors.foreground }]}>{state.favorites.length}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Playlists</Text>
              <Text style={[styles.statValue, { color: colors.foreground }]}>{state.playlists.length}</Text>
            </View>
          </View>
        </View>

        {/* About section */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.muted }]}>SOBRE</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Versão</Text>
              <Text style={[styles.statValue, { color: colors.foreground }]}>1.0.0</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>App</Text>
              <Text style={[styles.statValue, { color: colors.foreground }]}>IPTV Player</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Add Playlist Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Pressable
              onPress={() => {
                setShowAddModal(false);
                setAddError("");
                setPlaylistName("");
                setPlaylistUrl("");
              }}
              style={({ pressed }) => [pressed && { opacity: 0.6 }]}
            >
              <Text style={[styles.modalCancel, { color: colors.primary }]}>Cancelar</Text>
            </Pressable>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Nova Playlist</Text>
            <Pressable
              onPress={handleAddPlaylist}
              disabled={isAdding}
              style={({ pressed }) => [pressed && { opacity: 0.6 }]}
            >
              {isAdding ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={[styles.modalSave, { color: colors.primary }]}>Adicionar</Text>
              )}
            </Pressable>
          </View>

          <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
            <Text style={[styles.fieldLabel, { color: colors.muted }]}>NOME DA PLAYLIST</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="Ex: Minha IPTV"
                placeholderTextColor={colors.muted}
                value={playlistName}
                onChangeText={setPlaylistName}
                returnKeyType="next"
              />
            </View>

            <Text style={[styles.fieldLabel, { color: colors.muted, marginTop: 20 }]}>URL DA PLAYLIST M3U</Text>
            <View style={[styles.inputContainer, styles.urlInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="http://exemplo.com/lista.m3u"
                placeholderTextColor={colors.muted}
                value={playlistUrl}
                onChangeText={setPlaylistUrl}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                returnKeyType="done"
                onSubmitEditing={handleAddPlaylist}
                multiline
              />
            </View>

            {addError ? (
              <View style={[styles.errorBox, { backgroundColor: colors.error + "22" }]}>
                <MaterialIcons name="warning" size={16} color={colors.error} />
                <Text style={[styles.errorText, { color: colors.error }]}>{addError}</Text>
              </View>
            ) : null}

            <Text style={[styles.hint, { color: colors.muted }]}>
              Suporte a playlists M3U e M3U8. A URL deve ser acessível publicamente.
            </Text>
          </ScrollView>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },
  emptyPlaylists: {
    alignItems: "center",
    padding: 24,
    gap: 8,
  },
  emptyPlaylistsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 10,
  },
  playlistIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
  playlistMeta: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  actionBtn: {
    padding: 6,
  },
  addPlaylistBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 10,
  },
  addPlaylistBtnText: {
    fontSize: 15,
    fontWeight: "600",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  statLabel: {
    fontSize: 15,
    lineHeight: 20,
  },
  statValue: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
  // Modal
  modal: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  modalCancel: {
    fontSize: 16,
  },
  modalSave: {
    fontSize: 16,
    fontWeight: "700",
  },
  modalBody: {
    padding: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  inputContainer: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  urlInput: {
    minHeight: 80,
  },
  input: {
    fontSize: 15,
    lineHeight: 22,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
  },
  errorText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 16,
  },
});
