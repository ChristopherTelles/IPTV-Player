export interface Channel {
  id: string;
  name: string;
  url: string;
  logo?: string;
  group: string;
  tvgId?: string;
  tvgName?: string;
  playlistId: string;
  isFavorite?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  url: string;
  type: "url" | "local";
  lastUpdated: number;
  channelCount: number;
}

export interface EPGProgram {
  channelId: string;
  title: string;
  description?: string;
  start: number; // timestamp ms
  end: number;   // timestamp ms
  category?: string;
}

export interface EPGChannel {
  id: string;
  name: string;
  icon?: string;
  programs: EPGProgram[];
}

export interface AppSettings {
  epgUrl: string;
  theme: "dark" | "light" | "system";
  autoPlay: boolean;
  lastChannelId?: string;
}
