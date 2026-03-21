"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { HardwareChassis } from "@/components/HardwareChassis";

interface ArtistRow {
  id: string;
  name: string;
  count: number;
}

interface ToneRow {
  id: string;
  name: string;
  section_type: string;
  gain_level: number;
  confidence_score: number;
  research_status: string;
  songs: { id: string; title: string; artists?: { name: string } };
}

const SECTION_SHORT: Record<string, string> = {
  lead: "LEAD",
  solo: "SOLO",
  rhythm: "RHTM",
  verse: "VERS",
  chorus: "CHOR",
  general: "GEN",
  ambient_layer: "AMB",
  intro: "INTRO",
  riff: "RIFF",
};

const GAIN_SHORT: Record<string, string> = {
  "0.3": "CLEAN",
  "0.5": "CRUNCH",
  "0.8": "HI-GAIN",
};

const FILTER_SECTIONS = ["ALL", "LEAD", "SOLO", "RHYTHM", "BLUES", "CLEAN"];

export default function HomePage() {
  const router = useRouter();
  const [artists, setArtists] = useState<ArtistRow[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<ArtistRow | null>(null);
  const [artistTones, setArtistTones] = useState<ToneRow[]>([]);
  const [globalTones, setGlobalTones] = useState<ToneRow[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [loadingTones, setLoadingTones] = useState(false);
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load artists ───────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadArtists() {
      const { data } = await supabase
        .from("tone_profiles")
        .select("id, songs!inner(id, artists!inner(id, name))");

      if (!data) return;

      const counts: Record<string, { name: string; count: number }> = {};
      for (const row of data as any[]) {
        const artist = row.songs.artists;
        if (!counts[artist.id]) counts[artist.id] = { name: artist.name, count: 0 };
        counts[artist.id].count++;
      }

      const sorted = Object.entries(counts)
        .map(([id, v]) => ({ id, name: v.name, count: v.count }))
        .sort((a, b) => b.count - a.count);

      setArtists(sorted);
      // No auto-selection — user picks an artist
      setLoadingArtists(false);
    }
    loadArtists();
  }, []);

  // ── Load artist tones when an artist is selected ───────────────────────────
  useEffect(() => {
    if (!selectedArtist) {
      setArtistTones([]);
      return;
    }
    setLoadingTones(true);
    setArtistTones([]);

    async function loadTones() {
      const { data: songData } = await supabase
        .from("songs")
        .select("id")
        .eq("artist_id", selectedArtist!.id);

      const songIds = (songData || []).map((s: any) => s.id);
      if (songIds.length === 0) {
        setArtistTones([]);
        setLoadingTones(false);
        return;
      }

      const { data } = await supabase
        .from("tone_profiles")
        .select("id, name, section_type, gain_level, confidence_score, research_status, songs!inner(id, title, artists!inner(name))")
        .in("song_id", songIds)
        .order("confidence_score", { ascending: false });

      if (data) setArtistTones(data as unknown as ToneRow[]);
      setLoadingTones(false);
    }

    loadTones();
  }, [selectedArtist]);

  // ── Global free-text search (debounced 300ms, always cross-artist) ─────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (search.trim().length < 2) {
      setGlobalTones([]);
      setLoadingGlobal(false);
      return;
    }

    setLoadingGlobal(true);

    debounceRef.current = setTimeout(async () => {
      const like = `%${search.trim()}%`;

      // Run initial queries in parallel
      const [artistRes, songRes, toneByNameRes] = await Promise.all([
        supabase.from("artists").select("id").ilike("name", like),
        supabase.from("songs").select("id").ilike("title", like),
        supabase
          .from("tone_profiles")
          .select("id, name, section_type, gain_level, confidence_score, research_status, songs!inner(id, title, artists!inner(name))")
          .ilike("name", like)
          .order("confidence_score", { ascending: false })
          .limit(30),
      ]);

      // Expand artist IDs → song IDs
      const artistIds = (artistRes.data || []).map((a: any) => a.id);
      let artistSongIds: string[] = [];
      if (artistIds.length > 0) {
        const { data } = await supabase.from("songs").select("id").in("artist_id", artistIds);
        artistSongIds = (data || []).map((s: any) => s.id);
      }

      // Merge all song IDs from both song-title and artist matches
      const songIdsByTitle = (songRes.data || []).map((s: any) => s.id);
      const allSongIds = [...new Set([...songIdsByTitle, ...artistSongIds])];

      // Fetch tones for those songs
      let tonesByContext: ToneRow[] = [];
      if (allSongIds.length > 0) {
        const { data } = await supabase
          .from("tone_profiles")
          .select("id, name, section_type, gain_level, confidence_score, research_status, songs!inner(id, title, artists!inner(name))")
          .in("song_id", allSongIds)
          .order("confidence_score", { ascending: false })
          .limit(80);
        tonesByContext = (data as unknown as ToneRow[]) || [];
      }

      // Merge + dedupe (context results first, name matches appended)
      const byName = (toneByNameRes.data as unknown as ToneRow[]) || [];
      const all = [...tonesByContext, ...byName];
      const seen = new Set<string>();
      const deduped = all.filter((t) => {
        if (seen.has(t.id)) return false;
        seen.add(t.id);
        return true;
      });

      setGlobalTones(deduped);
      setLoadingGlobal(false);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  // ── Decide what to display ─────────────────────────────────────────────────
  const isSearching = search.trim().length >= 2;

  // When searching: show global results; when artist selected: show artist tones
  const baseTones = isSearching ? globalTones : artistTones;
  const isLoadingDisplay = isSearching ? loadingGlobal : loadingTones;

  const filteredTones = useMemo(() => {
    return baseTones.filter((t) => {
      const matchFilter =
        activeFilter === "ALL" ||
        t.section_type?.toUpperCase() === activeFilter ||
        (activeFilter === "CLEAN" && t.gain_level <= 0.3);
      return matchFilter;
    });
  }, [baseTones, activeFilter]);

  const initials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 3)
      .toUpperCase();

  // ── Catalog panel header copy ──────────────────────────────────────────────
  const catalogHeader = isSearching
    ? `SEARCH: "${search.trim().toUpperCase()}" // RESULTS`
    : selectedArtist
    ? `${selectedArtist.name.toUpperCase()} // CATALOG`
    : "SELECT AN ARTIST";

  return (
    <HardwareChassis
      fullWidth
      isHome
      displayLabel={isSearching ? "SEARCH //" : "ARTIST //"}
      title={isSearching ? search.trim().toUpperCase() : selectedArtist?.name ?? "—"}
      displayLabel2={isSearching ? "RESULTS //" : selectedArtist ? "RECIPES //" : undefined}
      subtitle={
        isSearching
          ? String(filteredTones.length)
          : selectedArtist
          ? String(selectedArtist.count)
          : undefined
      }
    >

      {/* Search + Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search input */}
        <div
          className="hw-rack flex items-center gap-3 px-4 py-2.5 flex-1 min-w-[180px] max-w-md"
          style={{ background: "#14110f" }}
        >
          <span
            className="text-[10px] font-extrabold tracking-[0.12em] whitespace-nowrap"
            style={{ color: "#e08b26" }}
          >
            SEARCH //
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ARTIST, SONG, OR TONE..."
            className="bg-transparent border-none outline-none w-full text-sm font-bold uppercase"
            style={{
              fontFamily: "'Courier New', Courier, monospace",
              color: "#e8dfce",
              fontSize: 13,
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-[11px] font-bold flex-shrink-0"
              style={{ color: "#968a7c" }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter buttons */}
        <div
          className="flex flex-wrap gap-1 p-1.5"
          style={{
            background: "#0f0d0b",
            border: "1px solid #221d19",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.8)",
          }}
        >
          {FILTER_SECTIONS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`hw-mode-btn ${activeFilter === f ? "active" : ""}`}
              style={{ padding: "5px 12px", width: "auto" }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main browser: sidebar + catalog */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">

        {/* Sidebar — Artists */}
        <div className="flex flex-col gap-3 w-full lg:w-[260px] lg:flex-shrink-0">
          <div className="hw-label">BROWSE ARTISTS</div>
          <div
            className="hw-rack flex flex-col gap-1.5 p-3 overflow-y-auto"
            style={{ maxHeight: 340, flex: "1 1 auto" }}
          >
            <div className="hw-panel-label mb-2">
              {selectedArtist ? "ARTIST SELECTED — CLICK TO DESELECT" : "FEATURED ARTISTS"}
            </div>
            {loadingArtists ? (
              <div
                className="text-[11px] font-bold py-4 text-center"
                style={{ color: "#968a7c" }}
              >
                LOADING...
              </div>
            ) : (
              artists.map((artist) => {
                const isActive = selectedArtist?.id === artist.id;
                return (
                  <button
                    key={artist.id}
                    onClick={() =>
                      setSelectedArtist((prev) =>
                        prev?.id === artist.id ? null : artist
                      )
                    }
                    className="flex items-center gap-3 p-2.5 w-full text-left transition-all"
                    style={
                      isActive
                        ? { background: "#e08b26", color: "#111", border: "1px solid #000" }
                        : { background: "#241e1a", color: "#e8dfce", border: "1px solid #111" }
                    }
                  >
                    <div
                      className="w-9 h-9 flex items-center justify-center text-sm font-black flex-shrink-0"
                      style={{
                        background: isActive ? "rgba(0,0,0,0.2)" : "#111",
                        border: "1px solid #444",
                      }}
                    >
                      {initials(artist.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-extrabold uppercase truncate">
                        {artist.name}
                      </div>
                      <div className="text-[9px] opacity-70 uppercase mt-0.5">
                        {artist.count} RECIPES
                      </div>
                    </div>
                    {isActive && (
                      <div
                        className="ml-auto text-[9px] font-black flex-shrink-0"
                        style={{ color: "rgba(0,0,0,0.5)" }}
                      >
                        ✕
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right — Catalog */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <div className="hw-label">
            {isSearching ? "SEARCH RESULTS — ALL ARTISTS" : "AVAILABLE RECIPES"}
          </div>
          <div className="hw-screen flex flex-col">

            {/* Screen header */}
            <div
              className="flex justify-between items-center pb-3 mb-3"
              style={{ borderBottom: "2px solid rgba(0,0,0,0.3)" }}
            >
              <h2
                className="text-base sm:text-lg font-black uppercase leading-none truncate mr-2"
                style={{ color: "#111" }}
              >
                {catalogHeader}
              </h2>
              <div
                className="text-[10px] font-bold px-2 py-1 flex-shrink-0"
                style={{
                  background: "rgba(0,0,0,0.1)",
                  border: "1px solid rgba(0,0,0,0.2)",
                  color: "#1a1a1a",
                  fontFamily: "monospace",
                }}
              >
                {isLoadingDisplay ? "..." : `${filteredTones.length} FOUND`}
              </div>
            </div>

            {/* Tone list */}
            <div className="overflow-y-auto" style={{ maxHeight: 268 }}>
              {isLoadingDisplay ? (
                <div
                  className="text-[11px] font-bold py-8 text-center"
                  style={{ color: "#4a3e30" }}
                >
                  LOADING...
                </div>
              ) : !isSearching && !selectedArtist ? (
                <div
                  className="flex flex-col items-center justify-center py-10 gap-2"
                  style={{ color: "#4a3e30" }}
                >
                  <div className="text-[13px] font-bold uppercase">SELECT AN ARTIST</div>
                  <div className="text-[10px] font-bold uppercase opacity-70">
                    OR TYPE IN THE SEARCH BOX TO BROWSE ALL RECIPES
                  </div>
                </div>
              ) : filteredTones.length === 0 ? (
                <div
                  className="text-[13px] font-bold py-8 text-center"
                  style={{ color: "#4a3e30" }}
                >
                  NO RECIPES FOUND
                </div>
              ) : (
                filteredTones.map((tone) => (
                  <div
                    key={tone.id}
                    className="flex items-center py-3 px-3 sm:px-4 gap-3 cursor-pointer transition-all"
                    style={{
                      borderBottom: "1px solid rgba(0,0,0,0.1)",
                      color: "#1a1a1a",
                    }}
                    onClick={() => router.push(`/tone/${tone.id}`)}
                  >
                    {/* Song title + artist (shown in global search) + tone name */}
                    <div className="flex-1 min-w-0">
                      {isSearching && tone.songs.artists?.name && (
                        <div
                          className="text-[9px] font-extrabold uppercase mb-0.5"
                          style={{ color: "#e08b26", opacity: 0.9 }}
                        >
                          {tone.songs.artists.name}
                        </div>
                      )}
                      <div className="text-[13px] font-bold truncate">
                        {tone.songs.title}
                      </div>
                      {tone.name !== tone.songs.title && (
                        <div className="text-[10px] opacity-60 uppercase mt-0.5">
                          {tone.name}
                        </div>
                      )}
                    </div>

                    {/* Type tags */}
                    <div
                      className="hidden sm:block text-[10px] flex-shrink-0"
                      style={{ fontFamily: "'Courier New', monospace", color: "#555" }}
                    >
                      {SECTION_SHORT[tone.section_type] ||
                        tone.section_type?.toUpperCase() ||
                        "—"}
                      /{GAIN_SHORT[String(tone.gain_level)] || "MID"}
                    </div>

                    {/* Status */}
                    <div
                      className="hidden sm:block text-[10px] font-bold uppercase flex-shrink-0"
                      style={{ color: "#555" }}
                    >
                      {tone.research_status === "verified"
                        ? "✓ VERIFIED"
                        : tone.research_status === "researched"
                        ? "RESEARCHED"
                        : "PARTIAL"}
                    </div>

                    {/* Open recipe button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/tone/${tone.id}`);
                      }}
                      className="text-[10px] font-extrabold uppercase px-3 py-1.5 flex-shrink-0"
                      style={{ background: "#111", color: "#e08b26", border: "none" }}
                    >
                      OPEN →
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex justify-between items-center gap-3">
            <div
              className="text-[10px] font-bold tracking-[0.1em]"
              style={{ color: "#968a7c", fontFamily: "monospace" }}
            >
              {artists.reduce((acc, a) => acc + a.count, 0)} RECIPES IN CATALOG
            </div>
            <button
              className="hw-mode-btn"
              style={{ padding: "7px 20px", width: "auto" }}
              onClick={() => router.push("/rigs")}
            >
              VIEW MY RIGS →
            </button>
          </div>
        </div>
      </div>
    </HardwareChassis>
  );
}
