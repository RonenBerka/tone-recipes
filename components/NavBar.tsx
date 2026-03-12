"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AboutModal } from "./AboutModal";
import { Info } from "lucide-react";

export function NavBar() {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
            <Image src="/logo.jpg" alt="Tone Recipes" width={40} height={40} className="rounded-lg object-cover" />
            <div className="hidden sm:block">
              <div className="text-sm font-bold tracking-tight leading-tight text-foreground">TONE RECIPES</div>
              <div className="text-[10px] tracking-wider text-muted-foreground">Iconic Guitar Tones</div>
            </div>
          </Link>

          <div className="flex-1" />

          <Button variant="ghost" size="sm" onClick={() => setAboutOpen(true)} className="gap-1.5 text-muted-foreground hover:text-primary">
            <Info className="size-3.5 opacity-60" />
            About
          </Button>

          <Link href="/request">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Request a Tone
            </Button>
          </Link>
        </div>
      </nav>

      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
}
