"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

interface Stats {
  profiles: number;
  songs: number;
  artists: number;
}

export function AboutModal({ open, onClose }: AboutModalProps) {
  const [stats, setStats] = useState<Stats>({ profiles: 0, songs: 0, artists: 0 });

  useEffect(() => {
    if (open) {
      Promise.all([
        supabase.from("tone_profiles").select("id", { count: "exact", head: true }),
        supabase.from("songs").select("id", { count: "exact", head: true }),
        supabase.from("artists").select("id", { count: "exact", head: true }),
      ]).then(([profilesRes, songsRes, artistsRes]) => {
        setStats({
          profiles: profilesRes.count ?? 0,
          songs: songsRes.count ?? 0,
          artists: artistsRes.count ?? 0,
        });
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto bg-card">
        <DialogHeader className="text-center">
          <Badge variant="outline" className="mx-auto mb-3 border-primary/30 text-primary text-[10px] uppercase tracking-[0.25em]">
            About Tone Recipes
          </Badge>
          <DialogTitle className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Professional Guitar Tones, Reverse-Engineered
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed max-w-xl mx-auto">
            We build research-backed tone profiles for iconic guitar songs — every amp,
            pedal, and setting mapped to your multi-effects processor.
          </DialogDescription>
        </DialogHeader>

        {/* Live Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: stats.profiles, label: "Tone Profiles" },
            { value: stats.songs, label: "Songs" },
            { value: stats.artists, label: "Artists" },
          ].map((stat) => (
            <div key={stat.label} className="text-center py-4 rounded-xl bg-background/50 ring-1 ring-border">
              <div className="text-2xl sm:text-3xl font-bold tabular-nums text-primary">
                {stat.value > 0 ? stat.value.toLocaleString() : "—"}
              </div>
              <div className="text-[10px] uppercase tracking-wider mt-1 text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Three Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              src: "/about-pillar-research.jpg",
              alt: "Research-Backed",
              title: "Research-Backed",
              desc: "Sourced from rig diagrams, artist interviews, gear databases, and real preset analysis.",
            },
            {
              src: "/about-pillar-chains.jpg",
              alt: "Professional Signal Chains",
              title: "Professional Chains",
              desc: "9-block average signal chains built to studio standards — comp, drive, amp, cab, EQ, mod, delay, reverb.",
            },
            {
              src: "/about-pillar-export.jpg",
              alt: "Export-Ready Presets",
              title: "Export-Ready",
              desc: "Confidence scores, fidelity ratings, and one-click preset export for 40+ multi-effects processors.",
            },
          ].map((pillar) => (
            <div key={pillar.title} className="flex flex-col items-center text-center p-5 rounded-xl ring-1 ring-border bg-background/40 transition-all hover:scale-[1.02]">
              <div className="w-32 h-32 relative mb-4 flex-shrink-0 rounded-xl overflow-hidden">
                <Image src={pillar.src} alt={pillar.alt} width={400} height={400} className="object-cover w-full h-full" />
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(10,14,22,0.85)_80%,rgba(10,14,22,1)_100%)]" />
              </div>
              <h3 className="text-sm font-semibold mb-2">{pillar.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{pillar.desc}</p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Process Timeline */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest mb-5 text-center text-muted-foreground">Our Process</h3>
          <div className="relative">
            <div className="hidden sm:block absolute top-6 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { step: "01", title: "Research", desc: "Rig diagrams, interviews, gear databases" },
                { step: "02", title: "Map", desc: "Match gear to canonical models" },
                { step: "03", title: "Validate", desc: "13-rule quality check on every profile" },
                { step: "04", title: "Build", desc: "One-click preset export for your device" },
              ].map((item) => (
                <div key={item.step} className="text-center relative">
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-sm font-bold relative z-10 bg-primary/10 ring-1 ring-primary/30 text-primary">
                    {item.step}
                  </div>
                  <div className="text-xs font-semibold mb-1">{item.title}</div>
                  <div className="text-[10px] leading-relaxed text-muted-foreground">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* CTA */}
        <div className="text-center pb-2">
          <p className="text-sm mb-4 text-muted-foreground">Don&apos;t see your song?</p>
          <a href="/request" onClick={onClose}>
            <Button className="gap-2">
              Request a Tone
              <ArrowRight className="size-4" />
            </Button>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
