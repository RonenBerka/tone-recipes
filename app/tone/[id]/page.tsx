"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ToneProfile, ToneProfileBlock, ToneProfileTag, EvidenceSource, EvidenceClaim } from "@/lib/types";
import { SignalChainDiagram } from "@/components/SignalChainDiagram";
import { ResearchEvidenceCard } from "@/components/ResearchEvidenceCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GoldButton } from "@/components/ui/GoldButton";
import { Skeleton } from "@/components/ui/Skeleton";

const GAIN_LABELS: Record<string, string> = {
  "0.3": "Clean",
  "0.5": "Crunch",
  "0.8": "High Gain",
};
const AMBIENCE_LABELS: Record<string, string> = {
  "0.3": "Dry",
  "0.5": "Medium",
  "0.8": "Wet",
};

export default function ToneRecipePage() {
  const params = useParams();
  const id = params.id as string;
  const [profile, setProfile] = useState<ToneProfile | null>(null);
  const [blocks, setBlocks] = useState<ToneProfileBlock[]>([]);
  const [tags, setTags] = useState<ToneProfileTag[]>([]);
  const [sources, setSources] = useState<EvidenceSource[]>([]);
  const [claims, setClaims] = useState<EvidenceClaim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [profileRes, blocksRes, tagsRes, claimsRes] = await Promise.all([
        supabase
          .from("tone_profiles")
          .select(
            `id, name, section_type, gain_level, ambience_level, confidence_score, research_status, evidence_summary,
            songs!inner(id, title, artists!inner(id, name))`
          )
          .eq("id", id)
          .single(),
        supabase
          .from("tone_profile_blocks")
          .select(
            `id, block_order, block_role, is_optional, settings_json,
            canonical_models!inner(id, canonical_name, reference_real_gear_name, category, subcategory, family_name)`
          )
          .eq("tone_profile_id", id)
          .order("block_order"),
        supabase
          .from("tone_profile_tags")
          .select("id, tag")
          .eq("tone_profile_id", id),
        supabase
          .from("claims")
          .select("id, predicate, object_text, claim_type, confidence_score")
          .eq("subject_id", id)
          .eq("subject_type", "tone_profile")
          .order("predicate"),
      ]);

      if (profileRes.data)
        setProfile(profileRes.data as unknown as ToneProfile);
      if (blocksRes.data)
        setBlocks(blocksRes.data as unknown as ToneProfileBlock[]);
      if (tagsRes.data) setTags(tagsRes.data as unknown as ToneProfileTag[]);
      if (claimsRes.data) setClaims(claimsRes.data as unknown as EvidenceClaim[]);

      // Fetch sources by artist_id (need profile data first)
      if (profileRes.data) {
        const artistId = (profileRes.data as unknown as ToneProfile).songs.artists.id;
        const sourcesRes = await supabase
          .from("sources")
          .select("id, source_type, title, url, base_reliability_score")
          .eq("artist_id", artistId)
          .order("base_reliability_score", { ascending: false });
        if (sourcesRes.data) setSources(sourcesRes.data as unknown as EvidenceSource[]);
      }

      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 pt-4">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-6 w-64" />
        <div className="grid grid-cols-4 gap-4 mt-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <Skeleton className="h-48 mt-6" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        className="text-center py-20"
        style={{ color: "var(--text-muted)" }}
      >
        Tone profile not found.
      </div>
    );
  }

  const gainLabel = GAIN_LABELS[String(profile.gain_level)] || "Mid";
  const ambienceLabel =
    AMBIENCE_LABELS[String(profile.ambience_level)] || "Medium";
  const confidence = Math.round(profile.confidence_score * 100);

  // Build chain for visualization — use reference_real_gear_name for SVG resolution
  const chainBlocks = blocks.map((b) => ({
    slot: b.block_order,
    block_role: b.block_role,
    model:
      b.canonical_models.reference_real_gear_name ||
      b.canonical_models.canonical_name,
    canonical: b.canonical_models.canonical_name,
    mapping_type: "exactish" as const,
    similarity: 1,
    params: b.settings_json || {},
  }));

  const metaChips = [
    { label: "Section", value: profile.section_type },
    { label: "Gain", value: gainLabel },
    { label: "Ambience", value: ambienceLabel },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div
        className="text-sm mb-6 animate-fade-up"
        style={{ color: "var(--text-muted)" }}
      >
        <Link
          href="/"
          className="transition-colors hover:text-[var(--text-primary)]"
        >
          Library
        </Link>
        <span className="mx-2">/</span>
        <span style={{ color: "var(--text-secondary)" }}>
          {profile.songs.artists.name} — {profile.songs.title}
        </span>
      </div>

      {/* Hero header */}
      <div className="mb-10 animate-fade-up" style={{ animationDelay: "50ms" }}>
        <h1 className="text-4xl font-bold tracking-tight">
          {profile.songs.artists.name}
        </h1>
        <h2
          className="text-xl mt-1"
          style={{ color: "var(--text-secondary)" }}
        >
          {profile.songs.title}
        </h2>
        <p
          className="text-base font-medium mt-2"
          style={{ color: "var(--accent-gold)" }}
        >
          {profile.name}
        </p>
      </div>

      {/* Metadata chips */}
      <div
        className="grid grid-cols-3 gap-3 mb-4 animate-fade-up"
        style={{ animationDelay: "100ms" }}
      >
        {metaChips.map((chip) => (
          <div key={chip.label} className="glass-static p-4">
            <div
              className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-1"
              style={{ color: "var(--text-muted)" }}
            >
              {chip.label}
            </div>
            <div
              className="font-bold text-lg capitalize"
              style={{ color: "var(--text-primary)" }}
            >
              {chip.value}
            </div>
          </div>
        ))}
      </div>

      {/* Research Score */}
      <div
        className="glass-static p-4 mb-10 flex items-center gap-4 animate-fade-up"
        style={{ animationDelay: "120ms" }}
      >
        <div
          className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold"
          style={{
            background:
              confidence >= 85
                ? "rgba(34,197,94,0.12)"
                : confidence >= 70
                  ? "rgba(212,168,50,0.12)"
                  : "rgba(245,158,11,0.12)",
            color:
              confidence >= 85
                ? "#22c55e"
                : confidence >= 70
                  ? "var(--accent-gold)"
                  : "#f59e0b",
            border: `1px solid ${
              confidence >= 85
                ? "rgba(34,197,94,0.25)"
                : confidence >= 70
                  ? "rgba(212,168,50,0.25)"
                  : "rgba(245,158,11,0.25)"
            }`,
          }}
        >
          {confidence}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-0.5"
            style={{ color: "var(--text-muted)" }}
          >
            Research Score
          </div>
          <div
            className="text-sm leading-snug"
            style={{ color: "var(--text-secondary)" }}
          >
            {confidence >= 85
              ? "Well-documented tone — based on rig rundowns, interviews, and verified gear lists."
              : confidence >= 70
                ? "Solid research — based on community consensus and published references."
                : "Partially documented — some gear details are inferred from available sources."}
          </div>
          <div className="confidence-bar mt-2">
            <div
              className="confidence-bar-fill"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      </div>

      {/* Research Evidence */}
      <div className="mb-10 animate-fade-up" style={{ animationDelay: "140ms" }}>
        <ResearchEvidenceCard
          researchStatus={profile.research_status || "unresearched"}
          evidenceSummary={profile.evidence_summary}
          sources={sources}
          claims={claims}
        />
      </div>

      {/* Canonical Signal Chain */}
      <div className="mb-10 animate-fade-up" style={{ animationDelay: "150ms" }}>
        <SectionHeading subtitle="The gear chain that defines this tone">
          Canonical Signal Chain
        </SectionHeading>
        <div className="glass-static p-6">
          <SignalChainDiagram chain={chainBlocks} showMapping={false} />
        </div>
      </div>

      {/* Gear blocks detail */}
      <div className="mb-10 animate-fade-up" style={{ animationDelay: "200ms" }}>
        <SectionHeading subtitle="Individual gear components in the chain">
          Gear Details
        </SectionHeading>
        <div className="space-y-2">
          {blocks.map((b) => (
            <div
              key={b.id}
              className="glass-static flex items-center justify-between px-5 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-[10px] uppercase tracking-wider font-semibold w-24"
                  style={{ color: "var(--text-muted)" }}
                >
                  {b.block_role}
                </span>
                <span
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {b.canonical_models.canonical_name}
                </span>
              </div>
              <span
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                {b.canonical_models.family_name || b.canonical_models.subcategory}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-10 animate-fade-up" style={{ animationDelay: "250ms" }}>
          <SectionHeading>Tags</SectionHeading>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t.id}
                className="chip"
              >
                {t.tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Generate CTA */}
      <div
        className="glass-static p-8 text-center animate-fade-up"
        style={{
          animationDelay: "300ms",
          borderColor: "rgba(212,168,50,0.15)",
        }}
      >
        <h3 className="text-xl font-bold mb-2">
          Generate Device Preset
        </h3>
        <p
          className="text-sm mb-5 max-w-md mx-auto"
          style={{ color: "var(--text-secondary)" }}
        >
          Select your device, guitar, and output to generate a custom preset
          tailored to this tone.
        </p>
        <Link href={`/generate/${id}`}>
          <GoldButton className="inline-flex items-center gap-2">
            Generate Preset
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </GoldButton>
        </Link>
      </div>
    </div>
  );
}
