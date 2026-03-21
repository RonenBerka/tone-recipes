"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ToneProfile, ToneProfileBlock } from "@/lib/types";
import { resolveGearSvg } from "@/lib/gearSvgMap";
import { HardwareChassis } from "@/components/HardwareChassis";
import { GEAR_ENCYCLOPEDIA } from "@/lib/gearEncyclopedia";
import { getRigSlots, saveToSlot } from "@/lib/rigStorage";
import { downloadHelixPatch, HelixBlock } from "@/lib/helixExport";
import { lookupPlatformEntry, PLATFORM_LABELS, PLATFORM_COLORS } from "@/lib/platformMappings";

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
  youtube:          "YouTube",
  youtube_analysis: "Video",
  rig_rundown:      "Rig Rundown",
  interview:        "Interview",
  equipboard:       "Equipboard",
  tab_book:         "Tab Book",
  forum:            "Forum",
  article:          "Article",
  documentary:      "Documentary",
  official:         "Official",
  manufacturer_doc: "Manufacturer",
};

const SOURCE_TYPE_COLORS: Record<string, string> = {
  youtube:          "#c0392b",
  youtube_analysis: "#c0392b",
  rig_rundown:      "#2471a3",
  interview:        "#27ae60",
  equipboard:       "#8e44ad",
  tab_book:         "#d35400",
  forum:            "#7f8c8d",
  article:          "#16a085",
  official:         "#e08b26",
  manufacturer_doc: "#1a6b9a",
};

/* Look up encyclopedia entry by gear name */
function lookupGearEntry(refName: string, canonicalName: string) {
  const candidates = [
    refName,
    canonicalName,
    refName?.replace(/ style$/i, "").trim(),
    canonicalName?.replace(/ style$/i, "").trim(),
    refName?.replace(/ style \w+$/i, "").trim(),
  ].filter(Boolean).map(s => s!.toLowerCase().trim());

  for (const key of candidates) {
    if (GEAR_ENCYCLOPEDIA[key]) return GEAR_ENCYCLOPEDIA[key];
  }
  return null;
}

/* ───────── Position & approach context maps ───────── */
const BLOCK_POSITION_CONTEXT: Record<string, string> = {
  gate:       "First in chain — kills noise before it gets amplified by anything downstream.",
  compressor: "Early in chain — tightens pick dynamics before drive stages so the amp responds consistently.",
  wah:        "Before drives — filtering before clipping adds expressiveness. After drives, sweeps distorted signal for a synth-like effect.",
  boost:      "Just before the amp — even +3dB pushes the amp from clean into natural breakup.",
  overdrive:  "Pre-amp — stacked into the amp's natural gain. The amp does heavy lifting; the drive shapes how hard you hit it.",
  distortion: "Pre-amp — self-contained distortion independent of amp input level, more compressed than overdrive.",
  fuzz:       "First in chain — fuzz is highly sensitive to input impedance. Wah after fuzz gives a more synth-like sweep.",
  amp:        "The core. Everything before shapes what it receives; everything after shapes its output.",
  cab:        "After the amp — colours the raw amplifier output with speaker resonance and mic placement.",
  eq:         "Post-amp or effects loop — shapes final frequency response without affecting amp behaviour.",
  modulation: "After drives and amp — modulates the full sound. Effects loop placement gives a cleaner sweep.",
  delay:      "After modulation, before reverb — delays the fully processed signal. Keeps each echo distinct.",
  reverb:     "Last in chain — places the entire signal in a space. After delay prevents the tail from smearing each echo.",
  utility:    "Position depends on specific function: buffering, routing, or level matching.",
};

const BLOCK_TYPICAL_APPROACH: Record<string, string> = {
  gate:       "Set threshold just above the noise floor — too high and it clamps natural decay. Release time should mirror how the note fades.",
  compressor: "Ratio 3:1–6:1. Slow attack lets the pick transient through. Even light compression adds sustain without sounding compressed.",
  wah:        "Sweep speed and Q (resonance) define character. Higher Q gives a more vocal, honking quality.",
  boost:      "A clean boost with flat EQ preserves your core sound while pushing the amp. Tone shaping boost changes character more drastically.",
  overdrive:  "Low-medium gain into the amp's breakup. Roll guitar volume back to 6–7 to clean up. Tone around noon keeps it neutral.",
  distortion: "Mid-scooped for heavy rhythm; mid-present for lead. High gain compresses heavily — sometimes less gain, more amp.",
  fuzz:       "Roll guitar volume to 6–7 for a chewy, responsive tone. Thick at full volume. Gate control defines how abruptly it stops.",
  amp:        "Set clean first, then add gain. Presence controls edge and cut. Bass/Mid/Treble interact — change one and re-check the others.",
  cab:        "4×12 adds weight and projection. 1×12 is more focused and recording-friendly. Mic placement (on-axis, edge vs. centre) shapes brightness.",
  eq:         "Cut before you boost. A narrow cut at a problem frequency is more transparent than a broad boost elsewhere.",
  modulation: "Chorus: rate and depth together. Flanger: depth is usually more effective than rate for guitar. Subtle goes a long way.",
  delay:      "Quarter note locked to tempo sits in the groove. Dotted eighth gives the U2/Edge rhythmic pattern. Mix 20–30% keeps it musical.",
  reverb:     "Pre-delay of 20–40ms separates dry from tail and preserves note clarity. Shorter decay for rhythmic, longer for ambient.",
  utility:    "Depends on specific function. Most common: impedance buffer at chain start, or stereo split for wet/dry rigs.",
};

/* ───────── Types ───────── */
interface SourceRow {
  id: string;
  source_type: string;
  title: string;
  url: string | null;
  author_name: string | null;
  snippet: string | null;
}

type CertaintyTier = "certain" | "partial" | "estimate";
type ViewMode = "MANUAL SET" | "PRESET FILE" | "ALT GEAR" | "PLATFORMS";

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

const AMPERO_DEVICE_ID = "9ee505b7-e138-4650-b342-6b85bc6015af";

interface AmperoMapping {
  canonical_model_id: string;
  mapping_type: "exactish" | "close" | "approximation" | "fallback";
  similarity_score: number;
  notes: string | null;
  model_name: string;
  based_on_text: string | null;
  binary_category: number | null;
  binary_subcategory: number | null;
  binary_model_id: number | null;
}

const MAPPING_TYPE_CONFIG = {
  exactish:      { label: "EXACT",    color: "#22875a", bg: "#22875a22" },
  close:         { label: "CLOSE",    color: "#c8a020", bg: "#c8a02022" },
  approximation: { label: "APPROX",   color: "#b84729", bg: "#b8472922" },
  fallback:      { label: "FALLBACK", color: "#968a7c", bg: "#968a7c22" },
} as const;

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
  const [relatedSongs, setRelatedSongs] = useState<{ id: string; title: string }[]>([]);
  // Ampero mappings: canonical_model_id → best mapping (first = highest similarity)
  const [amperoMappings, setAmperoMappings] = useState<Record<string, AmperoMapping[]>>({});
  const [copied, setCopied]           = useState(false);

  // Rig slot picker
  const [showSlotPicker, setShowSlotPicker] = useState(false);
  const [rigSlots, setRigSlots]       = useState<ReturnType<typeof getRigSlots>>(Array(8).fill(null));
  const [savedToSlot, setSavedToSlot] = useState<number | null>(null);

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
        // Sources are linked at artist level — query by artist_id, exclude internal seed entries
        const artistId = (profileRes.data as any).songs?.artists?.id;
        if (artistId) {
          supabase.from("sources")
            .select("id, source_type, title, url, author_name, snippet")
            .eq("artist_id", artistId)
            .in("source_type", ["equipboard", "rig_rundown", "forum", "manufacturer_doc", "interview", "article"])
            .not("url", "is", null)
            .order("base_reliability_score", { ascending: false })
            .then(({ data }) => { if (data) setSources(data as SourceRow[]); });
        }
      }
      if (blocksRes.data) {
        const loadedBlocks = blocksRes.data as unknown as ToneProfileBlock[];
        setBlocks(loadedBlocks);

        // Fetch Ampero mappings for all canonical models in this tone
        const canonicalIds = [...new Set(loadedBlocks.map(b => b.canonical_models.id))];
        if (canonicalIds.length > 0) {
          supabase
            .from("device_model_mappings")
            .select(`canonical_model_id, mapping_type, similarity_score, notes,
                     device_models!inner(model_name, based_on_text, binary_category, binary_subcategory, binary_model_id, device_id)`)
            .in("canonical_model_id", canonicalIds)
            .order("similarity_score", { ascending: false })
            .then(({ data }) => {
              if (!data) return;
              const map: Record<string, AmperoMapping[]> = {};
              for (const row of data as any[]) {
                // Filter to Ampero device only
                if (row.device_models?.device_id !== AMPERO_DEVICE_ID) continue;
                const cm = row.canonical_model_id;
                if (!map[cm]) map[cm] = [];
                map[cm].push({
                  canonical_model_id: cm,
                  mapping_type: row.mapping_type,
                  similarity_score: Number(row.similarity_score),
                  notes: row.notes,
                  model_name: row.device_models.model_name,
                  based_on_text: row.device_models.based_on_text,
                  binary_category: row.device_models.binary_category,
                  binary_subcategory: row.device_models.binary_subcategory,
                  binary_model_id: row.device_models.binary_model_id,
                });
              }
              setAmperoMappings(map);
            });
        }
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const selectedBlockRole = blocks[selectedIndex]?.block_role ?? null;

  useEffect(() => {
    if (!profile || !selectedBlockRole) return;
    const artistId = (profile as any).songs?.artists?.id;
    if (!artistId) return;

    // Find other tones by same artist that also use this block role
    supabase
      .from("tone_profile_blocks")
      .select("tone_profile_id, tone_profiles!inner(id, songs!inner(id, title, artist_id))")
      .eq("block_role", selectedBlockRole)
      .neq("tone_profile_id", profile.id)
      .limit(20)
      .then(({ data }) => {
        if (!data) return;
        const matched = (data as any[])
          .filter(r => r.tone_profiles?.songs?.artist_id === artistId)
          .slice(0, 4)
          .map(r => ({ id: r.tone_profile_id, title: r.tone_profiles?.songs?.title || "Unknown" }));
        setRelatedSongs(matched);
      });
  }, [selectedBlockRole, profile?.id]);

  const blockSvgs = useMemo(() => {
    return blocks.map(b =>
      resolveGearSvg(b.canonical_models.reference_real_gear_name || b.canonical_models.canonical_name, b.block_role)
      || resolveGearSvg(b.canonical_models.canonical_name, b.block_role)
    );
  }, [blocks]);

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
  const gearEntry     = selectedBlock
    ? lookupGearEntry(
        selectedBlock.canonical_models.reference_real_gear_name || "",
        selectedBlock.canonical_models.canonical_name
      )
    : null;
  const svgFile       = selectedBlock
    ? resolveGearSvg(selectedBlock.canonical_models.reference_real_gear_name || selectedBlock.canonical_models.canonical_name, selectedBlock.block_role)
      || resolveGearSvg(selectedBlock.canonical_models.canonical_name, selectedBlock.block_role)
    : null;

  const artistName = (profile as any).songs?.artists?.name || "";

  function handleOpenSlotPicker() {
    setRigSlots(getRigSlots());
    setShowSlotPicker(true);
    setSavedToSlot(null);
  }

  function handleSaveToSlot(slotIdx: number) {
    saveToSlot(slotIdx, profile!.id);
    setSavedToSlot(slotIdx);
    setRigSlots(getRigSlots());
    setTimeout(() => setShowSlotPicker(false), 900);
  }

  return (
    <HardwareChassis fullWidth title={profile.songs.artists.name} subtitle={profile.songs.title}>

      {/* Slot picker overlay */}
      {showSlotPicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.75)" }}
          onClick={() => setShowSlotPicker(false)}
        >
          <div
            className="flex flex-col gap-0 overflow-hidden"
            style={{
              background: "#14110f",
              border: "1px solid #e08b26",
              boxShadow: "0 0 40px rgba(224,139,38,0.3)",
              minWidth: 320,
              maxWidth: 480,
              width: "90vw",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex justify-between items-center px-4 py-3"
              style={{ background: "#1a1613", borderBottom: "1px solid #221d19" }}
            >
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider" style={{ color: "#e08b26" }}>
                  SAVE TO RIG SLOT
                </div>
                <div className="text-[9px] font-bold uppercase mt-0.5" style={{ color: "#968a7c" }}>
                  {profile.songs.artists.name} — {profile.songs.title}
                </div>
              </div>
              <button
                onClick={() => setShowSlotPicker(false)}
                className="text-[11px] font-black"
                style={{ color: "#968a7c" }}
              >
                ✕
              </button>
            </div>

            {/* Slot grid (2 cols) */}
            <div className="grid grid-cols-2 gap-px p-px" style={{ background: "#221d19" }}>
              {rigSlots.map((slot, i) => {
                const isSaved = savedToSlot === i;
                const isOccupied = slot !== null && slot.tone_profile_id !== profile!.id;
                const isSelf = slot?.tone_profile_id === profile!.id;
                return (
                  <button
                    key={i}
                    onClick={() => handleSaveToSlot(i)}
                    className="flex items-center gap-3 p-3 text-left transition-all"
                    style={{
                      background: isSaved
                        ? "#22875a"
                        : isSelf
                        ? "#2a2018"
                        : "#14110f",
                      borderBottom: "none",
                    }}
                  >
                    <div
                      className="text-[10px] font-black flex-shrink-0 w-8 text-center py-1"
                      style={{
                        background: isSaved ? "#27ae60" : "#1a1613",
                        color: isSaved ? "#fff" : "#e08b26",
                        border: "1px solid #221d19",
                      }}
                    >
                      {isSaved ? "✓" : String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="min-w-0">
                      {isSaved ? (
                        <div className="text-[10px] font-black uppercase" style={{ color: "#fff" }}>
                          SAVED!
                        </div>
                      ) : isSelf ? (
                        <div className="text-[10px] font-bold uppercase" style={{ color: "#e08b26" }}>
                          ALREADY HERE
                        </div>
                      ) : slot ? (
                        <>
                          <div className="text-[9px] font-black uppercase truncate" style={{ color: "#968a7c" }}>
                            {(slot as any).songs?.artists?.name ?? "OCCUPIED"}
                          </div>
                          <div className="text-[10px] font-bold truncate" style={{ color: "#c4b5ac" }}>
                            OVERWRITE
                          </div>
                        </>
                      ) : (
                        <div className="text-[10px] font-bold uppercase" style={{ color: "#4a4038" }}>
                          EMPTY — SAVE HERE
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb + Save button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "#968a7c" }}>
          <Link href="/" className="hover:opacity-70" style={{ color: "#968a7c" }}>CATALOG</Link>
          <span>//</span>
          <span style={{ color: "#e08b26" }}>{profile.songs.artists.name} — {profile.songs.title}</span>
        </div>
        <button
          onClick={handleOpenSlotPicker}
          className="text-[10px] font-extrabold uppercase px-3 py-1.5 flex-shrink-0 transition-colors"
          style={{ background: "#1a1613", color: "#e08b26", border: "1px solid #e08b2666" }}
        >
          SAVE TO RIG →
        </button>
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
            const blockSvg = blockSvgs[i];

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
                  {blockSvg ? (
                    <Image
                      src={"/gear-svgs/" + blockSvg}
                      width={20}
                      height={20}
                      alt=""
                      unoptimized
                      className="object-contain opacity-90"
                    />
                  ) : null}
                  <span
                    className="text-[11px] font-black tracking-[0.04em] leading-none"
                    style={{ color: isSelected ? "#1a0e02" : blockColor }}
                  >
                    {ROLE_SHORT[b.block_role] || b.block_role.slice(0, 4).toUpperCase()}
                  </span>
                  {!blockSvg && (
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
                  )}
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
             viewMode === "PRESET FILE" ? "GENERATE PRESET" :
             viewMode === "PLATFORMS" ? "PLATFORM EQUIVALENTS" :
             "ALT GEAR MATRIX"}
          </div>

          <div className="hw-screen flex-1 flex flex-col" style={{ minHeight: 280, padding: 0 }}>

            {/* ── MANUAL SET view ── */}
            {viewMode === "MANUAL SET" && selectedBlock && (
              <div className="flex flex-col h-full overflow-hidden">
                {/* Block header bar */}
                <div className="flex items-start justify-between gap-3 p-4 pb-3 flex-shrink-0"
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

                {/* Two-column: gear icon + role/tags */}
                <div className="flex items-start gap-4 px-4 py-3 flex-shrink-0"
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.15)" }}>
                  {/* Left: gear icon */}
                  {svgFile && (
                    <div className="flex-shrink-0 flex items-center justify-center"
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
                  )}
                  {/* Right: role + gain/ambience tags */}
                  <div className="flex flex-col gap-2 justify-center" style={{ minHeight: svgFile ? 96 : "auto" }}>
                    <div className="text-[13px] font-black uppercase tracking-[0.08em]"
                      style={{ color: BLOCK_COLORS[selectedBlock.block_role] || "#e08b26" }}>
                      {ROLE_SHORT[selectedBlock.block_role]}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.gain_level && (
                        <span className="text-[9px] font-black tracking-[0.08em] px-2 py-0.5"
                          style={{ background: "rgba(0,0,0,0.12)", border: "1px solid rgba(0,0,0,0.2)", color: "#333" }}>
                          {GAIN_LABELS[String(profile.gain_level)] || "MID"}
                        </span>
                      )}
                      {profile.ambience_level && (
                        <span className="text-[9px] font-black tracking-[0.08em] px-2 py-0.5"
                          style={{ background: "rgba(0,0,0,0.12)", border: "1px solid rgba(0,0,0,0.2)", color: "#333" }}>
                          {AMBIENCE_LABELS[String(profile.ambience_level)] || "MED-WET"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Scrollable content below header */}
                <div className="flex flex-col flex-1 overflow-y-auto">

                  {/* Overview — encyclopedia or fallback */}
                  <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
                    {gearEntry?.yearIntroduced || gearEntry?.manufacturer ? (
                      <div className="text-[9px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: "#555" }}>
                        {[gearEntry.manufacturer, gearEntry.yearIntroduced].filter(Boolean).join(" · ")}
                      </div>
                    ) : null}
                    <p className="text-[13px] font-semibold leading-relaxed" style={{ color: "#1a1a1a" }}>
                      {gearEntry?.overview || BLOCK_ROLE_DESCRIPTIONS[selectedBlock.block_role] || "Effect block in the signal chain."}
                    </p>
                  </div>

                  {/* Key Controls — from encyclopedia */}
                  {gearEntry?.controls && gearEntry.controls.length > 0 && (
                    <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
                      <div className="text-[9px] font-black uppercase tracking-[0.12em] mb-2" style={{ color: "#555" }}>
                        KEY CONTROLS
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {gearEntry.controls.map((ctrl, ci) => (
                          <div key={ci} className="flex gap-2">
                            <span className="text-[11px] font-black flex-shrink-0" style={{ color: "#1a1a1a", minWidth: 64 }}>
                              {ctrl.name}
                            </span>
                            <span className="text-[11px] font-medium leading-snug" style={{ color: "#333" }}>
                              {ctrl.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notable Users — from encyclopedia */}
                  {gearEntry?.notableUsers && gearEntry.notableUsers.length > 0 && (
                    <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
                      <div className="text-[9px] font-black uppercase tracking-[0.12em] mb-2" style={{ color: "#555" }}>
                        NOTABLE USERS
                      </div>
                      <div className="flex flex-col gap-0">
                        {/* Table header */}
                        <div className="grid text-[8px] font-black uppercase tracking-wider pb-1 mb-1"
                          style={{ gridTemplateColumns: "110px 1fr 1fr", borderBottom: "1px solid rgba(0,0,0,0.15)", color: "#555" }}>
                          <div>ARTIST</div>
                          <div>USAGE</div>
                          <div>SOUND CHARACTER</div>
                        </div>
                        {gearEntry.notableUsers.map((u, ui) => (
                          <div key={ui} className="grid py-1.5"
                            style={{ gridTemplateColumns: "110px 1fr 1fr", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                            <div className="text-[10px] font-black pr-2" style={{ color: "#1a1a1a" }}>{u.artist}</div>
                            <div className="text-[10px] font-medium pr-2 leading-snug" style={{ color: "#333" }}>{u.usage}</div>
                            <div className="text-[10px] font-medium leading-snug italic" style={{ color: "#444" }}>{u.sound}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Position in chain */}
                  {BLOCK_POSITION_CONTEXT[selectedBlock.block_role] && (
                    <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
                      <div className="text-[9px] font-black uppercase tracking-[0.12em] mb-1.5" style={{ color: "#555" }}>
                        POSITION IN CHAIN
                      </div>
                      <p className="text-[12px] font-semibold leading-relaxed" style={{ color: "#1a1a1a" }}>
                        {BLOCK_POSITION_CONTEXT[selectedBlock.block_role]}
                      </p>
                    </div>
                  )}

                  {/* Typical approach */}
                  {BLOCK_TYPICAL_APPROACH[selectedBlock.block_role] && (
                    <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
                      <div className="text-[9px] font-black uppercase tracking-[0.12em] mb-1.5" style={{ color: "#555" }}>
                        TYPICAL APPROACH
                      </div>
                      <p className="text-[12px] font-semibold leading-relaxed" style={{ color: "#1a1a1a" }}>
                        {BLOCK_TYPICAL_APPROACH[selectedBlock.block_role]}
                      </p>
                    </div>
                  )}

                  {/* Related songs — same artist, same block role (only shown when results exist) */}
                  {relatedSongs.length > 0 && (
                  <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
                    <div className="text-[9px] font-black uppercase tracking-[0.12em] mb-1.5" style={{ color: "#555" }}>
                      ALSO USED IN — {artistName.toUpperCase()}
                    </div>
                    <div className="flex flex-col gap-1">
                      {relatedSongs.map(song => (
                        <Link
                          key={song.id}
                          href={`/tone/${song.id}`}
                          className="text-[12px] font-bold hover:underline"
                          style={{ color: "#e08b26" }}
                        >
                          {song.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                  )}

                  {/* Sources */}
                  {sources.length > 0 && (
                    <div className="flex flex-col gap-0">
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
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* ── PRESET FILE view ── */}
            {viewMode === "PRESET FILE" && (() => {
              const presetLines = [
                `TONE RECIPE — ${profile.songs.artists.name.toUpperCase()} / ${profile.songs.title.toUpperCase()}`,
                `Confidence: ${Math.round(profile.confidence_score * 100)}%  |  ${profile.research_status?.toUpperCase() ?? ""}`,
                `Generated: ${new Date().toLocaleDateString()}`,
                ``,
                `SIGNAL CHAIN (Hotone Ampero II Stomp)`,
                `${"─".repeat(52)}`,
                ...blocks.map((b, i) => {
                  const mapping = amperoMappings[b.canonical_models.id]?.[0];
                  const realName = b.canonical_models.reference_real_gear_name || b.canonical_models.canonical_name;
                  const amperoName = mapping ? mapping.model_name : "— (no mapping)";
                  const quality = mapping ? MAPPING_TYPE_CONFIG[mapping.mapping_type].label : "";
                  return `${String(i + 1).padStart(2, "0")}  [${ROLE_SHORT[b.block_role]?.padEnd(4)}]  ${realName.padEnd(28)}→  ${amperoName}  ${quality}`;
                }),
                ``,
                `NAVIGATION (Ampero UI)`,
                `${"─".repeat(52)}`,
                ...blocks.map((b, i) => {
                  const mapping = amperoMappings[b.canonical_models.id]?.[0];
                  if (!mapping?.binary_category) return `${String(i + 1).padStart(2, "0")}  [${ROLE_SHORT[b.block_role]}]  — navigate manually`;
                  return `${String(i + 1).padStart(2, "0")}  [${ROLE_SHORT[b.block_role]?.padEnd(4)}]  Cat:${mapping.binary_category}  Sub:${mapping.binary_subcategory}  Model:${mapping.binary_model_id}  →  ${mapping.based_on_text ?? mapping.model_name}`;
                }),
              ].join("\n");

              return (
                <div className="flex flex-col h-full overflow-hidden">
                  {/* Header bar */}
                  <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
                    style={{ borderBottom: "2px solid rgba(0,0,0,0.2)" }}>
                    <div>
                      <div className="text-[11px] font-black uppercase" style={{ color: "#111" }}>
                        SETUP SHEET — HOTONE AMPERO II STOMP
                      </div>
                      <div className="text-[9px] font-bold uppercase mt-0.5" style={{ color: "#444" }}>
                        {profile.songs.artists.name} — {profile.songs.title}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          const helixBlocks: HelixBlock[] = blocks.map((b) => ({
                            block_role: b.block_role,
                            canonical_name: b.canonical_models.canonical_name,
                            ref_name: b.canonical_models.reference_real_gear_name || b.canonical_models.canonical_name,
                            gain_level: profile.gain_level ?? undefined,
                          }));
                          downloadHelixPatch(
                            (profile as any).songs?.artists?.name ?? "",
                            (profile as any).songs?.title ?? "",
                            helixBlocks
                          );
                        }}
                        className="text-[9px] font-black uppercase px-3 py-1.5 transition-colors"
                        style={{ background: "#1a6fbf", color: "#fff", border: "none" }}
                        title="Download as Line 6 Helix patch (.hlx)"
                      >
                        ↓ HELIX .HLX
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(presetLines);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="text-[9px] font-black uppercase px-3 py-1.5 transition-colors"
                        style={{
                          background: copied ? "#22875a" : "#111",
                          color: copied ? "#fff" : "#e08b26",
                          border: "none",
                        }}
                      >
                        {copied ? "COPIED ✓" : "COPY TEXT"}
                      </button>
                    </div>
                  </div>

                  {/* Block list */}
                  <div className="overflow-y-auto flex-1">
                    {blocks.map((b, i) => {
                      const blockColor = BLOCK_COLORS[b.block_role] || "#7a6e62";
                      const cmId = b.canonical_models.id;
                      const mappings = amperoMappings[cmId] ?? [];
                      const best = mappings[0];
                      const mtc = best ? MAPPING_TYPE_CONFIG[best.mapping_type] : null;
                      const realName = b.canonical_models.reference_real_gear_name || b.canonical_models.canonical_name;

                      return (
                        <div key={b.id}
                          className="px-4 py-3 cursor-pointer transition-colors"
                          style={{
                            borderBottom: "1px solid rgba(0,0,0,0.1)",
                            background: i === selectedIndex ? "rgba(224,139,38,0.08)" : "transparent",
                          }}
                          onClick={() => setSelectedIndex(i)}
                        >
                          {/* Row header */}
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[9px] font-black w-5 flex-shrink-0 text-center"
                              style={{ color: "#888" }}>
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="text-[9px] font-black px-1.5 py-0.5 flex-shrink-0"
                              style={{ background: blockColor + "33", border: `1px solid ${blockColor}66`, color: blockColor }}>
                              {ROLE_SHORT[b.block_role]}
                            </span>
                            <span className="text-[11px] font-bold truncate" style={{ color: "#1a1a1a" }}>
                              {realName}
                            </span>
                          </div>

                          {/* Ampero model */}
                          {best ? (
                            <div className="flex items-start gap-2 pl-7">
                              <span className="text-[9px] font-black px-1.5 py-0.5 flex-shrink-0 mt-px"
                                style={{ background: mtc!.bg, border: `1px solid ${mtc!.color}66`, color: mtc!.color }}>
                                {mtc!.label}
                              </span>
                              <div className="min-w-0">
                                <div className="text-[12px] font-black" style={{ color: "#111", fontFamily: "'Courier New', monospace" }}>
                                  {best.model_name}
                                </div>
                                {best.based_on_text && (
                                  <div className="text-[9px] mt-0.5" style={{ color: "#555" }}>
                                    {best.based_on_text}
                                  </div>
                                )}
                                {best.binary_category != null && (
                                  <div className="flex gap-2 mt-1">
                                    {[
                                      { l: "CAT", v: best.binary_category },
                                      { l: "SUB", v: best.binary_subcategory },
                                      { l: "MDL", v: best.binary_model_id },
                                    ].map(({ l, v }) => (
                                      <span key={l} className="text-[8px] font-black px-1 py-0.5"
                                        style={{ background: "rgba(0,0,0,0.08)", color: "#555", fontFamily: "monospace" }}>
                                        {l}:{v}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {/* Alt mappings */}
                                {mappings.length > 1 && (
                                  <div className="mt-1.5 flex flex-wrap gap-1">
                                    {mappings.slice(1, 3).map((alt, ai) => {
                                      const ac = MAPPING_TYPE_CONFIG[alt.mapping_type];
                                      return (
                                        <span key={ai} className="text-[8px] font-bold px-1.5 py-0.5"
                                          style={{ background: ac.bg, border: `1px solid ${ac.color}44`, color: ac.color }}>
                                          ALT: {alt.model_name}
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="pl-7 text-[10px] font-bold" style={{ color: "#888" }}>
                              No Ampero mapping — navigate manually
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* ── ALT GEAR view — Ampero mapping matrix ── */}
            {viewMode === "ALT GEAR" && (
              <div className="flex flex-col overflow-hidden">
                {/* Column headers */}
                <div className="grid py-2.5 px-4 text-[9px] font-black uppercase flex-shrink-0"
                  style={{ gridTemplateColumns: "60px 1fr 140px 64px", borderBottom: "2px solid rgba(0,0,0,0.2)", color: "#555" }}>
                  <div>ROLE</div>
                  <div>REAL GEAR</div>
                  <div>AMPERO MODEL</div>
                  <div>MATCH</div>
                </div>
                <div className="overflow-y-auto flex-1">
                  {blocks.map((b, i) => {
                    const blockColor = BLOCK_COLORS[b.block_role] || "#7a6e62";
                    const cmId = b.canonical_models.id;
                    const best = amperoMappings[cmId]?.[0];
                    const mtc = best ? MAPPING_TYPE_CONFIG[best.mapping_type] : null;
                    const realName = b.canonical_models.reference_real_gear_name || b.canonical_models.canonical_name;

                    return (
                      <div key={b.id}
                        className="grid items-center py-2.5 px-4 cursor-pointer transition-colors"
                        style={{
                          gridTemplateColumns: "60px 1fr 140px 64px",
                          borderBottom: "1px solid rgba(0,0,0,0.08)",
                          background: i === selectedIndex ? "rgba(224,139,38,0.08)" : "transparent",
                        }}
                        onClick={() => setSelectedIndex(i)}
                      >
                        {/* Role */}
                        <div className="text-[10px] font-black uppercase" style={{ color: blockColor }}>
                          {ROLE_SHORT[b.block_role]}
                        </div>

                        {/* Real gear name */}
                        <div className="text-[10px] font-bold pr-2 truncate" style={{ color: "#1a1a1a" }}>
                          {realName}
                        </div>

                        {/* Ampero model name */}
                        <div className="pr-2">
                          {best ? (
                            <div>
                              <div className="text-[11px] font-black truncate"
                                style={{ color: "#111", fontFamily: "'Courier New', monospace" }}>
                                {best.model_name}
                              </div>
                              {best.based_on_text && (
                                <div className="text-[8px] truncate mt-0.5" style={{ color: "#666" }}>
                                  {best.based_on_text}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-[9px]" style={{ color: "#888" }}>—</span>
                          )}
                        </div>

                        {/* Match quality badge */}
                        <div>
                          {mtc ? (
                            <span className="text-[8px] font-black px-1.5 py-0.5"
                              style={{ background: mtc.bg, border: `1px solid ${mtc.color}66`, color: mtc.color }}>
                              {mtc.label}
                            </span>
                          ) : (
                            <span className="text-[8px]" style={{ color: "#888" }}>N/A</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer note */}
                <div className="px-4 py-2 flex-shrink-0 flex items-center gap-3"
                  style={{ borderTop: "1px solid rgba(0,0,0,0.1)", background: "rgba(0,0,0,0.04)" }}>
                  {(["exactish","close","approximation","fallback"] as const).map(t => {
                    const c = MAPPING_TYPE_CONFIG[t];
                    return (
                      <div key={t} className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ background: c.color }} />
                        <span className="text-[8px] font-bold" style={{ color: "#666" }}>{c.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── PLATFORMS view ── */}
            {viewMode === "PLATFORMS" && selectedBlock && (() => {
              const gear = selectedBlock.canonical_models;
              const entry = lookupPlatformEntry(
                gear.reference_real_gear_name || "",
                gear.canonical_name
              );
              const gearDisplayName = gear.reference_real_gear_name || gear.canonical_name;

              const platformKeys = ["fractal", "helix", "boss", "neural", "kemper"] as const;
              const platformLongLabels: Record<string, string> = {
                fractal: "Fractal Audio  Axe-FX III / FM9",
                helix:   "Line 6 Helix / HX Stomp",
                boss:    "Boss GT-1000 / GT-1000CORE",
                neural:  "Neural DSP Quad Cortex",
                kemper:  "Kemper Profiler",
              };

              return (
                <div className="flex flex-col h-full overflow-hidden">
                  {/* Header */}
                  <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: "2px solid rgba(0,0,0,0.2)" }}>
                    <div className="text-[11px] font-black uppercase" style={{ color: "#111" }}>
                      {gearDisplayName}
                    </div>
                    <div className="text-[9px] font-bold uppercase mt-0.5" style={{ color: "#444" }}>
                      {ROLE_SHORT[selectedBlock.block_role]} · MULTI-EFFECTS EQUIVALENTS
                    </div>
                  </div>

                  {/* Platform rows */}
                  <div className="overflow-y-auto flex-1">
                    {entry ? (
                      <>
                        {platformKeys.map((key) => {
                          const value = entry[key];
                          const color = PLATFORM_COLORS[key] ?? "#555";
                          return (
                            <div
                              key={key}
                              className="flex flex-col gap-1 px-4 py-3"
                              style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className="text-[8px] font-black uppercase px-2 py-0.5 flex-shrink-0"
                                  style={{
                                    background: color,
                                    color: "#fff",
                                    minWidth: 72,
                                    textAlign: "center",
                                  }}
                                >
                                  {PLATFORM_LABELS[key]}
                                </span>
                                <span
                                  className="text-[10px] font-bold"
                                  style={{ fontFamily: "'Courier New', monospace", color: value === "—" ? "#888" : "#111" }}
                                >
                                  {value ?? "—"}
                                </span>
                              </div>
                              <div className="text-[9px] pl-[80px]" style={{ color: "#777" }}>
                                {platformLongLabels[key]}
                              </div>
                            </div>
                          );
                        })}

                        {/* Notes */}
                        {entry.notes && (
                          <div className="px-4 py-3" style={{ background: "rgba(0,0,0,0.05)", borderTop: "1px solid rgba(0,0,0,0.1)" }}>
                            <div className="text-[9px] font-black uppercase mb-1" style={{ color: "#555" }}>
                              NOTES
                            </div>
                            <div className="text-[11px]" style={{ color: "#333", lineHeight: 1.5 }}>
                              {entry.notes}
                            </div>
                          </div>
                        )}

                        {/* Ampero mapping reminder */}
                        <div className="px-4 py-3" style={{ background: "rgba(224,139,38,0.06)", borderTop: "1px solid rgba(224,139,38,0.15)" }}>
                          <div className="text-[9px] font-black uppercase mb-1" style={{ color: "#e08b26" }}>
                            HOTONE AMPERO II STOMP
                          </div>
                          <div className="text-[10px] font-bold" style={{ color: "#555" }}>
                            See ALT GEAR tab for Ampero-specific model name and mapping quality.
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-3 p-8">
                        <div className="text-[11px] font-black uppercase" style={{ color: "#555" }}>
                          NO MAPPING DATA
                        </div>
                        <div className="text-[10px] text-center" style={{ color: "#777", lineHeight: 1.6, maxWidth: 240 }}>
                          Platform equivalents for "{gearDisplayName}" are not yet in the database.
                          This gear may be too rare or too recent to be modeled on major platforms.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* PLATFORMS view when no block selected */}
            {viewMode === "PLATFORMS" && !selectedBlock && (
              <div className="flex items-center justify-center p-8">
                <div className="text-[11px] font-bold uppercase" style={{ color: "#555" }}>
                  SELECT A BLOCK IN THE SIGNAL CHAIN
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
              {(["PRESET FILE", "MANUAL SET", "ALT GEAR", "PLATFORMS"] as ViewMode[]).map((mode) => (
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
