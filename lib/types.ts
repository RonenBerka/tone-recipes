export interface ToneProfile {
  id: string;
  name: string;
  section_type: string;
  gain_level: number;
  ambience_level: number;
  confidence_score: number;
  research_status: string | null;
  evidence_summary: EvidenceSummary | null;
  songs: {
    id: string;
    title: string;
    artists: {
      id: string;
      name: string;
    };
  };
}

export interface ToneProfileBlock {
  id: string;
  block_order: number;
  block_role: string;
  is_optional: boolean;
  settings_json: Record<string, unknown> | null;
  canonical_models: {
    id: string;
    canonical_name: string;
    reference_real_gear_name: string;
    category: string;
    subcategory: string;
    family_name: string;
  };
}

export interface ToneProfileTag {
  id: string;
  tag: string;
}

export interface ToneProfileListItem {
  id: string;
  name: string;
  section_type: string;
  gain_level: number;
  confidence_score: number;
  created_at: string;
  song_title: string;
  artist_name: string;
  tags: string[];
  block_roles: string[];
  download_count: number;
}

export interface TonalBias {
  attack: number;
  brightness: number;
  low_mids: number;
  compression: number;
}

export interface GuitarArchetype {
  id: string;
  name: string;
  body_type: string;
  default_pickup_family: string;
  tonal_bias_json: TonalBias | null;
  compensation_rules: Record<string, unknown> | null;
}

export interface PickupArchetype {
  id: string;
  name: string;
}

export interface OutputContext {
  id: string;
  name: string;
  output_type: string;
  cab_should_be_enabled: boolean;
}

export interface ChainBlock {
  slot: number;
  block_role: string;
  model: string;
  canonical: string;
  mapping_type: string;
  similarity: number;
  params: Record<string, unknown>;
}

export interface EvidenceSource {
  id: string;
  source_type: string;
  title: string;
  url: string | null;
  base_reliability_score: number;
}

export interface EvidenceClaim {
  id: string;
  predicate: string;
  object_text: string;
  claim_type: string;
  confidence_score: number;
}

export interface EvidenceSummary {
  claim_count: number;
  source_count: number;
  source_types: number;
  total_blocks: number;
  has_interview: boolean;
  best_claim_type: string;
  has_rig_rundown: boolean;
  avg_source_reliability: number;
}

export interface BlockScore {
  block_role: string;
  canonical_model: string;
  device_model: string;
  mapping_type: string;
  block_score: number;
  max_score: number;
}

export interface SourceInfo {
  source_id: string;
  source_type: string;
  title: string;
  claims_used: number;
  avg_confidence: number;
}

export interface FidelityBreakdown {
  blocks: BlockScore[];
  missing_penalty: number;
  confidence_bonus: number;
  raw_total: number;
  normalized_score: number;
  source_summary: SourceInfo[];
}

export interface GeneratedPreset {
  preset_id: string;
  preset_name: string;
  device: string;
  guitar: string;
  pickup: string;
  output: string;
  preset_mode: string;
  chain: ChainBlock[];
  parameter_sheet: {
    slot: number;
    block_role: string;
    model: string;
    canonical_reference: string;
    params: Record<string, unknown>;
    mapping_confidence: number;
  }[];
  fidelity_score: number;
  fidelity_breakdown: FidelityBreakdown | null;
  mapping_notes: string[];
  warnings: string[];
  adaptations: Record<string, unknown>;
  applied_rules: string[];
  profile_confidence: number;
}
