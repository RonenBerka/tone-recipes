"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AboutModal } from "./AboutModal";

export function NavBar() {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(9,9,11,0.85)] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <Image
              src="/logo.jpg"
              alt="Tone Recipes"
              width={40}
              height={40}
              className="rounded-lg"
              style={{ objectFit: "cover" }}
            />
            <div className="hidden sm:block">
              <div className="text-sm font-bold tracking-tight leading-tight text-[var(--text-primary)]">
                TONE RECIPES
              </div>
              <div className="text-[10px] tracking-wider text-[var(--text-muted)]">
                Iconic Guitar Tones
              </div>
            </div>
          </Link>

          <div className="flex-1" />

          {/* About trigger */}
          <button
            onClick={() => setAboutOpen(true)}
            className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors flex items-center gap-1.5"
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
            className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Request a Tone
          </Link>
        </div>
      </nav>

      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
}
