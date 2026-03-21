"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { HardwareChassis } from "@/components/HardwareChassis";
import {
  getRigSlots,
  getActiveSlotIndex,
  clearSlot,
  setActiveSlotIndex,
  exportRigToJson,
  importRigFromJson,
} from "@/lib/rigStorage";

interface SlotTone {
  id: string;
  name: string;
  confidence_score: number;
  research_status: string;
  songs: { title: string; artists: { name: string } };
  blocks: { block_role: string }[];
}

const ROLE_SHORT: Record<string, string> = {
  gate: "GATE", compressor: "COMP", wah: "WAH", boost: "BST",
  overdrive: "OD", distortion: "DIST", fuzz: "FUZZ", amp: "AMP",
  cab: "CAB", eq: "EQ", modulation: "MOD", delay: "DLY", reverb: "RVB",
};

const BLOCK_COLORS: Record<string, string> = {
  gate: "#607080", compressor: "#2a7fd4", wah: "#b05a10", boost: "#c8a020",
  overdrive: "#b84729", distortion: "#a83228", fuzz: "#7a38b0", amp: "#e08b26",
  cab: "#7a6e62", eq: "#22875a", modulation: "#14887a", delay: "#2060a0", reverb: "#4838a0",
};

export default function RigsPage() {
  const router = useRouter();
  const [slots, setSlots] = useState<(SlotTone | null)[]>(Array(8).fill(null));
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const [loading, setLoading] = useState(true);

  // Compare mode: up to 2 selected slot indices
  const [compareSet, setCompareSet] = useState<number[]>([]);

  // Import
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  // ── Load slots from localStorage → Supabase ─────────────────────────────
  const loadSlots = useCallback(async () => {
    setLoading(true);
    const stored = getRigSlots();
    const active = getActiveSlotIndex();
    setActiveIdx(active);

    const ids = stored.flatMap((s) => (s ? [s.tone_profile_id] : []));

    if (ids.length === 0) {
      setSlots(Array(8).fill(null));
      setLoading(false);
      return;
    }

    // Fetch tone data for all stored IDs
    const { data: profiles } = await supabase
      .from("tone_profiles")
      .select(`id, name, confidence_score, research_status, songs!inner(title, artists!inner(name))`)
      .in("id", ids);

    if (!profiles) {
      setSlots(Array(8).fill(null));
      setLoading(false);
      return;
    }

    // Fetch blocks for each profile
    const withBlocks = await Promise.all(
      (profiles as any[]).map(async (p) => {
        const { data: blockData } = await supabase
          .from("tone_profile_blocks")
          .select("block_role")
          .eq("tone_profile_id", p.id)
          .order("block_order");
        return { ...p, blocks: blockData || [] };
      })
    );

    // Map by ID for quick lookup
    const byId = Object.fromEntries(withBlocks.map((p) => [p.id, p]));

    // Rebuild ordered slot array preserving positions
    const filled: (SlotTone | null)[] = stored.map((s) =>
      s ? (byId[s.tone_profile_id] as SlotTone) ?? null : null
    );

    setSlots(filled);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  // ── Actions ──────────────────────────────────────────────────────────────

  function handleLoad(slotIdx: number, toneId: string) {
    setActiveSlotIndex(slotIdx);
    setActiveIdx(slotIdx);
    router.push(`/tone/${toneId}`);
  }

  function handleClear(slotIdx: number) {
    clearSlot(slotIdx);
    setCompareSet((prev) => prev.filter((i) => i !== slotIdx));
    loadSlots();
  }

  function handleToggleCompare(slotIdx: number) {
    setCompareSet((prev) => {
      if (prev.includes(slotIdx)) return prev.filter((i) => i !== slotIdx);
      if (prev.length >= 2) return [prev[1], slotIdx]; // replace oldest
      return [...prev, slotIdx];
    });
  }

  function handleExport() {
    exportRigToJson();
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const result = importRigFromJson(text);
      if (result.ok) {
        setImportError(null);
        setImportSuccess(true);
        setTimeout(() => setImportSuccess(false), 3000);
        loadSlots();
      } else {
        setImportError(result.error ?? "Import failed");
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be re-imported
    e.target.value = "";
  }

  // ── Compare panel data ────────────────────────────────────────────────────
  const compareSlots = compareSet.map((i) => ({ idx: i, tone: slots[i] }));
  const showCompare = compareSet.length === 2 && compareSlots.every((s) => s.tone);

  function blockSetOf(tone: SlotTone | null) {
    return new Set(tone?.blocks.map((b) => b.block_role) ?? []);
  }
  const blocksA = compareSlots[0] ? blockSetOf(compareSlots[0].tone) : new Set<string>();
  const blocksB = compareSlots[1] ? blockSetOf(compareSlots[1].tone) : new Set<string>();
  const allBlockRoles = [...new Set([...blocksA, ...blocksB])];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <HardwareChassis fullWidth displayLabel="SYSTEM //" title="RIG MANAGER // SLOTS 1–8">

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImportFile}
      />

      {/* Nav bar */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div
          className="text-xl sm:text-2xl font-black uppercase leading-none"
          style={{ color: "#e8dfce", textShadow: "2px 2px 0 rgba(0,0,0,0.9)" }}
        >
          RIG MANAGER
        </div>
        <button
          className="hw-mode-btn"
          style={{ padding: "8px 20px", width: "auto" }}
          onClick={() => router.push("/")}
        >
          ← BACK TO CATALOG
        </button>
      </div>

      {/* Compare mode hint */}
      {compareSet.length > 0 && (
        <div
          className="text-[11px] font-bold px-4 py-2.5 flex items-center justify-between gap-3"
          style={{ background: "#1a1613", border: "1px solid #e08b26", color: "#e08b26" }}
        >
          <span>
            COMPARE MODE — {compareSet.length === 1 ? "SELECT ONE MORE SLOT" : "COMPARISON READY ↓"}
          </span>
          <button
            onClick={() => setCompareSet([])}
            className="text-[10px] font-black uppercase"
            style={{ color: "#968a7c" }}
          >
            CANCEL ✕
          </button>
        </div>
      )}

      {/* Slot grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {slots.map((slot, i) => {
          const isActive = i === activeIdx;
          const isInCompare = compareSet.includes(i);

          return (
            <div
              key={i}
              className="flex flex-col gap-0 overflow-hidden"
              style={{
                background: "#14110f",
                border: isInCompare
                  ? "1px solid #4a90d9"
                  : isActive
                  ? "1px solid #e08b26"
                  : "1px solid #1a1410",
                boxShadow: isInCompare
                  ? "0 0 0 1px #4a90d9, inset 0 4px 10px rgba(0,0,0,0.5)"
                  : isActive
                  ? "0 0 0 1px #e08b26, inset 0 4px 10px rgba(0,0,0,0.5)"
                  : "0 0 0 1px #2e2822, inset 0 4px 10px rgba(0,0,0,0.5)",
              }}
            >
              {/* Slot header */}
              <div
                className="flex justify-between items-center px-3 py-2"
                style={{ background: "#1a1613", borderBottom: "1px solid #221d19" }}
              >
                <span
                  className="text-[10px] font-black tracking-wider"
                  style={{
                    color: isInCompare ? "#4a90d9" : isActive ? "#e08b26" : "#968a7c",
                  }}
                >
                  SLOT {String(i + 1).padStart(2, "0")}
                  {isActive ? " [ACTIVE]" : ""}
                  {isInCompare ? " [CMP]" : ""}
                </span>
                <div
                  className="w-2 h-2 rounded-full"
                  style={
                    slot
                      ? { background: "#e08b26", boxShadow: "0 0 5px #e08b26" }
                      : { background: "#2e2822" }
                  }
                />
              </div>

              {/* Info screen */}
              {slot ? (
                <div
                  className="hw-screen p-3 flex flex-col gap-2.5 mx-2 my-2"
                  style={{ minHeight: 110 }}
                >
                  <div>
                    <div
                      className="text-[9px] font-black uppercase pb-1 mb-1"
                      style={{ color: "#1a1a1a", borderBottom: "1px solid rgba(0,0,0,0.2)" }}
                    >
                      {slot.songs.artists.name}
                    </div>
                    <div className="text-[12px] font-bold leading-snug" style={{ color: "#111" }}>
                      {slot.songs.title}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {slot.blocks.slice(0, 7).map((b, bi) => (
                      <span
                        key={bi}
                        className="text-[8px] font-extrabold px-1.5 py-0.5"
                        style={{
                          background: BLOCK_COLORS[b.block_role]
                            ? BLOCK_COLORS[b.block_role] + "33"
                            : "rgba(0,0,0,0.15)",
                          border: `1px solid ${BLOCK_COLORS[b.block_role] ?? "#555"}66`,
                          color: BLOCK_COLORS[b.block_role] ?? "#1a1a1a",
                        }}
                      >
                        {ROLE_SHORT[b.block_role] || b.block_role.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center gap-2 mx-2 my-2"
                  style={{ minHeight: 110, background: "#1a1410", border: "1px dashed #2e2822" }}
                >
                  <span className="text-[10px] font-bold uppercase" style={{ color: "#2e2822" }}>
                    EMPTY
                  </span>
                  <button
                    onClick={() => router.push("/")}
                    className="text-[9px] font-black uppercase px-2 py-1"
                    style={{ background: "#2e2822", color: "#968a7c" }}
                  >
                    BROWSE CATALOG
                  </button>
                </div>
              )}

              {/* Action buttons */}
              {slot ? (
                <div className="grid gap-px" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <button
                    onClick={() => handleLoad(i, slot.id)}
                    className="py-2 text-[9px] font-black uppercase text-center transition-colors"
                    style={
                      isActive
                        ? { background: "#e08b26", color: "#111" }
                        : { background: "#dcd3c0", color: "#111" }
                    }
                  >
                    {isActive ? "ACTIVE ✓" : "LOAD"}
                  </button>

                  <button
                    onClick={() => handleToggleCompare(i)}
                    className="py-2 text-[9px] font-black uppercase text-center transition-colors"
                    style={
                      isInCompare
                        ? { background: "#4a90d9", color: "#fff" }
                        : { background: "#dcd3c0", color: "#111" }
                    }
                  >
                    {isInCompare ? "CMP ✓" : "COMPARE"}
                  </button>

                  <button
                    onClick={() => router.push(`/tone/${slot.id}`)}
                    className="py-2 text-[9px] font-black uppercase text-center"
                    style={{ background: "#c8bfaf", color: "#111" }}
                  >
                    VIEW
                  </button>

                  <button
                    onClick={() => handleClear(i)}
                    className="py-2 text-[9px] font-black uppercase text-center"
                    style={{ background: "#c8bfaf", color: "#7a1010" }}
                  >
                    CLEAR
                  </button>
                </div>
              ) : (
                <div />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Compare Panel ── */}
      {showCompare && (
        <div
          className="flex flex-col gap-0 overflow-hidden"
          style={{ border: "1px solid #4a90d9", background: "#0e0c0a" }}
        >
          {/* Header */}
          <div
            className="flex justify-between items-center px-4 py-2.5"
            style={{ background: "#1a1613", borderBottom: "1px solid #4a90d9" }}
          >
            <span className="text-[11px] font-black tracking-wider" style={{ color: "#4a90d9" }}>
              COMPARISON — SLOT {String(compareSlots[0].idx + 1).padStart(2, "0")} vs SLOT{" "}
              {String(compareSlots[1].idx + 1).padStart(2, "0")}
            </span>
            <button
              onClick={() => setCompareSet([])}
              className="text-[10px] font-black"
              style={{ color: "#968a7c" }}
            >
              CLOSE ✕
            </button>
          </div>

          {/* Side-by-side */}
          <div className="grid grid-cols-2 gap-px" style={{ background: "#4a90d933" }}>
            {compareSlots.map(({ idx, tone }) => (
              <div key={idx} className="flex flex-col gap-3 p-4" style={{ background: "#0e0c0a" }}>
                <div>
                  <div
                    className="text-[9px] font-black uppercase mb-0.5"
                    style={{ color: "#4a90d9" }}
                  >
                    SLOT {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div
                    className="text-[11px] font-black uppercase"
                    style={{ color: "#968a7c" }}
                  >
                    {tone!.songs.artists.name}
                  </div>
                  <div className="text-[14px] font-black" style={{ color: "#e8dfce" }}>
                    {tone!.songs.title}
                  </div>
                  <div className="text-[10px] mt-1" style={{ color: "#968a7c" }}>
                    CONFIDENCE: {Math.round(tone!.confidence_score * 100)}%
                  </div>
                </div>

                {/* Signal chain comparison */}
                <div className="flex flex-col gap-1">
                  <div
                    className="text-[9px] font-black uppercase mb-1"
                    style={{ color: "#555" }}
                  >
                    SIGNAL CHAIN
                  </div>
                  {allBlockRoles.map((role) => {
                    const hasIt =
                      idx === compareSlots[0].idx ? blocksA.has(role) : blocksB.has(role);
                    const otherHas =
                      idx === compareSlots[0].idx ? blocksB.has(role) : blocksA.has(role);
                    const isUnique = hasIt && !otherHas;
                    const isMissing = !hasIt && otherHas;

                    if (!hasIt && !isMissing) return null;

                    return (
                      <div
                        key={role}
                        className="flex items-center gap-2 px-2 py-1"
                        style={{
                          background: isUnique
                            ? (BLOCK_COLORS[role] ?? "#555") + "22"
                            : isMissing
                            ? "transparent"
                            : "rgba(255,255,255,0.03)",
                          border: isUnique
                            ? `1px solid ${BLOCK_COLORS[role] ?? "#555"}66`
                            : isMissing
                            ? "1px dashed #2e2822"
                            : "1px solid transparent",
                          opacity: isMissing ? 0.3 : 1,
                        }}
                      >
                        <span
                          className="text-[9px] font-black"
                          style={{ color: hasIt ? (BLOCK_COLORS[role] ?? "#e8dfce") : "#2e2822" }}
                        >
                          {ROLE_SHORT[role] || role.toUpperCase()}
                        </span>
                        {isUnique && (
                          <span className="text-[8px] font-bold" style={{ color: "#4a90d9" }}>
                            ONLY HERE
                          </span>
                        )}
                        {isMissing && (
                          <span className="text-[8px]" style={{ color: "#555" }}>
                            — absent
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Compare actions */}
          <div
            className="flex gap-2 px-4 py-3"
            style={{ borderTop: "1px solid #4a90d933" }}
          >
            {compareSlots.map(({ idx, tone }) => (
              <button
                key={idx}
                onClick={() => handleLoad(idx, tone!.id)}
                className="text-[10px] font-black uppercase px-4 py-2"
                style={{ background: "#4a90d9", color: "#fff" }}
              >
                LOAD SLOT {String(idx + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer status bar */}
      <div
        className="flex flex-wrap justify-between items-center gap-3 p-3 hw-rack"
      >
        <div
          className="text-[11px] font-bold tracking-[0.08em]"
          style={{ fontFamily: "monospace", color: "#e08b26" }}
        >
          {importSuccess && (
            <span style={{ color: "#27ae60", marginRight: 12 }}>✓ BUNDLE IMPORTED</span>
          )}
          {importError && (
            <span style={{ color: "#c0392b", marginRight: 12 }}>✕ {importError}</span>
          )}
          SYSTEM OK // {loading ? "LOADING..." : `${slots.filter(Boolean).length}/8 SLOTS LOADED`} // V2.4
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="hw-mode-btn"
            style={{ padding: "7px 16px", width: "auto" }}
            onClick={() => fileInputRef.current?.click()}
          >
            IMPORT BUNDLE
          </button>
          <button
            className="hw-mode-btn"
            style={{ padding: "7px 16px", width: "auto" }}
            onClick={handleExport}
            disabled={slots.filter(Boolean).length === 0}
          >
            EXPORT ALL
          </button>
        </div>
      </div>
    </HardwareChassis>
  );
}
