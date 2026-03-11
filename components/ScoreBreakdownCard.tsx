"use client";

import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import type { FidelityBreakdown } from "@/lib/types";

const MAPPING_COLORS: Record<string, string> = {
  exactish: "#22c55e",
  close: "var(--accent-gold)",
  approximation: "#f59e0b",
  fallback: "#ef4444",
};

const SOURCE_ICONS: Record<string, { label: string; icon: string }> = {
  rig_rundown: { label: "Rig Rundown", icon: "🎬" },
  artist_interview: { label: "Interview", icon: "🎤" },
  manufacturer_doc: { label: "Manufacturer", icon: "📋" },
  equipboard: { label: "Equipboard", icon: "🎸" },
  forum: { label: "Forum", icon: "💬" },
  youtube_analysis: { label: "YouTube", icon: "📺" },
  preset_library: { label: "Preset Library", icon: "📚" },
  manual_research: { label: "Research", icon: "🔍" },
};

export function ScoreBreakdownCard({
  breakdown,
}: {
  breakdown: FidelityBreakdown;
}) {
  const { blocks, missing_penalty, confidence_bonus, normalized_score, source_summary } = breakdown;

  const totalBlockScore = blocks.reduce((s, b) => s + b.block_score, 0);
  const maxBlockScore = blocks.reduce((s, b) => s + b.max_score, 0);

  return (
    <CollapsibleSection title="Score Breakdown" defaultOpen={false}>
      <div className="space-y-6 pt-3">
        {/* Score math overview */}
        <div
          className="rounded-lg p-4"
          style={{ background: "var(--bg-deep)", border: "1px solid var(--glass-border)" }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div>
              <div
                className="text-[10px] uppercase tracking-wider font-medium mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                Block Score
              </div>
              <div className="text-lg font-bold font-mono" style={{ color: "var(--text-primary)" }}>
                {totalBlockScore}
                <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>
                  /{maxBlockScore}
                </span>
              </div>
            </div>
            <div>
              <div
                className="text-[10px] uppercase tracking-wider font-medium mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                Missing Penalty
              </div>
              <div
                className="text-lg font-bold font-mono"
                style={{ color: missing_penalty > 0 ? "#ef4444" : "var(--text-muted)" }}
              >
                {missing_penalty > 0 ? `-${missing_penalty}` : "0"}
              </div>
            </div>
            <div>
              <div
                className="text-[10px] uppercase tracking-wider font-medium mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                Confidence Bonus
              </div>
              <div className="text-lg font-bold font-mono" style={{ color: "#22c55e" }}>
                +{confidence_bonus}
              </div>
            </div>
            <div>
              <div
                className="text-[10px] uppercase tracking-wider font-medium mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                Final Score
              </div>
              <div className="text-lg font-bold font-mono" style={{ color: "var(--accent-gold)" }}>
                {Math.min(100, normalized_score + confidence_bonus)}
              </div>
            </div>
          </div>
        </div>

        {/* Per-block scores */}
        <div>
          <div
            className="text-[10px] uppercase tracking-wider font-semibold mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            Per-Block Mapping Quality
          </div>
          <div className="space-y-2">
            {blocks.map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2 rounded"
                style={{ background: "var(--bg-deep)", border: "1px solid var(--glass-border)" }}
              >
                <span
                  className="text-xs capitalize font-medium w-20 flex-shrink-0"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {b.block_role}
                </span>
                <span
                  className="text-xs flex-1 min-w-0 truncate"
                  style={{ color: "var(--text-muted)" }}
                >
                  {b.canonical_model} → {b.device_model}
                </span>
                <span
                  className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    color: MAPPING_COLORS[b.mapping_type] || "var(--text-muted)",
                    background: `color-mix(in srgb, ${MAPPING_COLORS[b.mapping_type] || "var(--text-muted)"} 12%, transparent)`,
                  }}
                >
                  {b.mapping_type}
                </span>
                <span
                  className="text-xs font-mono font-medium w-10 text-right flex-shrink-0"
                  style={{ color: MAPPING_COLORS[b.mapping_type] || "var(--text-muted)" }}
                >
                  {b.block_score}/{b.max_score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sources */}
        {source_summary && source_summary.length > 0 && (
          <div>
            <div
              className="text-[10px] uppercase tracking-wider font-semibold mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              Information Sources
            </div>
            <div className="space-y-2">
              {source_summary.map((src) => {
                const info = SOURCE_ICONS[src.source_type] || { label: src.source_type, icon: "📄" };
                return (
                  <div
                    key={src.source_id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded"
                    style={{ background: "var(--bg-deep)", border: "1px solid var(--glass-border)" }}
                  >
                    <span className="text-base flex-shrink-0">{info.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-medium truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {src.title}
                      </div>
                      <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                        {info.label} · {src.claims_used} claim{src.claims_used !== 1 ? "s" : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div
                        className="h-1.5 rounded-full w-16"
                        style={{ background: "var(--bg-elevated)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.round(src.avg_confidence * 100)}%`,
                            background: src.avg_confidence >= 0.8 ? "var(--accent-gold)" : "#f59e0b",
                          }}
                        />
                      </div>
                      <span
                        className="text-[10px] font-mono font-medium"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {Math.round(src.avg_confidence * 100)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {source_summary.length === 0 && (
          <div
            className="text-xs text-center py-4"
            style={{ color: "var(--text-muted)" }}
          >
            No detailed source data available for this profile.
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
}
