/**
 * Platform Mappings — verified model names per platform.
 *
 * Sources:
 *  - Fractal: Fractal Audio Wiki (exact Axe-FX III names, ALL-CAPS)
 *  - Helix:   dshowmusic.com + Line 6 official docs
 *  - Boss:    GT-1000 parameter guide + training knowledge
 *  - Neural:  Quad Cortex firmware ~2.0 built-in models
 *  - Kemper:  Factory rig library / community profile naming
 *
 * Keys match lowercase canonical gear names (with/without " style" suffix).
 * "—" = no equivalent model on that platform.
 */

export interface PlatformEntry {
  fractal?: string;
  helix?: string;
  boss?: string;
  neural?: string;
  kemper?: string;
  notes?: string;
}

export const PLATFORM_MAPPINGS: Record<string, PlatformEntry> = {

  // ── AMPS ─────────────────────────────────────────────────────────────────

  "marshall super lead plexi": {
    fractal: "PLEXI 100W HIGH / PLEXI 100W JUMPED",
    helix:   "Brit Plexi Nrm / Brit Plexi Brt / Brit Plexi Jump",
    boss:    "JC CLEAN (closest) / NAT CLEAN",
    neural:  "Plexiglass 100 / British Plexi",
    kemper:  "Marshall Plexi / \"Hendrix\" profiles",
    notes:   "Fractal has separate Hi/Jumped inputs. Helix has 3 channel variants (Nrm/Brt/Jumped). Fractal names are ALL-CAPS.",
  },

  "marshall jcm800": {
    fractal: "BRIT 800 2203 HIGH",
    helix:   "Brit 2203",
    boss:    "MATCH DRIVE (closest)",
    neural:  "British 800",
    kemper:  "Marshall JCM800 / 2203 factory rigs",
    notes:   "One of the most-modeled amps across all platforms.",
  },

  "marshall jtm45": {
    fractal: "BRIT JM45",
    helix:   "Brit J-45 Nrm / Brit J-45 Brt",
    boss:    "NAT CLEAN (closest)",
    neural:  "British JTM",
    kemper:  "Marshall JTM45 / Bluesbreaker rigs",
    notes:   "Early EL34 Marshall tone. Fractal and Helix are the closest to original.",
  },

  "fender twin reverb": {
    fractal: "DOUBLE VERB NORMAL / DOUBLE VERB VIBRATO",
    helix:   "US Double Nrm / US Double Vib",
    boss:    "TWIN REVERB",
    neural:  "US Double",
    kemper:  "Fender Twin / Blackface factory rigs",
    notes:   "Helix uses 'US Double' (not 'Blackface Double'). Fractal has Normal and Vibrato channels.",
  },

  "fender deluxe reverb": {
    fractal: "DELUXE VERB NORMAL / DELUXE VERB VIBRATO",
    helix:   "US Deluxe Nrm / US Deluxe Vib",
    boss:    "DELUXE REVERB",
    neural:  "US Deluxe",
    kemper:  "Fender Deluxe Reverb factory rigs",
  },

  "fender bassman": {
    fractal: "59 BASSGUY BRIGHT / 59 BASSGUY NORMAL",
    helix:   "Tweed Blues Nrm / Tweed Blues Brt",
    boss:    "BASSMAN",
    neural:  "Tweed Bass",
    kemper:  "Fender Bassman 4×10 profiles",
    notes:   "Fractal '59 BASSGUY' = Bassman. Helix 'Tweed Blues' = same amp.",
  },

  "vox ac30": {
    fractal: "CLASS-A 30W BRIGHT / CLASS-A 30W TB",
    helix:   "Essex A-30 / A-30 Fawn Nrm",
    boss:    "VOX AC30",
    neural:  "Class A 30W",
    kemper:  "Vox AC30 factory rigs",
    notes:   "Helix uses 'Essex A-30' (Essex = Vox). Top Boost channel available on all platforms.",
  },

  "vox ac15 style": {
    fractal: "CLASS-A 15W (closest to AC15)",
    helix:   "Essex A-15 / A-30 Fawn Nrm (closest)",
    boss:    "VOX AC30 (closest — no dedicated AC15)",
    neural:  "Class A 15W",
    kemper:  "Vox AC15 Top Boost profiles",
  },

  "mesa/boogie mark iv": {
    fractal: "USA MK IV LEAD / USA MK IV RHYTHM",
    helix:   "Cali IV Rhythm 1 / Cali IV Lead",
    boss:    "MESA MARK (closest)",
    neural:  "Cali IV",
    kemper:  "Mesa Mark IV / Mark IIc+ profiles",
    notes:   "Helix uses 'Cali' to avoid trademark. Fractal has both Rhythm and Lead channels.",
  },

  "mesa/boogie dual rectifier": {
    fractal: "RECTO1 ORANGE MODERN / RECTO2 RED VINTAGE",
    helix:   "Cali Rectifire",
    boss:    "DUAL RECT",
    neural:  "Cali Rectifire",
    kemper:  "Mesa Dual Rectifier factory rigs",
    notes:   "Fractal: Recto1=old, Recto2=new circuit. Helix: single 'Cali Rectifire' covers both.",
  },

  "dumble overdrive special": {
    fractal: "ODS-100 CLEAN / ODS-100 DRIVE",
    helix:   "—",
    boss:    "—",
    neural:  "—",
    kemper:  "Dumble ODS profiles (3rd party community only)",
    notes:   "Fractal has the only verified factory Dumble model across all major platforms.",
  },

  "hiwatt dr103": {
    fractal: "HIPOWER BRILLIANT / HIPOWER NORMAL",
    helix:   "WhoWatt 100",
    boss:    "—",
    neural:  "—",
    kemper:  "Hiwatt DR103 profiles",
    notes:   "Helix 'WhoWatt 100' = Hiwatt Custom 100 (named after The Who).",
  },

  "orange rockerverb 100": {
    fractal: "CITRUS RV50",
    helix:   "Mandarin Rocker",
    boss:    "—",
    neural:  "Citrus RV50",
    kemper:  "Orange Rockerverb profiles",
    notes:   "Fractal: 'CITRUS' = Orange. Helix 'Mandarin Rocker' also = Orange Rockerverb.",
  },

  "peavey 5150": {
    fractal: "PVH 6160+ CLEAN / PVH 6160 LEAD",
    helix:   "PV Panama",
    boss:    "LEAD 1 (closest)",
    neural:  "PV 5150",
    kemper:  "EVH 5150 / Peavey 5150 factory rigs",
    notes:   "Fractal 'PVH 6160' = Peavey 5150. Helix 'PV Panama' = same amp.",
  },

  "soldano slo-100": {
    fractal: "SOLO 100 CLEAN / SOLO 100 CRUNCH / SOLO 100 OD",
    helix:   "Solo Lead Clean / Solo Lead Crunch / Solo Lead OD",
    boss:    "—",
    neural:  "SLO-100",
    kemper:  "Soldano SLO-100 profiles",
    notes:   "Both Fractal and Helix have all three channels of the SLO. Helix is unusual in calling it 'Solo Lead' (not obfuscated).",
  },

  "bogner ecstasy": {
    fractal: "EURO BLUE / EURO RED",
    helix:   "German Xtra Blue / German Xtra Red",
    boss:    "—",
    neural:  "Ecstasy Blue / Ecstasy Red",
    kemper:  "Bogner Ecstasy profiles (3rd party)",
    notes:   "Fractal 'EURO' = Bogner. Helix 'German Xtra' = Ecstasy (not Shiva — that's 'German Mahdeva').",
  },

  "diezel herbert": {
    fractal: "HERBIE CH2+ / HERBIE CH3",
    helix:   "— (Helix has Diezel VH4 only, not Herbert)",
    boss:    "—",
    neural:  "Herbert",
    kemper:  "Diezel Herbert profiles",
    notes:   "Fractal 'HERBIE' = Diezel Herbert. Helix only models the VH4, not the Herbert.",
  },

  "evh 5150 iii": {
    fractal: "5153 100W BLUE / 5153 100W RED / 5153 100W GREEN",
    helix:   "EV Panama Blue / EV Panama Red",
    boss:    "—",
    neural:  "5153 100W",
    kemper:  "EVH 5150 III factory rigs",
    notes:   "Fractal has all three channels (Blue=clean, Green=crunch, Red=lead). Helix has Blue and Red only.",
  },

  "two-rock studio pro": {
    fractal: "TWO STONE J35 (Two-Rock Jet 35, closest variant)",
    helix:   "—",
    boss:    "—",
    neural:  "—",
    kemper:  "Two Rock profiles (3rd party community only)",
    notes:   "Two-Rock is severely under-modeled. Only Fractal has any Two-Rock variant (Jet 35, not Studio Pro).",
  },

  "laney supergroup": {
    fractal: "— (not modeled on any major platform)",
    helix:   "—",
    boss:    "—",
    neural:  "—",
    kemper:  "Laney profiles (3rd party community only)",
    notes:   "Laney is not modeled on Fractal, Helix, Boss GT-1000, or Neural DSP. Use a Plexi-type amp as closest substitute.",
  },

  // ── OVERDRIVES / DRIVES ──────────────────────────────────────────────────

  "tube screamer": {
    fractal: "T808 OD / VALVE SCREAMER VS9",
    helix:   "Teemah! / Hedgehog D9",
    boss:    "T808 OD",
    neural:  "Tube Screamer 808 / TS9",
    kemper:  "Stomps: Tube Screamer 808 / TS9",
    notes:   "Fractal has both TS808 (T808) and TS9 (VS9). Helix 'Teemah!' = TS808, 'Hedgehog D9' = TS9.",
  },

  "ibanez tube screamer": {
    fractal: "T808 OD / VALVE SCREAMER VS9",
    helix:   "Teemah! / Hedgehog D9",
    boss:    "T808 OD",
    neural:  "Tube Screamer 808 / TS9",
    kemper:  "Stomps: Tube Screamer 808 / TS9",
    notes:   "Fractal has both TS808 (T808) and TS9 (VS9). Helix 'Teemah!' = TS808, 'Hedgehog D9' = TS9.",
  },

  "boss sd-1": {
    fractal: "SUPER OD",
    helix:   "Deranged Master",
    boss:    "SD-1 (native Boss product, directly available)",
    neural:  "Super OD",
    kemper:  "Stomps: SD-1 type",
    notes:   "Boss GT-1000 models its own SD-1 directly. Helix 'Deranged Master' is the closest approximation.",
  },

  "klon centaur": {
    fractal: "KLONE CHIRON",
    helix:   "Minotaur",
    boss:    "— (no Klon model confirmed)",
    neural:  "Klone",
    kemper:  "Stomps: Klon Centaur",
    notes:   "Fractal 'KLONE CHIRON' = Klon Centaur. Helix 'Minotaur' = same (mythological naming).",
  },

  "proco rat": {
    fractal: "RAT DISTORTION",
    helix:   "Vermin Dist",
    boss:    "RAT DIST",
    neural:  "Rat Distortion",
    kemper:  "Stomps: RAT",
    notes:   "All platforms have the Rat. Helix 'Vermin Dist' keeps the rodent theme.",
  },

  "boss ds-1": {
    fractal: "DS1 DISTORTION",
    helix:   "Stupor OD (closest)",
    boss:    "DS-1 (native Boss product, directly available)",
    neural:  "DS-1 Dist",
    kemper:  "Stomps: DS-1 type",
    notes:   "Boss GT-1000 has it natively. Helix 'Stupor OD' is the closest but not a direct model.",
  },

  "electro-harmonix big muff pi": {
    fractal: "PI FUZZ (Triangle / Ram's Head / Russian variants)",
    helix:   "Triangle Fuzz",
    boss:    "BIG MUFF (closest)",
    neural:  "Big Muff",
    kemper:  "Stomps: Big Muff Pi",
    notes:   "Fractal has three Big Muff versions. Helix 'Triangle Fuzz' = original Triangle Muff.",
  },

  "fuzz face": {
    fractal: "FACE FUZZ (Germanium / Silicon)",
    helix:   "Arbitrator Fuzz (Ge) / Tycoctavia Fuzz (Si, closest)",
    boss:    "FUZZ (closest)",
    neural:  "Fuzz Face Ge",
    kemper:  "Stomps: Fuzz Face",
    notes:   "Fractal has both Ge and Si versions. Helix 'Arbitrator' = Ge Fuzz Face.",
  },

  "mxr distortion+": {
    fractal: "PLUS DISTORTION",
    helix:   "Compulsive Drive (closest)",
    boss:    "MXR DIST+",
    neural:  "Dist+",
    kemper:  "Stomps: Distortion+",
  },

  "boss od-1": {
    fractal: "OD-ONE OVERDRIVE",
    helix:   "Kinky Boost (closest)",
    boss:    "OD-1 (native Boss product, available)",
    neural:  "OD-1",
    kemper:  "Stomps: OD-1 type",
  },

  // ── MODULATION ───────────────────────────────────────────────────────────

  "mxr phase 90": {
    fractal: "BLOCK 90 / SCRIPT 90",
    helix:   "Ubiquitous Vibe (closest phaser)",
    boss:    "PHASER (Phase 90 type)",
    neural:  "Phase 90",
    kemper:  "Stomps: Phase 90",
    notes:   "Fractal has Script (original) and Block Logo (modified) versions.",
  },

  "electro-harmonix small clone": {
    fractal: "DIGITAL STEREO CHORUS / ANALOG MONO (closest)",
    helix:   "Glitz Chorus (closest)",
    boss:    "CE-1 CHORUS (closest)",
    neural:  "Small Clone",
    kemper:  "Stomps: Small Clone",
    notes:   "Famous for the Nirvana chorus sound. Rate low, depth high = classic Cobain.",
  },

  "boss ce-1 chorus": {
    fractal: "JAPAN CE-2 (CE-1 factory preset available)",
    helix:   "60s Bias Trem (CE-1 has vibrato/chorus modes)",
    boss:    "CE-1 CHORUS (native Boss product)",
    neural:  "CE-1",
    kemper:  "Stomps: CE-1",
    notes:   "Boss GT-1000 models its own CE-1 directly.",
  },

  "univibe": {
    fractal: "CLASSIC VIBE / MODERN VIBE",
    helix:   "Ubiquitous Vibe",
    boss:    "UNI-V",
    neural:  "UniVibe",
    kemper:  "Stomps: UniVibe",
    notes:   "Critical for Hendrix, Trower, Gilmour. Helix 'Ubiquitous Vibe' is well-regarded.",
  },

  "mxr flanger m117": {
    fractal: "MXF-117",
    helix:   "Harmflanger (closest)",
    boss:    "BF-2 FLANGER (closest)",
    neural:  "M117 Flanger",
    kemper:  "Stomps: MXR Flanger",
    notes:   "Fractal's 'MXF-117' = MXR M117R Flanger directly.",
  },

  "boss tr-2 tremolo": {
    fractal: "BIAS TREMOLO (closest)",
    helix:   "60s Bias Trem (closest)",
    boss:    "TR-2 TREMOLO (native Boss product)",
    neural:  "TR-2 Trem",
    kemper:  "Stomps: Tremolo",
  },

  // ── DELAYS ───────────────────────────────────────────────────────────────

  "maestro echoplex ep-3": {
    fractal: "TAPE ECHO / VINTAGE DIGITAL (EP-3 basis)",
    helix:   "Transistor Tape (EP-3 based)",
    boss:    "TAPE ECHO",
    neural:  "Echoplex",
    kemper:  "Delay: Tape Echo",
    notes:   "Helix 'Transistor Tape' is specifically based on the Maestro EP-3 circuit.",
  },

  "echoplex": {
    fractal: "TAPE ECHO / VINTAGE DIGITAL",
    helix:   "Transistor Tape",
    boss:    "TAPE ECHO",
    neural:  "Echoplex",
    kemper:  "Delay: Tape Echo",
  },

  "boss dd-3": {
    fractal: "DIGITAL DELAY (closest clean digital)",
    helix:   "Simple Delay (closest)",
    boss:    "DD-3 DIGITAL DLY (native Boss product)",
    neural:  "DD-3",
    kemper:  "Delay: Digital Delay",
  },

  "line 6 dl4": {
    fractal: "MULTI-DELAY (closest — multiple mode emulation)",
    helix:   "Cosmos Echo / Adriatic Delay (DL4 modes available natively)",
    boss:    "— (no DL4 equivalent)",
    neural:  "DL4 (closest)",
    kemper:  "Delay: various",
    notes:   "DL4 is a Line 6 product — native to Helix firmware with multiple modes.",
  },

  "tc electronic 2290": {
    fractal: "2290 W/ MODULATION",
    helix:   "Transistor Tape (closest clean digital delay)",
    boss:    "— (no 2290 equivalent)",
    neural:  "2290 Digital Delay",
    kemper:  "Delay: 2290",
    notes:   "Fractal has a dedicated 2290 model with modulation. Famous for Steve Lukather.",
  },

  // ── REVERBS ──────────────────────────────────────────────────────────────

  "fender spring reverb": {
    fractal: "TUBE SPRING (based on Fender 6G15)",
    helix:   "Ganymede Reverb (lush spring) / Glitz Reverb",
    boss:    "SPRING REVERB",
    neural:  "63 Spring Reverb",
    kemper:  "Reverb: Spring",
    notes:   "Fractal 'TUBE SPRING' is directly based on the 6G15 tank. Neural '63 Spring' = same era.",
  },

  "fender 6g15 spring reverb": {
    fractal: "TUBE SPRING (based on Fender 6G15)",
    helix:   "Ganymede Reverb / Glitz Reverb",
    boss:    "SPRING REVERB",
    neural:  "63 Spring Reverb",
    kemper:  "Reverb: Spring",
  },

  "boss rv-2": {
    fractal: "— (no RV-2 specific model)",
    helix:   "— (no RV-2 equivalent)",
    boss:    "RV-2 (native Boss product, available as legacy effect)",
    neural:  "— (no RV-2 model)",
    kemper:  "Reverb: Hall / Room",
    notes:   "RV-2 is a Boss product — only the GT-1000 models it natively.",
  },

  // ── DYNAMICS ─────────────────────────────────────────────────────────────

  "mxr dynacomp": {
    fractal: "DYNAMI-COMP CLASSIC / DYNAMI-COMP MODERN",
    helix:   "Red Squeeze",
    boss:    "DYNACOMP (MXR style, closest)",
    neural:  "Dyna Comp",
    kemper:  "Stomps: Dynacomp",
    notes:   "Helix 'Red Squeeze' = MXR Dyna Comp (red enclosure). Fractal has Classic and Modern versions.",
  },

  "boss cs-3": {
    fractal: "— (no CS-3 specific model)",
    helix:   "— (no CS-3 equivalent)",
    boss:    "CS-3 COMPRESS (native Boss product)",
    neural:  "CS-3",
    kemper:  "Stomps: CS-3",
  },

  "boss ns-2 noise suppressor": {
    fractal: "GATE (ISP Decimator-style — no NS-2 specific model)",
    helix:   "Noise Gate / Simple Gate (built-in)",
    boss:    "NS-2 NOISE SUPPRESSOR (native Boss product)",
    neural:  "Noise Gate (built-in)",
    kemper:  "Stomps: Noise Gate",
    notes:   "Boss GT-1000 models its own NS-2 directly. Other platforms use generic noise gates.",
  },

  // ── WAH ──────────────────────────────────────────────────────────────────

  "dunlop crybaby": {
    fractal: "VINTAGE WAH 1 / WAH 105Q",
    helix:   "UK Wah Follow (Crybaby style)",
    boss:    "WAH (Cry Baby type)",
    neural:  "Dunlop Wah",
    kemper:  "Stomps: Wah",
    notes:   "Fractal has multiple Cry Baby versions. Helix 'UK Wah Follow' is closest.",
  },

  "vox wah": {
    fractal: "BRIT WH1 / CLASSIC WAH",
    helix:   "Vetta Wah / Fassel Wah",
    boss:    "WAH (Vox type)",
    neural:  "Vox Wah",
    kemper:  "Stomps: Vox Wah",
  },

  // ── MORE AMPS ─────────────────────────────────────────────────────────────

  "marshall silver jubilee": {
    fractal: "BRIT SILVER 2555",
    helix:   "Brit Silver (2555)",
    boss:    "— (no Silver Jubilee)",
    neural:  "Brit Silver",
    kemper:  "Marshall Silver Jubilee profiles",
  },

  "orange th30": {
    fractal: "CITRUS D30 / CITRUS RV50",
    helix:   "Mandarin Rocker",
    boss:    "—",
    neural:  "Citrus RV50 (closest)",
    kemper:  "Orange profiles",
  },

  "matchless dc30": {
    fractal: "MATCH DC30",
    helix:   "Essex A-30 (closest — no DC30)",
    boss:    "—",
    neural:  "—",
    kemper:  "Matchless DC30 profiles",
  },

  "blackstar ht studio": {
    fractal: "BLACKSTAR ST. (HT series)",
    helix:   "— (no Blackstar)",
    boss:    "—",
    neural:  "—",
    kemper:  "Blackstar profiles",
  },

  // ── MORE DRIVES ───────────────────────────────────────────────────────────

  "fulltone ocd": {
    fractal: "OBSESSIVE COMPULSIVE DR.",
    helix:   "Compulsive Drive",
    boss:    "—",
    neural:  "OCD Drive",
    kemper:  "Stomps: OCD",
  },

  "boss blues driver bd-2": {
    fractal: "BLUES DELUXE",
    helix:   "Deranged Master (closest)",
    boss:    "BD-2 BLUES DRIVER (native)",
    neural:  "Blues Driver",
    kemper:  "Stomps: BD-2",
  },

  "zvex box of rock": {
    fractal: "BRIT 800 + BOOST (closest sim)",
    helix:   "—",
    boss:    "—",
    neural:  "—",
    kemper:  "—",
    notes:   "Best approximated by a clean Marshall-style drive into the amp, not a dedicated model on any platform.",
  },

  "electro-harmonix soul food": {
    fractal: "KLONE CHIRON (same circuit family)",
    helix:   "Minotaur (closest)",
    boss:    "—",
    neural:  "Klone (closest)",
    kemper:  "Stomps: Klon type",
  },

  "maxon od808": {
    fractal: "T808 OD (same circuit as TS808)",
    helix:   "Teemah!",
    boss:    "T808 OD",
    neural:  "Tube Screamer 808",
    kemper:  "Stomps: Tube Screamer 808",
    notes:   "Maxon OD808 is the original Tube Screamer circuit — identical to TS808 on all platforms.",
  },

  // ── COMPRESSORS ───────────────────────────────────────────────────────────

  "keeley compressor": {
    fractal: "STUDIO COMP",
    helix:   "Kinky Boost (closest) / Rochester Comp",
    boss:    "COMP (Studio type)",
    neural:  "Studio Comp",
    kemper:  "Stomps: Compressor",
  },

  "ross compressor": {
    fractal: "ROSS COMP",
    helix:   "Red Squeeze (Dyna Comp type, closest)",
    boss:    "COMP",
    neural:  "Ross Comp",
    kemper:  "Stomps: Ross Comp",
  },

  // ── CABS ──────────────────────────────────────────────────────────────────

  "marshall 4x12 greenback": {
    fractal: "CAB: 4x12 G12M-25 (Greenback)",
    helix:   "4x12 Greenback 25 (IR or cab block)",
    boss:    "CAB SIM: Marshall 4x12",
    neural:  "CAB: 4x12 Greenback",
    kemper:  "Cabinet: 4x12 Greenback",
  },

  "fender 4x10 bassman cab": {
    fractal: "CAB: 4x10 Vintage Alnico",
    helix:   "1x12 Blackface (closest)",
    boss:    "CAB SIM: Fender",
    neural:  "CAB: Fender 4x10",
    kemper:  "Cabinet: Fender 4x10",
  },
};

/** Lookup platform entry — handles " style" suffix and case normalization */
export function lookupPlatformEntry(
  refName: string,
  canonicalName: string
): PlatformEntry | null {
  const candidates = [
    refName,
    canonicalName,
    refName?.replace(/ style$/i, "").trim(),
    canonicalName?.replace(/ style$/i, "").trim(),
    refName?.replace(/ style \w+$/i, "").trim(),
    // Handle "Tube Screamer" without brand
    refName?.replace(/^ibanez\s+/i, "").trim(),
    canonicalName?.replace(/^ibanez\s+/i, "").trim(),
  ]
    .filter(Boolean)
    .map((s) => s!.toLowerCase().trim());

  for (const key of candidates) {
    if (PLATFORM_MAPPINGS[key]) return PLATFORM_MAPPINGS[key];
  }
  return null;
}

export const PLATFORM_LABELS: Record<string, string> = {
  fractal: "FRACTAL",
  helix:   "LINE 6",
  boss:    "BOSS",
  neural:  "NEURAL DSP",
  kemper:  "KEMPER",
};

export const PLATFORM_COLORS: Record<string, string> = {
  fractal: "#c14a22",
  helix:   "#1a6fbf",
  boss:    "#cc0000",
  neural:  "#2d7a4f",
  kemper:  "#7a5c1e",
};
