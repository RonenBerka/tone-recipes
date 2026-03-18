"use client";

import Link from "next/link";
import { ToneProfileListItem } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MiniSignalChain } from "@/components/MiniSignalChain";
import { Download } from "lucide-react";

const GAIN_LABELS: Record<string, string> = {
  "0.3": "Clean",
  "0.5": "Crunch",
  "0.8": "High Gain",
};

function scoreColor(confidence: number) {
  if (confidence >= 85) return "text-green-400 bg-green-400/10 ring-green-400/20";
  if (confidence >= 70) return "text-primary bg-primary/10 ring-primary/20";
  return "text-amber-400 bg-amber-400/10 ring-amber-400/20";
}

export function ToneCard({ profile }: { profile: ToneProfileListItem }) {
  const gainLabel = GAIN_LABELS[String(profile.gain_level)] || "Mid";
  const confidence = Math.round(profile.confidence_score * 100);

  return (
    <Link href={`/tone/${profile.id}`} className="block group">
      <Card className="relative overflow-hidden transition-all hover:ring-primary/20 hover:-translate-y-0.5">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-start">
            <div className="min-w-0 flex-1 mr-3">
              <h3 className="font-semibold text-base tracking-tight truncate">
                {profile.artist_name}
              </h3>
              <p className="text-sm truncate mt-0.5 text-secondary-foreground">
                {profile.song_title}
              </p>
            </div>
            <div
              className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ring-1 ${scoreColor(confidence)}`}
              title="Research Score"
            >
              {confidence}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium mb-2 text-primary">
            {profile.name}
          </p>

          {/* Mini signal chain dots */}
          {profile.block_roles && profile.block_roles.length > 0 && (
            <div className="mb-2.5">
              <MiniSignalChain blocks={profile.block_roles} />
            </div>
          )}

          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="secondary" className="text-[10px] capitalize">
              {profile.section_type}
            </Badge>
            <Badge variant="secondary" className="text-[10px]">
              {gainLabel}
            </Badge>
            {/* Tags — show first 2 */}
            {profile.tags?.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-[9px] text-muted-foreground border-border"
              >
                {tag}
              </Badge>
            ))}
            {profile.tags && profile.tags.length > 2 && (
              <span className="text-[9px] text-muted-foreground">
                +{profile.tags.length - 2}
              </span>
            )}
          </div>

          {/* Bottom row: confidence bar + download count */}
          <div className="flex items-center gap-3 mt-3">
            <div className="confidence-bar flex-1">
              <div className="confidence-bar-fill" style={{ width: `${confidence}%` }} />
            </div>
            {profile.download_count > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground shrink-0">
                <Download size={10} />
                <span className="text-[10px]">{profile.download_count}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
