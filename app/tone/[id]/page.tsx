"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ToneProfile, ToneProfileBlock } from "@/lib/types";
import { resolveGearSvg } from "@/lib/gearSvgMap";
import { HardwareChassis } from "@/components/HardwareChassis";

/* ───────── Role display maps ───────── */
const ROLE_SHORT: Record<string, string> = {
  gate: "GATE", compressor: "COMP", wah: "WAH", boost: "BST",
  overdrive: "OD", distortion: "DIST", fuzz: "FUZZ", amp: "AMP",
  cab: "CAB", eq: "EQ", modulation: "MOD", delay: "DLY", reverb: "RVB", utility: "UTIL",
};

/* Category-specific colors for each block type */
const BLOCK_COLORS: Record<string, string> = {
  gate:       "#607080",
  compressor: "#2a7fd4",
  wah:        "#b05a10",
  boost:      "#c8a020",
  overdrive:  "#b84729",
  distortion: "#a83228",
  fuzz:       "#7a38b0",
  amp:        "#e08b26",
  cab:        "#7a6e62",
  eq:         "#22875a",
  modulation: "#14887a",
  delay:      "#2060a0",
  reverb:     "#4838a0",
  utility:    "#5d6d7e",
};

const BLOCK_ROLE_DESCRIPTIONS: Record<string, string> = {
  gate:       "Cleans noise before it reaches the amp. Threshold set just above the noise floor.",
  compressor: "Evens out dynamics and adds sustain. Attack and release shape the feel.",
  wah:        "Expressive filter sweep. Sweep range and resonance determine how vocal it sounds.",
  boost:      "Pushes the amp input harder for more drive. Even subtle boost changes character significantly.",
  overdrive:  "Warm asymmetric clipping that retains dynamic range. Backs off when you roll down the volume.",
  distortion: "Harder clipping, more compressed, less dynamic. Extended sustain with reshaped harmonics.",
  fuzz:       "Extreme clipping — thick, compressed, violin-like sustain. Reacts to guitar volume and pickup impedance.",
  amp:        "Core of the tone — gain structure, voicing, character. Every other block serves what happens here.",
  cab:        "Speaker colour and mic placement. Cabinet choice is as important as amp choice.",
  eq:         "Frequency shaping — cuts or broad boosts. Position determines whether it shapes input or output character.",
  modulation: "Movement through chorus, flange, phaser, tremolo, or vibe. Rate and depth set the intensity.",
  delay:      "Echoes that add depth and rhythm. Timing relative to tempo defines whether it glues or clutters.",
  reverb:     "Places the sound in a space. Pre-delay separates the dry signal from the reverb wash.",
};

const GAIN_LABELS: Record<string, string> = { "0.3": "CLEAN", "0.5": "CRUNCH", "0.8": "HI-GAIN" };
const AMBIENCE_LABELS: Record<string, string> = { "0.3": "DRY", "0.5": "MED-WET", "0.8": "WET" };

const SOURCE_TYPE_LABELS: Record<string, string> = {
  youtube:        "YouTube",
  rig_rundown:    "Rig Rundown",
  interview:      "Interview",
  equipboard:     "Equipboard",
  tab_book:       "Tab Book",
  forum:          "Forum",
  article:        "Article",
  documentary:    "Documentary",
  official:       "Official",
};

const SOURCE_TYPE_COLORS: Record<string, string> = {
  youtube:     "#c0392b",
  rig_rundown: "#2471a3",
  interview:   "#27ae60",
  equipboard:  "#8e44ad",
  tab_book:    "#d35400",
  forum:       "#7f8c8d",
  article:     "#16a085",
  official:    "#e08b26",
};

/* ───────── Types ───────── */
interface SourceRow {
  id: string;
  source_type: string;
  title: string;
  url: string | null;
  author_name: string | null;
  base_reliability_score: number | null;
  snippet: string | null;
}

type CertaintyTier = "certain" | "partial" | "estimate";
type ViewMode = "MANUAL SET" | "PRESET FILE" | "ALT GEAR";

function getCertaintyTier(status: string | null, conf: number): CertaintyTier {
  if (status === "verified" || (status === "researched" && conf >= 80)) return "certain";
  if (status === "researched" || (status === "partial" && conf >= 60)) return "partial";
  return "estimate";
}

const CERTAINTY_CONFIG = {
  certain: { label: "VERIFIED", icon: "✓", color: "#22c55e" },
  partial:  { label: "PARTIAL",  icon: "~", color: "#e08b26" },
  estimate: { label: "ESTIMATE", icon: "?", color: "#968a7c" },
};

/* ───────── Sub-components ───────── */
function Cable({ color = "#e08b26" }: { color?: string }) {
  return (
    <svg width="28" height="18" viewBox="0 0 36 24" fill="none" className="flex-shrink-0">
      <path d="M0 12 C6 12, 6 6, 14 6 C22 6, 22 18, 30 18 C33 18, 36 12, 36 12"
        stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.55" />
      <circle cx="2"  cy="12" r="2.5" fill={color} opacity="0.7" />
      <circle cx="34" cy="12" r="2.5" fill={color} opacity="0.7" />
    </svg>
  );
}

function Knob({ label, rotation = 0 }: { label: string; rotation?: number }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-9 h-9 rounded-full cursor-ns-resize"
        style={{ background: "radial-gradient(circle at 40% 40%, #e8e8e8 0%, #a0a0a0 70%, #666 100%)", border: "1px solid #222", boxShadow: "0 5px 8px rgba(0,0,0,0.6), inset 0 -2px 4px rgba(0,0,0,0.4), inset 0 2px 2px #fff" }}>
        <div className="absolute w-[3px] h-[10px] bg-[#111]"
          style={{ top: 4, left: "50%", transformOrigin: "50% 15px", transform: `translateX(-50%) rotate(${rotation}deg)` }} />
      </div>
      <span className="hw-label" style={{ fontSize: 9 }}>{label}</span>
    </div>
  );
}

/* ───────── Main page ───────── */
export default function ToneRecipePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [profile, setProfile]         = useState<ToneProfile | null>(null);
  const [blocks, setBlocks]           = useState<ToneProfileBlock[]>([]);
  const [sources, setSources]         = useState<SourceRow[]>([]);
  const [loading, setLoading]         = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewMode, setViewMode]       = useState<ViewMode>("MANUAL SET");

  useEffect(() => {
    async function load() {
      const [profileRes, blocksRes] = await Promise.all([
        supabase.from("tone_profiles")
          .select(`id, name, section_type, gain_level, ambience_level, confidence_score, research_status, evidence_summary,
                   songs!inner(id, title, artists!inner(id, name))`)
          .eq("id", id).single(),
        supabase.from("tone_profile_blocks")
          .select(`id, block_order, block_role, is_optional, settings_json,
                   canonical_models!inner(id, canonical_name, reference_real_gear_name, category, subcategory, family_name)`)
          .eq("tone_profile_id", id).order("block_order"),
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data as unknown as ToneProfile);
        // Fetch sources by song_id
        const songId = (profileRes.data as any).songs?.id;
        if (songId) {
          supabase.from("sources")
            .select("id, source_type, title, url, author_name, base_reliability_score, snippet")
            .eq("song_id", songId)
            .order("base_reliability_score", { ascending: false })
            .then(({ data }) => { if (data) setSources(data as SourceRow[]); });
        }
      }
      if (blocksRes.data) setBlocks(blocksRes.data as unknown as ToneProfileBlock[]);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <HardwareChassis>
        <div className="hw-screen flex items-center justify-center p-8">
          <div className="text-[11px] font-extrabold tracking-[0.2em] uppercase" style={{ color: "#4a3e30" }}>
            LOADING...
          </div>
        </div>
      </HardwareChassis>
    );
  }

  if (!profile) {
    return (
      <HardwareChassis>
        <div className="hw-screen flex items-center justify-center p-8">
          <div className="text-sm font-bold" style={{ color: "#4a3e30" }}>TONE NOT FOUND</div>
        </div>
      </HardwareChassis>
    );
  }

  const confidence    = Math.round(profile.confidence_score * 100);
  const tier          = getCertaintyTier(profile.research_status, confidence);
  const tc            = CERTAINTY_CONFIG[tier];
  const selectedBlock = blocks[selectedIndex] ?? null;
  const svgFile       = selectedBlock
    ? resolveGearSvg(selectedBlock.canonical_models.reference_real_gear_name || selectedBlock.canonical_models.canonical_name, selectedBlock.block_role)
      || resolveGearSvg(selectedBlock.canonical_models.canonical_name, selectedBlock.block_role)
    : null;

  return (
    <HardwareChassis fullWidth title={profile.songs.artists.name} subtitle={profile.songs.title}>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "#968a7c" }}>
        <Link href="/" className="hover:opacity-70" style={{ color: "#968a7c" }}>CATALOG</Link>
        <span>//</span>
        <span style={{ color: "#e08b26" }}>{profile.songs.artists.name} — {profile.songs.title}</span>
      </div>

      {/* ── Signal Chain Monitor ── */}
      <div className="hw-rack flex flex-col gap-3 p-3 sm:p-4">
        <div className="hw-label">SIGNAL CHAIN MONITOR</div>
        <div className="flex items-center overflow-x-auto pb-2" style={{ gap: 0 }}>

          {/* Input jack */}
          <div className="flex-shrink-0 mr-1">
            <div className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ border: "2px solid #e08b26", background: "#0f0d0b" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#e08b26" }} />
            </div>
          </div>
          <Cable />

          {blocks.map((b, i) => {
            const isSelected = i === selectedIndex;
            const blockColor = BLOCK_COLORS[b.block_role] || "#7a6e62";
            const modelLabel = (b.canonical_models.reference_real_gear_name || b.canonical_models.canonical_name)
              .split(" ").slice(0, 3).join(" ");

            return (
              <div key={b.id} className="flex items-center flex-shrink-0">
                <button
                  onClick={() => setSelectedIndex(i)}
                  title={b.canonical_models.reference_real_gear_name || b.canonical_models.canonical_name}
                  className="flex flex-col items-center justify-center gap-1 transition-all duration-100 active:translate-y-px"
                  style={{
                    width: 80, height: 72, flexShrink: 0,
                    ...(isSelected ? {
                      background: `linear-gradient(180deg, #e08b26 0%, #b36814 100%)`,
                      border: "2px solid #000",
                      boxShadow: `0 0 20px rgba(224,139,38,0.45), inset 0 1px 0 rgba(255,255,255,0.5)`,
                      color: "#1a0e02",
                    } : {
                      background: `linear-gradient(180deg, ${blockColor}30 0%, ${blockColor}18 100%)`,
                      border: `1px solid ${blockColor}60`,
                      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04)`,
                      color: "#c4b5ac",
                    })
                  }}
                >
                  <span
                    className="text-[11px] font-black tracking-[0.04em] leading-none"
                    style={{ color: isSelected ? "#1a0e02" : blockColor }}
                  >
                    {ROLE_SHORT[b.block_role] || b.block_role.slice(0, 4).toUpperCase()}
                  </span>
                  <span
                    className="text-[8px] font-semibold text-center leading-tight px-1"
                    style={{
                      color: isSelected ? "rgba(26,14,2,0.75)" : "rgba(232,223,206,0.6)",
                      maxWidth: 74,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {modelLabel}
                  </span>
                  {b.is_optional && (
                    <span className="text-[7px] font-black uppercase"
                      style={{ color: isSelected ? "rgba(26,14,2,0.5)" : "#968a7c" }}>
                      OPT
                    </span>
                  )}
                </button>
                {i < blocks.length - 1 && (
                  <Cable color={isSelected ? "#e08b26" : "#4a3e30"} />
                )}
              </div>
            );
          })}

          <Cable />
          {/* Output jack */}
          <div className="flex-shrink-0 ml-1">
            <div className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ border: "2px solid #e08b26", background: "#0f0d0b" }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="#e08b26"><polygon points="5,3 19,12 5,21" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lower: Inspector + Controls ── */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">

        {/* Main content area */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="hw-label">
            {viewMode === "MANUAL SET" ? "COMPONENT INSPECTOR" :
             viewMode === "PRESET FILE" ? "GENERATE PRESET" : "ALT GEAR MATRIX"}
          </div>

          <div className="hw-screen flex-1 flex flex-col" style={{ minHeight: 280, padding: 0 }}>

            {/* ── MANUAL SET view ── */}
            {viewMode === "MANUAL SET" && selectedBlock && (
              <div className="flex flex-col h-full">
                {/* Block header bar */}
                <div className="flex items-start justify-between gap-3 p-4 pb-3"
                  style={{ borderBottom: "2px solid rgba(0,0,0,0.25)" }}>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-black uppercase leading-tight mb-1" style={{ color: "#111" }}>
                      {selectedBlock.canonical_models.reference_real_gear_name || selectedBlock.canonical_models.canonical_name}
                    </h2>
                    <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#333" }}>
                      {ROLE_SHORT[selectedBlock.block_role]}
                      {profile.gain_level && ` · ${GAIN_LABELS[String(profile.gain_level)] || "MID"}`}
                      {profile.ambience_level && ` · ${AMBIENCE_LABELS[String(profile.ambience_level)] || "MED-WET"}`}
                    </div>
                  </div>
                  {/* Badges */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[9px] font-black tracking-[0.1em] px-2 py-1"
                      style={{ background: "#111", color: "#e08b26", border: "1px solid #333" }}>
                      {ROLE_SHORT[selectedBlock.block_role]}
                    </span>
                    <span className="text-[9px] font-black tracking-[0.1em] px-2 py-1"
                      style={{ background: tc.color, color: "#111", border: "1px solid #000" }}>
                      {tc.icon} {tc.label}
                    </span>
                  </div>
                </div>

                {/* Gear icon — below header, above description */}
                {svgFile && (
                  <div className="flex items-center justify-center py-4"
                    style={{ borderBottom: "1px solid rgba(0,0,0,0.15)" }}>
                    <div className="flex items-center justify-center"
                      style={{
                        width: 96, height: 96,
                        background: "rgba(0,0,0,0.12)",
                        border: "1px solid rgba(0,0,0,0.2)",
                        padding: 8,
                      }}>
                      <Image
                        src={`/gear-svgs/${svgFile}`}
                        alt={selectedBlock.canonical_models.canonical_name}
                        width={80} height={80}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
                  <p className="text-[13px] font-semibold leading-relaxed"
                    style={{ color: "#1a1a1a" }}>
                    {BLOCK_ROLE_DESCRIPTIONS[selectedBlock.block_role] || "Effect block in the signal chain."}
                  </p>
                </div>

                {/* Sources */}
                {sources.length > 0 && (
                  <div className="flex flex-col gap-0 flex-1 overflow-y-auto">
                    <div className="px-4 py-2 flex items-center justify-between"
                      style={{ borderBottom: "1px solid rgba(0,0,0,0.15)", background: "rgba(0,0,0,0.08)" }}>
                      <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: "#1a1a1a" }}>
                        RESEARCH SOURCES
                      </span>
                      <span className="text-[9px] font-bold" style={{ color: "#333" }}>
                        {sources.length} SOURCE{sources.length !== 1 ? "S" : ""}
                      </span>
                    </div>
                    {sources.map((src) => {
                      const typeLabel = SOURCE_TYPE_LABELS[src.source_type] || src.source_type.toUpperCase();
                      const typeColor = SOURCE_TYPE_COLORS[src.source_type] || "#968a7c";
                      const reliability = src.base_reliability_score
                        ? Math.round(src.base_reliability_score * 100)
                        : null;
                      return (
                        <div key={src.id} className="px-4 py-2.5 flex items-start gap-3"
                          style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                          {/* Type badge */}
                          <span className="flex-shrink-0 text-[8px] font-black uppercase px-1.5 py-0.5 mt-0.5"
                            style={{ background: `${typeColor}22`, border: `1px solid ${typeColor}55`, color: typeColor }}>
                            {typeLabel}
                          </span>
                          {/* Source info */}
                          <div className="flex-1 min-w-0">
                            {src.url ? (
                              <a href={src.url} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 group">
                                <span className="text-[11px] font-bold truncate group-hover:underline"
                                  style={{ color: "#111" }}>
                                  {src.title && src.title !== src.url ? src.title : src.url.replace(/^https?:\/\//, "").slice(0, 50)}
                                </span>
                                <ExternalLink size={9} style={{ color: "#555", flexShrink: 0 }} />
                              </a>
                            ) : (
                              <span className="text-[11px] font-bold" style={{ color: "#111" }}>
                                {src.title}
                              </span>
                            )}
                            {src.author_name && (
                              <div className="text-[9px] font-bold mt-0.5" style={{ color: "#555" }}>
                                {src.author_name}
                              </div>
                            )}
                            {src.snippet && (
                              <p className="text-[9px] mt-1 leading-relaxed italic line-clamp-2" style={{ color: "#333" }}>
                                "{src.snippet}"
                              </p>
                            )}
                          </div>
                          {/* Reliability */}
                          {reliability !== null && (
                            <div className="flex-shrink-0 flex flex-col items-center gap-0.5">
                              <span className="text-[10px] font-black font-mono"
                                style={{ color: reliability >= 80 ? "#22c55e" : reliability >= 60 ? "#e08b26" : "#968a7c" }}>
                                {reliability}%
                              </span>
                              <span className="text-[7px] font-bold uppercase" style={{ color: "#968a7c" }}>REL</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Evidence summary fallback if no individual sources loaded */}
                {sources.length === 0 && profile.evidence_summary && (
                  <div className="px-4 py-3 mt-1"
                    style={{ background: "rgba(0,0,0,0.08)", borderLeft: "3px solid rgba(0,0,0,0.25)" }}>
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#333" }}>
                      RESEARCH SUMMARY
                    </div>
                    <div className="text-[11px] font-bold" style={{ color: "#2a1e0a" }}>
                      {profile.evidence_summary.source_count > 0 && (
                        <span>{profile.evidence_summary.source_count} SOURCE{profile.evidence_summary.source_count !== 1 ? "S" : ""} · </span>
                      )}
                      {profile.evidence_summary.claim_count > 0 && (
                        <span>{profile.evidence_summary.claim_count} CLAIM{profile.evidence_summary.claim_count !== 1 ? "S" : ""} · </span>
                      )}
                      {profile.evidence_summary.has_rig_rundown && <span>RIG RUNDOWN · </span>}
                      {profile.evidence_summary.has_interview && <span>INTERVIEW · </span>}
                      RELIABILITY: {Math.round(profile.evidence_summary.avg_source_reliability * 100)}%
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── PRESET FILE view ── */}
            {viewMode === "PRESET FILE" && (
              <div className="flex flex-col items-center justify-center gap-5 flex-1 p-6">
                <div className="text-center">
                  <div className="text-xl font-black uppercase mb-1.5" style={{ color: "#111" }}>
                    GENERATE PRESET FILE
                  </div>
                  <div className="text-sm font-semibold" style={{ color: "#333" }}>
                    {profile.songs.artists.name} — {profile.songs.title}
                  </div>
                </div>
                <Link href={`/generate/${id}`}>
                  <button className="text-sm font-black uppercase tracking-[0.1em] px-8 py-4"
                    style={{ background: "#b84729", color: "#fff", border: "2px solid #111", boxShadow: "0 4px 0 #000, inset 0 2px 0 rgba(255,255,255,0.2)" }}>
                    SELECT GEAR &amp; GENERATE .PRST
                  </button>
                </Link>
                <div className="text-[10px] font-bold tracking-[0.1em] uppercase" style={{ color: "#4a3e30" }}>
                  COMPATIBLE: HOTONE AMPERO II STOMP
                </div>
              </div>
            )}

            {/* ── ALT GEAR view ── */}
            {viewMode === "ALT GEAR" && (
              <div className="flex flex-col overflow-hidden">
                <div className="grid py-2.5 px-4 text-[9px] font-black uppercase"
                  style={{ gridTemplateColumns: "72px 1fr 90px", borderBottom: "2px solid rgba(0,0,0,0.2)", color: "#000" }}>
                  <div>BLOCK</div>
                  <div>REFERENCE GEAR</div>
                  <div>CONFIDENCE</div>
                </div>
                <div className="overflow-y-auto flex-1">
                  {blocks.map((b, i) => {
                    const blockColor = BLOCK_COLORS[b.block_role] || "#7a6e62";
                    return (
                      <div key={b.id}
                        className="grid items-center py-2.5 px-4 cursor-pointer transition-colors"
                        style={{
                          gridTemplateColumns: "72px 1fr 90px",
                          borderBottom: "1px solid rgba(0,0,0,0.1)",
                          background: i === selectedIndex ? "rgba(224,139,38,0.12)" : "transparent",
                        }}
                        onClick={() => setSelectedIndex(i)}
                      >
                        <div className="text-[10px] font-black uppercase" style={{ color: blockColor }}>
                          {ROLE_SHORT[b.block_role]}
                        </div>
                        <div className="text-[11px] font-bold truncate pr-2" style={{ color: "#1a1a1a", fontFamily: "'Courier New', monospace" }}>
                          {b.canonical_models.reference_real_gear_name || b.canonical_models.canonical_name}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div style={{ width: 48, height: 8, background: "rgba(0,0,0,0.15)", border: "1px solid rgba(0,0,0,0.2)", position: "relative" }}>
                            <div style={{ position: "absolute", inset: 0, right: "auto", width: `${Math.round(profile.confidence_score * 100)}%`, background: "#e08b26" }} />
                          </div>
                          <span className="text-[9px] font-bold" style={{ color: "#333" }}>
                            {Math.round(profile.confidence_score * 100)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Controls panel ── */}
        <div className="flex flex-row lg:flex-col justify-between gap-4 lg:gap-6 lg:w-[175px] lg:flex-shrink-0">

          {/* Mode selector */}
          <div className="flex flex-col gap-2 flex-1 lg:flex-none">
            <div className="hw-label">IMPLEMENT MODE</div>
            <div className="flex flex-row lg:flex-col gap-1 p-1.5"
              style={{ background: "#0f0d0b", border: "1px solid #221d19", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.8)" }}>
              {(["PRESET FILE", "MANUAL SET", "ALT GEAR"] as ViewMode[]).map((mode) => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  className={`hw-mode-btn ${viewMode === mode ? "active" : ""}`}
                  style={{ padding: "7px 10px" }}>
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Knobs — desktop only */}
          <div className="hidden lg:flex justify-around w-full pt-2">
            <Knob label="DRIVE" rotation={-45} />
            <Knob label="DEPTH" rotation={30} />
            <Knob label="MIX"   rotation={120} />
          </div>

          {/* Save / Routing — desktop only */}
          <div className="hidden lg:flex justify-between items-end">
            <div className="flex flex-col items-center gap-1.5">
              <div className="hw-label">ROUTING</div>
              <div className="grid grid-cols-2 gap-1 p-1.5"
                style={{ background: "#0f0d0b", border: "1px solid #221d19", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.8)" }}>
                {["IN", "FX", "ON", "BP"].map((lbl, i) => (
                  <div key={lbl} className="w-8 h-8 flex items-center justify-center text-[10px] font-black border border-black"
                    style={i === 2
                      ? { background: "linear-gradient(180deg, #e08b26 0%, #b86b14 100%)", color: "#1a0e02", boxShadow: "0 0 10px rgba(224,139,38,0.5)" }
                      : { background: "linear-gradient(180deg, #dcd3c0 0%, #ad9f88 100%)", color: "#111" }}>
                    {lbl}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 p-2"
              style={{ background: "#dcd3c0", border: "2px solid #111", boxShadow: "3px 3px 0 rgba(0,0,0,0.3)" }}>
              <div className="w-2 h-2 rounded-full border border-white"
                style={{ background: "#e08b26", boxShadow: "0 0 8px #e08b26" }} />
              <Link href={`/generate/${id}`}>
                <button className="text-[10px] font-black uppercase tracking-[0.06em] px-3 py-2 text-white"
                  style={{ background: "#b84729", border: "2px solid #111", boxShadow: "inset 0 2px 0 rgba(255,255,255,0.25), 0 3px 0 #111" }}>
                  GENERATE
                </button>
              </Link>
              <div className="font-mono text-[10px] font-bold px-1.5 py-0.5 hw-display"
                style={{ border: "2px solid #111" }}>
                SLOT {(selectedIndex + 1).toString().padStart(2, "0")}
              </div>
            </div>
          </div>

          {/* Mobile-only: quick generate button */}
          <div className="flex lg:hidden items-center">
            <Link href={`/generate/${id}`}>
              <button className="text-[11px] font-black uppercase tracking-[0.06em] px-4 py-3"
                style={{ background: "#b84729", color: "#fff", border: "2px solid #111", boxShadow: "0 3px 0 #000, inset 0 2px 0 rgba(255,255,255,0.2)" }}>
                GENERATE PRESET
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap justify-between items-center gap-2 pt-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <Link href="/" className="text-[10px] font-bold uppercase tracking-[0.12em] hover:opacity-70"
          style={{ color: "#968a7c" }}>
          ← BACK TO CATALOG
        </Link>
        <div className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: "#4a3e30" }}>
          {profile.name} · {blocks.length} BLOCKS · {confidence}% CONFIDENCE
        </div>
      </div>
    </HardwareChassis>
  );
}
