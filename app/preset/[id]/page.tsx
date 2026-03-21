"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Download, RefreshCw, ArrowLeft, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { HardwareChassis } from "@/components/HardwareChassis";
import { ChainBlock } from "@/lib/types";
import { downloadPrst } from "@/lib/exportPreset";

interface PresetData {
  id: string;
  preset_name: string;
  fidelity_score: number;
  fidelity_breakdown: {
    blocks: { block_role: string; canonical_model: string; device_model: string; mapping_type: string; block_score: number; max_score: number }[];
    missing_penalty: number;
    confidence_bonus: number;
    raw_total: number;
    normalized_score: number;
    source_summary: { source_id: string; source_type: string; title: string; claims_used: number; avg_confidence: number }[];
  } | null;
  generation_status: string;
  generated_chain_json: ChainBlock[];
  parameter_sheet_json: {
    slot: number;
    block_role: string;
    model: string;
    canonical_reference: string;
    params: Record<string, unknown>;
    mapping_confidence: number;
  }[];
  validation_notes: string | null;
  tone_profiles: {
    id: string;
    name: string;
    section_type: string;
    songs: {
      title: string;
      artists: { name: string };
    };
  };
  devices: { device_name: string };
  output_contexts: { name: string };
}

const STATUS_ICONS: Record<string, string> = {
  complete: "✓",
  running: "◎",
  error: "✗",
  skipped: "–",
};

const CATEGORY_COLORS: Record<string, string> = {
  amp: "#e08b26",
  cab: "#968a7c",
  overdrive: "#b84729",
  distortion: "#c0392b",
  fuzz: "#8e44ad",
  compressor: "#2980b9",
  eq: "#27ae60",
  modulation: "#16a085",
  delay: "#2471a3",
  reverb: "#1a5276",
  boost: "#d4ac0d",
  gate: "#717d7e",
  utility: "#5d6d7e",
  wah: "#a04000",
};

function confidenceColor(v: number): string {
  if (v >= 0.9) return "#22c55e";
  if (v >= 0.75) return "#e08b26";
  if (v >= 0.5) return "#f59e0b";
  return "#b84729";
}

function fidelityColor(score: number): string {
  if (score >= 85) return "#22c55e";
  if (score >= 70) return "#e08b26";
  if (score >= 50) return "#f59e0b";
  return "#b84729";
}

function FidelityRing({ score }: { score: number }) {
  const color = fidelityColor(score);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={radius} stroke="#221d19" strokeWidth="8" fill="none" />
        <circle
          cx="44" cy="44" r={radius}
          stroke={color} strokeWidth="8" fill="none"
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 44 44)"
          style={{ transition: "stroke-dasharray 0.5s ease" }}
        />
        <text x="44" y="44" textAnchor="middle" dominantBaseline="central"
          style={{ fill: color, fontSize: 18, fontWeight: 900, fontFamily: "'Courier New', monospace" }}>
          {score}
        </text>
      </svg>
      <div className="text-[9px] font-black uppercase tracking-[0.12em]" style={{ color: "#968a7c" }}>
        FIDELITY
      </div>
    </div>
  );
}

function MappingBadge({ type }: { type: string }) {
  const configs: Record<string, { label: string; bg: string; color: string }> = {
    exactish: { label: "EXACT", bg: "rgba(34,197,94,0.15)", color: "#22c55e" },
    close: { label: "CLOSE", bg: "rgba(224,139,38,0.15)", color: "#e08b26" },
    approximation: { label: "APPROX", bg: "rgba(245,158,11,0.15)", color: "#f59e0b" },
    fallback: { label: "FALLBACK", bg: "rgba(184,71,41,0.15)", color: "#b84729" },
  };
  const cfg = configs[type] || { label: type.toUpperCase(), bg: "rgba(150,138,124,0.15)", color: "#968a7c" };
  return (
    <span className="text-[9px] font-black uppercase px-2 py-0.5"
      style={{ background: cfg.bg, border: `1px solid ${cfg.color}33`, color: cfg.color }}>
      {cfg.label}
    </span>
  );
}

function CollapsibleLog({ logs }: { logs: { step_name: string; status: string; message: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-2 px-4 text-[10px] font-black uppercase tracking-[0.1em]"
        style={{ background: "#0f0d0b", border: "1px solid #221d19", color: "#968a7c" }}
      >
        <span>GENERATION LOG</span>
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      {open && (
        <div className="p-4 font-mono text-[11px] space-y-1.5 overflow-x-auto"
          style={{ background: "#0a0807", border: "1px solid #221d19", borderTop: "none" }}>
          {logs.map((log, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-3 text-center" style={{
                color: log.status === "complete" ? "#22c55e" : log.status === "error" ? "#b84729" : "#968a7c"
              }}>
                {STATUS_ICONS[log.status] || "·"}
              </span>
              <span className="flex-shrink-0 min-w-[150px]" style={{ color: "#968a7c" }}>{log.step_name}</span>
              <span style={{ color: "#e8dfce" }}>{log.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CollapsibleParams({ paramSheet }: { paramSheet: PresetData["parameter_sheet_json"] }) {
  const [open, setOpen] = useState(false);
  const rows = paramSheet.filter((r) => r.params && Object.keys(r.params).length > 0);
  if (rows.length === 0) return null;
  return (
    <div style={{ borderTop: "1px solid #221d19" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-2.5 px-4 text-[10px] font-black uppercase tracking-[0.1em]"
        style={{ background: "#14110f", color: "#968a7c" }}
      >
        <span>DETAILED PARAMETERS</span>
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      {open && (
        <div className="p-4 space-y-5" style={{ background: "#14110f" }}>
          {rows.map((row, i) => (
            <div key={i}>
              <div className="text-[10px] font-black uppercase mb-2.5" style={{ color: "#e08b26" }}>
                SLOT {row.slot} — {row.block_role}: {row.model}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
                {Object.entries(row.params).map(([key, val]) => (
                  <div key={key} className="px-3 py-2"
                    style={{ background: "#0f0d0b", border: "1px solid #221d19" }}>
                    <div className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "#968a7c" }}>{key}</div>
                    <div className="text-[12px] font-mono font-bold" style={{ color: "#e8dfce" }}>{String(val)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PresetPage() {
  const params = useParams();
  const id = params.id as string;
  const [preset, setPreset] = useState<PresetData | null>(null);
  const [logs, setLogs] = useState<{ step_name: string; status: string; message: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  async function handleDownloadPrst() {
    if (!preset) return;
    setDownloadLoading(true);
    setDownloadError(null);
    try {
      await downloadPrst(preset.id, preset.preset_name);
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setDownloadLoading(false);
    }
  }

  useEffect(() => {
    async function load() {
      const [presetRes, logsRes] = await Promise.all([
        supabase
          .from("generated_presets")
          .select(
            `
            id, preset_name, fidelity_score, fidelity_breakdown, generation_status,
            generated_chain_json, parameter_sheet_json, validation_notes,
            tone_profiles!inner(id, name, section_type,
              songs!inner(title, artists!inner(name))
            ),
            devices!inner(device_name),
            output_contexts!inner(name)
          `
          )
          .eq("id", id)
          .single(),
        supabase
          .from("preset_generation_logs")
          .select("step_name, status, message")
          .eq("generated_preset_id", id)
          .order("created_at"),
      ]);

      if (presetRes.data) setPreset(presetRes.data as unknown as PresetData);
      if (logsRes.data) setLogs(logsRes.data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <HardwareChassis displayLabel="SYSTEM //" title="LOADING...">
        <div className="hw-screen flex items-center justify-center p-16">
          <div className="text-[13px] font-black uppercase tracking-[0.15em]" style={{ color: "#4a3e30" }}>
            LOADING PRESET...
          </div>
        </div>
      </HardwareChassis>
    );
  }

  if (!preset) {
    return (
      <HardwareChassis displayLabel="SYSTEM //" title="NOT FOUND">
        <div className="hw-screen flex flex-col items-center justify-center p-16 gap-4">
          <div className="text-[13px] font-black uppercase" style={{ color: "#4a3e30" }}>PRESET NOT FOUND</div>
          <Link href="/" className="text-[10px] font-black uppercase tracking-[0.1em] hover:opacity-70"
            style={{ color: "#e08b26" }}>← BACK TO CATALOG</Link>
        </div>
      </HardwareChassis>
    );
  }

  const chain = preset.generated_chain_json || [];
  const paramSheet = preset.parameter_sheet_json || [];
  const tp = preset.tone_profiles;
  const warnings = preset.validation_notes?.split("; ").filter(Boolean) || [];

  return (
    <HardwareChassis
      fullWidth
      displayLabel="PRESET //"
      title={tp.songs.artists.name}
      displayLabel2={tp.songs.title}
      subtitle={tp.name}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "#968a7c" }}>
        <Link href="/" className="hover:opacity-70" style={{ color: "#968a7c" }}>CATALOG</Link>
        <span>//</span>
        <Link href={`/tone/${tp.id}`} className="hover:opacity-70" style={{ color: "#968a7c" }}>
          {tp.songs.artists.name} — {tp.songs.title}
        </Link>
        <span>//</span>
        <span style={{ color: "#e08b26" }}>PRESET</span>
      </div>

      {/* Hero section */}
      <div className="hw-rack p-5">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <FidelityRing score={preset.fidelity_score} />
          <div className="flex-1 min-w-0 text-center md:text-left">
            <h1 className="text-xl font-black uppercase mb-1" style={{ color: "#e8dfce", textShadow: "2px 2px 0 rgba(0,0,0,0.9)" }}>
              {preset.preset_name}
            </h1>
            <div className="text-[11px] font-bold mb-3" style={{ color: "#968a7c" }}>
              {tp.songs.artists.name} —{" "}
              <span style={{ color: "#e8dfce" }}>{tp.songs.title}</span>
              <span className="ml-2" style={{ color: "#e08b26" }}>{tp.name}</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="text-[10px] font-black uppercase px-3 py-1"
                style={{ background: "#241e1a", border: "1px solid #111", color: "#968a7c" }}>
                {preset.devices.device_name}
              </span>
              <span className="text-[10px] font-black uppercase px-3 py-1"
                style={{ background: "#241e1a", border: "1px solid #111", color: "#968a7c" }}>
                {preset.output_contexts.name}
              </span>
              <span className="text-[10px] font-black uppercase px-3 py-1"
                style={{
                  background: preset.generation_status === "complete" ? "rgba(34,197,94,0.15)" : "#241e1a",
                  border: preset.generation_status === "complete" ? "1px solid rgba(34,197,94,0.3)" : "1px solid #111",
                  color: preset.generation_status === "complete" ? "#22c55e" : "#968a7c",
                }}>
                {preset.generation_status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fidelity Breakdown */}
      {preset.fidelity_breakdown && (
        <div>
          <div className="hw-label mb-2">FIDELITY ANALYSIS</div>
          <div className="hw-rack p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr style={{ borderBottom: "1px solid #221d19" }}>
                    {["BLOCK", "CANONICAL", "DEVICE MODEL", "MAPPING", "SCORE"].map((h) => (
                      <th key={h} className="text-left py-2 px-3 font-black uppercase tracking-wider" style={{ color: "#968a7c" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preset.fidelity_breakdown.blocks.map((b, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #1a1410" }}>
                      <td className="py-2 px-3 font-bold uppercase" style={{ color: "#e08b26" }}>{b.block_role}</td>
                      <td className="py-2 px-3 font-mono" style={{ color: "#e8dfce" }}>{b.canonical_model}</td>
                      <td className="py-2 px-3 font-mono" style={{ color: "#968a7c" }}>{b.device_model}</td>
                      <td className="py-2 px-3"><MappingBadge type={b.mapping_type} /></td>
                      <td className="py-2 px-3 font-mono font-bold" style={{
                        color: b.block_score >= b.max_score * 0.8 ? "#22c55e" : b.block_score >= b.max_score * 0.5 ? "#e08b26" : "#b84729"
                      }}>
                        {b.block_score}/{b.max_score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap gap-4 mt-4 pt-3" style={{ borderTop: "1px solid #221d19" }}>
              {preset.fidelity_breakdown.missing_penalty < 0 && (
                <div className="text-[10px] font-bold uppercase" style={{ color: "#b84729" }}>
                  MISSING PENALTY: {preset.fidelity_breakdown.missing_penalty}
                </div>
              )}
              {preset.fidelity_breakdown.confidence_bonus > 0 && (
                <div className="text-[10px] font-bold uppercase" style={{ color: "#22c55e" }}>
                  CONFIDENCE BONUS: +{preset.fidelity_breakdown.confidence_bonus}
                </div>
              )}
              <div className="text-[10px] font-bold uppercase" style={{ color: "#968a7c" }}>
                RAW TOTAL: {preset.fidelity_breakdown.raw_total}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signal Chain */}
      {chain.length > 0 && (
        <div>
          <div className="hw-label mb-2">SIGNAL CHAIN</div>
          <div className="hw-rack p-4">
            <div className="flex items-center gap-2 flex-wrap">
              {chain.map((block, i) => {
                const roleKey = block.block_role?.toLowerCase().split(" ")[0] || "";
                const color = CATEGORY_COLORS[roleKey] || "#968a7c";
                return (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-14 h-12 flex items-center justify-center text-center"
                        style={{
                          background: `${color}22`,
                          border: `2px solid ${color}`,
                          boxShadow: `0 0 8px ${color}33`,
                        }}>
                        <div>
                          <div className="text-[8px] font-black uppercase" style={{ color }}>{block.block_role || "FX"}</div>
                          <div className="text-[9px] font-bold" style={{ color: "#e8dfce" }}>{block.model?.slice(0, 8) || "—"}</div>
                        </div>
                      </div>
                    </div>
                    {i < chain.length - 1 && (
                      <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                        <path d="M0 6 L20 6" stroke="#968a7c" strokeWidth="1.5" strokeDasharray="3 2" />
                        <polygon points="16,3 20,6 16,9" fill="#968a7c" />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Parameter Sheet */}
      {paramSheet.length > 0 && (
        <div>
          <div className="hw-label mb-2">PARAMETER SHEET</div>
          <div style={{ border: "1px solid #221d19" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr style={{ borderBottom: "2px solid #221d19", background: "#14110f" }}>
                    {["SLOT", "ROLE", "AMPERO MODEL", "BASED ON", "CONFIDENCE"].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 text-[9px] font-black uppercase tracking-wider" style={{ color: "#968a7c" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paramSheet.map((row, i) => (
                    <tr key={i} style={{
                      borderBottom: "1px solid #1a1410",
                      background: i % 2 === 1 ? "rgba(255,255,255,0.02)" : "transparent"
                    }}>
                      <td className="px-4 py-2.5 font-mono text-[11px]" style={{ color: "#968a7c" }}>{row.slot}</td>
                      <td className="px-4 py-2.5 font-bold uppercase text-[10px]" style={{ color: "#e08b26" }}>{row.block_role}</td>
                      <td className="px-4 py-2.5 font-bold" style={{ color: "#e8dfce" }}>{row.model}</td>
                      <td className="px-4 py-2.5 text-[10px]" style={{ color: "#968a7c" }}>{row.canonical_reference}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 rounded-full flex-1 max-w-[60px]" style={{ background: "#221d19" }}>
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.round(row.mapping_confidence * 100)}%`,
                                background: confidenceColor(row.mapping_confidence),
                              }}
                            />
                          </div>
                          <span className="text-[11px] font-mono font-bold" style={{ color: confidenceColor(row.mapping_confidence) }}>
                            {Math.round(row.mapping_confidence * 100)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CollapsibleParams paramSheet={paramSheet} />
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div>
          <div className="hw-label mb-2">WARNINGS</div>
          <div className="p-4 space-y-2"
            style={{ background: "rgba(184,71,41,0.08)", border: "1px solid rgba(184,71,41,0.3)" }}>
            {warnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" style={{ color: "#f59e0b" }} />
                <span className="text-[12px] font-bold" style={{ color: "#f59e0b" }}>{w}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generation Log */}
      {logs.length > 0 && <CollapsibleLog logs={logs} />}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <button
          onClick={handleDownloadPrst}
          disabled={downloadLoading}
          className="flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.1em] px-8 py-3"
          style={{
            background: downloadLoading ? "#2e130d" : "#b84729",
            color: downloadLoading ? "#968a7c" : "#fff",
            border: "2px solid #111",
            boxShadow: "0 3px 0 #000, inset 0 2px 0 rgba(255,255,255,0.2)",
            cursor: downloadLoading ? "not-allowed" : "pointer",
          }}
        >
          <Download size={14} />
          {downloadLoading ? "EXPORTING..." : "DOWNLOAD .PRST"}
        </button>

        <Link href={`/generate/${tp.id}`}>
          <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.08em] px-6 py-3 hw-mode-btn"
            style={{ padding: "12px 24px", width: "auto" }}>
            <RefreshCw size={12} />
            GENERATE WITH DIFFERENT SETTINGS
          </button>
        </Link>

        <Link href="/">
          <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.08em] hw-mode-btn"
            style={{ padding: "12px 24px", width: "auto" }}>
            <ArrowLeft size={12} />
            BACK TO CATALOG
          </button>
        </Link>
      </div>

      {downloadError && (
        <div className="text-center text-[11px] font-bold uppercase" style={{ color: "#b84729" }}>
          {downloadError}
        </div>
      )}
    </HardwareChassis>
  );
}
