import { Channel, Playlist } from "@/types/iptv";

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function parseM3U(content: string, playlistId: string): Channel[] {
  const channels: Channel[] = [];
  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);

  let currentMeta: Partial<Channel> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("#EXTINF:")) {
      currentMeta = {};

      // Extract duration and attributes
      const infoMatch = line.match(/#EXTINF:(-?\d+)([^,]*),(.+)/);
      if (infoMatch) {
        const attrs = infoMatch[2];
        const name = infoMatch[3].trim();

        currentMeta.name = name;
        currentMeta.id = generateId();

        // Extract tvg-id
        const tvgIdMatch = attrs.match(/tvg-id="([^"]*)"/);
        if (tvgIdMatch) currentMeta.tvgId = tvgIdMatch[1];

        // Extract tvg-name
        const tvgNameMatch = attrs.match(/tvg-name="([^"]*)"/);
        if (tvgNameMatch) currentMeta.tvgName = tvgNameMatch[1];

        // Extract tvg-logo
        const logoMatch = attrs.match(/tvg-logo="([^"]*)"/);
        if (logoMatch) currentMeta.logo = logoMatch[1];

        // Extract group-title
        const groupMatch = attrs.match(/group-title="([^"]*)"/);
        currentMeta.group = groupMatch ? groupMatch[1] : "Geral";

        currentMeta.playlistId = playlistId;
      }
    } else if (!line.startsWith("#") && line.length > 0 && currentMeta) {
      // This is the URL line
      const channel: Channel = {
        id: currentMeta.id || generateId(),
        name: currentMeta.name || "Canal sem nome",
        url: line,
        logo: currentMeta.logo,
        group: currentMeta.group || "Geral",
        tvgId: currentMeta.tvgId,
        tvgName: currentMeta.tvgName,
        playlistId: currentMeta.playlistId || playlistId,
        isFavorite: false,
      };
      channels.push(channel);
      currentMeta = null;
    }
  }

  return channels;
}

export async function fetchM3U(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "IPTV-Player/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao carregar playlist: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

export function getGroups(channels: Channel[]): string[] {
  const groups = new Set<string>();
  channels.forEach((ch) => groups.add(ch.group));
  return ["Todos", ...Array.from(groups).sort()];
}

export function filterChannels(
  channels: Channel[],
  query: string,
  group: string
): Channel[] {
  let result = channels;

  if (group && group !== "Todos") {
    result = result.filter((ch) => ch.group === group);
  }

  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(
      (ch) =>
        ch.name.toLowerCase().includes(q) ||
        ch.group.toLowerCase().includes(q)
    );
  }

  return result;
}
