"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Link2, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ProposedChain, AnalyzeResult } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/SectionHeading";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const CONFIDENCE_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  High: { bg: "rgba(34,197,94,0.10)", color: "#22c55e", border: "rgba(34,197,94,0.20)" },
  Medium: { bg: "rgba(212,168,50,0.10)", color: "hsl(var(--primary))", border: "rgba(212,168,50,0.20)" },
  Low: { bg: "rgba(245,158,11,0.10)", color: "#f59e0b", border: "rgba(245,158,11,0.20)" },
  Speculative: { bg: "rgba(156,163,175,0.10)", color: "#9ca3af", border: "rgba(156,163,175,0.20)" },
};

const BLOCK_ROLE_COLORS: Record<string, string> = {
  amp: "var(--category-amp)",
  cab: "var(--category-cab)",
  overdrive: "var(--category-overdrive)",
  distortion: "var(--category-distortion)",
  fuzz: "var(--category-fuzz)",
  compressor: "var(--category-compressor)",
  eq: "var(--category-eq)",
  modulation: "var(--category-modulation)",
  delay: "var(--category-delay)",
  reverb: "var(--category-reverb)",
  boost: "var(--category-boost)",
  gate: "var(--category-gate)",
  wah: "var(--category-wah)",
};

interface Props {
  songId: string;
}

export function ResearchAnalyzer({ songId }: Props) {
  const [chains, setChains] = useState<ProposedChain[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadChains = useCallback(async () => {
    const { data } = await supabase
      .from("proposed_chains")
      .select("*")
      .eq("song_id", songId)
      .order("created_at", { ascending: false });
    if (data) setChains(data as ProposedChain[]);
  }, [songId]);

  useEffect(() => {
    loadChains();
  }, [loadChains]);

  async function analyze() {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/analyze-song`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": ANON_KEY,
        },
        body: JSON.stringify({ song_id: songId, source_url: url.trim() }),
      });
      const data = await resp.json();
      if (!resp.ok || data.error) {
        setError(data.error || "Analysis failed");
      } else {
        setResult(data as AnalyzeResult);
        await loadChains();
        setUrl("");
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function approveChain(chainId: string) {
    setApproving(chainId);
    try {
      await fetch(`${SUPABASE_URL}/functions/v1/analyze-song`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "apikey": ANON_KEY,
        },
        body: JSON.stringify({ chain_id: chainId, status: "approved" }),
      });
      await loadChains();
    } finally {
      setApproving(null);
    }
  }

  const hasChains = chains.length > 0;

  return (
    <div className="mb-8 animate-fade-up" style={{ animationDelay: "130ms" }}>
      <SectionHeading
        subtitle="Analyze source URLs to extract evidence-backed gear chains"
        action={
          hasChains && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {expanded ? "Collapse" : `${chains.length} chain${chains.length > 1 ? "s" : ""}`}
              {expanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
            </button>
          )
        }
      >
        Research
      </SectionHeading>

      {/* URL Analyzer Input */}
      <Card className="mb-3">
        <CardContent className="pb-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && analyze()}
                placeholder="Paste source URL (Rig Rundown, Equipboard, interview…)"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-md bg-transparent border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>
            <Button
              onClick={analyze}
              disabled={loading || !url.trim()}
              size="sm"
              className="shrink-0 gap-1.5"
            >
              {loading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Search className="size-3.5" />
              )}
              {loading ? "Analyzing…" : "Analyze"}
            </Button>
          </div>

          {error && (
            <div className="mt-2 flex items-start gap-2 text-xs text-red-400">
              <AlertCircle className="size-3.5 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result && !error && (
            <div className="mt-3 pt-3 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <CheckCircle2 className="size-3.5 text-green-500" />
                <span>Found <strong className="text-foreground">{result.extracted_count}</strong> gear mentions</span>
                <span className="mx-1">·</span>
                <span>Confidence: <strong className="text-foreground">{result.confidence_label}</strong> ({result.confidence_score}%)</span>
              </div>
              {result.all_mentions && result.all_mentions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {result.all_mentions.slice(0, 10).map((m, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: m.type ? (BLOCK_ROLE_COLORS[m.type] || "var(--muted-foreground)") : "var(--muted-foreground)",
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: m.type ? (BLOCK_ROLE_COLORS[m.type] || "#666") : "#666" }}
                      />
                      {m.name}
                    </span>
                  ))}
                  {result.all_mentions.length > 10 && (
                    <span className="text-xs text-muted-foreground px-1">+{result.all_mentions.length - 10} more</span>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Proposed Chains */}
      {hasChains && (expanded || chains.length === 1) && (
        <div className="space-y-2">
          {chains.map((chain) => {
            const cs = CONFIDENCE_COLORS[chain.confidence_label] || CONFIDENCE_COLORS.Speculative;
            const isApproved = chain.status === "approved";
            const isDraft = chain.status === "draft";

            return (
              <Card
                key={chain.id}
                className="overflow-hidden"
                style={isApproved ? { borderColor: "rgba(34,197,94,0.25)" } : undefined}
              >
                <CardContent className="pb-3">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded"
                        style={{ background: cs.bg, color: cs.color, border: `1px solid ${cs.border}` }}
                      >
                        {chain.confidence_label} · {Math.round(chain.confidence_score)}%
                      </span>
                      {isApproved && (
                        <span className="flex items-center gap-1 text-xs text-green-500">
                          <CheckCircle2 className="size-3" /> Approved
                        </span>
                      )}
                      {isDraft && (
                        <Badge variant="outline" className="text-xs py-0">Draft</Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(chain.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Chain visual */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    {(chain.chain_json || []).map((block, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: `1px solid ${BLOCK_ROLE_COLORS[block.block_role] || "#666"}40`,
                            color: BLOCK_ROLE_COLORS[block.block_role] || "var(--foreground)",
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: BLOCK_ROLE_COLORS[block.block_role] || "#888" }}
                          />
                          {block.normalized_name}
                          {block.source_count >= 2 && (
                            <span className="opacity-60 text-[10px]">×{block.source_count}</span>
                          )}
                        </div>
                        {i < (chain.chain_json || []).length - 1 && (
                          <span className="text-muted-foreground text-xs">→</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Evidence pills */}
                  {chain.evidence_summary && chain.evidence_summary.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {chain.evidence_summary.slice(0, 6).map((e, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-1.5 py-0.5 rounded text-muted-foreground"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                          {e.gear} <span className="opacity-60">{e.confidence}%</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  {isDraft && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 gap-1.5 border-green-500/30 text-green-500 hover:bg-green-500/10"
                        onClick={() => approveChain(chain.id)}
                        disabled={approving === chain.id}
                      >
                        {approving === chain.id ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <CheckCircle2 className="size-3" />
                        )}
                        Approve Chain
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {chain.chain_json?.length || 0} blocks from source analysis
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Collapsed summary when there are chains but collapsed */}
      {hasChains && !expanded && chains.length > 1 && (
        <button
          onClick={() => setExpanded(true)}
          className="w-full text-xs text-muted-foreground hover:text-foreground text-center py-1.5 transition-colors"
        >
          Show all {chains.length} proposed chains
        </button>
      )}
    </div>
  );
}
