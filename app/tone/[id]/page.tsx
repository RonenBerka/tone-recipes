"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ToneProfile, ToneProfileBlock, ToneProfileTag, EvidenceSource, EvidenceClaim } from "@/lib/types";
import { SignalChainDiagram } from "@/components/SignalChainDiagram";
import { ResearchEvidenceCard } from "@/components/ResearchEvidenceCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

function scoreStyle(confidence: number) {
  if (confidence >= 85)
    return { bg: "rgba(34,197,94,0.10)", color: "#22c55e", border: "rgba(34,197,94,0.18)" };
  if (confidence >= 70)
    return { bg: "rgba(212,168,50,0.08)", color: "hsl(var(--primary))", border: "rgba(212,168,50,0.18)" };
  return { bg: "rgba(245,158,11,0.10)", color: "#f59e0b", border: "rgba(245,158,11,0.18)" };
}

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
        <div className="grid grid-cols-3 gap-3 mt-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <Skeleton className="h-48 mt-6" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Tone profile not found.
      </div>
    );
  }

  const gainLabel = GAIN_LABELS[String(profile.gain_level)] || "Mid";
  const ambienceLabel = AMBIENCE_LABELS[String(profile.ambience_level)] || "Medium";
  const confidence = Math.round(profile.confidence_score * 100);
  const s = scoreStyle(confidence);

  const chainBlocks = blocks.map((b) => ({
    slot: b.block_order,
    block_role: b.block_role,
    model: b.canonical_models.reference_real_gear_name || b.canonical_models.canonical_name,
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
      <div className="text-sm mb-6 animate-fade-up text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          Library
        </Link>
        <span className="mx-2">/</span>
        <span className="text-muted-foreground">
          {profile.songs.artists.name} — {profile.songs.title}
        </span>
      </div>

      {/* Hero header */}
      <div className="mb-8 animate-fade-up" style={{ animationDelay: "40ms" }}>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {profile.songs.artists.name}
        </h1>
        <h2 className="text-lg mt-1 text-muted-foreground">
          {profile.songs.title}
        </h2>
        <p className="text-sm font-medium mt-2 text-primary">
          {profile.name}
        </p>
      </div>

      {/* Metadata chips */}
      <div className="grid grid-cols-3 gap-3 mb-4 animate-fade-up" style={{ animationDelay: "80ms" }}>
        {metaChips.map((chip) => (
          <Card key={chip.label} size="sm">
            <CardContent>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{chip.label}</div>
              <div className="font-bold text-lg capitalize text-foreground">
                {chip.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Research Score */}
      <Card className="mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
        <CardContent className="flex items-center gap-4">
          <div
            className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-base font-bold"
            style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
          >
            {confidence}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">Research Score</div>
            <div className="text-sm leading-snug text-muted-foreground">
              {confidence >= 85
                ? "Well-documented tone — based on rig rundowns, interviews, and verified gear lists."
                : confidence >= 70
                  ? "Solid research — based on community consensus and published references."
                  : "Partially documented — some gear details are inferred from available sources."}
            </div>
            <div className="confidence-bar mt-2">
              <div className="confidence-bar-fill" style={{ width: `${confidence}%` }} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Research Evidence */}
      <div className="mb-8 animate-fade-up" style={{ animationDelay: "120ms" }}>
        <ResearchEvidenceCard
          researchStatus={profile.research_status || "unresearched"}
          evidenceSummary={profile.evidence_summary}
          sources={sources}
          claims={claims}
        />
      </div>

      {/* Canonical Signal Chain */}
      <div className="mb-8 animate-fade-up" style={{ animationDelay: "140ms" }}>
        <SectionHeading subtitle="The gear chain that defines this tone">
          Canonical Signal Chain
        </SectionHeading>
        <Card>
          <CardContent>
            <SignalChainDiagram chain={chainBlocks} showMapping={false} />
          </CardContent>
        </Card>
      </div>

      {/* Gear blocks detail */}
      <div className="mb-8 animate-fade-up" style={{ animationDelay: "160ms" }}>
        <SectionHeading subtitle="Individual gear components in the chain">
          Gear Details
        </SectionHeading>
        <div className="space-y-1.5">
          {blocks.map((b) => (
            <Card key={b.id} size="sm">
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground w-24">{b.block_role}</span>
                  <span className="font-medium text-sm text-foreground">
                    {b.canonical_models.canonical_name}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {b.canonical_models.family_name || b.canonical_models.subcategory}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-8 animate-fade-up" style={{ animationDelay: "180ms" }}>
          <SectionHeading>Tags</SectionHeading>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <Badge key={t.id} variant="secondary">{t.tag}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Generate CTA */}
      <Card
        className="text-center animate-fade-up border-primary/10"
        style={{ animationDelay: "200ms" }}
      >
        <CardContent className="py-4">
          <h3 className="text-lg font-bold mb-2 text-foreground">Generate Device Preset</h3>
          <p className="text-sm mb-5 max-w-md mx-auto text-muted-foreground">
            Select your device, guitar, and output to generate a custom preset tailored to this tone.
          </p>
          <Link href={`/generate/${id}`}>
            <Button className="inline-flex items-center gap-2">
              Generate Preset
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
