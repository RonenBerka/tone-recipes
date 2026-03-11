"use client";

import { CircularGauge } from "@/components/ui/CircularGauge";

interface FidelityBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { size: 72, strokeWidth: 5 },
  md: { size: 120, strokeWidth: 8 },
  lg: { size: 160, strokeWidth: 10 },
};

function getFidelityLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Very Good";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  return "Low";
}

export function FidelityBadge({ score, size = "md" }: FidelityBadgeProps) {
  const dims = SIZES[size];
  const label = `${getFidelityLabel(score)} Fidelity`;

  return (
    <div className="inline-flex items-center gap-3">
      <div className="relative">
        <CircularGauge
          score={score}
          size={dims.size}
          strokeWidth={dims.strokeWidth}
          label={getFidelityLabel(score)}
        />
      </div>
      {size !== "sm" && (
        <span
          className="text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
