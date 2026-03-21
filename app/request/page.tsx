"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { GuitarArchetype } from "@/lib/types";
import { HardwareChassis } from "@/components/HardwareChassis";

const GENRES = ["ROCK", "METAL", "BLUES", "JAZZ", "POP", "COUNTRY", "FUNK", "ALTERNATIVE", "OTHER"];

interface ArtistSuggestion {
  id: string;
  name: string;
  genre: string | null;
}

interface SubmitResult {
  status: "created" | "matched_existing" | "upvoted_existing";
  request_id?: string;
  upvote_count?: number;
  matched_profiles?: { id: string; name: string; song_title: string; artist_name: string }[];
}

function HwInput({ value, onChange, placeholder, type = "text" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full outline-none font-bold uppercase"
      style={{
        background: "#14110f",
        border: "1px solid #221d19",
        padding: "10px 14px",
        color: "#e8dfce",
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 13,
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.6)",
      }}
    />
  );
}

function HwLabel({ children }: { children: React.ReactNode }) {
  return <div className="hw-label mb-2">{children}</div>;
}

export default function RequestPage() {
  const [artistName, setArtistName] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [toneDescription, setToneDescription] = useState("");
  const [selectedGuitar, setSelectedGuitar] = useState("");
  const [guitars, setGuitars] = useState<GuitarArchetype[]>([]);
  const [suggestions, setSuggestions] = useState<ArtistSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState("");

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("guitar_archetypes").select("*").order("name").then(({ data }) => {
      if (data) setGuitars(data);
    });
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const searchArtists = useCallback(async (query: string) => {
    if (query.length < 2) { setSuggestions([]); return; }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/search-artists`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setSuggestions(data.artists || []);
      setShowSuggestions(true);
    } catch { setSuggestions([]); }
  }, []);

  const handleArtistChange = (value: string) => {
    setArtistName(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchArtists(value), 300);
  };

  const handleSubmit = async () => {
    if (!artistName.trim() || !songTitle.trim()) return;
    setSubmitting(true);
    setError("");
    setResult(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/submit-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          artist_name_raw: artistName.trim(),
          song_title_raw: songTitle.trim(),
          genre: genre || null,
          reference_url: referenceUrl || null,
          tone_description: toneDescription || null,
          guitar_archetype_id: selectedGuitar || null,
        }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch { setError("Failed to submit request. Please try again."); }
    finally { setSubmitting(false); }
  };

  // Success state
  if (result) {
    return (
      <HardwareChassis displayLabel="SYSTEM //" title="REQUEST SUBMITTED">
        <div className="hw-screen flex flex-col items-center gap-6 py-10 text-center">
          <div className="text-2xl font-black uppercase" style={{ color: "#111" }}>
            {result.status === "matched_existing" ? "ALREADY AVAILABLE" :
             result.status === "upvoted_existing" ? "+1 UPVOTED" : "REQUEST LOGGED"}
          </div>
          {result.status === "matched_existing" && result.matched_profiles && (
            <div className="w-full max-w-sm flex flex-col gap-2">
              {result.matched_profiles.map((p) => (
                <Link key={p.id} href={`/tone/${p.id}`}
                  className="flex flex-col p-3 text-left"
                  style={{ background: "rgba(0,0,0,0.1)", border: "1px solid rgba(0,0,0,0.2)" }}>
                  <div className="font-black text-[12px] uppercase" style={{ color: "#111" }}>
                    {p.artist_name} — {p.song_title}
                  </div>
                  <div className="text-[10px] font-bold" style={{ color: "#444" }}>{p.name}</div>
                </Link>
              ))}
            </div>
          )}
          {result.status === "upvoted_existing" && (
            <div className="text-[12px] font-bold uppercase" style={{ color: "#333" }}>
              {result.upvote_count} TOTAL VOTE{result.upvote_count !== 1 ? "S" : ""}
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => setResult(null)}
              className="text-[11px] font-black uppercase px-6 py-3"
              style={{ background: "#b84729", color: "#fff", border: "2px solid #111", boxShadow: "0 3px 0 #000" }}>
              SUBMIT ANOTHER
            </button>
            <Link href="/">
              <button className="hw-mode-btn" style={{ padding: "12px 20px", width: "auto" }}>
                BACK TO CATALOG
              </button>
            </Link>
          </div>
        </div>
      </HardwareChassis>
    );
  }

  return (
    <HardwareChassis displayLabel="SYSTEM //" title="REQUEST A TONE">
      {/* Rack title */}
      <div className="hw-rack p-4">
        <div className="text-xl font-black uppercase" style={{ color: "#e8dfce", textShadow: "2px 2px 0 rgba(0,0,0,0.9)" }}>
          REQUEST A TONE
        </div>
        <div className="text-[11px] font-bold mt-1" style={{ color: "#968a7c" }}>
          CAN&apos;T FIND THE TONE YOU&apos;RE LOOKING FOR? LOG A REQUEST AND WE&apos;LL ADD IT.
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Artist */}
        <div>
          <HwLabel>ARTIST *</HwLabel>
          <div className="relative" ref={suggestionsRef}>
            <HwInput value={artistName} onChange={handleArtistChange} placeholder="E.G. JIMI HENDRIX"
              />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-20 flex flex-col"
                style={{ background: "#14110f", border: "1px solid #221d19", boxShadow: "0 8px 24px rgba(0,0,0,0.6)" }}>
                {suggestions.map((s) => (
                  <button key={s.id} onClick={() => {
                    setArtistName(s.name);
                    if (s.genre && !genre) setGenre(s.genre.toUpperCase());
                    setShowSuggestions(false);
                  }}
                    className="px-4 py-2.5 text-left text-[12px] font-bold uppercase"
                    style={{ color: "#e8dfce", borderBottom: "1px solid #221d19" }}>
                    {s.name}
                    {s.genre && <span className="ml-2 text-[10px]" style={{ color: "#968a7c" }}>{s.genre}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Song */}
        <div>
          <HwLabel>SONG *</HwLabel>
          <HwInput value={songTitle} onChange={setSongTitle} placeholder="E.G. PURPLE HAZE" />
        </div>

        {/* Genre */}
        <div className="md:col-span-2">
          <HwLabel>GENRE</HwLabel>
          <div className="flex flex-wrap gap-1.5">
            {GENRES.map((g) => (
              <button key={g} onClick={() => setGenre(genre === g ? "" : g)}
                className="hw-mode-btn"
                style={{
                  padding: "6px 14px", width: "auto",
                  ...(genre === g ? { background: "#e08b26", color: "#111", borderColor: "#000" } : {})
                }}>
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Reference URL */}
        <div className="md:col-span-2">
          <HwLabel>REFERENCE LINK (OPTIONAL)</HwLabel>
          <HwInput value={referenceUrl} onChange={setReferenceUrl}
            placeholder="YOUTUBE OR SPOTIFY LINK" type="url" />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <HwLabel>TONE DESCRIPTION</HwLabel>
          <textarea
            value={toneDescription}
            onChange={(e) => setToneDescription(e.target.value)}
            placeholder="CRUNCHY RHYTHM TONE FROM THE VERSE / SMOOTH SINGING LEAD WITH VIBRATO..."
            rows={3}
            className="w-full outline-none font-bold uppercase resize-none"
            style={{
              background: "#14110f", border: "1px solid #221d19",
              padding: "10px 14px", color: "#e8dfce",
              fontFamily: "'Courier New', Courier, monospace", fontSize: 12,
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.6)",
            }}
          />
        </div>

        {/* Guitar */}
        <div className="md:col-span-2">
          <HwLabel>YOUR GUITAR (OPTIONAL)</HwLabel>
          <div className="flex flex-wrap gap-1.5">
            {guitars.map((g) => (
              <button key={g.id} onClick={() => setSelectedGuitar(selectedGuitar === g.id ? "" : g.id)}
                className="hw-mode-btn"
                style={{
                  padding: "6px 14px", width: "auto",
                  ...(selectedGuitar === g.id ? { background: "#e08b26", color: "#111", borderColor: "#000" } : {})
                }}>
                {g.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="text-[11px] font-bold uppercase p-3 text-center"
          style={{ background: "rgba(184,71,41,0.15)", border: "1px solid rgba(184,71,41,0.4)", color: "#b84729" }}>
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-between items-center pt-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <Link href="/" className="text-[10px] font-bold uppercase tracking-[0.12em] hover:opacity-70"
          style={{ color: "#968a7c" }}>
          ← BACK TO CATALOG
        </Link>
        <button
          onClick={handleSubmit}
          disabled={!artistName.trim() || !songTitle.trim() || submitting}
          className="text-[12px] font-black uppercase tracking-[0.1em] px-10 py-3"
          style={{
            background: (!artistName.trim() || !songTitle.trim() || submitting) ? "#2e130d" : "#b84729",
            color: (!artistName.trim() || !songTitle.trim() || submitting) ? "#968a7c" : "#fff",
            border: "2px solid #111",
            boxShadow: "0 3px 0 #000, inset 0 2px 0 rgba(255,255,255,0.2)",
            cursor: (!artistName.trim() || !songTitle.trim() || submitting) ? "not-allowed" : "pointer",
          }}>
          {submitting ? "SUBMITTING..." : "SUBMIT REQUEST"}
        </button>
      </div>
    </HardwareChassis>
  );
}
