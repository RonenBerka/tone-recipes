"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface Device {
  id: string;
  brand: string;
  model: string;
  slug: string;
  preset_extension: string | null;
  preset_format: string;
  category: string;
  is_active: boolean;
}

interface DeviceSelectorProps {
  selectedDeviceId: string;
  onSelect: (deviceId: string, device: Device) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  compact: "Compact",
  floor: "Floor Units",
  "desktop-rack": "Desktop / Rack",
  budget: "Budget",
};

const CATEGORY_ORDER = ["compact", "floor", "desktop-rack", "budget"];

export function DeviceSelector({ selectedDeviceId, onSelect }: DeviceSelectorProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    supabase
      .from("supported_devices")
      .select("id, brand, model, slug, preset_extension, preset_format, category, is_active")
      .order("display_order")
      .then(({ data }) => {
        if (data) setDevices(data);
      });
  }, []);

  const selected = devices.find((d) => d.id === selectedDeviceId);

  // Group devices by category
  const grouped = CATEGORY_ORDER.reduce<Record<string, Device[]>>((acc, cat) => {
    const devicesInCat = devices.filter((d) => d.category === cat);
    if (devicesInCat.length > 0) acc[cat] = devicesInCat;
    return acc;
  }, {});

  return (
    <div className="relative">
      {/* Selected device button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-left transition-all"
        style={{
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
          boxShadow: "inset 0 1px 0 var(--metallic-shine)",
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Device icon */}
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
            style={{
              background: selected?.is_active
                ? "rgba(212, 168, 50, 0.12)"
                : "rgba(12, 18, 28, 0.6)",
              border: selected?.is_active
                ? "1px solid rgba(212, 168, 50, 0.25)"
                : "1px solid var(--glass-border)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: selected?.is_active ? "var(--accent-gold)" : "var(--text-muted)" }}>
              <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="6" cy="8" r="1.5" stroke="currentColor" strokeWidth="1" />
              <circle cx="10" cy="8" r="1.5" stroke="currentColor" strokeWidth="1" />
              <line x1="4" y1="5.5" x2="12" y2="5.5" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
            </svg>
          </div>
          <div className="truncate">
            <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {selected ? `${selected.brand} ${selected.model}` : "Select device..."}
            </div>
            {selected && (
              <div className="text-[10px]" style={{ color: selected.is_active ? "var(--accent-gold)" : "var(--text-muted)" }}>
                {selected.is_active ? (
                  <>
                    <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ background: "var(--accent-gold)", verticalAlign: "middle" }} />
                    Supported — {selected.preset_extension} export ready
                  </>
                ) : (
                  <>Coming soon{selected.preset_extension ? ` — ${selected.preset_extension}` : ""}</>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Chevron */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          style={{ color: "var(--text-muted)" }}
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Click-away overlay */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div
            className="absolute z-50 left-0 right-0 mt-2 py-2 rounded-xl max-h-80 overflow-y-auto"
            style={{
              background: "rgba(8, 12, 20, 0.97)",
              border: "1px solid rgba(120, 150, 180, 0.15)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(120, 150, 180, 0.05)",
              backdropFilter: "blur(20px)",
            }}
          >
            {Object.entries(grouped).map(([category, devs]) => (
              <div key={category}>
                {/* Category header */}
                <div
                  className="px-4 py-1.5 text-[10px] uppercase tracking-widest font-semibold sticky top-0"
                  style={{ color: "var(--text-muted)", background: "rgba(8, 12, 20, 0.95)" }}
                >
                  {CATEGORY_LABELS[category] || category}
                </div>

                {devs.map((device) => (
                  <button
                    key={device.id}
                    type="button"
                    onClick={() => {
                      onSelect(device.id, device);
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors"
                    style={{
                      background: device.id === selectedDeviceId ? "rgba(212, 168, 50, 0.06)" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (device.id !== selectedDeviceId) e.currentTarget.style.background = "rgba(120, 150, 180, 0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = device.id === selectedDeviceId ? "rgba(212, 168, 50, 0.06)" : "transparent";
                    }}
                  >
                    {/* Active indicator */}
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background: device.is_active ? "var(--accent-gold)" : "rgba(120, 150, 180, 0.2)",
                        boxShadow: device.is_active ? "0 0 6px rgba(212, 168, 50, 0.4)" : "none",
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm" style={{ color: device.is_active ? "var(--text-primary)" : "var(--text-secondary)" }}>
                        <span className="font-medium">{device.brand}</span>{" "}
                        <span style={{ color: device.is_active ? "var(--text-primary)" : "var(--text-muted)" }}>{device.model}</span>
                      </div>
                    </div>
                    {/* Format badge */}
                    {device.preset_extension && (
                      <span
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded flex-shrink-0"
                        style={{
                          background: "rgba(12, 18, 28, 0.6)",
                          border: "1px solid var(--glass-border)",
                          color: "var(--text-muted)",
                        }}
                      >
                        {device.preset_extension}
                      </span>
                    )}
                    {/* Selected check */}
                    {device.id === selectedDeviceId && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0" style={{ color: "var(--accent-gold)" }}>
                        <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
