/**
 * helixExport.ts
 *
 * Generates a Line 6 Helix .hlx patch file (JSON schema 2.2) from a tone recipe.
 *
 * Model IDs are verified against official Helix documentation and dshowmusic.com.
 * Obfuscated naming guide: Brit = Marshall, Cali = Mesa, US = Fender, Essex = Vox,
 * German = Bogner, PV/EV = Peavey/EVH, Solo = Soldano, Mandarin = Orange.
 */

// ─── Model ID lookup tables ───────────────────────────────────────────────────

/** Maps lowercase canonical/ref names → Helix model ID strings */
const AMP_MODEL_IDS: Record<string, string> = {
  // Marshall
  "marshall super lead plexi jumped":  "HD2_AmpBritPlexiJump",
  "marshall super lead plexi normal":  "HD2_AmpBritPlexiNorm",
  "marshall super lead plexi bright":  "HD2_AmpBritPlexiBrt",
  "marshall super lead plexi":         "HD2_AmpBritPlexiJump",
  "marshall plexi":                    "HD2_AmpBritPlexiJump",
  "marshall jcm800":                   "HD2_AmpBrit2203",
  "marshall jcm800 2203":              "HD2_AmpBrit2203",
  "marshall jtm45 normal":             "HD2_AmpBritJ45Nrm",
  "marshall jtm45 bright":             "HD2_AmpBritJ45Brt",
  "marshall jtm45":                    "HD2_AmpBritJ45Nrm",
  "marshall silver jubilee":           "HD2_AmpBrit2203", // closest available
  // Fender
  "fender twin reverb normal":         "HD2_AmpUSDouble_Nrm",
  "fender twin reverb vibrato":        "HD2_AmpUSDouble_Vib",
  "fender twin reverb":                "HD2_AmpUSDouble_Nrm",
  "fender deluxe reverb normal":       "HD2_AmpUSDeluxe_Nrm",
  "fender deluxe reverb vibrato":      "HD2_AmpUSDeluxe_Vib",
  "fender deluxe reverb":              "HD2_AmpUSDeluxe_Nrm",
  "fender bassman normal":             "HD2_AmpTweedBlues_Nrm",
  "fender bassman bright":             "HD2_AmpTweedBlues_Brt",
  "fender bassman":                    "HD2_AmpTweedBlues_Nrm",
  // Vox
  "vox ac30":                          "HD2_AmpEssex_A30",
  "vox ac15":                          "HD2_AmpEssex_A30", // closest
  // Mesa
  "mesa/boogie dual rectifier":        "HD2_AmpCaliRectifire",
  "mesa dual rectifier":               "HD2_AmpCaliRectifire",
  "mesa/boogie mark iv lead":          "HD2_AmpCaliIV_Lead",
  "mesa/boogie mark iv rhythm":        "HD2_AmpCaliIV_Rhy1",
  "mesa/boogie mark iv":               "HD2_AmpCaliIV_Lead",
  "mesa mark iv":                      "HD2_AmpCaliIV_Lead",
  // Soldano
  "soldano slo-100 od":                "HD2_AmpSoloLead_OD",
  "soldano slo-100 crunch":            "HD2_AmpSoloLead_Crunch",
  "soldano slo-100 clean":             "HD2_AmpSoloLead_Clean",
  "soldano slo-100":                   "HD2_AmpSoloLead_OD",
  // Peavey / EVH
  "peavey 5150":                       "HD2_AmpPVPanama",
  "evh 5150 iii blue":                 "HD2_AmpEVPanama_Blu",
  "evh 5150 iii red":                  "HD2_AmpEVPanama_Red",
  "evh 5150 iii":                      "HD2_AmpEVPanama_Red",
  // Hiwatt
  "hiwatt dr103":                      "HD2_AmpWhoWatt100",
  "hiwatt":                            "HD2_AmpWhoWatt100",
  // Orange
  "orange rockerverb 100":             "HD2_AmpMandarinRocker",
  "orange rockerverb":                 "HD2_AmpMandarinRocker",
  "orange th30":                       "HD2_AmpMandarinRocker", // closest
  // Bogner
  "bogner ecstasy blue":               "HD2_AmpGermanXtra_Blu",
  "bogner ecstasy red":                "HD2_AmpGermanXtra_Red",
  "bogner ecstasy":                    "HD2_AmpGermanXtra_Red",
};

/** Maps lowercase canonical/ref names → Helix model ID strings for drives */
const DRIVE_MODEL_IDS: Record<string, string> = {
  "tube screamer 808":                 "HD2_DistTeemah",
  "tube screamer":                     "HD2_DistTeemah",
  "ibanez tube screamer":              "HD2_DistTeemah",
  "ts9":                               "HD2_DistHedgehogD9",
  "klon centaur":                      "HD2_DistMinotaur",
  "klon":                              "HD2_DistMinotaur",
  "proco rat":                         "HD2_DistVermin",
  "rat distortion":                    "HD2_DistVermin",
  "boss sd-1":                         "HD2_DistDerangedMaster",
  "boss ds-1":                         "HD2_DistStupor_OD",
  "electro-harmonix big muff pi":      "HD2_DistTriangleFuzz",
  "big muff":                          "HD2_DistTriangleFuzz",
  "fuzz face":                         "HD2_DistArbitratorFuzz",
  "fuzz face germanium":               "HD2_DistArbitratorFuzz",
  "mxr distortion+":                   "HD2_DistCompulsive",
  "fulltone ocd":                      "HD2_DistCompulsive",
  "boss blues driver bd-2":            "HD2_DistDerangedMaster", // closest
  "boss blues driver":                 "HD2_DistDerangedMaster",
  "electro-harmonix soul food":        "HD2_DistMinotaur", // same circuit family
  "maxon od808":                       "HD2_DistTeemah",   // identical circuit
};

/** Maps lowercase canonical/ref names → Helix model ID strings for mod/delay/reverb/dynamics */
const FX_MODEL_IDS: Record<string, string> = {
  // Modulation
  "univibe":                           "HD2_ModUbiquitousVibe",
  "uni-vibe":                          "HD2_ModUbiquitousVibe",
  "mxr phase 90":                      "HD2_ModGrayFlanger",  // closest
  "boss ce-1 chorus":                  "HD2_ModCE1_Chorus",
  "ce-1 chorus":                       "HD2_ModCE1_Chorus",
  // Delays
  "maestro echoplex ep-3":             "HD2_DlyTransistorTape",
  "echoplex":                          "HD2_DlyTransistorTape",
  "boss dd-3":                         "HD2_DlySimple",
  "tc electronic 2290":                "HD2_DlySimple",
  "digital delay":                     "HD2_DlySimple",
  "tape delay":                        "HD2_DlyTransistorTape",
  // Reverbs
  "spring reverb":                     "HD2_RevGlitz",
  "fender spring reverb":              "HD2_RevGlitz",
  "fender 6g15 spring reverb":         "HD2_RevGlitz",
  // Gates / Dynamics
  "boss ns-2 noise suppressor":        "HD2_DynHardGate",
  "ns-2":                              "HD2_DynHardGate",
  "gate":                              "HD2_DynHardGate",
  "noise gate":                        "HD2_DynHardGate",
  "mxr dynacomp":                      "HD2_DynRedSqueezeComp",
  "dynacomp":                          "HD2_DynRedSqueezeComp",
  "ross compressor":                   "HD2_DynRedSqueezeComp",
};

/** Maps amp model IDs → matching cab model IDs */
const AMP_TO_CAB: Record<string, string> = {
  // Marshall → 4x12 Basketweave
  "HD2_AmpBritPlexiJump":  "HD2_Cab4x12_BV",
  "HD2_AmpBritPlexiNorm":  "HD2_Cab4x12_BV",
  "HD2_AmpBritPlexiBrt":   "HD2_Cab4x12_BV",
  "HD2_AmpBrit2203":       "HD2_Cab4x12_BV",
  "HD2_AmpBritJ45Nrm":     "HD2_Cab4x12_BV",
  "HD2_AmpBritJ45Brt":     "HD2_Cab4x12_BV",
  // Fender → 1x12 Blackface
  "HD2_AmpUSDouble_Nrm":   "HD2_Cab1x12_BXCL",
  "HD2_AmpUSDouble_Vib":   "HD2_Cab1x12_BXCL",
  "HD2_AmpUSDeluxe_Nrm":   "HD2_Cab1x12_BXCL",
  "HD2_AmpUSDeluxe_Vib":   "HD2_Cab1x12_BXCL",
  "HD2_AmpTweedBlues_Nrm": "HD2_Cab1x12_BXCL",
  "HD2_AmpTweedBlues_Brt": "HD2_Cab1x12_BXCL",
  // Vox → 2x12 Blue
  "HD2_AmpEssex_A30":      "HD2_Cab2x12_Blue",
  // Mesa → 4x12 V30
  "HD2_AmpCaliRectifire":  "HD2_Cab4x12_XXL_V30",
  "HD2_AmpCaliIV_Lead":    "HD2_Cab4x12_XXL_V30",
  "HD2_AmpCaliIV_Rhy1":    "HD2_Cab4x12_XXL_V30",
  // Soldano → 4x12 Generic
  "HD2_AmpSoloLead_OD":    "HD2_Cab4x12_Green",
  "HD2_AmpSoloLead_Crunch":"HD2_Cab4x12_Green",
  "HD2_AmpSoloLead_Clean": "HD2_Cab4x12_Green",
  // Peavey / EVH → 4x12 Generic
  "HD2_AmpPVPanama":        "HD2_Cab4x12_Green",
  "HD2_AmpEVPanama_Blu":    "HD2_Cab4x12_Green",
  "HD2_AmpEVPanama_Red":    "HD2_Cab4x12_Green",
  // Hiwatt → 4x12 Generic
  "HD2_AmpWhoWatt100":      "HD2_Cab4x12_Green",
  // Orange → 4x12 Generic (Orange cabs not in Helix by exact name)
  "HD2_AmpMandarinRocker":  "HD2_Cab4x12_Green",
  // Bogner → 4x12 V30
  "HD2_AmpGermanXtra_Blu":  "HD2_Cab4x12_XXL_V30",
  "HD2_AmpGermanXtra_Red":  "HD2_Cab4x12_XXL_V30",
};

// ─── Default params per category ─────────────────────────────────────────────

type ParamMap = Record<string, number>;

const DEFAULT_PARAMS: Record<string, ParamMap> = {
  amp:        { Drive: 0.5, Bass: 0.5, Mid: 0.5, Treble: 0.5, Presence: 0.5, Master: 0.65, type: 0 },
  drive:      { Drive: 0.5, Tone: 0.5, Level: 0.6, type: 0 },
  overdrive:  { Drive: 0.5, Tone: 0.5, Level: 0.6, type: 0 },
  distortion: { Drive: 0.5, Tone: 0.5, Level: 0.6, type: 0 },
  fuzz:       { Drive: 0.5, Tone: 0.5, Level: 0.6, type: 0 },
  boost:      { Drive: 0.5, Tone: 0.5, Level: 0.6, type: 0 },
  gate:       { Threshold: 0.35, Open: 0.3, Release: 0.4, type: 0 },
  compressor: { Threshold: 0.5, Ratio: 0.4, Attack: 0.3, Gain: 0.5, type: 0 },
  delay:      { Time: 0.5, Feedback: 0.35, Mix: 0.25, type: 0 },
  reverb:     { Decay: 0.4, PreDelay: 0.2, Mix: 0.25, type: 0 },
  modulation: { Speed: 0.4, Depth: 0.5, Mix: 0.5, type: 0 },
  cab:        { LowCut: 0.0, HighCut: 1.0, Level: 0.5, type: 0 },
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HelixBlock {
  block_role: string;        // e.g. "amp", "drive", "delay", "reverb", "gate"
  canonical_name: string;    // e.g. "Marshall JCM800"
  ref_name: string;          // e.g. "Marshall JCM800 2203"
  gain_level?: number;       // 0–1, used to scale amp Drive
}

// ─── Lookup helpers ───────────────────────────────────────────────────────────

function normalise(s: string): string {
  return s.toLowerCase().trim();
}

function lookupAmpModel(block: HelixBlock): string | null {
  const candidates = [
    normalise(block.ref_name),
    normalise(block.canonical_name),
    normalise(block.ref_name).replace(/ style$/i, "").trim(),
    normalise(block.canonical_name).replace(/ style$/i, "").trim(),
  ];
  for (const c of candidates) {
    if (AMP_MODEL_IDS[c]) return AMP_MODEL_IDS[c];
  }
  return null;
}

function lookupDriveModel(block: HelixBlock): string | null {
  const candidates = [
    normalise(block.ref_name),
    normalise(block.canonical_name),
    normalise(block.ref_name).replace(/ style$/i, "").trim(),
    normalise(block.canonical_name).replace(/ style$/i, "").trim(),
  ];
  for (const c of candidates) {
    if (DRIVE_MODEL_IDS[c]) return DRIVE_MODEL_IDS[c];
  }
  return null;
}

function lookupFxModel(block: HelixBlock): string | null {
  const candidates = [
    normalise(block.ref_name),
    normalise(block.canonical_name),
    normalise(block.ref_name).replace(/ style$/i, "").trim(),
    normalise(block.canonical_name).replace(/ style$/i, "").trim(),
  ];
  for (const c of candidates) {
    if (FX_MODEL_IDS[c]) return FX_MODEL_IDS[c];
  }
  return null;
}

/** Returns the Helix model ID for a given block, or null if unknown */
function resolveModelId(block: HelixBlock): string | null {
  const role = normalise(block.block_role);

  if (role === "amp") return lookupAmpModel(block);

  if (["drive", "overdrive", "distortion", "fuzz", "boost"].includes(role)) {
    return lookupDriveModel(block) ?? lookupFxModel(block);
  }

  // gate, compressor, delay, reverb, modulation, wah, etc.
  return lookupFxModel(block);
}

/** Resolves amp params, scaling Drive from gain_level if provided */
function buildAmpParams(block: HelixBlock): ParamMap {
  const params = { ...DEFAULT_PARAMS.amp };
  if (typeof block.gain_level === "number") {
    // Drive = 0.2 + gain_level * 0.7  (maps 0→0.2, 1→0.9)
    params.Drive = 0.2 + Math.min(1, Math.max(0, block.gain_level)) * 0.7;
  }
  return params;
}

/** Returns default params for a given block role */
function buildParams(block: HelixBlock): ParamMap {
  const role = normalise(block.block_role);
  if (role === "amp") return buildAmpParams(block);

  const key = ["drive", "overdrive", "distortion", "fuzz", "boost"].includes(role)
    ? "drive"
    : role;

  return { ...(DEFAULT_PARAMS[key] ?? DEFAULT_PARAMS.drive) };
}

// ─── Block builder ────────────────────────────────────────────────────────────

interface RawHelixBlock {
  model: string;
  params: ParamMap;
  position: number;
  positionB: number;
  fs_link: number;
  inputB: { channel: number; position: number };
  inputC: { channel: number; position: number };
  inputD: { channel: number; position: number };
}

function makeHelixBlock(model: string, params: ParamMap, position: number): RawHelixBlock {
  return {
    model,
    params,
    position,
    positionB: position,
    fs_link: 0,
    inputB: { channel: 0, position: 0 },
    inputC: { channel: 0, position: 0 },
    inputD: { channel: 0, position: 0 },
  };
}

// ─── Main export function ─────────────────────────────────────────────────────

/**
 * Generates a Helix .hlx patch JSON string from a list of tone recipe blocks.
 *
 * - Amps automatically get a matching cab inserted immediately after them.
 * - Blocks with unknown models get an HD2_AppBypassStereo placeholder.
 * - Positions are sequential even numbers (0, 2, 4, ...).
 */
export function generateHelixPatch(
  artistName: string,
  songTitle: string,
  blocks: HelixBlock[]
): string {
  const patchName = `${artistName} – ${songTitle}`.slice(0, 64);
  const dsp0Blocks: Record<string, RawHelixBlock> = {};
  let blockIndex = 0;

  for (const block of blocks) {
    const role = normalise(block.block_role);
    const modelId = resolveModelId(block) ?? "HD2_AppBypassStereo";
    const params = buildParams(block);
    const position = blockIndex * 2;

    dsp0Blocks[`block${blockIndex}`] = makeHelixBlock(modelId, params, position);
    blockIndex++;

    // Insert cab immediately after amp
    if (role === "amp") {
      const cabModelId = AMP_TO_CAB[modelId] ?? "HD2_Cab4x12_Green";
      const cabPosition = blockIndex * 2;
      dsp0Blocks[`block${blockIndex}`] = makeHelixBlock(
        cabModelId,
        { ...DEFAULT_PARAMS.cab },
        cabPosition
      );
      blockIndex++;
    }
  }

  const patch = {
    schema: "https://line6.com/schemas/json/tone/2.2",
    data: {
      tone: {
        dsp0: {
          blocks: dsp0Blocks,
          routing: { outputA: { type: 1 } },
        },
        meta: { tempo: 120.0, tnid: 0 },
        name: patchName,
      },
    },
  };

  return JSON.stringify(patch, null, 2);
}

/**
 * Triggers a browser download of the generated .hlx patch file.
 * Only works in browser environments.
 */
export function downloadHelixPatch(
  artistName: string,
  songTitle: string,
  blocks: HelixBlock[]
): void {
  const json = generateHelixPatch(artistName, songTitle, blocks);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const safeName = `${artistName} - ${songTitle}`
    .replace(/[^a-zA-Z0-9 _\-–]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 60);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeName}.hlx`;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Small delay before revoking so the download can start
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
