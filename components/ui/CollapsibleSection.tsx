"use client";

import { useState } from "react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="overflow-hidden">
        <CollapsibleTrigger className="w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-muted/50 cursor-pointer">
          <span className="font-semibold text-sm">{title}</span>
          <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-200", open && "rotate-180")} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-5 pb-4 border-t border-border">
            {children}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
