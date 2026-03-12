"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Download, RefreshCw, ArrowLeft, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SignalChainDiagram } from "@/components/SignalChainDiagram";
import { FidelityBadge } from "@/components/FidelityBadge";
import { ScoreBreakdownCard } from "@/components/ScoreBreakdownCard";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  complete: "\u2713",
  running: "\u25CE",
  error: "\u2717",
  skipped: "\u2013",
};
const STATUS_COLORS: Record<string, string> = {
  complete: "text-green-500",
  running: "text-primary",
  error: "text-red-500",
  skipped: "text-muted-foreground",
};

function confidenceColor(v: number): string {
  if (v >= 0.9) return "text-green-500";
  if (v >= 0.75) return "text-primary";
  if (v >= 0.5) return "text-amber-500";
  return "text-red-500";
}

function confidenceBgColor(v: number): string {
  if (v >= 0.9) return "bg-green-500";
  if (v >= 0.75) return "bg-primary";
  if (v >= 0.5) return "bg-amber-500";
  return "bg-red-500";
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
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg">Preset not found.</p>
        <Link href="/" className="mt-4 inline-block text-sm text-primary transition-colors hover:text-primary/80">
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
      <div className="text-sm mb-6 animate-fade-up text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          Library
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/tone/${tp.id}`} className="transition-colors hover:text-foreground">
          {tp.songs.artists.name} — {tp.songs.title}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-secondary-foreground">Preset</span>
      </div>

      {/* Hero: Fidelity + Preset Info */}
      <Card className="mb-8 animate-fade-up [animation-delay:40ms]">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <FidelityBadge score={preset.fidelity_score} size="lg" />
            </div>
            <div className="flex-1 text-center md:text-left min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1.5 text-foreground">
                {preset.preset_name}
              </h1>
              <p className="text-sm mb-3 text-secondary-foreground">
                {tp.songs.artists.name} —{" "}
                <span className="text-foreground">{tp.songs.title}</span>
                <span className="ml-2 font-medium text-primary">{tp.name}</span>
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                <Badge variant="secondary">{preset.devices.device_name}</Badge>
                <Badge variant="secondary">{preset.output_contexts.name}</Badge>
                <Badge
                  variant="secondary"
                  className={
                    preset.generation_status === "complete"
                      ? "capitalize bg-green-500/10 border-green-500/15 text-green-500"
                      : "capitalize"
                  }
                >
                  {preset.generation_status}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      {preset.fidelity_breakdown && (
        <div className="mb-8 animate-fade-up [animation-delay:60ms]">
          <SectionHeading>Fidelity Analysis</SectionHeading>
          <Card>
            <CardContent className="p-0">
              <ScoreBreakdownCard breakdown={preset.fidelity_breakdown} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Signal Chain */}
      <div className="mb-8 animate-fade-up [animation-delay:80ms]">
        <SectionHeading>Signal Chain</SectionHeading>
        <SignalChainDiagram chain={chain} />
      </div>

      {/* Parameter Sheet */}
      <div className="mb-8 animate-fade-up [animation-delay:100ms]">
        <SectionHeading>Parameter Sheet</SectionHeading>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Slot</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Role</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Ampero Model</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Based On</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {paramSheet.map((row, i) => (
                    <tr
                      key={i}
                      className={`border-b border-border last:border-0 ${i % 2 === 1 ? "bg-muted/15" : ""}`}
                    >
                      <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                        {row.slot}
                      </td>
                      <td className="px-4 py-2.5 capitalize text-xs font-medium text-secondary-foreground">
                        {row.block_role}
                      </td>
                      <td className="px-4 py-2.5 font-medium text-foreground">
                        {row.model}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">
                        {row.canonical_reference}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 rounded-full flex-1 max-w-[80px] bg-muted">
                            <div
                              className={`h-full rounded-full transition-all ${confidenceBgColor(row.mapping_confidence)}`}
                              style={{
                                width: `${Math.round(row.mapping_confidence * 100)}%`,
                              }}
                            />
                          </div>
                          <span
                            className={`text-xs font-medium font-mono ${confidenceColor(row.mapping_confidence)}`}
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
              <div className="px-4 py-3 border-t border-border">
                <CollapsibleSection title="Detailed Parameters">
                  <div className="space-y-4 pt-3">
                    {paramSheet
                      .filter((r) => r.params && Object.keys(r.params).length > 0)
                      .map((row, i) => (
                        <div key={i}>
                          <div className="text-xs font-semibold mb-2 capitalize text-primary">
                            Slot {row.slot} — {row.block_role}: {row.model}
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
                            {Object.entries(row.params).map(([key, val]) => (
                              <div
                                key={key}
                                className="px-3 py-2 rounded-lg bg-background border border-border"
                              >
                                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-0.5">{key}</div>
                                <div className="text-sm font-mono font-medium text-foreground">
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
          </CardContent>
        </Card>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="mb-8 animate-fade-up [animation-delay:120ms]">
          <SectionHeading>Warnings</SectionHeading>
          <Card className="border-amber-500/15">
            <CardContent className="p-4">
              <div className="space-y-2">
                {warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <AlertTriangle className="size-4 flex-shrink-0 mt-0.5 text-amber-500" />
                    <span className="text-sm text-amber-300">{w}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Generation Log */}
      {logs.length > 0 && (
        <div className="mb-8 animate-fade-up [animation-delay:140ms]">
          <CollapsibleSection title="Generation Log">
            <div className="mt-3 rounded-lg p-4 font-mono text-xs space-y-1.5 overflow-x-auto bg-background border border-border">
              {logs.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className={`flex-shrink-0 w-4 text-center ${STATUS_COLORS[log.status] || "text-muted-foreground"}`}>
                    {STATUS_ICONS[log.status] || "\u00B7"}
                  </span>
                  <span className="flex-shrink-0 min-w-[140px] text-muted-foreground">
                    {log.step_name}
                  </span>
                  <span className="text-secondary-foreground">{log.message}</span>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center mt-10 animate-fade-up [animation-delay:160ms]">
        <Button onClick={handleDownloadPrst} disabled={downloadLoading} size="lg">
          <Download className="size-4" />
          {downloadLoading ? "Exporting..." : "Download .prst"}
        </Button>
        <Link href={`/generate/${tp.id}`}>
          <Button variant="outline" size="lg">
            <RefreshCw className="size-4" />
            Generate with Different Settings
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" size="lg">
            <ArrowLeft className="size-4" />
            Back to Library
          </Button>
        </Link>
      </div>
      {downloadError && (
        <p className="text-center mt-2 text-sm text-destructive">{downloadError}</p>
      )}
    </div>
  );
}
