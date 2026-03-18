"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

const MAPPING_COLORS: Record<string, { label: string; color: string }> = {
  exactish: { label: "Exact Match", color: "#22c55e" },
  close: { label: "Close Match", color: "#3b82f6" },
  approximation: { label: "Approximation", color: "#f59e0b" },
  fallback: { label: "Fallback", color: "#ef4444" },
};

interface InspectableBlock {
  block_role: string;
  model?: string;
  canonical?: string;
  mapping_type?: string;
  similarity?: number;
  params?: Record<string, unknown>;
  settings_json?: Record<string, unknown> | null;
}

function classifyParam(value: unknown): "numeric" | "boolean" | "string" {
  if (typeof value === "number") return "numeric";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "string") {
    if (value === "true" || value === "false") return "boolean";
    const num = Number(value);
    if (!isNaN(num) && value.trim() !== "") return "numeric";
  }
  return "string";
}

function formatParamName(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function ParameterBar({
  name,
  value,
  color,
}: {
  name: string;
  value: number;
  color: string;
}) {
  const clamped = Math.min(Math.max(value, 0), 100);
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-xs text-muted-foreground w-28 shrink-0 truncate" title={name}>
        {name}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-muted/30 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${clamped}%`,
            background: color,
            opacity: 0.8,
          }}
        />
      </div>
      <span className="text-xs font-mono text-foreground w-10 text-right shrink-0">
        {typeof value === "number" ? (Number.isInteger(value) ? value : value.toFixed(1)) : value}
      </span>
    </div>
  );
}

function BooleanParam({ name, value }: { name: string; value: boolean }) {
  const isOn = value === true || String(value) === "true";
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-muted-foreground">{name}</span>
      <span
        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
        style={{
          background: isOn ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.1)",
          color: isOn ? "#22c55e" : "#ef4444",
        }}
      >
        {isOn ? "ON" : "OFF"}
      </span>
    </div>
  );
}

function StringParam({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-muted-foreground">{name}</span>
      <Badge variant="secondary" className="text-[10px]">
        {value}
      </Badge>
    </div>
  );
}

export function BlockInspectorSheet({
  block,
  open,
  onOpenChange,
}: {
  block: InspectableBlock | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!block) return null;

  const categoryColor = CATEGORY_COLORS[block.block_role] || "#64748b";
  const mapping = block.mapping_type ? MAPPING_COLORS[block.mapping_type] : null;
  const params = block.params || block.settings_json || {};
  const entries = Object.entries(params).filter(
    ([, v]) => v !== null && v !== undefined
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-[380px] sm:w-[420px] border-l border-border bg-background p-0"
      >
        {/* Color accent bar */}
        <div
          className="h-1 w-full"
          style={{ background: categoryColor }}
        />

        <SheetHeader className="px-6 pt-5 pb-0">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: categoryColor,
                boxShadow: `0 0 8px ${categoryColor}60`,
              }}
            />
            <span
              className="text-[10px] uppercase tracking-[0.15em] font-semibold"
              style={{ color: categoryColor }}
            >
              {block.block_role}
            </span>
          </div>

          <SheetTitle className="text-lg font-semibold text-foreground">
            {block.model || block.canonical || block.block_role}
          </SheetTitle>

          {block.canonical && block.model && block.canonical !== block.model && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Reference: {block.canonical}
            </p>
          )}

          {mapping && (
            <div className="flex items-center gap-2 mt-2">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: mapping.color }}
              />
              <span className="text-[11px] font-medium" style={{ color: mapping.color }}>
                {mapping.label}
              </span>
              {block.similarity !== undefined && (
                <span className="text-[11px] text-muted-foreground">
                  {Math.round(block.similarity * 100)}% confidence
                </span>
              )}
            </div>
          )}
        </SheetHeader>

        <Separator className="mt-4" />

        {/* Parameters */}
        <ScrollArea className="h-[calc(100vh-220px)] px-6 py-4">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                className="mb-3 opacity-40"
              >
                <path
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-sm">No parameters recorded</span>
              <span className="text-xs mt-1 opacity-60">
                This block uses default settings
              </span>
            </div>
          ) : (
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 font-semibold">
                Parameters ({entries.length})
              </p>
              {entries.map(([key, value]) => {
                const type = classifyParam(value);
                const name = formatParamName(key);

                if (type === "numeric") {
                  return (
                    <ParameterBar
                      key={key}
                      name={name}
                      value={Number(value)}
                      color={categoryColor}
                    />
                  );
                }
                if (type === "boolean") {
                  return (
                    <BooleanParam
                      key={key}
                      name={name}
                      value={value === true || value === "true"}
                    />
                  );
                }
                return (
                  <StringParam key={key} name={name} value={String(value)} />
                );
              })}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
