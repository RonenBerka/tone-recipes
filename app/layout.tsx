import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import { NavBar } from "@/components/NavBar";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Tone Recipes — Guitar Tone Presets for Multi-Effects Processors",
  description: "Convert iconic guitar tones into device-specific presets for 40+ multi-effects processors.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${inter.variable} antialiased min-h-screen`}>
        <TooltipProvider>
          <NavBar />
          <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
        </TooltipProvider>
      </body>
    </html>
  );
}
