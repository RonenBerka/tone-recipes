"use client";

import Link from "next/link";
import { ToneProfile } from "@/lib/types";

const GAIN_LABELS: Record<string, string> = {
  "0.3": "Clean",
  "0.5": "Crunch",
  "0.8": "High Gain",
};

function scoreStyle(confidence: number) {
  if (confidence >= 85)
    return { bg: "rgba(34,197,94,0.10)", color: "#22c55e", border: "rgba(34,197,94,0.20)" };
  if (confidence >= 70)
    return { bg: "var(--accent-gold-muted)", color: "var(--accent-gold)", border: "rgba(212,168,50,0.20)" };
  return { bg: "rgba(245,158,11,0.10)", color: "#f59e0b", border: "rgba(245,158,11,0.20)" };
}

export function ToneCard({ profile }: { profile: ToneProfile }) {
  const gainLabel = GAIN_LABELS[String(profile.gain_level)] || "Mid";
  const confidence = Math.round(profile.confidence_score * 100);
  const s = scoreStyle(confidence);

  return (
    <Link href={`/tone/${profile.id}`} className="block group">
      <div className="glass relative overflow-hidden p-4 glow-gold-hover">
        {/* Header row */}
        <div className="flex justify-between items-start mb-1.5">
          <div className="min-w-0 flex-1 mr-3">
            <h3 className="font-semibold text-[15px] tracking-tight truncate text-[var(--text-primary)]">
              {profile.songs.artists.name}
            </h3>
            <p className="text-sm truncate mt-0.5 text-[var(--text-secondary)]">
              {profile.songs.title}
            </p>
          </div>
          {/* Research score */}
          <div className="flex-shrink-0 flex flex-col items-center gap-0.5" title="Research Score">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
            >
              {confidence}
            </div>
          </div>
        </div>

        {/* Profile name */}
        <p className="text-sm font-medium mb-3 text-[var(--accent-gold)]">
          {profile.name}
        </p>

        {/* Tags row */}
        <div className="flex items-center gap-1.5">
          <span className="chip text-[10px] capitalize">
            {profile.section_type}
          </span>
          <span className="chip text-[10px]">
            {gainLabel}
          </span>
        </div>

        {/* Confidence bar */}
        <div className="confidence-bar mt-3">
          <div
            className="confidence-bar-fill"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
