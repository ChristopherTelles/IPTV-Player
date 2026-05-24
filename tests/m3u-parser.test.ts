import { describe, it, expect } from "vitest";
import { parseM3U, getGroups, filterChannels } from "../lib/m3u-parser";

const SAMPLE_M3U = `#EXTM3U
#EXTINF:-1 tvg-id="globo" tvg-name="Globo HD" tvg-logo="https://example.com/globo.png" group-title="Abertos",Globo HD
http://example.com/globo.m3u8
#EXTINF:-1 tvg-id="sbt" tvg-name="SBT HD" tvg-logo="https://example.com/sbt.png" group-title="Abertos",SBT HD
http://example.com/sbt.m3u8
#EXTINF:-1 tvg-id="sportv" tvg-name="SporTV" tvg-logo="https://example.com/sportv.png" group-title="Esportes",SporTV
http://example.com/sportv.m3u8
#EXTINF:-1 group-title="Filmes",Canal sem logo
http://example.com/filmes.m3u8
`;

describe("parseM3U", () => {
  it("should parse channels correctly", () => {
    const channels = parseM3U(SAMPLE_M3U, "playlist1");
    expect(channels).toHaveLength(4);
  });

  it("should extract channel names", () => {
    const channels = parseM3U(SAMPLE_M3U, "playlist1");
    expect(channels[0].name).toBe("Globo HD");
    expect(channels[1].name).toBe("SBT HD");
    expect(channels[2].name).toBe("SporTV");
  });

  it("should extract channel URLs", () => {
    const channels = parseM3U(SAMPLE_M3U, "playlist1");
    expect(channels[0].url).toBe("http://example.com/globo.m3u8");
    expect(channels[2].url).toBe("http://example.com/sportv.m3u8");
  });

  it("should extract group titles", () => {
    const channels = parseM3U(SAMPLE_M3U, "playlist1");
    expect(channels[0].group).toBe("Abertos");
    expect(channels[2].group).toBe("Esportes");
    expect(channels[3].group).toBe("Filmes");
  });

  it("should extract logos", () => {
    const channels = parseM3U(SAMPLE_M3U, "playlist1");
    expect(channels[0].logo).toBe("https://example.com/globo.png");
    expect(channels[3].logo).toBeUndefined();
  });

  it("should extract tvg-id", () => {
    const channels = parseM3U(SAMPLE_M3U, "playlist1");
    expect(channels[0].tvgId).toBe("globo");
  });

  it("should assign playlistId to all channels", () => {
    const channels = parseM3U(SAMPLE_M3U, "playlist1");
    channels.forEach((ch) => expect(ch.playlistId).toBe("playlist1"));
  });

  it("should handle empty M3U", () => {
    const channels = parseM3U("", "playlist1");
    expect(channels).toHaveLength(0);
  });

  it("should handle M3U with no channels", () => {
    const channels = parseM3U("#EXTM3U\n# Just a comment", "playlist1");
    expect(channels).toHaveLength(0);
  });
});

describe("getGroups", () => {
  it("should return Todos as first group", () => {
    const channels = parseM3U(SAMPLE_M3U, "playlist1");
    const groups = getGroups(channels);
    expect(groups[0]).toBe("Todos");
  });

  it("should return unique sorted groups", () => {
    const channels = parseM3U(SAMPLE_M3U, "playlist1");
    const groups = getGroups(channels);
    expect(groups).toContain("Abertos");
    expect(groups).toContain("Esportes");
    expect(groups).toContain("Filmes");
    // No duplicates
    const unique = new Set(groups);
    expect(unique.size).toBe(groups.length);
  });
});

describe("filterChannels", () => {
  const channels = parseM3U(SAMPLE_M3U, "playlist1");

  it("should return all channels when query and group are empty", () => {
    const result = filterChannels(channels, "", "Todos");
    expect(result).toHaveLength(4);
  });

  it("should filter by query", () => {
    const result = filterChannels(channels, "globo", "Todos");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Globo HD");
  });

  it("should filter by group", () => {
    const result = filterChannels(channels, "", "Esportes");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("SporTV");
  });

  it("should filter by both query and group", () => {
    const result = filterChannels(channels, "sbt", "Abertos");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("SBT HD");
  });

  it("should return empty when no match", () => {
    const result = filterChannels(channels, "xyzabc", "Todos");
    expect(result).toHaveLength(0);
  });

  it("should be case insensitive", () => {
    const result = filterChannels(channels, "GLOBO", "Todos");
    expect(result).toHaveLength(1);
  });
});
