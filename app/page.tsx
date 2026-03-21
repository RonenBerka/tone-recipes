"use client";

import { useEffect, useState, useMemo } from "react";
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
  songs: { id: string; title: string };
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
  const [tones, setTones] = useState<ToneRow[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [loadingTones, setLoadingTones] = useState(false);

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
      if (sorted.length > 0) setSelectedArtist(sorted[0]);
      setLoadingArtists(false);
    }
    loadArtists();
  }, []);

  useEffect(() => {
    if (!selectedArtist) return;
    setLoadingTones(true);
    setTones([]); // clear old results immediately

    async function loadTones() {
      // Step 1: get song IDs for this artist directly via artist_id FK
      const { data: songData } = await supabase
        .from("songs")
        .select("id")
        .eq("artist_id", selectedArtist!.id);

      const songIds = (songData || []).map((s: any) => s.id);
      if (songIds.length === 0) {
        setTones([]);
        setLoadingTones(false);
        return;
      }

      // Step 2: get tone profiles for those songs via song_id FK
      const { data } = await supabase
        .from("tone_profiles")
        .select("id, name, section_type, gain_level, confidence_score, research_status, songs!inner(id, title)")
        .in("song_id", songIds)
        .order("confidence_score", { ascending: false });

      if (data) setTones(data as unknown as ToneRow[]);
      setLoadingTones(false);
    }

    loadTones();
  }, [selectedArtist]);

  const filteredTones = useMemo(() => {
    return tones.filter((t) => {
      const matchSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.songs.title.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        activeFilter === "ALL" ||
        t.section_type?.toUpperCase() === activeFilter ||
        (activeFilter === "CLEAN" && t.gain_level <= 0.3);
      return matchSearch && matchFilter;
    });
  }, [tones, search, activeFilter]);

  const initials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").slice(0, 3).toUpperCase();

  return (
    <HardwareChassis
      fullWidth
      isHome
      displayLabel="ARTIST //"
      title={selectedArtist?.name ?? "—"}
      displayLabel2={selectedArtist ? "RECIPES //" : undefined}
      subtitle={selectedArtist ? String(selectedArtist.count) : undefined}
    >

      {/* Search + Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search input */}
        <div
          className="hw-rack flex items-center gap-3 px-4 py-2.5 flex-1 min-w-[180px] max-w-md"
          style={{ background: "#14110f" }}
        >
          <span className="text-[10px] font-extrabold tracking-[0.12em] whitespace-nowrap" style={{ color: "#e08b26" }}>
            SEARCH //
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ARTIST OR SONG..."
            className="bg-transparent border-none outline-none w-full text-sm font-bold uppercase"
            style={{
              fontFamily: "'Courier New', Courier, monospace",
              color: "#e8dfce",
              fontSize: 13,
            }}
          />
        </div>

        {/* Filter buttons */}
        <div
          className="flex flex-wrap gap-1 p-1.5"
          style={{ background: "#0f0d0b", border: "1px solid #221d19", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.8)" }}
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
            style={{ maxHeight: 260, flex: "1 1 auto" }}
          >
            <div className="hw-panel-label mb-2">FEATURED ARTISTS</div>
            {loadingArtists ? (
              <div className="text-[11px] font-bold py-4 text-center" style={{ color: "#968a7c" }}>
                LOADING...
              </div>
            ) : (
              artists.map((artist) => (
                <button
                  key={artist.id}
                  onClick={() => setSelectedArtist(artist)}
                  className="flex items-center gap-3 p-2.5 w-full text-left transition-all"
                  style={
                    selectedArtist?.id === artist.id
                      ? { background: "#e08b26", color: "#111", border: "1px solid #000" }
                      : { background: "#241e1a", color: "#e8dfce", border: "1px solid #111" }
                  }
                >
                  <div
                    className="w-9 h-9 flex items-center justify-center text-sm font-black flex-shrink-0"
                    style={{
                      background: selectedArtist?.id === artist.id ? "rgba(0,0,0,0.2)" : "#111",
                      border: "1px solid #444",
                    }}
                  >
                    {initials(artist.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-extrabold uppercase truncate">{artist.name}</div>
                    <div className="text-[9px] opacity-70 uppercase mt-0.5">{artist.count} RECIPES</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right — Songs/Tones */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <div className="hw-label">AVAILABLE RECIPES</div>
          <div className="hw-screen flex flex-col">

            {/* Screen header */}
            <div
              className="flex justify-between items-center pb-3 mb-3"
              style={{ borderBottom: "2px solid rgba(0,0,0,0.3)" }}
            >
              <h2 className="text-base sm:text-lg font-black uppercase leading-none" style={{ color: "#111" }}>
                {selectedArtist?.name ?? "SELECT ARTIST"} // CATALOG
              </h2>
              <div
                className="text-[10px] font-bold px-2 py-1 flex-shrink-0"
                style={{ background: "rgba(0,0,0,0.1)", border: "1px solid rgba(0,0,0,0.2)", color: "#1a1a1a", fontFamily: "monospace" }}
              >
                {filteredTones.length} FOUND
              </div>
            </div>

            {/* Tone list — ~5 rows visible, then scroll */}
            <div className="overflow-y-auto" style={{ maxHeight: 268 }}>
              {loadingTones ? (
                <div className="text-[11px] font-bold py-8 text-center" style={{ color: "#4a3e30" }}>
                  LOADING...
                </div>
              ) : filteredTones.length === 0 ? (
                <div className="text-[13px] font-bold py-8 text-center" style={{ color: "#4a3e30" }}>
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
                    {/* Song title + tone name */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-bold truncate">{tone.songs.title}</div>
                      {tone.name !== tone.songs.title && (
                        <div className="text-[10px] opacity-60 uppercase mt-0.5">{tone.name}</div>
                      )}
                    </div>

                    {/* Type tags */}
                    <div
                      className="hidden sm:block text-[10px] flex-shrink-0"
                      style={{ fontFamily: "'Courier New', monospace", color: "#555" }}
                    >
                      {SECTION_SHORT[tone.section_type] || tone.section_type?.toUpperCase() || "—"}/
                      {GAIN_SHORT[String(tone.gain_level)] || "MID"}
                    </div>

                    {/* Status */}
                    <div className="hidden sm:block text-[10px] font-bold uppercase flex-shrink-0" style={{ color: "#555" }}>
                      {tone.research_status === "verified" ? "✓ VERIFIED" :
                       tone.research_status === "researched" ? "RESEARCHED" : "PARTIAL"}
                    </div>

                    {/* Open recipe button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); router.push(`/tone/${tone.id}`); }}
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
            <div className="text-[10px] font-bold tracking-[0.1em]" style={{ color: "#968a7c", fontFamily: "monospace" }}>
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
