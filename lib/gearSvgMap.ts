/**
 * Gear SVG Mapping
 *
 * Maps canonical model names, Ampero device model names, and effect categories
 * to SVG illustration filenames located in /public/gear-svgs/.
 *
 * Generated from cross-referencing:
 * - canonical_models.reference_real_gear_name (Supabase)
 * - device_models.model_name / based_on_text (Supabase, Ampero)
 * - Guitar_Gear_SVG.xlsx descriptions (SVG catalog)
 */

// ---------------------------------------------------------------------------
// 1. Canonical model reference_real_gear_name -> SVG filename
//    Keyed by the `reference_real_gear_name` column from canonical_models.
// ---------------------------------------------------------------------------
export const GEAR_SVG_MAP: Record<string, string> = {
  // ── Compressors ──────────────────────────────────────────────────────────
  "Ross Compressor": "001_Ross_Compressor.svg",
  "MXR Dynacomp": "052_MXR_M104_Distortion.svg", // MXR family, closest match
  "Optical Compressor": "003_3-knob_compressor_sustainer.svg",
  "Compressor": "003_3-knob_compressor_sustainer.svg",
  "Rack/Studio Compressor": "003_3-knob_compressor_sustainer.svg",
  "Sustainer": "003_3-knob_compressor_sustainer.svg",
  "Limiter": "003_3-knob_compressor_sustainer.svg",

  // ── Boosts ──────────────────────────────────────────────────────────────
  "Clean Boost": "009_MXR_M133_Micro_Amp.svg",
  "Treble Boost": "008_Dallas_Rangemaster_Treble_Booster.svg",
  "Treble Booster": "008_Dallas_Rangemaster_Treble_Booster.svg",

  // ── Overdrives ──────────────────────────────────────────────────────────
  "Tube Screamer": "033_Ibanez_TS-808_Tube_Screamer.svg",
  "Ibanez Tube Screamer": "033_Ibanez_TS-808_Tube_Screamer.svg",
  "Fulltone OCD": "036_Fulltone_OCD.svg",
  "OCD": "036_Fulltone_OCD.svg",
  "Bluesbreaker": "038_Marshall_Bluesbreaker.svg",
  "Klon": "042_Klon_Centaur.svg",
  "Klon Centaur": "042_Klon_Centaur.svg",
  "Zendrive": "040_Hermida_Zendrive.svg",
  "Timmy": "045_Paul_Cochrane_Timmy.svg",
  "Analogman Prince of Tone": "046_Analog_Man_Prince_of_Tone.svg",
  "Morning Glory": "038_Marshall_Bluesbreaker.svg", // Morning Glory is Bluesbreaker-derived
  "Jan Ray": "045_Paul_Cochrane_Timmy.svg", // Jan Ray is Timmy-derived
  "SD1": "034_Ibanez_TS-9_Tube_Screamer.svg", // SD-1 is TS variant
  "OD1": "034_Ibanez_TS-9_Tube_Screamer.svg", // OD-1 is TS family
  "Transparent Overdrive": "045_Paul_Cochrane_Timmy.svg",

  // ── Distortions ─────────────────────────────────────────────────────────
  "ProCo RAT": "053_ProCo_RAT2.svg",
  "RAT": "053_ProCo_RAT2.svg",
  "Marshall Guv'nor": "054_Marshall_The_Guv_Nor.svg",
  "Marshall Guv'nor / amp-like drive": "054_Marshall_The_Guv_Nor.svg",
  "Boss Metal Zone": "052_MXR_M104_Distortion.svg",
  "Metal Zone": "052_MXR_M104_Distortion.svg",
  "MXR Distortion+": "052_MXR_M104_Distortion.svg",
  "DS1": "052_MXR_M104_Distortion.svg",
  "Crunch Box": "056_MI_Audio_Crunch_Box.svg",
  "Shredmaster": "055_Marshall_Shred_Master.svg",
  "Suhr Riot": "057_Suhr_Riot_Distortion.svg",
  "Governor": "054_Marshall_The_Guv_Nor.svg",
  "Brown Sound": "058_Wampler_Plexitortion.svg",
  "Dr Boogie": "056_MI_Audio_Crunch_Box.svg",
  "Modern High Gain Distortion": "057_Suhr_Riot_Distortion.svg",
  "Revv G3": "057_Suhr_Riot_Distortion.svg",

  // ── Fuzz ────────────────────────────────────────────────────────────────
  "Big Muff": "048_Big_Muff_Pi.svg",
  "Electro-Harmonix Big Muff": "048_Big_Muff_Pi.svg",
  "Fuzz Face": "049_Dallas_Arbiter_Fuzz_Face.svg",
  "Germanium Fuzz Face": "051_Dunlop_Fuzz_Face_Germanium.svg",
  "Germanium Fuzz": "051_Dunlop_Fuzz_Face_Germanium.svg",
  "Tone Bender": "050_Sola_Sound_Tone_Bender_Mk_II.svg",
  "Silicon Fuzz": "049_Dallas_Arbiter_Fuzz_Face.svg",
  "Octavia": "049_Dallas_Arbiter_Fuzz_Face.svg",
  "Green Russian": "048_Big_Muff_Pi.svg",
  "NYC Muff": "048_Big_Muff_Pi.svg",
  "Superfuzz": "049_Dallas_Arbiter_Fuzz_Face.svg",
  "Carcosa": "049_Dallas_Arbiter_Fuzz_Face.svg",

  // ── Amps ────────────────────────────────────────────────────────────────
  "Fender Champ": "061_Fender_Tweed_Champ_5F1.svg",
  "Fender Tweed": "062_Fender_Tweed_Deluxe_5E3.svg",
  "Fender Bassman": "064_Fender_Bassman_5F6-A.svg",
  "Fender Twin Reverb": "065_Fender_65_Twin_Reverb.svg",
  "Fender Deluxe Reverb": "066_Fender_Blackface_Deluxe_Reverb.svg",
  "Fender Princeton": "067_Fender_Blackface_Princeton_AA964.svg",
  "Vox AC15": "077_Vox_AC15.svg",
  "Vox AC30 Top Boost": "078_Vox_AC30HW.svg",
  "Hiwatt DR103": "079_Hiwatt_DR103.svg",
  "Roland JC120": "081_Roland_JC-120_Jazz_Chorus.svg",
  "Matchless DC30": "083_Matchless_DC-30.svg",
  "Dr Z Maz 38": "087_Dr_Z_Maz_38_Sr.svg",
  "Dumble ODS": "094_Dumble_Overdrive_Special.svg",
  "Marshall JTM45": "097_Marshall_JTM_45.svg",
  "Marshall Super Lead Plexi": "099_Marshall_Super_Lead_1959.svg",
  "Marshall JCM800": "100_Marshall_JCM800.svg",
  "Marshall JCM900": "101_Marshall_JCM900_model_4100.svg",
  "Orange OR120": "102_Orange_Rockerverb_100.svg",
  "Orange Rockerverb": "102_Orange_Rockerverb_100.svg",
  "Mesa Mark IIC+": "103_Mesa_Boogie_Mark_II_C.svg",
  "Mesa Mark V": "104_Mesa_Boogie_Mark_IV.svg",
  "Peavey 5150": "105_Peavey_5150.svg",
  "Peavey 6505": "105_Peavey_5150.svg", // 6505 = rebranded 5150
  "EVH 5150": "105_Peavey_5150.svg",
  "Diezel VH4": "108_Diezel_VH4.svg",
  "Mesa Dual Rectifier": "109_Mesa_Boogie_Dual_Rectifier.svg",
  "Bogner Ecstasy": "110_Bogner_Ecstasy.svg",
  "Bogner Uberschall": "110_Bogner_Ecstasy.svg",
  "Soldano SLO": "093_Soldano_SLO100.svg",
  "Supro Dual Tone": "076_Supro_Dual-Tone_1624T.svg",
  "Supro Thunderbolt": "076_Supro_Dual-Tone_1624T.svg",
  "Friedman BE100": "100_Marshall_JCM800.svg", // Friedman = modded Marshall
  "Friedman Dirty Shirley": "100_Marshall_JCM800.svg",
  "Two Rock Custom Reverb": "094_Dumble_Overdrive_Special.svg", // Two Rock = Dumble-inspired
  "PRS Archon": "105_Peavey_5150.svg",
  "Victory Kraken": "108_Diezel_VH4.svg",
  "Laney Ironheart": "106_Engl_Savage_120_E610.svg",
  "Laney Lionheart": "078_Vox_AC30HW.svg",
  "Laney Supergroup": "079_Hiwatt_DR103.svg",
  "Diezel Herbert": "108_Diezel_VH4.svg",
  "Marshall DSL": "100_Marshall_JCM800.svg",
  "Marshall JVM": "101_Marshall_JCM900_model_4100.svg",
  "Marshall Major": "099_Marshall_Super_Lead_1959.svg",
  "Marshall Modified": "100_Marshall_JCM800.svg",
  "Marshall Origin": "097_Marshall_JTM_45.svg",
  "Marshall Handwired": "099_Marshall_Super_Lead_1959.svg",
  "Marshall Acoustic": "117_AER_Colourizer_2.svg",
  "Marshall CODE": "100_Marshall_JCM800.svg",
  "Marshall MG Gold": "100_Marshall_JCM800.svg",
  "Marshall Micro Stack": "100_Marshall_JCM800.svg",
  "Marshall Studio Series": "100_Marshall_JCM800.svg",
  "Marshall Vintage Reissues": "099_Marshall_Super_Lead_1959.svg",
  "Kemper Generic Profile": "100_Marshall_JCM800.svg",
  "Neural DSP Capture": "100_Marshall_JCM800.svg",
  "Line6 Insane": "109_Mesa_Boogie_Dual_Rectifier.svg",

  // ── Cabinets ────────────────────────────────────────────────────────────
  "1x12 Open Back": "128_Marshall_1x12.svg",
  "2x12 Alnico": "139_Vox_AC30_2x12.svg",
  "Generic 2x12 Open Back": "134_Bogner_2x12.svg",
  "2x12 V30": "137_Mesa_Boogie_2x12.svg",
  "4x10 Bassman": "141_Fender_Super_Reverb_4x10.svg",
  "Marshall 4x12 Greenback": "146_Marshall_4x12.svg",
  "4x12 Vintage 30": "149_Mesa_Boogie_4x12.svg",

  // ── EQ ──────────────────────────────────────────────────────────────────
  "EQ": "384_Guitar_EQ_1.svg",
  "Graphic EQ": "393_Graphic_EQ.svg",
  "Parametric EQ": "391_Para_EQ_1.svg",
  "Graphic / Parametric EQ": "393_Graphic_EQ.svg",

  // ── Modulation ──────────────────────────────────────────────────────────
  "Boss CE-1 Chorus": "179_Arion_SCH-1_Stereo_Chorus.svg",
  "Chorus": "394_Aozora_Chorus.svg",
  "Roland Dimension D": "396_Liquid_C.svg",
  "Dimension": "396_Liquid_C.svg",
  "Analog Flanger": "400_Flanger_Flanger.svg",
  "Flanger": "400_Flanger_Flanger.svg",
  "Jet Flanger": "400_Flanger_Flanger.svg",
  "MXR Phase 90 Block": "182_MXR_M101_Phase_90.svg",
  "MXR Phase 90 Script": "182_MXR_M101_Phase_90.svg",
  "Phaser": "182_MXR_M101_Phase_90.svg",
  "Shin-ei Uni-Vibe": "185_Shin-ei_Uni-Vibe.svg",
  "UniVibe": "185_Shin-ei_Uni-Vibe.svg",
  "Tremolo": "416_Custom_Trem.svg",
  "Harmonic Trem": "416_Custom_Trem.svg",
  "Harmonic Tremolo": "416_Custom_Trem.svg",
  "Leslie Rotary Speaker": "417_Rotary_Rotary.svg",
  "Rotary": "417_Rotary_Rotary.svg",
  "Vibrato": "406_Vibrato_Vibrato.svg",
  "Detune": "406_Vibrato_Vibrato.svg",

  // ── Delays ──────────────────────────────────────────────────────────────
  "Analog Delay": "423_Analog_Delay_M.svg",
  "Rack / pedal digital delay": "427_Digital_Delay_M.svg",
  "Tape Echo / Binson-like echo": "430_Tape_Delay_M.svg",
  "Dual Delay": "432_Dual_Delay.svg",
  "Reverse Delay": "438_Reverse_Delay.svg",
  "Ping Pong Delay": "433_Ping-Pong_Ping-Pong.svg",
  "Dotted Eighth Delay": "427_Digital_Delay_M.svg",
  "Modulated Delay": "423_Analog_Delay_M.svg",
  "Multi Head Tape": "451_Multitap_Echo.svg",
  "Ambient Delay": "440_Ambience_1.svg",
  "LoFi Delay": "436_Lo-Fi_Delay.svg",

  // ── Reverbs ─────────────────────────────────────────────────────────────
  "Hall Reverb": "457_Concert_Concert.svg",
  "Studio Plate Reverb": "192_EMT_140_plate_Reverberator.svg",
  "Studio Room": "455_Studio_Studio.svg",
  "Spring Reverb": "462_Combo_Spring.svg",
  "Shimmer Reverb": "464_Shimmer_1.svg",
  "Shimmer": "464_Shimmer_1.svg",
  "Ambient": "440_Ambience_1.svg",
  "Cloud": "466_Cloud_Cloud.svg",
  "Cathedral": "458_Arena_Arena.svg",
  "Bloom": "466_Cloud_Cloud.svg",
  "Gated": "455_Studio_Studio.svg",

  // ── Wah ─────────────────────────────────────────────────────────────────
  "Dunlop Cry Baby GCB95": "028_Dunlop_CryBaby.svg",
  "Vox V847": "022_Vox_V845_wah.svg",
  "Morley Bad Horsie": "025_Morley_Power_Wah.svg",
  "Envelope Filter / Auto Wah": "026_Hotone_Soul_Press.svg",

  // ── Gate ─────────────────────────────────────────────────────────────────
  "Noise Gate": "013_ISP_Decimator.svg",

  // ── Utility ─────────────────────────────────────────────────────────────
  "Buffer": "011_FET-based_belt_clip_preamp.svg",
  "Enhancer": "012_Xotic_EP_Booster.svg",
  "Volume": "009_MXR_M133_Micro_Amp.svg",
};

// ---------------------------------------------------------------------------
// 2. Ampero device model name -> SVG filename
//    Keyed by `device_models.model_name` for the Ampero device.
// ---------------------------------------------------------------------------
export const AMPERO_SVG_MAP: Record<string, string> = {
  // ── Amps ────────────────────────────────────────────────────────────────
  "5150": "105_Peavey_5150.svg",
  "AC30 TB": "078_Vox_AC30HW.svg",
  "Brit 800": "100_Marshall_JCM800.svg",
  "Brit Plexi": "099_Marshall_Super_Lead_1959.svg",
  "Hiwatt": "079_Hiwatt_DR103.svg",
  "Mesa Recto": "109_Mesa_Boogie_Dual_Rectifier.svg",
  "SLO Lead": "093_Soldano_SLO100.svg",
  "US Deluxe": "066_Fender_Blackface_Deluxe_Reverb.svg",
  "US Twin": "065_Fender_65_Twin_Reverb.svg",

  // ── Boosts ──────────────────────────────────────────────────────────────
  "Clean Boost": "009_MXR_M133_Micro_Amp.svg",
  "Treble Boost": "008_Dallas_Rangemaster_Treble_Booster.svg",

  // ── Cabinets ────────────────────────────────────────────────────────────
  "1x12 Open": "128_Marshall_1x12.svg",
  "2x12 Alnico": "139_Vox_AC30_2x12.svg",
  "2x12 Open": "134_Bogner_2x12.svg",
  "4x10 Bass": "141_Fender_Super_Reverb_4x10.svg",
  "4x12 Green": "146_Marshall_4x12.svg",
  "4x12 Modern": "149_Mesa_Boogie_4x12.svg",
  "4x12 V30": "149_Mesa_Boogie_4x12.svg",

  // ── Compressors ──────────────────────────────────────────────────────────
  "Limiter": "003_3-knob_compressor_sustainer.svg",
  "Optical Comp": "003_3-knob_compressor_sustainer.svg",
  "Red Comp": "052_MXR_M104_Distortion.svg", // MXR Dynacomp is red
  "Ross Comp": "001_Ross_Compressor.svg",
  "Studio Comp": "003_3-knob_compressor_sustainer.svg",

  // ── Delays ──────────────────────────────────────────────────────────────
  "Ambient Delay": "440_Ambience_1.svg",
  "Analog Delay": "423_Analog_Delay_M.svg",
  "Digital Delay": "427_Digital_Delay_M.svg",
  "Dual Delay": "432_Dual_Delay.svg",
  "Reverse Delay": "438_Reverse_Delay.svg",
  "Tape Echo": "430_Tape_Delay_M.svg",

  // ── Distortions ─────────────────────────────────────────────────────────
  "Black Tail": "053_ProCo_RAT2.svg", // RAT-based
  "Metal Drive": "052_MXR_M104_Distortion.svg",
  "Shred Drive": "057_Suhr_Riot_Distortion.svg",

  // ── EQ ──────────────────────────────────────────────────────────────────
  "Graphic EQ": "393_Graphic_EQ.svg",
  "Parametric EQ": "391_Para_EQ_1.svg",

  // ── Fuzz ────────────────────────────────────────────────────────────────
  "Fuzz Face": "049_Dallas_Arbiter_Fuzz_Face.svg",
  "Germanium Fuzz": "051_Dunlop_Fuzz_Face_Germanium.svg",
  "Muff Fuzz": "048_Big_Muff_Pi.svg",
  "Octa Fuzz": "049_Dallas_Arbiter_Fuzz_Face.svg",

  // ── Gate ─────────────────────────────────────────────────────────────────
  "Noise Gate": "013_ISP_Decimator.svg",

  // ── Modulation ──────────────────────────────────────────────────────────
  "Analog Flanger": "400_Flanger_Flanger.svg",
  "Block Phaser": "182_MXR_M101_Phase_90.svg",
  "CE Chorus": "179_Arion_SCH-1_Stereo_Chorus.svg",
  "Dimension Chorus": "396_Liquid_C.svg",
  "Harmonic Trem": "416_Custom_Trem.svg",
  "Jet Flanger": "400_Flanger_Flanger.svg",
  "Rotary": "417_Rotary_Rotary.svg",
  "Script Phaser": "182_MXR_M101_Phase_90.svg",
  "Tremolo": "416_Custom_Trem.svg",
  "Uni Vibe": "185_Shin-ei_Uni-Vibe.svg",

  // ── Overdrives ──────────────────────────────────────────────────────────
  "AC Booster": "004_Xotic_AC_Booster.svg",
  "Blues Butter": "038_Marshall_Bluesbreaker.svg",
  "Crunch Drive": "056_MI_Audio_Crunch_Box.svg",
  "Faun Drive": "040_Hermida_Zendrive.svg",
  "Green 9": "034_Ibanez_TS-9_Tube_Screamer.svg",
  "Green Drive": "033_Ibanez_TS-808_Tube_Screamer.svg",
  "OCD Drive": "036_Fulltone_OCD.svg",
  "Prince Drive": "046_Analog_Man_Prince_of_Tone.svg",
  "Screamood": "033_Ibanez_TS-808_Tube_Screamer.svg",
  "T808": "033_Ibanez_TS-808_Tube_Screamer.svg",

  // ── Reverbs ─────────────────────────────────────────────────────────────
  "Hall": "457_Concert_Concert.svg",
  "Plate": "192_EMT_140_plate_Reverberator.svg",
  "Room": "455_Studio_Studio.svg",
  "Shimmer": "464_Shimmer_1.svg",
  "Spring": "462_Combo_Spring.svg",

  // ── Wah ─────────────────────────────────────────────────────────────────
  "Chili Wah": "032_Ibanez_WH-10.svg",
  "Clay Wah": "021_Vox_Clyde_McCoy_wah.svg",
  "Crier G": "026_Hotone_Soul_Press.svg",
  "Cry Wah": "028_Dunlop_CryBaby.svg",
  "Cry Wah+": "029_Dunlop_CryBaby_535Q.svg",
  "Magic Wah": "025_Morley_Power_Wah.svg",
  "Sandman Wah": "031_Dunlop_KH95_Kirk_Hammett_CryBaby.svg",
  "Voxy Wah": "022_Vox_V845_wah.svg",
  "Voxy Wah+": "023_Vox_V846_wah.svg",
};

// ---------------------------------------------------------------------------
// 3. Extended Ampero amp/cab/effect names -> SVG filename
//    These are additional Ampero model names found in the XLSX catalog
//    (preamp sims, cab sims, effect names) that are not in the device_models
//    table but may appear in preset data or future device model expansions.
// ---------------------------------------------------------------------------
export const AMPERO_EXTENDED_SVG_MAP: Record<string, string> = {
  // ── Ampero preamp sim names (from XLSX rows 193-285) ────────────────────
  "Tweed Chap": "061_Fender_Tweed_Champ_5F1.svg",
  "Tweed Lux": "062_Fender_Tweed_Deluxe_5E3.svg",
  "Tweed Prince": "063_Fender_Tweed_Princeton_Amp_5F2-A.svg",
  "Baseman Norm": "064_Fender_Bassman_5F6-A.svg",
  "Baseman Bright": "064_Fender_Bassman_5F6-A.svg",
  "Black Twin": "065_Fender_65_Twin_Reverb.svg",
  "Black Deluxe": "066_Fender_Blackface_Deluxe_Reverb.svg",
  "Black Deluxe+": "066_Fender_Blackface_Deluxe_Reverb.svg",
  "Black Prince": "067_Fender_Blackface_Princeton_AA964.svg",
  "Black Super": "068_Fender_Blackface_Super_Reverb_AB763.svg",
  "Black Vibra": "069_Fender_Blackface_Vibroverb_AA763.svg",
  "Brown King Clean": "070_Fender_Brownface_Vibro-King.svg",
  "Brown King Drive": "070_Fender_Brownface_Vibro-King.svg",
  "Brown Vibra": "071_Fender_Brownface_Vibrolux_6G11.svg",
  "Brown Concert": "072_Fender_Brownface_Concert_6G12.svg",
  "Brown Super": "073_Fender_Brownface_Super-Amp_6G4.svg",
  "Silver Twin": "074_Fender_Silverface_Twin_Reverb_AC568.svg",
  "Silver Master": "075_Fender_Silverface_Bandmaster_AB763.svg",
  "Superb Dual Clean": "076_Supro_Dual-Tone_1624T.svg",
  "Superb Dual Drive": "076_Supro_Dual-Tone_1624T.svg",
  "Voxy 15 TB": "077_Vox_AC15.svg",
  "Voxy 30HW Norm": "078_Vox_AC30HW.svg",
  "Voxy 30HW TB": "078_Vox_AC30HW.svg",
  "Hiway 103 Norm": "079_Hiwatt_DR103.svg",
  "Watchman": "080_Gibson_Scout.svg",
  "Jazz Clean": "081_Roland_JC-120_Jazz_Chorus.svg",
  "Emperor Clean": "082_Matchless_Chieftain_212.svg",
  "Emperor Drive": "082_Matchless_Chieftain_212.svg",
  "Match 30 Clean": "083_Matchless_DC-30.svg",
  "Tang A30 Clean": "084_Orange_AD30.svg",
  "Tang A30 Drive": "084_Orange_AD30.svg",
  "Superstar Clean": "085_Mesa_Boogie_Lone_Star.svg",
  "Superstar Drive": "085_Mesa_Boogie_Lone_Star.svg",
  "Glacian Clean": "086_Bogner_Shiva.svg",
  "Glacian Drive": "086_Bogner_Shiva.svg",
  "Dr. 38 Clean": "087_Dr_Z_Maz_38_Sr.svg",
  "Dr. 38 Drive": "087_Dr_Z_Maz_38_Sr.svg",
  "Dr 38 Clean": "087_Dr_Z_Maz_38_Sr.svg",
  "Dr 38 Drive": "087_Dr_Z_Maz_38_Sr.svg",
  "Dr. 66": "088_Dr_Z_Route_66.svg",
  "Dr 66": "088_Dr_Z_Route_66.svg",
  "Pendragon Clean": "089_Grindrod_Pendragon_PG20C.svg",
  "Pendragon Clean+": "089_Grindrod_Pendragon_PG20C.svg",
  "Pendragon Drive": "089_Grindrod_Pendragon_PG20C.svg",
  "Press Wrecker": "090_Trainwreck_Express.svg",
  "Pool Wrecker": "091_Trainwreck_Liverpool.svg",
  "Hot Kitty Clean": "092_Bad_Cat_Hot_Cat_30.svg",
  "Hot Kitty Drive": "092_Bad_Cat_Hot_Cat_30.svg",
  "Soloist 100 Clean": "093_Soldano_SLO100.svg",
  "Soloist 100 Clean HQ": "093_Soldano_SLO100.svg",
  "Soloist 100 Crunch": "093_Soldano_SLO100.svg",
  "Soloist 100 Crunch HQ": "093_Soldano_SLO100.svg",
  "Soloist 100 Lead": "093_Soldano_SLO100.svg",
  "Soloist 100 Lead HQ": "093_Soldano_SLO100.svg",
  "Dumbell ODS 1": "094_Dumble_Overdrive_Special.svg",
  "Dumbell ODS 2": "094_Dumble_Overdrive_Special.svg",
  "Petrus Clean HQ": "095_Mesa_Boogie_JP-2C.svg",
  "Petrus Crunch HQ": "095_Mesa_Boogie_JP-2C.svg",
  "Petrus Lead HQ": "095_Mesa_Boogie_JP-2C.svg",
  "Marshell Blues": "096_Marshall_1958_Mini_Bluesbreaker.svg",
  "Marshell 45": "097_Marshall_JTM_45.svg",
  "Marshell 45+": "097_Marshall_JTM_45.svg",
  "Marshell 45 Jump": "097_Marshall_JTM_45.svg",
  "Marshell 50": "098_Marshall_JMP_50.svg",
  "Marshell 50+": "098_Marshall_JMP_50.svg",
  "Marshell 50 Jump": "098_Marshall_JMP_50.svg",
  "Marshell SLP": "099_Marshall_Super_Lead_1959.svg",
  "Marshell SLP+": "099_Marshall_Super_Lead_1959.svg",
  "Marshell SLP Jump": "099_Marshall_Super_Lead_1959.svg",
  "Marshell 800": "100_Marshall_JCM800.svg",
  "Marshell 900": "101_Marshall_JCM900_model_4100.svg",
  "Messe IIC+": "103_Mesa_Boogie_Mark_II_C.svg",
  "Messe IV Lead": "104_Mesa_Boogie_Mark_IV.svg",
  "Eddie 51": "105_Peavey_5150.svg",
  "Engle Saga 1": "106_Engl_Savage_120_E610.svg",
  "Engle Saga 2": "106_Engl_Savage_120_E610.svg",
  "Powerengle Lead": "107_Engl_Powerball_II_E645_2.svg",
  "Dizzle VH B": "108_Diezel_VH4.svg",
  "Dizzle VH S": "108_Diezel_VH4.svg",
  "Dizzle VH+ B": "108_Diezel_VH4.svg",
  "Dizzle VH+ S": "108_Diezel_VH4.svg",
  "Rector Dual V": "109_Mesa_Boogie_Dual_Rectifier.svg",
  "Rector Dual M": "109_Mesa_Boogie_Dual_Rectifier.svg",
  "Boger XT Blue V": "110_Bogner_Ecstasy.svg",
  "Boger XT Blue M": "110_Bogner_Ecstasy.svg",
  "Boger XT Red V": "110_Bogner_Ecstasy.svg",
  "Boger XT Red M": "110_Bogner_Ecstasy.svg",
  "Fryman B": "100_Marshall_JCM800.svg", // Friedman = modded Marshall
  "Fryman HB": "100_Marshall_JCM800.svg",
  "Tang R100": "102_Orange_Rockerverb_100.svg",
  "Ampage Classic": "111_Ampeg_SVT.svg",
  "Ampage Flip": "112_Ampeg_B-15.svg",
  "Alchemy Pre": "116_Alembic_F-2B.svg",
  "Voxy Bass": "113_Vox_AC-100.svg",
  "Tang Bass": "114_Orange_AD200B.svg",
  "Messe Bass 400": "115_Mesa_Boogie_Bass_400.svg",

  // ── Ampero pedal/effect internal names (from XLSX) ──────────────────────
  "Comprosso": "001_Ross_Compressor.svg",
  "Comparoma 4": "002_Keeley_C4_4-knob_compressor.svg",
  "Blue Sustainer": "003_3-knob_compressor_sustainer.svg",
  "Beefy Boost": "005_Xotic_BB_Preamp.svg",
  "Forest Boost": "007_Fortin_Grind.svg",
  "Micro Boost": "009_MXR_M133_Micro_Amp.svg",
  "Enhancer": "012_Xotic_EP_Booster.svg",
  "Tube Clipper": "037_B_K_Butler_Tube_Driver.svg",
  "Blues Butter": "038_Marshall_Bluesbreaker.svg",
  "Grand Driver": "039_Marshall_Drive_Master.svg",
  "Zen Garden": "040_Hermida_Zendrive.svg",
  "Direct Touch": "041_Barber_Direct_Drive.svg",
  "Magic T": "045_Paul_Cochrane_Timmy.svg",
  "Prince of Drive": "046_Analog_Man_Prince_of_Tone.svg",
  "Plustortion": "052_MXR_M104_Distortion.svg",
  "Black Tail": "053_ProCo_RAT2.svg",
  "Shredder": "055_Marshall_Shred_Master.svg",
  "Rebel": "057_Suhr_Riot_Distortion.svg",
  "Behemoth M": "059_Darkglass_Microtubes_B7K_Analog_Bass_Preamp.svg",
  "Basshammer": "060_Aguilar_Tone_Hammer_Bass_Preamp.svg",

  // ── Ampero modulation internal names ────────────────────────────────────
  "Aozora Chorus": "394_Aozora_Chorus.svg",
  "Grand Choruium": "395_Grand_Choruium.svg",
  "Liquid C": "396_Liquid_C.svg",
  "Liquid Dream": "398_Liquid_Dream.svg",
  "3D Chorus": "399_3D_Chorus.svg",
  "Bass Chorus": "397_Bass_Chorus.svg",
  "Neg Flanger": "402_Neg_Flanger.svg",
  "Trem Flanger": "403_Trem_Flanger.svg",
  "Bass Flanger": "401_Bass_Flanger.svg",
  "90 Phaser": "408_90_Phaser.svg",
  "Green Phaser": "409_Green_Phaser.svg",
  "Stone Phaser": "410_Stone_Phaser.svg",
  "Notch Phaser": "411_Notch_Phaser.svg",
  "Pan Phaser": "412_Pan_Phaser.svg",
  "Minivibe": "413_Minivibe_Minivibe.svg",
  "Revolver": "414_Revolver_Revolver.svg",
  "Helicopter": "415_Helicopter_Helicopter.svg",
  "Custom Trem": "416_Custom_Trem.svg",
  "Pulser": "404_Pulser_Pulser.svg",
  "Grand Vibrato": "405_Grand_Vibrato.svg",

  // ── Ampero delay internal names ─────────────────────────────────────────
  "Analog Delay M": "423_Analog_Delay_M.svg",
  "Analog Delay S": "424_Analog_Delay_S.svg",
  "BBD Delay M": "425_BBD_Delay_M.svg",
  "BBD Delay S": "426_BBD_Delay_S.svg",
  "Digital Delay M": "427_Digital_Delay_M.svg",
  "Digital Delay S": "428_Digital_Delay_S.svg",
  "Digital Delay HQ": "429_Digital_Delay_HQ.svg",
  "Tape Delay M": "430_Tape_Delay_M.svg",
  "Tape Delay S": "431_Tape_Delay_S.svg",
  "Dual Delay": "432_Dual_Delay.svg",
  "Ping-Pong": "433_Ping-Pong_Ping-Pong.svg",
  "Sweep Delay": "434_Sweep_Delay.svg",
  "Tremolo Delay": "435_Tremolo_Delay.svg",
  "Lo-Fi Delay": "436_Lo-Fi_Delay.svg",
  "Ring Delay": "437_Ring_Delay.svg",
  "Reverse Delay": "438_Reverse_Delay.svg",
  "Vintage Rack": "439_Vintage_Rack.svg",
  "Ambience 1": "440_Ambience_1.svg",
  "Ambience 2": "441_Ambience_2.svg",
  "Infidelay 1": "442_Infidelay_1.svg",
  "Infidelay 2": "443_Infidelay_2.svg",
  "Sweetie": "444_Sweetie_Sweetie.svg",
  "Recaller": "445_Recaller_Recaller.svg",
  "Ekopress 80": "446_Ekopress_80.svg",
  "Ekopress 900": "447_Ekopress_900.svg",
  "Ekopress 999": "448_Ekopress_999.svg",
  "2290 Mod": "449_2290_Mod.svg",
  "2290 Ducker": "450_2290_Ducker.svg",
  "Multitap Echo": "451_Multitap_Echo.svg",
  "Glitch Delay": "452_Glitch_Delay.svg",
  "Icy Delay": "453_Icy_Delay.svg",
  "Bloodless Delay": "454_Bloodless_Delay.svg",

  // ── Ampero reverb internal names ────────────────────────────────────────
  "Studio": "455_Studio_Studio.svg",
  "Club": "456_Club_Club.svg",
  "Concert": "457_Concert_Concert.svg",
  "Arena": "458_Arena_Arena.svg",
  "Small Plate": "459_Small_Plate.svg",
  "Large Plate": "460_Large_Plate.svg",
  "140 Plate HQ": "461_140_Plate_HQ.svg",
  "Combo Spring": "462_Combo_Spring.svg",
  "Tube Spring": "463_Tube_Spring.svg",
  "Shimmer 1": "464_Shimmer_1.svg",
  "Shimmer 2": "465_Shimmer_2.svg",
  "Cloud": "466_Cloud_Cloud.svg",
  "Silver Linings": "467_Silver_Linings.svg",

  // ── Ampero EQ internal names ────────────────────────────────────────────
  "Guitar EQ 1": "384_Guitar_EQ_1.svg",
  "Guitar EQ 2": "385_Guitar_EQ_2.svg",
  "Bass EQ 1": "386_Bass_EQ_1.svg",
  "Bass EQ 2": "387_Bass_EQ_2.svg",
  "V-EQ": "388_V-EQ_V-EQ.svg",
  "Graphic 7": "389_Graphic_7.svg",
  "Graphic 7B": "390_Graphic_7B.svg",
  "Para EQ 1": "391_Para_EQ_1.svg",
  "Para EQ 2": "392_Para_EQ_2.svg",
  "Graphic EQ": "393_Graphic_EQ.svg",

  // ── Ampero cab sim internal names ───────────────────────────────────────
  "Voxy 1x10 A": "286_Vox_y_1x10_A.svg",
  "Voxy 1x10 B": "287_Vox_y_1x10_B.svg",
  "Voxy GRN 1x10": "288_Vox_y_GRN_1x10.svg",
  "Voxy Custom 1x10": "289_Vox_y_Custom_1x10.svg",
  "TWD 1x10": "290_TWD_1x10.svg",
  "TWD VN 1x10": "291_TWD_VN_1x10.svg",
  "Golden 1x10": "292_Golden_1x10.svg",
  "UK Custom 1x12": "293_UK_Custom_1x12.svg",
  "TWD 1x12": "294_TWD_1x12.svg",
  "TWD Dlx 1x12": "295_TWD_Dlx_1x12.svg",
  "Black 1x12": "296_Black_1x12.svg",
  "Black Dlx 1x12 A": "297_Black_Dlx_1x12_A.svg",
  "Black Dlx 1x12 B": "298_Black_Dlx_1x12_B.svg",
  "Black Dlx 1x12 C": "299_Black_Dlx_1x12_C.svg",
  "Golden 1x12": "300_Golden_1x12.svg",
  "Boger 2x12 A": "301_Boger_2x12_A.svg",
  "Boger 2x12 B": "302_Boger_2x12_B.svg",
  "Glacian 2x12 A": "303_Glacian_2x12_A.svg",
  "Glacian 2x12 B": "304_Glacian_2x12_B.svg",
  "Tang 2x12 A": "305_Tang_2x12_A.svg",
  "Tang 2x12 B": "306_Tang_2x12_B.svg",
  "Messe 2x12": "307_Messe_2x12.svg",
  "Rector 2x12 A": "308_Rector_2x12_A.svg",
  "Rector 2x12 B": "309_Rector_2x12_B.svg",
  "Rector 2x12 C": "310_Rector_2x12_C.svg",
  "Voxy 2x12 A": "311_Vox_y_2x12_A.svg",
  "Voxy 2x12 B": "312_Vox_y_2x12_B.svg",
  "Voxy Cream 2x12": "313_Vox_y_Cream_2x12.svg",
  "Voxy Green 2x12": "314_Vox_y_Green_2x12.svg",
  "Voxy Gold 2x12": "315_Vox_y_Gold_2x12.svg",
  "Boger 4x10 A": "316_Boger_4x10_A.svg",
  "Boger 4x10 B": "317_Boger_4x10_B.svg",
  "Super 4x10 A": "318_Super_4x10_A.svg",
  "Super 4x10 B": "319_Super_4x10_B.svg",
  "Boger 4x12 A": "320_Boger_4x12_A.svg",
  "Boger 4x12 B": "321_Boger_4x12_B.svg",
  "Dizzle 4x12 A": "322_Dizzle_4x12_A.svg",
  "Dizzle 4x12 B": "323_Dizzle_4x12_B.svg",
  "Eddie 4x12 A": "324_Eddie_4x12_A.svg",
  "Eddie 4x12 B": "325_Eddie_4x12_B.svg",
  "Engle 4x12 A": "326_Engl_e_4x12_A.svg",
  "Engle 4x12 B": "327_Engl_e_4x12_B.svg",
  "Fryman 4x12 A": "328_Fryman_4x12_A.svg",
  "Fryman 4x12 B": "329_Fryman_4x12_B.svg",
  "UK Cream 4x12": "330_UK_Cream_4x12.svg",
  "UK Check 4x12": "331_UK_Check_4x12.svg",
  "UK Green 4x12": "332_UK_Green_4x12.svg",
  "UK Custom 4x12": "333_UK_Custom_4x12.svg",
  "UK Vintage 4x12": "334_UK_Vintage_4x12.svg",
  "UK Black 4x12": "335_UK_Black_4x12.svg",
  "UK 82 4x12": "336_UK_82_4x12.svg",
  "Tang 4x12 A": "337_Tang_4x12_A.svg",
  "Tang 4x12 B": "338_Tang_4x12_B.svg",
  "Tang 4x12 C": "339_Tang_4x12_C.svg",
  "Messe 4x12 A": "340_Messe_4x12_A.svg",
  "Messe 4x12 B": "341_Messe_4x12_B.svg",
  "Rector 4x12 A": "342_Rector_4x12_A.svg",
  "Rector 4x12 B": "343_Rector_4x12_B.svg",
  "Rector 4x12 C": "344_Rector_4x12_C.svg",
  "Rector 4x12 D": "345_Rector_4x12_D.svg",

  // ── Ampero wah internal names ───────────────────────────────────────────
  "Clay Wah": "021_Vox_Clyde_McCoy_wah.svg",
  "Voxy Wah": "022_Vox_V845_wah.svg",
  "Voxy Wah+": "023_Vox_V846_wah.svg",
  "Cry Wah": "028_Dunlop_CryBaby.svg",
  "Cry Wah+": "029_Dunlop_CryBaby_535Q.svg",
  "Sandman Wah": "031_Dunlop_KH95_Kirk_Hammett_CryBaby.svg",
  "Chili Wah": "032_Ibanez_WH-10.svg",
  "Magic Wah": "025_Morley_Power_Wah.svg",
  "Crier G": "026_Hotone_Soul_Press.svg",
};

// ---------------------------------------------------------------------------
// 4. Fallback by canonical category -> a representative SVG
// ---------------------------------------------------------------------------
export const CATEGORY_SVG_FALLBACK: Record<string, string> = {
  amp: "065_Fender_65_Twin_Reverb.svg",
  cab: "146_Marshall_4x12.svg",
  overdrive: "033_Ibanez_TS-808_Tube_Screamer.svg",
  distortion: "053_ProCo_RAT2.svg",
  fuzz: "048_Big_Muff_Pi.svg",
  compressor: "001_Ross_Compressor.svg",
  eq: "393_Graphic_EQ.svg",
  modulation: "182_MXR_M101_Phase_90.svg",
  delay: "187_Electro-Harmonix_Deluxe_Memory_Man.svg",
  reverb: "192_EMT_140_plate_Reverberator.svg",
  boost: "008_Dallas_Rangemaster_Treble_Booster.svg",
  gate: "013_ISP_Decimator.svg",
  utility: "012_Xotic_EP_Booster.svg",
  wah: "028_Dunlop_CryBaby.svg",
};

// ---------------------------------------------------------------------------
// 5. Helper: resolve SVG filename for a given context
// ---------------------------------------------------------------------------

/**
 * Look up the SVG filename for a gear model.
 *
 * Resolution order:
 * 1. Exact match in GEAR_SVG_MAP (canonical reference_real_gear_name)
 * 2. Exact match in AMPERO_SVG_MAP (Ampero device_models.model_name)
 * 3. Exact match in AMPERO_EXTENDED_SVG_MAP (Ampero internal names)
 * 4. Fallback by category from CATEGORY_SVG_FALLBACK
 * 5. undefined if nothing matches
 */
export function resolveGearSvg(
  name: string,
  category?: string,
): string | undefined {
  return (
    GEAR_SVG_MAP[name] ??
    AMPERO_SVG_MAP[name] ??
    AMPERO_EXTENDED_SVG_MAP[name] ??
    (category ? CATEGORY_SVG_FALLBACK[category] : undefined)
  );
}
