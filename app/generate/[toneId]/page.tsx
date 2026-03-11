"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ToneProfile,
  GuitarArchetype,
  PickupArchetype,
  OutputContext,
} from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GoldButton } from "@/components/ui/GoldButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { TonalBiasPreview } from "@/components/TonalBiasPreview";
import { DeviceSelector, Device } from "@/components/DeviceSelector";

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
      className="w-full text-left p-4 rounded-lg transition-all duration-150"
      style={{
        background: selected
          ? "rgba(212,168,50,0.08)"
          : "var(--glass-bg)",
        border: selected
          ? "1px solid rgba(212,168,50,0.3)"
          : "1px solid var(--glass-border)",
        boxShadow: selected
          ? "0 0 12px rgba(212,168,50,0.08)"
          : "none",
      }}
    >
      <div className="flex items-center gap-3">
        {/* Radio indicator */}
        <div
          className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
          style={{
            border: selected
              ? "2px solid var(--accent-gold)"
              : "2px solid var(--text-muted)",
          }}
        >
          {selected && (
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "var(--accent-gold)" }}
            />
          )}
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </button>
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
      <div className="space-y-4 pt-4">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-8 w-96" />
        <div className="grid grid-cols-2 gap-6 mt-8">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div
        className="text-sm mb-6 animate-fade-up"
        style={{ color: "var(--text-muted)" }}
      >
        <Link
          href="/"
          className="transition-colors hover:text-[var(--text-primary)]"
        >
          Library
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/tone/${toneId}`}
          className="transition-colors hover:text-[var(--text-primary)]"
        >
          {profile.songs.artists.name} — {profile.songs.title}
        </Link>
        <span className="mx-2">/</span>
        <span style={{ color: "var(--text-secondary)" }}>Generate</span>
      </div>

      {/* Header */}
      <div className="mb-10 animate-fade-up" style={{ animationDelay: "50ms" }}>
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          Generate Preset
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          {profile.songs.artists.name} — {profile.songs.title}
          <span
            className="ml-2 font-medium"
            style={{ color: "var(--accent-gold)" }}
          >
            {profile.name}
          </span>
        </p>
      </div>

      {/* Target Device */}
      <div className="mb-10 animate-fade-up" style={{ animationDelay: "75ms" }}>
        <SectionHeading subtitle="Choose your multi-effects processor">
          Target Device
        </SectionHeading>
        <DeviceSelector
          selectedDeviceId={selectedDeviceId}
          onSelect={(id, device) => {
            setSelectedDeviceId(id);
            setSelectedDevice(device);
          }}
        />
        {selectedDevice && !selectedDevice.is_active && (
          <div
            className="mt-3 p-3 rounded-lg text-sm flex items-center gap-2"
            style={{
              background: "rgba(245, 158, 11, 0.06)",
              border: "1px solid rgba(245, 158, 11, 0.15)",
              color: "#f59e0b",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
              <path d="M8 5v3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              <circle cx="8" cy="11.2" r="0.8" fill="currentColor" />
            </svg>
            <span>
              {selectedDevice.brand} {selectedDevice.model} support is coming soon.
              Preset generation is currently available for Hotone Ampero devices.
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Guitar */}
        <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
          <SectionHeading>Guitar</SectionHeading>
          <div className="space-y-2">
            {guitars.map((g) => (
              <SelectionCard
                key={g.id}
                selected={selectedGuitar === g.id}
                onClick={() => setSelectedGuitar(g.id)}
              >
                <div
                  className="font-medium text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {g.name}
                </div>
                {(g.body_type || g.default_pickup_family) && (
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
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
        <div className="animate-fade-up" style={{ animationDelay: "150ms" }}>
          <SectionHeading>Pickup</SectionHeading>
          <div className="space-y-2">
            {pickups.map((p) => (
              <SelectionCard
                key={p.id}
                selected={selectedPickup === p.id}
                onClick={() => setSelectedPickup(p.id)}
              >
                <span
                  className="font-medium text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {p.name}
                </span>
              </SelectionCard>
            ))}
          </div>

          <div className="mt-6">
            <SectionHeading>Pickup Position</SectionHeading>
            <div className="flex gap-2">
              {PICKUP_POSITIONS.map((pos) => (
                <button
                  key={pos}
                  onClick={() => setSelectedPosition(pos)}
                  className="chip capitalize flex-1 text-center justify-center"
                  style={
                    selectedPosition === pos
                      ? {
                          background: "rgba(212,168,50,0.12)",
                          borderColor: "rgba(212,168,50,0.3)",
                          color: "var(--accent-gold)",
                        }
                      : {}
                  }
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
          <SectionHeading>Output</SectionHeading>
          <div className="space-y-2">
            {outputs.map((o) => (
              <SelectionCard
                key={o.id}
                selected={selectedOutput === o.id}
                onClick={() => setSelectedOutput(o.id)}
              >
                <div
                  className="font-medium text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {o.name}
                </div>
                <div
                  className="text-xs mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Cab {o.cab_should_be_enabled ? "enabled" : "bypassed"}
                </div>
              </SelectionCard>
            ))}
          </div>
        </div>

        {/* Preset Mode */}
        <div className="animate-fade-up" style={{ animationDelay: "250ms" }}>
          <SectionHeading>Preset Mode</SectionHeading>
          <div className="space-y-2">
            {PRESET_MODES.map((m) => (
              <SelectionCard
                key={m.value}
                selected={selectedMode === m.value}
                onClick={() => setSelectedMode(m.value)}
              >
                <div
                  className="font-medium text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {m.label}
                </div>
                <div
                  className="text-xs mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {m.desc}
                </div>
              </SelectionCard>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="mt-12 text-center animate-fade-up" style={{ animationDelay: "300ms" }}>
        {error && (
          <div
            className="glass-static p-4 mb-6 text-sm max-w-md mx-auto"
            style={{
              borderColor: "rgba(239,68,68,0.3)",
              color: "#f87171",
            }}
          >
            {error}
          </div>
        )}
        {selectedDevice && !selectedDevice.is_active ? (
          <div className="space-y-3">
            <div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium"
              style={{
                background: "rgba(12, 18, 28, 0.6)",
                border: "1px solid var(--glass-border)",
                color: "var(--text-muted)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="7" width="10" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              Coming Soon — {selectedDevice.brand} {selectedDevice.model}
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Switch to a supported Hotone Ampero device to generate presets now
            </p>
          </div>
        ) : (
          <GoldButton
            onClick={handleGenerate}
            disabled={
              !selectedGuitar || !selectedPickup || !selectedOutput
            }
            loading={generating}
            className="text-lg px-16 py-4"
          >
            Generate{selectedDevice ? ` ${selectedDevice.preset_extension || ""}` : ""} Preset
          </GoldButton>
        )}
      </div>
    </div>
  );
}
