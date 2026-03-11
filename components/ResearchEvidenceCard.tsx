"use client";

import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { EvidenceSource, EvidenceClaim, EvidenceSummary } from "@/lib/types";

const SOURCE_TYPE_META: Record<string, { label: string; color: string }> = {
  rig_rundown: { label: "Rig Rundown", color: "#22c55e" },
  artist_interview: { label: "Interview", color: "#3b82f6" },
  manufacturer_doc: { label: "Manufacturer", color: "#8b5cf6" },
  equipboard: { label: "Equipboard", color: "var(--accent-gold)" },
  forum: { label: "Forum", color: "#64748b" },
  youtube_analysis: { label: "YouTube", color: "#ef4444" },
  preset_library: { label: "Preset Library", color: "#06b6d4" },
  manual_research: { label: "Research", color: "#f59e0b" },
};

const CLAIM_TYPE_COLORS: Record<string, string> = {
  documented: "#22c55e",
  community_consensus: "var(--accent-gold)",
  inferred: "#f59e0b",
  translated: "#64748b",
};

const RESEARCH_STATUS_META: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  verified: { label: "Verified", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  researched: { label: "Researched", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  partial: { label: "Partial Research", color: "var(--accent-gold)", bg: "rgba(212,168,50,0.12)" },
  unresearched: { label: "Unresearched", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
};

export function ResearchEvidenceCard({
  researchStatus,
  evidenceSummary,
  sources,
  claims,
}: {
  researchStatus: string;
  evidenceSummary: EvidenceSummary | null;
  sources: EvidenceSource[];
  claims: EvidenceClaim[];
}) {
  const status = RESEARCH_STATUS_META[researchStatus] || RESEARCH_STATUS_META.unresearched;

  // Deduplicate claims by predicate (keep highest confidence)
  const uniqueClaims = Object.values(
    claims.reduce<Record<string, EvidenceClaim>>((acc, c) => {
      if (!acc[c.predicate] || c.confidence_score > acc[c.predicate].confidence_score) {
        acc[c.predicate] = c;
      }
      return acc;
    }, {})
  ).sort((a, b) => b.confidence_score - a.confidence_score);

  return (
    <CollapsibleSection title="Research Evidence" defaultOpen={false}>
      <div className="space-y-5 pt-3">
        {/* Status + Summary */}
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full"
            style={{
              color: status.color,
              background: status.bg,
              border: `1px solid color-mix(in srgb, ${status.color} 25%, transparent)`,
            }}
          >
            {status.label}
          </span>
          {evidenceSummary && (
            <span
              className="text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              {evidenceSummary.claim_count} claims from{" "}
              {evidenceSummary.source_count} sources across{" "}
              {evidenceSummary.source_types} source types
            </span>
          )}
        </div>

        {/* Sources */}
        {sources.length > 0 && (
          <div>
            <div
              className="text-[10px] uppercase tracking-wider font-semibold mb-2.5"
              style={{ color: "var(--text-muted)" }}
            >
              Information Sources
            </div>
            <div className="space-y-1.5">
              {sources.map((src) => {
                const meta =
                  SOURCE_TYPE_META[src.source_type] || {
                    label: src.source_type,
                    color: "var(--text-muted)",
                  };
                const reliability = Math.round(src.base_reliability_score * 100);

                return (
                  <div
                    key={src.id}
                    className="flex items-center gap-3 px-3 py-2 rounded"
                    style={{
                      background: "var(--bg-deep)",
                      border: "1px solid var(--glass-border)",
                    }}
                  >
                    {/* Source type dot + label */}
                    <div className="flex items-center gap-2 w-28 flex-shrink-0">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: meta.color }}
                      />
                      <span
                        className="text-[10px] uppercase tracking-wider font-medium"
                        style={{ color: meta.color }}
                      >
                        {meta.label}
                      </span>
                    </div>
                    {/* Title */}
                    <span
                      className="text-xs flex-1 min-w-0 truncate"
                      style={{ color: "var(--text-primary)" }}
                      title={src.title}
                    >
                      {src.url ? (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {src.title}
                        </a>
                      ) : (
                        src.title
                      )}
                    </span>
                    {/* Reliability */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <div
                        className="h-1 rounded-full w-10"
                        style={{ background: "var(--bg-elevated)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${reliability}%`,
                            background:
                              reliability >= 90
                                ? "#22c55e"
                                : reliability >= 80
                                  ? "var(--accent-gold)"
                                  : "#f59e0b",
                          }}
                        />
                      </div>
                      <span
                        className="text-[10px] font-mono"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {reliability}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Claims / Gear Evidence */}
        {uniqueClaims.length > 0 && (
          <div>
            <div
              className="text-[10px] uppercase tracking-wider font-semibold mb-2.5"
              style={{ color: "var(--text-muted)" }}
            >
              Gear Evidence
            </div>
            <div className="space-y-1.5">
              {uniqueClaims.map((claim) => {
                const claimColor =
                  CLAIM_TYPE_COLORS[claim.claim_type] || "var(--text-muted)";
                const conf = Math.round(claim.confidence_score * 100);
                // Format predicate: "uses_amp" → "Amp"
                const gearLabel = claim.predicate
                  .replace("uses_", "")
                  .replace(/_/g, " ");

                return (
                  <div
                    key={claim.id}
                    className="flex items-center gap-3 px-3 py-2 rounded"
                    style={{
                      background: "var(--bg-deep)",
                      border: "1px solid var(--glass-border)",
                    }}
                  >
                    <span
                      className="text-[10px] uppercase tracking-wider font-semibold w-20 flex-shrink-0 capitalize"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {gearLabel}
                    </span>
                    <span
                      className="text-xs flex-1 min-w-0 truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {claim.object_text}
                    </span>
                    <span
                      className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        color: claimColor,
                        background: `color-mix(in srgb, ${claimColor} 12%, transparent)`,
                      }}
                    >
                      {claim.claim_type.replace("_", " ")}
                    </span>
                    <span
                      className="text-[10px] font-mono font-medium w-8 text-right flex-shrink-0"
                      style={{ color: claimColor }}
                    >
                      {conf}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {sources.length === 0 && claims.length === 0 && (
          <div
            className="text-xs text-center py-4"
            style={{ color: "var(--text-muted)" }}
          >
            No research evidence available for this profile yet.
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
}
