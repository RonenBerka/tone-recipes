"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AboutModal } from "./AboutModal";

export function NavBar() {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <nav
        className="sticky top-0 z-50"
        style={{
          borderRadius: 0,
          background: "rgba(8, 12, 18, 0.75)",
          borderBottom: "1px solid var(--glass-border)",
          backdropFilter: "blur(20px) saturate(1.3)",
          WebkitBackdropFilter: "blur(20px) saturate(1.3)",
          boxShadow:
            "inset 0 -1px 0 0 rgba(120, 150, 180, 0.06), 0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <Image
              src="/logo.jpg"
              alt="Tone Recipes"
              width={44}
              height={44}
              className="rounded-md"
              style={{ objectFit: "cover" }}
            />
            <div className="hidden sm:block">
              <div
                className="text-sm font-bold tracking-tight leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                TONE RECIPES
              </div>
              <div
                className="text-[10px] tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Iconic Guitar Tones
              </div>
            </div>
          </Link>
          <span
            className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full hidden sm:inline-block"
            style={{
              background: "rgba(12, 18, 28, 0.6)",
              border: "1px solid var(--glass-border)",
              color: "var(--text-muted)",
              boxShadow: "inset 0 1px 0 0 var(--metallic-shine)",
            }}
          >
            40+ Multi-FX Processors
          </span>
          <div className="flex-1" />

          {/* About trigger */}
          <button
            onClick={() => setAboutOpen(true)}
            className="text-sm font-medium transition-all hover:opacity-100 flex items-center gap-1.5"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-gold)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className="opacity-60"
            >
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
              <path d="M8 7v4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              <circle cx="8" cy="4.8" r="0.8" fill="currentColor" />
            </svg>
            About
          </button>

          <Link
            href="/request"
            className="text-sm font-medium transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            Request a Tone
          </Link>
        </div>
      </nav>

      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
}
