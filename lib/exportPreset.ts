const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function downloadPrst(
  presetId: string,
  presetName: string
): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/export-preset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ preset_id: presetId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Export failed" }));
    throw new Error(err.error || "Export failed");
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${presetName.replace(/[^a-zA-Z0-9_\- ]/g, "").trim().replace(/\s+/g, "_")}.prst`;
  a.click();
  URL.revokeObjectURL(url);

  // Increment download count (fire-and-forget)
  fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_download_count`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ preset_id: presetId }),
  }).catch(() => {});
}
