"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface UserRequest {
  id: string;
  artist_name_raw: string;
  song_title_raw: string;
  genre: string | null;
  status: string;
  upvote_count: number;
  created_at: string;
}

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  new: {
    label: "New",
    color: "var(--accent-gold)",
    bg: "rgba(212,168,50,0.1)",
  },
  matched_existing: {
    label: "Already Available",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.1)",
  },
  queued_for_research: {
    label: "In Queue",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
  },
  completed: {
    label: "Completed",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.1)",
  },
};

export default function RequestStatusPage() {
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("user_requests")
      .select("id, artist_name_raw, song_title_raw, genre, status, upvote_count, created_at")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) setRequests(data);
        setLoading(false);
      });
  }, []);

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
        <Link
          href="/request"
          className="transition-colors hover:text-[var(--text-primary)]"
        >
          Request
        </Link>
        <span className="mx-2">/</span>
        <span style={{ color: "var(--text-secondary)" }}>Status</span>
      </div>

      {/* Header */}
      <div className="mb-10 animate-fade-up" style={{ animationDelay: "50ms" }}>
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          Request Status
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Recent tone requests from the community.
        </p>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="glass-static p-4 animate-pulse"
              style={{ height: 72 }}
            />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div
          className="glass-static p-8 text-center animate-fade-up"
          style={{ animationDelay: "100ms" }}
        >
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No requests yet. Be the first to{" "}
            <Link
              href="/request"
              className="font-medium"
              style={{ color: "var(--accent-gold)" }}
            >
              request a tone
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {requests.map((r, i) => {
            const style = STATUS_STYLES[r.status] || STATUS_STYLES.new;
            return (
              <div
                key={r.id}
                className="glass-static p-4 flex items-center gap-4 animate-fade-up"
                style={{ animationDelay: `${100 + i * 30}ms` }}
              >
                <div className="flex-1 min-w-0">
                  <div
                    className="font-medium text-sm truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {r.artist_name_raw} — {r.song_title_raw}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {r.genre && (
                      <span
                        className="text-[10px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {r.genre}
                      </span>
                    )}
                    <span
                      className="text-[10px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {r.upvote_count > 1 && (
                  <span
                    className="text-xs font-mono"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {r.upvote_count} votes
                  </span>
                )}
                <span
                  className="text-[10px] uppercase font-semibold tracking-wider px-2.5 py-1 rounded-full flex-shrink-0"
                  style={{ color: style.color, background: style.bg }}
                >
                  {style.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
