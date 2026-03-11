"use client";

interface SectionHeadingProps {
  children: React.ReactNode;
  subtitle?: string;
}

export function SectionHeading({ children, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-6">
      <h2 className="flex items-center gap-3">
        <span
          className="h-5 w-1 rounded-full"
          style={{ background: "var(--accent-gold)" }}
        />
        {children}
      </h2>
      {subtitle && (
        <p className="mt-1 ml-4 text-sm" style={{ color: "var(--text-secondary)" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
