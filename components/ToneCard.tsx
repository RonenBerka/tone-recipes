"use client";

import Link from "next/link";
import { ToneProfile } from "@/lib/types";

const GAIN_LABELS: Record<string, string> = {
  "0.3": "Clean",
  "0.5": "Crunch",
  "0.8": "High Gain",
};

const SECTION_COLORS: Record<string, string> = {
  rhythm: "#d97706",
  lead: "#dc2626",
  solo: "#9333ea",
  riff: "#eab308",
  intro: "#3b82f6",
  verse: "#22c55e",
  chorus: "#ec4899",
};

export function ToneCard({ profile }: { profile: ToneProfile }) {
  const sectionColor = SECTION_COLORS[profile.section_type] || "#64748b";
  const gainLabel = GAIN_LABELS[String(profile.gain_level)] || "Mid";
  const confidence = Math.round(profile.confidence_score * 100);

  return (
    <Link href={`/tone/${profile.id}`} className="block group">
      <div
        className="glass relative overflow-hidden p-5 transition-all duration-200 glow-gold-hover"
        style={{ borderLeft: `3px solid ${sectionColor}` }}
      >
        {/* Header row */}
        <div className="flex justify-between items-start mb-2">
          <div className="min-w-0 flex-1 mr-3">
            <h3
              className="font-bold text-base tracking-tight truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {profile.songs.artists.name}
            </h3>
            <p
              className="text-sm truncate mt-0.5"
              style={{ color: "var(--text-secondary)" }}
            >
              {profile.songs.title}
            </p>
          </div>
          {/* Research score */}
          <div className="flex-shrink-0 flex flex-col items-center gap-0.5" title="Research Score — how well-documented this tone is">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background:
                  confidence >= 85
                    ? "rgba(34,197,94,0.15)"
                    : confidence >= 70
                      ? "rgba(212,168,50,0.15)"
                      : "rgba(245,158,11,0.15)",
                color:
                  confidence >= 85
                    ? "#22c55e"
                    : confidence >= 70
                      ? "var(--accent-gold)"
                      : "#f59e0b",
                border: `1px solid ${
                  confidence >= 85
                    ? "rgba(34,197,94,0.25)"
                    : confidence >= 70
                      ? "rgba(212,168,50,0.25)"
                      : "rgba(245,158,11,0.25)"
                }`,
              }}
            >
              {confidence}
            </div>
            <span className="text-[7px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Research
            </span>
          </div>
        </div>

        {/* Profile name */}
        <p
          className="text-sm font-medium mb-3"
          style={{ color: "var(--accent-gold)" }}
        >
          {profile.name}
        </p>

        {/* Tags row */}
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: `${sectionColor}18`,
              border: `1px solid ${sectionColor}35`,
              color: sectionColor,
            }}
          >
            {profile.section_type}
          </span>
          <span
            className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              color: "var(--text-secondary)",
            }}
          >
            {gainLabel}
          </span>
        </div>

        {/* Confidence bar at bottom */}
        <div className="confidence-bar mt-4">
          <div
            className="confidence-bar-fill"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
