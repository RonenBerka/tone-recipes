"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS = [
  { value: "confidence", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "artist", label: "A-Z Artist" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export function SortDropdown({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (val: SortKey) => void;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortKey)}>
      <SelectTrigger className="w-[160px] h-8 text-xs bg-card border-border">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="text-xs">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
