"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { ToneProfile } from "@/lib/types";
import { ToneCard } from "@/components/ToneCard";
import { FilterChip } from "@/components/ui/FilterChip";
import { SkeletonCard } from "@/components/ui/Skeleton";

const SECTION_TYPES = [
  "all",
  "rhythm",
  "lead",
  "solo",
  "riff",
  "intro",
  "verse",
  "chorus",
];
const GAIN_LEVELS = [
  { label: "All Gains", value: "all" },
  { label: "Clean", value: "0.3" },
  { label: "Crunch", value: "0.5" },
  { label: "High Gain", value: "0.8" },
];

export default function ToneLibrary() {
  const [profiles, setProfiles] = useState<ToneProfile[]>([]);
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [gainFilter, setGainFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 21;

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    // Use the searchable view for cross-table search (artist, song title, profile name)
    let query = supabase
      .from("tone_profiles_search")
      .select(
        "id, name, section_type, gain_level, ambience_level, confidence_score, song_id, song_title, artist_id, artist_name",
        { count: "exact" }
      )
      .order("confidence_score", { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (sectionFilter !== "all") {
      query = query.eq("section_type", sectionFilter);
    }
    if (gainFilter !== "all") {
      query = query.eq("gain_level", parseFloat(gainFilter));
    }
    if (search.trim()) {
      const s = search.trim();
      query = query.or(
        `artist_name.ilike.%${s}%,song_title.ilike.%${s}%,name.ilike.%${s}%`
      );
    }

    const { data, count, error } = await query;
    if (!error && data) {
      // Reshape flat view data to match ToneProfile interface
      const profiles = (data as Record<string, unknown>[]).map((d) => ({
        id: d.id as string,
        name: d.name as string,
        section_type: d.section_type as string,
        gain_level: d.gain_level as number,
        ambience_level: d.ambience_level as number,
        confidence_score: d.confidence_score as number,
        research_status: null,
        evidence_summary: null,
        songs: {
          id: d.song_id as string,
          title: d.song_title as string,
          artists: {
            id: d.artist_id as string,
            name: d.artist_name as string,
          },
        },
      }));
      setProfiles(profiles);
      setTotal(count || 0);
    }
    setLoading(false);
  }, [search, sectionFilter, gainFilter, page]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  useEffect(() => {
    setPage(0);
  }, [search, sectionFilter, gainFilter]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      {/* Hero section */}
      <div className="text-center mb-12 pt-4 animate-fade-up">
        <Image
          src="/logo.jpg"
          alt="Tone Recipes — Iconic Guitar Tones"
          width={480}
          height={270}
          className="mx-auto mb-6 rounded-xl"
          style={{ objectFit: "contain" }}
          priority
        />
        <p
          className="text-lg max-w-2xl mx-auto leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {total > 0 ? (
            <>
              <span
                className="font-semibold"
                style={{ color: "var(--accent-gold)" }}
              >
                {total}
              </span>{" "}
              iconic guitar tones, analyzed and ready to generate
              Ampero II Stomp presets.
            </>
          ) : (
            "Browse iconic guitar tones and generate custom presets."
          )}
        </p>
      </div>

      {/* Search bar */}
      <div className="max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: "50ms" }}>
        <div
          className="relative"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-muted)" }}
          >
            <circle
              cx="11"
              cy="11"
              r="8"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M21 21l-4.35-4.35"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by artist, song, or tone name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent pl-12 pr-4 py-3.5 text-sm focus:outline-none"
            style={{
              color: "var(--text-primary)",
              borderRadius: "var(--radius-lg)",
            }}
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="mb-4 animate-fade-up" style={{ animationDelay: "100ms" }}>
        <div
          className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-2"
          style={{ color: "var(--text-muted)" }}
        >
          Section
        </div>
        <div className="flex flex-wrap gap-2">
          {SECTION_TYPES.map((s) => (
            <FilterChip
              key={s}
              label={
                s === "all"
                  ? "All"
                  : s.charAt(0).toUpperCase() + s.slice(1)
              }
              active={sectionFilter === s}
              onClick={() => setSectionFilter(s)}
            />
          ))}
        </div>
      </div>

      <div className="mb-8 animate-fade-up" style={{ animationDelay: "150ms" }}>
        <div
          className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-2"
          style={{ color: "var(--text-muted)" }}
        >
          Gain
        </div>
        <div className="flex flex-wrap gap-2">
          {GAIN_LEVELS.map((g) => (
            <FilterChip
              key={g.value}
              label={g.label}
              active={gainFilter === g.value}
              onClick={() => setGainFilter(g.value)}
            />
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <div
          className="text-center py-16"
          style={{ color: "var(--text-muted)" }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            className="mx-auto mb-4 opacity-40"
          >
            <circle
              cx="11"
              cy="11"
              r="8"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M21 21l-4.35-4.35"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-sm">No tones found. Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
            {profiles.map((p) => (
              <div key={p.id} className="animate-fade-up">
                <ToneCard profile={p} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="glass px-5 py-2.5 text-sm font-medium disabled:opacity-30 transition-all"
                style={{ color: "var(--text-primary)" }}
              >
                Previous
              </button>
              <span
                className="text-sm font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(totalPages - 1, p + 1))
                }
                disabled={page >= totalPages - 1}
                className="glass px-5 py-2.5 text-sm font-medium disabled:opacity-30 transition-all"
                style={{ color: "var(--text-primary)" }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
