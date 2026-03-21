"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { HardwareChassis } from "@/components/HardwareChassis";

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

export default function RigsPage() {
  const router = useRouter();
  const [slots, setSlots] = useState<(SlotTone | null)[]>(Array(8).fill(null));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("tone_profiles")
        .select(`id, name, confidence_score, research_status, songs!inner(title, artists!inner(name))`)
        .order("confidence_score", { ascending: false })
        .limit(8);

      if (!data) return;

      const profiles = data as unknown as SlotTone[];
      const withBlocks = await Promise.all(
        profiles.map(async (p) => {
          const { data: blockData } = await supabase
            .from("tone_profile_blocks")
            .select("block_role")
            .eq("tone_profile_id", p.id)
            .order("block_order");
          return { ...p, blocks: blockData || [] };
        })
      );

      const filled: (SlotTone | null)[] = Array(8).fill(null);
      withBlocks.forEach((t, i) => { filled[i] = t; });
      setSlots(filled);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <HardwareChassis fullWidth displayLabel="SYSTEM //" title="RIG MANAGER // SLOTS 1-8">

      {/* Nav bar */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="text-xl sm:text-2xl font-black uppercase leading-none"
          style={{ color: "#e8dfce", textShadow: "2px 2px 0 rgba(0,0,0,0.9)" }}>
          RIG MANAGER
        </div>
        <button
          className="hw-mode-btn"
          style={{ padding: "8px 20px", width: "auto" }}
          onClick={() => router.push("/")}>
          ← BACK TO CATALOG
        </button>
      </div>

      {/* Slot grid — 1 col mobile, 2 col sm, 4 col lg */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {slots.map((slot, i) => {
          const isActive = i === 2;
          return (
            <div key={i} className="flex flex-col gap-0 overflow-hidden"
              style={{
                background: "#14110f",
                border: isActive ? "1px solid #e08b26" : "1px solid #1a1410",
                boxShadow: isActive
                  ? "0 0 0 1px #e08b26, inset 0 4px 10px rgba(0,0,0,0.5)"
                  : "0 0 0 1px #2e2822, inset 0 4px 10px rgba(0,0,0,0.5)",
              }}>

              {/* Slot header */}
              <div className="flex justify-between items-center px-3 py-2"
                style={{ background: "#1a1613", borderBottom: "1px solid #221d19" }}>
                <span className="text-[10px] font-black tracking-wider"
                  style={{ color: isActive ? "#e08b26" : "#968a7c" }}>
                  SLOT {String(i + 1).padStart(2, "0")}{isActive ? " [ACTIVE]" : ""}
                </span>
                <div className="w-2 h-2 rounded-full"
                  style={slot
                    ? { background: "#e08b26", boxShadow: "0 0 5px #e08b26" }
                    : { background: "#2e2822" }} />
              </div>

              {/* Info screen */}
              {slot ? (
                <div className="hw-screen p-3 flex flex-col gap-2.5 mx-2 my-2"
                  style={{ minHeight: 110 }}>
                  <div>
                    <div className="text-[9px] font-black uppercase pb-1 mb-1"
                      style={{ color: "#1a1a1a", borderBottom: "1px solid rgba(0,0,0,0.2)" }}>
                      {slot.songs.artists.name}
                    </div>
                    <div className="text-[12px] font-bold leading-snug" style={{ color: "#111" }}>
                      {slot.songs.title}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {slot.blocks.slice(0, 6).map((b, bi) => (
                      <span key={bi} className="text-[8px] font-extrabold px-1.5 py-0.5"
                        style={{ background: "rgba(0,0,0,0.15)", border: "1px solid rgba(0,0,0,0.15)", color: "#1a1a1a" }}>
                        {ROLE_SHORT[b.block_role] || b.block_role.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center mx-2 my-2"
                  style={{ minHeight: 110, background: "#1a1410", border: "1px dashed #2e2822" }}>
                  <span className="text-[10px] font-bold uppercase" style={{ color: "#2e2822" }}>EMPTY</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="grid gap-px" style={{ gridTemplateColumns: "1fr 1fr" }}>
                {slot ? (
                  <>
                    <button onClick={() => router.push(`/tone/${slot.id}`)}
                      className="py-2 text-[9px] font-black uppercase text-center"
                      style={isActive
                        ? { background: "#e08b26", color: "#111" }
                        : { background: "#dcd3c0", color: "#111" }}>
                      {isActive ? "ACTIVE" : "LOAD"}
                    </button>
                    <button className="py-2 text-[9px] font-black uppercase text-center"
                      style={{ background: "#dcd3c0", color: "#111" }}>
                      COMPARE
                    </button>
                    <button onClick={() => router.push(`/tone/${slot.id}`)}
                      className="py-2 text-[9px] font-black uppercase text-center"
                      style={{ background: "#c8bfaf", color: "#111" }}>
                      EDIT
                    </button>
                    <button className="py-2 text-[9px] font-black uppercase text-center"
                      style={{ background: "#c8bfaf", color: "#7a1010" }}>
                      CLEAR
                    </button>
                  </>
                ) : (
                  <button className="py-2 text-[9px] font-black uppercase text-center"
                    style={{ gridColumn: "span 2", background: "#dcd3c0", color: "#111" }}>
                    SAVE CURRENT TO SLOT
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer status bar */}
      <div className="flex flex-wrap justify-between items-center gap-3 p-3 hw-rack">
        <div className="text-[11px] font-bold tracking-[0.08em]"
          style={{ fontFamily: "monospace", color: "#e08b26" }}>
          SYSTEM OK // {loading ? "LOADING..." : `${slots.filter(Boolean).length}/8 SLOTS LOADED`} // V2.4
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="hw-mode-btn" style={{ padding: "7px 16px", width: "auto" }}>IMPORT BUNDLE</button>
          <button className="hw-mode-btn" style={{ padding: "7px 16px", width: "auto" }}>EXPORT ALL</button>
        </div>
      </div>
    </HardwareChassis>
  );
}
