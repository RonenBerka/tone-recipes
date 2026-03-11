"use client";

import { TonalBias } from "@/lib/types";

interface TonalBiasPreviewProps {
  bias: TonalBias;
  guitarName: string;
}

const BIAS_FIELDS: { key: keyof TonalBias; label: string }[] = [
  { key: "attack", label: "Attack" },
  { key: "brightness", label: "Brightness" },
  { key: "low_mids", label: "Low Mids" },
  { key: "compression", label: "Compression" },
];

function getCompensationHint(bias: TonalBias): string {
  const traits: string[] = [];
  if (bias.brightness >= 0.7) traits.push("bright");
  else if (bias.brightness <= 0.3) traits.push("warm");
  if (bias.attack >= 0.7) traits.push("snappy");
  else if (bias.attack <= 0.3) traits.push("smooth");
  if (bias.low_mids >= 0.7) traits.push("thick");
  else if (bias.low_mids <= 0.3) traits.push("lean");

  if (traits.length === 0) return "Balanced tonality — minimal preset compensation needed.";
  const traitStr = traits.join(", ");
  return `${traitStr.charAt(0).toUpperCase() + traitStr.slice(1)} guitar — preset will compensate accordingly.`;
}

function getBarColor(value: number): string {
  if (value >= 0.7) return "var(--accent-gold)";
  if (value >= 0.4) return "var(--text-secondary)";
  return "var(--text-muted)";
}

export function TonalBiasPreview({ bias, guitarName }: TonalBiasPreviewProps) {
  return (
    <div
      className="rounded-lg p-4 mt-4"
      style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[10px] uppercase tracking-wider font-semibold"
          style={{ color: "var(--text-muted)" }}
        >
          Tonal Profile — {guitarName}
        </span>
      </div>
      <div className="space-y-2.5">
        {BIAS_FIELDS.map(({ key, label }) => {
          const value = bias[key];
          return (
            <div key={key} className="flex items-center gap-3">
              <span
                className="text-xs w-20 flex-shrink-0 text-right"
                style={{ color: "var(--text-secondary)" }}
              >
                {label}
              </span>
              <div
                className="flex-1 h-1.5 rounded-full overflow-hidden"
                style={{ background: "var(--bg-elevated)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.round(value * 100)}%`,
                    background: getBarColor(value),
                  }}
                />
              </div>
              <span
                className="text-[10px] font-mono w-8 text-right flex-shrink-0"
                style={{ color: "var(--text-muted)" }}
              >
                {Math.round(value * 100)}
              </span>
            </div>
          );
        })}
      </div>
      <p
        className="text-xs mt-3 italic"
        style={{ color: "var(--text-muted)" }}
      >
        {getCompensationHint(bias)}
      </p>
    </div>
  );
}
