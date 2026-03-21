// Rig Manager — localStorage persistence
// Stores up to 8 tone recipe slots + active slot index

export interface RigSlot {
  tone_profile_id: string;
  saved_at: string;
}

const SLOTS_KEY = "tone_recipes_rig_v1";
const ACTIVE_KEY = "tone_recipes_active_slot_v1";
const SLOT_COUNT = 8;

// ── Read ─────────────────────────────────────────────────────────────────────

export function getRigSlots(): (RigSlot | null)[] {
  if (typeof window === "undefined") return Array(SLOT_COUNT).fill(null);
  try {
    const raw = localStorage.getItem(SLOTS_KEY);
    if (!raw) return Array(SLOT_COUNT).fill(null);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return Array(SLOT_COUNT).fill(null);
    // Pad/trim to SLOT_COUNT
    const result: (RigSlot | null)[] = Array(SLOT_COUNT).fill(null);
    for (let i = 0; i < SLOT_COUNT && i < parsed.length; i++) {
      result[i] = parsed[i] ?? null;
    }
    return result;
  } catch {
    return Array(SLOT_COUNT).fill(null);
  }
}

export function getActiveSlotIndex(): number {
  if (typeof window === "undefined") return -1;
  const raw = localStorage.getItem(ACTIVE_KEY);
  const n = parseInt(raw ?? "-1", 10);
  return isNaN(n) ? -1 : n;
}

// ── Write ─────────────────────────────────────────────────────────────────────

function persist(slots: (RigSlot | null)[]): void {
  localStorage.setItem(SLOTS_KEY, JSON.stringify(slots));
}

export function saveToSlot(slotIndex: number, toneProfileId: string): void {
  if (slotIndex < 0 || slotIndex >= SLOT_COUNT) return;
  const slots = getRigSlots();
  slots[slotIndex] = { tone_profile_id: toneProfileId, saved_at: new Date().toISOString() };
  persist(slots);
}

export function clearSlot(slotIndex: number): void {
  const slots = getRigSlots();
  slots[slotIndex] = null;
  persist(slots);
  // If the active slot was cleared, reset active
  if (getActiveSlotIndex() === slotIndex) {
    localStorage.removeItem(ACTIVE_KEY);
  }
}

export function setActiveSlotIndex(slotIndex: number): void {
  localStorage.setItem(ACTIVE_KEY, String(slotIndex));
}

// ── Import / Export ───────────────────────────────────────────────────────────

export interface RigBundle {
  version: number;
  exported_at: string;
  slots: (RigSlot | null)[];
}

export function exportRigToJson(): void {
  const slots = getRigSlots();
  const bundle: RigBundle = {
    version: 1,
    exported_at: new Date().toISOString(),
    slots,
  };
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `tone_recipes_rig_${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importRigFromJson(jsonStr: string): { ok: boolean; error?: string } {
  try {
    const parsed: RigBundle = JSON.parse(jsonStr);
    if (!parsed.slots || !Array.isArray(parsed.slots)) {
      return { ok: false, error: "Invalid bundle format" };
    }
    const result: (RigSlot | null)[] = Array(SLOT_COUNT).fill(null);
    for (let i = 0; i < SLOT_COUNT && i < parsed.slots.length; i++) {
      result[i] = parsed.slots[i] ?? null;
    }
    persist(result);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: "Could not parse file" };
  }
}
