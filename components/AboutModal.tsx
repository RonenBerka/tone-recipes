"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

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
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      // Fetch live stats
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

      // Lock body scroll
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 280);
  };

  if (!open && !closing) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${
          closing ? "opacity-0" : "opacity-100"
        }`}
        style={{ background: "rgba(2, 4, 8, 0.80)", backdropFilter: "blur(8px)" }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-8 transition-all duration-300 ${
          closing
            ? "opacity-0 translate-y-4 scale-[0.97]"
            : "opacity-100 translate-y-0 scale-100"
        }`}
      >
        <div
          className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl"
          style={{
            background: "linear-gradient(170deg, rgba(10, 14, 22, 0.95), rgba(6, 10, 16, 0.98))",
            border: "1px solid rgba(120, 150, 180, 0.12)",
            boxShadow:
              "0 0 80px rgba(212, 168, 50, 0.06), 0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(200, 215, 230, 0.06)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:scale-110"
            style={{
              background: "rgba(12, 18, 28, 0.6)",
              border: "1px solid var(--glass-border)",
              color: "var(--text-secondary)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <div className="p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-10">
              <div
                className="inline-block text-[10px] font-semibold uppercase tracking-[0.25em] px-3 py-1.5 rounded-full mb-5"
                style={{
                  background: "rgba(212, 168, 50, 0.08)",
                  border: "1px solid rgba(212, 168, 50, 0.2)",
                  color: "var(--accent-gold)",
                }}
              >
                About Tone Recipes
              </div>
              <h2
                className="text-2xl sm:text-3xl font-bold tracking-tight mb-3"
                style={{
                  background: "linear-gradient(135deg, var(--text-primary) 30%, var(--accent-gold) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Professional Guitar Tones,
                <br />
                Reverse-Engineered
              </h2>
              <p className="text-sm leading-relaxed max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
                We build research-backed tone profiles for iconic guitar songs — every amp,
                pedal, and setting mapped to your multi-effects processor.
              </p>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-3 gap-3 mb-10">
              {[
                { value: stats.profiles, label: "Tone Profiles" },
                { value: stats.songs, label: "Songs" },
                { value: stats.artists, label: "Artists" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center py-4 rounded-xl"
                  style={{
                    background: "rgba(12, 18, 28, 0.5)",
                    border: "1px solid var(--glass-border)",
                    boxShadow: "inset 0 1px 0 var(--metallic-shine)",
                  }}
                >
                  <div
                    className="text-2xl sm:text-3xl font-bold tabular-nums"
                    style={{ color: "var(--accent-gold)" }}
                  >
                    {stat.value > 0 ? stat.value.toLocaleString() : "—"}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: "var(--text-muted)" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Three Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                {
                  src: "/about-pillar-research.jpg",
                  alt: "Research-Backed",
                  title: "Research-Backed",
                  desc: "Sourced from rig diagrams, artist interviews, gear databases, and real preset analysis. Every tone is cross-referenced.",
                },
                {
                  src: "/about-pillar-chains.jpg",
                  alt: "Professional Signal Chains",
                  title: "Professional Chains",
                  desc: "9-block average signal chains built to studio standards — comp, drive, amp, cab, EQ, modulation, dual delay, reverb.",
                },
                {
                  src: "/about-pillar-export.jpg",
                  alt: "Export-Ready Presets",
                  title: "Export-Ready",
                  desc: "Confidence scores, fidelity ratings, and one-click preset export for 40+ multi-effects processors.",
                },
              ].map((pillar) => (
                <div
                  key={pillar.title}
                  className="flex flex-col items-center text-center p-5 rounded-xl transition-all hover:scale-[1.02]"
                  style={{
                    background: "rgba(12, 18, 28, 0.4)",
                    border: "1px solid var(--glass-border)",
                  }}
                >
                  {/* 1:1 image container — uniform size, dark radial mask to blend edges */}
                  <div
                    className="w-32 h-32 relative mb-4 flex-shrink-0 rounded-xl overflow-hidden"
                    style={{ aspectRatio: "1 / 1" }}
                  >
                    <Image
                      src={pillar.src}
                      alt={pillar.alt}
                      width={400}
                      height={400}
                      className="object-cover w-full h-full"
                    />
                    {/* Radial vignette to blend checkered bg into card */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: "radial-gradient(circle at center, transparent 40%, rgba(10, 14, 22, 0.85) 80%, rgba(10, 14, 22, 1) 100%)",
                      }}
                    />
                  </div>
                  <h3
                    className="text-sm font-semibold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {pillar.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Process Timeline */}
            <div className="mb-10">
              <h3
                className="text-xs font-semibold uppercase tracking-widest mb-5 text-center"
                style={{ color: "var(--text-muted)" }}
              >
                Our Process
              </h3>
              <div className="relative">
                {/* Gold connecting line */}
                <div
                  className="hidden sm:block absolute top-6 left-[12%] right-[12%] h-px"
                  style={{
                    background: "linear-gradient(90deg, transparent, var(--accent-gold-dim), var(--accent-gold), var(--accent-gold-dim), transparent)",
                  }}
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    {
                      step: "01",
                      title: "Research",
                      desc: "Rig diagrams, interviews, gear databases",
                    },
                    {
                      step: "02",
                      title: "Map",
                      desc: "Match gear to Ampero canonical models",
                    },
                    {
                      step: "03",
                      title: "Validate",
                      desc: "13-rule quality check on every profile",
                    },
                    {
                      step: "04",
                      title: "Build",
                      desc: "One-click preset export for your device",
                    },
                  ].map((item) => (
                    <div key={item.step} className="text-center relative">
                      <div
                        className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-sm font-bold relative z-10"
                        style={{
                          background: "linear-gradient(135deg, rgba(212, 168, 50, 0.15), rgba(212, 168, 50, 0.05))",
                          border: "1px solid rgba(212, 168, 50, 0.3)",
                          color: "var(--accent-gold)",
                          boxShadow: "0 0 20px rgba(212, 168, 50, 0.08)",
                        }}
                      >
                        {item.step}
                      </div>
                      <div
                        className="text-xs font-semibold mb-1"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.title}
                      </div>
                      <div
                        className="text-[10px] leading-relaxed"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <div
                className="inline-block h-px w-16 mb-6"
                style={{
                  background: "linear-gradient(90deg, transparent, var(--glass-border), transparent)",
                }}
              />
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                Don&apos;t see your song?
              </p>
              <a
                href="/request"
                onClick={handleClose}
                className="btn-gold inline-flex items-center gap-2 text-sm"
              >
                Request a Tone
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
