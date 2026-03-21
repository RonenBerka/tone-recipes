"use client";

interface SectionHeadingProps {
  children: React.ReactNode;
  subtitle?: string;
  action?: React.ReactNode;
}

export function SectionHeading({ children, subtitle, action }: SectionHeadingProps) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2.5">
          <span className="h-4 w-0.5 rounded-full bg-[var(--accent-gold)]" />
          {children}
        </h2>
        {action && <div>{action}</div>}
      </div>
      {subtitle && (
        <p className="mt-1 ml-3 text-sm text-[var(--text-secondary)]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
