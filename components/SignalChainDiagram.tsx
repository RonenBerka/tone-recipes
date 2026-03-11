"use client";

import { useState } from "react";
import Image from "next/image";
import { ChainBlock } from "@/lib/types";
import { resolveGearSvg } from "@/lib/gearSvgMap";

/* ── Category colors matching globals.css ── */
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

const MAPPING_QUALITY: Record<
  string,
  { label: string; color: string; dotColor: string }
> = {
  exactish: { label: "Exact Match", color: "#22c55e", dotColor: "#22c55e" },
  close: { label: "Close Match", color: "#3b82f6", dotColor: "#3b82f6" },
  approximation: {
    label: "Approximation",
    color: "#f59e0b",
    dotColor: "#f59e0b",
  },
  fallback: { label: "Fallback", color: "#ef4444", dotColor: "#ef4444" },
};

/* ── Cable connector SVG between blocks ── */
function Cable({ color = "var(--accent-gold)" }: { color?: string }) {
  return (
    <svg
      width="40"
      height="24"
      viewBox="0 0 40 24"
      fill="none"
      className="flex-shrink-0 mx-[-4px]"
    >
      {/* Cable line */}
      <path
        d="M0 12 C8 12, 8 6, 16 6 C24 6, 24 18, 32 18 C36 18, 40 12, 40 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      {/* Cable jack ends */}
      <circle cx="2" cy="12" r="2.5" fill={color} opacity="0.8" />
      <circle cx="38" cy="12" r="2.5" fill={color} opacity="0.8" />
    </svg>
  );
}

/* ── Single gear block ── */
function GearBlock({
  block,
  isActive,
  onHover,
  onLeave,
  showMapping = true,
}: {
  block: ChainBlock;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
  showMapping?: boolean;
}) {
  const categoryColor = CATEGORY_COLORS[block.block_role] || "#64748b";
  const mapping = MAPPING_QUALITY[block.mapping_type];
  const similarity = Math.round(block.similarity * 100);

  // Resolve SVG: try device model first, then canonical, then category fallback
  const svgFile =
    resolveGearSvg(block.model, block.block_role) ||
    resolveGearSvg(block.canonical, block.block_role);

  return (
    <div
      className="flex flex-col items-center flex-shrink-0 group"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Block container */}
      <div
        className="relative flex flex-col items-center transition-all duration-200"
        style={{
          transform: isActive ? "translateY(-4px) scale(1.04)" : "none",
        }}
      >
        {/* LED indicator */}
        <div
          className="w-2 h-2 rounded-full mb-1.5 transition-all duration-300"
          style={{
            background: categoryColor,
            boxShadow: isActive
              ? `0 0 8px ${categoryColor}, 0 0 16px ${categoryColor}40`
              : `0 0 4px ${categoryColor}60`,
          }}
        />

        {/* Category label */}
        <span
          className="text-[9px] uppercase tracking-[0.12em] font-semibold mb-1.5 transition-colors"
          style={{ color: isActive ? categoryColor : "var(--text-muted)" }}
        >
          {block.block_role}
        </span>

        {/* Gear illustration card */}
        <div
          className="relative rounded-lg overflow-hidden transition-all duration-200"
          style={{
            width: 96,
            height: 80,
            background: "var(--bg-elevated)",
            border: `1px solid ${isActive ? categoryColor + "60" : "var(--glass-border)"}`,
            boxShadow: isActive
              ? `0 4px 20px ${categoryColor}25, 0 0 30px ${categoryColor}10`
              : "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          {svgFile ? (
            <div className="w-full h-full flex items-center justify-center p-1.5">
              <Image
                src={`/gear-svgs/${svgFile}`}
                alt={block.model || block.canonical}
                width={88}
                height={72}
                className="object-contain drop-shadow-md"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
                unoptimized
              />
            </div>
          ) : (
            /* Fallback: category icon placeholder */
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ color: categoryColor }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="6"
                  width="18"
                  height="12"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle cx="8" cy="15" r="1.5" fill="currentColor" />
                <circle cx="12" cy="15" r="1.5" fill="currentColor" />
                <circle cx="16" cy="15" r="1.5" fill="currentColor" />
              </svg>
            </div>
          )}
        </div>

        {/* Model name */}
        <span
          className="mt-1.5 text-[10px] font-medium text-center leading-tight max-w-[100px] truncate"
          style={{ color: "var(--text-primary)" }}
          title={block.model}
        >
          {block.model}
        </span>

        {/* Canonical reference */}
        <span
          className="text-[9px] text-center leading-tight max-w-[100px] truncate"
          style={{ color: "var(--text-muted)" }}
          title={block.canonical}
        >
          {block.canonical}
        </span>

        {/* Mapping quality indicator */}
        {showMapping && mapping && (
          <div className="flex items-center gap-1 mt-1">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: mapping.dotColor }}
            />
            <span
              className="text-[8px] font-medium"
              style={{ color: mapping.color }}
            >
              {similarity}%
            </span>
          </div>
        )}
      </div>

      {/* Hover tooltip */}
      {isActive && (
        <div
          className="absolute z-20 mt-1 px-3 py-2 rounded-lg text-[10px] leading-relaxed whitespace-nowrap pointer-events-none"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--glass-border-hover)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            top: "100%",
          }}
        >
          <div className="font-semibold" style={{ color: categoryColor }}>
            {block.block_role.toUpperCase()} — Slot {block.slot}
          </div>
          <div style={{ color: "var(--text-primary)" }}>
            Device: {block.model}
          </div>
          <div style={{ color: "var(--text-secondary)" }}>
            Reference: {block.canonical}
          </div>
          {showMapping && mapping && (
            <div style={{ color: mapping.color }}>
              {mapping.label} — {similarity}% confidence
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Main signal chain diagram ── */
export function SignalChainDiagram({ chain, showMapping = true }: { chain: ChainBlock[]; showMapping?: boolean }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!chain || chain.length === 0) {
    return (
      <div
        className="text-center py-12"
        style={{ color: "var(--text-muted)" }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          className="mx-auto mb-3 opacity-40"
        >
          <path
            d="M9 18V5l12-2v13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" />
          <circle
            cx="18"
            cy="16"
            r="3"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <span className="text-sm">No blocks in signal chain</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Signal flow label */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[9px] uppercase tracking-[0.15em] font-semibold"
          style={{ color: "var(--text-muted)" }}
        >
          Input
        </span>
        <div
          className="flex-1 h-px"
          style={{ background: "var(--glass-border)" }}
        />
        <span
          className="text-[9px] uppercase tracking-[0.15em] font-semibold"
          style={{ color: "var(--text-muted)" }}
        >
          Output
        </span>
      </div>

      {/* Scrollable chain */}
      <div className="overflow-x-auto pb-4 -mx-2 px-2">
        <div className="flex items-center gap-0 min-w-min py-2">
          {/* Input jack */}
          <div className="flex-shrink-0 mr-1">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{
                border: "2px solid var(--accent-gold)",
                background: "var(--bg-deep)",
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--accent-gold)" }}
              />
            </div>
          </div>

          <Cable />

          {chain.map((block, i) => (
            <div key={i} className="flex items-center relative">
              <GearBlock
                block={block}
                isActive={activeIndex === i}
                onHover={() => setActiveIndex(i)}
                onLeave={() => setActiveIndex(null)}
                showMapping={showMapping}
              />
              {i < chain.length - 1 && <Cable />}
            </div>
          ))}

          <Cable />

          {/* Output jack */}
          <div className="flex-shrink-0 ml-1">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{
                border: "2px solid var(--accent-gold)",
                background: "var(--bg-deep)",
              }}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                style={{ color: "var(--accent-gold)" }}
              >
                <polygon
                  points="5,3 19,12 5,21"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Legend — only when showing mapping quality */}
      {showMapping && (
        <div className="flex flex-wrap items-center gap-4 mt-2 pt-2" style={{ borderTop: "1px solid var(--glass-border)" }}>
          {Object.entries(MAPPING_QUALITY).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: val.dotColor }}
              />
              <span
                className="text-[9px] font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                {val.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
