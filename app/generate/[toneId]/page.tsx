"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  ToneProfile,
  GuitarArchetype,
  PickupArchetype,
  OutputContext,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Skeleton } from "@/components/ui/Skeleton";
import { TonalBiasPreview } from "@/components/TonalBiasPreview";
import { DeviceSelector, Device } from "@/components/DeviceSelector";
import { HardwareChassis } from "@/components/HardwareChassis";

const PRESET_MODES = [
  {
    value: "authentic",
    label: "Authentic",
    desc: "Closest to the original recorded tone",
  },
  {
    value: "practical",
    label: "Practical",
    desc: "Optimized for practice and home playing",
  },
  {
    value: "live_safe",
    label: "Live Safe",
    desc: "Stage-ready with clear projection",
  },
];

const PICKUP_POSITIONS = ["bridge", "neck", "middle"];

function SelectionCard({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left transition-all duration-150 flex flex-col overflow-hidden py-3 px-4 text-sm"
      style={{
        background: selected ? "rgba(224,139,38,0.15)" : "#241e1a",
        border: selected ? "1px solid #e08b26" : "1px solid #111",
        color: "#e8dfce",
        boxShadow: selected ? "0 0 12px rgba(224,139,38,0.1)" : "none",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center border-2"
          style={{ borderColor: selected ? "#e08b26" : "#968a7c" }}
        >
          {selected && (
            <div className="w-2 h-2 rounded-full" style={{ background: "#e08b26" }} />
          )}
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="hw-label mb-2">{children}</div>
  );
}

export default function GearSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const toneId = params.toneId as string;

  const [profile, setProfile] = useState<ToneProfile | null>(null);
  const [guitars, setGuitars] = useState<GuitarArchetype[]>([]);
  const [pickups, setPickups] = useState<PickupArchetype[]>([]);
  const [outputs, setOutputs] = useState<OutputContext[]>([]);

  const [selectedGuitar, setSelectedGuitar] = useState("");
  const [selectedPickup, setSelectedPickup] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("bridge");
  const [selectedOutput, setSelectedOutput] = useState("");
  const [selectedMode, setSelectedMode] = useState("authentic");
  const [selectedDeviceId, setSelectedDeviceId] = useState("e90658cb-30fd-4fab-8d33-1c68fff5abe7"); // Ampero II Stomp default
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const [profileRes, guitarsRes, pickupsRes, outputsRes] =
        await Promise.all([
          supabase
            .from("tone_profiles")
            .select(
              `id, name, section_type, gain_level, ambience_level, confidence_score,
            songs!inner(id, title, artists!inner(id, name))`
            )
            .eq("id", toneId)
            .single(),
          supabase.from("guitar_archetypes").select("*").in("name", ["Stratocaster", "Les Paul", "Telecaster"]).order("name"),
          supabase.from("pickup_archetypes").select("*").order("name"),
          supabase.from("output_contexts").select("*").order("name"),
        ]);

      if (profileRes.data)
        setProfile(profileRes.data as unknown as ToneProfile);
      if (guitarsRes.data) {
        setGuitars(guitarsRes.data);
        if (guitarsRes.data.length > 0) setSelectedGuitar(guitarsRes.data[0].id);
      }
      if (pickupsRes.data) {
        setPickups(pickupsRes.data);
        if (pickupsRes.data.length > 0) setSelectedPickup(pickupsRes.data[0].id);
      }
      if (outputsRes.data) {
        setOutputs(outputsRes.data);
        if (outputsRes.data.length > 0) setSelectedOutput(outputsRes.data[0].id);
      }
    }
    load();
  }, [toneId]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token =
        session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-preset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tone_profile_id: toneId,
            guitar_archetype_id: selectedGuitar,
            pickup_archetype_id: selectedPickup,
            pickup_position: selectedPosition,
            output_context_id: selectedOutput,
            preset_mode: selectedMode,
            device_id: selectedDeviceId,
          }),
        }
      );

      const result = await res.json();
      if (result.error) {
        setError(result.error);
      } else if (result.preset_id) {
        router.push(`/preset/${result.preset_id}`);
      }
    } catch {
      setError("Failed to generate preset. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (!profile) {
    return (
      <HardwareChassis>
        <div className="space-y-4">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-8 w-96" />
          <div className="grid grid-cols-2 gap-6 mt-8">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </HardwareChassis>
    );
  }

  return (
    <HardwareChassis
      fullWidth
      title={profile.songs.artists.name}
      subtitle={profile.songs.title}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "#968a7c" }}>
        <Link href="/" className="hover:opacity-70" style={{ color: "#968a7c" }}>CATALOG</Link>
        <span>//</span>
        <Link href={`/tone/${toneId}`} className="hover:opacity-70" style={{ color: "#968a7c" }}>
          {profile.songs.artists.name} — {profile.songs.title}
        </Link>
        <span>//</span>
        <span style={{ color: "#e08b26" }}>GENERATE</span>
      </div>

      {/* Header */}
      <div className="hw-rack p-4">
        <div className="text-xl font-black uppercase" style={{ color: "#e8dfce", textShadow: "2px 2px 0 rgba(0,0,0,0.9)" }}>
          GENERATE PRESET
        </div>
        <div className="text-[11px] font-bold mt-1" style={{ color: "#968a7c" }}>
          {profile.songs.artists.name} — {profile.songs.title}
          <span className="ml-2" style={{ color: "#e08b26" }}>{profile.name}</span>
        </div>
      </div>

      {/* Target Device */}
      <div>
        <SectionLabel>TARGET DEVICE</SectionLabel>
        <div className="hw-rack p-4">
          <DeviceSelector
            selectedDeviceId={selectedDeviceId}
            onSelect={(id, device) => {
              setSelectedDeviceId(id);
              setSelectedDevice(device);
            }}
          />
          {selectedDevice && !selectedDevice.is_active && (
            <div className="mt-3 flex items-center gap-2 text-sm p-3"
              style={{ background: "rgba(224,139,38,0.1)", border: "1px solid rgba(224,139,38,0.3)", color: "#e08b26" }}>
              <AlertCircle className="size-4 flex-shrink-0" />
              <span>
                {selectedDevice.brand} {selectedDevice.model} support is coming soon.
                Preset generation is currently available for Hotone Ampero devices.
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Guitar */}
        <div>
          <SectionLabel>GUITAR</SectionLabel>
          <div className="flex flex-col gap-1.5">
            {guitars.map((g) => (
              <SelectionCard
                key={g.id}
                selected={selectedGuitar === g.id}
                onClick={() => setSelectedGuitar(g.id)}
              >
                <div className="font-extrabold text-sm uppercase" style={{ color: "#e8dfce" }}>
                  {g.name}
                </div>
                {(g.body_type || g.default_pickup_family) && (
                  <div className="text-[10px] mt-0.5 font-bold uppercase" style={{ color: "#968a7c" }}>
                    {[g.body_type, g.default_pickup_family].filter(Boolean).join(" — ")}
                  </div>
                )}
              </SelectionCard>
            ))}
          </div>
          {(() => {
            const g = guitars.find((g) => g.id === selectedGuitar);
            return g?.tonal_bias_json ? (
              <TonalBiasPreview bias={g.tonal_bias_json} guitarName={g.name} />
            ) : null;
          })()}
        </div>

        {/* Pickup */}
        <div>
          <SectionLabel>PICKUP</SectionLabel>
          <div className="flex flex-col gap-1.5">
            {pickups.map((p) => (
              <SelectionCard
                key={p.id}
                selected={selectedPickup === p.id}
                onClick={() => setSelectedPickup(p.id)}
              >
                <span className="font-extrabold text-sm uppercase" style={{ color: "#e8dfce" }}>
                  {p.name}
                </span>
              </SelectionCard>
            ))}
          </div>

          <div className="mt-4">
            <SectionLabel>PICKUP POSITION</SectionLabel>
            <div className="flex gap-1">
              {PICKUP_POSITIONS.map((pos) => (
                <button
                  key={pos}
                  onClick={() => setSelectedPosition(pos)}
                  className="flex-1 capitalize text-center py-2 text-[10px] font-black uppercase"
                  style={selectedPosition === pos
                    ? { background: "#e08b26", color: "#111", border: "1px solid #000" }
                    : { background: "#241e1a", color: "#968a7c", border: "1px solid #111" }}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output */}
        <div>
          <SectionLabel>OUTPUT</SectionLabel>
          <div className="flex flex-col gap-1.5">
            {outputs.map((o) => (
              <SelectionCard
                key={o.id}
                selected={selectedOutput === o.id}
                onClick={() => setSelectedOutput(o.id)}
              >
                <div className="font-extrabold text-sm uppercase" style={{ color: "#e8dfce" }}>
                  {o.name}
                </div>
                <div className="text-[10px] mt-0.5 font-bold uppercase" style={{ color: "#968a7c" }}>
                  Cab {o.cab_should_be_enabled ? "ENABLED" : "BYPASSED"}
                </div>
              </SelectionCard>
            ))}
          </div>
        </div>

        {/* Preset Mode */}
        <div>
          <SectionLabel>PRESET MODE</SectionLabel>
          <div className="flex flex-col gap-1.5">
            {PRESET_MODES.map((m) => (
              <SelectionCard
                key={m.value}
                selected={selectedMode === m.value}
                onClick={() => setSelectedMode(m.value)}
              >
                <div className="font-extrabold text-sm uppercase" style={{ color: "#e8dfce" }}>
                  {m.label}
                </div>
                <div className="text-[10px] mt-0.5 font-bold uppercase" style={{ color: "#968a7c" }}>
                  {m.desc}
                </div>
              </SelectionCard>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex flex-col items-center gap-4 py-4">
        {error && (
          <div className="text-sm px-4 py-3 max-w-md text-center"
            style={{ background: "rgba(184,71,41,0.15)", border: "1px solid rgba(184,71,41,0.4)", color: "#b84729" }}>
            {error}
          </div>
        )}
        {selectedDevice && !selectedDevice.is_active ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase"
              style={{ background: "#241e1a", border: "1px solid #111", color: "#968a7c" }}>
              <Lock className="size-4" />
              Coming Soon — {selectedDevice.brand} {selectedDevice.model}
            </div>
            <p className="text-[10px] font-bold uppercase" style={{ color: "#968a7c" }}>
              Switch to a supported Hotone Ampero device to generate presets now
            </p>
          </div>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={!selectedGuitar || !selectedPickup || !selectedOutput || generating}
            className="text-base font-black uppercase tracking-[0.1em] px-16 py-4"
            style={{
              background: generating || !selectedGuitar || !selectedPickup || !selectedOutput
                ? "#2e130d"
                : "#b84729",
              color: generating || !selectedGuitar || !selectedPickup || !selectedOutput
                ? "#968a7c"
                : "#fff",
              border: "2px solid #111",
              boxShadow: "0 4px 0 #000, inset 0 2px 0 rgba(255,255,255,0.2)",
              cursor: generating || !selectedGuitar || !selectedPickup || !selectedOutput ? "not-allowed" : "pointer",
            }}
          >
            {generating ? "GENERATING..." : `GENERATE${selectedDevice ? ` ${selectedDevice.preset_extension || ""}` : ""} PRESET`}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <Link href={`/tone/${toneId}`} className="text-[10px] font-bold uppercase tracking-[0.12em] hover:opacity-70"
          style={{ color: "#968a7c" }}>
          ← BACK TO TONE
        </Link>
      </div>
    </HardwareChassis>
  );
}
