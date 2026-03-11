"use client";

interface CircularGaugeProps {
  score: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
}

function getColor(score: number): string {
  if (score >= 85) return "#22c55e"; // green
  if (score >= 70) return "var(--accent-gold)";
  if (score >= 50) return "#f59e0b"; // amber
  return "#ef4444"; // red
}

function getLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Very Good";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  return "Low";
}

export function CircularGauge({
  score,
  size = 120,
  strokeWidth = 8,
  label,
}: CircularGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score, 0), 100);
  const offset = circumference - (progress / 100) * circumference;
  const color = getColor(score);
  const qualityLabel = label || getLabel(score);

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--bg-elevated)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.3s ease" }}
        />
      </svg>
      {/* Center score */}
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span
          className="font-bold"
          style={{ fontSize: size * 0.28, color, lineHeight: 1 }}
        >
          {Math.round(score)}
        </span>
        <span
          className="text-[10px] uppercase tracking-wider font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          {qualityLabel}
        </span>
      </div>
    </div>
  );
}
