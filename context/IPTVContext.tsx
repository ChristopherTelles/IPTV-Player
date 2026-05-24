import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Channel, Playlist, AppSettings } from "@/types/iptv";
import { fetchM3U, parseM3U } from "@/lib/m3u-parser";

const STORAGE_KEYS = {
  PLAYLISTS: "@iptv:playlists",
  CHANNELS: "@iptv:channels",
  FAVORITES: "@iptv:favorites",
  SETTINGS: "@iptv:settings",
  LAST_CHANNEL: "@iptv:lastChannel",
};

interface IPTVState {
  playlists: Playlist[];
  channels: Channel[];
  favorites: string[]; // channel ids
  settings: AppSettings;
  lastChannel: Channel | null;
  isLoading: boolean;
  loadingMessage: string;
}

type IPTVAction =
  | { type: "SET_LOADING"; payload: boolean; message?: string }
  | { type: "SET_PLAYLISTS"; payload: Playlist[] }
  | { type: "SET_CHANNELS"; payload: Channel[] }
  | { type: "ADD_CHANNELS"; payload: Channel[] }
  | { type: "SET_FAVORITES"; payload: string[] }
  | { type: "TOGGLE_FAVORITE"; payload: string }
  | { type: "SET_SETTINGS"; payload: Partial<AppSettings> }
  | { type: "SET_LAST_CHANNEL"; payload: Channel | null }
  | { type: "REMOVE_PLAYLIST"; payload: string };

const defaultSettings: AppSettings = {
  epgUrl: "",
  theme: "dark",
  autoPlay: true,
};

const initialState: IPTVState = {
  playlists: [],
  channels: [],
  favorites: [],
  settings: defaultSettings,
  lastChannel: null,
  isLoading: false,
  loadingMessage: "",
};

function reducer(state: IPTVState, action: IPTVAction): IPTVState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload, loadingMessage: action.message || "" };
    case "SET_PLAYLISTS":
      return { ...state, playlists: action.payload };
    case "SET_CHANNELS":
      return { ...state, channels: action.payload };
    case "ADD_CHANNELS":
      return { ...state, channels: [...state.channels, ...action.payload] };
    case "SET_FAVORITES":
      return { ...state, favorites: action.payload };
    case "TOGGLE_FAVORITE": {
      const id = action.payload;
      const exists = state.favorites.includes(id);
      const newFavs = exists
        ? state.favorites.filter((f) => f !== id)
        : [...state.favorites, id];
      return { ...state, favorites: newFavs };
    }
    case "SET_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case "SET_LAST_CHANNEL":
      return { ...state, lastChannel: action.payload };
    case "REMOVE_PLAYLIST": {
      const id = action.payload;
      return {
        ...state,
        playlists: state.playlists.filter((p) => p.id !== id),
        channels: state.channels.filter((c) => c.playlistId !== id),
      };
    }
    default:
      return state;
  }
}

interface IPTVContextValue {
  state: IPTVState;
  addPlaylist: (name: string, url: string) => Promise<void>;
  removePlaylist: (id: string) => Promise<void>;
  refreshPlaylist: (playlist: Playlist) => Promise<void>;
  toggleFavorite: (channelId: string) => Promise<void>;
  setLastChannel: (channel: Channel) => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  isFavorite: (channelId: string) => boolean;
  getFavoriteChannels: () => Channel[];
  getChannelById: (id: string) => Channel | undefined;
}

const IPTVContext = createContext<IPTVContextValue | null>(null);

export function IPTVProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load persisted data on mount
  useEffect(() => {
    loadPersistedData();
  }, []);

  const loadPersistedData = async () => {
    try {
      const [playlistsRaw, channelsRaw, favoritesRaw, settingsRaw, lastChannelRaw] =
        await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.PLAYLISTS),
          AsyncStorage.getItem(STORAGE_KEYS.CHANNELS),
          AsyncStorage.getItem(STORAGE_KEYS.FAVORITES),
          AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
          AsyncStorage.getItem(STORAGE_KEYS.LAST_CHANNEL),
        ]);

      if (playlistsRaw) dispatch({ type: "SET_PLAYLISTS", payload: JSON.parse(playlistsRaw) });
      if (channelsRaw) dispatch({ type: "SET_CHANNELS", payload: JSON.parse(channelsRaw) });
      if (favoritesRaw) dispatch({ type: "SET_FAVORITES", payload: JSON.parse(favoritesRaw) });
      if (settingsRaw) dispatch({ type: "SET_SETTINGS", payload: JSON.parse(settingsRaw) });
      if (lastChannelRaw) dispatch({ type: "SET_LAST_CHANNEL", payload: JSON.parse(lastChannelRaw) });
    } catch (e) {
      console.error("Erro ao carregar dados:", e);
    }
  };

  const addPlaylist = useCallback(async (name: string, url: string) => {
    dispatch({ type: "SET_LOADING", payload: true, message: "Carregando playlist..." });
    try {
      const content = await fetchM3U(url);
      const playlistId = Math.random().toString(36).substring(2, 11);
      const channels = parseM3U(content, playlistId);

      const playlist: Playlist = {
        id: playlistId,
        name,
        url,
        type: "url",
        lastUpdated: Date.now(),
        channelCount: channels.length,
      };

      const newPlaylists = [...state.playlists, playlist];
      const newChannels = [...state.channels, ...channels];

      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(newPlaylists)),
        AsyncStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(newChannels)),
      ]);

      dispatch({ type: "SET_PLAYLISTS", payload: newPlaylists });
      dispatch({ type: "SET_CHANNELS", payload: newChannels });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.playlists, state.channels]);

  const removePlaylist = useCallback(async (id: string) => {
    const newPlaylists = state.playlists.filter((p) => p.id !== id);
    const newChannels = state.channels.filter((c) => c.playlistId !== id);

    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(newPlaylists)),
      AsyncStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(newChannels)),
    ]);

    dispatch({ type: "REMOVE_PLAYLIST", payload: id });
  }, [state.playlists, state.channels]);

  const refreshPlaylist = useCallback(async (playlist: Playlist) => {
    dispatch({ type: "SET_LOADING", payload: true, message: "Atualizando playlist..." });
    try {
      const content = await fetchM3U(playlist.url);
      const channels = parseM3U(content, playlist.id);

      const updatedPlaylist = { ...playlist, lastUpdated: Date.now(), channelCount: channels.length };
      const newPlaylists = state.playlists.map((p) => p.id === playlist.id ? updatedPlaylist : p);
      const otherChannels = state.channels.filter((c) => c.playlistId !== playlist.id);
      const newChannels = [...otherChannels, ...channels];

      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(newPlaylists)),
        AsyncStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(newChannels)),
      ]);

      dispatch({ type: "SET_PLAYLISTS", payload: newPlaylists });
      dispatch({ type: "SET_CHANNELS", payload: newChannels });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.playlists, state.channels]);

  const toggleFavorite = useCallback(async (channelId: string) => {
    const exists = state.favorites.includes(channelId);
    const newFavs = exists
      ? state.favorites.filter((f) => f !== channelId)
      : [...state.favorites, channelId];

    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(newFavs));
    dispatch({ type: "TOGGLE_FAVORITE", payload: channelId });
  }, [state.favorites]);

  const setLastChannel = useCallback(async (channel: Channel) => {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_CHANNEL, JSON.stringify(channel));
    dispatch({ type: "SET_LAST_CHANNEL", payload: channel });
  }, []);

  const updateSettings = useCallback(async (settings: Partial<AppSettings>) => {
    const newSettings = { ...state.settings, ...settings };
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
    dispatch({ type: "SET_SETTINGS", payload: settings });
  }, [state.settings]);

  const isFavorite = useCallback(
    (channelId: string) => state.favorites.includes(channelId),
    [state.favorites]
  );

  const getFavoriteChannels = useCallback(
    () => state.channels.filter((ch) => state.favorites.includes(ch.id)),
    [state.channels, state.favorites]
  );

  const getChannelById = useCallback(
    (id: string) => state.channels.find((ch) => ch.id === id),
    [state.channels]
  );

  return (
    <IPTVContext.Provider
      value={{
        state,
        addPlaylist,
        removePlaylist,
        refreshPlaylist,
        toggleFavorite,
        setLastChannel,
        updateSettings,
        isFavorite,
        getFavoriteChannels,
        getChannelById,
      }}
    >
      {children}
    </IPTVContext.Provider>
  );
}

export function useIPTV() {
  const ctx = useContext(IPTVContext);
  if (!ctx) throw new Error("useIPTV must be used within IPTVProvider");
  return ctx;
}
