"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { ToneProfileListItem } from "@/lib/types";
import { ToneCard } from "@/components/ToneCard";
import { SortDropdown, SortKey } from "@/components/SortDropdown";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Search } from "lucide-react";

const SECTION_TYPES = ["all", "rhythm", "lead", "solo", "riff", "intro", "verse", "chorus"];
const GAIN_LEVELS = [
  { label: "All Gains", value: "all" },
  { label: "Clean", value: "0.3" },
  { label: "Crunch", value: "0.5" },
  { label: "High Gain", value: "0.8" },
];

const SORT_MAP: Record<SortKey, { column: string; ascending: boolean }> = {
  confidence: { column: "confidence_score", ascending: false },
  newest: { column: "created_at", ascending: false },
  popular: { column: "download_count", ascending: false },
  artist: { column: "artist_name", ascending: true },
};

function SkeletonCard() {
  return (
    <div className="rounded-xl ring-1 ring-border bg-card p-4 space-y-3">
      <div className="flex justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
      <Skeleton className="h-4 w-2/5" />
      <div className="flex gap-1.5">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <Skeleton className="h-0.5 w-full" />
    </div>
  );
}

export default function ToneLibrary() {
  const [profiles, setProfiles] = useState<ToneProfileListItem[]>([]);
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [gainFilter, setGainFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("confidence");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 21;

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    const sort = SORT_MAP[sortBy];
    let query = supabase
      .from("tone_profiles_search")
      .select(
        "id, name, section_type, gain_level, confidence_score, created_at, song_title, artist_name, tags, block_roles, download_count",
        { count: "exact" }
      )
      .order(sort.column, { ascending: sort.ascending })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (sectionFilter !== "all") query = query.eq("section_type", sectionFilter);
    if (gainFilter !== "all") query = query.eq("gain_level", parseFloat(gainFilter));
    if (search.trim()) {
      const s = search.trim();
      query = query.or(`artist_name.ilike.%${s}%,song_title.ilike.%${s}%,name.ilike.%${s}%`);
    }

    const { data, count, error } = await query;
    if (!error && data) {
      const items: ToneProfileListItem[] = (data as Record<string, unknown>[]).map((d) => ({
        id: d.id as string,
        name: d.name as string,
        section_type: d.section_type as string,
        gain_level: d.gain_level as number,
        confidence_score: d.confidence_score as number,
        created_at: d.created_at as string,
        song_title: d.song_title as string,
        artist_name: d.artist_name as string,
        tags: (d.tags as string[]) || [],
        block_roles: (d.block_roles as string[]) || [],
        download_count: (d.download_count as number) || 0,
      }));
      setProfiles(items);
      setTotal(count || 0);
    }
    setLoading(false);
  }, [search, sectionFilter, gainFilter, sortBy, page]);

  useEffect(() => { fetchProfiles(); }, [fetchProfiles]);
  useEffect(() => { setPage(0); }, [search, sectionFilter, gainFilter, sortBy]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-10 pt-4 animate-fade-up">
        <Image src="/logo.jpg" alt="Tone Recipes" width={420} height={236} className="mx-auto mb-5 rounded-xl object-contain" priority />
        <p className="text-base max-w-xl mx-auto text-muted-foreground leading-relaxed">
          {total > 0 ? (
            <>
              <span className="font-semibold text-primary">{total}</span>{" "}
              iconic guitar tones, analyzed and ready to generate Ampero II Stomp presets.
            </>
          ) : (
            "Browse iconic guitar tones and generate custom presets."
          )}
        </p>
      </div>

      {/* Search + Sort */}
      <div className="max-w-xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: "40ms" }}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by artist, song, or tone name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card ring-1 ring-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-3 animate-fade-up" style={{ animationDelay: "80ms" }}>
        <div className="label mb-2">Section</div>
        <div className="flex flex-wrap gap-1.5">
          {SECTION_TYPES.map((s) => (
            <Toggle
              key={s}
              variant="outline"
              size="sm"
              pressed={sectionFilter === s}
              onPressedChange={() => setSectionFilter(s)}
              className="data-[state=on]:bg-primary/10 data-[state=on]:text-primary data-[state=on]:ring-primary/20 rounded-full px-3 h-7"
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </Toggle>
          ))}
        </div>
      </div>

      <div className="mb-8 animate-fade-up" style={{ animationDelay: "120ms" }}>
        <div className="label mb-2">Gain</div>
        <div className="flex flex-wrap gap-1.5">
          {GAIN_LEVELS.map((g) => (
            <Toggle
              key={g.value}
              variant="outline"
              size="sm"
              pressed={gainFilter === g.value}
              onPressedChange={() => setGainFilter(g.value)}
              className="data-[state=on]:bg-primary/10 data-[state=on]:text-primary data-[state=on]:ring-primary/20 rounded-full px-3 h-7"
            >
              {g.label}
            </Toggle>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="mx-auto mb-3 size-10 opacity-40" />
          <p className="text-sm">No tones found. Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 stagger">
            {profiles.map((p) => (
              <div key={p.id} className="animate-fade-up">
                <ToneCard profile={p} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
                Previous
              </Button>
              <span className="text-sm font-medium text-muted-foreground tabular-nums">
                {page + 1} / {totalPages}
              </span>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
