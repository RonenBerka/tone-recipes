"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { GuitarArchetype } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GoldButton } from "@/components/ui/GoldButton";

const GENRES = [
  "Rock",
  "Metal",
  "Blues",
  "Jazz",
  "Pop",
  "Country",
  "Funk",
  "Alternative",
  "Other",
];

interface ArtistSuggestion {
  id: string;
  name: string;
  genre: string | null;
}

interface SubmitResult {
  status: "created" | "matched_existing" | "upvoted_existing";
  request_id?: string;
  upvote_count?: number;
  matched_profiles?: {
    id: string;
    name: string;
    song_title: string;
    artist_name: string;
  }[];
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
    supabase
      .from("guitar_archetypes")
      .select("*")
      .order("name")
      .then(({ data }) => {
        if (data) setGuitars(data);
      });
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const searchArtists = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token =
        session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/search-artists`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ query }),
        }
      );
      const data = await res.json();
      setSuggestions(data.artists || []);
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
    }
  }, []);

  const handleArtistChange = (value: string) => {
    setArtistName(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchArtists(value), 300);
  };

  const selectSuggestion = (artist: ArtistSuggestion) => {
    setArtistName(artist.name);
    if (artist.genre && !genre) setGenre(artist.genre);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleSubmit = async () => {
    if (!artistName.trim() || !songTitle.trim()) return;
    setSubmitting(true);
    setError("");
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token =
        session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/submit-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            artist_name_raw: artistName.trim(),
            song_title_raw: songTitle.trim(),
            genre: genre || null,
            reference_url: referenceUrl || null,
            tone_description: toneDescription || null,
            guitar_archetype_id: selectedGuitar || null,
          }),
        }
      );

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch {
      setError("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = artistName.trim().length > 0 && songTitle.trim().length > 0;

  // Success state
  if (result) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          <Link
            href="/"
            className="transition-colors hover:text-[var(--text-primary)]"
          >
            Library
          </Link>
          <span className="mx-2">/</span>
          <span style={{ color: "var(--text-secondary)" }}>Request</span>
        </div>

        <div
          className="glass-static p-8 text-center animate-fade-up"
        >
          {result.status === "matched_existing" && (
            <>
              <div
                className="text-4xl mb-4"
                style={{ color: "var(--accent-gold)" }}
              >
                Already Available
              </div>
              <p
                className="text-sm mb-6"
                style={{ color: "var(--text-secondary)" }}
              >
                We already have tone profiles matching your request:
              </p>
              <div className="space-y-2 mb-6">
                {result.matched_profiles?.map((p) => (
                  <Link
                    key={p.id}
                    href={`/tone/${p.id}`}
                    className="block glass-static p-3 text-left transition-all hover:border-[rgba(212,168,50,0.3)]"
                  >
                    <div
                      className="font-medium text-sm"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {p.artist_name} — {p.song_title}
                    </div>
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: "var(--accent-gold)" }}
                    >
                      {p.name}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {result.status === "upvoted_existing" && (
            <>
              <div
                className="text-4xl mb-4"
                style={{ color: "var(--accent-gold)" }}
              >
                +1 Upvoted
              </div>
              <p
                className="text-sm mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Someone already requested this tone. Your vote has been counted!
              </p>
              <p
                className="text-xs mb-6"
                style={{ color: "var(--text-muted)" }}
              >
                {result.upvote_count} total vote
                {result.upvote_count !== 1 ? "s" : ""}
              </p>
            </>
          )}

          {result.status === "created" && (
            <>
              <div
                className="text-4xl mb-4"
                style={{ color: "var(--accent-gold)" }}
              >
                Request Submitted
              </div>
              <p
                className="text-sm mb-6"
                style={{ color: "var(--text-secondary)" }}
              >
                We&apos;ve logged your request for{" "}
                <strong>{artistName}</strong> — {songTitle}. We&apos;ll work on
                adding it to the library.
              </p>
            </>
          )}

          <GoldButton onClick={() => setResult(null)}>
            Submit Another
          </GoldButton>
          <div className="mt-3">
            <Link
              href="/"
              className="text-xs transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              Back to Library
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
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
        <span style={{ color: "var(--text-secondary)" }}>Request a Tone</span>
      </div>

      {/* Header */}
      <div className="mb-10 animate-fade-up" style={{ animationDelay: "50ms" }}>
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          Request a Tone
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Can&apos;t find the tone you&apos;re looking for? Tell us what you
          want and we&apos;ll add it to the library.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-8">
        {/* Artist + Song */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-up"
          style={{ animationDelay: "100ms" }}
        >
          <div>
            <SectionHeading>Artist *</SectionHeading>
            <div className="relative" ref={suggestionsRef}>
              <input
                type="text"
                value={artistName}
                onChange={(e) => handleArtistChange(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                placeholder="e.g. Jimi Hendrix"
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
                style={{
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--text-primary)",
                }}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div
                  className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden z-20"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--glass-border)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  }}
                >
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => selectSuggestion(s)}
                      className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[rgba(212,168,50,0.08)]"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {s.name}
                      {s.genre && (
                        <span
                          className="ml-2 text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {s.genre}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <SectionHeading>Song *</SectionHeading>
            <input
              type="text"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              placeholder="e.g. Purple Haze"
              className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
              style={{
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </div>

        {/* Genre */}
        <div className="animate-fade-up" style={{ animationDelay: "150ms" }}>
          <SectionHeading>Genre</SectionHeading>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setGenre(genre === g ? "" : g)}
                className="chip"
                style={
                  genre === g
                    ? {
                        background: "rgba(212,168,50,0.12)",
                        borderColor: "rgba(212,168,50,0.3)",
                        color: "var(--accent-gold)",
                      }
                    : {}
                }
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Reference URL */}
        <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
          <SectionHeading>Reference Link</SectionHeading>
          <input
            type="url"
            value={referenceUrl}
            onChange={(e) => setReferenceUrl(e.target.value)}
            placeholder="YouTube or Spotify link (optional)"
            className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        {/* Tone Description */}
        <div className="animate-fade-up" style={{ animationDelay: "250ms" }}>
          <SectionHeading>Tone Description</SectionHeading>
          <textarea
            value={toneDescription}
            onChange={(e) => setToneDescription(e.target.value)}
            placeholder="Describe the tone you're looking for — e.g. &quot;crunchy rhythm tone from the verse&quot;, &quot;smooth singing lead with vibrato&quot;"
            rows={3}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors resize-none"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        {/* Guitar */}
        <div className="animate-fade-up" style={{ animationDelay: "300ms" }}>
          <SectionHeading>Your Guitar (optional)</SectionHeading>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {guitars.map((g) => (
              <button
                key={g.id}
                onClick={() =>
                  setSelectedGuitar(selectedGuitar === g.id ? "" : g.id)
                }
                className="p-3 rounded-lg text-left transition-all duration-150"
                style={{
                  background:
                    selectedGuitar === g.id
                      ? "rgba(212,168,50,0.08)"
                      : "var(--glass-bg)",
                  border:
                    selectedGuitar === g.id
                      ? "1px solid rgba(212,168,50,0.3)"
                      : "1px solid var(--glass-border)",
                }}
              >
                <div
                  className="font-medium text-xs"
                  style={{
                    color:
                      selectedGuitar === g.id
                        ? "var(--accent-gold)"
                        : "var(--text-primary)",
                  }}
                >
                  {g.name}
                </div>
                <div
                  className="text-[10px] mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {g.body_type}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div
          className="text-center pt-4 animate-fade-up"
          style={{ animationDelay: "350ms" }}
        >
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
          <GoldButton
            onClick={handleSubmit}
            disabled={!canSubmit}
            loading={submitting}
            className="text-lg px-16 py-4"
          >
            Submit Request
          </GoldButton>
        </div>
      </div>
    </div>
  );
}
