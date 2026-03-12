"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { SignalChainDiagram } from "@/components/SignalChainDiagram";
import { FidelityBadge } from "@/components/FidelityBadge";
import { ScoreBreakdownCard } from "@/components/ScoreBreakdownCard";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GoldButton } from "@/components/ui/GoldButton";
import { Skeleton } from "@/components/ui/Skeleton";
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
const STATUS_COLORS: Record<string, string> = {
  complete: "#22c55e",
  running: "var(--accent-gold)",
  error: "#ef4444",
  skipped: "var(--text-muted)",
};

function confidenceColor(v: number): string {
  if (v >= 0.9) return "#22c55e";
  if (v >= 0.75) return "var(--accent-gold)";
  if (v >= 0.5) return "#f59e0b";
  return "#ef4444";
}

export default function PresetPage() {
  const params = useParams();
  const id = params.id as string;
  const [preset, setPreset] = useState<PresetData | null>(null);
  const [logs, setLogs] = useState<
    { step_name: string; status: string; message: string }[]
  >([]);
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
      <div className="space-y-6 pt-4">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-24 w-24 rounded-full" />
        </div>
        <Skeleton className="h-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!preset) {
    return (
      <div className="text-center py-16 text-[var(--text-muted)]">
        <p className="text-lg">Preset not found.</p>
        <Link href="/" className="mt-4 inline-block text-sm text-[var(--accent-gold)] transition-colors">
          Back to Library
        </Link>
      </div>
    );
  }

  const chain = preset.generated_chain_json || [];
  const paramSheet = preset.parameter_sheet_json || [];
  const tp = preset.tone_profiles;
  const warnings = preset.validation_notes?.split("; ").filter(Boolean) || [];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-sm mb-6 animate-fade-up text-[var(--text-muted)]">
        <Link href="/" className="transition-colors hover:text-[var(--text-primary)]">
          Library
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/tone/${tp.id}`} className="transition-colors hover:text-[var(--text-primary)]">
          {tp.songs.artists.name} — {tp.songs.title}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--text-secondary)]">Preset</span>
      </div>

      {/* Hero: Fidelity + Preset Info */}
      <div className="glass-static p-6 md:p-8 mb-8 animate-fade-up" style={{ animationDelay: "40ms" }}>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <FidelityBadge score={preset.fidelity_score} size="lg" />
          </div>
          <div className="flex-1 text-center md:text-left min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1.5 text-[var(--text-primary)]">
              {preset.preset_name}
            </h1>
            <p className="text-sm mb-3 text-[var(--text-secondary)]">
              {tp.songs.artists.name} —{" "}
              <span className="text-[var(--text-primary)]">{tp.songs.title}</span>
              <span className="ml-2 font-medium text-[var(--accent-gold)]">{tp.name}</span>
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
              <span className="chip">{preset.devices.device_name}</span>
              <span className="chip">{preset.output_contexts.name}</span>
              <span
                className="chip capitalize"
                style={
                  preset.generation_status === "complete"
                    ? { background: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.15)", color: "#22c55e" }
                    : {}
                }
              >
                {preset.generation_status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      {preset.fidelity_breakdown && (
        <div className="mb-8 animate-fade-up" style={{ animationDelay: "60ms" }}>
          <SectionHeading>Fidelity Analysis</SectionHeading>
          <div className="glass-static">
            <ScoreBreakdownCard breakdown={preset.fidelity_breakdown} />
          </div>
        </div>
      )}

      {/* Signal Chain */}
      <div className="mb-8 animate-fade-up" style={{ animationDelay: "80ms" }}>
        <SectionHeading>Signal Chain</SectionHeading>
        <SignalChainDiagram chain={chain} />
      </div>

      {/* Parameter Sheet */}
      <div className="mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
        <SectionHeading>Parameter Sheet</SectionHeading>
        <div className="glass-static overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[rgba(255,255,255,0.02)]">
                  <th className="text-left px-4 py-2.5 label">Slot</th>
                  <th className="text-left px-4 py-2.5 label">Role</th>
                  <th className="text-left px-4 py-2.5 label">Ampero Model</th>
                  <th className="text-left px-4 py-2.5 label">Based On</th>
                  <th className="text-left px-4 py-2.5 label">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {paramSheet.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-[var(--border)] last:border-0 ${i % 2 === 1 ? "bg-[rgba(255,255,255,0.015)]" : ""}`}
                  >
                    <td className="px-4 py-2.5 font-mono text-xs text-[var(--text-muted)]">
                      {row.slot}
                    </td>
                    <td className="px-4 py-2.5 capitalize text-xs font-medium text-[var(--text-secondary)]">
                      {row.block_role}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-[var(--text-primary)]">
                      {row.model}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-[var(--text-muted)]">
                      {row.canonical_reference}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 rounded-full flex-1 max-w-[80px] bg-[var(--bg-elevated)]">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.round(row.mapping_confidence * 100)}%`,
                              background: confidenceColor(row.mapping_confidence),
                            }}
                          />
                        </div>
                        <span
                          className="text-xs font-medium font-mono"
                          style={{ color: confidenceColor(row.mapping_confidence) }}
                        >
                          {Math.round(row.mapping_confidence * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expanded params */}
          {paramSheet.some((r) => r.params && Object.keys(r.params).length > 0) && (
            <div className="px-4 py-3 border-t border-[var(--border)]">
              <CollapsibleSection title="Detailed Parameters">
                <div className="space-y-4 pt-3">
                  {paramSheet
                    .filter((r) => r.params && Object.keys(r.params).length > 0)
                    .map((row, i) => (
                      <div key={i}>
                        <div className="text-xs font-semibold mb-2 capitalize text-[var(--accent-gold)]">
                          Slot {row.slot} — {row.block_role}: {row.model}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
                          {Object.entries(row.params).map(([key, val]) => (
                            <div
                              key={key}
                              className="px-3 py-2 rounded-lg bg-[var(--bg-deep)] border border-[var(--border)]"
                            >
                              <div className="label mb-0.5">{key}</div>
                              <div className="text-sm font-mono font-medium text-[var(--text-primary)]">
                                {String(val)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </CollapsibleSection>
            </div>
          )}
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="mb-8 animate-fade-up" style={{ animationDelay: "120ms" }}>
          <SectionHeading>Warnings</SectionHeading>
          <div className="glass-static p-4 border-[rgba(245,158,11,0.15)]">
            <div className="space-y-2">
              {warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5 text-[#f59e0b]">
                    <path
                      d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-sm text-[#fbbf24]">{w}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Generation Log */}
      {logs.length > 0 && (
        <div className="mb-8 animate-fade-up" style={{ animationDelay: "140ms" }}>
          <CollapsibleSection title="Generation Log">
            <div className="mt-3 rounded-lg p-4 font-mono text-xs space-y-1.5 overflow-x-auto bg-[var(--bg-deep)] border border-[var(--border)]">
              {logs.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-4 text-center" style={{ color: STATUS_COLORS[log.status] || "var(--text-muted)" }}>
                    {STATUS_ICONS[log.status] || "·"}
                  </span>
                  <span className="flex-shrink-0 min-w-[140px] text-[var(--text-muted)]">
                    {log.step_name}
                  </span>
                  <span className="text-[var(--text-secondary)]">{log.message}</span>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center mt-10 animate-fade-up" style={{ animationDelay: "160ms" }}>
        <GoldButton onClick={handleDownloadPrst} loading={downloadLoading}>
          Download .prst
        </GoldButton>
        <Link href={`/generate/${tp.id}`}>
          <GoldButton variant="ghost">
            Generate with Different Settings
          </GoldButton>
        </Link>
        <Link href="/" className="btn-ghost">
          Back to Library
        </Link>
      </div>
      {downloadError && (
        <p className="text-center mt-2 text-sm text-[#ef4444]">{downloadError}</p>
      )}
    </div>
  );
}
