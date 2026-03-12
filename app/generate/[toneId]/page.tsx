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
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
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
      className={`w-full text-left transition-all duration-150 group/card flex flex-col overflow-hidden rounded-xl bg-card py-3 px-4 text-sm text-card-foreground ring-1 ${
        selected
          ? "ring-primary/30 bg-primary/5 shadow-[0_0_12px_rgba(212,168,50,0.08)]"
          : "ring-foreground/10"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Radio indicator */}
        <div
          className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center border-2 ${
            selected ? "border-primary" : "border-muted-foreground"
          }`}
        >
          {selected && (
            <div className="w-2 h-2 rounded-full bg-primary" />
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
      <div className="text-sm mb-6 animate-fade-up text-muted-foreground">
        <Link
          href="/"
          className="transition-colors hover:text-foreground"
        >
          Library
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/tone/${toneId}`}
          className="transition-colors hover:text-foreground"
        >
          {profile.songs.artists.name} — {profile.songs.title}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-muted-foreground">Generate</span>
      </div>

      {/* Header */}
      <div className="mb-10 animate-fade-up" style={{ animationDelay: "50ms" }}>
        <h1 className="text-3xl font-bold tracking-tight mb-1 text-foreground">
          Generate Preset
        </h1>
        <p className="text-muted-foreground">
          {profile.songs.artists.name} — {profile.songs.title}
          <span className="ml-2 font-medium text-primary">
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
          <Card className="mt-3 border-amber-500/15 bg-amber-500/5">
            <CardContent className="flex items-center gap-2 text-sm text-amber-500">
              <AlertCircle className="size-4 flex-shrink-0" />
              <span>
                {selectedDevice.brand} {selectedDevice.model} support is coming soon.
                Preset generation is currently available for Hotone Ampero devices.
              </span>
            </CardContent>
          </Card>
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
                <div className="font-medium text-sm text-foreground">
                  {g.name}
                </div>
                {(g.body_type || g.default_pickup_family) && (
                  <div className="text-xs mt-0.5 text-muted-foreground">
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
                <span className="font-medium text-sm text-foreground">
                  {p.name}
                </span>
              </SelectionCard>
            ))}
          </div>

          <div className="mt-6">
            <SectionHeading>Pickup Position</SectionHeading>
            <div className="flex gap-2">
              {PICKUP_POSITIONS.map((pos) => (
                <Toggle
                  key={pos}
                  variant="outline"
                  pressed={selectedPosition === pos}
                  onPressedChange={() => setSelectedPosition(pos)}
                  className="flex-1 capitalize justify-center"
                  aria-label={`${pos} pickup position`}
                >
                  {pos}
                </Toggle>
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
                <div className="font-medium text-sm text-foreground">
                  {o.name}
                </div>
                <div className="text-xs mt-0.5 text-muted-foreground">
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
                <div className="font-medium text-sm text-foreground">
                  {m.label}
                </div>
                <div className="text-xs mt-0.5 text-muted-foreground">
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
          <Card className="mb-6 max-w-md mx-auto border-destructive/30">
            <CardContent className="text-sm text-destructive">
              {error}
            </CardContent>
          </Card>
        )}
        {selectedDevice && !selectedDevice.is_active ? (
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium bg-muted/60 ring-1 ring-foreground/10 text-muted-foreground">
              <Lock className="size-4" />
              Coming Soon — {selectedDevice.brand} {selectedDevice.model}
            </div>
            <p className="text-xs text-muted-foreground">
              Switch to a supported Hotone Ampero device to generate presets now
            </p>
          </div>
        ) : (
          <Button
            onClick={handleGenerate}
            disabled={
              !selectedGuitar || !selectedPickup || !selectedOutput || generating
            }
            size="lg"
            className="text-lg px-16 py-4 h-auto"
          >
            {generating ? "Generating..." : `Generate${selectedDevice ? ` ${selectedDevice.preset_extension || ""}` : ""} Preset`}
          </Button>
        )}
      </div>
    </div>
  );
}
