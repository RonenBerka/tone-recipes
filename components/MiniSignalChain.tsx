"use client";

const CATEGORY_COLORS: Record<string, string> = {
  amp: "#e85d3a",
  cab: "#8b6914",
  overdrive: "#d97706",
  distortion: "#dc2626",
  fuzz: "#9333ea",
  compressor: "#2563eb",
  eq: "#0891b2",
  modulation: "#059669",
  delay: "#6366f1",
  reverb: "#7c3aed",
  boost: "#eab308",
  gate: "#64748b",
  wah: "#ec4899",
  utility: "#64748b",
};

const MAX_DOTS = 10;

export function MiniSignalChain({ blocks }: { blocks: string[] }) {
  if (!blocks || blocks.length === 0) return null;

  const visible = blocks.slice(0, MAX_DOTS);
  const overflow = blocks.length - MAX_DOTS;

  return (
    <div className="flex items-center gap-[3px]">
      {visible.map((role, i) => (
        <div
          key={i}
          className="w-[6px] h-[6px] rounded-full shrink-0"
          style={{
            background: CATEGORY_COLORS[role] || "#64748b",
            opacity: 0.85,
          }}
          title={role}
        />
      ))}
      {overflow > 0 && (
        <span className="text-[8px] text-muted-foreground ml-0.5">
          +{overflow}
        </span>
      )}
    </div>
  );
}
