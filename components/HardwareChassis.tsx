"use client";
import Link from "next/link";
import { ReactNode } from "react";

interface HardwareChassisProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  displayLabel?: string;
  displayLabel2?: string;
  className?: string;
  fullWidth?: boolean;
}

function Screw({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const positions: Record<string, string> = {
    tl: "top-3 left-3",
    tr: "top-3 right-3",
    bl: "bottom-3 left-3",
    br: "bottom-3 right-3",
  };
  return <div className={`hw-screw ${positions[pos]}`} />;
}

export function HardwareChassis({
  children,
  title,
  subtitle,
  displayLabel = "ARTIST //",
  displayLabel2 = "SONG //",
  className = "",
  fullWidth = false,
}: HardwareChassisProps) {
  return (
    <div
      className="hw-body min-h-screen flex items-start justify-center py-6 px-3 sm:py-10 sm:px-4"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <div
        className={`hw-chassis flex flex-col gap-4 sm:gap-6 w-full ${fullWidth ? "max-w-6xl" : "max-w-5xl"} p-4 sm:p-6 md:p-8 ${className}`}
        style={{ userSelect: "none" }}
      >
        <Screw pos="tl" />
        <Screw pos="tr" />
        <Screw pos="bl" />
        <Screw pos="br" />

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <Link href="/" className="flex-shrink-0">
            <div>
              <h1
                className="text-xl sm:text-2xl font-black uppercase tracking-wide leading-none"
                style={{ color: "#e8dfce", textShadow: "2px 2px 0 rgba(0,0,0,0.9)" }}
              >
                TONE RECIPES
              </h1>
              <p
                className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.15em] uppercase mt-1"
                style={{ color: "#e08b26", textShadow: "1px 1px 0 rgba(0,0,0,0.8)" }}
              >
                SIGNAL CHAIN ENCYCLOPEDIA
              </p>
            </div>
          </Link>

          {(title || subtitle) ? (
            <div
              className="hw-display flex flex-wrap items-center gap-2 px-3 py-2 text-xs font-bold min-w-0 max-w-full sm:max-w-sm"
              style={{ fontFamily: "'Courier New', Courier, monospace", lineHeight: 1.4 }}
            >
              <span style={{ color: "#7a6e62", whiteSpace: "nowrap" }}>{displayLabel}</span>
              <span className="truncate" style={{ maxWidth: 160 }}>{title}</span>
              {subtitle && (
                <>
                  <span style={{ color: "#7a6e62", whiteSpace: "nowrap" }}>{displayLabel2}</span>
                  <span className="truncate" style={{ maxWidth: 160 }}>{subtitle}</span>
                </>
              )}
            </div>
          ) : (
            <div
              className="hw-display flex items-center gap-3 px-3 py-2 text-xs font-bold"
              style={{ fontFamily: "'Courier New', Courier, monospace" }}
            >
              <span style={{ color: "#7a6e62" }}>SYSTEM //</span>
              <span style={{ color: "#444" }}>READY</span>
            </div>
          )}
        </header>

        {children}
      </div>
    </div>
  );
}
